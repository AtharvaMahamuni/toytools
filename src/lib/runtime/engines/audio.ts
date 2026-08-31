import { eq } from '@lib/engines/audio/registry';
import type { AttachFn } from '../types';

/** ToyTools.eq.* — equalizer definitions, curve maths, headroom and sharing. */
export const attach: AttachFn = (TT) => {
  TT.eq = eq;
};
