import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/modules/social")({
  head: () =>
    pageHead({
      path: "/modules/social",
      title: "Social Media Management & WhatsApp Hub | B-SOFT",
      description:
        "Run social from your CRM with B-SOFT Social Hub: connect Facebook and Instagram, publish posts and reels, run Meta ads and manage WhatsApp in one inbox.",
    }),
  component: SocialModule,
});

function SocialModule() {
  return (
    <>
      <PageHero
        eyebrow="Social Hub"
        title={<>Publish, message, and measure — in one hub.</>}
        lead="Connect social accounts, manage posts and reels, run Meta ad campaigns, reply on WhatsApp, and read analytics — the same Social Hub menus you see at /social-hub in the app."
        primary={{ to: "/pricing", label: "Register now", crm: "register" }}
        secondary={{ to: "/services", label: "All services" }}
        image={IMG.socialmarketing}
      />

      <StatStrip
        items={[
          { n: "Meta", l: "Posts & ads" },
          { n: "WA", l: "Business inbox" },
          { n: "Reels", l: "& video" },
          { n: "Guide", l: "In-app user guide" },
        ]}
      />

      <FeatureRow
        eyebrow="Connect & publish"
        title="Accounts, posts, and reels."
        body="Link Facebook and Instagram assets, schedule posts, and upload reels and videos from dedicated Social Hub screens."
        image={IMG.meeting}
        bullets={[
          "Connect accounts workflow",
          "Posts composer & library",
          "Reels & videos publishing",
          "Overview dashboard",
        ]}
      />

      <FeatureRow
        eyebrow="Campaigns & WhatsApp"
        title="Ad campaigns and WhatsApp."
        body="Launch and monitor ad campaigns, then handle WhatsApp business conversations beside your pipeline."
        image={IMG.laptop}
        reverse
        bullets={[
          "Meta ad campaign management",
          "WhatsApp business inbox",
          "Comment and DM workflows",
          "Tied to CRM customer context",
        ]}
      />

      <FeatureRow
        eyebrow="Analytics"
        title="Analytics and onboarding."
        body="Review engagement analytics and share the in-app Social Hub user guide with new teammates."
        image={IMG.analytics}
        bullets={[
          "Social Hub analytics screens",
          "Performance by channel",
          "User guide route in product",
          "OAuth-connected accounts",
        ]}
      />

      <CtaBand />
    </>
  );
}
