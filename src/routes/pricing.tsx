import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";
import { useCrmAppBase, crmAbsUrl } from "@/lib/crm-parent-bridge";
import { fetchPricingPlans, formatINR, type PricingPlan } from "@/lib/pricing-api";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — B-SOFT" },
      {
        name: "description",
        content:
          "Simple INR yearly pricing. Website, CRM, calls, social, employees and finance — pick the plan that fits your business.",
      },
      { property: "og:title", content: "Pricing — B-SOFT" },
      {
        property: "og:description",
        content: "Website, full CRM suite and custom development plans — transparent yearly pricing.",
      },
      { property: "og:image", content: IMG.pricing },
    ],
  }),
  component: Pricing,
});

/* ── Presentation meta layered on top of the live API data ─────────────────── */
type PlanMeta = {
  badge?: string;
  featured?: boolean;
  ctaLabel: string;
  ctaKind: "register" | "contact";
  priceLabel?: (p: PricingPlan) => string; // override (e.g. "Starting …")
};

function metaFor(plan: PricingPlan): PlanMeta {
  const name = plan.packagesName.toLowerCase();
  if (name.includes("custom")) {
    return {
      badge: "ENTERPRISE",
      ctaLabel: "Talk to sales",
      ctaKind: "contact",
      priceLabel: (p) => `Starting ${formatINR(p.discountedPrice ?? p.price)}`,
    };
  }
  if (name.includes("crm") || name.includes("suite") || name.includes("business")) {
    return { badge: "MOST POPULAR", featured: true, ctaLabel: "Register now", ctaKind: "register" };
  }
  return { badge: "STARTER", ctaLabel: "Register now", ctaKind: "register" };
}

/* Static fallback — mirrors the platform plans so the page renders even if the API is unreachable. */
const FALLBACK_PLANS: PricingPlan[] = [
  {
    packagesId: -1,
    packagesName: "Website Pro",
    description: "AI-built professional website with your own domain, lead forms and free hosting.",
    price: 15000,
    discountedPrice: 9999,
    period: 12,
    packagesTypeId: 0,
    packagesTypeName: "Website Pro",
    commissionPct: 30,
    walletCharge: 9999,
    features: [
      "AI Website Builder - launch in minutes",
      "Unlimited premium templates & themes",
      "Free custom domain + SSL certificate",
      "Smart lead-capture forms built in",
      "Website leads straight to your inbox",
      "Mobile-perfect, SEO-ready pages",
      "Free B-SOFT cloud hosting",
    ],
  },
  {
    packagesId: -2,
    packagesName: "CRM Business Suite",
    description: "The complete platform - website, CRM, calls, social, team and finance in one place.",
    price: 30000,
    discountedPrice: 19999,
    period: 12,
    packagesTypeId: 0,
    packagesTypeName: "CRM Business Suite",
    commissionPct: 40,
    walletCharge: 19999,
    features: [
      "Everything in Website Pro",
      "Full Lead & Pipeline CRM",
      "Call tracking & team performance",
      "Social hub - post, schedule, analyze",
      "WhatsApp & ad-campaign marketing",
      "Employees, roles & attendance",
      "Finance, invoices & payment gateway",
      "Priority onboarding & support",
    ],
  },
  {
    packagesId: -3,
    packagesName: "Custom Development Studio",
    description: "Bespoke modules, integrations and workflows built by our dedicated engineering team.",
    price: 99999,
    discountedPrice: 49999,
    period: 12,
    packagesTypeId: 0,
    packagesTypeName: "Custom Development Studio",
    commissionPct: 15,
    walletCharge: 49999,
    features: [
      "Everything in CRM Business Suite",
      "Dedicated development team",
      "Custom modules & integrations",
      "Third-party & API integrations",
      "Bespoke workflows & automation",
      "Priority SLA & account manager",
    ],
  },
];

function periodLabel(period: number): string {
  if (period === 12) return "/ year";
  if (period === 1) return "/ month";
  return `/ ${period} mo`;
}

