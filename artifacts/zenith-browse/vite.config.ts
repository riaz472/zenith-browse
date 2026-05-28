import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

// Headers that prevent iframe embedding — strip them from proxied responses
const STRIP_HEADERS = new Set([
  "x-frame-options",
  "content-security-policy",
  "content-security-policy-report-only",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
]);

// Script injected into every proxied page: reroutes link clicks through proxy
// so navigation stays in-app instead of hitting X-Frame-Options on the raw site.
function buildLinkInterceptScript(proxyBase: string): string {
  return `<script>(function(){
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      var abs = new URL(href, document.baseURI || window.location.href).href;
      if (abs.startsWith('http://') || abs.startsWith('https://')) {
        e.preventDefault();
        window.location.href = '${proxyBase}?url=' + encodeURIComponent(abs);
      }
    } catch(err) {}
  }, true);
})();</script>`;
}

function zenithProxyPlugin(): Plugin {
  return {
    name: "zenith-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url ?? "";
        const urlPath = rawUrl.split("?")[0];

        // Match /zenith-proxy (with or without base path prefix)
        if (!urlPath.endsWith("/zenith-proxy")) {
          next();
          return;
        }

        const qs = new URLSearchParams(rawUrl.split("?")[1] ?? "");
        const targetUrl = qs.get("url");

        if (!targetUrl) {
          res.statusCode = 400;
          res.end("Missing url parameter");
          return;
        }

        // Basic SSRF protection
        let parsed: URL;
        try {
          parsed = new URL(targetUrl);
        } catch {
          res.statusCode = 400;
          res.end("Invalid URL");
          return;
        }

        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          res.statusCode = 400;
          res.end("Only http/https URLs allowed");
          return;
        }

        const host = parsed.hostname.toLowerCase();
        if (
          host === "localhost" ||
          host === "0.0.0.0" ||
          host === "127.0.0.1" ||
          host === "::1" ||
          host.endsWith(".local") ||
          host.endsWith(".internal") ||
          /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)
        ) {
          res.statusCode = 400;
          res.end("Private addresses not allowed");
          return;
        }

        try {
          const upstream = await fetch(targetUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
              "Cache-Control": "no-cache",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(12000),
          });

          // Forward safe headers, strip embedding-blockers
          for (const [key, value] of upstream.headers.entries()) {
            if (!STRIP_HEADERS.has(key.toLowerCase())) {
              try {
                res.setHeader(key, value);
              } catch {
                // some headers can't be set (e.g. transfer-encoding)
              }
            }
          }

          const contentType = upstream.headers.get("content-type") ?? "";
          const finalUrl = upstream.url || targetUrl;

          if (contentType.includes("text/html")) {
            let html = await upstream.text();

            // Build proxy base path (same path that ends with /zenith-proxy)
            const proxyBase = urlPath; // e.g. /zenith-proxy or /base/zenith-proxy

            // Inject <base> tag so relative URLs resolve against the original site
            const baseTag = `<base href="${finalUrl}">`;
            // Inject link-intercept script
            const interceptScript = buildLinkInterceptScript(proxyBase);

            if (/<head[^>]*>/i.test(html)) {
              html = html.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}${interceptScript}`);
            } else {
              html = baseTag + interceptScript + html;
            }

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          } else {
            // Pass binary/CSS/JS content through as-is
            const buffer = Buffer.from(await upstream.arrayBuffer());
            res.end(buffer);
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Upstream error";
          res.statusCode = 502;
          res.setHeader("Content-Type", "text/plain");
          res.end(`Proxy error: ${msg}`);
        }
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    zenithProxyPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
