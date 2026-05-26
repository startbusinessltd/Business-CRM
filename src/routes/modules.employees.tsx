import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/employees")({
  head: () => ({
    meta: [
      { title: "Employee Management — StartBusiness.ltd" },
      { name: "description", content: "Run your team with access profiles, tracking, performance, timesheets, attendance and partner onboarding." },
      { property: "og:title", content: "Employee Management" },
      { property: "og:description", content: "Run your team with clarity and accountability — in the same platform as your customers." },
      { property: "og:image", content: IMG.employees },
    ],
  }),
  component: EmployeesModule,
});

function EmployeesModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 05 · Employee Management"
        title={<>Run your team in the same place you run your business.</>}
        lead="Access profiles, attendance, timesheets, performance and partner onboarding — all next to the customers and pipelines your team works on every day."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/features", label: "All features" }}
        image={IMG.employees}
      />

      <StatStrip items={[
        { n: "1 click", l: "Onboard a new hire" },
        { n: "Live", l: "Attendance & timesheets" },
        { n: "360°", l: "Performance reviews" },
        { n: "Native", l: "Partner & vendor onboarding" },
      ]} />

      <FeatureRow
        eyebrow="Access profiles"
        title="The right people see the right things."
        body="Build role profiles for sales, ops, finance, support and admin in minutes. Apply them to anyone — including external partners — without writing a single permission rule."
        image={IMG.meeting}
        bullets={[
          "Role-based access across every module",
          "SSO and 2FA built in",
          "Audit log for every sensitive action",
          "Partner / vendor profiles with limited scopes",
        ]}
      />

      <FeatureRow
        eyebrow="Tracking, timesheets & attendance"
        title="A modern, respectful way to track work."
        body="Lightweight check-in, mobile-friendly timesheets, shift planning and leave management. Designed to give managers clarity without spying on people."
        image={IMG.dashboard}
        reverse
        bullets={[
          "Mobile check-in with geo-tagging (opt-in)",
          "Timesheets that auto-fill from CRM activity",
          "Shift planner with overtime rules",
          "Leave requests and approvals workflow",
        ]}
      />

      <FeatureRow
        eyebrow="Performance & partners"
        title="Performance and partner onboarding, finally connected."
        body="Set goals tied to real CRM outcomes, review them quarterly, and bring partners into the same platform without giving away the keys."
        image={IMG.handshake}
        bullets={[
          "Goal setting linked to CRM metrics",
          "Quarterly review templates and 1:1 notes",
          "“Become a Partner” onboarding flow",
          "Commission tracking for partners and reps",
        ]}
      />

      <CtaBand />
    </>
  );
}
