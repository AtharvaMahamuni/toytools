import { runHash, hashingProvider } from '@lib/engines/hashing/registry';
import { registerTransformProvider } from '../transform';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runHash = runHash; // ToyTools.runHash(id, text) → Promise<string> (hex digest)
  registerTransformProvider(TT, 'hashing', hashingProvider);
};
