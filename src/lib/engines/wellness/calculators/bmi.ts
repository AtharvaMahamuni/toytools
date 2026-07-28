// BMI calculator: Body Mass Index from weight and height, in metric (kg/cm) or imperial (lb/in),
// with the WHO adult category, the healthy-weight range for the given height, and how far the
// current weight sits from that range. BMI is a screening ratio, not a diagnosis — the insights
// say so plainly rather than over-claiming.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  bmi as computeBmi,
  bmiCategory,
  BMI_CATEGORY_LABEL,
  healthyWeightRangeKg,
  weightToHealthyKg,
  lbToKg,
  cmToM,
  inToM,
} from '../models';
import { num1, weight as fmtWeight, weightRange } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { bandSpec } from '@lib/visualization/types';
import type { VizBand } from '@lib/visualization/types';

const UNITS = ['metric', 'imperial'] as const;

/**
 * The WHO adult bands as a drawable scale. The axis stops at 15 and 40 because that is where the
 * useful resolution is; the renderer clamps anything beyond to the nearest edge rather than
 * stretching the scale for one outlier.
 */
const BMI_BANDS: VizBand[] = [
  { id: 'underweight', label: 'Underweight', from: 15, to: 18.5 },
  { id: 'normal', label: 'Healthy', from: 18.5, to: 25, tone: 'good' },
  { id: 'overweight', label: 'Overweight', from: 25, to: 30 },
  { id: 'obese', label: 'Obesity', from: 30, to: 40 },
];

export const bmiCalculator: WellnessCalculator = {
  id: 'bmi',
  family: 'body-composition',
  capabilities: { loadExample: true, visualization: true },
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
      id: 'weight',
      label: 'Weight',
      type: 'number',
      default: 70,
      min: 0,
      step: 0.1,
      help: 'Kilograms in metric, pounds in imperial.',
    },
    {
      id: 'height',
      label: 'Height',
      type: 'number',
      default: 175,
      min: 0,
      step: 0.1,
      help: 'Centimetres in metric, total inches in imperial.',
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const isMetric = unit.value === 'metric';

    const w = numberField(input, 'weight', 'your weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = numberField(input, 'height', 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (w.value <= 0) return validationError('Enter a weight above zero to calculate your BMI.');
    if (h.value <= 0) return validationError('Enter a height above zero to calculate your BMI.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightM = isMetric ? cmToM(h.value) : inToM(h.value);

    const value = computeBmi(weightKg, heightM);
    const cat = bmiCategory(value);
    const label = BMI_CATEGORY_LABEL[cat];
    const [loKg, hiKg] = healthyWeightRangeKg(heightM);
    const delta = weightToHealthyKg(weightKg, heightM);

    const hero = card('bmi', 'Body Mass Index', num1(value), {
      raw: Number(value.toFixed(2)),
      emphasis: 'hero',
      note: label,
    });

    const metrics: ResultCard[] = [
      card('category', 'Category', label, { emphasis: 'primary' }),
      card('healthy-range', 'Healthy weight for your height', weightRange(loKg, hiKg, unit.value), {
        raw: Number(loKg.toFixed(1)),
      }),
    ];
    if (delta !== 0 && Number.isFinite(delta)) {
      const verb = delta > 0 ? 'to lose to reach' : 'to gain to reach';
      metrics.push(
        card('to-healthy', `Weight ${verb} the healthy range`, fmtWeight(Math.abs(delta), unit.value), {
          raw: Number(Math.abs(delta).toFixed(1)),
        }),
      );
    }

    const insights = [
      insight(
        cat === 'normal'
          ? `A BMI of ${num1(value)} sits in the healthy range (18.5 to 24.9) for adults.`
          : `A BMI of ${num1(value)} falls in the "${label}" band. The healthy range for your height is ${weightRange(loKg, hiKg, unit.value)}.`,
        cat === 'normal' ? 'positive' : 'info',
      ),
      insight(
        'BMI is a quick screening ratio, not a diagnosis. It does not tell muscle from fat, so very muscular or older bodies can be mislabelled. Treat it as one signal among many.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(value, BMI_BANDS, {
        title: `Your BMI of ${num1(value)} on the WHO adult scale`,
        valueLabel: num1(value),
        description: `Healthy weight for your height: ${weightRange(loKg, hiKg, unit.value)}.`,
      }),
      insights,
      milestones: [
        {
          id: 'ms-healthy',
          label: 'Weight is within the healthy BMI range',
          reached: cat === 'normal',
        },
      ],
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('Formula', 'weight (kg) / height (m)²'),
        assumption('Categories', 'WHO adult ranges (18.5 / 25 / 30)'),
      ],
      decisions: decisions([
        toolDecision('Estimate the calories you burn a day', 'tdee-calculator'),
        toolDecision('Measure body fat, which BMI cannot see', 'body-fat-calculator'),
        toolDecision('Track your weight over time', 'body-weight-tracker'),
      ]),
      nextQuestions: [
        'How many calories do I burn in a day?',
        'What is my body fat percentage?',
        'Is BMI accurate for athletes?',
      ],
      explanation:
        'BMI divides your weight in kilograms by the square of your height in metres. The result is compared against fixed adult bands set by the World Health Organization. Because it uses only height and weight, BMI cannot distinguish muscle from fat or account for frame size, so it works best as a population-level screen rather than an individual verdict.',
      meta: { bmi: Number(value.toFixed(2)), category: cat },
    });
  },
};
