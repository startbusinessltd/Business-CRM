import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, IMG } from "@/components/site/PageBlocks";
import { CtaLink } from "@/lib/crm-parent-bridge";
import { fetchPricingPlans, formatINR, type PricingPlan } from "@/lib/pricing-api";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Become a B-Soft Partner — Start Your Own Software Business" },
      {
        name: "description",
        content:
          "Join the B-Soft Partner Program. Sell ready-made websites, CRM and AI products to businesses around you at your own price and keep the profit — no coding, no team, no big investment.",
      },
      { property: "og:title", content: "Become a B-Soft Business Partner" },
      {
        property: "og:description",
        content: "Sell software that businesses already need. You set the price, you keep the profit — B-Soft runs everything behind the scenes.",
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
  /** WALLET tiers: base/fallback recharge bonus multiplier — pay ₹X, get ₹X × this in the wallet. */
  rechargeMultiplier?: number | null;
  /** WALLET tiers: amount-based recharge bonus ladder (recharge more → higher multiplier). */
  rechargeTiers?: RechargeTier[] | null;
}

type RechargeTier = { minAmount: number; multiplier: number };

/** ₹ range of multipliers a WALLET plan offers, from its recharge ladder (falls back to the flat one). */
function multiplierRange(p: PartnerPlan): { min: number; max: number } | null {
  const mults = (p.rechargeTiers ?? [])
    .map((t) => Number(t.multiplier))
    .filter((m) => Number.isFinite(m) && m > 1);
  if (mults.length > 0) return { min: Math.min(...mults), max: Math.max(...mults) };
  const flat = p.rechargeMultiplier != null ? Number(p.rechargeMultiplier) : null;
  return flat && flat > 1 ? { min: flat, max: flat } : null;
}

/** "4×" or "4× to 10×" depending on whether the ladder has more than one rate. */
function multiplierLabel(p: PartnerPlan): string | null {
  const r = multiplierRange(p);
  if (!r) return null;
  return r.min === r.max ? `${r.min}×` : `${r.min}× to ${r.max}×`;
}

/** Static fallback mirroring the seeded catalog — replaced by the live API when reachable. */
const FALLBACK_PLANS: PartnerPlan[] = [
  {
    planId: 4, code: "ASSOCIATE", name: "Associate Partner", joiningFee: 5000,
    partnerType: "COMMISSION", maxCommissionPct: 30,
    description: "Refer B-Soft to businesses you know and earn a commission on every plan they buy — no wallet, no stock, nothing to manage.",
    features: [
      "Earn up to 30% commission on every sale",
      "Give your own discount coupons to customers",
      "Commission comes straight to your Incentive Wallet",
      "See every customer you bring in",
      "Just refer and earn — no wallet to maintain",
    ],
  },
  {
    planId: 1, code: "FRANCHISE", name: "Franchise Partner", joiningFee: 25000, websiteCost: 1000, crmCost: 3000,
    partnerType: "WALLET", rechargeMultiplier: 4,
    rechargeTiers: [
      { minAmount: 0, multiplier: 4 },
      { minAmount: 25000, multiplier: 6 },
      { minAmount: 50000, multiplier: 8 },
      { minAmount: 100000, multiplier: 10 },
    ],
    description: "Become a full B-Soft business owner. Recharge your wallet, get a big bonus, and sell websites, CRM and AI products to businesses around you at any price you like — the profit is yours.",
    features: [
      "Wallet recharge bonus up to 10× — recharge more, get more",
      "Sell every B-Soft product — websites, CRM, AI Voice, Social Hub",
      "You decide the selling price and keep the full profit",
      "Only a small fixed cost per sale from your wallet",
      "GST invoices and ready-made marketing material",
      "Manage all your customers from one simple panel",
    ],
  },
];

function isCommission(p: PartnerPlan): boolean {
  return (p.partnerType ?? "WALLET") === "COMMISSION";
}

const PLANS_API = "https://api.bsoft.ltd/api/auth/partner/plans";

const BENEFITS: { title: string; body: string }[] = [
  { title: "No technical team needed", body: "The full platform is ready — websites, CRM, leads, staff, social media and AI. You just bring the customers." },
  { title: "You decide the price", body: "Sell every website and CRM at any price you want. B-Soft takes only a small fixed cost from your wallet — the rest is your profit." },
  { title: "Big recharge bonus", body: "Recharge your wallet and get up to 10× the amount to sell with. The more you add, the bigger the bonus." },
  { title: "Income that keeps coming", body: "Renewals, upgrades and new products keep your customers paying you every single year." },
  { title: "Ready-made products", body: "AI Website Builder, AI Voice Agent, Social Hub and more — sell products businesses already want to buy." },
  { title: "Support at every step", body: "Easy onboarding, training and a full partner panel — you are never left alone or stuck." },
];

