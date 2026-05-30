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
  const server = await import("./dist/server/server.js");
  const handler = server.default;

  mkdirSync(OUT_DIR, { recursive: true });

  // Copy static client assets
  cpSync(resolve(__dirname, "dist/client/assets"), resolve(OUT_DIR, "assets"), { recursive: true });
  console.log("Copied static assets to dist/prerendered/assets/");

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