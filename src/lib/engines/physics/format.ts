// Quantity formatting for live physics readouts. The shared formatMetric
// (src/lib/text/formatters.ts) only covers integer/duration/percentage/1-decimal text
// metrics; physics needs fixed decimal places (stable width under a 10 Hz refresh) and
// unit suffixes, so it gets its own tiny formatter.

/** Fixed-decimal display value. Non-finite input renders as an em-width placeholder. */
export function formatQuantity(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  const fixed = value.toFixed(decimals);
  // toFixed can produce "-0.00" for tiny negatives; normalize so readouts never flicker a sign.
  return parseFloat(fixed) === 0 ? (0).toFixed(decimals) : fixed;
}

/** Display value with its unit, e.g. "2.00 Hz". Unitless quantities get no suffix. */
export function formatWithUnit(value: number, unit: string, decimals = 2): string {
  const q = formatQuantity(value, decimals);
  return unit ? `${q} ${unit}` : q;
}
