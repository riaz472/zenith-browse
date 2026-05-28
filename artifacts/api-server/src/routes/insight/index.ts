import { Router, type IRouter, type Request, type Response } from "express";
import { lookup } from "dns/promises";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const PRIVATE_IP_RE =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:|fe80:)/i;

async function validateUrl(raw: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("URL hostname is not allowed");
  }

  if (PRIVATE_IP_RE.test(hostname)) {
    throw new Error("URL resolves to a private address");
  }

  try {
    const { address } = await lookup(hostname);
    if (PRIVATE_IP_RE.test(address) || address === "127.0.0.1" || address === "::1") {
      throw new Error("URL resolves to a private address");
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("URL resolves")) throw err;
  }

  return parsed;
}

async function fetchPageText(validUrl: URL): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(validUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ZenithBrowse/1.0; +https://zenith.browse)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await res.text();
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    return stripped.slice(0, 12000);
  } finally {
    clearTimeout(timeout);
  }
}

router.post("/insight", async (req: Request, res: Response) => {
  const { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "url is required" });
    return;
  }

  let validUrl: URL;
  try {
    validUrl = await validateUrl(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid URL";
    res.status(400).json({ error: message });
    return;
  }

  let pageText = "";
  try {
    pageText = await fetchPageText(validUrl);
  } catch {
    pageText = "";
  }

  const systemPrompt = `You are Zenith AI, an intelligent browser assistant. Analyze the provided web page content and return a JSON object with exactly this shape:
{
  "summary": "A 2-3 sentence executive summary of what this page is about, written in clear, useful language.",
  "keyTakeaways": ["Point 1", "Point 2", "Point 3", "Point 4"]
}
Be specific and informative — avoid vague filler phrases. If content is unavailable, infer from the URL.`;

  const userPrompt = pageText
    ? `URL: ${url}\n\nPage content:\n${pageText}`
    : `URL: ${url}\n\n(Page content could not be fetched. Please infer from the URL.)`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
