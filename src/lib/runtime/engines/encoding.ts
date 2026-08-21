import { runEncoding, encodingProvider } from '@lib/engines/encoding/registry';
import { detectEncoding } from '@lib/engines/encoding/detect';
import { registerTransformProvider } from '../transform';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runEncoding = runEncoding; // ToyTools.runEncoding(id, mode, text) → { ok, output, error }
  TT.detectEncoding = detectEncoding; // ToyTools.detectEncoding(text) → { candidates, next }
  registerTransformProvider(TT, 'encoding', encodingProvider);
};
