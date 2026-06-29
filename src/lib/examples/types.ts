// Worked-example registry — engine-agnostic mechanism for canonical, reusable input -> output
// examples. One source of truth consumed by guides ("worked example"), the widget's Load Example
// action, and tests (a test re-runs each example's inputs and asserts the engine matches `expect`),
// so examples are never duplicated across files.

export interface WorkedExample<TInput = Record<string, number | string>> {
  /** Stable id, e.g. 'compound-interest-basic'. */
  id: string;
  /** Engine id this example belongs to (e.g. 'finance'). */
  engine: string;
  /** The calculator/processor id within the engine. */
  ref: string;
  /** Short human title for the example. */
  title: string;
  /** The exact inputs to feed the engine. */
  inputs: TInput;
  /** A representative expected value (raw number) the test asserts, keyed by result card id. */
  expect?: Record<string, number>;
  /** One-line narrative used in guides. */
  narrative?: string;
}

/** Build an id -> example map. Pure. */
export function buildExampleRegistry<T = Record<string, number | string>>(
  entries: WorkedExample<T>[],
): Map<string, WorkedExample<T>> {
  const map = new Map<string, WorkedExample<T>>();
  for (const e of entries) map.set(e.id, e);
  return map;
}

/** All examples registered for a given engine/ref. */
export function examplesForRef<T>(
  entries: WorkedExample<T>[],
  engine: string,
  ref: string,
): WorkedExample<T>[] {
  return entries.filter((e) => e.engine === engine && e.ref === ref);
}