const JOURNEY_EXAMPLES: { name: string; body: string; figure: string }[] = [
  { name: "The freelancer", body: "A web designer who stops coding by hand — sells 8 AI websites a month at ₹6,000 each.", figure: "≈ ₹40,000/mo profit" },
  { name: "The local agency", body: "A small 3-person team selling website + CRM bundles to shops and clinics in their city.", figure: "≈ ₹1,00,000/mo profit" },
  { name: "The growing business", body: "A partner selling websites, CRM and AI products to businesses all across their district.", figure: "₹2,00,000+/mo potential" },
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
  // Franchise (WALLET) recharge bonus range — live from the partner-plans API tier ladder.
  const franchisePlan = plans.find((p) => !isCommission(p));
  const rechargeLabel = franchisePlan ? multiplierLabel(franchisePlan) : null;

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
              <span className="eyebrow">B-Soft Partner Program</span>
              <h1 className="h-section" style={{ marginTop: 16 }}>
                Start your own software business — without writing a single line of code.
              </h1>
              <p style={{ marginTop: 14, fontSize: 18 }}>
                Sell ready-made websites, CRM and AI products to businesses around you — at{" "}
                <strong>your own price</strong>. B-Soft builds and runs everything; you bring the
                customers and <strong>keep the profit</strong>.
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
                The easiest way to begin. Tell businesses you know about B-Soft, give them
                {" "}<strong>your own discount coupons</strong>, and earn a commission on every plan they buy.
                The customer pays B-Soft directly — you simply earn. No wallet, no stock, nothing to manage.
              </p>
              <ul style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Low joining fee — start earning fast</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Give your own discount coupons to win customers</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "#D97706" }}>✓</span> Commission comes to your Incentive Wallet — withdraw anytime</li>
              </ul>
            </div>
            <div className="card-flat" style={{ padding: 26, borderColor: "var(--purple-mid)" }}>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 0.5, background: "#E0F2FE", color: "#075985" }}>FRANCHISE</span>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>Franchise Partner</h3>
              <p style={{ marginTop: 10, fontSize: 15, color: "var(--slate)" }}>
                Become a full B-Soft business owner. Recharge your prepaid
                wallet{rechargeLabel ? <> — and every recharge is <strong>multiplied {rechargeLabel}</strong></> : null}, then sell websites, CRM and AI products to businesses around you at
                {" "}<strong>any price you like</strong>. B-Soft takes only a small fixed cost per sale — the rest of the profit stays with you.
              </p>
              <ul style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15, listStyle: "none", padding: 0 }}>
                {rechargeLabel ? (
                  <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> <strong>{rechargeLabel} wallet recharge bonus</strong> — the more you recharge, the bigger the bonus</li>
                ) : null}
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> You set the selling price — keep the full profit</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> Only a small fixed cost per sale from your wallet</li>
                <li style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--purple-mid)" }}>✓</span> Sell every B-Soft product from one simple panel</li>
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
          <h2 className="h-section" style={{ marginTop: 12 }}>Every B-Soft plan, and what you earn on it.</h2>
          <p style={{ marginTop: 10, color: "var(--slate)", fontSize: 15 }}>
            The selling price, your Associate commission and your Franchise wallet cost below are all <strong>live B-Soft rates</strong> — nothing is made up.
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

      {/* Profit calculator (Franchise model) */}
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
                  {!commission && multiplierLabel(p) ? (
                    <div style={{
                      marginTop: 10, padding: "10px 12px", borderRadius: 10,
                      background: featured ? "rgba(255,255,255,0.12)" : "#ECFDF5",
                      border: featured ? "1px solid rgba(255,255,255,0.25)" : "1px solid #A7F3D0",
                    }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: featured ? "#9AE6B4" : "#047857" }}>
                        🎁 {multiplierLabel(p)} wallet recharge bonus
                      </p>
                      {(p.rechargeTiers ?? []).length > 1 ? (
                        <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 3, fontSize: 12, opacity: 0.9 }}>
                          {[...(p.rechargeTiers ?? [])].sort((a, b) => a.minAmount - b.minAmount).map((t) => (
                            <li key={t.minAmount}>
                              Recharge ₹{inr(t.minAmount)}+ → <strong>{t.multiplier}×</strong> (get ₹{inr(Math.round(Math.max(t.minAmount, 1) * t.multiplier))})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>
                          Pay ₹1 → get ₹{multiplierRange(p)?.max ?? p.rechargeMultiplier} to spend
                        </p>
                      )}
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
                  {plans.map((p) => <td key={p.code} style={{ padding: 16, fontWeight: 700 }}>{!isCommission(p) && multiplierLabel(p) ? `${multiplierLabel(p)} — recharge more, get more` : "—"}</td>)}
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
  // Accent colour is the admin-configured plan colour (business_type.bt_color) from the backend.
  const accent = plan.color && /^#[0-9a-fA-F]{3,8}$/.test(plan.color) ? plan.color : "var(--purple-mid)";
  return (
    <div className="card-flat" style={{ padding: 22, borderTop: `4px solid ${accent}` }}>
      <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: accent }}>{plan.packagesName}</p>
      <p style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: accent }}>{formatINR(retail)}</p>
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
              Per sale, only ₹{inr(websiteCost)} (website) / ₹{inr(crmCost)} (CRM) is taken from your wallet —
              whatever you charge your customer above that is your profit to keep.
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
