import { runProcessor } from '@lib/text/processors/registry';
import type { AttachFn } from '../types';

/** ToyTools.process(processorId, text) → transformed text */
export const attach: AttachFn = (TT) => {
  TT.process = runProcessor;
};
