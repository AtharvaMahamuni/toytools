// Operator registry — data, not switch statements. The parser reads precedence/associativity/
// position from here; adding an operator never touches the parser or evaluator.
//
// Precedence ladder (higher binds tighter):
//   2  + -            binary add/subtract
//   3  * / %          binary multiply/divide/modulo
//   4  u- u+          unary minus/plus (prefix). Lower than ^, so -2^2 = -(2^2) = -4.
//   5  ^              power (right-associative)
//   6  !              factorial (postfix), binds tighter than ^: 2^3! = 2^(3!)

import type { OperatorDef } from './types';

/** Factorial for non-negative integers; NaN for negatives / non-integers (evaluator reports it). */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // 171! overflows a double
  let acc = 1;
  for (let i = 2; i <= n; i++) acc *= i;
  return acc;
}

export const OPERATORS: Record<string, OperatorDef> = {
  '+': { symbol: '+', precedence: 2, associativity: 'left', position: 'infix', arity: 2, apply: (a, b) => a + b },
  '-': { symbol: '-', precedence: 2, associativity: 'left', position: 'infix', arity: 2, apply: (a, b) => a - b },
  '*': { symbol: '*', precedence: 3, associativity: 'left', position: 'infix', arity: 2, apply: (a, b) => a * b },
  '/': { symbol: '/', precedence: 3, associativity: 'left', position: 'infix', arity: 2, apply: (a, b) => a / b },
  '%': { symbol: '%', precedence: 3, associativity: 'left', position: 'infix', arity: 2, apply: (a, b) => a % b },
  '^': { symbol: '^', precedence: 5, associativity: 'right', position: 'infix', arity: 2, apply: (a, b) => Math.pow(a, b) },
  'u-': { symbol: 'u-', precedence: 4, associativity: 'right', position: 'prefix', arity: 1, apply: (a) => -a },
  'u+': { symbol: 'u+', precedence: 4, associativity: 'right', position: 'prefix', arity: 1, apply: (a) => a },
  '!': { symbol: '!', precedence: 6, associativity: 'left', position: 'postfix', arity: 1, apply: (a) => factorial(a) },
};

export function isOperator(symbol: string): boolean {
  return Object.prototype.hasOwnProperty.call(OPERATORS, symbol);
}
