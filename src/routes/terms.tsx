import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, TERMS_INTRO, TERMS_SECTIONS } from "@/lib/legal-content";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Business CRM" },
      {
        name: "description",
        content: "Terms governing use of the Business CRM platform and related services.",
      },
      { property: "og:title", content: "Terms of Service — Business CRM" },
      {
        property: "og:description",
        content: "Terms of Service for Business CRM.",
      },
      { property: "og:image", content: IMG.team },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      eyebrow="Terms of use"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={TERMS_INTRO}
      sections={TERMS_SECTIONS}
      crossLinks={[
        { to: "/privacy", label: "Privacy Policy →" },
        { to: "/refund", label: "Refund Policy →" },
      ]}
    />
  );
}
