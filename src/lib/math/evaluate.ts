// The engine's public entry point. Wires the pipeline together and guarantees it never throws:
// tokenize → insert implicit multiplication → parse (shunting-yard) → evaluate RPN. A MathError
// (bad syntax, domain error) is surfaced verbatim; any other throw becomes a generic message so
// engine internals never reach the UI.

import { MathError } from './errors';
import { tokenize } from './tokenizer';
import { insertImplicitMultiplication } from './preprocess';
import { parse } from './parser';
import { evaluateRpn } from './rpn';
import type { AngleMode, EvalResult } from './types';

export interface EvaluateOptions {
  angleMode?: AngleMode;
  ans?: number;
}

export function evaluate(expression: string, opts: EvaluateOptions = {}): EvalResult {
  const ctx = { angleMode: opts.angleMode ?? 'rad', ans: opts.ans ?? 0 };
  try {
    const tokens = insertImplicitMultiplication(tokenize(expression));
    if (tokens.length === 0) throw new MathError('Empty expression');
    const rpn = parse(tokens);
    return { ok: true, value: evaluateRpn(rpn, ctx) };
  } catch (err) {
    if (err instanceof MathError) return { ok: false, error: err.message };
    return { ok: false, error: 'Invalid expression' };
  }
}
