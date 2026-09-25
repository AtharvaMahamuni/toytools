import { runProcessor } from '@lib/text/processors/registry';
import { textHandoff } from '@lib/text/handoff';
import { detectInvisible } from '@lib/text/invisible';
import { packPrompt } from '@lib/text/promptPack';
import { cleanChatExport } from '@lib/text/chatClean';
import { estimateContextFitById } from '@lib/text/contextFit';
import { buildLlmsTxt } from '@lib/text/llmsDraft';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.process = runProcessor; // ToyTools.process(processorId, text) → transformed text
  TT.textHandoff = textHandoff; // (processorId, input, output) → the sibling that finishes the job
  TT.detectInvisible = detectInvisible; // ToyTools.detectInvisible(text) → { findings, counts, cleaned, spoofRisk }
  TT.packPrompt = packPrompt; // ToyTools.packPrompt(fields, format) → assembled prompt, no model call
  TT.cleanChatExport = cleanChatExport; // ToyTools.cleanChatExport(text, options) → cleaned transcript
  TT.estimateContextFit = estimateContextFitById; // ToyTools.estimateContextFit(text, modelId) → estimate or null
  TT.buildLlmsTxt = buildLlmsTxt; // ToyTools.buildLlmsTxt(input) → llms.txt text, no model call
};
