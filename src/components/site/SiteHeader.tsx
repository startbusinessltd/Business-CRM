import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CtaLink } from "@/lib/crm-parent-bridge";

const MOBILE_MAX = 920;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <img
            src="/sb-logo.svg"
            alt="Business CRM"
            width={36}
            height={36}
            className="site-brand-logo"
          />
          <span className="site-brand-title site-brand-title--header">Business CRM</span>
        </Link>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="site-nav">
          <Link to="/about" className="navlink">
            About
          </Link>
          <Link to="/features" className="navlink">
            Features
          </Link>
          <Link to="/services" className="navlink">
            Services
          </Link>
          <Link to="/customers" className="navlink">
            Customers
          </Link>
          <Link to="/pricing" className="navlink">
            Pricing
          </Link>
          <Link to="/contact" className="navlink">
            Contact
          </Link>
        </nav>

        <div className="site-header-desktop-ctas" style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <CtaLink to="/contact" label="Sign in" className="btn btn-ghost" crm="login" />
          <CtaLink
            to="/pricing"
            label="Start 10-day trial"
            className="btn btn-primary"
            crm="register"
          />
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
              <Link key={to} to={to} className="navlink" onClick={close} style={{ padding: "10px 0" }}>
                {label}
              </Link>
            ))}
          </div>
          <div className="site-mobile-ctas">
            <CtaLink to="/contact" label="Sign in" className="btn btn-ghost" crm="login" />
            <CtaLink to="/pricing" label="Start 10-day trial" className="btn btn-primary" crm="register" />
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
