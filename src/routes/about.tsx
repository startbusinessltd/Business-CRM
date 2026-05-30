import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { PLATFORM_STATS } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Business CRM" },
      {
        name: "description",
        content:
          "Business CRM helps Indian SMBs run websites, leads, calls, social, team access, and billing from one CRM platform.",
      },
      { property: "og:title", content: "About Business CRM" },
      { property: "og:description", content: "One platform for websites, CRM, calls, social, and finance." },
      { property: "og:image", content: IMG.team },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Business CRM"
        title={<>One product for how Indian businesses actually work.</>}
        lead="We built Business CRM so owners stop juggling a website tool, a spreadsheet for leads, a dialer app, social inboxes, HR sheets, and invoicing software. Everything in the Business CRM application — websites through finance — lives here."
        primary={{ to: "/services", label: "See services" }}
        secondary={{ to: "/contact", label: "Contact us" }}
        image={IMG.team}
      />

      <StatStrip items={[...PLATFORM_STATS.about]} />

      <section className="section">
        <div className="container-x">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Our mission</span>
              <h2 className="h-section" style={{ marginTop: 16 }}>
                From sign-up to invoice — one stack.
              </h2>
              <p style={{ marginTop: 14, fontSize: 17 }}>
                Most growing companies do not need more apps — they need the apps they already pay for
                to share the same customers, leads, and payments. Business CRM is that shared
                layer.
              </p>
              <p style={{ marginTop: 12, fontSize: 17 }}>
                You pick an industry template, publish a site, capture leads in pipelines, track
                calls on mobile, reply on WhatsApp and Instagram, control who sees what, and bill
                with Razorpay-ready flows.
              </p>
            </div>
            <div className="media-frame" style={{ aspectRatio: "4/3" }}>
              <img src={IMG.office} alt="Business CRM team" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <FeatureRow
        eyebrow="What we ship"
        title="Software that matches the sidebar."
        body="Marketing pages should not promise features the product does not have. Our website describes the same services you see after login: Website Type, Templates, Leads, Call Tracker, Social Hub, Team & Permissions, and Finance."
        image={IMG.meeting}
        bullets={[
          "Transparent INR plans with a 10-day trial",
          "Learning videos and in-app documentation",
          "Partner list, white label, and demo booking for teams",
          "Built-in AI assistant for day-to-day how-to questions",
        ]}
      />

      <FeatureRow
        eyebrow="Who we serve"
        title="SMBs, partners, and vertical templates."
        body="Retail, clinics, agencies, ecommerce, insurance, salons, and more — each can start from a template classification in the app and grow into full CRM usage."
        image={IMG.handshake}
        reverse
        bullets={[
          "Template library per business type",
          "Super-admin and partner roles for resellers",
          "Bengaluru-based team with India-first payments",
          "Continuous delivery on develop branch across services",
        ]}
      />

      <CtaBand />
    </>
  );
}
