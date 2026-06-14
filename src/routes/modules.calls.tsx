import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/calls")({
  head: () => ({
    meta: [
      { title: "Call Tracker — Business CRM" },
      {
        name: "description",
        content:
          "Native call tracking: dashboard, history, hourly and day-wise reports, employee views, sync log, and leads.",
      },
      { property: "og:title", content: "Call Tracker" },
      { property: "og:image", content: IMG.callcenter },
    ],
  }),
  component: CallsModule,
});

function CallsModule() {
  return (
    <>
      <PageHero
        eyebrow="Call Tracker"
        title={<>Mobile call sync for sales teams.</>}
        lead="The Call Tracker area in Business CRM (backed by the native call-tracker plugin) syncs device calls into dashboards, history, hourly and day-wise reports, employee breakdowns, and sync logs — with leads linked to activity."
        primary={{ to: "/pricing", label: "Get started", crm: "register" }}
        secondary={{ to: "/services", label: "All services" }}
        image={IMG.callcenter}
      />

      <StatStrip
        items={[
          { n: "Native", l: "Android sync" },
          { n: "Live", l: "Dashboard tab" },
          { n: "History", l: "Searchable log" },
          { n: "Leads", l: "Linked records" },
        ]}
      />

      <FeatureRow
        eyebrow="Overview"
        title="Call tracker dashboard."
        body="See team activity from the dashboard tab on /call-tracking — the same overview managers use to monitor outbound and inbound volume."
        image={IMG.dashboard}
        bullets={[
          "Dashboard tab on call tracking",
          "Team-level visibility",
          "Works with CRM roles",
          "No separate dialer subscription",
        ]}
      />

      <FeatureRow
        eyebrow="History & analytics"
        title="History, hourly, and day-wise tabs."
        body="Drill into call history, hourly patterns, and day-wise totals. Filter by employee and date range for coaching and staffing decisions."
        image={IMG.analytics}
        reverse
        bullets={[
          "Call history with sync metadata",
          "Hourly distribution reports",
          "Day-wise summaries",
          "Employee tab for per-rep stats",
        ]}
      />

      <FeatureRow
        eyebrow="Sync & leads"
        title="Sync log and lead linkage."
        body="Inspect the sync log when devices upload recordings or metadata. Tie conversations back to leads inside the CRM."
        image={IMG.meeting}
        bullets={[
          "Sync log for troubleshooting",
          "All leads shortcut from call tracker",
          "Capacitor-friendly mobile workflow",
          "Built for field sales in India",
        ]}
      />

      <CtaBand />
    </>
  );
}
