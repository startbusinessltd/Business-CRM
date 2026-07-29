import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CtaLink } from "@/lib/crm-parent-bridge";
import { BrandTitle } from "@/components/site/BrandTitle";
import { PartnerCta } from "@/components/site/PartnerJourney";

const MOBILE_MAX = 920;

const DESKTOP_NAV: { to: string; label: string }[] = [
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/services", label: "Services" },
  { to: "/customers", label: "Customers" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

function navLinkClass(pathname: string, to: string) {
  const active = pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
  return active ? "navlink navlink--active" : "navlink";
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_MAX) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = () => setOpen(false);

  const mobileLinks: [string, string][] = [
    ["/about", "About"],
    ["/features", "Features"],
    ["/services", "All services"],
    ["/modules/website", "Website & web builder"],
    ["/modules/leads", "Leads & CRM"],
    ["/modules/calls", "Call Tracker"],
    ["/modules/social", "Social Hub"],
    ["/modules/employees", "Team & permissions"],
    ["/modules/finance", "Finance & billing"],
    ["/customers", "Customers"],
    ["/pricing", "Pricing"],
    ["/contact", "Contact"],
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "color-mix(in srgb, var(--ivory) 94%, transparent)" : "var(--ivory)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(10px)" : undefined,
      }}
    >
      <div
        className="container-x site-header-bar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          minHeight: 72,
        }}
      >
        <Link to="/" className="site-brand-lockup">
          <img src="/logo.png" alt="B-SOFT" width={56} height={56} className="site-brand-logo" />
          <BrandTitle className="site-brand-title--header" />
        </Link>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="site-nav">
          {DESKTOP_NAV.map(({ to, label }) => (
            <Link key={to} to={to} className={navLinkClass(pathname, to)}>
              {label}
            </Link>
          ))}
        </nav>

        <div
          className="site-header-desktop-ctas"
          style={{ display: "flex", gap: 10, flexShrink: 0 }}
        >
          <CtaLink to="/contact" label="Sign in" className="btn btn-ghost" crm="login" />
          <PartnerCta label="Become Partner" className="btn btn-ghost" />
          <CtaLink to="/pricing" label="Register now" className="btn btn-primary" crm="register" />
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="site-burger"
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid var(--line)",
            borderRadius: 4,
            padding: "8px 10px",
            flexShrink: 0,
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="container-x site-mobile-panel" style={{ paddingBottom: 16 }}>
          <div style={{ display: "grid", gap: 4 }}>
            {mobileLinks.map(([to, label]) => (
              <Link key={to} to={to} className={navLinkClass(pathname, to)} onClick={close}>
                {label}
              </Link>
            ))}
          </div>
          <div className="site-mobile-ctas">
            <CtaLink to="/contact" label="Sign in" className="btn btn-ghost" crm="login" />
            <PartnerCta label="Become Partner" className="btn btn-ghost" onClick={close} />
            <CtaLink
              to="/pricing"
              label="Register now"
              className="btn btn-primary"
              crm="register"
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: ${MOBILE_MAX}px) {
          .site-nav { display: none !important; }
          .site-header-desktop-ctas { display: none !important; }
          .site-burger { display: inline-flex !important; align-items: center; justify-content: center; }
        }
        @media (min-width: ${MOBILE_MAX + 1}px) {
          .site-burger { display: none !important; }
        }
      `}</style>
    </header>
  );
}
