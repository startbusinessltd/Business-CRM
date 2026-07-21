import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, IMG } from "@/components/site/PageBlocks";
import { CtaLink } from "@/lib/crm-parent-bridge";
import { fetchPricingPlans, formatINR, type PricingPlan } from "@/lib/pricing-api";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Become a White Label Partner — B-SOFT" },
      {
        name: "description",
        content:
          "Start your own software company on B-SOFT. Sell websites, CRM and AI products under your own brand and domain — no development team required.",
      },
      { property: "og:title", content: "Become a B-Soft White Label Partner" },
      {
        property: "og:description",
        content: "Your brand. Your domain. Your prices. B-Soft runs the platform — you keep the margin.",
      },
      { property: "og:image", content: IMG.handshake },
    ],
  }),
  component: PartnerPage,
});

type PartnerType = "COMMISSION" | "WALLET";

interface PartnerPlan {
  planId: number;
  code: string;
  name: string;
  description?: string | null;
  joiningFee: number;
  websiteCost?: number | null;
  crmCost?: number | null;
  features: string[];
  partnerType?: PartnerType;
  maxCommissionPct?: number | null;
  /** WALLET tiers: recharge bonus multiplier — pay ₹X, get ₹X × this credited to the wallet. */
  rechargeMultiplier?: number | null;
}

/** Static fallback mirroring the seeded catalog — replaced by the live API when reachable. */
const FALLBACK_PLANS: PartnerPlan[] = [
  {
    planId: 4, code: "ASSOCIATE", name: "Associate Partner", joiningFee: 5000,
    partnerType: "COMMISSION", maxCommissionPct: 30,
    description: "Promote B-Soft and earn commission on every plan you refer — no wallet, no upfront product cost.",
    features: [
      "Earn up to 30% commission",
      "Create your own discount coupons",
      "Instant commission to Incentive Wallet",
      "Track all your sign-ups",
      "No wallet to maintain",
    ],
  },
  {
    planId: 1, code: "FRANCHISE", name: "Franchise Partner", joiningFee: 25000, websiteCost: 1000, crmCost: 3000,
    partnerType: "WALLET", rechargeMultiplier: 4,
    description: "Run a full white-label software franchise on your own brand & domain — resell every B-Soft product at your own prices from a prepaid wallet.",
    features: [
      "White-label brand & custom domain",
      "4× wallet recharge bonus — pay ₹25,000, get ₹1,00,000 to spend",
      "Resell every B-Soft product",
      "Prepaid wallet billing at plan price",
      "AI Voice, Social Hub & automation",
      "GST invoicing & marketing tools",
      "Your clients, your pricing",
    ],
  },
];

function isCommission(p: PartnerPlan): boolean {
  return (p.partnerType ?? "WALLET") === "COMMISSION";
}

const PLANS_API = "https://api.bsoft.ltd/api/auth/partner/plans";

const BENEFITS: { title: string; body: string }[] = [
  { title: "No development team", body: "The SaaS platform is ready — websites, CRM, leads, employees, social, AI. You focus on selling." },
  { title: "Your own brand & domain", body: "Customers open your domain, see your logo and colors. B-Soft stays invisible." },
  { title: "You set the prices", body: "Charge your clients whatever you like for every website and CRM you sell. B-Soft only debits your wallet the plan cost — the difference is your margin." },
  { title: "Recurring revenue", body: "Renewals, upgrades and new modules keep customers paying you year after year." },
  { title: "Own payment gateway", body: "Customer money lands in your account. B-Soft only charges your wallet per product sold." },
  { title: "Growing product line", body: "AI Website Builder, AI Voice Agent, Social Hub — every new B-Soft product becomes yours to sell." },
];

const JOURNEY_EXAMPLES: { name: string; body: string; figure: string }[] = [
  { name: "The freelancer", body: "A web designer who stops building sites by hand — 8 AI websites a month at ₹6,000 each.", figure: "≈ ₹40,000/mo margin" },
  { name: "The local agency", body: "A 3-person agency selling websites + CRM bundles to shops and clinics in their district.", figure: "≈ ₹1,00,000/mo margin" },
  { name: "The white-label agency", body: "A White-Label partner running a full software business under their own brand and domain across their district.", figure: "₹2,00,000+/mo potential" },
];

