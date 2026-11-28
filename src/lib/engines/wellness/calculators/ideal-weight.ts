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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

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

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const unit = selectField(input, 'unit', ei.fieldUnit ?? 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', ei.fieldSex ?? 'a sex for the formulas', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';

    const h = numberField(input, 'height', ei.fieldHeight ?? 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    if (h.value <= 0) return validationError(ei.errHeightZero ?? 'Enter a height above zero to estimate an ideal weight.');

    const heightCm = isMetric ? h.value : inToCm(h.value);
    const s = sex.value as Sex;

    const devine = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.devine);
    const robinson = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.robinson);
    const miller = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.miller);
    const hamwi = idealWeight(s, heightCm, IDEAL_WEIGHT_FORMULAS.hamwi);
    const avg = (devine + robinson + miller + hamwi) / 4;

    const [loKg, hiKg] = healthyWeightRangeKg(cmToM(heightCm));

    const hero = card('ideal', ei.heroLabel ?? 'Ideal weight', fmtWeight(avg, unit.value), {
      raw: Number(avg.toFixed(1)),
      emphasis: 'hero',
      note: ei.heroNote ?? 'average of four formulas',
    });

    const metrics: ResultCard[] = [
      card('healthy-range', ei.cardHealthy ?? 'Healthy weight range (BMI)', weightRange(loKg, hiKg, unit.value), { raw: Number(loKg.toFixed(1)), emphasis: 'primary' }),
      card('devine', ei.cardDevine ?? 'Devine formula', fmtWeight(devine, unit.value), { raw: Number(devine.toFixed(1)) }),
      card('robinson', ei.cardRobinson ?? 'Robinson formula', fmtWeight(robinson, unit.value), { raw: Number(robinson.toFixed(1)) }),
      card('miller', ei.cardMiller ?? 'Miller formula', fmtWeight(miller, unit.value), { raw: Number(miller.toFixed(1)) }),
      card('hamwi', ei.cardHamwi ?? 'Hamwi formula', fmtWeight(hamwi, unit.value), { raw: Number(hamwi.toFixed(1)) }),
    ];

    const toDisplay = (kg: number) => (isMetric ? kg : kgToLb(kg));
    const formulaLo = Math.min(devine, robinson, miller, hamwi);
    const formulaHi = Math.max(devine, robinson, miller, hamwi);
    const scaleLo = Math.min(loKg, formulaLo) - 6;
    const scaleHi = Math.max(hiKg, formulaHi) + 6;
    const suffix = isMetric ? 'kg' : 'lb';
    const bands: VizBand[] = [
      { id: 'below', label: ei.bandBelow ?? 'Below', from: toDisplay(scaleLo), to: toDisplay(loKg) },
      { id: 'healthy', label: ei.bandHealthy ?? 'Healthy range', from: toDisplay(loKg), to: toDisplay(hiKg), tone: 'good' },
      { id: 'above', label: ei.bandAbove ?? 'Above', from: toDisplay(hiKg), to: toDisplay(scaleHi) },
    ];

    const insights = [
      insight(
        ei.insSpreadTpl
          ? tpl(ei.insSpreadTpl, { lo: fmtWeight(formulaLo, unit.value), hi: fmtWeight(formulaHi, unit.value), avg: fmtWeight(avg, unit.value) })
          : `The four classic formulas land between ${fmtWeight(formulaLo, unit.value)} and ${fmtWeight(formulaHi, unit.value)}, averaging about ${fmtWeight(avg, unit.value)}.`,
      ),
      insight(
        ei.insBandTpl
          ? tpl(ei.insBandTpl, { range: weightRange(loKg, hiKg, unit.value) })
          : `The modern BMI healthy range for your height is wider, ${weightRange(loKg, hiKg, unit.value)}, because it allows for different builds. A healthy weight is a band, not a single point.`,
        'info',
      ),
      insight(
        ei.insAnchor ?? 'These formulas use only height and sex, so they ignore frame size, muscle, and age. Treat the number as a rough anchor, not a goal you must hit exactly.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(toDisplay(avg), bands, {
        title: ei.vizTitleTpl ? tpl(ei.vizTitleTpl, { unit: suffix }) : `Your ideal weight against the healthy range for your height, in ${suffix}`,
        valueLabel: fmtWeight(avg, unit.value),
        description: ei.vizDescTpl
          ? tpl(ei.vizDescTpl, { fRange: weightRange(formulaLo, formulaHi, unit.value), bRange: weightRange(loKg, hiKg, unit.value) })
          : `The four formulas span ${weightRange(formulaLo, formulaHi, unit.value)}. The BMI healthy range is wider at ${weightRange(loKg, hiKg, unit.value)}.`,
        highlight: {
          from: toDisplay(formulaLo),
          to: toDisplay(formulaHi),
          label: ei.vizHighlight ?? 'the four formulas',
        },
      }),
      insights,
      assumptions: [
        assumption(ei.asmUnits ?? 'Units', isMetric ? (ei.asmMetric ?? 'metric (cm)') : (ei.asmImp ?? 'imperial (in)')),
        assumption(ei.asmFormulas ?? 'Formulas', 'Devine, Robinson, Miller, Hamwi'),
        assumption(ei.asmHealthy ?? 'Healthy range', ei.asmHealthyVal ?? 'BMI 18.5 to 24.9'),
      ],
      decisions: decisions([
        toolDecision('Check your current BMI', 'bmi-calculator'),
        toolDecision('Estimate body fat, which weight cannot show', 'body-fat-calculator'),
        toolDecision('Track your weight toward the range', 'body-weight-tracker'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'bmi-calculator': ei.decBmi,
          'body-fat-calculator': ei.decBf,
          'body-weight-tracker': ei.decTrack,
        };
        const label = d.tool?.slug ? map[d.tool.slug] : undefined;
        return label ? { ...d, label } : d;
      }),
      nextQuestions: [
        ei.q1 ?? 'What should I weigh for my height?',
        ei.q2 ?? 'Is ideal weight the same as a healthy weight?',
        ei.q3 ?? 'Why do the formulas disagree?',
      ],
      explanation: ei.explanation ?? 'Ideal body weight formulas were built decades ago, mostly to help dose medication, and they estimate a single target weight from height and sex alone. Devine, Robinson, Miller, and Hamwi each use a base weight at five feet plus a fixed amount per inch above it, which is why they give slightly different answers. Because none accounts for frame size or muscle, the modern approach is the BMI healthy-weight range, shown here alongside them. Read the formulas as a central anchor and the BMI range as the realistic band around it.',
      meta: { ideal: Number(avg.toFixed(1)), devine: Number(devine.toFixed(1)) },
    });
  },
};
