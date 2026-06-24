import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/lib/legal-content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — B Soft" },
      {
        name: "description",
        content:
          "How B Soft collects, uses, and protects personal information for the platform and marketing site.",
      },
      { property: "og:title", content: "Privacy Policy — B Soft" },
      {
        property: "og:description",
        content: "Privacy practices for B Soft.",
      },
      { property: "og:image", content: IMG.team },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      eyebrow="Privacy & data"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_SECTIONS}
      crossLinks={[
        { to: "/terms", label: "Terms of Service →" },
        { to: "/refund", label: "Refund Policy →" },
      ]}
    />
  );
}