function inr(n: number): string {
  return n.toLocaleString("en-IN");
}

/** Static fallback for the product-plan economics — replaced by the live public API. */
const FALLBACK_PRODUCTS: PricingPlan[] = [
  { packagesId: -1, packagesName: "Website Pro", description: "", price: 15000, discountedPrice: 9999, period: 12, packagesTypeId: 1, packagesTypeName: "Website Pro", features: [], commissionPct: 30, walletCharge: 9999 },
  { packagesId: -2, packagesName: "CRM Business Suite", description: "", price: 30000, discountedPrice: 19999, period: 12, packagesTypeId: 2, packagesTypeName: "CRM Business Suite", features: [], commissionPct: 40, walletCharge: 19999 },
  { packagesId: -3, packagesName: "Custom Development Studio", description: "", price: 99999, discountedPrice: 49999, period: 12, packagesTypeId: 3, packagesTypeName: "Custom Development Studio", features: [], commissionPct: 15, walletCharge: 49999 },
];

function PartnerPage() {
  const [plans, setPlans] = useState<PartnerPlan[]>(FALLBACK_PLANS);
  // Live product plans (Website Pro / CRM Suite / …) — retail price + commission % + wallet cost, from the DB.
  const [products, setProducts] = useState<PricingPlan[]>(FALLBACK_PRODUCTS);

  const websitePlan = products.find((p) => /website|web\b/i.test(p.packagesName)) ?? products[0];
  const crmPlan = products.find((p) => /crm/i.test(p.packagesName)) ?? products[1] ?? products[0];
  const wsCost = websitePlan?.walletCharge ?? websitePlan?.discountedPrice ?? 9999;
  const crmCost = crmPlan?.walletCharge ?? crmPlan?.discountedPrice ?? 19999;
  // Franchise (WALLET) recharge bonus multiplier — live from the partner-plans API.
  const franchisePlan = plans.find((p) => !isCommission(p));
  const rechargeMult = franchisePlan?.rechargeMultiplier ?? null;

  useEffect(() => {
    fetch(PLANS_API)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        const live = body?.responsePayload as PartnerPlan[] | undefined;
        if (Array.isArray(live) && live.length > 0) setPlans(live);
      })
      .catch(() => { /* static fallback stays */ });

    const ac = new AbortController();
    fetchPricingPlans(ac.signal).then((live) => {
      if (live.length > 0) setProducts(live);
    });
    return () => ac.abort();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container-x">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">White Label Partner Program</span>
              <h1 className="h-section" style={{ marginTop: 16 }}>
                Start your own software company — without writing software.
              </h1>
              <p style={{ marginTop: 14, fontSize: 18 }}>
                Sell websites, CRM and AI products under <strong>your brand</strong>, on{" "}
                <strong>your domain</strong>, at <strong>your prices</strong>. B-Soft runs the
                platform; you keep the margin.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
                <CtaLink to="/pricing" label="Become a Partner" className="btn btn-primary" crm="partner" />
                <a href="#calculator" className="btn btn-ghost">Try the profit calculator</a>
              </div>
            </div>
            <div className="media-frame">
              <img src={IMG.handshake} alt="Partner with B-Soft" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* Two ways to partner */}
      <section className="section-tight">
        <div className="container-x">
          <span className="eyebrow">Two ways to partner</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>Pick the model that fits you.</h2>
          <div className="grid-2" style={{ marginTop: 28, alignItems: "stretch" }}>
            <div className="card-flat" style={{ padding: 26, borderColor: "var(--line)" }}>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 0.5, background: "#FEF3C7", color: "#92400E" }}>COMMISSION</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>Associate Partner</h3>
              <p style={{ marginTop: 10, fontSize: 15, color: "var(--slate)" }}>
                The simplest way to start. Promote B-Soft, hand out <strong>your own discount coupons</strong>,
                and earn commission on every sale you refer — the client pays B-Soft directly and you keep the
                margin between your coupon discount and your commission cap. No wallet to fund, no gateway to set up.
              </p>
              <ul style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Low ₹5,000 joining fee</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Create discount coupons up to your commission cap</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Commission paid into your Incentive Wallet, withdraw anytime</li>
              </ul>
            </div>
            <div className="card-flat" style={{ padding: 26, borderColor: "var(--purple-mid)" }}>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 0.5, background: "#E0F2FE", color: "#075985" }}>FRANCHISE</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>Franchise Partner</h3>
              <p style={{ marginTop: 10, fontSize: 15, color: "var(--slate)" }}>
                Run a full software business under <strong>your own brand and domain</strong>. Recharge a prepaid
                wallet{rechargeMult && rechargeMult > 1 ? <> — and every recharge is <strong>multiplied {rechargeMult}×</strong></> : null}, pay a fixed wholesale cost per website/CRM you sell, and charge your customers whatever
                you like — their money lands in <strong>your</strong> payment gateway.
              </p>
              <ul style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> Your brand, domain, logo and colors</li>
                {rechargeMult && rechargeMult > 1 ? (
                  <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> <strong>{rechargeMult}× wallet recharge bonus</strong> — pay ₹1, get ₹{rechargeMult} to spend</li>
                ) : null}
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> Set your own client prices — keep 100% of what you charge</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> Fixed wholesale cost per sale from your wallet</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-tight">
        <div className="container-x">
          <span className="eyebrow">Why partners join</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>Everything a software business needs, ready on day one.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 28 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} className="card-flat" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{b.title}</h3>
                <p style={{ marginTop: 8, fontSize: 15, color: "var(--slate)" }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product plans & partner economics — live from the DB */}
      <section className="section-tight">
        <div className="container-x">
          <span className="eyebrow">What you sell & what you earn</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>Every B-Soft plan, and your economics on it.</h2>
          <p style={{ marginTop: 10, color: "var(--slate)", fontSize: 15 }}>
            Retail price, Associate commission and Franchise wallet cost below are the <strong>live B-Soft plan rates</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginTop: 28 }}>
            {products.map((p) => (
              <PlanEconomicsCard key={p.packagesId} plan={p} />
            ))}
            <div className="card-flat" style={{ padding: 22, background: "var(--purple-deep)", color: "#fff", borderColor: "var(--purple-mid)" }}>
              <p style={{ fontSize: 14, opacity: 0.85 }}>Refer 10 websites + 10 CRMs / month</p>
              <p style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
                {formatINR(
                  10 * Math.round((websitePlan?.discountedPrice ?? wsCost) * ((websitePlan?.commissionPct ?? 30) / 100)) +
                  10 * Math.round((crmPlan?.discountedPrice ?? crmCost) * ((crmPlan?.commissionPct ?? 40) / 100))
                )}
              </p>
              <p style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>potential monthly commission (Associate) at live rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profit calculator (White-Label model) */}
      <ProfitCalculator websiteCost={wsCost} crmCost={crmCost} />

      {/* Plans */}
      <section className="section-tight" id="plans">
        <div className="container-x">
          <span className="eyebrow">Partner plans</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>One joining fee. No monthly platform charge.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 28 }}>
            {plans.map((p) => {
              const featured = isCommission(p) ? false : (p.partnerType === "WALLET");
              const commission = isCommission(p);
              return (
                <div key={p.code} className="card-flat" style={{
                  padding: 26,
                  borderColor: featured ? "var(--purple-mid)" : "var(--line)",
                  background: featured ? "var(--purple-deep)" : "var(--card)",
                  color: featured ? "#fff" : undefined,
                }}>
                  <span style={{
                    display: "inline-block", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
                    background: commission ? "#FEF3C7" : (featured ? "rgba(255,255,255,0.2)" : "#E0F2FE"),
                    color: commission ? "#92400E" : (featured ? "#fff" : "#075985"),
                  }}>{commission ? "COMMISSION" : "FRANCHISE"}</span>
                  <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: featured ? 0.9 : 0.7, marginTop: 10 }}>{p.name}</p>
                  <p style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>₹{inr(p.joiningFee)}</p>
                  <p style={{ fontSize: 13, opacity: 0.75 }}>one-time joining fee</p>
                  {commission && p.maxCommissionPct != null ? (
                    <p style={{ fontSize: 14, marginTop: 8, fontWeight: 700, color: featured ? "#fff" : "#B45309" }}>Earn up to {p.maxCommissionPct}% commission</p>
                  ) : null}
                  {!commission && p.rechargeMultiplier != null && p.rechargeMultiplier > 1 ? (
                    <div style={{
                      marginTop: 10, padding: "10px 12px", borderRadius: 10,
                      background: featured ? "rgba(255,255,255,0.12)" : "#ECFDF5",
                      border: featured ? "1px solid rgba(255,255,255,0.25)" : "1px solid #A7F3D0",
                    }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: featured ? "#9AE6B4" : "#047857" }}>
                        🎁 {p.rechargeMultiplier}× wallet recharge bonus
                      </p>
                      <p style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>
                        Recharge ₹{inr(p.joiningFee)} → get ₹{inr(Math.round(p.joiningFee * p.rechargeMultiplier))} to spend
                      </p>
                    </div>
                  ) : null}
                  {p.description ? <p style={{ fontSize: 14, marginTop: 10, opacity: 0.85 }}>{p.description}</p> : null}
                  <ul style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15, listStyle: "none", padding: 0 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ display: "flex", gap: 8 }}>
                        <span aria-hidden="true" style={{ color: featured ? "#9AE6B4" : "var(--purple-mid)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 18 }}>
                    <CtaLink to="/pricing" label={`Choose ${p.name}`} className={featured ? "btn btn-primary" : "btn btn-ghost"} crm="partner" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <div className="card-flat" style={{ marginTop: 24, overflowX: "auto", padding: 0 }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: 16, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--slate)" }}>Compare</th>
                  {plans.map((p) => <th key={p.code} style={{ padding: 16, fontWeight: 800 }}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Model</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16, fontWeight: 700 }}>{isCommission(p) ? "Commission" : "Franchise (wallet)"}</td>)}
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Joining fee</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16, fontWeight: 700 }}>₹{inr(p.joiningFee)}</td>)}
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Max commission</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16 }}>{isCommission(p) && p.maxCommissionPct != null ? `${p.maxCommissionPct}%` : "—"}</td>)}
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Wallet recharge bonus</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16, fontWeight: 700 }}>{!isCommission(p) && p.rechargeMultiplier != null && p.rechargeMultiplier > 1 ? `${p.rechargeMultiplier}× (pay ₹1 → get ₹${p.rechargeMultiplier})` : "—"}</td>)}
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Cost per website sold</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16 }}>{!isCommission(p) && p.websiteCost != null ? `₹${inr(p.websiteCost)}` : "—"}</td>)}
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, color: "var(--slate)" }}>Cost per CRM sold</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16 }}>{!isCommission(p) && p.crmCost != null ? `₹${inr(p.crmCost)}` : "—"}</td>)}
                </tr>
                <tr>
                  <td style={{ padding: 16, color: "var(--slate)", verticalAlign: "top" }}>Included</td>
                  {plans.map((p) => <td key={p.code} style={{ padding: 16, fontSize: 13 }}>{p.features.join(" · ")}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Example journeys */}
      <section className="section-tight">
        <div className="container-x">
          <span className="eyebrow">What a partner business looks like</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>Example partner journeys.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 28 }}>
            {JOURNEY_EXAMPLES.map((s) => (
              <div key={s.name} className="card-flat" style={{ padding: 22 }}>
                <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--purple-mid)" }}>{s.name}</p>
                <p style={{ marginTop: 10, fontSize: 15, color: "var(--slate)" }}>{s.body}</p>
                <p style={{ marginTop: 12, fontSize: 18, fontWeight: 800 }}>{s.figure}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: 12, color: "var(--slate)" }}>
            Illustrative scenarios at the example selling prices above — your prices and volumes are your own.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function PlanEconomicsCard({ plan }: { plan: PricingPlan }) {
  const retail = plan.discountedPrice ?? plan.price;
  const commissionEarn = plan.commissionPct != null ? Math.round((retail * plan.commissionPct) / 100) : null;
  return (
    <div className="card-flat" style={{ padding: 22 }}>
      <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "var(--purple-mid)" }}>{plan.packagesName}</p>
      <p style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>{formatINR(retail)}</p>
      <p style={{ fontSize: 12, color: "var(--slate)" }}>retail plan price</p>
      <div style={{ height: 1, background: "var(--line)", marginBlock: 14 }} />
      <dl style={{ display: "grid", gap: 8, fontSize: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <dt style={{ color: "var(--slate)" }}>Associate commission</dt>
          <dd style={{ fontWeight: 700, color: "#B45309", textAlign: "right" }}>
            {plan.commissionPct != null ? `${plan.commissionPct}%` : "—"}
            {commissionEarn != null ? ` · ${formatINR(commissionEarn)}` : ""}
          </dd>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <dt style={{ color: "var(--slate)" }}>Franchise wallet cost</dt>
          <dd style={{ fontWeight: 700 }}>{plan.walletCharge != null ? formatINR(plan.walletCharge) : "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

function ProfitCalculator({ websiteCost, crmCost }: { websiteCost: number; crmCost: number }) {
  const [websites, setWebsites] = useState(10);
  const [crms, setCrms] = useState(10);
  // Default selling prices ~50% above the live wallet cost so the example margin is positive.
  const [websitePrice, setWebsitePrice] = useState(Math.round(websiteCost * 1.5));
  const [crmPrice, setCrmPrice] = useState(Math.round(crmCost * 1.5));

  const { revenue, cost, profit } = useMemo(() => {
    const revenue = websites * websitePrice + crms * crmPrice;
    const cost = websites * websiteCost + crms * crmCost;
    return { revenue, cost, profit: Math.max(0, revenue - cost) };
  }, [websites, crms, websitePrice, crmPrice, websiteCost, crmCost]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line)",
    fontSize: 15, background: "var(--card)",
  };

  return (
    <section className="section-tight" id="calculator">
      <div className="container-x">
        <span className="eyebrow">Profit calculator</span>
        <h2 className="h-section" style={{ marginTop: 12 }}>See your monthly earnings.</h2>
        <div className="grid-2" style={{ marginTop: 28, alignItems: "start" }}>
          <div className="card-flat" style={{ padding: 24, display: "grid", gap: 18 }}>
            <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>
              Websites sold per month: {websites}
              <input type="range" min={0} max={50} value={websites} onChange={(e) => setWebsites(Number(e.target.value))} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>
              Your website price (₹)
              <input type="number" min={0} value={websitePrice} onChange={(e) => setWebsitePrice(Math.max(0, Number(e.target.value) || 0))} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>
              CRMs sold per month: {crms}
              <input type="range" min={0} max={50} value={crms} onChange={(e) => setCrms(Number(e.target.value))} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>
              Your CRM price (₹)
              <input type="number" min={0} value={crmPrice} onChange={(e) => setCrmPrice(Math.max(0, Number(e.target.value) || 0))} style={inputStyle} />
            </label>
          </div>
          <div className="card-flat" style={{ padding: 24 }}>
            <dl style={{ display: "grid", gap: 12, fontSize: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ color: "var(--slate)" }}>Monthly revenue</dt><dd style={{ fontWeight: 700 }}>₹{inr(revenue)}</dd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ color: "var(--slate)" }}>B-Soft cost (wallet)</dt><dd style={{ fontWeight: 700, color: "#C53030" }}>− ₹{inr(cost)}</dd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                <dt style={{ fontWeight: 800 }}>Expected profit</dt>
                <dd style={{ fontWeight: 800, fontSize: 26, color: "var(--purple-mid)" }}>₹{inr(profit)}</dd>
              </div>
            </dl>
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--slate)" }}>
              Per sale, ₹{inr(websiteCost)} (website) / ₹{inr(crmCost)} (CRM) is deducted from your partner wallet.
              Customer payments go to your own payment gateway.
            </p>
            <div style={{ marginTop: 18 }}>
              <CtaLink to="/pricing" label="Start earning — become a Partner" className="btn btn-primary" crm="partner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
