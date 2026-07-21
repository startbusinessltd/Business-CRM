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
