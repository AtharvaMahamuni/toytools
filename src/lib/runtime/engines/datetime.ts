// Date runtime. It does not import the full registry: the heavier tools load per page through
// lazy.ts, keyed by the widget's data-datetime attribute. See ../../engines/datetime/lazy.ts.
import { loadDateTimeTool, runLazyDateTime } from '@lib/engines/datetime/lazy';
import { attachExperience } from '../experience';
import type { AttachFn } from '../types';

/** ToyTools.runDateTime(id, input, { timezone?, locale? }) → InteractiveResult */
export const attach: AttachFn = async (TT) => {
  const ids = new Set<string>();
  for (const el of document.querySelectorAll('[data-datetime]')) {
    const id = el.getAttribute('data-datetime');
    if (id) ids.add(id);
  }
  // Awaited before TT.ready flips, so the widget's first render already has its tool.
  await Promise.all([...ids].map(loadDateTimeTool));
  TT.runDateTime = runLazyDateTime;
  attachExperience(TT);
};
