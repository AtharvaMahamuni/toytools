// BMR calculator: the Mifflin-St Jeor resting metabolic rate on its own, which is the number
// people search for by name. TDEE answers "how much do I burn in a day"; this answers "how much
// would I burn doing nothing at all", and then shows what each activity level adds on top, so the
// multiplier stops being a black box.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  bmrMifflinStJeor,
  tdee as computeTdee,
  ACTIVITY_FACTOR,
  lbToKg,
  inToCm,
  type ActivityLevel,
  type Sex,
} from '../models';
import { calories } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { partsSpec } from '@lib/visualization/types';

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;

const LEVELS: { id: ActivityLevel; label: string }[] = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'light', label: 'Lightly active' },
  { id: 'moderate', label: 'Moderately active' },
  { id: 'active', label: 'Very active' },
  { id: 'very-active', label: 'Extra active' },
];

export const bmrCalculator: WellnessCalculator = {
  id: 'bmr',
  family: 'energy',
  capabilities: { loadExample: true, visualization: true },
  produces: [{ name: 'basalMetabolicRate', cardId: 'bmr' }],
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'segmented',
      default: 'metric',
      options: [
        { value: 'metric', label: 'Metric (kg, cm)' },
        { value: 'imperial', label: 'Imperial (lb, in)' },
      ],
    },
    {
      id: 'sex',
      label: 'Sex',
      type: 'segmented',
      default: 'male',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      help: 'Used by the BMR equation; enter the sex your body most closely matches metabolically.',
    },
    { id: 'age', label: 'Age', type: 'slider', default: 30, min: 14, max: 120, step: 1, suffix: 'years' },
    { id: 'weight', label: 'Weight', type: 'number', default: 70, min: 0, step: 0.1, help: 'Kilograms in metric, pounds in imperial.' },
    { id: 'height', label: 'Height', type: 'number', default: 175, min: 0, step: 0.1, help: 'Centimetres in metric, total inches in imperial.' },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the BMR equation', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';

    const age = numberField(input, 'age', 'your age', { min: 14, max: 120 });
    if (!age.ok) return age.result;
    const w = numberField(input, 'weight', 'your weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = numberField(input, 'height', 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (w.value <= 0) return validationError('Enter a weight above zero to calculate your BMR.');
    if (h.value <= 0) return validationError('Enter a height above zero to calculate your BMR.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightCm = isMetric ? h.value : inToCm(h.value);

    const bmr = bmrMifflinStJeor(sex.value as Sex, weightKg, heightCm, age.value);
    if (bmr <= 0) return validationError('Those measurements give a resting rate at or below zero. Check the height, weight, and age.');

    const perHour = bmr / 24;

    const hero = card('bmr', 'Basal metabolic rate', calories(bmr), {
      raw: Math.round(bmr),
      emphasis: 'hero',
      note: 'per day at complete rest',
    });

    // Every activity level at once. The multiplier is the part people get wrong, and seeing all
    // five side by side makes the size of the choice obvious before they commit to one.
    const metrics: ResultCard[] = [
      card('per-hour', 'Burned per hour at rest', `${Math.round(perHour)} kcal`, { raw: Math.round(perHour), emphasis: 'primary' }),
      ...LEVELS.map((l) =>
        card(l.id, `${l.label} (x${ACTIVITY_FACTOR[l.id]})`, calories(computeTdee(bmr, l.id)), {
          raw: Math.round(computeTdee(bmr, l.id)),
        }),
      ),
    ];

    const sedentary = computeTdee(bmr, 'sedentary');
    const insights = [
      insight(
        `Even doing nothing at all, your body uses about ${calories(bmr)} a day, roughly ${Math.round(perHour)} kcal every hour, to run your organs and keep you warm.`,
      ),
      insight(
        `BMR is not what you should eat. A sedentary day already costs about ${calories(sedentary)} once you add walking around and digesting food. Eating at your BMR is a steep deficit, not maintenance.`,
        'caution',
      ),
      insight(
        'Weight is the biggest driver here, then height, then age. Sex enters as a fixed offset of 166 kcal, which is why two people of the same size get different numbers.',
        'info',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: partsSpec(
        [
          { id: 'bmr', label: 'At rest', value: Math.round(bmr), display: calories(bmr) },
          {
            id: 'activity',
            label: 'Moderate activity',
            value: Math.round(computeTdee(bmr, 'moderate') - bmr),
            display: calories(computeTdee(bmr, 'moderate') - bmr),
          },
        ],
        {
          kind: 'stacked',
          title: 'Resting burn against a moderately active day',
          description: `Resting metabolism is ${Math.round((bmr / computeTdee(bmr, 'moderate')) * 100)}% of a moderately active day's ${calories(computeTdee(bmr, 'moderate'))}.`,
        },
      ),
      insights,
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('Formula', 'Mifflin-St Jeor'),
        assumption('Body composition', 'not accounted for'),
      ],
      decisions: decisions([
        toolDecision('Add your activity level for a daily calorie target', 'tdee-calculator'),
        toolDecision('Split those calories into protein, carbs, and fat', 'macro-calculator'),
        toolDecision('Estimate body fat, which shifts resting burn', 'body-fat-calculator'),
      ]),
      nextQuestions: [
        'What is a normal BMR?',
        'What is the difference between BMR and TDEE?',
        'Should I eat my BMR to lose weight?',
      ],
      explanation:
        'Basal metabolic rate is the energy your body spends staying alive: pumping blood, breathing, holding temperature, and repairing tissue, measured while completely at rest. The Mifflin-St Jeor equation estimates it as 10 times your weight in kilograms, plus 6.25 times your height in centimetres, minus 5 times your age, then plus 5 for men or minus 161 for women. It replaced the older Harris-Benedict equation because it tracks modern body compositions more closely, though it still knows nothing about your muscle mass. Multiply the result by an activity factor and you get TDEE, the number that actually answers how much to eat.',
      meta: { bmr: Math.round(bmr) },
    });
  },
};
