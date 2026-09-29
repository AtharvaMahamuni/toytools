import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import { NON_GOAL_BACKLOG } from './nongoal-backlog';
import { isSpecificNonGoal, nonGoalRatchetErrors } from './nongoal';

const cite = (nonGoal: string) => ({ problem: 'p', nonGoal });

describe('isSpecificNonGoal', () => {
  it('rejects absent, empty and site-wide defaults', () => {
    expect(isSpecificNonGoal(undefined)).toBe(false);
    expect(isSpecificNonGoal('')).toBe(false);
    expect(isSpecificNonGoal('   ')).toBe(false);
    expect(isSpecificNonGoal('call an AI model.')).toBe(false);
    expect(isSpecificNonGoal('Call an  AI model')).toBe(false);
    expect(isSpecificNonGoal('send the text to an AI model.')).toBe(false);
  });

  it('accepts a real limit, with or without the AI clause after it', () => {
    expect(isSpecificNonGoal('verify the signature or send the token to an AI model.')).toBe(true);
    expect(isSpecificNonGoal('count official tokens or recommend a model.')).toBe(true);
  });

  it('holds for every authored nonGoal in the registry', () => {
    const authored = tools.filter(t => t.citation?.nonGoal);
    expect(authored.length).toBeGreaterThanOrEqual(17);
    for (const tool of authored) expect(isSpecificNonGoal(tool.citation!.nonGoal), tool.slug).toBe(true);
  });
});

describe('nonGoalRatchetErrors', () => {
  it('passes the registry today, and the backlog is exactly the tools without one', () => {
    expect(nonGoalRatchetErrors(tools, NON_GOAL_BACKLOG)).toEqual([]);
    const without = tools.filter(t => !isSpecificNonGoal(t.citation?.nonGoal)).map(t => t.slug).sort();
    expect([...NON_GOAL_BACKLOG].sort()).toEqual(without);
  });

  it('the backlog is frozen at 149 and can only shrink', () => {
    // Raise this number never. Lower it in the same PR that gives a backlog tool its nonGoal.
    expect(NON_GOAL_BACKLOG.length).toBeLessThanOrEqual(149);
    expect(Object.isFrozen(NON_GOAL_BACKLOG)).toBe(true);
  });

  it('fails a new tool without a specific nonGoal', () => {
    const errors = nonGoalRatchetErrors(
      [{ slug: 'new-tool' }, { slug: 'lazy-tool', citation: cite('call an AI model.') }],
      [],
    );
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('Tool "new-tool" has no specific citation.nonGoal');
    expect(errors[1]).toContain('Tool "lazy-tool"');
  });

  it('passes a new tool with a specific nonGoal and a backlog tool without one', () => {
    expect(
      nonGoalRatchetErrors([{ slug: 'new-tool', citation: cite('store your notes online.') }, { slug: 'old-tool' }], [
        'old-tool',
      ]),
    ).toEqual([]);
  });

  it('fails a backlog tool that gained a nonGoal until it leaves the backlog', () => {
    const errors = nonGoalRatchetErrors([{ slug: 'old-tool', citation: cite('round to the cent.') }], ['old-tool']);
    expect(errors).toEqual([expect.stringContaining('Remove it from src/lib/llms/nongoal-backlog.ts')]);
  });

  it('fails stale and duplicate backlog entries', () => {
    const errors = nonGoalRatchetErrors([{ slug: 'old-tool' }], ['old-tool', 'old-tool', 'gone-tool']);
    expect(errors).toEqual([
      expect.stringContaining('lists "old-tool" twice'),
      expect.stringContaining('lists "gone-tool", which is not in the registry'),
    ]);
  });
});
