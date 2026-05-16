// ✅ IMPORTS ALWAYS FIRST
import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return false;
  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) return false;
  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// ✅ SINGLE export default — nuclear bot bypass + normal flow
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const ua = request.headers.get("user-agent") ?? "";
    const isSocialBot =
      ua.includes("facebookexternalhit") ||
      ua.includes("Facebot") ||
      ua.includes("LinkedInBot") ||
      ua.includes("Twitterbot") ||
      ua.includes("WhatsApp");

    // ✅ NUCLEAR FIX — bypass h3 entirely, return OG tags directly
    if (isSocialBot) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:type"         content="website" />
  <meta property="og:url"          content="https://neil.pecha.workers.dev/" />
  <meta property="og:site_name"    content="Neil Espinosa Pecha | Chief Engineer" />
  <meta property="og:title"        content="🎂 Happy Birthday, Neil Espinosa Pecha! 🎉" />
  <meta property="og:description"  content="Wishing our Chief Engineer a wonderful birthday! — From family, friends & colleagues of Leonis Navigation Co., Inc." />
  <meta property="og:image"        content="https://neil.pecha.workers.dev/og-image.jpg" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type"   content="image/jpeg" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="🎂 Happy Birthday, Neil Espinosa Pecha! 🎉" />
  <meta name="twitter:description" content="Wishing our Chief Engineer a wonderful birthday from Leonis Navigation Co., Inc." />
  <meta name="twitter:image"       content="https://neil.pecha.workers.dev/og-image.jpg" />
</head>
<body></body>
</html>`;
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // Normal flow for real users
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
