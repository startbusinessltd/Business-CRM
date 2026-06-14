import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";
import { CtaLink, useCrmAppBase, crmAbsUrl } from "@/lib/crm-parent-bridge";
import { PRICING_FEATURES } from "@/lib/site-content";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Business CRM" },
      {
        name: "description",
        content:
          "Simple INR yearly pricing. Website, leads, calls, social, employees and finance included.",
      },
      { property: "og:title", content: "Pricing — Business CRM" },
      {
        property: "og:description",
        content: "₹10,000/year. Every core module included.",
      },
      { property: "og:image", content: IMG.pricing },
    ],
  }),
  component: Pricing,
});

const pricingFeatures = [...PRICING_FEATURES];

function PlanCard({
  name,
  blurb,
  price,
  period,
  priceWas,
  saveNote,
  cta,
  featured,
  badge,
  ctaHref,
}: {
  name: string;
  blurb: string;
  price: string;
  period: string;
  priceWas: string;
  saveNote: string;
  cta: string;
  featured?: boolean;
  badge?: string;
  ctaHref: string;
}) {
  const muted = featured ? "var(--on-dark-muted)" : "var(--slate)";
  return (
    <div
      className="card-flat"
      style={{
        position: "relative",
        padding: "clamp(20px, 5vw, 32px)",
        paddingTop: badge ? "clamp(28px, 6vw, 40px)" : undefined,
        borderColor: featured ? "var(--purple-mid)" : "var(--line)",
        background: featured ? "var(--purple-deep)" : "var(--card)",
        color: featured ? "var(--ivory)" : "var(--ink)",
      }}
    >
      {badge ? (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--brass)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 999,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          fontWeight: 600,
          color: featured ? "var(--ivory)" : "var(--ink)",
        }}
      >
        {name}
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: muted }}>{blurb}</div>
      <div
        style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}
      >
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(32px, 10vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {price}
        </span>
        <span style={{ fontSize: 14, color: muted }}>{period}</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 14, color: muted, textDecoration: "line-through" }}>
          {priceWas}
        </span>
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 600,
            color: featured ? "var(--ivory)" : "var(--ink)",
            background: featured ? "rgba(255,255,255,.12)" : "var(--gold-soft)",
            padding: "4px 10px",
            borderRadius: 999,
            width: "fit-content",
          }}
        >
          {saveNote}
        </span>
      </div>
      {ctaHref.startsWith("http") ? (
        <a
          href={ctaHref}
          target="_top"
          rel="noopener noreferrer"
          className="btn"
          style={{
            marginTop: 24,
            width: "100%",
            background: featured ? "var(--brass)" : "var(--purple)",
            color: featured ? "var(--ink)" : "#fff",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {cta}
        </a>
      ) : (
        <Link
          to={ctaHref}
          className="btn"
          style={{
            marginTop: 24,
            width: "100%",
            background: featured ? "var(--brass)" : "var(--purple)",
            color: featured ? "var(--ink)" : "#fff",
          }}
        >
          {cta}
        </Link>
      )}
      <div
        style={{
          height: 1,
          background: featured ? "rgba(255,255,255,.15)" : "var(--line)",
          marginBlock: 24,
        }}
      />
      <ul
        style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}
      >
        {pricingFeatures.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              color: featured ? "var(--ivory)" : "var(--ink)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--brass)",
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  const crmShell = useCrmAppBase();
  const signupHref = crmAbsUrl("/auth/register", crmShell);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Simple plans. Full platform.</>}
        lead="One yearly plan includes website, leads, calls, social, employees and finance. Limited-time introductory price shown below."
        primary={{ to: "/contact", label: "Talk to sales" }}
        secondary={{ to: "/features", label: "See all features" }}
        image={IMG.pricing}
      />

      <section className="section-tight">
        <div className="container-x">
          <div style={{ maxWidth: 480, marginInline: "auto" }}>
            <PlanCard
              name="Yearly"
              blurb="Best value — one payment for the full year."
              price="₹10,000"
              period="/ year"
              priceWas="Was ₹30,000 / year"
              saveNote="Save ₹20,000"
              cta="Get started"
              ctaHref={signupHref}
              featured
              badge="BEST VALUE"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            <CtaLink
              to="/auth/login"
              label="Buy now"
              className="btn btn-primary"
              crm="login"
              style={{ minWidth: "min(220px, 100%)", textAlign: "center", maxWidth: "100%" }}
            />
          </div>
          <p style={{ textAlign: "center", marginTop: 32, color: "var(--slate)", fontSize: 14 }}>
            Prices in INR. All core modules included — pay once per year.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <span className="eyebrow">Frequently asked</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>
            Pricing questions, answered.
          </h2>
          <div
            style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 32 }}
            className="faq-grid"
          >
            {[
              [
                "What is included at this price?",
                "Website & web builder, leads & CRM, call tracker, social hub, team & permissions, and finance & billing — the full platform in one yearly plan.",
              ],
              [
                "How do I get started?",
                "Click Get started or Buy now to create your account. Our team will help you pick templates and configure your workspace.",
              ],
              [
                "Can I renew or upgrade later?",
                "Yes — contact us any time to renew your yearly plan or add partner and white-label options.",
              ],
              [
                "Are taxes included?",
                "Listed prices are exclusive of applicable GST or taxes unless stated otherwise on your invoice.",
              ],
              [
                "Do you offer non-profit or startup pricing?",
                "We offer discounts for registered non-profits and early-stage startups. Reach out via the contact page.",
              ],
              [
                "Where is data stored?",
                "Production APIs run on Business CRM infrastructure with encryption in transit; contact us for security and data questions.",
              ],
            ].map(([q, a]) => (
              <div key={q} className="card-flat" style={{ padding: 24 }}>
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {q}
                </div>
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
