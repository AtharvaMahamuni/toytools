// Constant registry — data-driven. A constant resolves to a number given the eval context
// (so `ans` can return the last answer). `π` and `pi` are aliases for the same value.

import type { EvalContext } from './types';

export const CONSTANTS: Record<string, (ctx: EvalContext) => number> = {
  pi: () => Math.PI,
  π: () => Math.PI,
  e: () => Math.E,
  tau: () => Math.PI * 2,
  ans: (ctx) => ctx.ans,
};

export function isConstant(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(CONSTANTS, name);
}
