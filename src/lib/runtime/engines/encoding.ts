import { runEncoding, encodingProvider } from '@lib/engines/encoding/registry';
import { registerTransformProvider } from '../transform';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runEncoding = runEncoding; // ToyTools.runEncoding(id, mode, text) → { ok, output, error }
  registerTransformProvider(TT, 'encoding', encodingProvider);
};
