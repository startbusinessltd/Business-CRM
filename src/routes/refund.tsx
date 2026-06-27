import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/site/LegalDocument";
import { IMG } from "@/components/site/PageBlocks";
import { LEGAL_LAST_UPDATED, REFUND_INTRO, REFUND_SECTIONS } from "@/lib/legal-content";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — B-SOFT" },
      {
        name: "description",
        content: "Refund eligibility, process, non-refundable items, and how to contact B-SOFT support.",
      },
      { property: "og:title", content: "Refund Policy — B-SOFT" },
      { property: "og:description", content: "Refund and billing policy for B-SOFT." },
      { property: "og:image", content: IMG.team },
    ],
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
