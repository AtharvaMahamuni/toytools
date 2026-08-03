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

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const goal = selectField(input, 'goal', 'what you are training for', GOALS);
    if (!goal.ok) return goal.result;
    const isMetric = unit.value === 'metric';

    const w = numberField(input, 'weight', 'your body weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const meals = numberField(input, 'meals', 'meals a day', { min: 2, max: 6 });
    if (!meals.ok) return meals.result;
    if (w.value <= 0) return validationError('Enter a body weight above zero to work out a protein target.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const g = goal.value as ProteinGoal;
    const [lo, hi] = proteinRangeG(weightKg, g);
    const mid = (lo + hi) / 2;
    const [loPerKg, hiPerKg] = PROTEIN_G_PER_KG[g];

    const hero = card('protein', 'Protein a day', `${grams(lo)} to ${grams(hi)}`, {
      raw: Math.round(mid),
      emphasis: 'hero',
      note: PROTEIN_GOAL_LABEL[g].toLowerCase(),
    });

    const perMeal = mid / meals.value;
    const metrics: ResultCard[] = [
      card('midpoint', 'A single target to aim at', grams(mid), { raw: Math.round(mid), emphasis: 'primary' }),
      card('per-meal', `Per meal across ${meals.value} meals`, grams(perMeal), { raw: Math.round(perMeal) }),
      card('per-kg', 'Grams per kilogram', `${num1(loPerKg)} to ${num1(hiPerKg)} g/kg`, { raw: loPerKg }),
      card('calories', 'Calories from protein', `${Math.round(mid * KCAL_PER_G.protein).toLocaleString('en-US')} kcal`, { raw: Math.round(mid * KCAL_PER_G.protein) }),
    ];

    // Where this goal's range sits against the whole span the guidelines cover, from the sedentary
    // floor to the highest fat-loss recommendation. The point is that "more protein" has an end.
    const bands: VizBand[] = [
      { id: 'general', label: 'General health', from: 0.8, to: 1.2 },
      { id: 'active', label: 'Active', from: 1.2, to: 1.6, tone: 'good' },
      { id: 'training', label: 'Training hard', from: 1.6, to: 2.2, tone: 'good' },
      { id: 'high', label: 'Cutting', from: 2.2, to: 3.0 },
    ];

    const insights = [
      insight(
        `At ${num1(weightKg)} kg and ${PROTEIN_GOAL_LABEL[g].toLowerCase()}, the supported range is ${num1(loPerKg)} to ${num1(hiPerKg)} grams per kilogram, which works out to ${grams(lo)} to ${grams(hi)} a day.`,
      ),
      insight(
        `Spread it out. Roughly ${grams(perMeal)} in each of ${meals.value} meals beats the same total eaten mostly at dinner, because muscle protein synthesis responds per meal rather than per day.`,
        'info',
      ),
      insight(
        'The range is a range for a reason: individual needs vary, and the studies behind these numbers report bands, not points. Anywhere inside yours is fine, and there is little evidence that going far above the top of it adds anything.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(hiPerKg, bands, {
        title: 'Where your target sits in the guideline range, in grams per kilogram',
        valueLabel: `${num1(hiPerKg)} g/kg`,
        description: `Your goal maps to ${num1(loPerKg)} to ${num1(hiPerKg)} g/kg. The guidelines span 0.8 for general health up to about 2.4 when cutting.`,
        highlight: { from: loPerKg, to: hiPerKg, label: 'your range' },
      }),
      insights,
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg)' : 'imperial (lb)'),
        assumption('Source', 'ISSN and ACSM position stands'),
        assumption('Basis', 'total body weight, not lean mass'),
      ],
      decisions: decisions([
        toolDecision('Fit the protein into a full macro split', 'macro-calculator'),
        toolDecision('Find the calorie total it sits inside', 'tdee-calculator'),
        toolDecision('Estimate lean mass, which refines the target', 'body-fat-calculator'),
      ]),
      nextQuestions: [
        'How much protein do I need a day?',
        'Is too much protein bad for you?',
        'Should protein be based on body weight or lean mass?',
      ],
      explanation:
        'Protein needs scale with body weight and with how much you are asking your muscles to do. The floor, 0.8 grams per kilogram, is the recommended dietary allowance, which is the amount that prevents deficiency rather than the amount that supports training. Position stands from the International Society of Sports Nutrition and from the ACSM put active people at 1.2 to 1.6 g/kg, strength training at 1.6 to 2.2, and dieting at up to about 2.4, where extra protein helps hold on to muscle while calories are low. This calculator uses total body weight, which slightly overshoots for people carrying more fat; if you know your body fat percentage, applying the same grams-per-kilogram to lean mass gives a tighter number.',
      meta: { low: Math.round(lo), high: Math.round(hi) },
    });
  },
};
