import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(252,251,247,0.92)" : "var(--ivory)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(10px)" : undefined,
      }}
    >
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 30, height: 30, background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontWeight: 700, borderRadius: 4 }}>S</span>
          <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 20, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            StartBusiness<span style={{ color: "var(--brass)" }}>.ltd</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="site-nav">
          <Link to="/about" className="navlink">About</Link>
          <Link to="/features" className="navlink">Features</Link>
          <Link to="/modules/leads" className="navlink">Modules</Link>
          <Link to="/customers" className="navlink">Customers</Link>
          <Link to="/pricing" className="navlink">Pricing</Link>
          <Link to="/contact" className="navlink">Contact</Link>
        </nav>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/contact" className="btn btn-ghost">Sign in</Link>
          <Link to="/pricing" className="btn btn-primary">Start free trial</Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="site-burger"
          style={{ display: "none", background: "transparent", border: "1px solid var(--line)", borderRadius: 4, padding: "8px 10px" }}
        >☰</button>
      </div>

      {open && (
        <div className="container-x" style={{ paddingBottom: 16, display: "grid", gap: 10 }}>
          {[
            ["/about", "About"], ["/features", "Features"], ["/modules/website", "Website"],
            ["/modules/leads", "Leads"], ["/modules/calls", "Calls"], ["/modules/social", "Social"],
            ["/modules/employees", "Employees"], ["/modules/finance", "Finance"],
            ["/customers", "Customers"], ["/pricing", "Pricing"], ["/contact", "Contact"],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="navlink" onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 920px) {
          .site-nav { display: none !important; }
          .site-burger { display: inline-flex !important; }
          header .btn-ghost { display: none; }
        }
      `}</style>
    </header>
  );
}
