// Tracker engine registry — the per-tracker declarative config plus the single runtime facade the
// shared TrackerWidget speaks to (attached as ToyTools.tracker). A tracker is DATA: unit, input
// mode, chart type, and how a streak qualifies. Adding a tracker is one TrackerDef entry; the widget
// and the pure model/viz below never change.

import {
  todayIso,
  upsert,
  increment,
  valueOn,
  lastNDays,
  total,
  movingAverage,
  currentStreak,
  longestStreak,
  type Entry,
} from './model';
import { barsSvg, lineSvg, progressRingSvg, type VizPoint } from './viz';

export type TrackerInputMode = 'increment' | 'value';
export type TrackerChart = 'bars' | 'line';
export type TrackerStreakMode = 'goal' | 'logged';

export interface TrackerUnitOption {
  value: string;
  label: string;
}

export interface TrackerDef {
  id: string;
  /** Short unit shown next to numbers, e.g. 'glasses' or 'kg'. */
  unit: string;
  /** How today's value is entered: tap-to-add increments, or type a value. */
  inputMode: TrackerInputMode;
  /** Which chart the history renders as. */
  chart: TrackerChart;
  /** What makes a day count toward the streak: meeting a goal, or simply logging. */
  streakMode: TrackerStreakMode;
  /** Numeric step for the value/goal inputs. */
  step: number;
  /** Decimals to display. */
  decimals: number;
  /** How many days the chart spans. */
  windowDays: number;
  /** Increment buttons (increment mode), e.g. [1] or [250]. */
  quickAdds?: number[];
  /** Default daily goal; drives the progress ring and 'goal' streaks. */
  defaultGoal?: number;
  /** Label for the goal input; when omitted, no goal control is shown. */
  goalLabel?: string;
  /** Optional display-unit choices (cosmetic label only; values are stored as entered). */
  units?: TrackerUnitOption[];
}

export const TRACKER_DEFS: Record<string, TrackerDef> = {
  'water-intake': {
    id: 'water-intake',
    unit: 'glasses',
    inputMode: 'increment',
    chart: 'bars',
    streakMode: 'goal',
    step: 1,
    decimals: 0,
    windowDays: 7,
    quickAdds: [1],
    defaultGoal: 8,
    goalLabel: 'Daily goal (glasses)',
  },
  'body-weight': {
    id: 'body-weight',
    unit: 'kg',
    inputMode: 'value',
    chart: 'line',
    streakMode: 'logged',
    step: 0.1,
    decimals: 1,
    windowDays: 14,
    goalLabel: 'Goal weight (optional)',
    units: [
      { value: 'kg', label: 'kg' },
      { value: 'lb', label: 'lb' },
    ],
  },
};

export function getTrackerDef(id: string): TrackerDef | undefined {
  return TRACKER_DEFS[id];
}

/** Build the streak predicate for a def + goal. 'logged' counts any entry; 'goal' needs value ≥ goal. */
function qualifierFor(mode: TrackerStreakMode, goal: number): (value: number) => boolean {
  if (mode === 'logged') return () => true;
  const g = goal > 0 ? goal : 1;
  return (value: number) => value >= g;
}

/**
 * The runtime facade attached as ToyTools.tracker. It bundles the pure model + viz so the inline
 * TrackerWidget script (which cannot import modules) can drive persistence and rendering. Every
 * function here is a thin, never-throw wrapper over the tested pure layer.
 */
export const tracker = {
  todayIso,
  upsert,
  increment,
  valueOn,
  total,
  lastNDays,
  movingAverage,

  currentStreak(entries: Entry[], today: string, goal: number, mode: TrackerStreakMode): number {
    return currentStreak(entries, today, qualifierFor(mode, goal));
  },
  longestStreak(entries: Entry[], goal: number, mode: TrackerStreakMode): number {
    return longestStreak(entries, qualifierFor(mode, goal));
  },

  barsSvg(points: VizPoint[], opts?: { goal?: number }): string {
    return barsSvg(points, opts);
  },
  lineSvg(points: VizPoint[], opts?: { avg?: number[]; goal?: number }): string {
    return lineSvg(points, opts);
  },
  progressRingSvg(value: number, goal: number): string {
    return progressRingSvg(value, goal);
  },

  getDef: getTrackerDef,
};

export type TrackerFacade = typeof tracker;
