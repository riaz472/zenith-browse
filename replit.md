# Zenith Browse

An AI-powered browser UI with tabbed navigation, a collapsible sidebar, speed dial, and an AI insight panel.

## Run & Operate

- `pnpm --filter @workspace/zenith-browse run dev` — run the frontend (Vite, auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: none for frontend-only mode

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4
- UI: shadcn/ui + Radix UI primitives + framer-motion
- Fonts: Space Grotesk (headline) + Inter (body) via Google Fonts

## Where things live

- `artifacts/zenith-browse/` — the main frontend app
- `artifacts/zenith-browse/src/components/browser/` — core browser UI components
- `artifacts/zenith-browse/src/index.css` — Zenith dark theme (CSS variables)
- `artifacts/api-server/` — scaffolded Express API (not used by default)

## Architecture decisions

- Purely frontend — no backend needed. History and bookmarks stored in localStorage.
- Capacitor plugins replaced with Web APIs (localStorage, navigator.share, window.open).
- `next/image`, `next/link`, and all Next.js patterns removed; app is now a single-page Vite + React app.
- Dark mode always-on via `class="dark"` on `<body>` in index.html.
- Tailwind v4 with CSS variable-based theming.

## Product

Zenith Browse is a browser-in-a-browser UI — a concept browser with tabs, a collapsible bookmarks/history sidebar, a DuckDuckGo search-powered address bar, and an AI Insight panel that synthesizes the current URL.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do not run `pnpm dev` at workspace root — run it via `pnpm --filter @workspace/zenith-browse run dev` or use the Replit workflow.
- Capacitor packages are NOT in the package.json; they were removed during migration. Do not re-add them.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
