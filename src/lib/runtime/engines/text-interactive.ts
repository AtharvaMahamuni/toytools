import { diffLines, diffStats } from '@lib/text/compare';
import { CHAINS, checkCommand, describeExpansions, escalate, findChain, findExpansions } from '@lib/shell/quote';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.diff = diffLines; // ToyTools.diff(a, b) → DiffResult[]
  TT.diffStats = diffStats; // → { added, removed, unchanged, similarity }

  // ToyTools.shell — layered shell quoting. Grouped under one namespace rather than four globals
  // because it is one subject, and because ENGINE_GLOBALS declares names one by one.
  TT.shell = { CHAINS, findChain, escalate, findExpansions, describeExpansions, checkCommand };
};
