import { useEffect } from "react";

/**
 * Pointer-driven motion for the whole site, from one delegated listener.
 *
 * Three effects share a single `pointermove` handler and one animation frame
 * so fast pointer movement never queues more than one style write per frame:
 *
 *  - `.spotlight` — gradient border glow tracking the cursor (`--mx`/`--my`)
 *  - `.tilt`      — subtle 3D rotation toward the cursor (`--rx`/`--ry`)
 *  - `.magnetic`  — element pulls a few px toward the cursor
 *
 * All of it is skipped for coarse pointers and reduced-motion users, where
 * the effects are either meaningless or unwanted.
 */
const TILT_MAX_DEG = 5;
const MAGNET_PULL = 0.28;
const MAGNET_RADIUS = 90;

export function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    // Elements currently displaced by the magnet, so they can be released.
    const pulled = new Set<HTMLElement>();

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as HTMLElement | null;

      const card = target?.closest<HTMLElement>(".spotlight");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }

      const tilt = target?.closest<HTMLElement>(".tilt");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", `${px * TILT_MAX_DEG * 2}deg`);
        tilt.style.setProperty("--rx", `${-py * TILT_MAX_DEG * 2}deg`);
        tilt.dataset.tilted = "1";
      }
      // Release any tilt the pointer has left.
      document.querySelectorAll<HTMLElement>('.tilt[data-tilted="1"]').forEach((el) => {
        if (el === tilt) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        delete el.dataset.tilted;
      });

      // Magnetic buttons within reach of the cursor.
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        if (Math.abs(dx) < r.width / 2 + MAGNET_RADIUS && Math.abs(dy) < r.height / 2 + MAGNET_RADIUS) {
          el.style.transform = `translate(${dx * MAGNET_PULL}px, ${dy * MAGNET_PULL}px)`;
          pulled.add(el);
        } else if (pulled.has(el)) {
          el.style.transform = "";
          pulled.delete(el);
        }
      });
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      pulled.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);
}
