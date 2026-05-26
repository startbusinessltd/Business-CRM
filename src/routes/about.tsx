import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — StartBusiness.ltd" },
      { name: "description", content: "We build the operating system small and mid-size businesses use to run smarter — from leads and calls to employees and invoices." },
      { property: "og:title", content: "About StartBusiness.ltd" },
      { property: "og:description", content: "Our mission, our team and the goal behind one platform for the whole business." },
      { property: "og:image", content: IMG.team },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About the company"
        title={<>We exist so growing businesses don't drown in tools.</>}
        lead="StartBusiness.ltd was founded by operators who got tired of stitching together a CRM, a dialer, a social inbox, an HR tool and an invoicing app. So we built one professional platform that does all of it — and added AI where it actually saves time."
        primary={{ to: "/features", label: "See the platform" }}
        secondary={{ to: "/contact", label: "Talk to the team" }}
        image={IMG.team}
      />

      <StatStrip items={[
        { n: "2,400+", l: "Businesses on platform" },
        { n: "38", l: "Countries served" },
        { n: "99.97%", l: "Uptime, last 12 months" },
        { n: "ISO 27001", l: "Security certified" },
      ]} />

      <section className="section">
        <div className="container-x">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Our mission</span>
              <h2 className="h-section" style={{ marginTop: 16 }}>One platform. The whole business.</h2>
              <p style={{ marginTop: 14, fontSize: 17 }}>
                Most growing companies don't fail because they lack ambition — they fail because their tools don't talk to each other. We're building the system that ends that.
              </p>
              <p style={{ marginTop: 12, fontSize: 17 }}>
                Our goal is simple: every leader should be able to see their pipeline, their team's day, their cash position and their customer conversations from one screen — and act on any of it in two clicks.
              </p>
            </div>
            <div className="media-frame" style={{ aspectRatio: "4/3" }}>
              <img src={IMG.office} alt="Our office" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <FeatureRow
        eyebrow="What we stand for"
        title="Software that respects your team's time."
        body="We believe enterprise software shouldn't feel like punishment. Every screen we ship is reviewed against three principles: it must be clear, it must be honest about what it does, and it must save the user time the same day they use it."
        image={IMG.meeting}
        bullets={[
          "Clarity over cleverness in every workflow",
          "AI used to remove busywork, not to perform tricks",
          "Transparent pricing — no per-module surcharges",
          "Customer support that actually answers in hours, not days",
        ]}
      />

      <FeatureRow
        eyebrow="The team"
        title="Operators, engineers and designers — in that order."
        body="We're a remote-first team of 60+ across India, Europe and South-East Asia. Many of us ran sales, operations or finance before building software for it — and it shows in the product."
        image={IMG.handshake}
        reverse
        bullets={[
          "Engineering led by ex-Atlassian and ex-Zoho leads",
          "Customer success team with prior SMB ops experience",
          "Design partners across professional services, retail and SaaS",
        ]}
      />

      <CtaBand />
    </>
  );
}
