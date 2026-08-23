import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { BillingPeriod } from "@/lib/billing-period";

/**
 * The Monthly | Yearly switch above the plan cards.
 *
 * A two-option segmented control rather than a switch: both terms are named and priced, so the
 * visitor is choosing between two things rather than turning one on. The saving lives on the
 * Yearly segment because that is the reason to press it.
 *
 * Built as a radio group — one tab stop, arrow keys between the options — which is what a screen
 * reader user expects from a segmented control and what a bare pair of buttons gets wrong.
 */
export function BillingPeriodToggle({
  value,
  onChange,
  savingPercent = 0,
  disabled = false,
  ariaLabel = "Billing period",
}: {
  value: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
  savingPercent?: number;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const yearlyRef = useRef<HTMLButtonElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  /**
   * Measure the checked option rather than assuming the two are equal halves.
   *
   * They are not: the Yearly label carries the saving badge, so it is materially wider than
   * Monthly, and `flex: 1 1 0` cannot equalise them because each option's min-content width
   * floors it. A fixed 50% indicator therefore sat about 30px off the option it was meant to be
   * highlighting.
   */
  const measure = useCallback(() => {
    const group = groupRef.current;
    const active = (value === "MONTHLY" ? monthlyRef : yearlyRef).current;
    if (!group || !active) return;
    setThumb({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value]);

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    // Re-measure when the row reflows — a breakpoint change or a font swapping in both move the
    // option boundaries after first paint.
    const ro = new ResizeObserver(measure);
    if (groupRef.current) ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const select = (next: BillingPeriod) => {
    if (disabled || next === value) return;
    onChange(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next: BillingPeriod | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Home") next = "MONTHLY";
    else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "End") next = "YEARLY";
    if (!next) return;
    event.preventDefault();
    select(next);
    const radios = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[next === "MONTHLY" ? 0 : 1]?.focus();
  };

  const optionStyle = (on: boolean): React.CSSProperties => ({
    position: "relative",
    zIndex: 1,
    flex: "1 1 0",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    whiteSpace: "nowrap",
    padding: "9px 22px",
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: on ? "var(--ink, #0f172a)" : "var(--slate, #64748b)",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "color 160ms ease",
  });

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        borderRadius: 999,
        background: "var(--sand, #f1f5f9)",
        border: "1px solid var(--hairline, #e2e8f0)",
      }}
    >
      {/* Sliding indicator behind both labels. Transform rather than left/width so it animates on
          the compositor and cannot smear the text mid-transition. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          // Hidden until measured, so it can never flash at the wrong place on first paint.
          width: thumb ? thumb.width : 0,
          opacity: thumb ? 1 : 0,
          transform: `translateX(${thumb ? thumb.left : 0}px)`,
          borderRadius: 999,
          background: "var(--ivory, #ffffff)",
          boxShadow: "0 1px 3px rgba(15,23,42,.16)",
          transition: "transform 220ms cubic-bezier(.4,0,.2,1), width 220ms cubic-bezier(.4,0,.2,1)",
        }}
      />

      <button
        type="button"
        role="radio"
        aria-checked={value === "MONTHLY"}
        tabIndex={value === "MONTHLY" ? 0 : -1}
        disabled={disabled}
        ref={monthlyRef}
        onClick={() => select("MONTHLY")}
        style={optionStyle(value === "MONTHLY")}
      >
        Monthly
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "YEARLY"}
        tabIndex={value === "YEARLY" ? 0 : -1}
        disabled={disabled}
        ref={yearlyRef}
        onClick={() => select("YEARLY")}
        style={optionStyle(value === "YEARLY")}
      >
        Yearly
        {savingPercent > 0 && (
          /* Inside the button so a screen reader announces "Yearly, save 20%" as one option
             rather than reading a stray number beside it. "Save 0%" is worse than no badge. */
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: "var(--gold-soft, #dcfce7)",
              color: "var(--ink, #166534)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".3px",
              textTransform: "uppercase",
            }}
          >
            Save {savingPercent}%
          </span>
        )}
      </button>
    </div>
  );
}
