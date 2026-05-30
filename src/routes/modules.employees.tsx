import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/employees")({
  head: () => ({
    meta: [
      { title: "Team & Permissions — Business CRM" },
      {
        name: "description",
        content:
          "Roles & permissions and employee management — Team & Permissions in Business CRM.",
      },
      { property: "og:title", content: "Team & Permissions" },
      { property: "og:image", content: IMG.employees },
    ],
  }),
  component: EmployeesModule,
});

function EmployeesModule() {
  return (
    <>
      <PageHero
        eyebrow="Team & permissions"
        title={<>Control who sees what in the product.</>}
        lead="Team & Permissions covers access profiles (roles & permissions) and My Team (employee management) — aligned with /access-profile and /employee-management in the Business CRM application."
        primary={{ to: "/pricing", label: "Start 10-day trial", crm: "register" }}
        secondary={{ to: "/services", label: "All services" }}
        image={IMG.employees}
      />

      <StatStrip
        items={[
          { n: "RBAC", l: "Access profiles" },
          { n: "Menu", l: "Package-aware" },
          { n: "Team", l: "Employee CRUD" },
          { n: "Partner", l: "Role support" },
        ]}
      />

      <FeatureRow
        eyebrow="Access profile"
        title="Roles & permissions."
        body="Define which routes and modules each role can open. Package and business-type menu configuration keeps partners and customers on the right plan."
        image={IMG.meeting}
        bullets={[
          "Access profile editor",
          "Module permissions from API",
          "Super-admin vs CRM vs partner roles",
          "Audit-friendly privilege model",
        ]}
      />

      <FeatureRow
        eyebrow="My team"
        title="Employee management."
        body="Invite teammates, assign roles, and maintain employee records next to the pipelines they work."
        image={IMG.dashboard}
        reverse
        bullets={[
          "Employee management screens",
          "Link users to access profiles",
          "Works with sign-up & partner flows",
          "Scoped to tenant package",
        ]}
      />

      <FeatureRow
        eyebrow="Partners"
        title="Partner and white-label access."
        body="Partners get tailored menus (sign-up list, white label) while admins retain full platform controls."
        image={IMG.handshake}
        bullets={[
          "Partner role in menu-data",
          "White label & partner signups",
          "Demo booking for sales teams",
          "Consistent with package type setup",
        ]}
      />

      <CtaBand />
    </>
  );
}
