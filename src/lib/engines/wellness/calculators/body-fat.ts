// Body Fat % calculator: the U.S. Navy circumference (tape-measure) method, which estimates body
// fat from neck, waist, and (for women) hip measurements plus height. No calipers, no scale needed.
// When a bodyweight is supplied it also splits that weight into fat mass and lean mass, which is the
// number people actually track when cutting or bulking.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  bodyFatNavy,
  bodyFatCategory,
  BODY_FAT_CATEGORY_LABEL,
  BODY_FAT_THRESHOLDS,
  lbToKg,
  inToCm,
  type Sex,
} from '../models';
import { num1, weight as fmtWeight } from '../format';
import { optionalNumberField, positiveField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { bandSpec } from '@lib/visualization/types';
import type { VizBand } from '@lib/visualization/types';
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;

export const bodyFatCalculator: WellnessCalculator = {
  id: 'body-fat',
  family: 'body-composition',
  capabilities: { loadExample: true, visualization: true },
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'segmented',
      default: 'metric',
      options: [
        { value: 'metric', label: 'Metric (cm, kg)' },
        { value: 'imperial', label: 'Imperial (in, lb)' },
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
    { id: 'height', label: 'Height', type: 'number', default: 175, min: 0, step: 0.1, help: 'Centimetres in metric, inches in imperial.' },
    { id: 'neck', label: 'Neck circumference', type: 'number', default: 38, min: 0, step: 0.1, help: 'Measured just below the larynx.' },
    { id: 'waist', label: 'Waist circumference', type: 'number', default: 85, min: 0, step: 0.1, help: 'Men measure at the navel; women at the narrowest point.' },
    { id: 'hip', label: 'Hip circumference', type: 'number', default: 95, min: 0, step: 0.1, optional: true, help: 'Women only, measured at the widest point. Ignored for men.' },
    { id: 'weight', label: 'Bodyweight (optional)', type: 'number', default: 0, min: 0, step: 0.1, optional: true, help: 'Add it to split your weight into fat and lean mass.' },
  ],

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const unit = selectField(input, 'unit', ei.fieldUnit ?? 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', ei.fieldSex ?? 'a sex for the formula', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';
    const toCm = (v: number) => (isMetric ? v : inToCm(v));

    const height = positiveField(input, 'height', ei.fieldHeight ?? 'your height', { max: isMetric ? 260 : 102 });
    if (!height.ok) return height.result;
    const neck = positiveField(input, 'neck', ei.fieldNeck ?? 'your neck measurement', { max: isMetric ? 80 : 32 });
    if (!neck.ok) return neck.result;
    const waist = positiveField(input, 'waist', ei.fieldWaist ?? 'your waist measurement', { max: isMetric ? 200 : 79 });
    if (!waist.ok) return waist.result;

    const heightCm = toCm(height.value);
    const neckCm = toCm(neck.value);
    const waistCm = toCm(waist.value);

    let hipCm = 0;
    // Ignored for men, but a negative entry is still a typo worth naming.
    const hipAny = optionalNumberField(input, 'hip', ei.fieldHip ?? 'your hip measurement', { min: 0 });
    if (!hipAny.ok) return hipAny.result;
    if (sex.value === 'female') {
      const hip = positiveField(input, 'hip', ei.fieldHip ?? 'your hip measurement', { max: isMetric ? 200 : 79 });
      if (!hip.ok) return hip.result;
      hipCm = toCm(hip.value);
    }

    // Guard the log argument before it becomes NaN so the message is actionable.
    if (sex.value === 'male' && waistCm <= neckCm) {
      return validationError(ei.errWaistNeck ?? 'Your waist measurement should be larger than your neck. Re-check the two values.');
    }
    if (sex.value === 'female' && waistCm + hipCm <= neckCm) {
      return validationError(ei.errWaistHipNeck ?? 'Your waist plus hip should be larger than your neck. Re-check the measurements.');
    }

    const bf = bodyFatNavy(sex.value as Sex, heightCm, neckCm, waistCm, hipCm);
    if (!Number.isFinite(bf) || bf <= 0) {
      return validationError(ei.errInvalidEst ?? 'Those measurements do not produce a valid estimate. Double-check them and try again.');
    }
    const cat = bodyFatCategory(sex.value as Sex, bf);
    const label = (ei.cats && ei.cats[cat]) || BODY_FAT_CATEGORY_LABEL[cat];

    const hero = card('body-fat', ei.heroLabel ?? 'Body fat', `${num1(bf)}%`, {
      raw: Number(bf.toFixed(1)),
      emphasis: 'hero',
      note: label,
    });

    const metrics: ResultCard[] = [
      card('category', ei.cardCat ?? 'Category', label, { emphasis: 'primary' }),
    ];

    // The ACE scale as a drawable band. "Fitness" carries the accent: it is the general-population
    // target, whereas the athlete band is a training outcome rather than a goal to aim at.
    const t = BODY_FAT_THRESHOLDS[sex.value as Sex];
    const bands: VizBand[] = [
      { id: 'essential', label: (ei.cats?.essential) || 'Essential', from: t.floor, to: t.athletes },
      { id: 'athletes', label: (ei.cats?.athletes) || 'Athletes', from: t.athletes, to: t.fitness },
      { id: 'fitness', label: (ei.cats?.fitness) || 'Fitness', from: t.fitness, to: t.average, tone: 'good' },
      { id: 'average', label: (ei.cats?.average) || 'Average', from: t.average, to: t.obese },
      { id: 'obese', label: (ei.cats?.obese) || 'Above average', from: t.obese, to: t.ceiling },
    ];

    // Optional fat/lean split when a bodyweight is given.
    const w = optionalNumberField(input, 'weight', ei.fieldWeight ?? 'your bodyweight', { min: 0 });
    if (!w.ok) return w.result;
    if (w.value > 0) {
      const weightKg = isMetric ? w.value : lbToKg(w.value);
      const fatKg = weightKg * (bf / 100);
      const leanKg = weightKg - fatKg;
      metrics.push(card('fat-mass', ei.cardFat ?? 'Fat mass', fmtWeight(fatKg, unit.value), { raw: Number(fatKg.toFixed(1)) }));
      metrics.push(card('lean-mass', ei.cardLean ?? 'Lean mass', fmtWeight(leanKg, unit.value), { raw: Number(leanKg.toFixed(1)) }));
    }

    const sexWord = sex.value === 'male' ? (ei.men ?? 'men') : (ei.women ?? 'women');
    const insights = [
      insight(
        ei.insCatTpl
          ? tpl(ei.insCatTpl, { bf: num1(bf), cat: label, sex: sexWord })
          : `An estimated ${num1(bf)}% body fat puts you in the "${label}" range for ${sexWord} on the ACE scale.`,
        cat === 'fitness' || cat === 'athletes' ? 'positive' : 'info',
      ),
      insight(
        ei.insTape ?? 'The tape method is quick and free but has a margin of a few percentage points. Measure at the same time of day, pulled snug but not compressing the skin, and watch the trend rather than a single reading.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(bf, bands, {
        title: ei.vizTitleTpl ? tpl(ei.vizTitleTpl, { bf: num1(bf) }) : `Your body fat of ${num1(bf)}% on the ACE scale`,
        valueLabel: `${num1(bf)}%`,
        description: ei.vizDescTpl ? tpl(ei.vizDescTpl, { sex: sexWord }) : `ACE ranges for ${sexWord}. The tape method carries a few points of error, so watch the trend.`,
      }),
      insights,
      assumptions: [
        assumption(ei.asmMethod ?? 'Method', ei.asmMethodVal ?? 'U.S. Navy circumference'),
        assumption(ei.asmUnits ?? 'Units', isMetric ? (ei.asmMetric ?? 'metric (cm, kg)') : (ei.asmImp ?? 'imperial (in, lb)')),
        assumption(ei.asmCats ?? 'Categories', ei.asmCatsVal ?? 'American Council on Exercise'),
      ],
      decisions: decisions([
        toolDecision('Compare against your BMI', 'bmi-calculator'),
        toolDecision('Estimate your daily calorie needs', 'tdee-calculator'),
        toolDecision('Track your weight over time', 'body-weight-tracker'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'bmi-calculator': ei.decBmi,
          'tdee-calculator': ei.decTdee,
          'body-weight-tracker': ei.decTrack,
        };
        const label = d.tool?.slug ? map[d.tool.slug] : undefined;
        return label ? { ...d, label } : d;
      }),
      nextQuestions: [
        ei.q1 ?? 'What is a healthy body fat percentage?',
        ei.q2 ?? 'How accurate is the Navy body fat method?',
        ei.q3 ?? 'How is body fat different from BMI?',
      ],
      explanation: ei.explanation ?? 'The U.S. Navy method estimates body fat from the circumference of your neck and waist (plus hips for women) against your height, using a formula fitted to underwater-weighing data. It works because fat and muscle distribute differently around those points. It needs only a tape measure, which makes it far more practical than calipers or a scan, at the cost of a few points of accuracy. Because everyone measures slightly differently, the trend over weeks is more trustworthy than any single number.',
      meta: { bodyFat: Number(bf.toFixed(1)), category: cat },
    });
  },
};
