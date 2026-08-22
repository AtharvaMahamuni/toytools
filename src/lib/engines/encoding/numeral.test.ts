// The numeral family: Roman, English words and binary. Same reversible contract as the rest of the
// encoding engine, a different vocabulary each.
//
// Every `recover` is tested on both halves, weighted equally: that it FIRES on the input shape it
// exists for, and that it stays SILENT on input that is already fine. A recovery offer that is
// always on is a banner, not a fix.

import { describe, it, expect } from 'vitest';
import { runEncoding, detectEncoding, validateEncoding, encodingMeta, recoverEncoding, encodingInfo } from './registry';
import { toRoman, fromRoman, canonicalise } from './roman';
import { numberToWords, wordsToNumber, integerToWords, stripFormatting } from './numberWords';
import { toBinary, toDecimal, normalise, groupBits, padToByte } from './numberBase';

describe('roman numerals', () => {
  it('writes the canonical subtractive spelling', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(1987)).toBe('MCMLXXXVII');
    expect(toRoman(2026)).toBe('MMXXVI');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });

  it('refuses the values the notation cannot express', () => {
    expect(() => toRoman(0)).toThrow();
    expect(() => toRoman(-5)).toThrow();
    expect(() => toRoman(4000)).toThrow();
    expect(() => toRoman(1.5)).toThrow();
  });

  it('round-trips every value in range', () => {
    for (let n = 1; n <= 3999; n++) expect(fromRoman(toRoman(n))).toBe(n);
  });

  it('reads the non-standard spellings found on clocks and monuments', () => {
    expect(fromRoman('IIII')).toBe(4);
    expect(fromRoman('VIIII')).toBe(9);
    expect(fromRoman('MDCCCCX')).toBe(1910);
    expect(fromRoman('mcmxc')).toBe(1990);
  });

  it('rejects anything that is not a Roman letter', () => {
    expect(() => fromRoman('')).toThrow();
    expect(() => fromRoman('ABC')).toThrow();
    expect(() => fromRoman('X1')).toThrow();
  });

  it('names the direction from the input shape', () => {
    expect(detectEncoding('roman', '1987')).toMatchObject({ mode: 'encode', confidence: 'high' });
    expect(detectEncoding('roman', 'MCMLXXXVII')).toMatchObject({ mode: 'decode', confidence: 'high' });
    expect(detectEncoding('roman', '')).toMatchObject({ confidence: 'low' });
  });

  it('explains a rejection in the notation\'s own terms', () => {
    expect(validateEncoding('roman', 'encode', '0').message).toContain('no numeral for zero');
    expect(validateEncoding('roman', 'encode', '-4').message).toContain('no sign');
    expect(validateEncoding('roman', 'encode', '5000').message).toContain('overbar');
    expect(validateEncoding('roman', 'decode', 'MXQ').message).toContain('"Q" is not a Roman letter');
  });

  it('flags a readable but non-standard numeral as a warning, not an error', () => {
    const v = validateEncoding('roman', 'decode', 'IIII');
    expect(v.ok).toBe(true);
    expect(v.severity).toBe('warning');
  });

  it('reports the letters and the subtractive pairs', () => {
    expect(encodingMeta('roman', '1987', 'MCMLXXXVII', 'encode')).toContainEqual({ label: 'Subtractive pairs', value: '1' });
    expect(encodingMeta('roman', '1987', 'MCMLXXXVII', 'encode')).toContainEqual({ label: 'Value', value: '1,987' });
  });

  it('speaks in numerals rather than in Encode and Decode', () => {
    const info = encodingInfo('roman');
    expect(info.modes.forwardLabel).toBe('To Roman →');
    expect(info.modes.inverseLabel).toBe('To number ←');
    expect(info.recoverable).toBe(true);
  });

  it('craft: offers the standard spelling of a clock-face numeral', () => {
    expect(canonicalise('IIII')).toEqual({ value: 4, canonical: 'IV' });
    const offer = recoverEncoding('roman', 'decode', 'MDCCCCX');
    expect(offer).toEqual({ label: 'Rewrite as MCMX, the standard spelling of 1910', text: 'MCMX', mode: 'decode' });
  });

  it('craft: stays silent on a numeral already written the modern way', () => {
    expect(canonicalise('IV')).toBeNull();
    expect(recoverEncoding('roman', 'decode', 'MMXXVI')).toBeNull();
    expect(recoverEncoding('roman', 'decode', 'not a numeral')).toBeNull();
    expect(recoverEncoding('roman', 'encode', '1987')).toBeNull();
  });
});

