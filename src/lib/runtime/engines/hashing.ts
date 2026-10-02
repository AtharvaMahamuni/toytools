import { runHash, hashingProvider, hashBytes, identifyHash, verifyHash } from '@lib/engines/hashing/registry';
import { compareFileDigest, hashBlob } from '@lib/engines/hashing/file';
import { registerTransformProvider } from '../transform';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runHash = runHash; // ToyTools.runHash(id, text) → Promise<string> (hex digest)
  TT.hashBytes = hashBytes; // ToyTools.hashBytes(id, bytes) → Promise<string>, raw file bytes
  TT.hashBlob = hashBlob; // ToyTools.hashBlob(blob, id, onProgress) → sliced file digest
  TT.compareFileDigest = compareFileDigest; // ToyTools.compareFileDigest(id, expected, actual)
  TT.identifyHash = identifyHash; // ToyTools.identifyHash(text) → length reading
  TT.verifyHash = verifyHash; // ToyTools.verifyHash(finding, actualById, picked)
  registerTransformProvider(TT, 'hashing', hashingProvider);
};
