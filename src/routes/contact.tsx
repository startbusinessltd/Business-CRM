import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, type ReactNode, useState } from "react";
import { IMG, PageHero } from "@/components/site/PageBlocks";
import { CONTACT } from "@/lib/site-content";
import {
  isValidIndianMobile,
  normalizeIndianMobile,
  submitContactLead,
} from "@/lib/contact-lead-api";

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

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onPhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digits }));
    if (phoneError && (digits.length === 0 || isValidIndianMobile(digits))) {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isValidIndianMobile(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number (starts with 6–9).");
      return;
    }

    setPhoneError(null);
    setSubmitting(true);

    const phoneNumber = normalizeIndianMobile(form.phone);

    try {
      const result = await submitContactLead({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || ".",
        workEmail: form.email.trim(),
        phoneNumber,
        businessName: form.company.trim() || "Not provided",
        message: form.message.trim() || undefined,
      });

      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }

      setSent(true);
      setSuccessMessage(result.message);
      setForm(emptyForm);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

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
              <form onSubmit={handleSubmit} className="card-flat contact-form-card">
                <h2 className="h-section" style={{ fontSize: 28 }}>
                  Send us a message
                </h2>
                <div className="contact-inline-2">
                  <Field
                    label="First name"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                  <Field
                    label="Last name"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
                <Field
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Field
                  label="Contact number"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  value={form.phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  error={phoneError}
                />
                <div>
                  <label style={lblStyle}>How can we help?</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                {submitError ? (
                  <p style={{ fontSize: 14, color: "#b91c1c", margin: 0 }} role="alert">
                    {submitError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending…"
                    : sent
                      ? "Thanks — we will reply within 24 hours."
                      : "Send message"}
                </button>
                {sent && successMessage ? (
                  <p style={{ fontSize: 14, color: "var(--purple)", margin: 0 }}>{successMessage}</p>
                ) : null}
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
                  <a
                    key="web"
                    href={CONTACT.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--purple)", fontWeight: 600 }}
                  >
                    {CONTACT.website}
                  </a>,
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
                  <a
                    key="web2"
                    href={CONTACT.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--purple)", fontWeight: 600 }}
                  >
                    {CONTACT.website}
                  </a>,
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
  error,
  ...props
}: { label: string; error?: string | null } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label style={lblStyle} htmlFor={props.name}>
        {label}
      </label>
      <input
        {...props}
        id={props.name}
        style={{
          ...inputStyle,
          ...(error ? { borderColor: "#b91c1c" } : {}),
        }}
      />
      {error ? (
        <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 4, marginBottom: 0 }} role="alert">
          {error}
        </p>
      ) : null}
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
