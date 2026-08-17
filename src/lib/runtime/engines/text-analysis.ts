import { textNotice } from '@lib/text/notice';
import { analyzeText } from '@lib/text/analysis';
import { formatMetric } from '@lib/text/formatters';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.analyze = analyzeText;
  TT.textNotice = textNotice; // (id, text, analysis) → one line about the input, or null
  TT.formatMetric = formatMetric;
};
