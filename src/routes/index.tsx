import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { PLATFORM_STATS, SERVICES } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business CRM — One Platform to Run Your Entire Business" },
      {
        name: "description",
        content:
          "Business CRM: websites, leads, call tracker, social hub, team permissions, and finance — one CRM for Indian SMBs.",
      },
      { property: "og:title", content: "Business CRM — Run Your Business Smarter" },
      {
        property: "og:description",
        content: "Six core services. In-app AI assistant. One professional workspace.",
      },
      { property: "og:image", content: IMG.hero },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <PageHero
        eyebrow="Business CRM platform"
        title={<>Business CRM is an all-in-one digital platform</>}
        lead="Business CRM is a complete digital platform designed to help anyone launch and grow their business effortlessly. We provide websites, CRM, branding, automation, and full support — everything you need to build a successful digital business."
        primary={{ to: "/pricing", label: "Start 10-day trial", crm: "register" }}
        secondary={{ to: "/services", label: "Explore services" }}
        video={IMG.heroVideo}
        poster={IMG.hero}
      />

      <StatStrip items={[...PLATFORM_STATS.home]} />

      <section className="section">
        <div className="container-x">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow">Our services</span>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Six services. One Business CRM login.
            </h2>
            <p style={{ marginTop: 14, fontSize: 17 }}>
              Each area matches a section in the app — templates and forms, leads and automation,
              call tracking, social publishing, roles & permissions, and finance. Data stays in one
              place instead of scattered tools.
            </p>
          </div>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
            }}
            className="modules-grid"
          >
            {SERVICES.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="card-flat"
                style={{
                  overflow: "hidden",
                  display: "block",
                  transition: "transform .2s, box-shadow .2s",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <img
                    src={m.img}
                    alt={m.t}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 22, marginTop: 0 }}>{m.t}</h3>
                  <p style={{ marginTop: 8 }}>{m.d}</p>
                  <div
                    style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: "var(--purple)" }}
                  >
                    View service →
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
        body="The in-product AI assistant helps you use pipelines, forms, social hub, and dashboards — with answers grounded in how Business CRM actually works."
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
          "Partner & white-label options for agencies",
        ]}
      />

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container-x" style={{ textAlign: "center" }}>
          <span className="eyebrow">Why teams switch</span>
          <h2 className="h-section" style={{ marginTop: 16, maxWidth: 820, marginInline: "auto" }}>
            “Business CRM replaced four tools for us. Our sales team finally lives in one place.”
          </h2>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