function PlanCard({ plan, ctaHref }: { plan: PricingPlan; ctaHref: string }) {
  const meta = metaFor(plan);
  const featured = !!meta.featured;
  const muted = featured ? "var(--on-dark-muted)" : "var(--slate)";
  const has = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const shown = plan.discountedPrice ?? plan.price;
  const priceText = meta.priceLabel ? meta.priceLabel(plan) : formatINR(shown);
  const save = has ? plan.price - (plan.discountedPrice as number) : 0;
  // Accent = the admin-configured plan colour (business_type.bt_color) from the backend.
  const accent = plan.color && /^#[0-9a-fA-F]{3,8}$/.test(plan.color) ? plan.color : (featured ? "var(--brass)" : "var(--purple)");

  return (
    <div
      className="card-flat"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(20px, 4vw, 30px)",
        paddingTop: meta.badge ? "clamp(30px, 6vw, 42px)" : undefined,
        borderColor: featured ? "var(--purple-mid)" : "var(--line)",
        borderTop: `5px solid ${accent}`,
        background: featured ? "var(--purple-deep)" : "var(--card)",
        color: featured ? "var(--ivory)" : "var(--ink)",
        boxShadow: featured ? "0 24px 60px -28px rgba(76,29,149,.6)" : undefined,
        transform: featured ? "translateY(-6px)" : undefined,
      }}
    >
      {meta.badge ? (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: accent,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 999,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          {meta.badge}
        </div>
      ) : null}

      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          fontWeight: 600,
          color: featured ? "var(--ivory)" : accent,
        }}
      >
        {plan.packagesName}
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: muted, minHeight: 42 }}>{plan.description}</div>

      <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(30px, 7vw, 46px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: featured ? "var(--ivory)" : accent,
          }}
        >
          {priceText}
        </span>
        <span style={{ fontSize: 14, color: muted }}>{periodLabel(plan.period)}</span>
      </div>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, minHeight: 46 }}>
        {has ? (
          <>
            <span style={{ fontSize: 14, color: muted, textDecoration: "line-through" }}>
              Was {formatINR(plan.price)} {periodLabel(plan.period)}
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
              Save {formatINR(save)}
            </span>
          </>
        ) : null}
      </div>

      <a
        href={ctaHref}
        target="_top"
        rel="noopener noreferrer"
        className="btn"
        style={{
          marginTop: 22,
          width: "100%",
          background: featured ? "var(--brass)" : "var(--purple)",
          color: featured ? "var(--ink)" : "#fff",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {meta.ctaLabel}
      </a>

      <div
        style={{
          height: 1,
          background: featured ? "rgba(255,255,255,.15)" : "var(--line)",
          marginBlock: 22,
        }}
      />

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
        {plan.features.map((f) => (
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
  const registerHref = crmAbsUrl("/auth/register", crmShell);

  const [plans, setPlans] = useState<PricingPlan[]>(FALLBACK_PLANS);

  useEffect(() => {
    const controller = new AbortController();
    fetchPricingPlans(controller.signal).then((live) => {
      if (live.length > 0) setPlans(live);
    });
    return () => controller.abort();
  }, []);

  const ctaHrefFor = (plan: PricingPlan): string =>
    metaFor(plan).ctaKind === "contact" ? "/contact" : registerHref;

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Simple plans. Full platform.</>}
        lead="From a stunning website to the complete CRM suite and bespoke custom development — pick the plan that fits, upgrade any time. Limited-time introductory pricing shown below."
        primary={{ to: "/contact", label: "Talk to sales" }}
        secondary={{ to: "/features", label: "See all features" }}
        image={IMG.pricing}
      />

      <section className="section-tight">
        <div className="container-x">
          <div className="card-slider" style={{ maxWidth: "fit-content", marginInline: "auto" }}>
            {plans.map((plan) => (
              <PlanCard key={plan.packagesId} plan={plan} ctaHref={ctaHrefFor(plan)} />
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--slate)", fontSize: 13 }}>
            Swipe to see all plans · Prices in INR, billed yearly. GST applied on invoice where applicable.
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
                "Which plan is right for me?",
                "Choose Website Pro for a professional site with lead capture, CRM Business Suite for the complete platform (calls, social, team and finance), or Custom Development Studio for bespoke modules and integrations.",
              ],
              [
                "How do I get started?",
                "Click Register now on any plan to create your account. Our team will help you pick templates and configure your workspace. For custom work, talk to sales.",
              ],
              [
                "Can I upgrade later?",
                "Yes — start on Website Pro and upgrade to the CRM Business Suite any time. Contact us to add partner and reseller options.",
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
                "Where is my data stored?",
                "Production APIs run on B-SOFT infrastructure with encryption in transit; contact us for security and data questions.",
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
