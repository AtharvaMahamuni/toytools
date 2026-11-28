import { afterEach, describe, expect, it, vi } from 'vitest';
import * as clientMod from './client';
import { runFinance } from '@lib/engines/finance/registry';
import { runWellness } from '@lib/engines/wellness/registry';
import { runDateTime } from '@lib/engines/datetime/registry';
import {
  detectEncoding,
  encodingMeta,
  recoverEncoding,
  validateEncoding,
} from '@lib/engines/encoding/registry';
import { runStructuredData } from '@lib/engines/structured-data/registry';
import { textHandoff } from '@lib/text/handoff';

import { pack as ciEs } from '../../tools/finance/compound-interest-calculator/i18n/es';
import { pack as loanEs } from '../../tools/finance/loan-calculator/i18n/es';
import { pack as sipEs } from '../../tools/finance/sip-calculator/i18n/es';
import { pack as roiEs } from '../../tools/finance/roi-calculator/i18n/es';
import { pack as infEs } from '../../tools/finance/inflation-calculator/i18n/es';
import { pack as savEs } from '../../tools/finance/savings-goal-calculator/i18n/es';
import { pack as cagrEs } from '../../tools/finance/cagr-calculator/i18n/es';
import { pack as billEs } from '../../tools/finance/split-bill/i18n/es';

import { pack as cdEs } from '../../tools/health/calorie-deficit-calculator/i18n/es';
import { pack as macroEs } from '../../tools/health/macro-calculator/i18n/es';
import { pack as bfEs } from '../../tools/health/body-fat-calculator/i18n/es';
import { pack as iwEs } from '../../tools/health/ideal-weight-calculator/i18n/es';
import { pack as piEs } from '../../tools/health/protein-intake-calculator/i18n/es';

import { pack as sleepEs } from '../../tools/datetime/sleep-cycle-calculator/i18n/es';
import { pack as tzEs } from '../../tools/datetime/timezone-converter/i18n/es';

import { pack as romanEs } from '../../tools/number/roman-numeral-converter/i18n/es';
import { pack as binEs } from '../../tools/number/binary-converter/i18n/es';
import { pack as c2jEs } from '../../tools/developer-utilities/csv-to-json-converter/i18n/es';
import { pack as jtcEs } from '../../tools/developer-utilities/json-to-csv-converter/i18n/es';

import { pack as revEs } from '../../tools/text/reverse-text/i18n/es';
import { pack as resEs } from '../../tools/text/remove-extra-spaces/i18n/es';
import { pack as rdlEs } from '../../tools/text/remove-duplicate-lines/i18n/es';

let activeUi: Record<string, any> = {};

function usePack(pack: { ui?: Record<string, any> }) {
  activeUi = pack.ui ?? {};
  vi.spyOn(clientMod, 'readClientI18n').mockImplementation(() => activeUi);
  vi.spyOn(clientMod, 'clientStr').mockImplementation((key: string, fallback: string) => {
    const v = activeUi[key];
    return typeof v === 'string' && v.length > 0 ? v : fallback;
  });
}

function assertNoTemplateLeaks(value: unknown) {
  const s = JSON.stringify(value);
  expect(s).not.toMatch(/\{[a-zA-Z0-9_]+\}/);
}

afterEach(() => {
  vi.restoreAllMocks();
  activeUi = {};
});

