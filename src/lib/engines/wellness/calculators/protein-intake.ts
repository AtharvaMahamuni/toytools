// Protein intake calculator: grams per day from body weight and training goal, given as the range
// the research actually supports rather than one confident number. The per-meal split is included
// because total daily protein is only half the advice; spreading it across meals is the other half.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  proteinRangeG,
  PROTEIN_G_PER_KG,
  PROTEIN_GOAL_LABEL,
  KCAL_PER_G,
  lbToKg,
  type ProteinGoal,
} from '../models';
import { num1 } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { bandSpec } from '@lib/visualization/types';
import type { VizBand } from '@lib/visualization/types';
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

const UNITS = ['metric', 'imperial'] as const;
const GOALS = ['sedentary', 'active', 'endurance', 'strength', 'fat-loss'] as const;

const grams = (g: number) => `${Math.round(g)} g`;

export const proteinIntakeCalculator: WellnessCalculator = {
  id: 'protein-intake',
  family: 'nutrition',
  capabilities: { loadExample: true, visualization: true },
  consumes: [
    {
      field: 'weight',
      name: 'bodyWeight',
      note: 'from your weight tracker',
    },
  ],
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'segmented',
      default: 'metric',
      options: [
        { value: 'metric', label: 'Metric (kg)' },
        { value: 'imperial', label: 'Imperial (lb)' },
      ],
    },
    { id: 'weight', label: 'Body weight', type: 'number', default: 70, min: 0, step: 0.1, help: 'Kilograms in metric, pounds in imperial.' },
    {
      id: 'goal',
      label: 'What you are training for',
      type: 'select',
      default: 'strength',
      options: [
        { value: 'sedentary', label: 'Mostly sedentary, general health' },
        { value: 'active', label: 'Generally active, no set program' },
        { value: 'endurance', label: 'Endurance training (running, cycling)' },
        { value: 'strength', label: 'Strength training or building muscle' },
        { value: 'fat-loss', label: 'Losing fat while keeping muscle' },
      ],
    },
    { id: 'meals', label: 'Meals a day', type: 'slider', default: 3, min: 2, max: 6, step: 1, suffix: 'meals' },
  ],

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const unit = selectField(input, 'unit', ei.fieldUnit ?? 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const goal = selectField(input, 'goal', ei.fieldGoal ?? 'what you are training for', GOALS);
    if (!goal.ok) return goal.result;
    const isMetric = unit.value === 'metric';

    const w = numberField(input, 'weight', ei.fieldWeight ?? 'your body weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const meals = numberField(input, 'meals', ei.fieldMeals ?? 'meals a day', { min: 2, max: 6 });
    if (!meals.ok) return meals.result;
    if (w.value <= 0) return validationError(ei.errWeightZero ?? 'Enter a body weight above zero to work out a protein target.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const g = goal.value as ProteinGoal;
    const [lo, hi] = proteinRangeG(weightKg, g);
    const mid = (lo + hi) / 2;
    const [loPerKg, hiPerKg] = PROTEIN_G_PER_KG[g];
    const goalText = (ei.goals && ei.goals[g]) || PROTEIN_GOAL_LABEL[g].toLowerCase();

    const hero = card('protein', ei.heroLabel ?? 'Protein a day', ei.rangeTpl ? tpl(ei.rangeTpl, { lo: grams(lo), hi: grams(hi) }) : `${grams(lo)} to ${grams(hi)}`, {
      raw: Math.round(mid),
      emphasis: 'hero',
      note: goalText,
    });

    const perMeal = mid / meals.value;
    const metrics: ResultCard[] = [
      card('midpoint', ei.cardMid ?? 'A single target to aim at', grams(mid), { raw: Math.round(mid), emphasis: 'primary' }),
      card('per-meal', ei.cardMealTpl ? tpl(ei.cardMealTpl, { n: meals.value }) : `Per meal across ${meals.value} meals`, grams(perMeal), { raw: Math.round(perMeal) }),
      card('per-kg', ei.cardPerKg ?? 'Grams per kilogram', ei.perKgTpl ? tpl(ei.perKgTpl, { lo: num1(loPerKg), hi: num1(hiPerKg) }) : `${num1(loPerKg)} to ${num1(hiPerKg)} g/kg`, { raw: loPerKg }),
      card('calories', ei.cardKcal ?? 'Calories from protein', `${Math.round(mid * KCAL_PER_G.protein).toLocaleString('en-US')} kcal`, { raw: Math.round(mid * KCAL_PER_G.protein) }),
    ];

    const bands: VizBand[] = [
      { id: 'general', label: ei.bandGen ?? 'General health', from: 0.8, to: 1.2 },
      { id: 'active', label: ei.bandActive ?? 'Active', from: 1.2, to: 1.6, tone: 'good' },
      { id: 'training', label: ei.bandTrain ?? 'Training hard', from: 1.6, to: 2.2, tone: 'good' },
      { id: 'high', label: ei.bandCut ?? 'Cutting', from: 2.2, to: 3.0 },
    ];

    const insights = [
      insight(
        ei.insRangeTpl
          ? tpl(ei.insRangeTpl, { kg: num1(weightKg), goal: goalText, loKg: num1(loPerKg), hiKg: num1(hiPerKg), lo: grams(lo), hi: grams(hi) })
          : `At ${num1(weightKg)} kg and ${goalText}, the supported range is ${num1(loPerKg)} to ${num1(hiPerKg)} grams per kilogram, which works out to ${grams(lo)} to ${grams(hi)} a day.`,
      ),
      insight(
        ei.insMealTpl
          ? tpl(ei.insMealTpl, { meal: grams(perMeal), n: meals.value })
          : `Spread it out. Roughly ${grams(perMeal)} in each of ${meals.value} meals beats the same total eaten mostly at dinner, because muscle protein synthesis responds per meal rather than per day.`,
        'info',
      ),
      insight(
        ei.insBand ?? 'The range is a range for a reason: individual needs vary, and the studies behind these numbers report bands, not points. Anywhere inside yours is fine, and there is little evidence that going far above the top of it adds anything.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(hiPerKg, bands, {
        title: ei.vizTitle ?? 'Where your target sits in the guideline range, in grams per kilogram',
        valueLabel: `${num1(hiPerKg)} g/kg`,
        description: ei.vizDescTpl
          ? tpl(ei.vizDescTpl, { lo: num1(loPerKg), hi: num1(hiPerKg) })
          : `Your goal maps to ${num1(loPerKg)} to ${num1(hiPerKg)} g/kg. The guidelines span 0.8 for general health up to about 2.4 when cutting.`,
        highlight: { from: loPerKg, to: hiPerKg, label: ei.vizHighlight ?? 'your range' },
      }),
      insights,
      assumptions: [
        assumption(ei.asmUnits ?? 'Units', isMetric ? (ei.asmMetric ?? 'metric (kg)') : (ei.asmImp ?? 'imperial (lb)')),
        assumption(ei.asmSource ?? 'Source', ei.asmSourceVal ?? 'ISSN and ACSM position stands'),
        assumption(ei.asmBasis ?? 'Basis', ei.asmBasisVal ?? 'total body weight, not lean mass'),
      ],
      decisions: decisions([
        toolDecision('Fit the protein into a full macro split', 'macro-calculator'),
        toolDecision('Find the calorie total it sits inside', 'tdee-calculator'),
        toolDecision('Estimate lean mass, which refines the target', 'body-fat-calculator'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'macro-calculator': ei.decMacro,
          'tdee-calculator': ei.decTdee,
          'body-fat-calculator': ei.decBf,
        };
        const label = d.tool?.slug ? map[d.tool.slug] : undefined;
        return label ? { ...d, label } : d;
      }),
      nextQuestions: [
        ei.q1 ?? 'How much protein do I need a day?',
        ei.q2 ?? 'Is too much protein bad for you?',
        ei.q3 ?? 'Should protein be based on body weight or lean mass?',
      ],
      explanation: ei.explanation ?? 'Protein needs scale with body weight and with how much you are asking your muscles to do. The floor, 0.8 grams per kilogram, is the recommended dietary allowance, which is the amount that prevents deficiency rather than the amount that supports training. Position stands from the International Society of Sports Nutrition and from the ACSM put active people at 1.2 to 1.6 g/kg, strength training at 1.6 to 2.2, and dieting at up to about 2.4, where extra protein helps hold on to muscle while calories are low. This calculator uses total body weight, which slightly overshoots for people carrying more fat; if you know your body fat percentage, applying the same grams-per-kilogram to lean mass gives a tighter number.',
      meta: { low: Math.round(lo), high: Math.round(hi) },
    });
  },
};
