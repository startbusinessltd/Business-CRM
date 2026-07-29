import { resolveApiBase } from "@/lib/contact-lead-api";

/**
 * Partner enquiry OTP — same auth endpoints used by startbusinessltd-ui
 * partner-register + mobile verification.
 *
 * Submit form  → POST auth/partner/register  (creates partner + SMS OTP)
 * Resend OTP   → POST auth/send-mobile-otp?email=
 * Verify OTP   → GET  auth/verify-mobile-otp?email=&otp=&issueSession=true
 */

export type PartnerRegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  companyName: string;
  state: string;
  district: string;
};

type ApiResult = { ok: boolean; message: string };

export type VerifyOtpResult = ApiResult & {
  /** Login payload when the backend issues a session after OTP. */
  session?: Record<string, unknown>;
};

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

function isApiOk(res: Response, body: Record<string, unknown> | null): boolean {
  const statusCode = body?.statusCode as number | undefined;
  if (statusCode != null && statusCode >= 400 && statusCode !== 200 && statusCode !== 201) {
    return false;
  }
  return res.ok;
}

async function parseJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function networkFail(hint?: string): ApiResult {
  return {
    ok: false,
    message: hint
      ? `Could not reach the server. ${hint}`
      : "Could not reach the server. Please try again.",
  };
}

const DEV_GATEWAY_HINT =
  "Start SB-GATEWAY-SERVICE on port 8013 (API), then retry.";

/** Register partner and trigger SMS OTP to the given mobile. */
export async function registerPartnerAndSendOtp(body: PartnerRegisterBody): Promise<ApiResult> {
  const url = `${resolveApiBase()}auth/partner/register`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim() || ".",
        email: body.email.trim(),
        phoneNumber: body.phoneNumber,
        address: body.address.trim(),
        companyName: body.companyName.trim(),
        state: body.state.trim(),
        district: body.district.trim(),
      }),
    });
  } catch {
    return networkFail(
      typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
    );
  }

  const json = await parseJson(res);
  if (!isApiOk(res, json)) {
    // Vite proxy returns 500/502 when nothing is listening on :8013.
    if (res.status === 500 || res.status === 502 || res.status === 504) {
      return networkFail(
        typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
      );
    }
    return { ok: false, message: extractErrorMessage(json, res.status) };
  }

  const payload = json?.responsePayload as Record<string, unknown> | null;
  if (payload?.otpSent === false) {
    return {
      ok: false,
      message:
        (json?.message as string | undefined) ||
        "Partner registered, but OTP SMS could not be sent. Please try Resend OTP.",
    };
  }

  return {
    ok: true,
    message: (json?.message as string | undefined) || "OTP sent to your mobile number.",
  };
}

/** Resend mobile OTP for a partner/register email. */
export async function sendPartnerMobileOtp(email: string): Promise<ApiResult> {
  const url = `${resolveApiBase()}auth/send-mobile-otp?email=${encodeURIComponent(email.trim())}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: null,
    });
  } catch {
    return networkFail(
      typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
    );
  }

  const json = await parseJson(res);
  if (!isApiOk(res, json)) {
    if (res.status === 500 || res.status === 502 || res.status === 504) {
      return networkFail(
        typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
      );
    }
    return { ok: false, message: extractErrorMessage(json, res.status) };
  }

  if (json?.responsePayload === false) {
    return {
      ok: false,
      message:
        (json?.message as string | undefined) ||
        "OTP SMS could not be sent. Please try again shortly.",
    };
  }

  return {
    ok: true,
    message: (json?.message as string | undefined) || "OTP resent to your mobile.",
  };
}

/**
 * Verify the 6-digit mobile OTP and issue a login session (same as CRM verification).
 */
export async function verifyPartnerMobileOtp(
  email: string,
  otp: string,
): Promise<VerifyOtpResult> {
  const url =
    `${resolveApiBase()}auth/verify-mobile-otp` +
    `?email=${encodeURIComponent(email.trim())}` +
    `&otp=${encodeURIComponent(otp.trim())}` +
    `&issueSession=true`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch {
    return networkFail(
      typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
    );
  }

  const json = await parseJson(res);
  if (!isApiOk(res, json)) {
    if (res.status === 500 || res.status === 502 || res.status === 504) {
      return networkFail(
        typeof import.meta !== "undefined" && import.meta.env?.DEV ? DEV_GATEWAY_HINT : undefined,
      );
    }
    return { ok: false, message: extractErrorMessage(json, res.status) };
  }

  const payload = json?.responsePayload;
  let session: Record<string, unknown> | undefined;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.token === "string" && obj.token) {
      session = obj;
    }
  }

  return {
    ok: true,
    message: (json?.message as string | undefined) || "Mobile verified.",
    session,
  };
}

/**
 * Fragment for the CRM sign-in bridge: `{crm}/auth/partner-handoff#session=<this>`.
 * Must stay decodable by PartnerHandoffComponent.readSessionFromHash — base64url of
 * the UTF-8 JSON (atob + escape/decodeURIComponent on the Angular side).
 */
export function encodePartnerHandoffSession(session: Record<string, unknown>): string {
  const json = JSON.stringify(slimPartnerSession(session));
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** True when the backend login payload is a real partner portal account (not a CRM/client user). */
export function isPartnerPortalSession(session: Record<string, unknown> | null | undefined): boolean {
  if (!session) return false;
  if (session.partnerPortal === true) return true;
  return String(session.role ?? "").toUpperCase() === "PARTNER";
}

/**
 * Compact session for cross-origin URL handoff (full login payloads are too large for #hash).
 * Never invent partnerPortal — only partners may enter /onboarding (select-plan needs partner_master).
 */
export function slimPartnerSession(session: Record<string, unknown>): Record<string, unknown> {
  const partnerPortal = isPartnerPortalSession(session);
  return {
    token: session.token,
    userMasterId: session.userMasterId ?? 0,
    firstName: session.firstName ?? "",
    lastName: session.lastName ?? "",
    displayName: session.displayName ?? null,
    email: session.email ?? "",
    phoneNumber: session.phoneNumber ?? "",
    role: partnerPortal ? session.role || "PARTNER" : session.role ?? "",
    partnerPortal,
    partnerOnboardingStage: partnerPortal
      ? (session.partnerOnboardingStage || "REGISTERED")
      : (session.partnerOnboardingStage ?? null),
    partnerActivationPending: partnerPortal
      ? (session.partnerActivationPending ?? true)
      : (session.partnerActivationPending ?? false),
    partnerPlanId: session.partnerPlanId ?? null,
    businessTypeId: session.businessTypeId ?? null,
    businessType: session.businessType ?? null,
    webTypeId: session.webTypeId ?? null,
    webType: session.webType ?? null,
    crmId: session.crmId ?? null,
    packagesTypeId: session.packagesTypeId ?? null,
    isActive: session.isActive ?? 1,
  };
}
