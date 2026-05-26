import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/website")({
  head: () => ({
    meta: [
      { title: "Website Management — StartBusiness.ltd" },
      { name: "description", content: "Launch and run your business website from one professional dashboard — templates, SEO, admin and publishing." },
      { property: "og:title", content: "Website Management" },
      { property: "og:description", content: "Your business website, finally connected to the rest of your operation." },
      { property: "og:image", content: IMG.website },
    ],
  }),
  component: WebsiteModule,
});

function WebsiteModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 01 · Website Management"
        title={<>Your website, connected to the rest of your business.</>}
        lead="Choose a professional template, edit it visually, and publish in minutes. Every form, every visitor and every signup flows directly into Leads — no Zapier, no developer required."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/features", label: "All features" }}
        image={IMG.website}
      />

      <StatStrip items={[
        { n: "120+", l: "Professional templates" },
        { n: "< 5 min", l: "From signup to live site" },
        { n: "100/100", l: "Core Web Vitals (avg)" },
        { n: "Built-in", l: "Forms → Leads pipeline" },
      ]} />

      <FeatureRow
        eyebrow="Templates"
        title="A library built for serious businesses."
        body="From professional services and clinics to agencies, retail and consultancies — every template is responsive, accessible and tuned for conversion out of the box."
        image={IMG.laptop}
        bullets={[
          "120+ templates across industries",
          "Edit copy, colours and sections inline",
          "Mobile, tablet and desktop preview",
          "Custom domain & SSL in one click",
        ]}
      />

      <FeatureRow
        eyebrow="Website settings"
        title="SEO, analytics and brand — without plugins."
        body="Manage page titles, meta descriptions, Open Graph images, robots and sitemap from one panel. Your settings ship with the site automatically."
        image={IMG.analytics}
        reverse
        bullets={[
          "Per-page SEO, OG and Twitter metadata",
          "Built-in sitemap.xml and robots.txt",
          "Live performance and visitor analytics",
          "Native consent banner & privacy controls",
        ]}
      />

      <FeatureRow
        eyebrow="Website admin"
        title="One admin panel for everyone on the team."
        body="Invite designers, marketers or agency partners with role-based access. See every change, every publish and every revert in one timeline."
        image={IMG.meeting}
        bullets={[
          "Roles for editor, designer, admin and viewer",
          "Full revision history with one-click rollback",
          "Draft and scheduled publishing",
          "Multi-site management from one workspace",
        ]}
      />

      <CtaBand />
    </>
  );
}
