import { describe, it, expect } from 'vitest';
import {
  futureValueCompound,
  futureValueAnnuity,
  requiredMonthlyPayment,
  realValueAfterInflation,
  nominalValueAfterInflation,
  ruleOf72,
} from './models';
import { money, percent, years, roundMoney } from './format';

describe('finance models', () => {
  it('futureValueCompound: 1000 at 10% annually for 1 year = 1100', () => {
    expect(futureValueCompound(1000, 0.1, 1, 1)).toBeCloseTo(1100, 6);
  });

  it('futureValueCompound: monthly compounding beats annual', () => {
    expect(futureValueCompound(1000, 0.12, 12, 1)).toBeCloseTo(1126.825, 2);
  });

  it('futureValueAnnuity: $100/mo at 12% for 1 year', () => {
    expect(futureValueAnnuity(100, 0.12, 12, 1)).toBeCloseTo(1268.25, 1);
  });

  it('futureValueAnnuity: zero contribution is zero', () => {
    expect(futureValueAnnuity(0, 0.05, 12, 10)).toBe(0);
  });

  it('requiredMonthlyPayment: zero rate is linear', () => {
    expect(requiredMonthlyPayment(12000, 0, 0, 12)).toBeCloseTo(1000, 6);
  });

  it('requiredMonthlyPayment: already met returns 0', () => {
    expect(requiredMonthlyPayment(1000, 1000, 0.05, 12)).toBe(0);
  });

  it('realValueAfterInflation: erodes purchasing power', () => {
    expect(realValueAfterInflation(100, 0, 5)).toBe(100);
    expect(realValueAfterInflation(100, 0.03, 1)).toBeCloseTo(97.087, 3);
  });

  it('nominalValueAfterInflation: raises future cost', () => {
    expect(nominalValueAfterInflation(100, 0.03, 1)).toBeCloseTo(103, 6);
  });

  it('ruleOf72: doubling time and edge cases', () => {
    expect(ruleOf72(8)).toBe(9);
    expect(ruleOf72(0)).toBe(Infinity);
  });
});

describe('finance format (locale lock)', () => {
  it('money pins en-US currency formatting', () => {
    expect(money(1234.5, 'USD')).toBe('$1,234.50');
  });
  it('money uses Indian grouping for INR', () => {
    expect(money(1250000, 'INR')).toBe('₹12,50,000.00');
  });
  it('percent and years', () => {
    expect(percent(7.5)).toBe('7.5%');
    expect(years(1)).toBe('1 year');
    expect(years(11.3)).toBe('11.3 years');
    expect(years(Infinity)).toBe('never');
  });
  it('roundMoney removes float noise', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });
});
