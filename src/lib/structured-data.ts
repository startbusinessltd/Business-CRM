/**
 * schema.org JSON-LD for the public site.
 *
 * Why a single `@graph` per page rather than several loose blocks: entities that
 * reference each other by `@id` inside one graph are what makes Google (and the
 * answer engines that reuse its entity data) treat the website, the company and
 * the Google Business Profile as one business instead of three unrelated things.
 * Loose duplicate Organization blocks on every page do the opposite.
 *
 * Stable @ids — never change these, they are the join keys:
 *   {origin}/#organization   the company
 *   {origin}/#localbusiness  the physical office (local pack / Maps)
 *   {origin}/#website        the site itself
 *   {origin}/#software       the B-SOFT product
 *   {url}#webpage            the individual page
 */

import { NAP, SITE, SITE_ORIGIN, absoluteUrl } from "@/lib/seo";
import { HOME_FAQ, PRICING_FAQ, type FaqItem } from "@/lib/faq-content";
import { SERVICES } from "@/lib/site-content";

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const LOCAL_ID = `${SITE_ORIGIN}/#localbusiness`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const SOFTWARE_ID = `${SITE_ORIGIN}/#software`;

/** Drops empty strings and empty arrays so no `"telephone": ""` ships to Google. */
function clean<T extends Json>(obj: T): T {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v === "" || v === null || v === undefined || (Array.isArray(v) && v.length === 0)) {
      delete obj[k];
    }
  }
  return obj;
}

const postalAddress = () =>
  clean({
    "@type": "PostalAddress",
    streetAddress: `${NAP.streetAddress}, ${NAP.district}`,
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  });

export function organization(): Json {
  return clean({
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: ["B Soft", "BSOFT", "B-SOFT CRM"],
    url: `${SITE_ORIGIN}/`,
    description: SITE.definition,
    foundingDate: SITE.foundingDate,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_ORIGIN}/#logo`,
      url: absoluteUrl(SITE.logo),
      contentUrl: absoluteUrl(SITE.logo),
      width: 1024,
      height: 1024,
      caption: SITE.name,
    },
    image: { "@id": `${SITE_ORIGIN}/#logo` },
    email: NAP.email,
    telephone: NAP.telephone,
    address: postalAddress(),
    areaServed: { "@type": "Country", name: "India" },
    sameAs: [...SITE.sameAs],
    contactPoint: [
      clean({
        "@type": "ContactPoint",
        contactType: "sales",
        email: NAP.email,
        telephone: NAP.telephone,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "kn"],
      }),
      clean({
        "@type": "ContactPoint",
        contactType: "customer support",
        email: NAP.email,
        telephone: NAP.telephone,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "kn"],
      }),
    ],
  });
}

/**
 * The physical office. Separate from Organization on purpose: the local pack and
 * Maps match on LocalBusiness + geo, and this is the entity that must mirror the
 * Google Business Profile exactly.
 */
export function localBusiness(): Json {
  return clean({
    "@type": "LocalBusiness",
    "@id": LOCAL_ID,
    name: NAP.name,
    parentOrganization: { "@id": ORG_ID },
    url: `${SITE_ORIGIN}/`,
    image: absoluteUrl(SITE.ogImage),
    logo: absoluteUrl(SITE.logo),
    description: SITE.definition,
    email: NAP.email,
    telephone: NAP.telephone,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: NAP.latitude,
      longitude: NAP.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${NAP.latitude}%2C${NAP.longitude}`,
    areaServed: { "@type": "Country", name: "India" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [...SITE.sameAs],
  });
}

export function webSite(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.lang,
  };
}

/** The product itself — the entity answer engines cite for "best CRM for …" queries. */
export function softwareApplication(): Json {
  return clean({
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: `${SITE.name} Business CRM`,
    alternateName: SITE.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM",
    operatingSystem: "Web browser, Android",
    url: `${SITE_ORIGIN}/`,
    description: SITE.definition,
    image: absoluteUrl(SITE.ogImage),
    softwareHelp: { "@type": "CreativeWork", url: `${SITE_ORIGIN}/features` },
    publisher: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
    inLanguage: SITE.lang,
    featureList: SERVICES.map((s) => s.t),
  });
}

/** Each module page is a distinct Service the company offers. */
export function serviceEntity(path: string): Json | null {
  const svc = SERVICES.find((s) => s.to === path);
  if (!svc) return null;
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: `${svc.t} — ${SITE.name}`,
    serviceType: svc.t,
    description: svc.d,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    isPartOf: { "@id": SOFTWARE_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${svc.t} capabilities`,
      itemListElement: svc.features.map((f, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: f },
      })),
    },
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(t.path),
    })),
  };
}

