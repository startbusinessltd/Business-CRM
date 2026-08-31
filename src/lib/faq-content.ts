/**
 * FAQ content for the public site.
 *
 * These answers are rendered visibly on the page AND emitted as FAQPage JSON-LD.
 * Both are required: Google demotes (and can manually action) FAQ markup whose
 * answer text is not visible to the user, so the same array must feed both —
 * never add a schema-only question here.
 *
 * GEO: question-shaped headings with a self-contained first sentence are what
 * answer engines extract. Each answer therefore leads with a complete statement
 * that reads correctly with no surrounding context, then adds detail.
 */

export type FaqItem = { q: string; a: string };

/** Home page — entity, scope and "is this for me" questions. */
export const HOME_FAQ: FaqItem[] = [
  {
    q: "What is B-SOFT?",
    a: "B-SOFT is an all-in-one business CRM platform for Indian small and medium businesses. It combines six core services in a single login: an AI website builder, lead and pipeline CRM, call tracking, a social media hub, team roles and permissions, and finance with invoicing — so a business does not need four separate tools that never talk to each other.",
  },
  {
    q: "Which businesses is B-SOFT built for?",
    a: "B-SOFT is built for Indian small and medium businesses that sell to customers and need to follow up — agencies, consultants, clinics, real estate, education, salons, insurance and local service businesses. Plans are priced in INR and the platform ships with industry templates so a business can launch without a technical team.",
  },
  {
    q: "What is included in the platform?",
    a: "Every B-SOFT account includes six modules: Website and web builder (templates, form builder, publishing), Leads and CRM (pipelines, forms, tasks, automation over email, WhatsApp and SMS), Call Tracker (call history, recordings sync, hourly and day-wise reports), Social Hub (posts, reels, ad campaigns, WhatsApp inbox), Team and Permissions (roles, access profiles, employee management), and Finance and Billing (packages, coupons, payments, invoices, incentive wallet).",
  },
  {
    q: "Does B-SOFT replace my website and hosting?",
    a: "Yes. The Website and Web Builder module builds a professional website with your own custom domain, SSL and free B-SOFT cloud hosting included in the plan. Lead forms on that website feed straight into the CRM pipeline, so website enquiries become tracked leads without any manual export.",
  },
  {
    q: "Can B-SOFT track calls made by my sales team?",
    a: "Yes. The Call Tracker module records call history from your team's devices, syncs recordings, and reports on hourly and day-wise activity as well as per-employee call performance. Calls are linked to the matching lead, so the call log and the pipeline show the same history.",
  },
  {
    q: "Does B-SOFT support GST invoicing and online payments?",
    a: "Yes. The Finance and Billing module produces GST invoices as PDFs, tracks payment transactions, supports coupons and package pricing, and integrates with a payment gateway so customers can pay online. Partner and employee commission payouts run through the same incentive wallet.",
  },
  {
    q: "Where is B-SOFT based and how do I get support?",
    a: "B-SOFT operates from Channapatna, Ramanagara District, Karnataka, India, and serves businesses across India. Logged-in customers get in-app help, learning videos and a built-in AI assistant; anyone can reach the team by email at support@bsoft.ltd, and the contact page has a form that creates a tracked enquiry.",
  },
  {
    q: "Can I resell B-SOFT to my own customers?",
    a: "Yes. The B-SOFT Partner Program lets partners sell the platform under their own pricing, manage every customer from one panel, and earn commission on each sale — with no technical team required. Partners register and verify a mobile number, then choose a plan to activate the partner panel.",
  },
];

/**
 * Pricing page — this array IS the visible "Pricing questions, answered" grid
 * in `routes/pricing.tsx` as well as its FAQPage markup. Editing here updates both.
 */
export const PRICING_FAQ: FaqItem[] = [
  {
    q: "Which plan is right for me?",
    a: "Choose Website Pro for a professional site with lead capture, CRM Business Suite for the complete platform (calls, social, team and finance), or Custom Development Studio for bespoke modules and integrations.",
  },
  {
    q: "How do I get started?",
    a: "Click Register now on any plan to create your account. Our team will help you pick templates and configure your workspace. For custom work, talk to sales.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes — start on Website Pro and upgrade to the CRM Business Suite any time. Contact us to add partner and reseller options.",
  },
  {
    q: "Are taxes included?",
    a: "Listed prices are exclusive of applicable GST or taxes unless stated otherwise on your invoice.",
  },
  {
    q: "Do you offer non-profit or startup pricing?",
    a: "We offer discounts for registered non-profits and early-stage startups. Reach out via the contact page.",
  },
  {
    q: "Where is my data stored?",
    a: "Production APIs run on B-SOFT infrastructure with encryption in transit; contact us for security and data questions.",
  },
];
