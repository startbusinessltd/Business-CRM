import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/finance")({
  head: () => ({
    meta: [
      { title: "Finance Management — StartBusiness.ltd" },
      { name: "description", content: "Invoicing, products, customers, GST/tax invoices and full transaction management — connected to every deal you close." },
      { property: "og:title", content: "Finance Management" },
      { property: "og:description", content: "Invoice, track and reconcile — in one ledger that talks to the rest of your business." },
      { property: "og:image", content: IMG.finance },
    ],
  }),
  component: FinanceModule,
});

function FinanceModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 06 · Finance Management"
        title={<>Invoice, track and reconcile — in one ledger.</>}
        lead="Close a deal and the invoice is one click away. Send tax-compliant invoices, manage products and customers, and reconcile transactions — without ever leaving the platform that closed the sale."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/contact", label: "Talk to sales" }}
        image={IMG.finance}
      />

      <StatStrip items={[
        { n: "1 click", l: "Deal → invoice" },
        { n: "GST", l: "Tax-compliant invoicing" },
        { n: "Multi", l: "Currency & language" },
        { n: "Auto", l: "Bank reconciliation" },
      ]} />

      <FeatureRow
        eyebrow="Invoices & tax invoices"
        title="Invoices that look like your brand — and meet the law."
        body="Branded templates, multi-currency, multi-language, and full GST / tax invoice support. Email, WhatsApp or download — and watch the status update automatically when the customer pays."
        image={IMG.dashboard}
        bullets={[
          "Branded invoice templates",
          "GST-compliant tax invoices",
          "Recurring invoices & subscriptions",
          "Send via email or WhatsApp from the CRM",
        ]}
      />

      <FeatureRow
        eyebrow="Products & customers"
        title="One catalogue. One customer record. Everywhere."
        body="Manage products, SKUs, prices and customer ledgers in one place — the same place your sales team works. No more duplicate records, no more mismatched prices."
        image={IMG.analytics}
        reverse
        bullets={[
          "Centralised product & SKU catalogue",
          "Customer ledgers with full transaction history",
          "Tiered pricing and discount approvals",
          "Linked to deals, invoices and call records",
        ]}
      />

      <FeatureRow
        eyebrow="Transaction management"
        title="Reconciliation that takes minutes, not afternoons."
        body="Import bank statements, match transactions to invoices automatically, and let AI flag anything that looks off — overdue customers, duplicate payments, unusual refunds."
        image={IMG.meeting}
        bullets={[
          "Bank statement import and auto-matching",
          "AI anomaly alerts on transactions",
          "Aging receivables and payables reports",
          "Audit-ready export of every ledger",
        ]}
      />

      <CtaBand />
    </>
  );
}
