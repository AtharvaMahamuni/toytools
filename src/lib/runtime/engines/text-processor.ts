import { runProcessor } from '@lib/text/processors/registry';
import { textHandoff } from '@lib/text/handoff';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.process = runProcessor; // ToyTools.process(processorId, text) → transformed text
  TT.textHandoff = textHandoff; // (processorId, input, output) → the sibling that finishes the job
};
