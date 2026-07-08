// Function registry — data-driven. Each entry declares its arity and a pure `apply`.
// Trig functions read the angle mode from the evaluation context, so DEG/RAD is a runtime
// concern, not baked into the parser. Adding `sinh`, `atan2`, etc. is one entry here.

import type { EvalContext, FunctionDef } from './types';

const DEG_PER_RAD = 180 / Math.PI;

/** Convert an incoming angle to radians for the trig functions when in DEG mode. */
function toRadians(angle: number, ctx: EvalContext): number {
  return ctx.angleMode === 'deg' ? angle / DEG_PER_RAD : angle;
}

/** Convert an inverse-trig result (radians) back to the active angle unit. */
function fromRadians(radians: number, ctx: EvalContext): number {
  return ctx.angleMode === 'deg' ? radians * DEG_PER_RAD : radians;
}

export const FUNCTIONS: Record<string, FunctionDef> = {
  sin: { name: 'sin', arity: 1, apply: ([x], ctx) => Math.sin(toRadians(x, ctx)) },
  cos: { name: 'cos', arity: 1, apply: ([x], ctx) => Math.cos(toRadians(x, ctx)) },
  tan: { name: 'tan', arity: 1, apply: ([x], ctx) => Math.tan(toRadians(x, ctx)) },
  asin: { name: 'asin', arity: 1, apply: ([x], ctx) => fromRadians(Math.asin(x), ctx) },
  acos: { name: 'acos', arity: 1, apply: ([x], ctx) => fromRadians(Math.acos(x), ctx) },
  atan: { name: 'atan', arity: 1, apply: ([x], ctx) => fromRadians(Math.atan(x), ctx) },
  ln: { name: 'ln', arity: 1, apply: ([x]) => Math.log(x) },
  log: { name: 'log', arity: 1, apply: ([x]) => Math.log10(x) },
  sqrt: { name: 'sqrt', arity: 1, apply: ([x]) => Math.sqrt(x) },
  cbrt: { name: 'cbrt', arity: 1, apply: ([x]) => Math.cbrt(x) },
  abs: { name: 'abs', arity: 1, apply: ([x]) => Math.abs(x) },
  exp: { name: 'exp', arity: 1, apply: ([x]) => Math.exp(x) },
  floor: { name: 'floor', arity: 1, apply: ([x]) => Math.floor(x) },
  ceil: { name: 'ceil', arity: 1, apply: ([x]) => Math.ceil(x) },
  round: { name: 'round', arity: 1, apply: ([x]) => Math.round(x) },
  pow: { name: 'pow', arity: 2, apply: ([x, y]) => Math.pow(x, y) },
};

export function isFunction(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(FUNCTIONS, name);
}
