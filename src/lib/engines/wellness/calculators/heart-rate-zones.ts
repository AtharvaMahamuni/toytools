// Heart Rate Zone calculator: estimated maximum heart rate plus the five training zones. If a resting
// heart rate is supplied it switches to the Karvonen heart-rate-reserve method, which personalises the
// zones to your fitness rather than using a flat percentage of max.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { maxHeartRate, heartRateAt, type MaxHrMethod } from '../models';
import { numberField, optionalNumberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { partsSpec } from '@lib/visualization/types';

const METHODS = ['simple', 'tanaka'] as const;

interface Zone {
  id: string;
  name: string;
  /** Compact name for the chart's label column, which cannot hold the full descriptive name. */
  short: string;
  lo: number;
  hi: number;
}

const ZONES: Zone[] = [
  { id: 'zone1', name: 'Zone 1 — Very light (warm-up)', short: 'Z1 Warm-up', lo: 0.5, hi: 0.6 },
  { id: 'zone2', name: 'Zone 2 — Light (fat burn, base)', short: 'Z2 Fat burn', lo: 0.6, hi: 0.7 },
  { id: 'zone3', name: 'Zone 3 — Moderate (aerobic)', short: 'Z3 Aerobic', lo: 0.7, hi: 0.8 },
  { id: 'zone4', name: 'Zone 4 — Hard (anaerobic)', short: 'Z4 Hard', lo: 0.8, hi: 0.9 },
  { id: 'zone5', name: 'Zone 5 — Maximum (VO2 max)', short: 'Z5 Max', lo: 0.9, hi: 1.0 },
];

export const heartRateZonesCalculator: WellnessCalculator = {
  id: 'heart-rate-zones',
  family: 'cardio',
  capabilities: { loadExample: true, visualization: true },
  fields: [
    { id: 'age', label: 'Age', type: 'slider', default: 30, min: 10, max: 120, step: 1, suffix: 'years' },
    {
      id: 'method',
      label: 'Max HR formula',
      type: 'select',
      default: 'simple',
      options: [
        { value: 'simple', label: '220 − age (classic)' },
        { value: 'tanaka', label: '208 − 0.7 × age (Tanaka)' },
      ],
    },
    {
      id: 'resting',
      label: 'Resting heart rate (optional)',
      type: 'integer',
      default: 0,
      min: 0,
      max: 120,
      step: 1,
      suffix: 'bpm',
      optional: true,
      help: 'Add it to personalise the zones with the Karvonen method.',
    },
  ],

  calculate(input, _opts) {
    const method = selectField(input, 'method', 'a max heart rate formula', METHODS);
    if (!method.ok) return method.result;
    const age = numberField(input, 'age', 'your age', { min: 10, max: 120 });
    if (!age.ok) return age.result;
    if (age.value <= 0) return validationError('Enter an age above zero to estimate your heart rate zones.');

    // Optional: blank means "no resting HR supplied", which selects the percent-of-max method
    // rather than failing. numberField would treat the blank as missing and error out.
    const rest = optionalNumberField(input, 'resting', 'your resting heart rate', { min: 0, max: 120 });
    if (!rest.ok) return rest.result;

    const maxHr = maxHeartRate(age.value, method.value as MaxHrMethod);
    const restHr = rest.value;
    if (restHr > 0 && restHr >= maxHr) {
      return validationError('Your resting heart rate should be well below your estimated maximum. Re-check the value.');
    }
    const usesKarvonen = restHr > 0;

    const hero = card('max-hr', 'Maximum heart rate', `${Math.round(maxHr)} bpm`, {
      raw: Math.round(maxHr),
      emphasis: 'hero',
      note: usesKarvonen ? 'zones personalised with resting HR' : method.value === 'tanaka' ? 'Tanaka estimate' : '220 − age',
    });

    const metrics: ResultCard[] = ZONES.map((z) => {
      const lo = Math.round(heartRateAt(maxHr, restHr, z.lo));
      const hi = Math.round(heartRateAt(maxHr, restHr, z.hi));
      return card(z.id, z.name, `${lo}–${hi} bpm`, { raw: lo, note: `${Math.round(z.lo * 100)}–${Math.round(z.hi * 100)}% intensity` });
    });

    // Five near-identical "142–152 bpm" rows are the hardest thing on this page to scan. As a
    // ladder, bar length IS intensity, so the target zone is findable at a glance. Hardest first.
    const zoneLadder = partsSpec(
      [...ZONES].reverse().map((z) => {
        const lo = Math.round(heartRateAt(maxHr, restHr, z.lo));
        const hi = Math.round(heartRateAt(maxHr, restHr, z.hi));
        return { id: z.id, label: z.short, value: hi, display: `${lo}–${hi}` };
      }),
      {
        kind: 'bars',
        title: 'Your five training zones in beats per minute',
        description: usesKarvonen
          ? 'Personalised with your resting heart rate (Karvonen method).'
          : 'Percent of estimated maximum. Add a resting heart rate to personalise these.',
      },
    );

    const z2 = metrics.find((m) => m.id === 'zone2')!;
    const insights = [
      insight(
        `Your estimated maximum is about ${Math.round(maxHr)} bpm. Easy base-building work sits in Zone 2, roughly ${z2.value}.`,
      ),
      usesKarvonen
        ? insight('Because you entered a resting heart rate, these zones use the Karvonen method, which measures effort against your heart-rate reserve and so reflects your fitness.', 'positive')
        : insight('Add your resting heart rate to switch to the Karvonen method, which personalises the zones to your fitness instead of a flat percentage of max.', 'info'),
      insight(
        'Max heart rate formulas carry a spread of around ten beats either way. For precise zones, a lab test or a chest-strap monitor beats any formula.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: zoneLadder,
      insights,
      assumptions: [
        assumption('Max HR formula', method.value === 'tanaka' ? '208 − 0.7 × age' : '220 − age'),
        assumption('Zone method', usesKarvonen ? 'Karvonen (heart-rate reserve)' : 'percent of maximum'),
        ...(usesKarvonen ? [assumption('Resting HR', `${Math.round(restHr)} bpm`)] : []),
      ],
      decisions: decisions([
        toolDecision('Estimate the calories you burn a day', 'tdee-calculator'),
        toolDecision('Log your daily movement habit', 'move-today-tracker'),
      ]),
      nextQuestions: [
        'What is my fat-burning heart rate zone?',
        'How accurate is 220 minus age?',
        'What is the Karvonen method?',
      ],
      explanation:
        'Training zones divide your effort into five bands from easy to all-out, each defined as a range of heart rates. The ranges are built from your maximum heart rate, estimated here from your age. The default 220 minus age is familiar but rough; the Tanaka formula is a little more accurate across ages. If you add a resting heart rate, the calculator switches to the Karvonen method, which sets zones against your heart-rate reserve, the gap between resting and maximum, so they reflect your individual fitness rather than a population average.',
      meta: { maxHr: Math.round(maxHr), karvonen: usesKarvonen },
    });
  },
};
