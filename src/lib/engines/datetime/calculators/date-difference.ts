// Date Difference Calculator. The exact duration between two dates as years + months + days, plus
// totals (months / weeks / days), the count of weekdays (business days), and the weekday each date
// falls on. Order-independent: if the end is before the start it measures the same span and says so.

import type { DateTimeTool } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  ageBetween, compareCivil, daysBetween, weekdaysBetween, weekdayOf, type CivilDate,
} from '../models';
import { agePhrase, formatCivil, integer, plural, weekdayName } from '../format';
import { dateField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

function unitPlural(n: number, unit: string, ei: Record<string, any>): string {
  const u = (ei.units ?? {}) as Record<string, [string, string]>;
  if (u[unit]) {
    const [sg, pl] = u[unit];
    return `${integer(n)} ${Math.abs(n) === 1 ? sg : pl}`;
  }
  return plural(n, unit);
}

function localizedPhrase(a: { years: number; months: number; days: number }, ei: Record<string, any>): string {
  if (!ei.units) return agePhrase(a);
  const parts: string[] = [];
  if (a.years) parts.push(unitPlural(a.years, 'year', ei));
  if (a.months) parts.push(unitPlural(a.months, 'month', ei));
  if (a.days || parts.length === 0) parts.push(unitPlural(a.days, 'day', ei));
  return parts.join(ei.listSep ?? ', ');
}

function localizedCivil(c: CivilDate, ei: Record<string, any>): string {
  if (Array.isArray(ei.months) && ei.months.length === 12) {
    return tpl(ei.dateTpl ?? '{d} {m} {y}', { d: String(c.d), m: String(ei.months[c.m - 1]), y: String(c.y) });
  }
  return formatCivil(c);
}

function localizedDayName(idx: number, ei: Record<string, any>): string {
  if (Array.isArray(ei.weekdays) && ei.weekdays.length === 7) {
    return String(ei.weekdays[((idx % 7) + 7) % 7]);
  }
  return weekdayName(idx);
}

export const dateDifferenceCalculator: DateTimeTool = {
  id: 'date-difference',
  family: 'duration',
  capabilities: { loadExample: true },
  fields: [
    { id: 'startDate', label: 'Start date', type: 'date', default: '' },
    { id: 'endDate', label: 'End date', type: 'date', default: '' },
  ],

  calculate(input, _opts) {
    const ei = (readClientI18n().engine ?? {}) as Record<string, any>;
    const start = dateField(input, 'startDate', ei.fieldStartDate ?? 'a start date');
    if (!start.ok) return start.result;
    const end = dateField(input, 'endDate', ei.fieldEndDate ?? 'an end date');
    if (!end.ok) return end.result;

    // Measure the span regardless of order; remember whether the user entered them backwards.
    const reversed = compareCivil(start.value, end.value) > 0;
    const from: CivilDate = reversed ? end.value : start.value;
    const to: CivilDate = reversed ? start.value : end.value;

    const parts = ageBetween(from, to);
    const totalDays = daysBetween(from, to);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = parts.years * 12 + parts.months;
    const businessDays = weekdaysBetween(from, to);
    const weekendDays = totalDays - businessDays;

    const startDow = localizedDayName(weekdayOf(start.value), ei);
    const endDow = localizedDayName(weekdayOf(end.value), ei);
    const durationPhrase = localizedPhrase(parts, ei);

    const hero = card('duration', ei.heroLabel ?? 'Duration', durationPhrase, {
      raw: totalDays,
      emphasis: 'hero',
      note: tpl(ei.totalDaysNoteTpl ?? '{n} in total', { n: unitPlural(totalDays, 'day', ei) }),
    });

    const metrics: ResultCard[] = [
      card('total-days', ei.cardTotalDays ?? 'Total days', integer(totalDays), { raw: totalDays, emphasis: 'primary' }),
      card('total-weeks', ei.cardTotalWeeks ?? 'Total weeks', integer(totalWeeks), { raw: totalWeeks }),
      card('total-months', ei.cardTotalMonths ?? 'Total months', integer(totalMonths), { raw: totalMonths }),
      card('business-days', ei.cardWeekdays ?? 'Weekdays', integer(businessDays), {
        raw: businessDays,
        note: tpl(ei.weekendNoteTpl ?? '{n} weekend days', { n: integer(weekendDays) }),
      }),
    ];

    const insights = [
      insight(tpl(ei.insightDowTpl ?? 'The start date is a {start}; the end date is a {end}.', { start: startDow, end: endDow })),
      totalDays === 0
        ? insight(ei.insightSameDay ?? 'Both dates are the same day.', 'info')
        : insight(tpl(ei.insightWeeksDaysTpl ?? 'That is {weeks} and {days}.', {
            weeks: unitPlural(totalWeeks, 'week', ei),
            days: unitPlural(totalDays - totalWeeks * 7, 'day', ei),
          })),
      reversed
        ? insight(ei.insightReversed ?? 'The end date is before the start date, so this measures the span between them.', 'warning')
        : insight(tpl(ei.insightBusinessTpl ?? 'Excluding weekends, that is {days}.', {
            days: unitPlural(businessDays, 'business day', ei),
          })),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone(ei.msWeek ?? 'At least a full week', totalDays >= 7),
        milestone(ei.msYear ?? 'At least a full year', parts.years >= 1),
      ],
      decisions: decisions([
        toolDecision('Turn one of these dates into an age', 'age-calculator'),
        toolDecision('Convert a date to a Unix timestamp', 'unix-timestamp-converter'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'age-calculator': ei.decAge,
          'unix-timestamp-converter': ei.decUnix,
        };
        const ov = d.tool?.slug ? map[d.tool.slug] : undefined;
        return ov ? { ...d, label: ov } : d;
      }),
      nextQuestions: ei.nextQuestions ?? [
        'How many working days are in this range?',
        'What is my exact age from a birth date?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            from: localizedCivil(from, ei),
            to: localizedCivil(to, ei),
            phrase: durationPhrase,
            totalDays: integer(totalDays),
          })
        : `From ${formatCivil(from)} to ${formatCivil(to)} is exactly ${agePhrase(parts)}, or ${integer(totalDays)} `
          + `days. The years, months, and days account for leap years and each month's real length, and the `
          + `weekday counts step through the range one day at a time.`,
      assumptions: [],
      meta: {
        years: parts.years,
        months: parts.months,
        days: parts.days,
        totalDays,
        totalWeeks,
        totalMonths,
        businessDays,
        weekendDays,
        reversed,
      },
    });
  },
};
