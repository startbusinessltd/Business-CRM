/**
 * Prerender script for Business-CRM
 * Runs the SSR server locally and generates static HTML for each route.
 * Usage: node prerender.mjs
 */
import { writeFileSync, mkdirSync, cpSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/customers",
  "/features",
  "/pricing",
  "/services",
  "/privacy",
  "/terms",
  "/refund",
  "/modules/calls",
  "/modules/employees",
  "/modules/finance",
  "/modules/leads",
  "/modules/social",
  "/modules/website",
];

const BASE_URL = "http://localhost";
const OUT_DIR = resolve(__dirname, "dist/prerendered");

async function main() {
  console.log("Loading server bundle...");
  const server = await import("./dist/server/index.js");
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

  console.log("\nPrerender complete! Output in dist/prerendered/");
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});