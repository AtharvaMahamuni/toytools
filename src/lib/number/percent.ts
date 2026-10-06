/**
 * Percentage change from `a` to `b`: (b - a) / |a| x 100.
 *
 * Dividing by the size of the starting value (not its signed value) keeps the sign meaning the same
 * for every baseline: positive is an increase, negative is a decrease. From -20 to 50 is +350%, not
 * -350%. Returns NaN when `a` is 0, where a percentage change is undefined.
 *
 * The Percentage Calculator widget runs this same formula inline (its script is inline, so it cannot
 * import); the e2e suite pins the widget to it.
 */
export function percentChange(a: number, b: number): number {
  if (a === 0) return NaN;
  return ((b - a) / Math.abs(a)) * 100;
}
