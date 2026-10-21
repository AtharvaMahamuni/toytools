// Body surface area from Mosteller (1987) and Du Bois (1916).
// Mosteller is the hero. Du Bois stays on screen so one unlabeled square-metre figure
// cannot hide which formula was copied. The spread note lives in body.ts.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { inToCm, lbToKg } from '../models';
import { positiveField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { duBoisM2, mostellerM2 } from '../body';

const UNITS = ['metric', 'imperial'] as const;
const MIN_HEIGHT_CM = 50;
const MIN_HEIGHT_IN = 20;

function area(n: number): string {
  return `${n.toFixed(2)} m²`;
}

function signedSpread(n: number): string {
  const body = `${Math.abs(n).toFixed(3)} m²`;
  if (n > 0) return `+${body}`;
  if (n < 0) return `-${body}`;
  return body;
}

export const bodySurfaceAreaCalculator: WellnessCalculator = {
  id: 'body-surface-area',
  family: 'body-composition',
  capabilities: { loadExample: true },
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
      id: 'height',
      label: 'Height',
      type: 'number',
      default: 175,
      min: 0,
      step: 0.1,
      help: 'Centimetres in metric, total inches in imperial. Not metres.',
    },
    {
      id: 'weight',
      label: 'Weight',
      type: 'number',
      default: 70,
      min: 0,
      step: 0.1,
      help: 'Kilograms in metric, pounds in imperial.',
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const isMetric = unit.value === 'metric';

    const h = positiveField(input, 'height', 'your height', { max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    const w = positiveField(input, 'weight', 'your weight', { max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;

    const minHeight = isMetric ? MIN_HEIGHT_CM : MIN_HEIGHT_IN;
    if (h.value < minHeight) {
      return validationError(
        isMetric
          ? `Your height must be at least ${MIN_HEIGHT_CM} cm. Not metres? Enter centimetres, so 1.8 m is 180.`
          : `Your height must be at least ${MIN_HEIGHT_IN} in. Not feet? Enter total inches, so 5 ft 11 in is 71.`,
      );
    }

    const heightCm = isMetric ? h.value : inToCm(h.value);
    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const mosteller = mostellerM2(heightCm, weightKg);
    const dubois = duBoisM2(heightCm, weightKg);
    const spread = mosteller - dubois;

    const hero = card('mosteller', 'Body surface area', area(mosteller), {
      raw: mosteller,
      emphasis: 'hero',
      note: 'Mosteller formula',
    });

    const metrics: ResultCard[] = [
      card('dubois', 'Du Bois formula', area(dubois), { raw: dubois }),
      card('spread', 'Formula spread', signedSpread(spread), {
        raw: spread,
        emphasis: 'primary',
        note: 'Mosteller minus Du Bois',
      }),
    ];

    return successResult({
      hero,
      metrics,
      insights: [
        insight(`Mosteller is ${area(mosteller)} and Du Bois is ${area(dubois)}. Mosteller minus Du Bois is ${signedSpread(spread)}.`),
        insight(
          'Both formulas estimate surface area from height and weight. Neither figure is a chemotherapy dose, a cardiac index, or a paediatric dose.',
          'caution',
        ),
      ],
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('Formulas', 'Mosteller 1987 and Du Bois 1916'),
        assumption('Hero', 'Mosteller'),
      ],
      decisions: decisions([
        toolDecision('Check BMI for the same height and weight', 'bmi-calculator'),
        toolDecision('Compare lean mass formulas', 'lean-body-mass-calculator'),
        toolDecision('See ideal weight from height and sex', 'ideal-weight-calculator'),
      ]),
      nextQuestions: [
        'What is body surface area?',
        'What is the Mosteller formula?',
        'Does this calculate a chemotherapy dose?',
      ],
      explanation:
        'Body surface area is estimated here by two published formulas. Mosteller (New England Journal of Medicine, 1987) is the square root of height in centimetres times weight in kilograms, divided by 3600. Du Bois and Du Bois (Archives of Internal Medicine, 1916) is 0.007184 times height to the power 0.725 times weight to the power 0.425. Mosteller is the hero because it is the formula people copy. Du Bois stays beside it, with the signed spread, so an unlabeled square-metre figure still names its formula. The page does not compute a chemotherapy dose.',
      meta: { mosteller, dubois, spread },
    });
  },
};
