import { CONTACT } from "@/lib/site-content";
import { resolveApiBase } from "@/lib/contact-lead-api";

/* ------------------------------------------------------------------ *
 * Partner program domain — plans, packages, money maths and support.
 * Shared by the /partner landing page and the guided PartnerJourney modal.
 * ------------------------------------------------------------------ */

export const GST_RATE = 0.18;

export type PartnerType = "COMMISSION" | "WALLET";

export type RechargeTier = { minAmount: number; multiplier: number };

export interface PartnerPlan {
  planId: number;
  code: string;
  name: string;
  description?: string | null;
  joiningFee: number;
  websiteCost?: number | null;
  crmCost?: number | null;
  features: string[];
  partnerType?: PartnerType;
  maxCommissionPct?: number | null;
  /** WALLET tiers: base/fallback recharge bonus multiplier — pay ₹X, get ₹X × this in the wallet. */
  rechargeMultiplier?: number | null;
  /** WALLET tiers: amount-based recharge bonus ladder (recharge more → higher multiplier). */
  rechargeTiers?: RechargeTier[] | null;
}

/**
 * Offline fallback only — used when the admin plans API is unreachable.
 * Live joining fees and packages always come from `fetchPartnerPlans()`.
 */
export const FALLBACK_PLANS: PartnerPlan[] = [
  {
    planId: 4,
    code: "ASSOCIATE",
    name: "Associate Partner",
    joiningFee: 999,
    partnerType: "COMMISSION",
    maxCommissionPct: 30,
    description:
      "Start your partnership with B Soft at a low entry cost. Offer B Soft to businesses around you and earn a reward on every plan they buy — no wallet, no stock, nothing to manage.",
    features: [
      "Low initial investment — start earning fast",
      "Easy onboarding, done in minutes",
      "Full B Soft product access to offer your customers",
      "Dedicated partner support",
      "Sales assistance from the B Soft team",
      "Ready-made marketing material",
      "Earn a reward on every plan your customers buy",
      "Partner resources, training and a simple panel",
    ],
  },
  {
    planId: 1,
    code: "FRANCHISE",
    name: "Franchise Partner",
    joiningFee: 25000,
    websiteCost: 1000,
    crmCost: 3000,
    partnerType: "WALLET",
    rechargeMultiplier: 4,
    rechargeTiers: [
      { minAmount: 0, multiplier: 4 },
      { minAmount: 25000, multiplier: 4 },
      { minAmount: 50000, multiplier: 6 },
      { minAmount: 100000, multiplier: 10 },
    ],
    description:
      "Become a full B Soft business owner. Choose a package, get a multiplied business wallet, and sell websites, CRM and AI products to businesses around you at any price you like — the profit is yours.",
    features: [
      "Business wallet worth several times your package",
      "Sell every B Soft product — websites, CRM, AI Voice, Social Hub",
      "You decide the selling price and keep the full profit",
      "Only a small fixed cost per sale from your wallet",
      "GST invoices and ready-made marketing material",
      "Manage all your customers from one simple panel",
    ],
  },
];

export function isCommission(p: PartnerPlan): boolean {
  return (p.partnerType ?? "WALLET") === "COMMISSION";
}

/** Associate plan from the live catalog (joining fee is whatever admin last saved). */
export function associateOf(plans: PartnerPlan[]): PartnerPlan {
  return plans.find(isCommission) ?? FALLBACK_PLANS[0];
}

export function franchiseOf(plans: PartnerPlan[]): PartnerPlan {
  return plans.find((p) => !isCommission(p)) ?? FALLBACK_PLANS[1];
}

function normalizePlan(raw: Partial<PartnerPlan> & Record<string, unknown>): PartnerPlan | null {
  const planId = Number(raw.planId ?? raw.id);
  const joiningFee = Number(raw.joiningFee);
  if (!Number.isFinite(planId) || !Number.isFinite(joiningFee)) return null;

  const features = Array.isArray(raw.features)
    ? (raw.features as unknown[]).map(String)
    : typeof raw.features === "string"
      ? [String(raw.features)]
      : [];

  const tiersRaw = raw.rechargeTiers;
  const rechargeTiers = Array.isArray(tiersRaw)
    ? (tiersRaw as RechargeTier[])
        .map((t) => ({
          minAmount: Number((t as RechargeTier).minAmount),
          multiplier: Number((t as RechargeTier).multiplier),
        }))
        .filter((t) => Number.isFinite(t.minAmount) && Number.isFinite(t.multiplier))
    : null;

  return {
    planId,
    code:
      String(raw.code ?? "").toUpperCase() ||
      (raw.partnerType === "COMMISSION" ? "ASSOCIATE" : "FRANCHISE"),
    name: String(raw.name ?? "Partner plan"),
    description: (raw.description as string | null | undefined) ?? null,
    joiningFee,
    websiteCost: raw.websiteCost != null ? Number(raw.websiteCost) : null,
    crmCost: raw.crmCost != null ? Number(raw.crmCost) : null,
    features,
    partnerType: (raw.partnerType as PartnerType | undefined) ?? undefined,
    maxCommissionPct: raw.maxCommissionPct != null ? Number(raw.maxCommissionPct) : null,
    rechargeMultiplier: raw.rechargeMultiplier != null ? Number(raw.rechargeMultiplier) : null,
    rechargeTiers,
  };
}

