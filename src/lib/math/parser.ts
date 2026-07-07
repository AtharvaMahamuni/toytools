// Shunting-yard parser — Token[] → Reverse Polish Notation (RPN) Token[].
// Precedence, associativity, and position all come from the OPERATORS registry, and function
// arity from FUNCTIONS, so the parser itself is fixed while the language grows via data.
//
// Beyond classic shunting-yard it also: distinguishes prefix/postfix/binary operators,
// requires functions to be parenthesized, and validates each call's argument count.

import { MathError } from './errors';
import { OPERATORS } from './operators';
import { FUNCTIONS } from './functions';
import type { Token } from './types';

const top = <T>(arr: T[]): T => arr[arr.length - 1];

export function parse(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const ops: Token[] = [];
  // Per open-paren frame: how many arguments seen, and whether the current argument has content.
  const argCount: number[] = [];
  const argHasContent: boolean[] = [];

  const markContent = (): void => {
    if (argHasContent.length) argHasContent[argHasContent.length - 1] = true;
  };

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const prev = tokens[i - 1];

    switch (tok.type) {
      case 'number':
      case 'constant':
        output.push(tok);
        markContent();
        break;

      case 'function':
        if (!tokens[i + 1] || tokens[i + 1].type !== 'lparen') {
          throw new MathError(`"${tok.value}" needs parentheses`);
        }
        ops.push(tok);
        break;

      case 'comma': {
        while (ops.length && top(ops).type !== 'lparen') output.push(ops.pop()!);
        if (!ops.length) throw new MathError('Misplaced comma');
        if (argCount.length) argCount[argCount.length - 1] += 1;
        if (argHasContent.length) argHasContent[argHasContent.length - 1] = false;
        break;
      }

      case 'operator': {
        const o1 = OPERATORS[tok.value];
        if (!o1) throw new MathError(`Unknown operator "${tok.value}"`);
        markContent();
        if (o1.position === 'postfix') {
          while (ops.length && top(ops).type === 'operator' && OPERATORS[top(ops).value].precedence > o1.precedence) {
            output.push(ops.pop()!);
          }
          output.push(tok); // its operand is already in the output
        } else if (o1.position === 'prefix') {
          // Right-associative unary prefix starts a new operand: push without popping.
          ops.push(tok);
        } else {
          // Binary infix.
          while (ops.length && top(ops).type === 'operator') {
            const o2 = OPERATORS[top(ops).value];
            if (o2.precedence > o1.precedence || (o2.precedence === o1.precedence && o1.associativity === 'left')) {
              output.push(ops.pop()!);
            } else break;
          }
          ops.push(tok);
        }
        break;
      }

      case 'lparen':
        ops.push(tok);
        argCount.push(1); // a call has at least one argument slot; grouping ignores this
        argHasContent.push(false);
        // Remember whether this paren opened a function call (prev is the function name).
        (tok as Token & { isCall?: boolean }).isCall = !!(prev && prev.type === 'function');
        break;

      case 'rparen': {
        while (ops.length && top(ops).type !== 'lparen') output.push(ops.pop()!);
        if (!ops.length) throw new MathError('Mismatched parenthesis');
        const lparen = ops.pop()! as Token & { isCall?: boolean };
        const args = argCount.pop() ?? 1;
        const hasContent = argHasContent.pop() ?? false;
        if (ops.length && top(ops).type === 'function') {
          const fn = ops.pop()!;
          const def = FUNCTIONS[fn.value]!;
          const provided = hasContent ? args : 0;
          if (provided !== def.arity) {
            throw new MathError(`"${fn.value}" takes ${def.arity} argument${def.arity === 1 ? '' : 's'}`);
          }
          output.push(fn);
        } else if (lparen.isCall) {
          // Defensive: opened as a call but the function vanished — malformed.
          throw new MathError('Malformed function call');
        }
        markContent(); // the parenthesized group is a value in the enclosing frame
        break;
      }
    }
  }

  while (ops.length) {
    const t = ops.pop()!;
    if (t.type === 'lparen') throw new MathError('Mismatched parenthesis');
    output.push(t);
  }
  return output;
}
