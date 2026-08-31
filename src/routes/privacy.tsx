import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/lib/legal-content";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      path: "/privacy",
      title: "Privacy Policy | B-SOFT",
      description:
        "How B-SOFT collects, uses and protects personal information across the platform - data we store, how it is used, and the choices you have.",
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
