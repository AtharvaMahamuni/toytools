import { analyzeText } from '@lib/text/analysis';
import { formatMetric } from '@lib/text/formatters';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.analyze = analyzeText;
  TT.formatMetric = formatMetric;
};
