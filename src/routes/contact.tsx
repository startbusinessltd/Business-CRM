import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { IMG, PageHero } from "@/components/site/PageBlocks";
import { CONTACT } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Business CRM" },
      {
        name: "description",
        content: "Talk to sales, book a demo or reach support. We answer in hours, not days.",
      },
      { property: "og:title", content: "Contact Business CRM" },
      { property: "og:description", content: "Reach our sales, support or partnerships team." },
      { property: "og:image", content: IMG.contact },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to a human. Today.</>}
        lead={`Book a demo, ask about partner / white-label access, or get help with your account. ${CONTACT.replyTime}`}
        image={IMG.contact}
      />

      <section className="section-tight" style={{ paddingBlockStart: 24 }}>
        <div className="container-x">
          <div className="grid-2 contact-grid">
            <div className="contact-form-column">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="card-flat contact-form-card"
              >
                <h2 className="h-section" style={{ fontSize: 28 }}>
                  Send us a message
                </h2>
                <div className="contact-inline-2">
                  <Field label="Full name" name="name" required />
                  <Field label="Company" name="company" />
                </div>
                <Field label="Work email" name="email" type="email" required />
                <Field label="Team size" name="size" placeholder="e.g. 12 people" />
                <div>
                  <label style={lblStyle}>How can we help?</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  {sent ? "Thanks — we'll reply within the hour." : "Send message"}
                </button>
                <p style={{ fontSize: 12, color: "var(--slate)" }}>
                  We respect your inbox. No newsletters, no third-party sharing.
                </p>
                <div className="contact-map-slot">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.0620053629042!2d77.63206636805342!3d12.90823000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae149314b77195%3A0x5eae83dc056e8011!2sRoyal%20Space!5e0!3m2!1sen!2sin!4v1780078384210!5m2!1sen!2sin"
                    width="100%"
                    height="220"
                    className="contact-map-iframe"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Royal Space office location"
                  />
                </div>
              </form>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <InfoCard
                title="Sales & demos"
                body="See Website, Leads, Call Tracker, Social Hub, Team, and Finance in a live walkthrough."
                lines={[
                  <span key="brand" style={{ fontWeight: 600, color: "var(--ink)" }}>
                    Business CRM
                  </span>,
                  <a
                    key="mail"
                    href={`mailto:${CONTACT.salesEmail}`}
                    title="Opens your email app to write us"
                    style={{ color: "var(--purple)", fontWeight: 600 }}
                  >
                    {CONTACT.salesEmail}
                  </a>,
                  CONTACT.phone,
                ]}
              />
              <InfoCard
                title="Support"
                body="Logged-in customers — use in-app help, learning videos, and the built-in AI assistant."
                lines={[
                  <span key="brand2" style={{ fontWeight: 600, color: "var(--ink)" }}>
                    Business CRM
                  </span>,
                  <a
                    key="mail2"
                    href={`mailto:${CONTACT.supportEmail}`}
                    title="Opens your email app to write us"
                    style={{ color: "var(--purple)", fontWeight: 600 }}
                  >
                    {CONTACT.supportEmail}
                  </a>,
                  "Help videos inside the app",
                ]}
              />
              <InfoCard
                title="Office"
                body="Business CRM · Bengaluru"
                lines={CONTACT.office.split("\n")}
              />
              <img
                src={IMG.office}
                alt="Our office"
                loading="lazy"
                className="contact-office-photo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const lblStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  borderRadius: 4,
  background: "#fff",
  fontFamily: "inherit",
  fontSize: 14,
  color: "var(--ink)",
};

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label style={lblStyle}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

function InfoCard({ title, body, lines }: { title: string; body: string; lines: ReactNode[] }) {
  return (
    <div className="card-flat" style={{ padding: 22 }}>
      <div className="num-tag">{title.toUpperCase()}</div>
      <p style={{ marginTop: 8, color: "var(--ink)" }}>{body}</p>
      <div style={{ marginTop: 10, display: "grid", gap: 4, fontSize: 14, color: "var(--slate)" }}>
        {lines.map((l, i) => (
          <span key={i} style={{ display: "block" }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
