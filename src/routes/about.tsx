import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { PLATFORM_STATS } from "@/lib/site-content";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      title: "About B-SOFT - The Company Behind the All-in-One CRM",
      description:
        "Meet B-SOFT: the Karnataka-based team building one platform for Indian small businesses to run websites, leads, calls, social media and billing together.",
    }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About B-SOFT"
        title={<>One product for how Indian businesses actually work.</>}
        lead="We built B-SOFT so owners stop juggling a website tool, a spreadsheet for leads, a dialer app, social inboxes, HR sheets, and invoicing software. Everything in the B-SOFT application — websites through finance — lives here."
        primary={{ to: "/services", label: "See services" }}
        secondary={{ to: "/contact", label: "Contact us" }}
        video={IMG.aboutHeroVideo}
        poster={IMG.aboutWhatWeShip}
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
                to share the same customers, leads, and payments. B-SOFT is that shared
                layer.
              </p>
              <p style={{ marginTop: 12, fontSize: 17 }}>
                You pick an industry template, publish a site, capture leads in pipelines, track
                calls on mobile, reply on WhatsApp and Instagram, control who sees what, and bill
                with Razorpay-ready flows.
              </p>
            </div>
            <div className="media-frame about-mission-media">
              <img src={IMG.mission} alt="Targeting goals with B-SOFT" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <FeatureRow
        eyebrow="What we ship"
        title="Software that matches the sidebar."
        body="Marketing pages should not promise features the product does not have. Our website describes the same services you see after login: Website Type, Templates, Leads, Call Tracker, Social Hub, Team & Permissions, and Finance."
        image={IMG.aboutWhatWeShip}
        bullets={[
          "Transparent INR yearly plans",
          "Learning videos and in-app documentation",
          "Partner list, reseller access, and demo booking for teams",
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
          "Channapatna-based team with India-first payments",
          "Continuous delivery on develop branch across services",
        ]}
      />

      <CtaBand />
    </>
  );
}
