/**
 * One-call head builder for routes.
 *
 * Every route's `head()` delegates here so canonical, robots, Open Graph,
 * Twitter, hreflang AND the page's JSON-LD graph ship together — a route can
 * no longer add a title while forgetting the canonical (which is exactly the
 * state the site was in before this existed).
 *
 * Lives in its own module (not seo.ts) because structured-data.ts imports
 * seo.ts — assembling here keeps the import graph acyclic.
 */

import { seoHead, type SeoHeadInput } from "@/lib/seo";
import { graphForPath, jsonLd } from "@/lib/structured-data";

type HeadOutput = ReturnType<typeof seoHead> & {
  scripts: { type: string; children: string }[];
};

export function pageHead(input: SeoHeadInput): HeadOutput {
  const head = seoHead(input);
  return {
    ...head,
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLd(graphForPath(input.path, input.title, input.description)),
      },
    ],
  };
}
