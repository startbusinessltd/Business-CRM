import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — StartBusiness.ltd" },
      { name: "description", content: "Simple, transparent pricing. All 6 modules and 30+ AI features included in every plan." },
      { property: "og:title", content: "Pricing — StartBusiness.ltd" },
      { property: "og:description", content: "Every plan, every feature. No per-module surprises." },
      { property: "og:image", content: IMG.handshake },
    ],
  }),
  component: Pricing,
});

const features = [
  "All 6 modules included",
  "30+ AI-powered features",
  "Unlimited pipelines, forms and dashboards",
  "Native WhatsApp / Instagram / Facebook inbox",
  "AI call recording and summaries",
  "Branded GST / tax invoicing",
  "Employee, attendance and performance suite",
  "Role-based access, SSO and 2FA",
  "Priority email support",
];

function PlanCard({
  name, price, period, cta, featured, blurb,
}: { name: string; price: string; period: string; cta: string; featured?: boolean; blurb: string }) {
  return (
    <div className="card-flat" style={{
      padding: 32,
      borderColor: featured ? "var(--ink)" : "var(--line)",
      background: featured ? "var(--ink)" : "var(--card)",
      color: featured ? "var(--ivory)" : "var(--ink)",
    }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 600, color: featured ? "var(--ivory)" : "var(--ink)" }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 14, color: featured ? "oklch(0.85 0.02 250)" : "var(--slate)" }}>{blurb}</div>
      <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em" }}>{price}</span>
        <span style={{ fontSize: 14, color: featured ? "oklch(0.85 0.02 250)" : "var(--slate)" }}>{period}</span>
      </div>
      <Link to="/contact" className="btn" style={{
        marginTop: 24, width: "100%",
        background: featured ? "var(--brass)" : "var(--ink)",
        color: "#fff",
      }}>{cta}</Link>
      <div style={{ height: 1, background: featured ? "rgba(255,255,255,.15)" : "var(--line)", marginBlock: 24 }} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: featured ? "var(--ivory)" : "var(--ink)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brass)", marginTop: 8 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Every plan. Every feature.</>}
        lead="We don't gate modules behind tiers. Pick the billing rhythm that suits your business — every plan ships with all six modules and every AI feature."
        primary={{ to: "/contact", label: "Talk to sales" }}
        secondary={{ to: "/features", label: "See all features" }}
        image={IMG.handshake}
      />

      <section className="section-tight">
        <div className="container-x">
          <div className="grid-3">
            <PlanCard name="Starter" blurb="For small teams getting started." price="$29" period="/ user / month, billed annually" cta="Start 14-day trial" />
            <PlanCard name="Growth" blurb="For growing companies who run multiple teams." price="$59" period="/ user / month, billed annually" cta="Start 14-day trial" featured />
            <PlanCard name="Enterprise" blurb="Custom pricing, security review and SLAs." price="Custom" period="annual contract" cta="Talk to sales" />
          </div>
          <p style={{ textAlign: "center", marginTop: 32, color: "var(--slate)", fontSize: 14 }}>
            All prices in USD. Pay monthly for +20%. Cancel anytime in the first 14 days.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <span className="eyebrow">Frequently asked</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Pricing questions, answered.</h2>
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="faq-grid">
            {[
              ["Are all modules really included?", "Yes — every plan ships with Website, Leads, Calls, Social, Employees and Finance. We never gate modules behind a higher tier."],
              ["Is there a free trial?", "Yes. Every plan starts with a 14-day free trial. No credit card required."],
              ["How does AI usage work?", "AI features (call summaries, suggested replies, anomaly alerts) are included in all plans with fair-use limits. Enterprise has dedicated capacity."],
              ["Can I switch plans?", "Yes — upgrade or downgrade at any time. We pro-rate the difference automatically."],
              ["Do you offer non-profit or startup pricing?", "We offer 30% off for registered non-profits and early-stage startups. Reach out via the contact page."],
              ["Where is data stored?", "Data is stored in the region closest to your team — EU, India or US — with encryption at rest and in transit."],
            ].map(([q, a]) => (
              <div key={q} className="card-flat" style={{ padding: 24 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{q}</div>
                <p style={{ marginTop: 8 }}>{a}</p>
              </div>
            ))}
          </div>
          <style>{`@media (max-width:820px){.faq-grid{grid-template-columns:1fr !important}}`}</style>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
