// Finance runtime. It does not import the full registry: heavier calculators load per page through
// lazy.ts, keyed by the widget's data-finance attribute.
import { loadFinanceCalculator, runLazyFinance } from '@lib/engines/finance/lazy';
import { upiNextPay } from '@lib/engines/finance/calculators/upi-1999-split';
import { parseHumanNumber } from '@lib/inputs/parse';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runFinance(id, input, { currency }) → InteractiveResult */
export const attach: AttachFn = async (TT) => {
  const ids = new Set<string>();
  for (const el of document.querySelectorAll('[data-finance]')) {
    const id = el.getAttribute('data-finance');
    if (id) ids.add(id);
  }
  // Awaited before TT.ready flips, so the widget's first render already has its calculator.
  await Promise.all([...ids].map(loadFinanceCalculator));
  TT.runFinance = runLazyFinance;
  TT.upiNextPay = upiNextPay;
  TT.parseAmount = parseHumanNumber; // the shared number parser, for inline widget scripts
  attachExperience(TT);
};
