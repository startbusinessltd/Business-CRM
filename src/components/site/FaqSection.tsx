import type { FaqItem } from "@/lib/faq-content";

/**
 * Visible FAQ block backing the FAQPage JSON-LD emitted by `structured-data.ts`.
 * Google requires the marked-up answers to be visible on the page, so any route
 * whose graph includes a FAQPage must render this with the same items array.
 *
 * Native <details>/<summary> on purpose: the answer text is in the prerendered
 * HTML (crawlable by engines that do not run JS) and the accordion works with
 * zero JS shipped.
 */
export function FaqSection({
  items,
  eyebrow = "FAQ",
  title,
}: {
  items: readonly FaqItem[];
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className="section" style={{ background: "var(--paper)" }}>
      <div className="container-x" style={{ maxWidth: 880 }}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>
          {title}
        </h2>
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {items.map((f, i) => (
            <details
              key={f.q}
              className="card-flat"
              open={i === 0}
              style={{ padding: "18px 22px" }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontFamily: "var(--serif)",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--ink)",
                  listStylePosition: "outside",
                }}
              >
                {f.q}
              </summary>
              <p style={{ marginTop: 10, marginBottom: 2, color: "var(--slate)" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
