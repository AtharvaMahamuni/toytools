// Calculator state machine — pure transitions returning a new state. Knows nothing about the
// DOM; the widget dispatches DOM events into these and re-renders the result. The memory keys
// are a small reusable service so future calculators inherit them for free.

import { evaluate, formatResult } from '@lib/math';
import type { CalculatorState, HistoryEntry } from './types';

/** Cap on stored history entries (newest first). */
export const HISTORY_LIMIT = 20;

/** Chunks that continue from the previous answer (an operator applied to it) rather than restart. */
const CONTINUATION = /^[+\-*/^%)!]/;

export function createInitialState(overrides: Partial<CalculatorState> = {}): CalculatorState {
  return {
    expression: '',
    result: '',
    error: '',
    history: [],
    memory: 0,
    angleMode: 'deg',
    ans: 0,
    justEvaluated: false,
    ...overrides,
  };
}

/** Append a chunk (digit, operator, "sin(", "pi", …). After '=', an operator continues from the
 *  result while a value starts fresh — the behaviour students expect. */
export function insert(state: CalculatorState, chunk: string): CalculatorState {
  let expression = state.expression;
  if (state.justEvaluated) {
    expression = CONTINUATION.test(chunk) ? state.result : '';
  }
  return { ...state, expression: expression + chunk, result: '', error: '', justEvaluated: false };
}

export function backspace(state: CalculatorState): CalculatorState {
  return {
    ...state,
    expression: state.expression.slice(0, -1),
    error: '',
    justEvaluated: false,
  };
}

export function clear(state: CalculatorState): CalculatorState {
  return { ...state, expression: '', result: '', error: '', justEvaluated: false };
}

/** Evaluate the current expression. On success records history and updates `ans`. Never throws. */
export function evaluateCurrent(state: CalculatorState, now: number = Date.now()): CalculatorState {
  if (state.expression.trim() === '') return { ...state, result: '', error: '' };
  const res = evaluate(state.expression, { angleMode: state.angleMode, ans: state.ans });
  if (!res.ok) {
    return { ...state, result: '', error: res.error, justEvaluated: false };
  }
  const result = formatResult(res.value);
  const entry: HistoryEntry = { expression: state.expression, result, mode: state.angleMode, timestamp: now };
  return {
    ...state,
    result,
    error: '',
    ans: res.value,
    history: [entry, ...state.history].slice(0, HISTORY_LIMIT),
    justEvaluated: true,
  };
}

export function toggleAngleMode(state: CalculatorState): CalculatorState {
  return { ...state, angleMode: state.angleMode === 'deg' ? 'rad' : 'deg' };
}

/** Load a past expression back into the editor. */
export function reuseHistory(state: CalculatorState, index: number): CalculatorState {
  const entry = state.history[index];
  if (!entry) return state;
  return { ...state, expression: entry.expression, result: '', error: '', justEvaluated: false };
}

export function clearHistory(state: CalculatorState): CalculatorState {
  return { ...state, history: [] };
}

// ── Memory service ────────────────────────────────────────────────────────────────────────────

/** The value memory operations act on: the current expression's value, or the last answer. */
function currentValue(state: CalculatorState): number {
  if (state.expression.trim() === '') return state.ans;
  const res = evaluate(state.expression, { angleMode: state.angleMode, ans: state.ans });
  return res.ok ? res.value : state.ans;
}

export function memoryAdd(state: CalculatorState): CalculatorState {
  return { ...state, memory: state.memory + currentValue(state) };
}

export function memorySubtract(state: CalculatorState): CalculatorState {
  return { ...state, memory: state.memory - currentValue(state) };
}

export function memoryStore(state: CalculatorState): CalculatorState {
  return { ...state, memory: currentValue(state) };
}

export function memoryClear(state: CalculatorState): CalculatorState {
  return { ...state, memory: 0 };
}

/** Recall memory into the expression (as an inserted number). */
export function memoryRecall(state: CalculatorState): CalculatorState {
  return insert(state, formatResult(state.memory));
}

export function hasMemory(state: CalculatorState): boolean {
  return state.memory !== 0;
}
