import type { ReactNode } from "react";

/**
 * Auto-scrolling card row — the cards glide slowly and endlessly, like a train.
 *
 * The item list is repeated enough times to always fill the viewport, then the
 * whole strip is rendered twice so the loop is perfectly seamless. Movement is a
 * slow, constant, linear drift (left → right) and pauses while the pointer is over
 * the row so users can still read and click. Every card keeps the same width and,
 * via `align-items: stretch`, the same height.
 */
export function CardMarquee<T>({
  items,
  render,
  /** Scroll speed in pixels/second — small = very slow, train-like. */
  speed = 40,
  /** Approx. per-card footprint (card width + gap) used for the fill/speed math. */
  cardWidth = 340,
}: {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  speed?: number;
  cardWidth?: number;
}) {
  if (!items.length) return null;

  // Repeat the list until one group is wide enough to cover any realistic screen,
  // so there is never an empty gap at the loop seam.
  const MIN_CARDS_PER_GROUP = 8;
  const reps = Math.max(1, Math.ceil(MIN_CARDS_PER_GROUP / items.length));
  const filled = Array.from({ length: reps }, () => items).flat();

  // One full loop travels exactly one group width; keep the pixel speed constant.
  const durationSec = Math.max(24, Math.round((filled.length * cardWidth) / speed));

  const group = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {filled.map((item, i) => (
        <div className="marquee-cell" key={i}>{render(item, i)}</div>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${durationSec}s` }}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
