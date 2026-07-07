// Calculator state types — independent of both the math engine and the DOM. The UI widget is a
// thin renderer over this; all editing, history, memory, and mode logic lives in state.ts and is
// unit-tested. History entries are objects (not bare strings) so future features (search, export,
// "today", restoring the angle mode of a past calculation) need no migration.

import type { AngleMode } from '@lib/math';

export interface HistoryEntry {
  expression: string;
  result: string;
  mode: AngleMode;
  timestamp: number;
}

export interface CalculatorState {
  /** The expression currently being edited. */
  expression: string;
  /** Formatted result of the last successful evaluation, or '' . */
  result: string;
  /** Error message from the last evaluation, or '' . */
  error: string;
  history: HistoryEntry[];
  memory: number;
  angleMode: AngleMode;
  /** Last successful numeric result, fed back as the `ans` token. */
  ans: number;
  /** True immediately after '=', so the next keypress decides continue-vs-restart. */
  justEvaluated: boolean;
}
