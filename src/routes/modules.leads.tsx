import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/leads")({
  head: () => ({
    meta: [
      { title: "Leads & CRM — Business CRM" },
      {
        name: "description",
        content:
          "Pipelines, forms, lead management, tasks, automation (email, WhatsApp, SMS), and website leads in Business CRM.",
      },
      { property: "og:title", content: "Leads & CRM" },
      { property: "og:image", content: IMG.leads },
    ],
  }),
  component: LeadsModule,
});

function LeadsModule() {
  return (
    <>
      <PageHero
        eyebrow="Leads & CRM"
        title={<>Pipelines, forms, and automation in one place.</>}
        lead="Create pipelines and stages, publish forms, manage leads in table or grid views, run tasks, and automate follow-ups over email, WhatsApp, and SMS — including sign-up and website lead capture."
        primary={{ to: "/pricing", label: "Get started", crm: "register" }}
        secondary={{ to: "/contact", label: "Book a demo" }}
        image={IMG.leads}
      />

      <StatStrip
        items={[
          { n: "∞", l: "Custom pipelines" },
          { n: "Forms", l: "Build & publish" },
          { n: "Auto", l: "Email · WhatsApp · SMS" },
          { n: "Tasks", l: "Per rep" },
        ]}
      />

      <FeatureRow
        eyebrow="Lead generation"
        title="Pipelines, stages, and forms."
        body="Lead generation covers all pipelines, pipeline stages, and forms — the same screens as /pipeline and /forms in the product."
        image={IMG.dashboard}
        bullets={[
          "Create and copy pipelines",
          "Stage rules per pipeline",
          "Form save, publish, and copy",
          "Import/export lead templates",
        ]}
      />

      <FeatureRow
        eyebrow="Lead management"
        title="All leads, tasks, and website capture."
        body="Work deals from /all-leads, assign tasks from /tasks, and ingest website leads from /web-leads and sign-up flows."
        image={IMG.laptop}
        reverse
        bullets={[
          "Table and grid lead views",
          "Lead info updates & Excel import",
          "My tasks & follow-ups",
          "Website & sign-up lead capture",
        ]}
      />

      <FeatureRow
        eyebrow="Lead automation"
        title="Rules, activity, and channel automations."
        body="Automation rules, activity logs, and dedicated email, WhatsApp, and SMS automation screens keep nurture on autopilot."
        image={IMG.analytics}
        bullets={[
          "Automation rules engine",
          "Activity log per rule",
          "Email automation campaigns",
          "WhatsApp & SMS automation",
        ]}
      />

      <CtaBand />
    </>
  );
}
