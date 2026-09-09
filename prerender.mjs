/**
 * Prerender script for Business-CRM
 * Runs the SSR server locally and generates static HTML for each route.
 * Usage: node prerender.mjs
 */
import { writeFileSync, mkdirSync, cpSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { resolveServerEntryFileUrl } from "./scripts/resolve-server-entry.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/customers",
  "/features",
  "/pricing",
  "/partner",
  "/services",
  "/privacy",
  "/terms",
  "/refund",
  "/data-deletion",
  "/modules/calls",
  "/modules/employees",
  "/modules/finance",
  "/modules/leads",
  "/modules/social",
  "/modules/website",
];

const BASE_URL = "http://localhost";
const OUT_DIR = resolve(__dirname, "dist/prerendered");

/** Canonical production origin — must match src/lib/seo.ts SITE_ORIGIN. */
const SITE_ORIGIN = "https://bsoft.ltd";

/**
 * sitemap.xml is generated here (not a static file in public/) so it is built
 * from the same ROUTES list that gets prerendered — a route added above is in
 * the sitemap automatically, with lastmod = build date.
 */
function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map((route) => {
    const loc = route === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
    // Home and money pages first in crawl priority; legal pages lowest.
    const priority =
      route === "/" ? "1.0" : ["/pricing", "/features", "/services"].includes(route)
        ? "0.9"
        : ["/privacy", "/terms", "/refund", "/data-deletion"].includes(route)
          ? "0.3"
          : "0.7";
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(resolve(OUT_DIR, "sitemap.xml"), xml, "utf8");
  console.log(`  Done: /sitemap.xml (${ROUTES.length} URLs, lastmod ${lastmod})`);
}

async function main() {
  console.log("Loading server bundle...");
  const serverHref = resolveServerEntryFileUrl(resolve(__dirname, "dist/server"));
  const server = await import(serverHref);
  const handler = server.default;

  mkdirSync(OUT_DIR, { recursive: true });

  const clientDir = resolve(__dirname, "dist/client");
  // Copy the full Vite client build: hashed chunks in `assets/` plus everything from `public/`
  // (e.g. /images/*, /videos/*, /sb-logo.svg). Previously only `assets/` was synced to S3, so
  // image/video requests returned the SPA HTML (text/html) from CloudFront/S3 fallback.
  cpSync(clientDir, OUT_DIR, { recursive: true });
  console.log("Copied dist/client → dist/prerendered/ (assets + public images, videos, logos)");

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    console.log(`  Rendering: ${route}`);
    const request = new Request(url, { headers: { accept: "text/html,application/xhtml+xml" } });
    let html;
    try {
      const response = await handler.fetch(request, {}, {});
      html = await response.text();
    } catch (err) {
      console.error(`  Failed to render ${route}:`, err.message);
      continue;
    }
    const filePath = route === "/" ? "/index.html" : `${route}/index.html`;
    const fullPath = resolve(OUT_DIR, `.${filePath}`);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, html, "utf8");
    console.log(`  Done: ${filePath} (${(html.length / 1024).toFixed(1)} KB)`);
  }

  writeSitemap();

  console.log("\nPrerender complete! Output in dist/prerendered/");
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});