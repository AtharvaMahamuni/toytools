import { runFinance } from '@lib/engines/finance/registry';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runFinance(id, input, { currency }) → InteractiveResult */
export const attach: AttachFn = (TT) => {
  TT.runFinance = runFinance;
  attachExperience(TT);
};
