import { runGeneration } from '@lib/generation/registry';
import type { AttachFn } from '../types';

/** ToyTools.runGeneration(id, options) → GenerationResult */
export const attach: AttachFn = (TT) => {
  TT.runGeneration = runGeneration;
};
