// Tokenizer — string → Token[]. Recognizes numbers (incl. decimals, leading '.', scientific
// notation), identifiers (classified as function/constant via the registries), operators,
// parentheses, commas, and factorial. Unicode operator glyphs (× ÷ − π) are normalized here.
//
// Unary vs binary +/- is resolved with an "expect operand" flag: a '-' where an operand is
// expected (start of input, after '(', ',', or another operator) becomes the internal 'u-'.

import { MathError } from './errors';
import { isConstant } from './constants';
import { isFunction } from './functions';
import type { Token } from './types';

const isDigit = (c: string): boolean => c >= '0' && c <= '9';
const isLetter = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');

/** Map friendly glyphs to their ASCII operator equivalents before scanning. */
function normalizeChar(c: string): string {
  switch (c) {
    case '×':
    case '·':
      return '*';
    case '÷':
      return '/';
    case '−': // U+2212 minus sign
      return '-';
    default:
      return c;
  }
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  // True when the next token should be an operand (so +/- read as unary).
  let expectOperand = true;

  const pushValue = (t: Token): void => {
    tokens.push(t);
    expectOperand = false;
  };
  const pushOperandExpecting = (t: Token): void => {
    tokens.push(t);
    expectOperand = true;
  };

  while (i < input.length) {
    const c = normalizeChar(input[i]);

    if (c === ' ' || c === '\t' || c === '\n') {
      i++;
      continue;
    }

    // Numbers: 12, 3.14, .5, 1.5e3, 2E-4
    if (isDigit(c) || (c === '.' && isDigit(input[i + 1]))) {
      let j = i;
      while (isDigit(input[j])) j++;
      if (input[j] === '.') {
        j++;
        while (isDigit(input[j])) j++;
      }
      if (input[j] === 'e' || input[j] === 'E') {
        let k = j + 1;
        if (input[k] === '+' || input[k] === '-') k++;
        if (isDigit(input[k])) {
          k++;
          while (isDigit(input[k])) k++;
          j = k;
        }
      }
      const raw = input.slice(i, j);
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new MathError(`Invalid number "${raw}"`);
      pushValue({ type: 'number', value: raw });
      i = j;
      continue;
    }

    // π is a constant glyph.
    if (c === 'π') {
      pushValue({ type: 'constant', value: 'pi' });
      i++;
      continue;
    }

    // Identifiers → function or constant.
    if (isLetter(c)) {
      let j = i;
      while (j < input.length && isLetter(input[j])) j++;
      const name = input.slice(i, j).toLowerCase();
      if (isFunction(name)) {
        // A function expects its argument list next.
        pushOperandExpecting({ type: 'function', value: name });
      } else if (isConstant(name)) {
        pushValue({ type: 'constant', value: name });
      } else {
        throw new MathError(`Unknown name "${name}"`);
      }
      i = j;
      continue;
    }

    switch (c) {
      case '(':
        pushOperandExpecting({ type: 'lparen', value: '(' });
        break;
      case ')':
        pushValue({ type: 'rparen', value: ')' });
        break;
      case ',':
        pushOperandExpecting({ type: 'comma', value: ',' });
        break;
      case '!':
        // Postfix: it completes a value, so an operand is NOT expected next.
        pushValue({ type: 'operator', value: '!' });
        break;
      case '+':
      case '-':
        pushOperandExpecting({ type: 'operator', value: expectOperand ? (c === '-' ? 'u-' : 'u+') : c });
        break;
      case '*':
      case '/':
      case '%':
      case '^':
        pushOperandExpecting({ type: 'operator', value: c });
        break;
      default:
        throw new MathError(`Unexpected character "${input[i]}"`);
    }
    i++;
  }

  return tokens;
}
