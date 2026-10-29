import { heightChart } from '@lib/number/height';
import { numberPitfall } from '@lib/number/pitfall';
import type { AttachFn } from '../types';

/**
 * ToyTools.pitfall: the arithmetic the other calculators' users get wrong, or null.
 * ToyTools.heightChart: parse, format, and the 5.11 feet-and-inches trap for Height Comparison.
 * Both are static imports. The collector only follows those, and this chunk already loads on
 * every calculator page.
 */
export const attach: AttachFn = (TT) => {
  TT.pitfall = numberPitfall;
  TT.heightChart = heightChart;
};
