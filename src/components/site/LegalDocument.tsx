import { Link } from "@tanstack/react-router";
import { CONTACT } from "@/lib/site-content";

export type LegalSection = { id?: string; heading: string; paragraphs: string[] };

export function LegalDocument({
  title,
  eyebrow = "Legal",
  lastUpdated,
  intro,
  sections,
  crossLinks,
}: {
  title: string;
  /** Short label above the title — matches corporate “eyebrow” pattern on marketing pages. */
  eyebrow?: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  /** Quick navigation between Privacy, Terms, Refund (same pattern as Website Admin “Content & legal”). */
  crossLinks?: { to: string; label: string; hash?: string }[];
}) {
  return (
    <section
      className="section section--legal"
      style={{ paddingTop: "clamp(36px, 6vw, 56px)", paddingBottom: 72 }}
    >
      <div className="container-x legal-doc">
        <div className="legal-doc__masthead">
          <div className="legal-doc__masthead-top">
            <Link to="/" className="legal-doc__brand site-brand-lockup" aria-label="Business CRM home">
              <img
                src="/sb-logo.svg"
                alt=""
                width={36}
                height={36}
                className="site-brand-logo"
                aria-hidden
              />
              <span className="site-brand-title site-brand-title--header">Business CRM</span>
            </Link>
            <nav className="legal-doc__nav" aria-label="Legal document">
              <Link to="/" className="legal-doc__back">
                ← Home
              </Link>
              {crossLinks && crossLinks.length > 0 ? (
                <span className="legal-doc__cross-group">
                  {crossLinks.map((c) => (
                    <Link
                      key={`${c.to}${c.hash ? `#${c.hash}` : ""}`}
                      to={c.to}
                      hash={c.hash}
                      className="legal-doc__cross"
                    >
                      {c.label}
                    </Link>
                  ))}
                </span>
              ) : null}
            </nav>
          </div>
        </div>
        <span className="eyebrow legal-doc__eyebrow">{eyebrow}</span>
        <p className="legal-doc__updated">
          <span className="pill">Last updated · {lastUpdated}</span>
        </p>
        <h1 className="h-display legal-doc__title" style={{ marginTop: 12 }}>
          {title}
        </h1>
        <p className="lead legal-doc__intro">{intro}</p>
        {sections.map((s) => (
          <section key={s.heading} id={s.id} className="legal-doc__section">
            <h2 className="legal-doc__h2">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={`${s.heading}-${i}`} className="legal-doc__p">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="legal-doc__footer">
          For questions about these documents, contact us at{" "}
          <a href={`mailto:${CONTACT.salesEmail}`}>{CONTACT.salesEmail}</a>
          {" · "}
          <a href={`tel:${CONTACT.phone.replace(/\D/g, "")}`}>{CONTACT.phone}</a>
          {" · "}
          <Link to="/contact">Contact form</Link>
        </p>
      </div>
    </section>
  );
}
