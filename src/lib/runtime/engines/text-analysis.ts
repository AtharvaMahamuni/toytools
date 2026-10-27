import { textNotice } from '@lib/text/notice';
import { analyzeText, isNumberToken, wordTokens } from '@lib/text/analysis';
import { formatMetric } from '@lib/text/formatters';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.analyze = analyzeText;
  TT.wordTokens = wordTokens; // the Words-count tokenizer, lowercased, for unique and top words
  TT.isNumberToken = isNumberToken; // Word Frequency's Ignore numbers option
  TT.textNotice = textNotice; // (id, text, analysis) → one line about the input, or null
  TT.formatMetric = formatMetric;
};
