import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const col = (title: string, items: { to: string; label: string }[]) => (
    <div>
      <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "oklch(0.78 0.02 250)", marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {items.map((i) => (
          <li key={i.to}><Link to={i.to} style={{ color: "oklch(0.92 0.01 250)", fontSize: 14 }}>{i.label}</Link></li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="surface-ink" style={{ marginTop: 0 }}>
      <div className="container-x" style={{ paddingBlock: 72 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 40 }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 22 }}>StartBusiness<span style={{ color: "var(--brass)" }}>.ltd</span></div>
            <p style={{ marginTop: 14, maxWidth: 320 }}>
              The all-in-one operating system for modern businesses. Six modules, thirty plus AI features, one unified workspace.
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <Link to="/pricing" className="btn btn-brass">Start free trial</Link>
              <Link to="/contact" className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>Talk to sales</Link>
            </div>
          </div>
          {col("Modules", [
            { to: "/modules/website", label: "Website Management" },
            { to: "/modules/leads", label: "Lead Management" },
            { to: "/modules/calls", label: "Call Management" },
            { to: "/modules/social", label: "Social Media" },
            { to: "/modules/employees", label: "Employee Management" },
            { to: "/modules/finance", label: "Finance Management" },
          ])}
          {col("Company", [
            { to: "/about", label: "About" },
            { to: "/customers", label: "Customers" },
            { to: "/features", label: "Features" },
            { to: "/contact", label: "Contact" },
          ])}
          {col("Resources", [
            { to: "/features", label: "Platform Tour" },
            { to: "/pricing", label: "Pricing" },
            { to: "/customers", label: "Case Studies" },
          ])}
          {col("Legal", [
            { to: "/contact", label: "Privacy" },
            { to: "/contact", label: "Terms" },
            { to: "/contact", label: "Security" },
          ])}
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13, color: "oklch(0.78 0.02 250)" }}>
          <span>© {new Date().getFullYear()} StartBusiness.ltd — All rights reserved.</span>
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
