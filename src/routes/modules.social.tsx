import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/social")({
  head: () => ({
    meta: [
      { title: "Social Media — StartBusiness.ltd" },
      { name: "description", content: "Manage WhatsApp, Instagram and Facebook from one inbox, and tune your SEO / GEO presence — all inside your CRM." },
      { property: "og:title", content: "Social Media" },
      { property: "og:description", content: "Reach customers everywhere they spend time — and reply from one inbox." },
      { property: "og:image", content: IMG.socialmarketing },
    ],
  }),
  component: SocialModule,
});

function SocialModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 04 · Social Media"
        title={<>One inbox for WhatsApp, Instagram and Facebook.</>}
        lead="Every DM, every comment, every WhatsApp message — in one inbox, attached to the right customer record. Reply faster, never miss a message, and let AI draft the answer when you're busy."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/features", label: "See all features" }}
        image={IMG.socialmarketing}
      />

      <StatStrip items={[
        { n: "4", l: "Channels in one inbox" },
        { n: "< 2 min", l: "Avg first-response time" },
        { n: "AI", l: "Suggested replies" },
        { n: "SEO/GEO", l: "Built-in optimisation" },
      ]} />

      <FeatureRow
        eyebrow="WhatsApp Business"
        title="A real WhatsApp inbox for your whole team."
        body="Official WhatsApp Business API. Multiple agents, shared inbox, templates, broadcasts, and CRM context next to every conversation."
        image={IMG.meeting}
        bullets={[
          "Official WhatsApp Business API integration",
          "Shared multi-agent inbox with assignment",
          "Templated replies and approved broadcasts",
          "Conversation linked to lead / customer record",
        ]}
      />

      <FeatureRow
        eyebrow="Instagram & Facebook"
        title="Comments and DMs, treated like real customer messages."
        body="Stop missing leads in your DMs. Every Instagram and Facebook message lands in the same inbox, with the customer's full history one click away."
        image={IMG.laptop}
        reverse
        bullets={[
          "Instagram DM + comment management",
          "Facebook pages and ad-comment replies",
          "AI draft reply per message",
          "SLA and response-time reporting",
        ]}
      />

      <FeatureRow
        eyebrow="SEO & GEO"
        title="Show up where buyers are searching — locally and globally."
        body="Built-in keyword research, on-page SEO scoring and Google Business Profile management. Tune your local presence in the same workspace that runs your sales."
        image={IMG.analytics}
        bullets={[
          "On-page SEO scoring for every website page",
          "Google Business Profile sync and posts",
          "Local rank tracking by city / region",
          "AI-generated meta descriptions and alt text",
        ]}
      />

      <CtaBand />
    </>
  );
}
