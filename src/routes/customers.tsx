import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Business CRM" },
      { name: "description", content: "How modern teams use Business CRM to replace four tools, save hours per week and grow revenue." },
      { property: "og:title", content: "Customers — Business CRM" },
      { property: "og:description", content: "Real businesses, real numbers, one platform." },
      { property: "og:image", content: IMG.team },
    ],
  }),
  component: Customers,
});

const stories = [
  {
    img: IMG.customer1,
    who: "Neha Singh",
    role: "Client",
    quote:
      "Business CRM gave me everything I needed — website, CRM, and full setup. I started my business in just 48 hours. Amazing support!",
    stat: "48 hrs · business live",
  },
  {
    img: IMG.customer3,
    who: "Ravi Kumar V",
    role: "Business Man",
    quote:
      "Business CRM made my dream of becoming an entrepreneur easy. From website to CRM and training — everything was provided. I started earning in my first month.",
    stat: "1st month · earning",
  },
  {
    img: IMG.customer2,
    who: "Prakash Rao",
    role: "Entrepreneur",
    quote:
      "With Business CRM, I didn't need any technical knowledge. They built my website, CRM, and guided me step by step. Today I run my own service business confidently.",
    stat: "Guided setup · no code",
  },
];

function Customers() {
  return (
    <>
      <PageHero
        eyebrow="Customer stories"
        title={<>Built for operators. Loved by their teams.</>}
        lead="From boutique agencies and clinics to multi-branch retailers and BPOs, businesses use Business CRM to consolidate four tools into one — and to run their day from a single screen."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/contact", label: "Become a case study" }}
        image={IMG.team}
      />

      <StatStrip items={[
        { n: "2,400+", l: "Active businesses" },
        { n: "38", l: "Countries" },
        { n: "4.8 / 5", l: "Average rating" },
        { n: "92%", l: "Year-2 retention" },
      ]} />

      <section className="section">
        <div className="container-x">
          <div className="grid-2" style={{ gap: 28 }}>
            {stories.map((s) => (
              <article key={s.who} className="card-flat" style={{ overflow: "hidden", display: "grid", gridTemplateColumns: "180px 1fr" }}>
                <div style={{ background: "var(--paper)" }}>
                  <img src={s.img} alt={s.who} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 24 }}>
                  <div className="pill">{s.stat}</div>
                  <p style={{ marginTop: 14, fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.45, color: "var(--ink)" }}>
                    “{s.quote}”
                  </p>
                  <div style={{ marginTop: 14, fontSize: 14, color: "var(--slate)" }}>
                    <strong style={{ color: "var(--ink)" }}>{s.who}</strong> · {s.role}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <span className="eyebrow">Trusted across industries</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>From clinics to consultancies.</h2>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, alignItems: "center" }} className="logos-grid">
            {["Brightleaf", "NovaCRM", "Finch & Co.", "Indigo Health", "Northwind", "Atlas BPO"].map((n) => (
              <div key={n} className="card-flat" style={{ padding: "18px 12px", textAlign: "center", fontFamily: "var(--serif)", fontWeight: 600, color: "var(--ink)" }}>{n}</div>
            ))}
          </div>
          <style>{`
            @media (max-width: 900px){.logos-grid{grid-template-columns:repeat(3,1fr) !important}}
            @media (max-width: 520px){.logos-grid{grid-template-columns:repeat(2,1fr) !important}}
          `}</style>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
