import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, IMG, PageHero } from "@/components/site/PageBlocks";
import { SERVICES } from "@/lib/site-content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Platform Features — Business CRM" },
      {
        name: "description",
        content:
          "Feature list across Business CRM services — websites, leads, call tracker, social hub, team, and finance.",
      },
      { property: "og:title", content: "Features — Business CRM" },
      { property: "og:description", content: "Every capability in the product, one platform." },
      { property: "og:image", content: IMG.featuresHero },
    ],
  }),
  component: Features,
});

function Features() {
  return (
    <>
      <PageHero
        eyebrow="Product capabilities"
        title={
          <>
            What you get in{" "}
            <em style={{ fontStyle: "italic", color: "var(--purple-mid)", fontWeight: 500 }}>
              Business CRM
            </em>
            .
          </>
        }
        lead="Website management, lead management, call management, social media management, employee management, finance management."
        primary={{ to: "/pricing", label: "See pricing" }}
        secondary={{ to: "/services", label: "View all services" }}
        image={IMG.featuresHero}
        mediaStyle={{ marginLeft: "clamp(12px, 2vw, 28px)", aspectRatio: "3/2", maxHeight: 520 }}
        imageStyle={{ objectFit: "contain", objectPosition: "center" }}
      />

      {SERVICES.map((m, idx) => (
        <section
          key={m.t}
          className="section-tight"
          style={{ background: idx % 2 ? "var(--paper)" : "var(--ivory)" }}
        >
          <div className="container-x">
            <div className="feature-row" style={idx % 2 ? { direction: "rtl" } : undefined}>
              <div style={{ direction: "ltr" }}>
                <h2 className="h-section" style={{ marginTop: 0 }}>
                  {m.t}
                </h2>
                <p style={{ marginTop: 12, fontSize: 16 }}>{m.d}</p>
                <ul
                  className="feature-bullets-2col"
                  style={{ marginTop: 18, padding: 0, listStyle: "none" }}
                >
                  {m.features.map((it) => (
                    <li
                      key={it}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        color: "var(--ink)",
                        fontSize: 15,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: "var(--brass)",
                          marginTop: 9,
                        }}
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link to={m.to} className="btn btn-ghost" style={{ marginTop: 22 }}>
                  Explore service →
                </Link>
              </div>
              <div className="media-frame" style={{ direction: "ltr", aspectRatio: "5/4" }}>
                <img src={m.img} alt={m.t} loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
