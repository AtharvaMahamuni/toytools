import { describe, expect, it } from 'vitest';
import { numberPitfall, type PitfallId } from './pitfall';

describe('numberPitfall — the arithmetic each tool exists to correct', () => {
  it('names the subtraction that under-reports a pre-tax price', () => {
    const r = numberPitfall('tax-calculator', { mode: 'remove', total: 100, rate: 20 });
    // 100 - 20% = 80.00; 100 / 1.2 = 83.33. The gap is the whole point.
    expect(r?.text).toContain('$80.00');
    expect(r?.text).toContain('$3.33 higher');
  });

  it('separates percentage points from percentage change', () => {
    const r = numberPitfall('percentage-calculator', { mode: 'change', a: 20, b: 25 });
    expect(r?.text).toContain('5% points');
    expect(r?.text).toContain('25% change');
  });

  it('calls a below-cost price a loss, on the margin calculator', () => {
    const r = numberPitfall('margin-calculator', { cost: 60, price: 45 });
    expect(r?.text).toContain('$15.00 lost');
    expect(r?.text).toContain('not a margin');
  });

  it('says markup rather than margin on the markup calculator', () => {
    expect(numberPitfall('markup-calculator', { cost: 60, price: 45 })?.text).toContain('not a markup');
  });

  it('rounds a restaurant total up and reports what that actually tipped', () => {
    // 85.00 + 18% = 100.30, so rounding up is 101.00 and the tip is 16.00 / 18.82%.
    const r = numberPitfall('tip-calculator', { bill: 85, tipPct: 18 });
    expect(r?.text).toContain('$101.00');
    expect(r?.text).toContain('$16.00');
  });

  it('points a second discount at the discounted price, and offers to chain it', () => {
    const r = numberPitfall('discount-calculator', { price: 120, final: 84 });
    expect(r?.text).toContain('applies to $84.00');
    expect(r?.action?.value).toBe(84);
  });

  it('reports the combined rate once a chain is running, which is the number people get wrong', () => {
    // 30% off 120 is 84; a further 20% is 67.20. That is 44% off, not 50%.
    const r = numberPitfall('discount-calculator', { price: 84, final: 67.2, basePrice: 120 });
    expect(r?.text).toContain('44% off the original $120.00');
  });
});

// Silence is half the contract. A line that appears on every input is a tip strip, not craft.
describe('numberPitfall — silence', () => {
  it('says nothing when a form is empty or half-filled', () => {
    const ids: PitfallId[] = [
      'tax-calculator', 'percentage-calculator', 'margin-calculator',
      'markup-calculator', 'tip-calculator', 'discount-calculator',
    ];
    for (const id of ids) expect(numberPitfall(id, {})).toBeNull();
  });

  it('says nothing when tax is being added rather than removed', () => {
    expect(numberPitfall('tax-calculator', { mode: 'add', total: 100, rate: 20 })).toBeNull();
  });

  it('says nothing at a zero tax rate, where both methods agree', () => {
    expect(numberPitfall('tax-calculator', { mode: 'remove', total: 100, rate: 0 })).toBeNull();
  });

  it('says nothing outside the percentage-of-a-percentage reading', () => {
    // Revenue 1200 to 1500 has no "percentage points" interpretation to warn about.
    expect(numberPitfall('percentage-calculator', { mode: 'change', a: 1200, b: 1500 })).toBeNull();
  });

  it('says nothing in the other percentage modes', () => {
    expect(numberPitfall('percentage-calculator', { mode: 'of', a: 20, b: 25 })).toBeNull();
    expect(numberPitfall('percentage-calculator', { mode: 'is', a: 20, b: 25 })).toBeNull();
  });

  it('says nothing when the two readings coincide', () => {
    // From 100, a change of n percent IS n percentage points, so there is nothing to distinguish.
    expect(numberPitfall('percentage-calculator', { mode: 'change', a: 100, b: 75 })).toBeNull();
  });

  it('says nothing on a profitable price, which is nearly every one', () => {
    expect(numberPitfall('margin-calculator', { cost: 60, price: 100 })).toBeNull();
    expect(numberPitfall('markup-calculator', { cost: 60, price: 60 })).toBeNull();
  });

  it('says nothing when the total already lands on a whole number', () => {
    expect(numberPitfall('tip-calculator', { bill: 100, tipPct: 20 })).toBeNull();
  });

  it('says nothing about stacking before there is a discount to stack onto', () => {
    expect(numberPitfall('discount-calculator', { price: 120, final: 120 })).toBeNull();
    expect(numberPitfall('discount-calculator', { price: 0, final: 0 })).toBeNull();
  });
});
