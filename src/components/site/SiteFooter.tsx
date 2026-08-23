import { Link } from "@tanstack/react-router";
import { CtaLink } from "@/lib/crm-parent-bridge";
import { BrandTitle } from "@/components/site/BrandTitle";
import { CONTACT } from "@/lib/site-content";

export function SiteFooter() {
  const col = (title: string, items: { to: string; label: string; hash?: string }[]) => (
    <div className="footer-col">
      <div className="footer-col__title">{title}</div>
      <ul className="footer-col__list">
        {items.map((i) => (
          <li key={`${i.to}${i.hash ? `#${i.hash}` : ""}-${i.label}`}>
            <Link to={i.to} hash={i.hash} className="footer-link">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="surface-ink" style={{ marginTop: 0 }}>
      <div className="container-x" style={{ paddingBlock: 72 }}>
        <div className="footer-grid">
          <div className="footer-brand-col" style={{ minWidth: 0 }}>
            <div className="site-footer-brand">
              <img
                src="/logo.png"
                alt="B-SOFT"
                width={64}
                height={64}
                className="site-brand-logo"
              />
              <BrandTitle className="site-brand-title--footer" />
            </div>
            <p style={{ marginTop: 14, maxWidth: 320 }}>
              B-SOFT helps Indian SMBs run websites, leads, calls, social, team access, and
              billing from one CRM — with a built-in AI assistant.
            </p>
            <p
              style={{
                marginTop: 14,
                maxWidth: 320,
                fontSize: 13,
                lineHeight: 1.55,
                color: "var(--on-dark-muted)",
                whiteSpace: "pre-line",
              }}
            >
              {CONTACT.office}
            </p>
            <div className="footer-cta-row" style={{ marginTop: 18 }}>
              <CtaLink
                to="/pricing"
                label="Register now"
                className="btn btn-brass"
                crm="register"
              />
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}
              >
                Talk to sales
              </Link>
            </div>
          </div>
          {col("Services", [
            { to: "/modules/website", label: "Website & web builder" },
            { to: "/modules/leads", label: "Leads & CRM" },
            { to: "/modules/calls", label: "Call Tracker" },
            { to: "/modules/social", label: "Social Hub" },
            { to: "/modules/employees", label: "Team & permissions" },
            { to: "/modules/finance", label: "Finance & billing" },
          ])}
          {col("Company", [
            { to: "/about", label: "About" },
            { to: "/customers", label: "Customers" },
            { to: "/features", label: "Features" },
            { to: "/contact", label: "Contact" },
          ])}
          {col("Resources", [
            { to: "/services", label: "All services" },
            { to: "/features", label: "Features" },
            { to: "/pricing", label: "Pricing" },
            { to: "/customers", label: "Customers" },
          ])}
          {col("Legal", [
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
            { to: "/refund", label: "Refunds" },
            { to: "/privacy", label: "Security", hash: "data-security" },
          ])}
        </div>
        <div
          className="footer-bottom-bar"
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            gap: 12,
            fontSize: 13,
            color: "var(--on-dark-muted)",
          }}
        >
          <span>© {new Date().getFullYear()} B-SOFT — All rights reserved.</span>
          <span>Made for operators who want one platform, not ten.</span>
        </div>
      </div>
    </footer>
  );
}
