import { getCrmApiBase } from "@/lib/crm-parent-bridge";

/** Production gateway — matches startbusinessltd-ui `environments.prod.ts` apiUrl. */
const DEFAULT_API_BASE = "https://api.startbusiness.ltd/api/";
/** Local gateway — matches startbusinessltd-ui `environments.ts` apiUrl (SB-GATEWAY-SERVICE :8013). */
const DEV_GATEWAY_API_BASE = "http://localhost:8013/api/";

/**
 * API base resolution (same order as template iframes fed by Angular parent):
 * 1. Parent postMessage SET_API_BASE (environment.apiUrl from startbusinessltd-ui)
 * 2. VITE_API_BASE
 * 3. Dev standalone: direct gateway http://localhost:8013/api/ (not /api/ on :5180)
 * 4. Production build: api.startbusiness.ltd
 */
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

/** Full URL for contact/book — used for clearer dev error messages. */
export function contactBookUrl(): string {
  return `${resolveApiBase()}operation/public/contact/book`;
}

export type ContactLeadPayload = {
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  businessName?: string;
  message?: string;
  websiteId?: number;
  domain?: string;
};

export function splitFullName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "." };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Strip formatting; returns 10-digit Indian mobile or empty if invalid length. */
export function normalizeIndianMobile(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function isValidIndianMobile(raw: string): boolean {
  const digits = normalizeIndianMobile(raw);
  return /^[6-9]\d{9}$/.test(digits);
}

function extractErrorMessage(body: Record<string, unknown> | null, status: number): string {
  if (!body) return `Request failed (${status})`;
  const nested = body.responsePayload as Record<string, unknown> | undefined;
  return (
    (body.message as string | undefined) ||
    (nested?.message as string | undefined) ||
    (body.error as string | undefined) ||
    `Request failed (${status})`
  );
}

function contactWebsiteId(): number | undefined {
  const raw =
    typeof import.meta !== "undefined" &&
    (import.meta as { env?: { VITE_CONTACT_WEBSITE_ID?: string } }).env?.VITE_CONTACT_WEBSITE_ID?.trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export async function submitContactLead(
  payload: ContactLeadPayload,
): Promise<{ ok: boolean; message: string }> {
  const url = contactBookUrl();
  const websiteId = payload.websiteId ?? contactWebsiteId();
  const bodyPayload = {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim() || ".",
    workEmail: payload.workEmail.trim(),
    phoneNumber: payload.phoneNumber,
    businessName: payload.businessName?.trim() || "Not provided",
    message: payload.message?.trim() || "",
    ...(websiteId != null ? { websiteId } : {}),
    domain:
      payload.domain?.trim() ||
      (typeof import.meta !== "undefined" &&
        (import.meta as { env?: { VITE_CONTACT_WEBSITE_DOMAIN?: string } }).env?.VITE_CONTACT_WEBSITE_DOMAIN?.trim()) ||
      "businesscrm.co.in",
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(bodyPayload),
    });
  } catch {
    const hint =
      typeof import.meta !== "undefined" && import.meta.env?.DEV
        ? ` Start the gateway on port 8013 (${DEV_GATEWAY_API_BASE}) — same as startbusinessltd-ui environment.apiUrl.`
        : "";
    return {
      ok: false,
      message: `Could not reach the server.${hint} Please try again or email us directly.`,
    };
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    /* non-JSON error body */
  }

  const statusCode = body?.statusCode as number | undefined;
  const apiFailed =
    !res.ok || (statusCode != null && statusCode >= 400 && statusCode !== 200 && statusCode !== 201);

  if (apiFailed) {
    const message = extractErrorMessage(body, res.status);
    if (message === `Request failed (${res.status})` && res.status >= 500) {
      return {
        ok: false,
        message:
          "Our contact service is temporarily unavailable. Please try again shortly or email us directly.",
      };
    }
    return { ok: false, message };
  }

  const message =
    ((body?.responsePayload as Record<string, unknown> | undefined)?.message as string | undefined) ||
    (body?.message as string | undefined) ||
    "Thank you — our team will reply within 24 hours.";

  return { ok: true, message };
}
