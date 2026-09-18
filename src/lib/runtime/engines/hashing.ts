import { runHash, hashingProvider, hashBytes, identifyHash, verifyHash } from '@lib/engines/hashing/registry';
import { registerTransformProvider } from '../transform';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runHash = runHash; // ToyTools.runHash(id, text) → Promise<string> (hex digest)
  TT.hashBytes = hashBytes; // ToyTools.hashBytes(id, bytes) → Promise<string>, raw file bytes
  TT.identifyHash = identifyHash; // ToyTools.identifyHash(text) → length reading
  TT.verifyHash = verifyHash; // ToyTools.verifyHash(finding, actualById, picked)
  registerTransformProvider(TT, 'hashing', hashingProvider);
};
