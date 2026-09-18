import { runFinance } from '@lib/engines/finance/registry';
import { upiNextPay } from '@lib/engines/finance/calculators/upi-1999-split';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runFinance(id, input, { currency }) → InteractiveResult */
export const attach: AttachFn = (TT) => {
  TT.runFinance = runFinance;
  TT.upiNextPay = upiNextPay;
  attachExperience(TT);
};
