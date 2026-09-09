import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { DATA_DELETION_INTRO, DATA_DELETION_SECTIONS, LEGAL_LAST_UPDATED } from "@/lib/legal-content";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/data-deletion")({
  head: () =>
    pageHead({
      path: "/data-deletion",
      title: "Data Deletion | B-SOFT",
      description:
        "How to delete the data B-SOFT holds about you, including data received from Meta when you connect Facebook, Instagram or WhatsApp to B-SOFT Social Hub.",
    }),
  component: DataDeletionPage,
});

function DataDeletionPage() {
  return (
    <LegalDocument
      title="Data Deletion"
      eyebrow="Privacy & data"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={DATA_DELETION_INTRO}
      sections={DATA_DELETION_SECTIONS}
      crossLinks={[
        { to: "/privacy", label: "Privacy Policy →" },
        { to: "/terms", label: "Terms of Service →" },
      ]}
    />
  );
}
