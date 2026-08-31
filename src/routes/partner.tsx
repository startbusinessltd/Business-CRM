import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, IMG, StatStrip } from "@/components/site/PageBlocks";
import { CardMarquee } from "@/components/site/CardMarquee";
import { PartnerCta, PartnerProgramsBlock, SupportBlock } from "@/components/site/PartnerJourney";
import { usePartnerJourney } from "@/lib/partner-journey-context";
import {
  FALLBACK_PLANS,
  associateOf,
  fetchPartnerPlans,
  franchiseOf,
  franchisePackages,
  inr,
  type PartnerPlan,
} from "@/lib/partner-program";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/partner")({
  head: () =>
    pageHead({
      path: "/partner",
      title: "Become a B-SOFT Partner - Start Your Own Software Business",
      description:
        "Join the B-SOFT Partner Program: resell the CRM platform at your own price, manage every customer from one panel and earn commission on each sale.",
    }),
  component: PartnerPage,
});

const BENEFITS: { title: string; body: string }[] = [
  {
    title: "No technical team needed",
    body: "The full platform is ready — websites, CRM, leads, staff, social media and AI. You just bring the customers.",
  },
  {
    title: "You decide the price",
    body: "Sell every website and CRM at any price you want. B Soft takes only a small fixed cost — the rest is your profit.",
  },
  {
    title: "One panel for all customers",
    body: "Manage every client you sign up from a single partner dashboard — no juggling tools.",
  },
  {
    title: "Support when you need it",
    body: "Partner resources, sales help and a dedicated support line so you never sell alone.",
  },
];

const JOURNEY: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Register as a partner",
    body: "Fill the short form with your name, email, mobile and location.",
  },
  {
    step: "02",
    title: "Verify your mobile",
    body: "Enter the OTP we send — that completes your partner registration.",
  },
  {
    step: "03",
    title: "Sign in",
    body: "Use the existing B Soft login page with your registered email.",
  },
  {
    step: "04",
    title: "Choose a plan & pay",
    body: "Compare Associate vs Franchise, pick a package, and complete payment to activate.",
  },
];

function PartnerPage() {
  const [plans, setPlans] = useState<PartnerPlan[]>(FALLBACK_PLANS);
  const { open } = usePartnerJourney();

  useEffect(() => {
    const ac = new AbortController();
    fetchPartnerPlans(ac.signal).then(setPlans);
    return () => ac.abort();
  }, []);

  const associate = associateOf(plans);
  const packages = franchisePackages(franchiseOf(plans));

  return (
    <>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container-x">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">B Soft Partner Program</span>
              <h1 className="h-display" style={{ marginTop: 18 }}>
                Start your own software business — without writing a single line of code.
              </h1>
              <p className="lead" style={{ marginTop: 18, fontSize: 19 }}>
                Sell ready-made websites, CRM and AI products to businesses around you — at{" "}
                <strong>your own price</strong>. B Soft builds and runs everything; you bring the
                customers and <strong>keep the profit</strong>.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
                <PartnerCta label="Become a Partner" className="btn btn-primary" />
                <a href="#how" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: "var(--slate)" }}>
                Two programs, from {inr(associate.joiningFee)} + GST. Register, verify OTP, then sign
                in to compare plans and pay.
              </p>
            </div>
            <div className="media-frame">
              <img src={IMG.handshake} alt="Partner with B Soft" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <StatStrip
        items={[
          { n: "2", l: "Partner programs" },
          { n: `${inr(associate.joiningFee)}`, l: "Associate joining fee + GST" },
          {
            n: packages[0] ? inr(packages[0].walletValue) : `${packages.length}`,
            l: packages[0] ? `Wallet on the ${inr(packages[0].amount)} package` : "Packages",
          },
          { n: "1", l: "Panel for all your customers" },
        ]}
      />

      {/* Plans / calculators / payment are CRM-only after login — teaser here. */}
      <PartnerProgramsBlock />
      <section className="section-tight" id="programs">
        <div className="container-x">
          <span className="eyebrow">Two ways to partner</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>
            Associate Partner or Franchise Partner.
          </h2>
          <p className="lead" style={{ marginTop: 12 }}>
            After you register and sign in, you will see both programs with live pricing, wallet
            maths, earning calculators and payment — on your partner landing page.
          </p>
          <div style={{ marginTop: 22 }}>
            <button type="button" className="btn btn-primary" onClick={() => open()}>
              Become a Partner — start registration →
            </button>
          </div>
        </div>
      </section>

      <section className="section-tight" id="how">
        <div className="container-x">
          <span className="eyebrow">How you join</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>
            Four guided steps. Nothing hidden.
          </h2>
          <div className="grid-2" style={{ marginTop: 26, alignItems: "stretch", gap: 16 }}>
            {JOURNEY.map((j) => (
              <div key={j.step} className="card-flat" style={{ padding: 22 }}>
                <p className="num-tag">{j.step}</p>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{j.title}</h3>
                <p style={{ marginTop: 8, fontSize: 15, color: "var(--slate)" }}>{j.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x">
          <span className="eyebrow">Why partners join</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>
            Everything a software business needs, ready on day one.
          </h2>
          <div style={{ marginTop: 20 }}>
            <CardMarquee
              items={BENEFITS}
              render={(b) => (
                <div className="card-flat" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{b.title}</h3>
                  <p style={{ marginTop: 8, fontSize: 15, color: "var(--slate)" }}>{b.body}</p>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x">
          <SupportBlock variant="page" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
