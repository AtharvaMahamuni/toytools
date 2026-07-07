// RPN evaluator — consumes the parser's Reverse Polish output with a value stack, applying
// operators and functions from the registries. All domain problems (divide by zero, sqrt of a
// negative, factorial of a non-integer) surface here as a NaN/Infinity and are reported as a
// student-readable MathError rather than leaking a raw number.

import { MathError } from './errors';
import { CONSTANTS } from './constants';
import { FUNCTIONS } from './functions';
import { OPERATORS } from './operators';
import type { EvalContext, Token } from './types';

export function evaluateRpn(rpn: Token[], ctx: EvalContext): number {
  const stack: number[] = [];

  for (const tok of rpn) {
    switch (tok.type) {
      case 'number':
        stack.push(Number(tok.value));
        break;
      case 'constant':
        stack.push(CONSTANTS[tok.value](ctx));
        break;
      case 'function': {
        const def = FUNCTIONS[tok.value]!;
        if (stack.length < def.arity) throw new MathError('Malformed expression');
        const args = stack.splice(stack.length - def.arity, def.arity);
        stack.push(def.apply(args, ctx));
        break;
      }
      case 'operator': {
        const op = OPERATORS[tok.value]!;
        if (stack.length < op.arity) throw new MathError('Malformed expression');
        const args = stack.splice(stack.length - op.arity, op.arity);
        stack.push(op.apply(...args));
        break;
      }
      default:
        throw new MathError('Malformed expression');
    }
  }

  if (stack.length !== 1) throw new MathError('Malformed expression');
  const result = stack[0];
  if (Number.isNaN(result)) throw new MathError('Result is undefined (check the values)');
  if (!Number.isFinite(result)) throw new MathError('Result is too large or divides by zero');
  return result;
}
