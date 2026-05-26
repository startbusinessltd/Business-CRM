import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StartBusiness.ltd — One Platform to Run Your Entire Business" },
      { name: "description", content: "Replace four tools with one. Six modules and 30+ AI features for websites, leads, calls, social, employees and finance." },
      { property: "og:title", content: "StartBusiness.ltd — Run Your Business Smarter" },
      { property: "og:description", content: "Six modules. Thirty plus AI features. One professional workspace." },
      { property: "og:image", content: IMG.hero },
    ],
  }),
  component: Home,
});

const modules = [
  { to: "/modules/website", n: "01", t: "Website Management", d: "Launch and manage your site from a single dashboard.", img: IMG.website },
  { to: "/modules/leads", n: "02", t: "Lead Management", d: "Capture, nurture and convert leads end to end.", img: IMG.meeting },
  { to: "/modules/calls", n: "03", t: "Call Management", d: "AI-powered telephony with full visibility.", img: IMG.callcenter },
  { to: "/modules/social", n: "04", t: "Social Media", d: "Reach customers everywhere they spend time.", img: IMG.socialmarketing },
  { to: "/modules/employees", n: "05", t: "Employee Management", d: "Run your team with clarity and accountability.", img: IMG.employees },
  { to: "/modules/finance", n: "06", t: "Finance Management", d: "Invoice, track and reconcile in one ledger.", img: IMG.finance },
];

function Home() {
  return (
    <>
      <PageHero
        eyebrow="The Business Operating System"
        title={<>The professional workspace to run your <em style={{ fontStyle: "italic", color: "var(--brass-ink)", fontWeight: 500 }}>entire</em> business.</>}
        lead="Six modules, thirty plus AI features, one unified platform. From your website and leads to calls, social, employees and finance — operate everything from a single source of truth."
        primary={{ to: "/pricing", label: "Start 14-day trial" }}
        secondary={{ to: "/features", label: "Explore the platform" }}
        video={IMG.heroVideo}
        poster={IMG.hero}
      />

      <StatStrip items={[
        { n: "6", l: "Integrated modules" },
        { n: "30+", l: "AI-powered features" },
        { n: "4×", l: "Tools replaced on average" },
        { n: "14 days", l: "Free trial, no card" },
      ]} />

      <section className="section">
        <div className="container-x">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow">Our products</span>
            <h2 className="h-section" style={{ marginTop: 16 }}>Six modules. One professional platform.</h2>
            <p style={{ marginTop: 14, fontSize: 17 }}>
              Every module is built to stand on its own — and designed to work better together. No bolted-on integrations, no duplicate data, no spreadsheets in the middle.
            </p>
          </div>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="modules-grid">
            {modules.map((m) => (
              <Link key={m.to} to={m.to} className="card-flat" style={{ overflow: "hidden", display: "block", transition: "transform .2s, box-shadow .2s" }}>
                <div style={{ aspectRatio: "16/10", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
                  <img src={m.img} alt={m.t} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 22 }}>
                  <div className="num-tag">MODULE {m.n}</div>
                  <h3 style={{ fontSize: 22, marginTop: 8 }}>{m.t}</h3>
                  <p style={{ marginTop: 8 }}>{m.d}</p>
                  <div style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Learn more →</div>
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
        eyebrow="AI inside every workflow"
        title="An AI that lives where your team works."
        body="From summarising calls to suggesting the next best action on a deal, our AI is not a chatbot bolted on — it lives inside every module, quietly making your team faster."
        image={IMG.dashboard}
        bullets={[
          "AI call summaries, transcripts and next-step recommendations",
          "Lead scoring and pipeline guidance based on real activity",
          "Drafted replies for WhatsApp, Instagram and email",
          "Auto-categorised invoices and anomaly alerts for finance",
        ]}
      />

      <FeatureRow
        eyebrow="Built for operators"
        title="The clarity of one system. The depth of six."
        body="Stop reconciling four dashboards. One login, one data layer, one place where leads, calls, employees and invoices all live together."
        image={IMG.analytics}
        reverse
        bullets={[
          "Unified customer record across every module",
          "Role-based access for sales, ops, finance and admin",
          "Live dashboards for revenue, pipeline and team activity",
          "Native WhatsApp, Instagram, Facebook and tax invoicing",
        ]}
      />

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container-x" style={{ textAlign: "center" }}>
          <span className="eyebrow">Why teams switch</span>
          <h2 className="h-section" style={{ marginTop: 16, maxWidth: 820, marginInline: "auto" }}>
            “StartBusiness replaced four tools for us. Our sales team finally lives in one place.”
          </h2>
          <div style={{ marginTop: 20, color: "var(--slate)", fontSize: 14 }}>
            Aarav Mehta · Founder, Brightleaf Studio
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
