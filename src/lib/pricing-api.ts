import { getCrmApiBase } from "@/lib/crm-parent-bridge";

/** Production gateway — matches startbusinessltd-ui `environments.prod.ts` apiUrl. */
const DEFAULT_API_BASE = "https://api.bsoft.ltd/api/";
/** Local gateway — matches startbusinessltd-ui `environments.ts` apiUrl (SB-GATEWAY-SERVICE :8013). */
const DEV_GATEWAY_API_BASE = "http://localhost:8013/api/";

function resolveApiBase(): string {
  const fromParent = getCrmApiBase();
  if (fromParent) return fromParent.endsWith("/") ? fromParent : `${fromParent}/`;

  const fromEnv =
    typeof import.meta !== "undefined" &&
    (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE?.trim();
  if (fromEnv) return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;

  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    return DEV_GATEWAY_API_BASE;
  }

  return DEFAULT_API_BASE;
}

/** PUBLIC platform subscription plans endpoint (no auth). */
export function platformPackagesUrl(): string {
  return `${resolveApiBase()}operation/public/packages/get-all`;
}

export type PackageFeature = {
  packagesFeaturesId: number;
  data: string;
};

export type PricingPlan = {
  packagesId: number;
  packagesName: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  period: number;
  /**
   * Per-term pricing (op V52). Optional, not merely nullable: the hard-coded offline fallback
   * plans below have no per-term prices at all, and a plan that has never been given a monthly
   * price should read as "not sold monthly" rather than force a placeholder into every literal.
   */
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
  /** Server-computed price actually charged per term, honouring the plan's discount flag. */
  monthlySellingPrice?: number | null;
  yearlySellingPrice?: number | null;
  packagesTypeId: number;
  packagesTypeName: string;
  color?: string | null;
  features: string[];
  /** Partner economics from the linked plan-type (public API). */
  commissionPct: number | null;
  walletCharge: number | null;
};

type RawFeature = { packagesFeaturesId?: number; data?: string };
type RawPackage = {
  packagesId: number;
  packagesName: string;
  description?: string;
  price: number;
  discountedPrice?: number | null;
  period: number;
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
  monthlySellingPrice?: number | string | null;
  yearlySellingPrice?: number | string | null;
  packagesTypeId?: number;
  packagesTypeName?: string;
  color?: string | null;
  partnerCommissionPct?: number | string | null;
  partnerWalletCharge?: number | string | null;
  packagesFeaturesResponse?: RawFeature[] | null;
};

function num(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalize(raw: RawPackage): PricingPlan {
  return {
    packagesId: raw.packagesId,
    packagesName: raw.packagesName,
    description: raw.description ?? "",
    price: raw.price,
    discountedPrice: raw.discountedPrice ?? null,
    period: raw.period ?? 12,
    monthlyPrice: raw.monthlyPrice ?? null,
    yearlyPrice: raw.yearlyPrice ?? null,
    // num(): the server sends these as BigDecimal, which serialises as a number but can arrive as
    // a string through some proxies.
    monthlySellingPrice: num(raw.monthlySellingPrice),
    yearlySellingPrice: num(raw.yearlySellingPrice),
    packagesTypeId: raw.packagesTypeId ?? 0,
    packagesTypeName: raw.packagesTypeName ?? "",
    color: raw.color ?? null,
    commissionPct: num(raw.partnerCommissionPct),
    walletCharge: num(raw.partnerWalletCharge),
    features: (raw.packagesFeaturesResponse ?? [])
      .map((f) => (f?.data ?? "").trim())
      .filter(Boolean),
  };
}

/**
 * Fetch active platform subscription plans from the public API.
 * Returns [] on any failure so the caller can fall back to static content.
 */
export async function fetchPricingPlans(signal?: AbortSignal): Promise<PricingPlan[]> {
  try {
    const res = await fetch(platformPackagesUrl(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
    if (!res.ok) return [];

    const body = (await res.json()) as { responsePayload?: RawPackage[] | null };
    const list = body?.responsePayload;
    if (!Array.isArray(list) || list.length === 0) return [];

    return list.map(normalize).sort((a, b) => a.price - b.price);
  } catch {
    return [];
  }
}

/** ₹ formatting with Indian digit grouping. */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
