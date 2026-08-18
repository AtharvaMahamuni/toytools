import { numberPitfall } from '@lib/number/pitfall';
import type { AttachFn } from '../types';

/** ToyTools.pitfall(id, input) → the arithmetic this calculator's users get wrong, or null. */
export const attach: AttachFn = (TT) => {
  TT.pitfall = numberPitfall;
};
