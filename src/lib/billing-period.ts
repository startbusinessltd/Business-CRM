/**
 * Monthly vs yearly pricing for the public pricing page.
 *
 * A deliberate mirror of `BillingPeriod.java` and the CRM app's `billing-period.ts`, including the
 * rounding. This is a separate application, so the code cannot be shared — but the numbers must
 * be: a visitor reads a price here, signs up, and is charged by the same server. If these rules
 * drift, the marketing site advertises a saving the checkout does not honour.
 *
 * Prices are GST-exclusive whole rupees. GST is added at checkout from the plan's own rate.
 */

export type BillingPeriod = "MONTHLY" | "YEARLY";

export const MONTHS_IN_YEAR = 12;

/** The subset of a plan these rules need. */
export type PeriodPricedPlan = {
  monthlySellingPrice?: number | null;
  yearlySellingPrice?: number | null;
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
  price?: number | null;
  discountedPrice?: number | null;
  period?: number | null;
};

export function monthsIn(period: BillingPeriod): number {
  return period === "MONTHLY" ? 1 : MONTHS_IN_YEAR;
}

/** The term a plan predating per-term pricing is sold on — mirrors `COALESCE(PAC_PERIOD, 12)`. */
export function periodOfLegacyPlan(plan: PeriodPricedPlan): BillingPeriod {
  const months = plan?.period;
  return months != null && months <= 1 ? "MONTHLY" : "YEARLY";
}

/** What the visitor pays for this term before GST, or null when the plan is not sold on it. */
export function sellingPriceFor(plan: PeriodPricedPlan, period: BillingPeriod): number | null {
  if (!plan) return null;
  const own = period === "MONTHLY" ? plan.monthlySellingPrice : plan.yearlySellingPrice;
  if (own != null) return own;
  // Not derived by dividing: a monthly price invented from a yearly one is a number nobody set.
  if (periodOfLegacyPlan(plan) === period) {
    return plan.discountedPrice ?? plan.price ?? null;
  }
  return null;
}

/** Pre-discount price for this term, for the "Was ₹X" line. */
export function listPriceFor(plan: PeriodPricedPlan, period: BillingPeriod): number | null {
  if (!plan) return null;
  const own = period === "MONTHLY" ? plan.monthlyPrice : plan.yearlyPrice;
  if (own != null) return own;
  return periodOfLegacyPlan(plan) === period ? plan.price ?? null : null;
}

export function isOfferedOn(plan: PeriodPricedPlan, period: BillingPeriod): boolean {
  return sellingPriceFor(plan, period) != null;
}

/** Yearly cost per month, for the "₹X/month, billed yearly" line. Display only. */
export function perMonth(periodPrice: number | null | undefined, period: BillingPeriod): number {
  if (periodPrice == null || !Number.isFinite(periodPrice)) return 0;
  return Math.round(periodPrice / monthsIn(period));
}

/** Whole-percent saving of a year on yearly vs twelve monthly. Zero when yearly is not cheaper. */
export function savingPercent(
  monthlyPrice: number | null | undefined,
  yearlyPrice: number | null | undefined
): number {
  if (monthlyPrice == null || yearlyPrice == null || monthlyPrice <= 0 || yearlyPrice <= 0) return 0;
  const twelveMonths = monthlyPrice * MONTHS_IN_YEAR;
  if (yearlyPrice >= twelveMonths) return 0;
  return Math.round(((twelveMonths - yearlyPrice) / twelveMonths) * 100);
}

/** The saving as whole free months. Floored, so the claim never overstates the discount. */
export function monthsFree(
  monthlyPrice: number | null | undefined,
  yearlyPrice: number | null | undefined
): number {
  if (monthlyPrice == null || yearlyPrice == null || monthlyPrice <= 0) return 0;
  const twelveMonths = monthlyPrice * MONTHS_IN_YEAR;
  if (yearlyPrice >= twelveMonths) return 0;
  return Math.floor((twelveMonths - yearlyPrice) / monthlyPrice);
}

/** The best saving on offer — a headline, so the largest rather than an average. */
export function bestSavingPercent(plans: readonly PeriodPricedPlan[]): number {
  let best = 0;
  for (const plan of plans ?? []) {
    best = Math.max(best, savingPercent(sellingPriceFor(plan, "MONTHLY"), sellingPriceFor(plan, "YEARLY")));
  }
  return best;
}

/** True when at least one plan is sold both ways — otherwise the toggle has nothing to switch. */
export function anyPlanOfferedOnBothTerms(plans: readonly PeriodPricedPlan[]): boolean {
  return (plans ?? []).some((p) => isOfferedOn(p, "MONTHLY") && isOfferedOn(p, "YEARLY"));
}
