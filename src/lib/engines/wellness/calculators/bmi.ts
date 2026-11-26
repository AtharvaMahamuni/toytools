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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

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

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const unit = selectField(input, 'unit', ei.fieldUnit ?? 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const isMetric = unit.value === 'metric';

    const w = numberField(input, 'weight', ei.fieldWeight ?? 'your weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = numberField(input, 'height', ei.fieldHeight ?? 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (w.value <= 0) return validationError(ei.errWeightZero ?? 'Enter a weight above zero to calculate your BMI.');
    if (h.value <= 0) return validationError(ei.errHeightZero ?? 'Enter a height above zero to calculate your BMI.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightM = isMetric ? cmToM(h.value) : inToM(h.value);

    const value = computeBmi(weightKg, heightM);
    // The category follows the value on screen (one decimal), and the distance to the healthy
    // range agrees with it: 150 lb at 65 in is 24.96, shown as 25, so it reads Overweight with
    // 0.4 lb to lose, never "25, Healthy weight" (accuracy audit, 3 Nov 2026).
    const shown = Math.round(value * 10) / 10;
    const cat = bmiCategory(shown);
    const label = ei.cats?.[cat] ?? BMI_CATEGORY_LABEL[cat];
    const [loKg, hiKg] = healthyWeightRangeKg(heightM);
    const delta = cat === 'normal' ? 0 : weightToHealthyKg(weightKg, heightM);
    const bmiFormatted = num1(value);
    const rangeFormatted = weightRange(loKg, hiKg, unit.value);

    const hero = card('bmi', ei.heroLabel ?? 'Body Mass Index', bmiFormatted, {
      raw: Number(value.toFixed(2)) || Number(value.toPrecision(2)),
      emphasis: 'hero',
      note: label,
    });

    const metrics: ResultCard[] = [
      card('category', ei.categoryLabel ?? 'Category', label, { emphasis: 'primary' }),
      card('healthy-range', ei.healthyRangeLabel ?? 'Healthy weight for your height', rangeFormatted, {
        raw: Number(loKg.toFixed(1)),
      }),
    ];
    if (delta !== 0 && Number.isFinite(delta)) {
      const toHealthyLabel = delta > 0
        ? (ei.weightToLoseLabel ?? 'Weight to lose to reach the healthy range')
        : (ei.weightToGainLabel ?? 'Weight to gain to reach the healthy range');
      metrics.push(
        card('to-healthy', toHealthyLabel, fmtWeight(Math.abs(delta), unit.value), {
          raw: Number(Math.abs(delta).toFixed(1)),
        }),
      );
    }

    const insights = [
      insight(
        cat === 'normal'
          ? tpl(ei.insightNormal ?? 'A BMI of {bmi} sits in the healthy range (18.5 to 24.9) for adults.', { bmi: bmiFormatted })
          : tpl(ei.insightOther ?? 'A BMI of {bmi} falls in the "{label}" band. The healthy range for your height is {range}.', { bmi: bmiFormatted, label, range: rangeFormatted }),
        cat === 'normal' ? 'positive' : 'info',
      ),
      insight(
        ei.insightCaveat ?? 'BMI is a quick screening ratio, not a diagnosis. It does not tell muscle from fat, so very muscular or older bodies can be mislabelled. Treat it as one signal among many.',
        'caution',
      ),
    ];

    const bands = ei.bands
      ? BMI_BANDS.map(b => ({ ...b, label: ei.bands[b.id] ?? b.label }))
      : BMI_BANDS;

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(value, bands, {
        title: tpl(ei.vizTitle ?? 'Your BMI of {bmi} on the WHO adult scale', { bmi: bmiFormatted }),
        valueLabel: bmiFormatted,
        description: tpl(ei.vizDesc ?? 'Healthy weight for your height: {range}.', { range: rangeFormatted }),
      }),
      insights,
      milestones: [
        {
          id: 'ms-healthy',
          label: ei.milestoneHealthy ?? 'Weight is within the healthy BMI range',
          reached: cat === 'normal',
        },
      ],
      assumptions: [
        assumption(ei.assumpUnitsTerm ?? 'Units', isMetric ? (ei.assumpMetric ?? 'metric (kg, cm)') : (ei.assumpImperial ?? 'imperial (lb, in)')),
        assumption(ei.assumpFormulaTerm ?? 'Formula', ei.assumpFormulaVal ?? 'weight (kg) / height (m)²'),
        assumption(ei.assumpCatsTerm ?? 'Categories', ei.assumpCatsVal ?? 'WHO adult ranges (18.5 / 25 / 30)'),
      ],
      decisions: decisions([
        toolDecision('Estimate the calories you burn a day', 'tdee-calculator'),
        toolDecision('Measure body fat, which BMI cannot see', 'body-fat-calculator'),
        toolDecision('Track your weight over time', 'body-weight-tracker'),
      ]).map(d => {
        const map: Record<string, string | undefined> = {
          'tdee-calculator': ei.decTdee,
          'body-fat-calculator': ei.decBodyFat,
          'body-weight-tracker': ei.decWeight,
        };
        const ov = d.tool?.slug ? map[d.tool.slug] : undefined;
        return ov ? { ...d, label: ov } : d;
      }),
      nextQuestions: ei.nextQuestions ?? [
        'How many calories do I burn in a day?',
        'What is my body fat percentage?',
        'Is BMI accurate for athletes?',
      ],
      explanation: ei.explanation ??
        'BMI divides your weight in kilograms by the square of your height in metres. The result is compared against fixed adult bands set by the World Health Organization. Because it uses only height and weight, BMI cannot distinguish muscle from fat or account for frame size, so it works best as a population-level screen rather than an individual verdict.',
      meta: { bmi: Number(value.toFixed(2)) || Number(value.toPrecision(2)), category: cat },
    });
  },
};
