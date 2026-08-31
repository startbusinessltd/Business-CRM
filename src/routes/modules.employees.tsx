import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/modules/employees")({
  head: () =>
    pageHead({
      path: "/modules/employees",
      title: "Team Roles & Permissions Management | B-SOFT",
      description:
        "Control who sees what in B-SOFT: roles and access profiles, employee management and package-based menu access - the right screens for the right people.",
    }),
  component: EmployeesModule,
});

function EmployeesModule() {
  return (
    <>
      <PageHero
        eyebrow="Team & permissions"
        title={<>Control who sees what in the product.</>}
        lead="Team & Permissions covers access profiles (roles & permissions) and My Team (employee management) — aligned with /access-profile and /employee-management in the B-SOFT application."
        primary={{ to: "/pricing", label: "Register now", crm: "register" }}
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
        title="Partner and reseller access."
        body="Partners get tailored menus (sign-up list, reseller tools) while admins retain full platform controls."
        image={IMG.meeting}
        bullets={[
          "Partner role in menu-data",
          "Reseller & partner signups",
          "Demo booking for sales teams",
          "Consistent with package type setup",
        ]}
      />

      <CtaBand />
    </>
  );
}