describe('localized Phase 3 client engine coverage and template parity', () => {
  it('runs all 8 Finance calculators with Spanish pack UI without placeholder leaks', () => {
    const opts = { currency: 'USD' as const, locale: 'es' };

    usePack(ciEs);
    assertNoTemplateLeaks(runFinance('compound-interest', { principal: 10000, monthly: 200, rate: 7, years: 10, frequency: 12 }, opts));
    assertNoTemplateLeaks(runFinance('compound-interest', { principal: 10000, monthly: 0, rate: 0, years: 5, frequency: 1 }, opts));
    assertNoTemplateLeaks(runFinance('compound-interest', { principal: '', monthly: 0, rate: 5, years: 5, frequency: 12 }, opts));
    assertNoTemplateLeaks(runFinance('compound-interest', { principal: -10, monthly: 0, rate: 5, years: 5, frequency: 12 }, opts));

    usePack(loanEs);
    assertNoTemplateLeaks(runFinance('loan', { amount: 25000, rate: 6.5, years: 5 }, opts));
    assertNoTemplateLeaks(runFinance('loan', { amount: 10000, rate: 0, years: 3 }, opts));
    assertNoTemplateLeaks(runFinance('loan', { amount: 0, rate: 5, years: 5 }, opts));

    usePack(sipEs);
    assertNoTemplateLeaks(runFinance('sip', { monthly: 500, rate: 12, years: 10 }, opts));
    assertNoTemplateLeaks(runFinance('sip', { monthly: 0, rate: 12, years: 10 }, opts));

    usePack(roiEs);
    assertNoTemplateLeaks(runFinance('roi', { invested: 5000, returned: 7500, years: 3 }, opts));
    assertNoTemplateLeaks(runFinance('roi', { invested: 5000, returned: 4000, years: 0 }, opts));
    assertNoTemplateLeaks(runFinance('roi', { invested: 0, returned: 5000, years: 1 }, opts));

    usePack(infEs);
    assertNoTemplateLeaks(runFinance('inflation', { amount: 1000, rate: 3, years: 10 }, opts));

    usePack(savEs);
    assertNoTemplateLeaks(runFinance('savings-goal', { goal: 20000, current: 2000, rate: 4, years: 5 }, opts));
    assertNoTemplateLeaks(runFinance('savings-goal', { goal: 1000, current: 5000, rate: 4, years: 5 }, opts));

    usePack(cagrEs);
    assertNoTemplateLeaks(runFinance('cagr', { begin: 1000, end: 2500, years: 5 }, opts));
    assertNoTemplateLeaks(runFinance('cagr', { begin: 2500, end: 1500, years: 5 }, opts));
    assertNoTemplateLeaks(runFinance('cagr', { begin: 0, end: 100, years: 5 }, opts));

    usePack(billEs);
    assertNoTemplateLeaks(runFinance('split-bill', { bill: 120, tip: 15, people: 4 }, opts));
    assertNoTemplateLeaks(runFinance('split-bill', { bill: 0, tip: 10, people: 2 }, opts));
  });

  it('runs all 5 Wellness Phase 3 calculators with localized UI', () => {
    usePack(cdEs);
    assertNoTemplateLeaks(runWellness('calorie-deficit', { unit: 'metric', sex: 'male', age: 30, weight: 80, height: 175, activity: 'moderate', rate: '0.5', goal: 72 }, {}));
    assertNoTemplateLeaks(runWellness('calorie-deficit', { unit: 'imperial', sex: 'female', age: 30, weight: 150, height: 65, activity: 'light', rate: '1', goal: 135 }, {}));
    assertNoTemplateLeaks(runWellness('calorie-deficit', { unit: 'metric', sex: 'male', age: 30, weight: 0, height: 175, activity: 'moderate', rate: '0.5' }, {}));
    assertNoTemplateLeaks(runWellness('calorie-deficit', { unit: 'metric', sex: 'male', age: 30, weight: 80, height: 0, activity: 'moderate', rate: '0.5' }, {}));
    assertNoTemplateLeaks(runWellness('calorie-deficit', { unit: 'metric', sex: 'male', age: 5, weight: 80, height: 175, activity: 'moderate', rate: '0.5' }, {}));

    usePack(macroEs);
    assertNoTemplateLeaks(runWellness('macro', { calories: 2200, diet: 'high-protein' }, {}));
    assertNoTemplateLeaks(runWellness('macro', { calories: 0, diet: 'balanced' }, {}));

    usePack(bfEs);
    assertNoTemplateLeaks(runWellness('body-fat', { unit: 'metric', sex: 'female', height: 165, neck: 33, waist: 72, hip: 96, weight: 62 }, {}));
    assertNoTemplateLeaks(runWellness('body-fat', { unit: 'imperial', sex: 'male', height: 70, neck: 15, waist: 34, weight: 180 }, {}));
    assertNoTemplateLeaks(runWellness('body-fat', { unit: 'metric', sex: 'male', height: 175, neck: 42, waist: 38 }, {}));

    usePack(iwEs);
    assertNoTemplateLeaks(runWellness('ideal-weight', { unit: 'metric', sex: 'male', height: 175 }, {}));
    assertNoTemplateLeaks(runWellness('ideal-weight', { unit: 'imperial', sex: 'female', height: 65 }, {}));
    assertNoTemplateLeaks(runWellness('ideal-weight', { unit: 'metric', sex: 'male', height: 0 }, {}));

    usePack(piEs);
    assertNoTemplateLeaks(runWellness('protein-intake', { unit: 'metric', weight: 75, goal: 'strength', meals: 4 }, {}));
    assertNoTemplateLeaks(runWellness('protein-intake', { unit: 'imperial', weight: 160, goal: 'fat-loss', meals: 3 }, {}));
    assertNoTemplateLeaks(runWellness('protein-intake', { unit: 'metric', weight: 0, goal: 'sedentary', meals: 3 }, {}));
  });

  it('runs Sleep Cycle and Timezone calculators across DST and edge states with localized UI', () => {
    usePack(sleepEs);
    assertNoTemplateLeaks(runDateTime('sleep', { direction: 'wake', time: '07:00', latency: 15, cycle: 90 }, {}));
    assertNoTemplateLeaks(runDateTime('sleep', { direction: 'sleep', time: '23:00', latency: 0, cycle: 90 }, {}));
    assertNoTemplateLeaks(runDateTime('sleep', { direction: 'wake', time: 'invalid', latency: 15, cycle: 90 }, {}));
    assertNoTemplateLeaks(runDateTime('sleep', { direction: 'wake', time: '07:00', latency: 15.5, cycle: 90 }, {}));
    assertNoTemplateLeaks(runDateTime('sleep', { direction: 'wake', time: '07:00', latency: 15, cycle: 200 }, {}));

    usePack(tzEs);
    assertNoTemplateLeaks(runDateTime('timezone', { datetime: '2026-07-08T09:00', fromZone: 'America/New_York', toZone: 'Asia/Tokyo' }, {}));
    assertNoTemplateLeaks(runDateTime('timezone', { datetime: '2026-07-08T22:00', fromZone: 'Asia/Tokyo', toZone: 'America/New_York' }, {}));
    assertNoTemplateLeaks(runDateTime('timezone', { datetime: '2026-03-08T02:30', fromZone: 'America/New_York', toZone: 'UTC' }, {}));
    assertNoTemplateLeaks(runDateTime('timezone', { datetime: '2026-11-01T01:30', fromZone: 'America/New_York', toZone: 'Europe/London' }, {}));
    assertNoTemplateLeaks(runDateTime('timezone', { datetime: '2026-07-08T09:00', fromZone: 'Invalid/Zone', toZone: 'UTC' }, {}));
  });

  it('runs Roman, Binary, CSV/JSON, and Text Handoff localized branches', async () => {
    usePack(romanEs);
    expect(detectEncoding('roman', '1999').label).toBe('Número');
    expect(detectEncoding('roman', 'MCMXCIX').label).toBe('Número romano');
    expect(validateEncoding('roman', 'encode', '0').message).toContain('cero');
    expect(validateEncoding('roman', 'encode', '-5').message).toContain('negativo');
    expect(validateEncoding('roman', 'encode', '5000').message).toContain('5000');
    expect(validateEncoding('roman', 'decode', 'IIII').severity).toBe('warning');
    expect(validateEncoding('roman', 'decode', 'ABC').ok).toBe(false);
    expect(encodingMeta('roman', '1999', 'MCMXCIX', 'encode').length).toBeGreaterThan(0);
    assertNoTemplateLeaks(recoverEncoding('roman', 'decode', 'IIII'));

    usePack(binEs);
    expect(detectEncoding('number-base', '0b1010').label).toBe('Binario');
    expect(detectEncoding('number-base', '42').label).toBe('Número');
    expect(validateEncoding('number-base', 'decode', '102').ok).toBe(false);
    expect(validateEncoding('number-base', 'encode', 'abc').ok).toBe(false);
    expect(encodingMeta('number-base', '42', '101010', 'encode').length).toBe(4);
    assertNoTemplateLeaks(recoverEncoding('number-base', 'decode', '0b1010_1100'));

    usePack(c2jEs);
    expect((await runStructuredData('csv-to-json', '"unclosed')).ok).toBe(false);
    expect((await runStructuredData('csv-to-json', 'name,age')).error).toContain('datos');

    usePack(jtcEs);
    expect((await runStructuredData('json-to-csv', '{"a":1}')).error).toContain('array');
    expect((await runStructuredData('json-to-csv', '[]')).error).toContain('vacío');

    usePack(revEs);
    assertNoTemplateLeaks(textHandoff('reverseText', 'a\nb', 'b\na'));

    usePack(resEs);
    assertNoTemplateLeaks(textHandoff('removeExtraSpaces', ' a   b ', ' a b '));

    usePack(rdlEs);
    assertNoTemplateLeaks(textHandoff('removeDuplicateLines', 'Foo \nFoo\nfoo', 'Foo \nFoo\nfoo'));
  });
});
