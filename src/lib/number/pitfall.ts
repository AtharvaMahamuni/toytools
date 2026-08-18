// The craft seam for the six bespoke calculators on the `calculator` engine.
//
// Why one module rather than six touches. Each of these tools has, in its knowledge file, exactly
// one documented mistake of the same shape: an arithmetic a person does in their head that gives a
// different answer from the one the tool computes. The tool prints the right number and says
// nothing about the wrong one, so a person who arrives already holding the wrong number has no way
// to find out they disagree.
//
//   tax-calculator         "Removing tax by subtracting the rate instead of dividing by 1 + rate"
//   percentage-calculator  "Confusing percentage change with percentage points"
//   margin-calculator      "Applying margin to cost price instead of selling price"
//   markup-calculator      "Confusing markup (over cost) with margin (over price)"
//   discount-calculator    "Adding stacked percentage discounts instead of applying in sequence"
//   tip-calculator         the table move the output stops one step short of: rounding the total
//
// Each rule is silent unless the input actually exhibits the failure, which is what separates this
// from a strip of tips. The `calculator` engine had no browser runtime before this (its widgets are
// self-contained), so this module is what gives it one: ToyTools.pitfall, one small lazy chunk on
// the seven pages that declare the engine.
//
// See docs/analysis/2026-08-11-tool-craft.md.

export type PitfallId =
  | 'tax-calculator'
  | 'percentage-calculator'
  | 'margin-calculator'
  | 'markup-calculator'
  | 'tip-calculator'
  | 'discount-calculator';

export interface Pitfall {
  /** One line, in the user's terms. Never restates the headline number. */
  text: string;
  /** A one-tap follow-through, when the fact alone leaves work undone. */
  action?: { label: string; value: number };
}

/** Everything any rule can read. Widgets pass what they have; absent fields simply fail the guard. */
export interface PitfallInput {
  mode?: string;
  /** percentage-calculator */
  a?: number;
  b?: number;
  /** tax-calculator */
  total?: number;
  rate?: number;
  /** margin-calculator, markup-calculator */
  cost?: number;
  price?: number;
  /** tip-calculator */
  bill?: number;
  tipPct?: number;
  /** discount-calculator */
  final?: number;
  /** discount-calculator: the price before any discount in the current chain, if one is running. */
  basePrice?: number;
}

const money = (n: number): string => `$${(Math.round(n * 100) / 100).toFixed(2)}`;

/** Percentages read better without trailing zeros: 25%, not 25.00%. */
const pct = (n: number): string => {
  const r = Math.round(n * 100) / 100;
  return `${Number.isInteger(r) ? r : Number(r.toFixed(2))}%`;
};

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/**
 * One line about the arithmetic, or null when the input does not exhibit the failure.
 *
 * Pure and total: every rule guards its own inputs, so a widget can call this on every keystroke
 * with a half-filled form and get null until there is something true to say.
 */
export function numberPitfall(id: PitfallId, input: PitfallInput): Pitfall | null {
  switch (id) {
    case 'tax-calculator': {
      // The documented mistake, and the only one of these that is pure arithmetic: subtracting the
      // rate from a tax-inclusive total under-reports the pre-tax price, always, and by more the
      // larger the rate. Fires only in remove mode, which the user opted into.
      if (input.mode !== 'remove') return null;
      const { total, rate } = input;
      if (!finite(total) || !finite(rate) || total <= 0 || rate <= 0) return null;
      const naive = total * (1 - rate / 100);
      const correct = total / (1 + rate / 100);
      const gap = correct - naive;
      if (gap < 0.01) return null;
      return {
        text: `Subtracting ${pct(rate)} would give ${money(naive)}. Removing tax divides by 1 plus the rate instead, which is ${money(gap)} higher.`,
      };
    }

    case 'percentage-calculator': {
      // Percentage points and percentage change are the same word and different numbers, and they
      // only collide when the two values are themselves rates. Outside 0 to 100 there is no second
      // reading to warn about, so a revenue figure of 1200 to 1500 gets nothing.
      if (input.mode !== 'change') return null;
      const { a, b } = input;
      if (!finite(a) || !finite(b) || a === 0 || a === b) return null;
      if (a < 0 || a > 100 || b < 0 || b > 100) return null;
      const change = ((b - a) / Math.abs(a)) * 100;
      const points = b - a;
      if (Math.abs(Math.abs(points) - Math.abs(change)) < 0.05) return null;
      return {
        text: `If A and B are themselves percentages, that is a gap of ${pct(points)} points, which is not the same as a ${pct(change)} change.`,
      };
    }

    case 'margin-calculator':
    case 'markup-calculator': {
      // A negative margin prints as a percentage like any other, and a percentage is the one format
      // that makes a loss easy to skim past. Silent on every profitable pair, which is nearly all
      // of them.
      const { cost, price } = input;
      if (!finite(cost) || !finite(price) || cost <= 0 || price <= 0 || price >= cost) return null;
      const metric = id === 'margin-calculator' ? 'margin' : 'markup';
      return {
        text: `This price is below cost: ${money(cost - price)} lost on every unit, so the figure above is a loss, not a ${metric}.`,
      };
    }

    case 'tip-calculator': {
      // The output stops at an exact total, and the next thing a person does at a table is round it
      // to something they can write on a slip. Silent when it already lands whole.
      const { bill, tipPct: rate } = input;
      if (!finite(bill) || !finite(rate) || bill <= 0 || rate < 0) return null;
      const total = bill * (1 + rate / 100);
      const rounded = Math.ceil(total);
      if (rounded - total < 0.005) return null;
      const effective = ((rounded - bill) / bill) * 100;
      return {
        text: `Round the total up to ${money(rounded)} and the tip becomes ${money(rounded - bill)}, or ${pct(effective)}.`,
      };
    }

    case 'discount-calculator': {
      // "30% off, extra 20% at the till" is 44% off, not 50%, and the tool computes one discount at
      // a time with no way to chain them. The action feeds the result back in so the second
      // discount lands on the right base by construction.
      const { price, final, basePrice } = input;
      if (!finite(price) || !finite(final) || price <= 0 || final < 0 || final >= price) return null;
      const chained = finite(basePrice) && basePrice > final;
      const text = chained
        ? `${pct((1 - final / basePrice!) * 100)} off the original ${money(basePrice!)} in total. Stacked percentages multiply, they do not add.`
        : `A second discount applies to ${money(final)}, not to ${money(price)}. Stacked percentages multiply, they do not add.`;
      return { text, action: { label: 'Stack another discount', value: final } };
    }

    default:
      return null;
  }
}
