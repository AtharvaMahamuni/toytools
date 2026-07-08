import { describe, expect, it } from 'vitest';
import {
  HISTORY_LIMIT,
  backspace,
  clear,
  clearHistory,
  createInitialState,
  evaluateCurrent,
  hasMemory,
  insert,
  memoryAdd,
  memoryClear,
  memoryRecall,
  memoryStore,
  memorySubtract,
  reuseHistory,
  toggleAngleMode,
} from './state';

describe('editing', () => {
  it('inserts chunks and backspaces one character', () => {
    let s = createInitialState();
    s = insert(s, '1');
    s = insert(s, '2');
    s = insert(s, '+');
    s = insert(s, 'sin(');
    expect(s.expression).toBe('12+sin(');
    s = backspace(s);
    expect(s.expression).toBe('12+sin');
  });

  it('clears everything', () => {
    let s = insert(createInitialState(), '9');
    s = clear(s);
    expect(s.expression).toBe('');
    expect(s.result).toBe('');
  });
});

describe('evaluation & history', () => {
  it('evaluates, formats, sets ans, and records a history entry', () => {
    let s = createInitialState({ angleMode: 'rad' });
    s = insert(s, '2');
    s = insert(s, '+');
    s = insert(s, '3');
    s = evaluateCurrent(s, 1000);
    expect(s.result).toBe('5');
    expect(s.ans).toBe(5);
    expect(s.history[0]).toEqual({ expression: '2+3', result: '5', mode: 'rad', timestamp: 1000 });
    expect(s.justEvaluated).toBe(true);
  });

  it('does nothing for an empty expression', () => {
    const s = evaluateCurrent(createInitialState());
    expect(s.result).toBe('');
    expect(s.history).toHaveLength(0);
  });

  it('surfaces an evaluation error without recording history', () => {
    let s = insert(createInitialState(), '1');
    s = insert(s, '/');
    s = insert(s, '0');
    s = evaluateCurrent(s);
    expect(s.error).toMatch(/divide|large/i);
    expect(s.result).toBe('');
    expect(s.history).toHaveLength(0);
  });

  it('feeds the previous answer into the next expression via ans', () => {
    let s = createInitialState({ angleMode: 'rad' });
    s = evaluateCurrent(insert(insert(insert(s, '4'), '*'), '5')); // 20
    s = insert(s, '+'); // operator after '=' continues from the result
    expect(s.expression).toBe('20+');
    s = evaluateCurrent(insert(s, '1'));
    expect(s.result).toBe('21');
  });

  it('starts fresh when a digit follows "="', () => {
    let s = evaluateCurrent(insert(insert(insert(createInitialState(), '4'), '*'), '5')); // 20
    s = insert(s, '7'); // value after '=' restarts
    expect(s.expression).toBe('7');
  });

  it('caps history at the limit, newest first', () => {
    let s = createInitialState({ angleMode: 'rad' });
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) {
      s = clear(s);
      s = evaluateCurrent(insert(s, String(i)), i);
    }
    expect(s.history).toHaveLength(HISTORY_LIMIT);
    expect(s.history[0].expression).toBe(String(HISTORY_LIMIT + 4)); // newest
  });

  it('reuses a history expression', () => {
    let s = createInitialState({ angleMode: 'rad' });
    s = evaluateCurrent(insert(insert(insert(s, '6'), '*'), '7')); // 42
    s = reuseHistory(s, 0);
    expect(s.expression).toBe('6*7');
    expect(reuseHistory(s, 99)).toBe(s); // out-of-range is a no-op
    s = clearHistory(s);
    expect(s.history).toHaveLength(0);
  });
});

describe('angle mode', () => {
  it('toggles between deg and rad', () => {
    const s = createInitialState({ angleMode: 'deg' });
    expect(toggleAngleMode(s).angleMode).toBe('rad');
    expect(toggleAngleMode(toggleAngleMode(s)).angleMode).toBe('deg');
  });

  it('honours the mode during evaluation', () => {
    let s = createInitialState({ angleMode: 'deg' });
    s = evaluateCurrent(insert(insert(insert(insert(s, 'sin('), '3'), '0'), ')'));
    expect(Number(s.result)).toBeCloseTo(0.5, 10);
  });
});

describe('memory service', () => {
  it('stores, adds, subtracts, recalls, and clears', () => {
    let s = createInitialState({ angleMode: 'rad' });
    s = evaluateCurrent(insert(insert(insert(s, '2'), '+'), '3')); // ans = 5
    s = memoryStore(s); // M = 5
    expect(s.memory).toBe(5);
    expect(hasMemory(s)).toBe(true);

    s = clear(s);
    s = insert(s, '2'); // current value 2
    s = memoryAdd(s); // M = 7
    expect(s.memory).toBe(7);

    s = clear(s);
    s = insert(s, '3');
    s = memorySubtract(s); // M = 4
    expect(s.memory).toBe(4);

    s = clear(s);
    s = memoryRecall(s); // inserts "4"
    expect(s.expression).toBe('4');

    s = memoryClear(s);
    expect(s.memory).toBe(0);
    expect(hasMemory(s)).toBe(false);
  });

  it('falls back to ans when the current expression is invalid', () => {
    let s = createInitialState({ angleMode: 'rad', ans: 9 });
    s = insert(s, '('); // invalid expression
    s = memoryAdd(s); // uses ans (9)
    expect(s.memory).toBe(9);
  });
});
