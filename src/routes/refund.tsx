import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, REFUND_INTRO, REFUND_SECTIONS } from "@/lib/legal-content";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/refund")({
  head: () =>
    pageHead({
      path: "/refund",
      title: "Refund Policy | B-SOFT",
      description:
        "B-SOFT refund policy: refund eligibility, the request process, non-refundable items and how billing disputes are handled.",
    }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalDocument
      title="Refund Policy"
      eyebrow="Billing & refunds"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={REFUND_INTRO}
      sections={REFUND_SECTIONS}
      crossLinks={[
        { to: "/privacy", label: "Privacy Policy →" },
        { to: "/terms", label: "Terms of Service →" },
      ]}
    />
  );
}
