import { Link } from "@tanstack/react-router";
import { CtaLink } from "@/lib/crm-parent-bridge";

export function SiteFooter() {
  const col = (title: string, items: { to: string; label: string; hash?: string }[]) => (
    <div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--on-dark-muted)",
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {items.map((i) => (
          <li key={`${i.to}${i.hash ? `#${i.hash}` : ""}-${i.label}`}>
            <Link to={i.to} hash={i.hash} style={{ color: "var(--on-dark-link)", fontSize: 14 }}>
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
        <div
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 40 }}
          className="footer-grid"
        >
          <div style={{ minWidth: 0 }}>
            <div className="site-footer-brand">
              <img
                src="/sb-logo.svg"
                alt="Business CRM"
                width={44}
                height={44}
                className="site-brand-logo"
              />
              <div className="site-brand-title site-brand-title--footer">Business CRM</div>
            </div>
            <p style={{ marginTop: 14, maxWidth: 320 }}>
              Business CRM helps Indian SMBs run websites, leads, calls, social, team access, and
              billing from one CRM — with a built-in AI assistant.
            </p>
            <div className="footer-cta-row" style={{ marginTop: 18 }}>
              <CtaLink
                to="/pricing"
                label="Start 10-day trial"
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
          <span>© {new Date().getFullYear()} Business CRM — All rights reserved.</span>
          <span>Made for operators who want one platform, not ten.</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 920px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
