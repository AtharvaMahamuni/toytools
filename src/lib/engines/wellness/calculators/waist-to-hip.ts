// Waist-to-hip ratio against the WHO 2008 substantially-increased cuts.
// Men at or above 0.90, women at or above 0.85. The ratio is waist divided by hip.
// A mixed-unit reading is the craft seam in body.ts, not a second result.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import { positiveField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { WHR_CUTOFF, whrAtOrAbove, whrRatio, type WhrSex } from '../body';

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;

export const waistToHipCalculator: WellnessCalculator = {
  id: 'waist-to-hip-ratio',
  family: 'body-composition',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'segmented',
      default: 'metric',
      options: [
        { value: 'metric', label: 'Metric (cm)' },
        { value: 'imperial', label: 'Imperial (in)' },
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
    },
    {
      id: 'waist',
      label: 'Waist',
      type: 'number',
      default: 80,
      min: 0,
      step: 0.1,
      help: 'Centimetres in metric, inches in imperial. The narrowest part, not the navel.',
    },
    {
      id: 'hip',
      label: 'Hip',
      type: 'number',
      default: 100,
      min: 0,
      step: 0.1,
      help: 'The widest part of the hips, in the same unit as the waist.',
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the cut', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';

    const waist = positiveField(input, 'waist', 'waist circumference', { max: isMetric ? 250 : 120 });
    if (!waist.ok) return waist.result;
    const hip = positiveField(input, 'hip', 'hip circumference', { max: isMetric ? 250 : 120 });
    if (!hip.ok) return hip.result;

    const min = isMetric ? 15 : 8;
    const unitWord = isMetric ? 'cm' : 'in';
    if (waist.value < min) {
      return validationError(`Waist must be at least ${min} ${unitWord}.`);
    }
    if (hip.value < min) {
      return validationError(`Hip must be at least ${min} ${unitWord}.`);
    }

    const s = sex.value as WhrSex;
    const ratio = whrRatio(waist.value, hip.value);
    const cut = WHR_CUTOFF[s].toFixed(2);
    // WHO compares the ratio itself, so 0.897 is below 0.90. Two decimals would print it as 0.90
    // next to "Below 0.90", so a ratio that rounds across the cutoff shows three decimals.
    const high = whrAtOrAbove(s, ratio);
    const band = high ? `At or above ${cut}` : `Below ${cut}`;
    const shown = whrAtOrAbove(s, Number(ratio.toFixed(2))) === high ? ratio.toFixed(2) : ratio.toFixed(3);

    const hero = card('whr', 'Waist to hip ratio', shown, {
      raw: ratio,
      emphasis: 'hero',
      note: band,
    });

    return successResult({
      hero,
      metrics: [
        card('band', 'WHO 2008 cut', band, { raw: WHR_CUTOFF[s], note: s === 'male' ? 'Men, 0.90' : 'Women, 0.85' }),
      ],
      insights: [
        insight(
          `Waist ${waist.value} ${unitWord} divided by hip ${hip.value} ${unitWord} is ${shown}. The substantially increased cut for ${s === 'male' ? 'men' : 'women'} is ${cut}.`,
        ),
        insight(
          'This is a screening cut from the WHO 2008 consultation. It is not a diagnosis of central obesity, and it is not a body-fat measurement.',
          'caution',
        ),
      ],
      assumptions: [
        assumption('Units', isMetric ? 'centimetres' : 'inches'),
        assumption('Sex', s === 'male' ? 'male' : 'female'),
        assumption('Cut', `WHO 2008, ${cut} for ${s === 'male' ? 'men' : 'women'}`),
      ],
      decisions: decisions([
        toolDecision('Check BMI for the same body', 'bmi-calculator'),
        toolDecision('Estimate body fat from a tape', 'body-fat-calculator'),
        toolDecision('Compare lean mass formulas', 'lean-body-mass-calculator'),
      ]),
      nextQuestions: [
        'What is waist to hip ratio?',
        'What waist to hip ratio is high for men and women?',
        'Does this calculate waist to height ratio?',
      ],
      explanation:
        'Waist-to-hip ratio is the waist circumference divided by the hip circumference. The number has no unit when both tapes use the same unit. The WHO expert consultation of 8 to 11 December 2008 treats 0.90 or higher in men, and 0.85 or higher in women, as substantially increased risk. The page shows that cut beside the ratio. It does not compute waist-to-height ratio, and it does not diagnose central obesity.',
      meta: { ratio, cut: WHR_CUTOFF[s], high },
    });
  },
};
