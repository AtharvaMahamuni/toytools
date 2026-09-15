// Statistics Visualizer calculator: paste a list of numbers, get mean/median/mode/quartiles/
// standard deviation with a combined histogram + box plot. Client-side only; nothing is uploaded.

import type { MathCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { histogramSpec } from '@lib/visualization/types';
import {
  descriptiveStats,
  formatStat,
  histogramBins,
  parseNumberList,
  MAX_STATS_VALUES,
  type StdevMode,
} from '../statistics';
import { selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';

const MODES = ['sample', 'population'] as const;

const DEFAULT_PASTE =
  '72, 85, 90, 68, 75, 88, 92, 70, 81, 79, 95, 66, 84, 77, 89';

export const statisticsCalculator: MathCalculator = {
  id: 'statistics',
  family: 'statistics',
  capabilities: { loadExample: true, visualization: true },
  layout: [
    'hero',
    'visualization',
    'metrics',
    'insights',
    'assumptions',
    'explanation',
    'nextQuestions',
    'decisions',
  ],
  fields: [
    {
      id: 'values',
      label: 'Numbers',
      type: 'text',
      multiline: true,
      default: DEFAULT_PASTE,
      help: 'Paste or type numbers separated by commas, spaces, or new lines. Stays in this tab.',
    },
    {
      id: 'stdevMode',
      label: 'Standard deviation',
      type: 'select',
      default: 'sample',
      options: [
        { value: 'sample', label: 'Sample (n − 1)' },
        { value: 'population', label: 'Population (n)' },
      ],
      help: 'Sample divides by n − 1 (most homework). Population divides by n (whole set known).',
    },
  ],

  calculate(input, _opts) {
    const raw = String(input.values ?? '');
    const parsed = parseNumberList(raw);
    if (!parsed) {
      return validationError(
        'Paste at least one number. Separate values with commas, spaces, or new lines.',
      );
    }
    if (parsed.length > MAX_STATS_VALUES) {
      return validationError(
        `Keep the list at ${MAX_STATS_VALUES.toLocaleString('en-US')} numbers or fewer so the charts stay responsive.`,
      );
    }

    const modeField = selectField(input, 'stdevMode', 'sample or population standard deviation', MODES);
    if (!modeField.ok) return modeField.result;
    const mode = modeField.value as StdevMode;

    if (mode === 'sample' && parsed.length < 2) {
      return validationError(
        'Sample standard deviation needs at least two numbers. Switch to population, or paste more values.',
      );
    }

    const stats = descriptiveStats(parsed, mode);
    if (!stats) return validationError('Could not compute statistics for that list.');

    const bins = histogramBins(stats.sorted);
    const visualization = histogramSpec(
      bins.map((b) => ({
        id: b.id,
        label: b.label,
        value: b.count,
        display: String(b.count),
      })),
      {
        min: stats.min,
        q1: stats.q1,
        median: stats.median,
        q3: stats.q3,
        max: stats.max,
        outliers: stats.outliers,
      },
      {
        title: 'Histogram and box plot of your numbers',
        description: 'Bars show how many values fall in each bin; the box plot below marks the five-number summary.',
      },
    );

    const modeText =
      stats.modes.length === 0
        ? 'none (every value appears once)'
        : stats.modes.length === 1
          ? formatStat(stats.modes[0]!)
          : stats.modes.map(formatStat).join(', ');

    const hero = card('mean', 'Mean', formatStat(stats.mean), {
      raw: stats.mean,
      emphasis: 'hero',
      note: `of ${stats.count} values`,
    });

    const metrics: ResultCard[] = [
      card('median', 'Median', formatStat(stats.median), { raw: stats.median, emphasis: 'primary' }),
      card('mode', 'Mode', modeText, {
        raw: stats.modes.length === 1 ? stats.modes[0] : undefined,
      }),
      card('stdev', mode === 'sample' ? 'Sample SD' : 'Population SD', formatStat(stats.stdev), {
        raw: stats.stdev,
        emphasis: 'primary',
      }),
      card('variance', 'Variance', formatStat(stats.variance), { raw: stats.variance }),
      card('q1', 'Q1 (25th %)', formatStat(stats.q1), { raw: stats.q1 }),
      card('q3', 'Q3 (75th %)', formatStat(stats.q3), { raw: stats.q3 }),
      card('iqr', 'IQR', formatStat(stats.iqr), { raw: stats.iqr }),
      card('range', 'Range', formatStat(stats.range), { raw: stats.range }),
      card('min', 'Minimum', formatStat(stats.min), { raw: stats.min }),
      card('max', 'Maximum', formatStat(stats.max), { raw: stats.max }),
      card('count', 'Count', String(stats.count), { raw: stats.count }),
    ];

    const skewHint =
      stats.mean > stats.median + Math.max(1e-9, Math.abs(stats.median) * 1e-6)
        ? 'The mean sits above the median, so the distribution leans right (a longer upper tail).'
        : stats.mean < stats.median - Math.max(1e-9, Math.abs(stats.median) * 1e-6)
          ? 'The mean sits below the median, so the distribution leans left (a longer lower tail).'
          : 'Mean and median are close, so the distribution is roughly symmetric.';

    const outlierInsight =
      stats.outliers.length > 0
        ? insight(
            `${stats.outliers.length} outlier${stats.outliers.length === 1 ? '' : 's'} sit outside the Tukey fences (Q1 − 1.5·IQR to Q3 + 1.5·IQR): ${stats.outliers.map(formatStat).join(', ')}.`,
            'warning',
          )
        : insight('No Tukey outliers: every value sits inside the whiskers of the box plot.', 'positive');

    return successResult({
      hero,
      metrics,
      visualization,
      insights: [
        insight(skewHint, 'info'),
        outlierInsight,
        insight(
          `Five-number summary: ${formatStat(stats.min)}, ${formatStat(stats.q1)}, ${formatStat(stats.median)}, ${formatStat(stats.q3)}, ${formatStat(stats.max)}.`,
          'info',
        ),
      ],
      assumptions: [
        assumption('Privacy', 'numbers stay in this browser tab; nothing is uploaded'),
        assumption(
          'Standard deviation',
          mode === 'sample' ? 'sample (divide by n − 1)' : 'population (divide by n)',
        ),
        assumption('Quartiles', 'inclusive Tukey hinges (median of each half)'),
        assumption('Outliers', 'Tukey 1.5·IQR fences on the box plot'),
      ],
      decisions: decisions([
        toolDecision('Turn counts of outcomes into probabilities', 'probability-calculator'),
        toolDecision('Count combinations or permutations', 'combinations-permutations-calculator'),
        toolDecision('Work with fractions instead of decimals', 'fraction-calculator'),
        toolDecision('Factor a number into primes', 'prime-factorization-calculator'),
      ]),
      nextQuestions: [
        'Should I use sample or population standard deviation?',
        'What does a skewed histogram mean?',
        'How do I read a box plot?',
      ],
      explanation:
        'The mean is the arithmetic average. The median is the middle value of the sorted list. Quartiles split the sorted list into fourths with Tukey hinges. Sample standard deviation divides squared deviations by n − 1; population divides by n. The histogram bins the range into equal-width intervals; the box plot marks min, Q1, median, Q3, and max with Tukey outliers drawn as dots.',
      meta: {
        count: stats.count,
        mean: stats.mean,
        median: stats.median,
        stdev: stats.stdev,
      },
    });
  },
};