/** Loads the live catalog from admin; falls back only when the API is unreachable. */
export async function fetchPartnerPlans(signal?: AbortSignal): Promise<PartnerPlan[]> {
  const url = `${resolveApiBase()}auth/partner/plans`;
  try {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) return FALLBACK_PLANS;
    const body = (await res.json()) as { responsePayload?: unknown };
    const live = body?.responsePayload;
    if (!Array.isArray(live) || live.length === 0) return FALLBACK_PLANS;
    const plans = live
      .map((row) => normalizePlan(row as Partial<PartnerPlan> & Record<string, unknown>))
      .filter((p): p is PartnerPlan => p != null);
    return plans.length > 0 ? plans : FALLBACK_PLANS;
  } catch {
    return FALLBACK_PLANS;
  }
}

/* ---------------------------- money maths ---------------------------- */

export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function gstOn(amount: number): number {
  return Math.round(amount * GST_RATE);
}

export function totalWithGst(amount: number): number {
  return amount + gstOn(amount);
}

/** Sorted recharge ladder with the zero-amount base row dropped. */
function ladder(plan: PartnerPlan): RechargeTier[] {
  return [...(plan.rechargeTiers ?? [])]
    .filter((t) => Number.isFinite(t.minAmount) && Number(t.multiplier) > 1)
    .sort((a, b) => a.minAmount - b.minAmount);
}

/** Bonus multiplier that applies to a given recharge/package amount. */
export function multiplierFor(plan: PartnerPlan, amount: number): number {
  const rows = ladder(plan);
  let m = plan.rechargeMultiplier && plan.rechargeMultiplier > 1 ? plan.rechargeMultiplier : 1;
  for (const t of rows) if (amount >= t.minAmount) m = t.multiplier;
  return m;
}

/** "4×" or "4× to 10×" depending on whether the ladder has more than one rate. */
export function multiplierLabel(plan: PartnerPlan): string | null {
  const mults = ladder(plan).map((t) => t.multiplier);
  const flat = plan.rechargeMultiplier ?? 0;
  const all = mults.length > 0 ? mults : flat > 1 ? [flat] : [];
  if (all.length === 0) return null;
  const min = Math.min(...all);
  const max = Math.max(...all);
  return min === max ? `${min}×` : `${min}× to ${max}×`;
}

export type FranchisePackage = {
  /** Stable id used as the selection key and in the payment hand-off. */
  id: string;
  label: string;
  amount: number;
  multiplier: number;
  /** Extra wallet money B Soft adds on top of the package amount (walletValue − amount). */
  bonusValue: number;
  /** Total credited to the business wallet: amount × multiplier. */
  walletValue: number;
  bestFor: string;
};

const PACKAGE_BEST_FOR: Record<number, string> = {
  0: "Individuals and freelancers starting their first software business",
  1: "Small agencies and teams already selling to local businesses",
  2: "Established businesses building a full B Soft franchise operation",
};

/**
 * Franchise packages from the live admin recharge ladder.
 * If the ladder is missing, fall back to a single package using the plan joining fee.
 *
 * Wallet maths: the multiplier is the TOTAL credited, not a bonus on top — pay ₹25,000 at 4×
 * and the wallet holds ₹1,00,000 (₹25,000 package + ₹75,000 bonus). This matches the admin
 * recharge-pack rule ("credits amount × multiplier") and the server's `creditAmount`, so the
 * landing page can never quote a different balance from the one the partner is actually given.
 */
export function franchisePackages(plan: PartnerPlan): FranchisePackage[] {
  const rows = ladder(plan).filter((t) => t.minAmount > 0);
  const amounts =
    rows.length >= 1
      ? rows.map((t) => t.minAmount)
      : plan.joiningFee > 0
        ? [plan.joiningFee]
        : [];

  return amounts.map((amount, i) => {
    const multiplier = Math.max(multiplierFor(plan, amount), 1);
    const walletValue = amount * multiplier;
    const bonusValue = walletValue - amount;
    return {
      id: `PKG_${amount}`,
      label: `Package ${i + 1}`,
      amount,
      multiplier,
      bonusValue,
      walletValue,
      bestFor: PACKAGE_BEST_FOR[i] ?? PACKAGE_BEST_FOR[2],
    };
  });
}

