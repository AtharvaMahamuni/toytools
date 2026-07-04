// Finance math primitives — pure, framework-free, no formatting, no validation. These are the
// reusable formulas every calculator composes; keeping them isolated makes them exhaustively unit
// testable against hand-computed values. Rates are decimals (0.05 = 5%) EXCEPT ruleOf72, which takes
// a percent (8 = 8%) to match how the rule is taught.

/** Future value of a lump sum under periodic compounding: FV = P (1 + r/n)^(n·t). */
export function futureValueCompound(
  principal: number,
  annualRate: number,
  periodsPerYear: number,
  years: number,
): number {
  if (periodsPerYear <= 0) return principal;
  const i = annualRate / periodsPerYear;
  const n = periodsPerYear * years;
  return principal * Math.pow(1 + i, n);
}

/**
 * Future value of a stream of equal end-of-period contributions (ordinary annuity):
 * PMT · [((1 + i)^N − 1) / i]. Contributions are assumed monthly; they are converted to the
 * compounding cadence by spreading evenly, which for the common monthly case is exact.
 * When i = 0 this degrades to PMT · N.
 */
export function futureValueAnnuity(
  monthlyPayment: number,
  annualRate: number,
  periodsPerYear: number,
  years: number,
): number {
  if (monthlyPayment === 0) return 0;
  if (periodsPerYear <= 0) return monthlyPayment * 12 * years;
  // Convert the monthly contribution to a per-period contribution for the chosen cadence.
  const perPeriodPayment = (monthlyPayment * 12) / periodsPerYear;
  const i = annualRate / periodsPerYear;
  const n = periodsPerYear * years;
  if (i === 0) return perPeriodPayment * n;
  return perPeriodPayment * ((Math.pow(1 + i, n) - 1) / i);
}

/**
 * The level monthly payment needed to grow `current` into `target` over `months`, given an annual
 * return. Solves a sinking fund: PMT = (FV − current·(1+i)^N) · i / ((1+i)^N − 1), with i the
 * MONTHLY rate and N the number of months. When i = 0 it is (target − current) / months.
 * Returns 0 when the current balance already meets the target.
 */
export function requiredMonthlyPayment(
  target: number,
  current: number,
  annualRate: number,
  months: number,
): number {
  if (months <= 0) return Math.max(0, target - current);
  const i = annualRate / 12;
  const grownCurrent = current * Math.pow(1 + i, months);
  const remaining = target - grownCurrent;
  if (remaining <= 0) return 0;
  if (i === 0) return remaining / months;
  return (remaining * i) / (Math.pow(1 + i, months) - 1);
}

/** Purchasing power of an amount after inflation: amount / (1 + inflation)^years. */
export function realValueAfterInflation(amount: number, inflationRate: number, years: number): number {
  return amount / Math.pow(1 + inflationRate, years);
}

/** Future nominal cost of something priced `amount` today: amount · (1 + inflation)^years. */
export function nominalValueAfterInflation(amount: number, inflationRate: number, years: number): number {
  return amount * Math.pow(1 + inflationRate, years);
}

/** Rule of 72 doubling time in years. `ratePercent` is a percent (8 for 8%). */
export function ruleOf72(ratePercent: number): number {
  if (ratePercent <= 0) return Infinity;
  return 72 / ratePercent;
}

/**
 * Compound annual growth rate as a decimal (0.08 = 8%): (end / start)^(1/years) − 1.
 * Only defined for positive start/end values and a positive period; otherwise NaN.
 */
export function compoundAnnualGrowthRate(start: number, end: number, years: number): number {
  if (start <= 0 || end <= 0 || years <= 0) return NaN;
  return Math.pow(end / start, 1 / years) - 1;
}

/** Exact doubling time in years at a constant annual growth rate (decimal): ln(2) / ln(1 + r). */
export function doublingTime(annualRate: number): number {
  if (annualRate <= 0) return Infinity;
  return Math.log(2) / Math.log(1 + annualRate);
}