describe('numbers in words', () => {
  it('spells the shapes that trip a naive implementation', () => {
    expect(integerToWords(0)).toBe('zero');
    expect(integerToWords(13)).toBe('thirteen');
    expect(integerToWords(21)).toBe('twenty-one');
    expect(integerToWords(100)).toBe('one hundred');
    expect(integerToWords(101)).toBe('one hundred one');
    expect(integerToWords(1000)).toBe('one thousand');
    expect(integerToWords(1000000)).toBe('one million');
    expect(integerToWords(1000001)).toBe('one million one');
    expect(integerToWords(4213)).toBe('four thousand two hundred thirteen');
  });

  it('reads decimals digit by digit and marks a negative', () => {
    expect(numberToWords('4.75')).toBe('four point seven five');
    expect(numberToWords('-12')).toBe('negative twelve');
    expect(numberToWords('0.05')).toBe('zero point zero five');
  });

  it('round-trips through both directions', () => {
    for (const n of ['0', '7', '19', '20', '99', '100', '115', '1000', '90210', '1000000', '123456789']) {
      expect(wordsToNumber(numberToWords(n))).toBe(n);
    }
  });

  it('accepts the British "and", commas and hyphens on the way back', () => {
    expect(wordsToNumber('one hundred and five')).toBe('105');
    expect(wordsToNumber('twenty-one')).toBe('21');
    expect(wordsToNumber('four thousand, two hundred and thirteen')).toBe('4213');
    expect(wordsToNumber('minus seven')).toBe('-7');
  });

  it('names the word it could not read', () => {
    expect(() => wordsToNumber('four bananas')).toThrow(/"bananas" is not part of a number/);
    expect(() => wordsToNumber('   ')).toThrow();
  });

  it('refuses a number too large to spell exactly', () => {
    expect(validateEncoding('number-words', 'encode', '1000000000000000000').ok).toBe(false);
  });

  it('craft: recovers an amount copied out of a spreadsheet', () => {
    expect(stripFormatting('$4,213.75')).toBe('4213.75');
    expect(stripFormatting('1 234 567')).toBe('1234567');
    expect(stripFormatting('₹1,00,000')).toBe('100000');
    expect(recoverEncoding('number-words', 'encode', '$4,213.75')).toEqual({
      label: 'Use 4213.75', text: '4213.75', mode: 'encode',
    });
  });

  it('craft: stays silent on a bare number and on words', () => {
    expect(stripFormatting('4213.75')).toBeNull();
    expect(stripFormatting('four thousand')).toBeNull();
    expect(recoverEncoding('number-words', 'encode', '4213')).toBeNull();
    expect(recoverEncoding('number-words', 'decode', 'four thousand')).toBeNull();
  });
});

describe('binary numbers', () => {
  it('converts both ways', () => {
    expect(toBinary('0')).toBe('0');
    expect(toBinary('2026')).toBe('11111101010');
    expect(toBinary('255')).toBe('11111111');
    expect(toDecimal('11111101010')).toBe('2026');
    expect(toDecimal('0b1011')).toBe('11');
  });

  it('stays exact past the range a double can hold', () => {
    const big = '9007199254740993'; // 2^53 + 1
    expect(toDecimal(toBinary(big))).toBe(big);
  });

  it('keeps the sign rather than inventing two\'s complement', () => {
    expect(toBinary('-11')).toBe('-1011');
    expect(toDecimal('-1011')).toBe('-11');
  });

  it('rejects a digit binary does not have', () => {
    expect(() => toDecimal('1021')).toThrow(/only 0 and 1/);
    expect(validateEncoding('number-base', 'decode', '10201')).toMatchObject({ ok: false, position: 2 });
  });

  it('reports hex, octal and the width', () => {
    const meta = encodingMeta('number-base', '255', '11111111', 'encode');
    expect(meta).toContainEqual({ label: 'Hex', value: '0xFF' });
    expect(meta).toContainEqual({ label: 'Octal', value: '0o377' });
    expect(meta).toContainEqual({ label: 'Bits', value: '8' });
    expect(meta).toContainEqual({ label: 'Bytes', value: '1' });
  });

  it('guesses binary only once the run is long enough to mean it', () => {
    expect(detectEncoding('number-base', '11111101010')).toMatchObject({ mode: 'decode', confidence: 'high' });
    expect(detectEncoding('number-base', '11')).toMatchObject({ mode: 'encode', confidence: 'low' });
    expect(detectEncoding('number-base', '2026')).toMatchObject({ mode: 'encode', confidence: 'high' });
    expect(detectEncoding('number-base', '0b1010')).toMatchObject({ mode: 'decode', confidence: 'high' });
  });

  it('groups and pads for reading', () => {
    expect(groupBits('1000001')).toBe('100 0001');
    expect(padToByte('1000001')).toBe('01000001');
    expect(padToByte('11111111')).toBeNull();
  });

  it('craft: recovers the separators binary arrives wearing', () => {
    expect(normalise('1010 1100')).toBe('10101100');
    expect(recoverEncoding('number-base', 'decode', '1010_1100')).toEqual({
      label: 'Use 10101100', text: '10101100', mode: 'decode',
    });
    expect(recoverEncoding('number-base', 'decode', '0b1010')).toMatchObject({ text: '1010' });
    expect(recoverEncoding('number-base', 'encode', '1,048,576')).toMatchObject({ text: '1048576' });
  });

  it('craft: stays silent on a value that is already clean', () => {
    expect(recoverEncoding('number-base', 'decode', '10101100')).toBeNull();
    expect(recoverEncoding('number-base', 'encode', '2026')).toBeNull();
    // Stripping does not make this binary, so there is no honest fix to offer.
    expect(recoverEncoding('number-base', 'decode', '10 20 30')).toBeNull();
  });
});

describe('the numeral family as engine citizens', () => {
  it('never throws, whatever it is handed', () => {
    for (const id of ['roman', 'number-words', 'number-base']) {
      for (const mode of ['encode', 'decode'] as const) {
        for (const input of ['', '   ', 'zzzz', '-', '9'.repeat(400), '🙂']) {
          expect(() => runEncoding(id, mode, input)).not.toThrow();
        }
      }
    }
  });

  it('reports a failure as a value rather than an exception', () => {
    expect(runEncoding('roman', 'encode', 'banana')).toMatchObject({ ok: false });
    expect(runEncoding('number-words', 'decode', 'banana')).toMatchObject({ ok: false });
    expect(runEncoding('number-base', 'decode', '2')).toMatchObject({ ok: false });
  });

  it('all declare the numeral vocabulary and a recovery seam', () => {
    for (const id of ['roman', 'number-words', 'number-base']) {
      const info = encodingInfo(id);
      expect(info.reversible, id).toBe(true);
      expect(info.recoverable, id).toBe(true);
      expect(info.modes.forwardLabel, id).not.toBe('Encode →');
    }
  });
});
