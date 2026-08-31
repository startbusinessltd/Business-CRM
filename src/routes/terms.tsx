import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, TERMS_INTRO, TERMS_SECTIONS } from "@/lib/legal-content";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      path: "/terms",
      title: "Terms of Service | B-SOFT",
      description:
        "The terms governing use of the B-SOFT platform and related services - accounts, acceptable use, payments, and your rights as a customer.",
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
