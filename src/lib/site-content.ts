import { IMG } from "@/components/site/PageBlocks";

/** Product areas aligned with the Business CRM app (menu-data + app documentation). */
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
  salesEmail: "support@businesscrm.co.in",
  supportEmail: "support@businesscrm.co.in",
  website: "Businesscrm.co.in",
  websiteUrl: "https://businesscrm.co.in",
  office: [
    "Royal Space, No. 154, 5th Main, 7th Sector, Rajiv Gandhi Nagar",
    "HSR Layout, Bengaluru – 560102",
    "Karnataka, India",
  ].join("\n"),
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
