import { Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";

export const CRM_PARENT_ORIGIN_EVENT = "crm-parent-origin-updated";
export const CRM_API_BASE_EVENT = "crm-api-base-updated";

/** Angular CRM shell in production (register/login iframe target). */
export const CRM_APP_ORIGIN_PRODUCTION = "https://www.startbusiness.ltd";

declare global {
  interface Window {
    __CRM_PARENT_ORIGIN__?: string;
    __CRM_API_BASE__?: string;
    __crmParentBridgeInstalled__?: boolean;
  }
}

function envCrmBase(): string | null {
  const v =
    typeof import.meta !== "undefined" &&
    (import.meta as { env?: { VITE_CRM_APP_ORIGIN?: string } }).env?.VITE_CRM_APP_ORIGIN;
  if (!v?.trim()) return null;
  return v.trim().replace(/\/$/, "");
}

/** When marketing runs standalone: dev → local Angular; prod build loads the hosted CRM shell. */
function defaultCrmShellOrigin(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.PROD) {
    return CRM_APP_ORIGIN_PRODUCTION;
  }
  return "http://localhost:4200";
}

/**
 * Origin of the Business CRM Angular app (signup / trial / login land here; APIs are called from that app).
 * Priority: iframe postMessage → `VITE_CRM_APP_ORIGIN` → prod/dev default.
 */
export function resolveCrmShellOrigin(): string {
  if (typeof window !== "undefined") {
    const w = window.__CRM_PARENT_ORIGIN__?.trim();
    if (w) return w.replace(/\/$/, "");
  }
  const fromEnv = envCrmBase();
  if (fromEnv) return fromEnv;
  return defaultCrmShellOrigin();
}

/** Same origin as parent shell only when set (embed or env); otherwise null. */
export function getCrmAppBase(): string | null {
  if (typeof window !== "undefined") {
    const w = window.__CRM_PARENT_ORIGIN__?.trim();
    if (w) return w.replace(/\/$/, "");
  }
  return envCrmBase();
}

/** API base from Angular parent (`…/api/`) when embedded — optional for future public calls. */
export function getCrmApiBase(): string | null {
  if (typeof window === "undefined") return null;
  const b = window.__CRM_API_BASE__?.trim();
  return b || null;
}

export function installCrmParentBridge(): void {
  if (typeof window === "undefined") return;
  if (window.__crmParentBridgeInstalled__) return;
  window.__crmParentBridgeInstalled__ = true;
  window.addEventListener("message", (e: MessageEvent) => {
    if (e.data?.action === "SET_PARENT_ORIGIN" && typeof e.data.origin === "string") {
      window.__CRM_PARENT_ORIGIN__ = e.data.origin.replace(/\/$/, "");
      window.dispatchEvent(new CustomEvent(CRM_PARENT_ORIGIN_EVENT));
    }
    if (e.data?.action === "SET_API_BASE" && typeof e.data.apiBase === "string") {
      window.__CRM_API_BASE__ = String(e.data.apiBase).trim();
      window.dispatchEvent(new CustomEvent(CRM_API_BASE_EVENT));
    }
  });
}

export function crmAbsUrl(path: string, baseOverride?: string | null): string {
  const base = (baseOverride != null && String(baseOverride).trim() !== ""
    ? String(baseOverride).trim()
    : resolveCrmShellOrigin()
  ).replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Re-renders when parent sends `SET_PARENT_ORIGIN` (embed) or `SET_API_BASE`. */
export function useCrmAppBase(): string {
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(CRM_PARENT_ORIGIN_EVENT, bump);
    window.addEventListener(CRM_API_BASE_EVENT, bump);
    return () => {
      window.removeEventListener(CRM_PARENT_ORIGIN_EVENT, bump);
      window.removeEventListener(CRM_API_BASE_EVENT, bump);
    };
  }, []);
  return resolveCrmShellOrigin();
}

type CrmKind = "register" | "login";

/**
 * Sign up / trial → `/auth/register` on CRM shell (Angular then calls `auth/register` on api.*).
 * Sign in → `/auth/login`.
 */
export function CtaLink({
  to,
  label,
  className,
  style,
  crm,
}: {
  to: string;
  label: string;
  className: string;
  style?: CSSProperties;
  crm?: CrmKind;
}) {
  const crmBase = useCrmAppBase();
  let href: string | null = null;
  if (crm === "register") href = crmAbsUrl("/auth/register", crmBase);
  else if (crm === "login") href = crmAbsUrl("/auth/login", crmBase);
  const resolved = href ?? to;

  if (href) {
    return (
      <a href={href} className={className} style={style} target="_top" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link to={resolved} className={className} style={style}>
      {label}
    </Link>
  );
}
