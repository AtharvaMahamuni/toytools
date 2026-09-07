import { createFeelApi } from '@lib/engines/feel/registry';
import type { AttachFn } from '../types';

/** ToyTools.feel.* — motion, sound and haptics for fidget tools. */
export const attach: AttachFn = (TT) => {
  // Prefs live on the always-on core; the Feel API reads them fresh on every call.
  TT.feel = createFeelApi(TT as { prefs?: { get: (n: string, f?: unknown) => unknown; set: (n: string, v: unknown) => void } });
};
