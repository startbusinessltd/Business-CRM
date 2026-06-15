import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";
import { SERVICES } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Business CRM" },
      {
        name: "description",
        content:
          "Website builder, leads & CRM, call tracker, social hub, team permissions, and finance — the same services you get inside Business CRM.",
      },
      { property: "og:title", content: "Services — Business CRM" },
      { property: "og:image", content: IMG.servicesHero },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform services"
        title={<>Everything in Business CRM — on one plan.</>}
        lead="These are the same areas your team uses after sign-in: websites and forms, leads and automation, call tracking, social, team access, and billing. No bolt-on modules sold separately."
        primary={{ to: "/pricing", label: "See pricing", crm: "register" }}
        secondary={{ to: "/features", label: "Feature list" }}
        image={IMG.servicesHero}
        mediaStyle={{ aspectRatio: "3/2", maxHeight: 520 }}
        imageStyle={{ objectFit: "cover", objectPosition: "center" }}
      />

      <section className="section">
        <div className="container-x">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
            }}
            className="modules-grid"
          >
            {SERVICES.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="card-flat"
                style={{ overflow: "hidden", display: "block" }}
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <img
                    src={s.img}
                    alt={s.t}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 22, marginTop: 0 }}>{s.t}</h3>
                  <p style={{ marginTop: 8 }}>{s.d}</p>
                  <div
                    style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: "var(--purple)" }}
                  >
                    View service →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <style>{`
            @media (max-width: 980px) { .modules-grid { grid-template-columns: 1fr 1fr !important; } }
            @media (max-width: 640px) { .modules-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
