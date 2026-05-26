import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FeatureRow, IMG, PageHero, StatStrip } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/modules/leads")({
  head: () => ({
    meta: [
      { title: "Lead Management — StartBusiness.ltd" },
      { name: "description", content: "Capture, nurture and convert leads with pipelines, forms, dashboards, reminders, appointments and AI guidance." },
      { property: "og:title", content: "Lead Management" },
      { property: "og:description", content: "From first form fill to closed deal — in one professional pipeline." },
      { property: "og:image", content: IMG.meeting },
    ],
  }),
  component: LeadsModule,
});

function LeadsModule() {
  return (
    <>
      <PageHero
        eyebrow="Module 02 · Lead Management"
        title={<>From first click to closed deal — in one professional pipeline.</>}
        lead="Capture leads from forms, signups and calls. Move them through pipelines you control. Let AI tell your reps what to do next, and never let a lead go cold again."
        primary={{ to: "/pricing", label: "Start free trial" }}
        secondary={{ to: "/contact", label: "See a live demo" }}
        image={IMG.meeting}
      />

      <StatStrip items={[
        { n: "+38%", l: "Conversion uplift, avg" },
        { n: "−6 hrs", l: "Saved per rep, per week" },
        { n: "100%", l: "Lead activity tracked" },
        { n: "AI", l: "Next-step guidance" },
      ]} />

      <FeatureRow
        eyebrow="Pipelines"
        title="Pipelines that match how you actually sell."
        body="Build any number of stages, any number of pipelines — by team, region, product line or deal size. Drag deals between stages, set required fields per stage, and forecast revenue with confidence."
        image={IMG.dashboard}
        bullets={[
          "Unlimited custom pipelines and stages",
          "Required fields and approvals per stage",
          "Revenue forecast, weighted by stage probability",
          "Per-rep, per-team and per-product views",
        ]}
      />

      <FeatureRow
        eyebrow="Form builder"
        title="Forms that send leads straight into your pipeline."
        body="Drag-and-drop builder with conditional logic, file uploads and UTM capture. Every submission lands in Leads with full attribution — no copy-pasting from spreadsheets."
        image={IMG.laptop}
        reverse
        bullets={[
          "Conditional logic and multi-step forms",
          "UTM, referrer and source auto-capture",
          "Embed anywhere or host on your StartBusiness site",
          "Spam protection without CAPTCHAs",
        ]}
      />

      <FeatureRow
        eyebrow="Reminders, appointments & AI guidance"
        title="The work to do next, surfaced automatically."
        body="Tasks, reminders and appointments live next to every lead. Our AI watches activity and recommends the next best action — when to call, when to follow up, when to back off."
        image={IMG.analytics}
        bullets={[
          "Smart task reminders and to-do list per rep",
          "Native calendar with appointment booking links",
          "AI suggested next steps per deal",
          "Signup-lead capture from any web form",
        ]}
      />

      <CtaBand />
    </>
  );
}
