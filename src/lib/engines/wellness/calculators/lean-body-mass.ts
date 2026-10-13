// Lean body mass from Boer (1984), James (1976), and Hume (1966).
// Formulas take weight in kilograms and height in centimetres. James squares
// (weight / height) with that height left in centimetres, not metres.
// Boer is the hero because it is the usual clinical default. The three stay
// on screen together so one unlabeled number cannot be copied.
// A result outside (0, weight) is clamped on its card only. The spread stays raw.
// Coefficients are duplicated in caveat.ts so that file does not import this module.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { inToCm, kgToLb, lbToKg, type Sex } from '../models';
import { num1, weight as fmtWeight } from '../format';
import { positiveField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';

const UNITS = ['metric', 'imperial'] as const;
/** The shortest accepted height. Anything lower is almost always metres or feet typed by mistake. */
export const MIN_HEIGHT_CM = 50;
export const MIN_HEIGHT_IN = 20;
const SEXES = ['male', 'female'] as const;

/** Boer 1984. Linear in kilograms and centimetres. */
function boerLbm(sex: Sex, weightKg: number, heightCm: number): number {
  return sex === 'male'
    ? 0.407 * weightKg + 0.267 * heightCm - 19.2
    : 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

/** James 1976. The squared ratio uses height in centimetres, not metres. */
function jamesLbm(sex: Sex, weightKg: number, heightCm: number): number {
  const ratio = weightKg / heightCm;
  const ratioSq = ratio * ratio;
  return sex === 'male' ? 1.10 * weightKg - 128 * ratioSq : 1.07 * weightKg - 148 * ratioSq;
}

/** Hume 1966. Linear in kilograms and centimetres. */
function humeLbm(sex: Sex, weightKg: number, heightCm: number): number {
  return sex === 'male'
    ? 0.32810 * weightKg + 0.33929 * heightCm - 29.5336
    : 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
}

/** Hold a displayed lean mass strictly inside (0, weight). The spread stays on the raw values. */
function clampDisplayed(raw: number, weightKg: number): { shown: number; clamped: boolean } {
  if (raw > 0 && raw < weightKg) return { shown: raw, clamped: false };
  const floor = Math.min(0.05, weightKg * 0.01);
  return { shown: Math.min(weightKg - floor, Math.max(floor, raw)), clamped: true };
}

function listNames(names: string[]): string {
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export const leanBodyMassCalculator: WellnessCalculator = {
  id: 'lean-body-mass',
  family: 'body-composition',
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
    },
    {
      id: 'weight',
      label: 'Weight',
      type: 'number',
      default: 80,
      min: 0,
      step: 0.1,
      help: 'Kilograms in metric, pounds in imperial.',
    },
    {
      id: 'height',
      label: 'Height',
      type: 'number',
      default: 180,
      min: 0,
      step: 0.1,
      help: 'Centimetres in metric, total inches in imperial. Not metres.',
    },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the formulas', SEXES);
    if (!sex.ok) return sex.result;
    const isMetric = unit.value === 'metric';

    const w = positiveField(input, 'weight', 'your weight', { max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = positiveField(input, 'height', 'your height', { max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;

    // Below these no adult stands, and the usual cause is metres or feet typed into the field, which
    // the formulas would turn into nonsense (1.8 cm gave a 252,765 kg spread).
    const minHeight = isMetric ? MIN_HEIGHT_CM : MIN_HEIGHT_IN;
    if (h.value < minHeight) {
      return validationError(
        isMetric
          ? `Your height must be at least ${MIN_HEIGHT_CM} cm. Not metres? Enter centimetres, so 1.8 m is 180.`
          : `Your height must be at least ${MIN_HEIGHT_IN} in. Not feet? Enter total inches, so 5 ft 11 in is 71.`,
      );
    }

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightCm = isMetric ? h.value : inToCm(h.value);

    const s = sex.value as Sex;
    const boer = boerLbm(s, weightKg, heightCm);
    const james = jamesLbm(s, weightKg, heightCm);
    const hume = humeLbm(s, weightKg, heightCm);

    const boerCard = clampDisplayed(boer, weightKg);
    const jamesCard = clampDisplayed(james, weightKg);
    const humeCard = clampDisplayed(hume, weightKg);
    const spreadKg = Math.max(boer, james, hume) - Math.min(boer, james, hume);
    const fat = ((weightKg - boerCard.shown) / weightKg) * 100;
    const fmt = (kg: number) => fmtWeight(kg, unit.value);
    // The spread is a difference, so it converts by the factor alone and reads in the chosen unit.
    const spreadShown = `${num1(isMetric ? spreadKg : kgToLb(spreadKg))} ${isMetric ? 'kg' : 'lb'}`;

    const clamped: string[] = [];
    if (boerCard.clamped) clamped.push('Boer');
    if (jamesCard.clamped) clamped.push('James');
    if (humeCard.clamped) clamped.push('Hume');

    const hero = card('boer', 'Lean body mass', fmt(boerCard.shown), {
      raw: boerCard.shown,
      emphasis: 'hero',
      note: 'Boer formula',
    });

    const metrics: ResultCard[] = [
      card('james', 'James formula', fmt(jamesCard.shown), { raw: jamesCard.shown }),
      card('hume', 'Hume formula', fmt(humeCard.shown), { raw: humeCard.shown }),
      card('spread', 'Formula spread', spreadShown, {
        raw: isMetric ? spreadKg : kgToLb(spreadKg),
        emphasis: 'primary',
        note: clamped.length > 0 ? 'raw gap, before the limit' : 'max minus min',
      }),
      card('implied-fat', 'Implied fat from Boer', `${num1(fat)}%`, { raw: fat }),
    ];

    const insights = [
      insight(
        `Boer is ${fmt(boerCard.shown)}, James is ${fmt(jamesCard.shown)}, and Hume is ${fmt(humeCard.shown)}. The spread is ${spreadShown}.`,
      ),
      insight(
        `Implied fat from Boer is ${num1(fat)} percent of body weight. That line is not a measured body fat.`,
      ),
      insight(
        'These formulas estimate lean mass from height, weight and sex. They are not a measurement, and they are not a drug dose.',
        'caution',
      ),
    ];
    if (clamped.length > 0) {
      insights.push(
        insight(
          `${listNames(clamped)} landed outside body weight, so the card holds that figure inside the range. The spread of ${spreadShown} is the raw gap before the limit.`,
          'caution',
        ),
      );
    }

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('Sex', s === 'male' ? 'male' : 'female'),
        assumption('Formulas', 'Boer 1984, James 1976, Hume 1966'),
        assumption('Hero', 'Boer, the clinical default'),
      ],
      decisions: decisions([
        toolDecision('Estimate body fat, which these formulas do not measure', 'body-fat-calculator'),
        toolDecision('See ideal weight from height and sex', 'ideal-weight-calculator'),
        toolDecision('Check BMI for the same height and weight', 'bmi-calculator'),
      ]),
      nextQuestions: [
        'What is lean body mass?',
        'Why do the three formulas disagree?',
        'Is this a drug dose?',
      ],
      explanation:
        'Lean body mass is body weight minus fat mass. Boer (1984), James (1976), and Hume (1966) each estimate it from height, weight, and sex. Boer is the hero number because it is the usual clinical default. James squares weight divided by height, and that height stays in centimetres rather than metres. Hume is a second linear fit. The three stay on screen together so one unlabeled number cannot be copied as the only answer. Implied fat percent is weight minus the Boer figure, divided by weight. It is not a measured body fat, and none of these figures is a drug dose.',
      meta: { boer: boerCard.shown, james: jamesCard.shown, hume: humeCard.shown, spread: spreadKg, fat },
    });
  },
};