/* ------------------------- the earning example ------------------------- */

export type EarningSplit = {
  productValue: number;
  marginPct: number;
  /** Share of the partner margin handed to the customer as a discount, 0–100. */
  passOnPct: number;
  customerDiscount: number;
  clientPays: number;
  partnerBenefit: number;
};

/**
 * Splits a partner's margin between the discount the customer sees and the reward the
 * partner keeps. At `passOnPct: 0` the partner keeps the whole margin; at 100 the whole
 * margin becomes the customer's discount. The two always add up to the full margin.
 */
export function earningSplit(
  productValue: number,
  marginPct: number,
  passOnPct: number,
): EarningSplit {
  const margin = Math.round((productValue * marginPct) / 100);
  const customerDiscount = Math.round((margin * passOnPct) / 100);
  return {
    productValue,
    marginPct,
    passOnPct,
    customerDiscount,
    clientPays: productValue - customerDiscount,
    partnerBenefit: margin - customerDiscount,
  };
}

/* ----------------------------- support ----------------------------- */

function env(key: "VITE_PARTNER_SUPPORT_PHONE" | "VITE_PARTNER_SUPPORT_WHATSAPP"): string {
  if (typeof import.meta === "undefined") return "";
  const v = (import.meta as { env?: Record<string, string | undefined> }).env?.[key];
  return (v ?? "").trim();
}

/**
 * Partner-desk contact points. Phone and WhatsApp are read from the environment so the
 * live number is never hard-coded here — set `VITE_PARTNER_SUPPORT_PHONE` (E.164, e.g.
 * `+919876543210`) and optionally `VITE_PARTNER_SUPPORT_WHATSAPP`. When unset, the Call
 * and WhatsApp tiles are hidden and only e-mail support is offered.
 */
export const PARTNER_SUPPORT = {
  get phone(): string {
    return env("VITE_PARTNER_SUPPORT_PHONE");
  },
  get whatsapp(): string {
    return env("VITE_PARTNER_SUPPORT_WHATSAPP") || env("VITE_PARTNER_SUPPORT_PHONE");
  },
  email: CONTACT.supportEmail,
};

/** Pretty form of an E.164 number for display: +919876543210 → +91 98765 43210. */
export function prettyPhone(e164: string): string {
  const m = /^\+?(\d{2})(\d{5})(\d{5})$/.exec(e164.replace(/[^\d+]/g, "").replace(/^\+/, ""));
  return m ? `+${m[1]} ${m[2]} ${m[3]}` : e164;
}

/* ------------------------- lead / selection ------------------------- */

export type PartnerLead = {
  fullName: string;
  companyName: string;
  email: string;
  mobile: string;
  state: string;
  district: string;
  address: string;
};

export const LEAD_STORAGE_KEY = "bsoft.partner.lead";
export const PARTNER_SESSION_KEY = "bsoft.partner.session";

/** The visitor's details, as saved when the form was submitted. */
export function readStoredLead(): PartnerLead {
  try {
    const raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PartnerLead> & {
        location?: string;
        city?: string;
        businessName?: string;
      };
      return {
        ...EMPTY_LEAD,
        fullName: parsed.fullName ?? "",
        companyName: parsed.companyName ?? parsed.businessName ?? "",
        email: parsed.email ?? "",
        mobile: parsed.mobile ?? "",
        state: parsed.state ?? "",
        district: parsed.district ?? parsed.city ?? parsed.location ?? "",
        address: parsed.address ?? parsed.location ?? "",
      };
    }
  } catch {
    /* private mode / corrupt entry */
  }
  return EMPTY_LEAD;
}

export const EMPTY_LEAD: PartnerLead = {
  fullName: "",
  companyName: "",
  email: "",
  mobile: "",
  state: "",
  district: "",
  address: "",
};

export function storePartnerSession(payload: Record<string, unknown>): void {
  try {
    sessionStorage.setItem(PARTNER_SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* private mode */
  }
}

export function readPartnerSession(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem(PARTNER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/** Human-readable enquiry body sent with the lead so the partner desk has full context. */
export function leadMessage(lead: PartnerLead, selection?: string): string {
  const lines = [
    "Partner Program enquiry",
    selection ? `Interested in: ${selection}` : null,
    lead.companyName ? `Company: ${lead.companyName}` : null,
    `Address: ${[lead.address, lead.district, lead.state].filter(Boolean).join(", ")}`,
  ];
  return lines.filter(Boolean).join("\n");
}