export function faqPage(url: string, items: FaqItem[]): Json {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function webPage(path: string, name: string, description: string, extra: Json = {}): Json {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(SITE.ogImage) },
    inLanguage: SITE.lang,
    ...extra,
  };
}

/** Human-readable breadcrumb label per route — also drives the BreadcrumbList. */
const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/features": "Features",
  "/services": "Services",
  "/customers": "Customers",
  "/pricing": "Pricing",
  "/contact": "Contact",
  "/partner": "Partner Program",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/refund": "Refund Policy",
  "/modules/website": "Website & Web Builder",
  "/modules/leads": "Leads & CRM",
  "/modules/calls": "Call Tracker",
  "/modules/social": "Social Hub",
  "/modules/employees": "Team & Permissions",
  "/modules/finance": "Finance & Billing",
};

function trailFor(path: string): { name: string; path: string }[] {
  const trail = [{ name: "Home", path: "/" }];
  if (path === "/") return trail;
  if (path.startsWith("/modules/")) {
    trail.push({ name: "Services", path: "/services" });
  }
  trail.push({ name: PAGE_TITLES[path] ?? path, path });
  return trail;
}

/**
 * The JSON-LD graph for a given route. Assembled in one place so every page gets
 * the company + site entities and only the page-specific extras change — no
 * per-route wiring to forget.
 */
export function graphForPath(path: string, title: string, description: string): Json {
  const url = absoluteUrl(path);
  const nodes: Json[] = [organization(), localBusiness(), webSite()];

  if (path === "/") {
    nodes.push(softwareApplication());
    nodes.push(
      webPage(path, title, description, {
        mainEntity: { "@id": SOFTWARE_ID },
      }),
    );
    nodes.push(faqPage(url, HOME_FAQ));
  } else if (path === "/contact") {
    nodes.push(webPage(path, title, description, { "@type": ["WebPage", "ContactPage"] }));
  } else if (path === "/about") {
    nodes.push(webPage(path, title, description, { "@type": ["WebPage", "AboutPage"] }));
  } else if (path === "/pricing") {
    // Offer data is emitted separately by the pricing route from the plans it
    // actually renders, so the markup can never disagree with the visible price.
    nodes.push(webPage(path, title, description));
    nodes.push(faqPage(url, PRICING_FAQ));
  } else if (path.startsWith("/modules/")) {
    const svc = serviceEntity(path);
    nodes.push(webPage(path, title, description, svc ? { mainEntity: { "@id": svc["@id"] } } : {}));
    if (svc) nodes.push(svc);
  } else {
    nodes.push(webPage(path, title, description));
  }

  nodes.push(breadcrumbs(trailFor(path)));

  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Product/Offer markup for the pricing page, built from the plans actually on
 * screen so the marked-up price is the one a visitor sees. Marking up a price
 * that differs from the visible one is a rich-result policy violation.
 */
export function pricingOffers(
  plans: { name: string; description: string; price: number; url: string }[],
): Json | null {
  if (plans.length === 0) return null;
  const prices = plans.map((p) => p.price).filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_ORIGIN}/pricing#product`,
    name: `${SITE.name} Business CRM`,
    description: SITE.definition,
    brand: { "@type": "Brand", name: SITE.name },
    image: absoluteUrl(SITE.ogImage),
    url: `${SITE_ORIGIN}/pricing`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: plans.length,
      url: `${SITE_ORIGIN}/pricing`,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.description,
        price: p.price,
        priceCurrency: "INR",
        url: p.url,
        availability: "https://schema.org/InStock",
        seller: { "@id": ORG_ID },
      })),
    },
  };
}

/** Serialises for a <script type="application/ld+json"> tag. */
export function jsonLd(data: Json): string {
  // `<` escaped so "</script>" inside any string can never terminate the tag early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
