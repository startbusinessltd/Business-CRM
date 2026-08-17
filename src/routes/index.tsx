import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CtaBand,
  FeatureRow,
  HOME_HERO_CHIPS,
  IMG,
  PageHero,
  StatStrip,
} from "@/components/site/PageBlocks";
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

          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
            }}
            className="modules-grid"
          >
            {SERVICES.map((m, i) => (
              <Link
                key={m.to}
                to={m.to}
                className="card-flat"
                style={{ overflow: "hidden", display: "block" }}
              >
                <div
                  style={{
                    aspectRatio: "16/10",
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
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 22, marginTop: 0 }}>{m.t}</h3>
                  <p style={{ marginTop: 8 }}>{m.d}</p>
                  <div className="svc-arrow" style={{ marginTop: 16 }}>
                    View service <span aria-hidden>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <style>{`
            @media (max-width: 980px) { .modules-grid { grid-template-columns: 1fr 1fr !important; } }
            @media (max-width: 640px) { .modules-grid { grid-template-columns: 1fr !important; } }
          `}</style>
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
        </div>
      </section>

      <CtaBand />
    </>
  );
}
