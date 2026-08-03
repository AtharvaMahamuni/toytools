// Calorie deficit calculator: the target intake for a chosen rate of weight loss, and how long
// that rate takes to reach a goal weight. TDEE stops at "here is maintenance"; the question people
// actually arrive with is "what do I eat to lose a kilo a fortnight, and when will I get there".

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { Milestone, ResultCard } from '@lib/results/types';
import {
  bmrMifflinStJeor,
  tdee as computeTdee,
  dailyCalorieDelta,
  KCAL_PER_KG,
  lbToKg,
  kgToLb,
  inToCm,
  type ActivityLevel,
  type Sex,
} from '../models';
import { calories, weight as fmtWeight } from '../format';
import { numberField, optionalNumberField, selectField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';
import { partsSpec } from '@lib/visualization/types';

const UNITS = ['metric', 'imperial'] as const;
const SEXES = ['male', 'female'] as const;
const ACTIVITIES = ['sedentary', 'light', 'moderate', 'active', 'very-active'] as const;
const RATES = ['0.25', '0.5', '0.75', '1'] as const;

const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly active (1 to 3 days a week)',
  moderate: 'Moderately active (3 to 5 days a week)',
  active: 'Very active (6 to 7 days a week)',
  'very-active': 'Extra active (hard training or physical job)',
};

