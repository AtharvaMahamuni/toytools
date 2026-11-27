// Age Calculator. Exact age (years + months + days) from a birth date to a reference date ("today" by
// default), plus totals (months / weeks / days) and a countdown to the next birthday.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  ageBetween, compareCivil, daysBetween, nextBirthday, weekdayOf, type CivilDate,
} from '../models';
import { agePhrase, formatCivil, integer, plural, weekdayName } from '../format';
import { dateField, optionalDateField } from '../validation';
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

/** Local "today" as a civil date (what the user means by today), used when no reference date is given. */
function todayCivil(): CivilDate {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export const ageCalculator: DateTimeTool = {
  id: 'age',
  family: 'age',
  capabilities: { loadExample: true },
  fields: [
    { id: 'birthDate', label: 'Date of birth', type: 'date', default: '' },
    { id: 'asOf', label: 'Age at date', type: 'date', default: '', optional: true,
      help: 'Leave blank to use today.' },
  ],

  calculate(input, _opts) {
    const ei = (readClientI18n().engine ?? {}) as Record<string, any>;
    const birth = dateField(input, 'birthDate', ei.fieldBirthDate ?? 'a date of birth');
    if (!birth.ok) return birth.result;

    const asOf = optionalDateField(input, 'asOf', ei.fieldAsOf ?? 'the "age at" date');
    if (!asOf.ok) return asOf.result;
    const ref = asOf.value ?? todayCivil();

    if (compareCivil(birth.value, ref) > 0) {
      return validationError(ei.errBirthAfterRef ?? 'The date of birth is after the reference date. Check your dates.');
    }

    const age = ageBetween(birth.value, ref);
    const totalDays = daysBetween(birth.value, ref);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = age.years * 12 + age.months;
    const born = localizedDayName(weekdayOf(birth.value), ei);

    const upcoming = nextBirthday(birth.value, ref);
    const daysToBirthday = daysBetween(ref, upcoming);

    const hero = card('age', ei.heroLabel ?? 'Age', unitPlural(age.years, 'year', ei), {
      raw: age.years,
      emphasis: 'hero',
      note: `${unitPlural(age.months, 'month', ei)}, ${unitPlural(age.days, 'day', ei)}`,
    });

    const metrics: ResultCard[] = [
      card('total-months', ei.cardMonths ?? 'In months', integer(totalMonths), { raw: totalMonths, emphasis: 'primary' }),
      card('total-weeks', ei.cardWeeks ?? 'In weeks', integer(totalWeeks), { raw: totalWeeks }),
      card('total-days', ei.cardDays ?? 'In days', integer(totalDays), { raw: totalDays }),
      card('next-birthday', ei.cardNextBday ?? 'Next birthday',
        daysToBirthday === 0
          ? (ei.today ?? 'Today')
          : tpl(ei.inDaysTpl ?? 'in {days}', { days: unitPlural(daysToBirthday, 'day', ei) }),
        { raw: daysToBirthday }),
    ];

    const insights = [
      insight(tpl(ei.insightBornTpl ?? 'You were born on a {weekday}.', { weekday: born })),
      daysToBirthday === 0
        ? insight(ei.insightHappyBday ?? 'Happy birthday!', 'positive')
        : insight(tpl(ei.insightNextBdayTpl ?? 'Your next birthday is {date}, {days} away.', {
            date: localizedCivil(upcoming, ei),
            days: unitPlural(daysToBirthday, 'day', ei),
          })),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone(ei.ms18 ?? 'At least 18 years old', age.years >= 18),
        milestone(ei.msWithinMonth ?? 'Birthday within a month', daysToBirthday <= 31),
      ],
      decisions: decisions([
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
        toolDecision('Convert this date to a Unix timestamp', 'unix-timestamp-converter'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'date-difference-calculator': ei.decDateDiff,
          'unix-timestamp-converter': ei.decUnix,
        };
        const ov = d.tool?.slug ? map[d.tool.slug] : undefined;
        return ov ? { ...d, label: ov } : d;
      }),
      nextQuestions: ei.nextQuestions ?? [
        'How many days are between two specific dates?',
        'What day of the week was I born on?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            birth: localizedCivil(birth.value, ei),
            ref: localizedCivil(ref, ei),
            totalDays: integer(totalDays),
          })
        : `This age is the exact number of whole calendar years, months, and days from ${formatCivil(birth.value)} `
          + `to ${formatCivil(ref)}, which is ${integer(totalDays)} days in total. `
          + `Months and days account for leap years and each month's real length.`,
      assumptions: [],
      meta: {
        years: age.years,
        months: age.months,
        days: age.days,
        totalDays,
        totalMonths,
        totalWeeks,
        daysToBirthday,
      },
    });
  },
};
