// Implicit-multiplication preprocessing — runs on the token stream so the parser never has to
// care. It inserts an explicit '*' between a value and something that starts a new value:
//   2π      → 2 * pi          )( → ) * (
//   2(3+4)  → 2 * (3+4)       (1+2)3 → (1+2) * 3
//   3sin(x) → 3 * sin(x)      3!2   → 3! * 2
//
// The one deliberate exception is number-followed-by-number ("2 3"), left as a parse error
// because it is far more likely a typo than an intended product.

import type { Token } from './types';

/** True when a token completes a value (so a following value implies multiplication). */
function endsValue(t: Token): boolean {
  return t.type === 'number' || t.type === 'constant' || t.type === 'rparen' || (t.type === 'operator' && t.value === '!');
}

/** True when a token begins a new value. */
function beginsValue(t: Token): boolean {
  return t.type === 'number' || t.type === 'constant' || t.type === 'function' || t.type === 'lparen';
}

export function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const cur = tokens[i];
    out.push(cur);
    const next = tokens[i + 1];
    if (!next) continue;
    if (endsValue(cur) && beginsValue(next) && !(cur.type === 'number' && next.type === 'number')) {
      out.push({ type: 'operator', value: '*' });
    }
  }
  return out;
}
