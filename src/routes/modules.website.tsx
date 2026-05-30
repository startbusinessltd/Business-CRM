import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/website")({
  head: () => ({
    meta: [
      { title: "Website & Web Builder — Business CRM" },
      {
        name: "description",
        content:
          "Website type, templates, settings, form builder, SEO & GEO, website admin, and AI chat — in Business CRM.",
      },
      { property: "og:title", content: "Website & Web Builder" },
      { property: "og:image", content: IMG.website },
    ],
  }),
  component: WebsiteModule,
});

function WebsiteModule() {
  return (
    <>
      <PageHero
        eyebrow="Website & web builder"
        title={<>Templates, forms, and SEO — tied to your CRM.</>}
        lead="Pick a website type and template classification, configure site settings, publish forms, and optimise SEO & GEO. Website admin controls who can edit and publish — the same flows as /website-type, /templates, and /form-builder in the app."
        primary={{ to: "/pricing", label: "Start 10-day trial", crm: "register" }}
        secondary={{ to: "/services", label: "All services" }}
        image={IMG.website}
      />

      <StatStrip
        items={[
          { n: "12+", l: "Business-type templates" },
          { n: "Forms", l: "Builder → leads" },
          { n: "SEO", l: "& GEO screens" },
          { n: "AI", l: "In-app assistant" },
        ]}
      />

      <FeatureRow
        eyebrow="Templates"
        title="Website type & template library."
        body="Choose web types and template classifications for salon, ecommerce, insurance, startup, and more. Activate, publish, and assign the right site to each business type."
        image={IMG.laptop}
        bullets={[
          "Website type management",
          "Template classification catalogue",
          "Publish status per template",
          "Default website per account",
        ]}
      />

      <FeatureRow
        eyebrow="Forms & SEO"
        title="Form builder and SEO & GEO."
        body="Build lead-capture forms with the drag-and-drop form builder, then tune discoverability from SEO & GEO — without leaving Business CRM."
        image={IMG.analytics}
        reverse
        bullets={[
          "Form builder with publish & embed",
          "SEO & GEO configuration",
          "Website settings panel",
          "Submissions flow to leads",
        ]}
      />

      <FeatureRow
        eyebrow="Admin & AI"
        title="Website admin plus in-app guidance."
        body="Super-admin and CRM roles manage website admin screens. Teams can use AI Chat to learn how to configure sites, forms, and templates."
        image={IMG.meeting}
        bullets={[
          "Website admin for privileged roles",
          "Role-aware access from access profile",
          "AI Chat (/ai-chat) for how-to help",
          "Connected to web-builder APIs",
        ]}
      />

      <CtaBand />
    </>
  );
}
