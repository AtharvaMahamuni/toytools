import { createFeelApi } from '@lib/engines/feel/registry';
import type { AttachFn } from '../types';

/** ToyTools.feel.* — motion, sound and haptics for fidget tools. */
export const attach: AttachFn = async (TT) => {
  const api = createFeelApi(
    TT as { prefs?: { get: (n: string, f?: unknown) => unknown; set: (n: string, v: unknown) => void } },
  );
  TT.feel = api;
  // Sand and slime physics stay out of the shared Feel chunk so Pop It does not pay for them.
  if (typeof document !== 'undefined' && document.querySelector('[data-kinetic-sand]')) {
    const { sandApi } = await import('@lib/engines/feel/sand');
    (api as typeof api & { sand: typeof sandApi }).sand = sandApi;
  }
  if (typeof document !== 'undefined' && document.querySelector('[data-slime]')) {
    const { slimeApi } = await import('@lib/engines/feel/slime');
    (api as typeof api & { slime: typeof slimeApi }).slime = slimeApi;
  }
};
