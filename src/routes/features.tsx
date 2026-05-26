import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Platform Features — StartBusiness.ltd" },
      { name: "description", content: "Thirty plus features across six modules — websites, leads, calls, social, employees and finance — all with AI woven in." },
      { property: "og:title", content: "Features — StartBusiness.ltd" },
      { property: "og:description", content: "Every feature, every module, one platform." },
      { property: "og:image", content: IMG.dashboard },
    ],
  }),
  component: Features,
});

const modules = [
  { to: "/modules/website", n: "01", t: "Website Management", img: IMG.website,
    items: ["Templates library", "Website settings & SEO", "Website admin & roles", "One-click publishing"] },
  { to: "/modules/leads", n: "02", t: "Lead Management", img: IMG.meeting,
    items: ["Multi-stage pipelines", "Drag-and-drop form builder", "Lead dashboards & sources", "Signup lead capture", "Task reminders & to-do list", "Appointments & calendars", "AI next-step guidance"] },
  { to: "/modules/calls", n: "03", t: "Call Management", img: IMG.callcenter,
    items: ["AI call assistant", "Real-time call overview", "Call reports & analytics", "Searchable call recordings", "AI-generated call summaries"] },
  { to: "/modules/social", n: "04", t: "Social Media", img: IMG.socialmarketing,
    items: ["WhatsApp business inbox", "Instagram DMs & comments", "Facebook pages & ads", "SEO / GEO optimisation"] },
  { to: "/modules/employees", n: "05", t: "Employee Management", img: IMG.employees,
    items: ["Access profiles & roles", "Employee tracking", "Performance reviews", "Timesheets", "Attendance & leave", "Partner & vendor onboarding"] },
  { to: "/modules/finance", n: "06", t: "Finance Management", img: IMG.finance,
    items: ["Invoicing", "Product & SKU management", "Customer ledgers", "GST / tax invoices", "Transaction management & reconciliation"] },
];

function Features() {
  return (
    <>
      <PageHero
        eyebrow="The full platform"
        title={<>Thirty plus features. <em style={{ fontStyle: "italic", color: "var(--brass-ink)", fontWeight: 500 }}>Six</em> modules. One workspace.</>}
        lead="Every plan includes every feature. We don't gate modules, charge per-seat surprises, or hide capabilities behind enterprise tiers."
        primary={{ to: "/pricing", label: "See pricing" }}
        secondary={{ to: "/contact", label: "Book a guided tour" }}
        image={IMG.dashboard}
      />

      {modules.map((m, idx) => (
        <section key={m.t} className="section-tight" style={{ background: idx % 2 ? "var(--paper)" : "var(--ivory)" }}>
          <div className="container-x">
            <div className="feature-row" style={idx % 2 ? { direction: "rtl" } : undefined}>
              <div style={{ direction: "ltr" }}>
                <div className="num-tag">MODULE {m.n}</div>
                <h2 className="h-section" style={{ marginTop: 8 }}>{m.t}</h2>
                <ul style={{ marginTop: 18, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {m.items.map((it) => (
                    <li key={it} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "var(--ink)", fontSize: 15 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brass)", marginTop: 9 }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link to={m.to} className="btn btn-ghost" style={{ marginTop: 22 }}>Explore module →</Link>
              </div>
              <div className="media-frame" style={{ direction: "ltr", aspectRatio: "5/4" }}>
                <img src={m.img} alt={m.t} loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
