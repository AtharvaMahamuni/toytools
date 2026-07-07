// Shared types for the math engine — a small, data-driven expression language.
//
// The whole engine is registry-driven: operators, functions, and constants are data
// (operators.ts / functions.ts / constants.ts). The tokenizer, parser, and evaluator read
// those registries and never hard-code a symbol, so adding `cbrt`, `mod`, or a new constant
// is one entry, not a parser change. This is what lets future tools (equation solver,
// graphing, matrix, statistics) reuse the same parser.

export type AngleMode = 'deg' | 'rad';

/** Evaluation context threaded through the RPN evaluator (trig angle unit + last answer). */
export interface EvalContext {
  angleMode: AngleMode;
  ans: number;
}

/** Every public entry point returns this — the engine never throws on bad input. */
export type EvalResult = { ok: true; value: number } | { ok: false; error: string };

export type TokenType =
  | 'number'
  | 'operator'
  | 'function'
  | 'constant'
  | 'lparen'
  | 'rparen'
  | 'comma';

export interface Token {
  type: TokenType;
  /** For operators this is the internal symbol (e.g. 'u-' for unary minus). */
  value: string;
}

export type Associativity = 'left' | 'right';
export type OperatorPosition = 'infix' | 'prefix' | 'postfix';

export interface OperatorDef {
  /** Internal symbol used in the token stream (unary minus is 'u-', not '-'). */
  symbol: string;
  precedence: number;
  associativity: Associativity;
  position: OperatorPosition;
  /** Number of operands (1 for unary prefix/postfix, 2 for binary). */
  arity: 1 | 2;
  apply: (...args: number[]) => number;
}

export interface FunctionDef {
  name: string;
  arity: number;
  apply: (args: number[], ctx: EvalContext) => number;
}
