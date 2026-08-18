import { Link } from "@tanstack/react-router";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { CtaLink } from "@/lib/crm-parent-bridge";

export type HeroChip = { ico: string; title: string; sub: string; style: CSSProperties };

/** Floating proof chips for the home hero — pass via `chips`; other pages stay clean. */
export const HOME_HERO_CHIPS: HeroChip[] = [
  {
    ico: "⚡",
    title: "+128 leads this week",
    sub: "Lead pipeline",
    style: { top: "8%", right: "-3%", animationDelay: "-1.5s" },
  },
  {
    ico: "₹",
    title: "₹4.2L invoiced",
    sub: "Finance & billing",
    style: { bottom: "12%", left: "-6%", animationDelay: "-3.5s" },
  },
];

export function PageHero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  image,
  video,
  poster,
  mediaStyle,
  imageStyle,
  chips,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  primary?: { to: string; label: string; crm?: "register" | "login" };
  secondary?: { to: string; label: string; crm?: "register" | "login" };
  image?: string;
  video?: string;
  poster?: string;
  mediaStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  chips?: HeroChip[];
}) {
  const floatChips = chips ?? [];
  return (
    <section
      className="hero-canvas"
      style={{
        marginTop: -72,
        paddingTop: "calc(clamp(64px, 9vw, 110px) + 72px)",
        paddingBottom: "clamp(72px, 10vw, 128px)",
      }}
    >
      <div className="orb orb--violet" style={{ width: 420, height: 420, top: -120, left: -80 }} />
      <div className="orb orb--magenta" style={{ width: 360, height: 360, top: "30%", right: -100 }} />
      <div className="orb orb--gold" style={{ width: 300, height: 300, bottom: -120, left: "38%" }} />
      <div className="hero-grid-overlay" />
      <div className="container-wide" style={{ position: "relative", zIndex: 2 }}>
        <div className="feature-row hero-row">
          <div className="page-hero-copy">
            <span className="eyebrow enter" style={{ "--d": "0.05s" } as CSSProperties}>
              {eyebrow}
            </span>
            <h1 className="h-display enter" style={{ marginTop: 22, "--d": "0.15s" } as CSSProperties}>
              {title}
            </h1>
            <p
              className="lead enter"
              style={{ marginTop: 20, fontSize: 19, "--d": "0.3s" } as CSSProperties}
            >
              {lead}
            </p>
            <div
              className="enter"
              style={
                {
                  marginTop: 32,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  "--d": "0.45s",
                } as CSSProperties
              }
            >
              {primary && (
                <CtaLink
                  to={primary.to}
                  label={primary.label}
                  className="btn btn-primary btn-lg"
                  crm={primary.crm}
                />
              )}
              {secondary && (
                <CtaLink
                  to={secondary.to}
                  label={secondary.label}
                  className="btn btn-ghost btn-lg"
                  crm={secondary.crm}
                />
              )}
            </div>
            <div
              className="hero-trust enter"
              style={{ "--d": "0.6s" } as CSSProperties}
            >
              <span className="hero-trust__stars" aria-hidden>
                ★★★★★
              </span>
              <span>Trusted by growing Indian businesses</span>
              <span className="hero-trust__dot" aria-hidden />
              <span>GST & Razorpay ready</span>
            </div>
          </div>
          <div
            className="enter"
            style={{ position: "relative", "--d": "0.35s" } as CSSProperties}
          >
            {floatChips.map((c) => (
              <div key={c.title} className="float-chip" style={c.style}>
                <span className="chip-ico">{c.ico}</span>
                <span>
                  {c.title}
                  <small>{c.sub}</small>
                </span>
              </div>
            ))}
            <div
              className="media-frame"
              style={{ aspectRatio: "4/5", maxHeight: 560, ...mediaStyle }}
            >
              {video ? (
                <video
                  src={video}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={imageStyle}
                />
              ) : image ? (
                <img src={image} alt="" loading="eager" style={imageStyle} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Animates "1,200+" / "99.9%" style figures from 0 when scrolled into view. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.replace(/,/g, "").match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          const n = (target * eased).toFixed(decimals);
          setDisplay(`${prefix}${Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals })}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function StatStrip({ items }: { items: { n: string; l: string }[] }) {
  return (
    <section style={{ borderBlock: "1px solid var(--line)", background: "var(--paper)" }}>
      <div className="container-x stat-strip">
        {items.map((s) => (
          <div key={s.l}>
            <div className="stat-num">
              <CountUp value={s.n} />
            </div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureRow({
  eyebrow,
  title,
  body,
  image,
  reverse,
  bullets,
  mediaClassName,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  reverse?: boolean;
  bullets?: string[];
  mediaClassName?: string;
}) {
  return (
    <section className="section-tight">
      <div className="container-x">
        <div className="feature-row" style={reverse ? { direction: "rtl" } : undefined}>
          <div className="feature-row-copy" style={{ direction: "ltr" }}>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              {title}
            </h2>
            <p style={{ marginTop: 14, fontSize: 17 }}>{body}</p>
            {bullets && (
              <ul
                style={{ marginTop: 18, padding: 0, listStyle: "none", display: "grid", gap: 10 }}
              >
                {bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      color: "var(--ink)",
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: "var(--grad-brand)",
                        color: "#fff",
                        fontSize: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 4,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="feature-glow" style={{ direction: "ltr", minWidth: 0 }}>
            <div className={["media-frame", mediaClassName].filter(Boolean).join(" ")}>
              <img src={image} alt={title} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="surface-ink" style={{ overflow: "hidden", position: "relative" }}>
      <div className="orb orb--violet" style={{ width: 380, height: 380, top: -140, right: "10%" }} />
      <div className="orb orb--gold" style={{ width: 260, height: 260, bottom: -120, left: "6%" }} />
      <div className="hero-grid-overlay" />
      <div className="container-x cta-band-layout" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <h2 className="h-section" style={{ color: "var(--ivory)" }}>
            Run your business on{" "}
            <span
              className="grad-text"
              style={{
                background: "var(--grad-text)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              one professional platform.
            </span>
          </h2>
          <p style={{ marginTop: 12, color: "var(--on-dark-muted)", maxWidth: 560 }}>
            Website, leads, calls, social, team access, and finance — the same services inside
            B-SOFT, with in-app AI when you need guidance.
          </p>
        </div>
        <div className="cta-band-actions">
          <CtaLink to="/pricing" label="Register now" className="btn btn-brass" crm="register" />
          <Link
            to="/contact"
            className="btn btn-outline"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}
          >
            Book a demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export const IMG = {
  hero: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1400&q=80&auto=format&fit=crop",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop",
  aboutHeroVideo: "/images/about-hero.mp4",
  aboutWhatWeShip: "/images/team.png",
  mission:
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&q=80&auto=format&fit=crop",
  meeting:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=80&auto=format&fit=crop",
  /** Lead Management module — analytics / pipeline visual */
  leads:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
  dashboard:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop",
  featuresHero: "/images/features-hero.png",
  servicesHero: "/images/services-hero.png",
  /** Module imagery — local assets in `public/images` (finance / analytics / social / calls) */
  analytics: "/images/module-analytics.png",
  /** Home — “Built for Indian SMBs” FeatureRow (team running the business together) */
  crmConcept:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80&auto=format&fit=crop",
  callcenter: "/images/module-calls.png",
  socialmarketing:
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80&auto=format&fit=crop",
  website:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80&auto=format&fit=crop",
  finance:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80&auto=format&fit=crop",
  invoiceManagement: "/images/invoice-management.png",
  employees:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80&auto=format&fit=crop",
  office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop",
  handshake:
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1400&q=80&auto=format&fit=crop",
  /** Pricing page — growth / value visual */
  pricing:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&q=80&auto=format&fit=crop",
  laptop:
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80&auto=format&fit=crop",
  contact:
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80&auto=format&fit=crop",
  /** Customer story portraits */
  customerFemale: "/images/testimonial-female.png",
  customerMale: "/images/testimonial-male.png",
  customerRavi: "/images/testimonial-ravi.png",
  customerFemaleAlt: "/images/testimonial-female-alt.png",
  city: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80&auto=format&fit=crop",
  /** Local hero clip (copied from user asset into `public/videos/hero-home.mp4`) */
  heroVideo: "/videos/hero-home.mp4",
};
