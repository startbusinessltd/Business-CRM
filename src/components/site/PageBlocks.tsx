import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

export function PageHero({
  eyebrow, title, lead, primary, secondary, image, video, poster,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  primary?: { to: string; label: string };
  secondary?: { to: string; label: string };
  image?: string;
  video?: string;
  poster?: string;
}) {
  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="container-x">
        <div className="feature-row">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="h-display" style={{ marginTop: 18 }}>{title}</h1>
            <p className="lead" style={{ marginTop: 18, fontSize: 19 }}>{lead}</p>
            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {primary && <Link to={primary.to} className="btn btn-primary">{primary.label}</Link>}
              {secondary && <Link to={secondary.to} className="btn btn-ghost">{secondary.label}</Link>}
            </div>
          </div>
          <div className="media-frame" style={{ aspectRatio: "4/5", maxHeight: 560 }}>
            {video ? (
              <video src={video} poster={poster} autoPlay muted loop playsInline />
            ) : image ? (
              <img src={image} alt="" loading="eager" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatStrip({ items }: { items: { n: string; l: string }[] }) {
  return (
    <section style={{ borderBlock: "1px solid var(--line)", background: "var(--paper)" }}>
      <div className="container-x" style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 24, padding: "40px 24px" }}>
        {items.map((s) => (
          <div key={s.l}>
            <div className="stat-num">{s.n}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureRow({
  eyebrow, title, body, image, reverse, bullets,
}: {
  eyebrow: string; title: string; body: string; image: string; reverse?: boolean;
  bullets?: string[];
}) {
  return (
    <section className="section-tight">
      <div className="container-x">
        <div className="feature-row" style={reverse ? { direction: "rtl" } : undefined}>
          <div style={{ direction: "ltr" }}>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: 16 }}>{title}</h2>
            <p style={{ marginTop: 14, fontSize: 17 }}>{body}</p>
            {bullets && (
              <ul style={{ marginTop: 18, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                {bullets.map((b) => (
                  <li key={b} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--ink)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brass)", marginTop: 10, flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="media-frame" style={{ direction: "ltr", aspectRatio: "5/4" }}>
            <img src={image} alt={title} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="surface-ink">
      <div className="container-x" style={{ padding: "72px 24px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <h2 className="h-section" style={{ color: "var(--ivory)" }}>Run your business on one professional platform.</h2>
          <p style={{ marginTop: 12, color: "oklch(0.85 0.02 250)", maxWidth: 560 }}>
            Six modules. Thirty plus AI features. Replace four tools with one — and give your team the clarity they've been asking for.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Link to="/pricing" className="btn btn-brass">Start 14-day trial</Link>
          <Link to="/contact" className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>Book a demo</Link>
        </div>
      </div>
    </section>
  );
}

export const IMG = {
  hero: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1400&q=80&auto=format&fit=crop",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop",
  meeting: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&q=80&auto=format&fit=crop",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop",
  analytics: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1400&q=80&auto=format&fit=crop",
  callcenter: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=80&auto=format&fit=crop",
  socialmarketing: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1400&q=80&auto=format&fit=crop",
  website: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80&auto=format&fit=crop",
  finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80&auto=format&fit=crop",
  employees: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80&auto=format&fit=crop",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop",
  handshake: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=80&auto=format&fit=crop",
  laptop: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80&auto=format&fit=crop",
  contact: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80&auto=format&fit=crop",
  customer1: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop",
  customer2: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop",
  customer3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
  customer4: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop",
  city: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80&auto=format&fit=crop",
  // Stable mixkit MP4 (no audio, looped, corporate b-roll)
  heroVideo: "https://assets.mixkit.co/videos/4761/4761-720.mp4",
};
