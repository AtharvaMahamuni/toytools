// Ideal Weight calculator: the classic height-and-sex formulas (Devine, Robinson, Miller, Hamwi)
// alongside the modern BMI healthy-weight range. It shows all of them at once precisely because they
// disagree, so the honest answer is a range, not a single "ideal" number.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  idealWeight,
  IDEAL_WEIGHT_FORMULAS,
  healthyWeightRangeKg,
  cmToM,
  inToCm,
  kgToLb,
  type Sex,
} from '../models';
import { weight as fmtWeight, weightRange } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { bandSpec } from '@lib/visualization/types';
import type { VizBand } from '@lib/visualization/types';

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;

export const idealWeightCalculator: WellnessCalculator = {
  id: 'ideal-weight',
  family: 'body-composition',
  capabilities: { loadExample: true, visualization: true },
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
    { id: 'height', label: 'Height', type: 'number', default: 175, min: 0, step: 0.1, help: 'Centimetres in metric, total inches in imperial.' },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the formulas', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';

    const h = numberField(input, 'height', 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (h.value <= 0) return validationError('Enter a height above zero to estimate an ideal weight.');

    const heightCm = isMetric ? h.value : inToCm(h.value);
    const s = sex.value as Sex;

    const devine = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.devine);
    const robinson = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.robinson);
    const miller = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.miller);
    const hamwi = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.hamwi);
    const avg = (devine + robinson + miller + hamwi) / 4;

    const [loKg, hiKg] = healthyWeightRangeKg(cmToM(heightCm));

    const hero = card('ideal', 'Ideal weight', fmtWeight(avg, unit.value), {
      raw: Number(avg.toFixed(1)),
      emphasis: 'hero',
      note: 'average of four formulas',
    });

    const metrics: ResultCard[] = [
      card('healthy-range', 'Healthy weight range (BMI)', weightRange(loKg, hiKg, unit.value), { raw: Number(loKg.toFixed(1)), emphasis: 'primary' }),
      card('devine', 'Devine formula', fmtWeight(devine, unit.value), { raw: Number(devine.toFixed(1)) }),
      card('robinson', 'Robinson formula', fmtWeight(robinson, unit.value), { raw: Number(robinson.toFixed(1)) }),
      card('miller', 'Miller formula', fmtWeight(miller, unit.value), { raw: Number(miller.toFixed(1)) }),
      card('hamwi', 'Hamwi formula', fmtWeight(hamwi, unit.value), { raw: Number(hamwi.toFixed(1)) }),
    ];

    // The tool's real message is "a healthy weight is a band, not a single point", which four
    // sibling stat rows actively work against. Draw the BMI healthy range as the band, the average
    // of the formulas as the marker, and the formula spread as the bracket underneath: the single
    // number, its uncertainty, and the wider range it sits inside, all in one picture.
    const toDisplay = (kg: number) => (isMetric ? kg : kgToLb(kg));
    const formulaLo = Math.min(devine, robinson, miller, hamwi);
    const formulaHi = Math.max(devine, robinson, miller, hamwi);
    const scaleLo = Math.min(loKg, formulaLo) - 6;
    const scaleHi = Math.max(hiKg, formulaHi) + 6;
    const suffix = isMetric ? 'kg' : 'lb';
    const bands: VizBand[] = [
      { id: 'below', label: 'Below', from: toDisplay(scaleLo), to: toDisplay(loKg) },
      { id: 'healthy', label: 'Healthy range', from: toDisplay(loKg), to: toDisplay(hiKg), tone: 'good' },
      { id: 'above', label: 'Above', from: toDisplay(hiKg), to: toDisplay(scaleHi) },
    ];

    const insights = [
      insight(
        `The four classic formulas land between ${fmtWeight(Math.min(devine, robinson, miller, hamwi), unit.value)} and ${fmtWeight(Math.max(devine, robinson, miller, hamwi), unit.value)}, averaging about ${fmtWeight(avg, unit.value)}.`,
      ),
      insight(
        `The modern BMI healthy range for your height is wider, ${weightRange(loKg, hiKg, unit.value)}, because it allows for different builds. A healthy weight is a band, not a single point.`,
        'info',
      ),
      insight(
        'These formulas use only height and sex, so they ignore frame size, muscle, and age. Treat the number as a rough anchor, not a goal you must hit exactly.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(toDisplay(avg), bands, {
        title: `Your ideal weight against the healthy range for your height, in ${suffix}`,
        valueLabel: fmtWeight(avg, unit.value),
        description: `The four formulas span ${weightRange(formulaLo, formulaHi, unit.value)}. The BMI healthy range is wider at ${weightRange(loKg, hiKg, unit.value)}.`,
        highlight: {
          from: toDisplay(formulaLo),
          to: toDisplay(formulaHi),
          label: 'the four formulas',
        },
      }),
      insights,
      assumptions: [
        assumption('Units', isMetric ? 'metric (cm)' : 'imperial (in)'),
        assumption('Formulas', 'Devine, Robinson, Miller, Hamwi'),
        assumption('Healthy range', 'BMI 18.5 to 24.9'),
      ],
      decisions: decisions([
        toolDecision('Check your current BMI', 'bmi-calculator'),
        toolDecision('Estimate body fat, which weight cannot show', 'body-fat-calculator'),
        toolDecision('Track your weight toward the range', 'body-weight-tracker'),
      ]),
      nextQuestions: [
        'What should I weigh for my height?',
        'Is ideal weight the same as a healthy weight?',
        'Why do the formulas disagree?',
      ],
      explanation:
        'Ideal body weight formulas were built decades ago, mostly to help dose medication, and they estimate a single target weight from height and sex alone. Devine, Robinson, Miller, and Hamwi each use a base weight at five feet plus a fixed amount per inch above it, which is why they give slightly different answers. Because none accounts for frame size or muscle, the modern approach is the BMI healthy-weight range, shown here alongside them. Read the formulas as a central anchor and the BMI range as the realistic band around it.',
      meta: { ideal: Number(avg.toFixed(1)), devine: Number(devine.toFixed(1)) },
    });
  },
};
