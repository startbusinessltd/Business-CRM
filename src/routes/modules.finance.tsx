import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/modules/finance")({
  head: () =>
    pageHead({
      path: "/modules/finance",
      title: "GST Invoicing & Billing Software | B-SOFT",
      description:
        "Handle money in B-SOFT: packages and pricing, coupons, UPI and card payments, GST invoices as PDFs, transaction history and incentive wallet payouts.",
    }),
  component: FinanceModule,
});

function FinanceModule() {
  return (
    <>
      <PageHero
        eyebrow="Finance & billing"
        title={<>Plans, payments, and invoices together.</>}
        lead="Finance in the app includes package type, package & pricing, coupons, payment transactions, incentive wallet, invoice management, and payment gateway configuration — with Razorpay-ready checkout flows."
        primary={{ to: "/pricing", label: "Register now", crm: "register" }}
        secondary={{ to: "/contact", label: "Talk to sales" }}
        image={IMG.finance}
      />

      <StatStrip
        items={[
          { n: "INR", l: "Plans & coupons" },
          { n: "PDF", l: "Invoices" },
          { n: "Pay", l: "Transactions" },
          { n: "Wallet", l: "Incentives" },
        ]}
      />

      <FeatureRow
        eyebrow="Packages"
        title="Package type & pricing."
        body="Configure business types, package features, and published pricing — what admins manage under /business-type and /packages."
        image={IMG.dashboard}
        bullets={[
          "Business type (package type)",
          "Package & pricing editor",
          "Feature lists per package",
          "Aligns with marketing INR plans",
        ]}
      />

      <FeatureRow
        eyebrow="Payments"
        title="Coupons, transactions, and wallet."
        body="Validate promo codes at registration, track payment transactions, and run incentive wallet payouts for partners and campaigns."
        image={IMG.analytics}
        reverse
        bullets={[
          "Coupons & promocode admin",
          "Payment transactions ledger",
          "Incentive wallet",
          "Payment gateway settings",
        ]}
      />

      <FeatureRow
        eyebrow="Invoicing"
        title="Invoice management."
        body="Create GST-friendly invoices, share PDFs, and keep finance next to the deals your team closes in CRM."
        image={IMG.invoiceManagement}
        mediaClassName="feature-row-media--contain"
        bullets={[
          "Invoice templates & PDF export",
          "Customer-linked billing",
          "Transaction reconciliation views",
          "Role-gated finance menus",
        ]}
      />

      <CtaBand />
    </>
  );
}
