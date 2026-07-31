import { diffLines, diffStats } from '@lib/text/compare';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.diff = diffLines; // ToyTools.diff(a, b) → DiffResult[]
  TT.diffStats = diffStats; // → { added, removed, unchanged, similarity }
};
