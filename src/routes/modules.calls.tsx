import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/calls")({
  head: () => ({
    meta: [
      { title: "Call Management — StartBusiness.ltd" },
      { name: "description", content: "AI-powered telephony with live overview, recordings, reports and AI call summaries — built into your CRM." },
      { property: "og:title", content: "Call Management" },
      { property: "og:description", content: "Every call, transcribed, summarised and attached to the right customer." },
      { property: "og:image", content: IMG.callcenter },
    ],
  }),
  component: CallsModule,
});

function CallsModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 03 · Call Management"
        title={<>AI-powered telephony, built into your CRM.</>}
        lead="Make and receive calls inside StartBusiness. Every conversation is recorded, transcribed, summarised by AI and attached to the right lead, customer or deal — automatically."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/features", label: "See all features" }}
        image={IMG.callcenter}
      />

      <StatStrip items={[
        { n: "100%", l: "Calls recorded & searchable" },
        { n: "< 30 s", l: "AI summary, per call" },
        { n: "Live", l: "Team & queue overview" },
        { n: "Native", l: "No third-party dialer" },
      ]} />

      <FeatureRow
        eyebrow="AI Call Assistant"
        title="A coach in every rep's ear."
        body="Real-time transcription, talk-listen ratios, sentiment and topic tracking. After the call, your rep gets a one-paragraph AI summary and a suggested follow-up email — ready to send."
        image={IMG.dashboard}
        bullets={[
          "Real-time transcription with sentiment cues",
          "Talk/listen ratio and pace coaching",
          "AI call summary and follow-up draft",
          "Automatic CRM activity logging",
        ]}
      />

      <FeatureRow
        eyebrow="Call overview & reports"
        title="The whole call floor — at a glance."
        body="Live queue, who's on a call, who's free, average handle time, abandonment, conversion. Drill into any rep, any campaign, any day."
        image={IMG.analytics}
        reverse
        bullets={[
          "Live agent and queue dashboard",
          "Service-level and SLA reporting",
          "Per-campaign and per-source attribution",
          "Searchable recordings with timestamps",
        ]}
      />

      <FeatureRow
        eyebrow="Recordings & compliance"
        title="Recordings that are easy to find — and safe to store."
        body="Encrypted at rest, region-pinned storage, granular retention policies and role-based access. Search any recording by speaker, keyword or sentiment."
        image={IMG.meeting}
        bullets={[
          "Keyword and speaker search across recordings",
          "Configurable retention policies",
          "Region-pinned, encrypted storage",
          "Per-role access and audit trail",
        ]}
      />

      <CtaBand />
    </>
  );
}
