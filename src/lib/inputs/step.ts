// Adaptive step sizing — large ranges should not use a fixed increment. Reaching ₹5 crore with a ₹10
// step is hopeless, and a ₹1,00,000 step makes ₹500 impossible to fine-tune. The step scales with the
// current magnitude so the same control feels right at every scale.
//
// Engine-agnostic platform utility used by the smart-input increment/decrement buttons.

/**
 * A sensible increment for the given current value. Roughly one significant figure below the value's
 * magnitude, clamped to a minimum so it never returns 0. Pure; never throws.
 */
export function adaptiveStep(value: number): number {
  const abs = Math.abs(value) || 0;
  if (abs < 100) return 10;
  if (abs < 1_000) return 50;
  if (abs < 10_000) return 100;
  if (abs < 100_000) return 500;
  if (abs < 1_000_000) return 1_000;
  if (abs < 10_000_000) return 10_000;
  if (abs < 100_000_000) return 100_000;
  return 1_000_000;
}
