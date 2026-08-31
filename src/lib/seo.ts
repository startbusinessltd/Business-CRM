/**
 * Central SEO / GEO configuration for the public B-SOFT marketing site.
 *
 * Every route builds its <head> from `seoHead()` so canonical, Open Graph,
 * Twitter and robots directives stay consistent — the single most common
 * cause of duplicate-content dilution is a page that ships a title but no
 * canonical, which is what this site did before.
 *
 * GEO note: answer engines (ChatGPT Search, Perplexity, Gemini, Claude) read
 * the same head plus the JSON-LD in `structured-data.ts` and `/llms.txt`.
 * Keep the three in agreement — a contradiction between them is what makes an
 * engine drop the citation.
 */

/** Canonical production origin. No trailing slash. */
export const SITE_ORIGIN = "https://bsoft.ltd";

export const SITE = {
  origin: SITE_ORIGIN,
  /** Brand name exactly as it must appear in Google Business Profile and every citation. */
  name: "B-SOFT",
  /**
   * Registered entity name for schema.org `legalName`.
   * TODO(business): replace with the name on the GST / incorporation certificate
   * once confirmed — it must match Google Business Profile character for character.
   */
  legalName: "B-SOFT",
  /** One-line definitional sentence. Answer engines quote this verbatim — keep it factual. */
  definition:
    "B-SOFT is an all-in-one business CRM platform for Indian small and medium businesses that combines an AI website builder, lead and pipeline CRM, call tracking, a social media hub, team roles and permissions, and finance with GST invoicing in a single login.",
  tagline: "One platform to run your entire business",
  description:
    "B-SOFT is an all-in-one CRM for Indian SMBs — AI website builder, leads and pipelines, call tracking, social hub, team permissions, and GST invoicing in one login.",
  /** Absolute, square, used for schema.org `logo` and `publisher.logo`. */
  logo: "/logo.png",
  /** 1200x630 branded card used for og:image and twitter:image on every page. */
  ogImage: "/og-image.png",
  ogImageAlt: "B-SOFT — one platform for websites, leads, calls, social, team and finance",
  locale: "en_IN",
  lang: "en-IN",
  /**
   * Verified brand profiles for schema.org `sameAs`. These are the strongest
   * entity-consolidation signal there is: Google and answer engines use them to
   * decide that the site, the Google Business Profile and the social accounts
   * are one company rather than three.
   * TODO(business): add the live Google Business Profile short link, LinkedIn
   * company page, Facebook page, Instagram and YouTube URLs.
   */
  sameAs: [] as string[],
  /** Twitter/X handle including the @. Empty disables the twitter:site tag. */
  twitterHandle: "",
  foundingDate: "2024",
} as const;

/**
 * Name-Address-Phone. This block is the local-SEO source of truth: it must match
 * the Google Business Profile byte for byte, including punctuation, or Google
 * treats them as two different businesses and neither ranks.
 */
export const NAP = {
  /** Exactly as on the Google Business Profile — "BSOFT", no hyphen (user-confirmed 2026-08-31). */
  name: "BSOFT",
  streetAddress: "#454, 1st Cross, Mahadeshwara Nagar",
  addressLocality: "Channapatna",
  addressRegion: "Karnataka",
  postalCode: "562160",
  addressCountry: "IN",
  /** District line — kept out of `streetAddress` so the schema stays parseable. */
  district: "Ramanagara District",
  /** E.164 — same number as on the Google Business Profile (set 2026-08-31). */
  telephone: "+919964996599",
  email: "support@bsoft.ltd",
  /** Sales enquiries — shown as the sales contactPoint; support stays on `email`. */
  salesEmail: "connect@bsoft.ltd",
  /** Decoded from the Google Maps embed in site-content.ts — verified pin. */
  latitude: 12.645694,
  longitude: 77.203722,
  /** ISO 8601 opening hours for LocalBusiness. Adjust if the office differs. */
  openingHours: "Mo-Sa 10:00-19:00",
} as const;

/** Turns "/pricing" into "https://bsoft.ltd/pricing". Root stays "https://bsoft.ltd/". */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export type SeoHeadInput = {
  /** Route path, e.g. "/pricing". Drives canonical and og:url. */
  path: string;
  title: string;
  description: string;
  /** Page-specific social card. Defaults to the site card. */
  image?: string;
  /** og:type — "website" for landing pages, "article" for content pages. */
  type?: "website" | "article";
  /** Set for pages that must stay out of the index (thank-you, duplicates). */
  noindex?: boolean;
};

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

/**
 * Builds the full per-page head. Route heads merge over the root head, so this
 * intentionally re-declares og:title/description — otherwise the root defaults
 * leak onto every page and all seventeen pages share one social card.
 */
export function seoHead(input: SeoHeadInput): {
  meta: MetaTag[];
  links: { rel: string; href: string; hrefLang?: string }[];
} {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? SITE.ogImage);
  const meta: MetaTag[] = [
    { title: input.title },
    { name: "description", content: input.description },
    {
      name: "robots",
      content: input.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    // Open Graph
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: SITE.locale },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: SITE.ogImageAlt },
    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: SITE.ogImageAlt },
  ];
  if (SITE.twitterHandle) {
    meta.push({ name: "twitter:site", content: SITE.twitterHandle });
    meta.push({ name: "twitter:creator", content: SITE.twitterHandle });
  }

  return {
    meta,
    links: [
      { rel: "canonical", href: canonical },
      // Single-language site today. `x-default` plus `en-IN` tells Google the
      // page is India-targeted without claiming translations that do not exist.
      { rel: "alternate", href: canonical, hrefLang: "en-IN" },
      { rel: "alternate", href: canonical, hrefLang: "x-default" },
    ],
  };
}
