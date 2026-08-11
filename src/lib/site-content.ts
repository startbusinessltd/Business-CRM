import { IMG } from "@/components/site/PageBlocks";

/** Product areas aligned with the B-SOFT app (menu-data + app documentation). */
export const SERVICES = [
  {
    to: "/modules/website",
    t: "Website & Web Builder",
    d: "Templates, website settings, form builder, SEO & GEO, and website admin — publish sites that feed leads into your CRM.",
    img: IMG.website,
    features: [
      "Website type & industry templates",
      "Website settings & site configuration",
      "Drag-and-drop form builder",
      "SEO & GEO optimisation",
      "Website admin & publishing",
      "In-app AI chat assistant",
    ],
  },
  {
    to: "/modules/leads",
    t: "Leads & CRM",
    d: "Pipelines, forms, lead management, tasks, automation (email, WhatsApp, SMS), and website lead capture.",
    img: IMG.leads,
    features: [
      "Lead generation — pipelines & stages",
      "All forms — build, publish & embed",
      "Lead management — table & kanban views",
      "My tasks & follow-ups",
      "Lead automation rules & activity log",
      "Website leads & sign-up capture",
    ],
  },
  {
    to: "/modules/calls",
    t: "Call Tracker",
    d: "Native call tracking with dashboard, history, hourly and day-wise reports, employee views, and sync logs.",
    img: IMG.callcenter,
    features: [
      "Call tracker dashboard",
      "Call history & recordings sync",
      "Hourly & day-wise analytics",
      "Per-employee call performance",
      "Sync log & device visibility",
      "Leads linked to call activity",
    ],
  },
  {
    to: "/modules/social",
    t: "Social Hub",
    d: "Connect accounts, publish posts and reels, run ad campaigns, WhatsApp inbox, and social analytics.",
    img: IMG.socialmarketing,
    features: [
      "Social Hub overview",
      "Connect Facebook, Instagram & more",
      "Posts, reels & videos",
      "Meta ad campaigns",
      "WhatsApp business messaging",
      "Analytics & engagement insights",
    ],
  },
  {
    to: "/modules/employees",
    t: "Team & Permissions",
    d: "Roles & permissions, employee management, and access profiles so the right people see the right screens.",
    img: IMG.employees,
    features: [
      "Roles & permissions (access profile)",
      "My team — employee management",
      "Package-based menu access",
      "Partner & white-label flows",
      "Secure, role-aware navigation",
      "Onboarding aligned to your plan",
    ],
  },
  {
    to: "/modules/finance",
    t: "Finance & Billing",
    d: "Packages & pricing, coupons, payment transactions, incentive wallet, invoicing, and payment gateway setup.",
    img: IMG.finance,
    features: [
      "Package type & business types",
      "Package & pricing management",
      "Coupons & promo codes",
      "Payment transactions (Razorpay-ready)",
      "Invoice management & PDFs",
      "Incentive wallet & payouts",
    ],
  },
] as const;

export const CONTACT = {
  salesEmail: "support@bsoft.ltd",
  supportEmail: "support@bsoft.ltd",
  website: "Bsoft.ltd",
  websiteUrl: "https://bsoft.ltd",
  office: [
    "#454, 1st Cross,",
    "Mahadeshwara Nagar,",
    "Channapatna, Ramanagara District,",
    "Karnataka – 562160, India.",
  ].join("\n"),
  // Google cannot geocode the "#454, 1st Cross" street address — it falls back to a
  // low-confidence match ~25km away and renders a pin-less search map. Use Google's
  // official embed URL (Maps → Share → Embed a map), which pins an exact point.
  //
  // The pb blob is opaque: to move the pin, regenerate it from Google Maps rather than
  // hand-editing. Decoded from this one — marker 12°38'44.5"N 77°12'13.4"E
  // (12.645694, 77.203722); !5e1 selects satellite view (!5e0 is the road map).
  officeMapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7045.988339020517!2d77.203722!3d12.64569!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDM4JzQ0LjUiTiA3N8KwMTInMTMuNCJF!5e1!3m2!1sen!2sus!4v1786454455913!5m2!1sen!2sus",
  // Always-visible escape hatch. Ad blockers, privacy extensions and enterprise
  // policies routinely refuse to frame google.com, which leaves the embed as a bare
  // "refused to connect" box — this keeps the location reachable when that happens.
  officeMapLinkUrl: "https://www.google.com/maps/search/?api=1&query=12.645694%2C77.203722",
  replyTime: "We typically reply within 24 hours.",
};

export const PLATFORM_STATS = {
  home: [
    { n: "6", l: "Core services" },
    { n: "30+", l: "Product capabilities" },
    { n: "1", l: "Login for your whole stack" },
    { n: "INR", l: "India-first pricing" },
  ],
  about: [
    { n: "12+", l: "Industry templates" },
    { n: "INR", l: "Plans built for India" },
    { n: "AI", l: "In-app assistant" },
    { n: "Razorpay", l: "Payments & invoicing" },
  ],
} as const;

export const PRICING_FEATURES = [
  "Website & web builder",
  "Leads, pipelines & forms",
  "Call Tracker",
  "Social Hub",
  "Team & permissions",
  "Finance, invoices & payments",
] as const;
