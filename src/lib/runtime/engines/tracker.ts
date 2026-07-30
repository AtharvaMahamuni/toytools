import { tracker } from '@lib/engines/tracker/registry';
import { attachViz } from '../viz';
import type { AttachFn } from '../types';

/** ToyTools.tracker.* — stateful tracker model + streaks + inline-SVG charts. */
export const attach: AttachFn = (TT) => {
  TT.tracker = tracker;
  attachViz(TT);
};
