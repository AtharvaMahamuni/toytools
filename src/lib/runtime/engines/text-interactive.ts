import { diffLines, diffStats, whitespaceNoise } from '@lib/text/compare';
import { explainSummary, looksExpensive, runRegexTest } from '@lib/text/regex-tester';
import { CHAINS, checkCommand, describeExpansions, escalate, findChain, findExpansions } from '@lib/shell/quote';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.diff = diffLines; // ToyTools.diff(a, b) → DiffResult[]
  TT.diffStats = diffStats; // → { added, removed, unchanged, similarity }
  TT.whitespaceNoise = whitespaceNoise; // → how much of a diff is whitespace, or null

  // ToyTools.shell — layered shell quoting. Grouped under one namespace rather than four globals
  // because it is one subject, and because ENGINE_GLOBALS declares names one by one.
  TT.shell = { CHAINS, findChain, escalate, findExpansions, describeExpansions, checkCommand };

  // ToyTools.regex — match + explain for the Regex Tester. Grouped under one namespace so the
  // engine globals list stays short and the Worker path in the widget can call the same verbs.
  TT.regex = { test: runRegexTest, looksExpensive, explainSummary };
};
