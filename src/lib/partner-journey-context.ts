import { createContext, useContext, useSyncExternalStore } from "react";

/** Steps of the partner modal (see `components/site/PartnerJourney.tsx`). */
export type PartnerJourneyStep = "details" | "review" | "success";

export type PartnerProgramCode = "ASSOCIATE" | "FRANCHISE";

export type PartnerJourneyApi = {
  /** Open the modal (defaults to the details form). */
  open: (step?: PartnerJourneyStep) => void;
  /** Open the payment review for a selection made on the /partner page. */
  openReview: (program: PartnerProgramCode, packageId?: string) => void;
  close: () => void;
};

export const PartnerJourneyCtx = createContext<PartnerJourneyApi | null>(null);

export function usePartnerJourney(): PartnerJourneyApi {
  const ctx = useContext(PartnerJourneyCtx);
  if (!ctx) throw new Error("usePartnerJourney must be used inside <PartnerJourneyProvider>");
  return ctx;
}

/** sessionStorage flag set once the visitor has verified OTP this session. */
export const PARTNER_UNLOCKED_KEY = "bsoft.partner.unlocked";
/** Fired on window whenever the unlock state changes, so the /partner page re-renders. */
export const PARTNER_UNLOCKED_EVENT = "bsoft-partner-unlocked";

export function isPartnerUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(PARTNER_UNLOCKED_KEY) === "1") return true;
  } catch {
    /* private mode */
  }
  // OTP success lands with ?registered=true (also accept legacy / JSON-quoted forms).
  try {
    return isRegisteredSearchValue(new URLSearchParams(window.location.search).get("registered"));
  } catch {
    return false;
  }
}

/** True for true / 1 / "1" / "true" / JSON-quoted "\"1\"". */
export function isRegisteredSearchValue(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value !== "string") return false;
  const v = value.trim().replace(/^"|"$/g, "");
  return v === "1" || v === "true" || v.toLowerCase() === "yes";
}

export function unlockPartner(): void {
  try {
    sessionStorage.setItem(PARTNER_UNLOCKED_KEY, "1");
  } catch {
    /* private mode — the event still unlocks the current page view */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PARTNER_UNLOCKED_EVENT));
  }
}

/**
 * Partner registration page after OTP.
 * Use `registered=true` (boolean) — TanStack JSON-encodes string "1" as %221%22 which breaks unlock.
 */
export function partnerRegistrationPath(): string {
  return "/partner?registered=true#programs";
}

export function partnerRegistrationUrl(
  origin = typeof window !== "undefined" ? window.location.origin : "",
): string {
  return `${origin}${partnerRegistrationPath()}`;
}

function subscribePartnerUnlocked(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(PARTNER_UNLOCKED_EVENT, onChange);
  return () => window.removeEventListener(PARTNER_UNLOCKED_EVENT, onChange);
}

/** Reactive unlock flag — safe for SSR (server snapshot is always false). */
export function useIsPartnerUnlocked(): boolean {
  return useSyncExternalStore(subscribePartnerUnlocked, isPartnerUnlocked, () => false);
}