export const calorieDeficitCalculator: WellnessCalculator = {
  id: 'calorie-deficit',
  family: 'energy',
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
      help: 'Used by the BMR equation; enter the sex your body most closely matches metabolically.',
    },
    { id: 'age', label: 'Age', type: 'slider', default: 30, min: 14, max: 120, step: 1, suffix: 'years' },
    { id: 'weight', label: 'Current weight', type: 'number', default: 80, min: 0, step: 0.1, help: 'Kilograms in metric, pounds in imperial.' },
    { id: 'height', label: 'Height', type: 'number', default: 175, min: 0, step: 0.1, help: 'Centimetres in metric, total inches in imperial.' },
    {
      id: 'activity',
      label: 'Activity level',
      type: 'select',
      default: 'moderate',
      options: [
        { value: 'sedentary', label: ACTIVITY_LABEL.sedentary },
        { value: 'light', label: ACTIVITY_LABEL.light },
        { value: 'moderate', label: ACTIVITY_LABEL.moderate },
        { value: 'active', label: ACTIVITY_LABEL.active },
        { value: 'very-active', label: ACTIVITY_LABEL['very-active'] },
      ],
    },
    {
      id: 'rate',
      label: 'Weight to lose per week',
      type: 'select',
      default: '0.5',
      options: [
        { value: '0.25', label: '0.25 kg (0.55 lb) a week, gentle' },
        { value: '0.5', label: '0.5 kg (1.1 lb) a week, standard' },
        { value: '0.75', label: '0.75 kg (1.65 lb) a week, aggressive' },
        { value: '1', label: '1 kg (2.2 lb) a week, very aggressive' },
      ],
    },
    // optional, because SmartInput renders a numeric field defaulting to 0 as BLANK and the widget
    // refuses to compute while a REQUIRED field is blank. Leaving it out costs only the timeline.
    { id: 'goal', label: 'Goal weight', type: 'number', default: 0, min: 0, step: 0.1, optional: true, help: 'Leave blank to skip the timeline.' },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit system', UNITS);
    if (!unit.ok) return unit.result;
    const sex = selectField(input, 'sex', 'a sex for the BMR equation', SEXES);
    if (!sex.ok) return sex.result;
    const activity = selectField(input, 'activity', 'your activity level', ACTIVITIES);
    if (!activity.ok) return activity.result;
    const rate = selectField(input, 'rate', 'a rate of loss', RATES);
    if (!rate.ok) return rate.result;
    const isMetric = unit.value === 'metric';

    const age = numberField(input, 'age', 'your age', { min: 14, max: 120 });
    if (!age.ok) return age.result;
    const w = numberField(input, 'weight', 'your weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!w.ok) return w.result;
    const h = numberField(input, 'height', 'your height', { min: 0, max: isMetric ? 260 : 102 });
    if (!h.ok) return h.result;
    const goal = optionalNumberField(input, 'goal', 'your goal weight', { min: 0, max: isMetric ? 500 : 1100 });
    if (!goal.ok) return goal.result;
    if (w.value <= 0) return validationError('Enter a current weight above zero to plan a deficit.');
    if (h.value <= 0) return validationError('Enter a height above zero to plan a deficit.');

    const weightKg = isMetric ? w.value : lbToKg(w.value);
    const heightCm = isMetric ? h.value : inToCm(h.value);
    const goalKg = goal.value && goal.value > 0 ? (isMetric ? goal.value : lbToKg(goal.value)) : 0;

    const bmr = bmrMifflinStJeor(sex.value as Sex, weightKg, heightCm, age.value);
    const maintain = computeTdee(bmr, activity.value as ActivityLevel);
    const kgPerWeek = Number(rate.value);
    const deficit = dailyCalorieDelta(kgPerWeek);

    // The floor is the honest part of this tool. Asking for a kilo a week when maintenance is
    // 1,900 kcal prescribes an intake below the resting requirement, so say so rather than print it.
    const rawTarget = maintain - deficit;
    const belowBmr = rawTarget < bmr;
    const target = Math.max(bmr, rawTarget);
    const achievableDeficit = maintain - target;
    const achievableKgPerWeek = (achievableDeficit * 7) / KCAL_PER_KG;

    const hero = card('target', 'Eat per day', calories(target), {
      raw: Math.round(target),
      emphasis: 'hero',
      note: belowBmr
        ? `the most this calculator will suggest, which loses about ${achievableKgPerWeek.toFixed(2)} kg a week`
        : `to lose ${kgPerWeek} kg a week`,
    });

    const metrics: ResultCard[] = [
      card('maintenance', 'Maintenance calories', calories(maintain), { raw: Math.round(maintain), emphasis: 'primary' }),
      card('deficit', 'Daily deficit', `${Math.round(achievableDeficit)} kcal`, { raw: Math.round(achievableDeficit) }),
      card('weekly', 'Weekly deficit', `${Math.round(achievableDeficit * 7).toLocaleString('en-US')} kcal`, { raw: Math.round(achievableDeficit * 7) }),
      card('bmr', 'BMR (the floor)', calories(bmr), { raw: Math.round(bmr) }),
    ];

    const milestones: Milestone[] = [];
    if (goalKg > 0 && goalKg < weightKg && achievableKgPerWeek > 0) {
      const toLoseKg = weightKg - goalKg;
      const weeks = toLoseKg / achievableKgPerWeek;
      metrics.push(
        card('to-lose', 'Left to lose', fmtWeight(toLoseKg, unit.value), { raw: Number(toLoseKg.toFixed(1)) }),
        card('weeks', 'Time at this rate', `${Math.ceil(weeks)} weeks`, { raw: Math.ceil(weeks) }),
      );
      milestones.push(
        { id: 'quarter', label: `A quarter of the way, ${fmtWeight(weightKg - toLoseKg * 0.25, unit.value)}`, atYear: Number((weeks * 0.25 / 52).toFixed(2)), reached: false },
        { id: 'half', label: `Halfway, ${fmtWeight(weightKg - toLoseKg * 0.5, unit.value)}`, atYear: Number((weeks * 0.5 / 52).toFixed(2)), reached: false },
        { id: 'goal', label: `Goal weight, ${fmtWeight(goalKg, unit.value)}`, atYear: Number((weeks / 52).toFixed(2)), reached: false },
      );
    }

    const insights = [
      insight(
        `Maintenance is about ${calories(maintain)}. Eating ${calories(target)} leaves a gap of roughly ${Math.round(achievableDeficit)} kcal a day, which is ${Math.round(achievableDeficit * 7).toLocaleString('en-US')} kcal a week.`,
      ),
    ];
    if (belowBmr) {
      insights.push(
        insight(
          `Losing ${kgPerWeek} kg a week would mean eating below your resting requirement of ${calories(bmr)}, so the target has been held at your BMR instead. Add exercise to widen the gap rather than cutting food further.`,
          'caution',
        ),
      );
    }
    insights.push(
      insight(
        'A kilogram of body fat holds roughly 7,700 kcal, which is where the arithmetic comes from. Real loss is lumpier than that: water shifts can hide a fortnight of progress, and metabolism adapts downward as you get lighter.',
        'info',
      ),
      insight(
        `Recalculate every ${isMetric ? '4 to 5 kg' : '10 lb'} you lose. A lighter body burns less, so a deficit that worked at the start becomes maintenance later on.`,
        'caution',
      ),
    );

    return successResult({
      hero,
      metrics,
      milestones,
      visualization: partsSpec(
        [
          { id: 'eat', label: 'Eat', value: Math.round(target), display: calories(target) },
          { id: 'gap', label: 'Deficit', value: Math.round(achievableDeficit), display: `${Math.round(achievableDeficit)} kcal` },
        ],
        {
          kind: 'stacked',
          title: 'Your intake against maintenance',
          description: `The deficit is ${Math.round((achievableDeficit / maintain) * 100)}% of your ${calories(maintain)} maintenance.`,
        },
      ),
      insights,
      assumptions: [
        assumption('Units', isMetric ? 'metric (kg, cm)' : 'imperial (lb, in)'),
        assumption('BMR formula', 'Mifflin-St Jeor'),
        assumption('Energy per kg', '7,700 kcal'),
        assumption('Intake floor', `BMR, ${calories(bmr)}`),
      ],
      decisions: decisions([
        toolDecision('See the full maintenance breakdown', 'tdee-calculator'),
        toolDecision('Split the target into protein, carbs, and fat', 'macro-calculator'),
        toolDecision('Track the weekly weigh-in against the plan', 'body-weight-tracker'),
      ]),
      nextQuestions: [
        'How big should a calorie deficit be?',
        'How long will it take me to lose weight?',
        'Why did my weight loss stall?',
      ],
      explanation:
        'A calorie deficit is the gap between what you burn in a day and what you eat. Your burn is estimated here as a Mifflin-St Jeor BMR scaled by an activity factor, and the gap comes from the rate you pick: about 7,700 kcal is stored in a kilogram of body fat, so losing half a kilogram a week needs roughly 550 kcal a day. The calculator will not suggest eating below your BMR, because a deficit that deep is usually met by muscle loss and poor adherence rather than faster fat loss. Weigh in weekly, average the readings, and adjust the target if the trend does not match the plan after two or three weeks.',
      meta: { target: Math.round(target), deficit: Math.round(achievableDeficit) },
    });
  },
};
