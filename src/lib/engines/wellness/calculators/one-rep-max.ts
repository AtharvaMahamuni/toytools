// One rep max calculator: the load you could lift once, estimated from a set you actually did.
// Four formulas rather than one, because they disagree by a few percent and quoting a single
// number hides that. The percentage table is what a training program is written against, so it is
// part of the answer rather than a separate lookup.

import type { WellnessCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  oneRepMax,
  ONE_REP_MAX_FORMULA_LABEL,
  ONE_REP_MAX_TABLE,
  type OneRepMaxFormula,
} from '../models';
import { num1 } from '../format';
import { numberField, selectField } from '../validation';
import { assumption, decisions, insight } from '../story';
import { bandSpec } from '@lib/visualization/types';
import type { VizBand } from '@lib/visualization/types';

const UNITS = ['kg', 'lb'] as const;
const FORMULAS: readonly OneRepMaxFormula[] = ['epley', 'brzycki', 'lombardi', 'oconner'];

export const oneRepMaxCalculator: WellnessCalculator = {
  id: 'one-rep-max',
  family: 'fitness-performance',
  capabilities: { loadExample: true, visualization: true },
  fields: [
    {
      id: 'unit',
      label: 'Units',
      type: 'segmented',
      default: 'kg',
      options: [
        { value: 'kg', label: 'Kilograms' },
        { value: 'lb', label: 'Pounds' },
      ],
    },
    { id: 'weight', label: 'Weight lifted', type: 'number', default: 100, min: 0, step: 0.5, help: 'The load on the bar for the set you completed.' },
    { id: 'reps', label: 'Reps completed', type: 'slider', default: 5, min: 1, max: 15, step: 1, suffix: 'reps', help: 'Only count reps taken close to failure; a comfortable set understates your max.' },
  ],

  calculate(input, _opts) {
    const unit = selectField(input, 'unit', 'your unit', UNITS);
    if (!unit.ok) return unit.result;

    const w = numberField(input, 'weight', 'the weight lifted', { min: 0, max: unit.value === 'kg' ? 600 : 1400 });
    if (!w.ok) return w.result;
    const reps = numberField(input, 'reps', 'the reps completed', { min: 1, max: 15 });
    if (!reps.ok) return reps.result;
    if (w.value <= 0) return validationError('Enter a weight above zero to estimate a one rep max.');

    const u = unit.value;
    const fmt = (v: number) => `${num1(v)} ${u}`;

    const estimates = FORMULAS.map((f) => ({ id: f, value: oneRepMax(w.value, reps.value, f) })).filter(
      (e) => Number.isFinite(e.value),
    );
    if (estimates.length === 0) {
      return validationError('That rep count is outside the range these formulas can estimate. Try a set of 15 reps or fewer.');
    }
    const avg = estimates.reduce((sum, e) => sum + e.value, 0) / estimates.length;
    const lo = Math.min(...estimates.map((e) => e.value));
    const hi = Math.max(...estimates.map((e) => e.value));

    const hero = card('one-rep-max', 'Estimated one rep max', fmt(avg), {
      raw: Number(avg.toFixed(1)),
      emphasis: 'hero',
      note: reps.value === 1 ? 'you lifted it once, so this is the lift itself' : `from ${num1(w.value)} ${u} for ${reps.value} reps`,
    });

    const metrics: ResultCard[] = [
      card('spread', 'Formula spread', `${num1(lo)} to ${num1(hi)} ${u}`, { raw: Number(lo.toFixed(1)), emphasis: 'primary' }),
      ...estimates.map((e) =>
        card(e.id, `${ONE_REP_MAX_FORMULA_LABEL[e.id]} formula`, fmt(e.value), { raw: Number(e.value.toFixed(1)) }),
      ),
      // The percentages a program is actually written in. Rendering them as cards keeps the whole
      // answer in one place instead of sending the lifter to a separate chart.
      ...ONE_REP_MAX_TABLE.filter((row) => row.pct < 100).map((row) =>
        card(`pct-${row.pct}`, `${row.pct}% (about ${row.reps} reps)`, fmt((avg * row.pct) / 100), {
          raw: Number(((avg * row.pct) / 100).toFixed(1)),
        }),
      ),
    ];

    const bands: VizBand[] = [
      { id: 'endurance', label: 'Endurance (65 to 75%)', from: (avg * 0.6) / 1, to: avg * 0.75 },
      { id: 'hypertrophy', label: 'Hypertrophy (75 to 85%)', from: avg * 0.75, to: avg * 0.85, tone: 'good' },
      { id: 'strength', label: 'Strength (85 to 100%)', from: avg * 0.85, to: avg },
    ];

    const insights = [
      insight(
        reps.value === 1
          ? 'A single rep needs no estimating: the weight you lifted is your one rep max. The formulas below agree because they all pass through that point.'
          : `Lifting ${num1(w.value)} ${u} for ${reps.value} reps puts your single-rep ceiling around ${fmt(avg)}. The four formulas land between ${num1(lo)} and ${num1(hi)} ${u}.`,
      ),
      insight(
        reps.value <= 5
          ? 'Sets of five or fewer give the most reliable estimate, which is why this one is worth trusting.'
          : `At ${reps.value} reps the formulas start to disagree, because endurance rather than pure strength decides how long a set lasts. Test with three to five reps for a tighter number.`,
        reps.value <= 5 ? 'positive' : 'caution',
      ),
      insight(
        'This is an estimate, not a permission slip. Work up to a real maximum attempt slowly, with a spotter or safety bars, and only when your technique holds under load.',
        'caution',
      ),
    ];

    return successResult({
      hero,
      metrics,
      visualization: bandSpec(avg * 0.8, bands, {
        title: `Training loads against your ${fmt(avg)} max`,
        valueLabel: `${fmt(avg * 0.8)} at 80%`,
        description: `Most hypertrophy work sits between ${num1(avg * 0.75)} and ${num1(avg * 0.85)} ${u}; strength work runs above that.`,
        highlight: { from: avg * 0.75, to: avg * 0.85, label: 'the usual working range' },
      }),
      insights,
      assumptions: [
        assumption('Unit', u === 'kg' ? 'kilograms' : 'pounds'),
        assumption('Formulas', 'Epley, Brzycki, Lombardi, O\'Conner'),
        assumption('Set quality', 'taken close to failure'),
      ],
      nextQuestions: [
        'How do I calculate my one rep max?',
        'Which one rep max formula is most accurate?',
        'What percentage of my max should I train at?',
      ],
      explanation:
        'A one rep max is the heaviest load you could lift once with good form, and it is the number training programs are written against: five sets of five at 80%, a top single at 95%, and so on. Testing it directly is tiring and carries real risk, so it is normally estimated from a submaximal set. Epley multiplies the weight by 1 plus reps over 30; Brzycki divides by a falling linear term; Lombardi and O\'Conner fit different curves to the same relationship. All four are close at low reps and drift apart above about ten, because a long set is limited by muscular endurance rather than by peak force. Estimate from three to five hard reps, re-test every few weeks, and treat the result as a training anchor rather than a record.',
      meta: { oneRepMax: Number(avg.toFixed(1)) },
    });
  },
};
