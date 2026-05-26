import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { IMG, PageHero } from "@/components/site/PageBlocks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — StartBusiness.ltd" },
      { name: "description", content: "Talk to sales, book a demo or reach support. We answer in hours, not days." },
      { property: "og:title", content: "Contact StartBusiness.ltd" },
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
        lead="Whether you want a guided demo, a security review or a quote for a 50-seat rollout — write to us and a real person will reply within one business hour."
        image={IMG.contact}
      />

      <section className="section-tight">
        <div className="container-x">
          <div className="grid-2" style={{ alignItems: "flex-start" }}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="card-flat"
              style={{ padding: 28, display: "grid", gap: 14 }}
            >
              <h2 className="h-section" style={{ fontSize: 28 }}>Send us a message</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Full name" name="name" required />
                <Field label="Company" name="company" />
              </div>
              <Field label="Work email" name="email" type="email" required />
              <Field label="Team size" name="size" placeholder="e.g. 12 people" />
              <div>
                <label style={lblStyle}>How can we help?</label>
                <textarea name="message" rows={5} required style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                {sent ? "Thanks — we'll reply within the hour." : "Send message"}
              </button>
              <p style={{ fontSize: 12, color: "var(--slate)" }}>
                We respect your inbox. No newsletters, no third-party sharing.
              </p>
            </form>

            <div style={{ display: "grid", gap: 20 }}>
              <InfoCard
                title="Sales"
                body="Get a guided tour of all six modules and a quote tailored to your team."
                lines={["sales@startbusiness.ltd", "+44 20 4530 8821 · Mon–Fri, 9:00–18:00 GMT"]}
              />
              <InfoCard
                title="Support"
                body="Existing customers — we typically reply within one business hour."
                lines={["help@startbusiness.ltd", "Live chat from inside the app"]}
              />
              <InfoCard
                title="Partnerships"
                body="Agencies, resellers and integrators — let's talk."
                lines={["partners@startbusiness.ltd"]}
              />
              <div className="media-frame" style={{ aspectRatio: "16/9" }}>
                <img src={IMG.office} alt="Our office" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const lblStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1px solid var(--line)",
  borderRadius: 4, background: "#fff", fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
};

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label style={lblStyle}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

function InfoCard({ title, body, lines }: { title: string; body: string; lines: string[] }) {
  return (
    <div className="card-flat" style={{ padding: 22 }}>
      <div className="num-tag">{title.toUpperCase()}</div>
      <p style={{ marginTop: 8, color: "var(--ink)" }}>{body}</p>
      <div style={{ marginTop: 10, display: "grid", gap: 4, fontSize: 14, color: "var(--slate)" }}>
        {lines.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
