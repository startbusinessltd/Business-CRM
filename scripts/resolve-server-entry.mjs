import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * TanStack Start / Vite SSR output name differs by toolchain version (index.js vs server.js).
 * GitHub Actions may resolve a different plugin graph than local Windows builds.
 */
export function resolveServerEntryFileUrl(distServerDir) {
  if (!existsSync(distServerDir)) {
    throw new Error(`Missing server output directory: ${distServerDir}. Run "npm run build" first.`);
  }
  const preferred = ["index.js", "server.js"];
  for (const name of preferred) {
    const abs = join(distServerDir, name);
    if (existsSync(abs)) {
      return pathToFileURL(abs).href;
    }
  }
  const rootJs = readdirSync(distServerDir).filter((f) => f.endsWith(".js") && !f.startsWith("."));
  throw new Error(
    `No index.js or server.js under ${distServerDir}. Found: ${rootJs.length ? rootJs.join(", ") : "(none)"}`
  );
}
