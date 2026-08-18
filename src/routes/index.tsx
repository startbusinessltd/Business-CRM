import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CtaBand,
  FeatureRow,
  HOME_HERO_CHIPS,
  IMG,
  PageHero,
  StatStrip,
} from "@/components/site/PageBlocks";
import { PartnerCta } from "@/components/site/PartnerJourney";
import { PLATFORM_STATS, SERVICES } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "B-SOFT — One Platform to Run Your Entire Business" },
      {
        name: "description",
        content:
          "B-SOFT: websites, leads, call tracker, social hub, team permissions, and finance — one CRM for Indian SMBs.",
      },
      { property: "og:title", content: "B-SOFT — Run Your Business Smarter" },
      {
        property: "og:description",
        content: "Six core services. In-app AI assistant. One professional workspace.",
      },
      { property: "og:image", content: IMG.hero },
    ],
  }),
  component: Home,
});

const TICKER = [
  "Website builder",
  "Lead pipelines",
  "Call tracker",
  "Social hub",
  "Team permissions",
  "Finance & billing",
  "In-app AI assistant",
  "GST invoicing",
];

function TickerBand() {
  const group = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined} style={{ gap: 0 }}>
      {TICKER.map((t) => (
        <span key={t} className="ticker-item">
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker-band">
      <div className="marquee" style={{ paddingBlock: 18 }}>
        <div className="marquee-track" style={{ animationDuration: "36s" }}>
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <PageHero
        eyebrow="B-SOFT platform"
        title={
          <>
            One platform to <span className="grad-text">launch, run & grow</span> your business
          </>
        }
        lead="Websites, CRM, branding, automation, and full support — everything you need to build a successful digital business, in one beautifully connected workspace."
        primary={{ to: "/pricing", label: "Register now", crm: "register" }}
        secondary={{ to: "/services", label: "Explore services" }}
        video={IMG.heroVideo}
        poster={IMG.hero}
        mediaStyle={{ aspectRatio: "16/10", maxHeight: 460 }}
        chips={HOME_HERO_CHIPS}
      />

      <TickerBand />

      <StatStrip items={[...PLATFORM_STATS.home]} />

      <section
        className="section"
        style={{
          background:
            "radial-gradient(900px 500px at 85% 0%, color-mix(in srgb, var(--purple) 6%, transparent), transparent 65%), radial-gradient(700px 480px at 8% 90%, color-mix(in srgb, var(--gold) 7%, transparent), transparent 60%)",
        }}
      >
        <div className="container-x">
          <div style={{ maxWidth: 760, marginInline: "auto", textAlign: "center" }}>
            <span className="eyebrow">Our services</span>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Six services. <span className="grad-text">One B-SOFT login.</span>
            </h2>
            <p style={{ marginTop: 14, fontSize: 17 }}>
              Each area matches a section in the app — templates and forms, leads and automation,
              call tracking, social publishing, roles & permissions, and finance. Data stays in one
              place instead of scattered tools.
            </p>
          </div>

          <div className="bento">
            {SERVICES.map((m, i) => {
              // 4+2 / 2+4 / 3+3 — tiles the 6-col grid exactly, alternating rhythm.
              const span = [4, 2, 2, 4, 3, 3][i] ?? 2;
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  className="card-flat spotlight tilt"
                  style={{ overflow: "hidden", ["--span" as string]: span }}
                >
                  <div
                    style={{
                      aspectRatio: span >= 4 ? "2.6/1" : span === 3 ? "2/1" : "3/2",
                      overflow: "hidden",
                      borderBottom: "1px solid var(--line)",
                      position: "relative",
                    }}
                  >
                    <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
                    <img
                      src={m.img}
                      alt={m.t}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="bento__body" style={{ padding: "clamp(18px, 1.5vw, 28px)" }}>
                    <h3 style={{ fontSize: "calc(23px * var(--ui))", marginTop: 0 }}>{m.t}</h3>
                    <p style={{ marginTop: 8 }}>{m.d}</p>
                    <div className="svc-arrow">
                      View service <span aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FeatureRow
        eyebrow="AI assistant"
        title="Guidance inside the app."
        body="The in-product AI assistant helps you use pipelines, forms, social hub, and dashboards — with answers grounded in how B-SOFT actually works."
        image={IMG.dashboard}
        bullets={[
          "Chatbot help on any screen you are using",
          "Answers tied to real app routes and workflows",
          "Faster onboarding for new team members",
          "Less time searching help docs or videos",
        ]}
      />

      <FeatureRow
        eyebrow="Built for Indian SMBs"
        title="One login from website to invoice."
        body="Whether you run a clinic, agency, retail store, or services firm — configure templates, capture leads, track calls, post to social, and invoice customers without switching products."
        image={IMG.crmConcept}
        reverse
        bullets={[
          "Industry templates (salon, ecommerce, insurance, and more)",
          "INR pricing with Razorpay-ready payments",
          "GST-friendly invoicing and transaction history",
          "Partner & reseller options for agencies",
        ]}
      />

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container-x" style={{ textAlign: "center" }}>
          <span className="eyebrow">Why teams switch</span>
          <div
            aria-hidden
            style={{
              marginTop: 22,
              fontSize: 22,
              letterSpacing: "0.3em",
              color: "var(--gold)",
              textShadow: "0 2px 12px rgba(255, 204, 0, 0.35)",
            }}
          >
            ★★★★★
          </div>
          <h2 className="h-section" style={{ marginTop: 16, maxWidth: 860, marginInline: "auto" }}>
            “B-SOFT replaced <span className="grad-text">four tools</span> for us. Our sales team
            finally lives in one place.”
          </h2>
          <div
            style={{
              marginTop: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: "var(--grad-brand)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 8px 20px -6px rgba(78, 47, 214, 0.5)",
              }}
            >
              RK
            </span>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
                Operations head
              </span>
              <span style={{ display: "block", fontSize: 13, color: "var(--slate)" }}>
                Services firm · Chennai
              </span>
            </span>
          </div>

          <div className="proof-row">
            {[
              { n: "4", l: "tools replaced", s: "website, CRM, dialer, invoicing" },
              { n: "48 hrs", l: "to go live", s: "template to published site" },
              { n: "1", l: "login for the team", s: "roles decide who sees what" },
            ].map((p) => (
              <div key={p.l} className="proof-card spotlight">
                <div className="proof-card__n">{p.n}</div>
                <div className="proof-card__l">{p.l}</div>
                <p className="proof-card__s">{p.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerSection />

      <CtaBand />
    </>
  );
}

const PARTNER_BENEFITS: { ico: string; t: string; d: string }[] = [
  {
    ico: "🚀",
    t: "Start with zero build cost",
    d: "Websites, CRM, leads, calls, social and AI are already built and running. You bring customers, not engineers.",
  },
  {
    ico: "💰",
    t: "You set the price, you keep the profit",
    d: "Sell every website and CRM at your own rate. B-SOFT charges a small fixed cost — the margin above it is yours.",
  },
  {
    ico: "🎛️",
    t: "One dashboard for every client",
    d: "Onboard, manage and bill all your customers from a single partner panel instead of juggling logins.",
  },
  {
    ico: "🤝",
    t: "You never sell alone",
    d: "Sales collateral, demo support and a dedicated partner line — plus a team that handles the tech behind you.",
  },
];

function PartnerSection() {
  return (
    <section className="partner-band-outer">
      <div className="surface-ink partner-band">
        <div className="orb orb--violet" style={{ width: 380, height: 380, top: -150, left: "8%" }} />
        <div className="orb orb--gold" style={{ width: 300, height: 300, bottom: -140, right: "10%" }} />
        <div className="hero-grid-overlay" />
        <div className="container-x" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 780, marginInline: "auto", textAlign: "center" }}>
            <span className="eyebrow eyebrow--on-dark">Partner program</span>
            <h2 className="h-section" style={{ marginTop: 18, color: "#fff" }}>
              Build your own software business — <span className="grad-text">we run the tech.</span>
            </h2>
            <p style={{ marginTop: 16, fontSize: 17, color: "var(--on-dark-muted)" }}>
              Agencies, consultants and local resellers use B-SOFT to sell websites and CRM to the
              businesses around them. Two ways in — Associate to start light, Franchise for an
              exclusive territory.
            </p>
          </div>

          <div className="partner-grid">
            {PARTNER_BENEFITS.map((b) => (
              <div key={b.t} className="partner-card spotlight">
                <span className="partner-card__ico" aria-hidden>
                  {b.ico}
                </span>
                <h3 className="partner-card__t">{b.t}</h3>
                <p className="partner-card__d">{b.d}</p>
              </div>
            ))}
          </div>

          <div className="partner-foot">
            <div className="partner-foot__stats">
              {[
                { n: "2", l: "programs — Associate & Franchise" },
                { n: "0", l: "developers you need to hire" },
                { n: "100%", l: "of your margin stays yours" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="partner-foot__n">{s.n}</div>
                  <div className="partner-foot__l">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="partner-foot__cta">
              <PartnerCta label="Become a Partner" className="btn btn-brass btn-lg magnetic" />
              <Link to="/partner" className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,.45)" }}>
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
