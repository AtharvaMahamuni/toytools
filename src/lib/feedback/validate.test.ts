import { describe, it, expect } from 'vitest';
import { validateFeedback } from './validate';
import type { FeedbackInput } from './templates';

const completeIdea: FeedbackInput = {
  type: 'new-tool',
  values: {
    goal: 'Count characters in a tweet including emoji',
    today: 'I paste it into a spreadsheet and count by hand',
    frustration: 'The spreadsheet gets emoji wrong every time',
    ideal: 'Tell me the exact tweet length as I type',
  },
};

describe('validateFeedback', () => {
  it('accepts a complete submission', () => {
    expect(validateFeedback(completeIdea)).toEqual({ ok: true, errors: {} });
  });

  it('flags every missing required answer at once', () => {
    const result = validateFeedback({ type: 'new-tool', values: {} });
    expect(result.ok).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual([
      'frustration',
      'goal',
      'ideal',
      'today',
    ]);
  });

  it('treats whitespace as blank', () => {
    const result = validateFeedback({
      ...completeIdea,
      values: { ...completeIdea.values, goal: '   \n  ' },
    });
    expect(result.errors.goal).toBe('Please fill this in.');
  });

  it('asks for more detail on a one-word answer', () => {
    const result = validateFeedback({
      ...completeIdea,
      values: { ...completeIdea.values, goal: 'stuff' },
    });
    expect(result.errors.goal).toBe('A little more detail would help.');
  });

  // A tool name is legitimately short, so the length floor must not apply to it.
  it('accepts a short tool name', () => {
    const result = validateFeedback({
      type: 'bug',
      values: {
        tool: 'JWT',
        problem: 'The decoder rejects a token that jwt.io accepts',
        expected: 'It should decode the payload the same way',
      },
    });
    expect(result.ok).toBe(true);
  });

  it('ignores optional fields entirely', () => {
    const result = validateFeedback({
      type: 'improve',
      values: {
        tool: 'JSON Formatter',
        goal: 'Format a large config file quickly',
        frustration: 'It reorders my keys and I lose the diff',
        ideal: 'Keep the original key order',
      },
    });
    expect(result.ok).toBe(true);
  });

  it('only validates the fields the selected type asks for', () => {
    // `goal` is required for new-tool but absent from the general form, so a general
    // submission with only a message must pass.
    const result = validateFeedback({
      type: 'general',
      values: { message: 'The dark theme is lovely, thank you' },
    });
    expect(result.ok).toBe(true);
  });

  it('never throws on an unknown type', () => {
    const result = validateFeedback({
      type: 'nonsense' as FeedbackInput['type'],
      values: {},
    });
    expect(result.ok).toBe(true);
  });
});
