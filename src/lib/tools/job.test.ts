import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import type { ToolJob } from '@data/types';
import { JOB_BACKLOG } from './job-backlog';
import { USER_JOB_MAX, isDeclaredJob, jobProblems, jobRatchetErrors } from './job';

const valid = (): ToolJob => ({
  intent: 'analyze',
  userJob: 'Count words in pasted text that never leaves this device.',
  repeatability: 'high',
  interactionDepth: 'low',
  privacyValue: 'high',
  aiSubstitutability: 'medium',
  browserOnly: true,
});

describe('jobProblems', () => {
  it('accepts a complete job', () => {
    expect(jobProblems(valid())).toEqual([]);
    expect(isDeclaredJob(valid())).toBe(true);
  });

  it('rejects a missing job', () => {
    expect(jobProblems(undefined)).toEqual(['missing job']);
    expect(isDeclaredJob(undefined)).toBe(false);
  });

  it('rejects an intent outside ToolIntent and a non-sentence userJob', () => {
    const job = valid();
    const broken = { ...job, intent: 'seo-page' as ToolJob['intent'], userJob: 'Count words.' };
    const problems = jobProblems(broken);
    expect(problems).toContain('intent is not a ToolIntent');
    expect(problems.some(p => p.startsWith('userJob'))).toBe(true);
    expect(jobProblems({ ...job, intent: 1 as unknown as ToolJob['intent'] })).toContain('intent is not a ToolIntent');
    expect(jobProblems({ ...job, userJob: undefined as unknown as string }).some(p => p.startsWith('userJob'))).toBe(true);
  });

  it('rejects a userJob that is too long, has no period, or contains an em dash', () => {
    expect(jobProblems({ ...valid(), userJob: `${'word '.repeat(80)}.` }).some(p => p.startsWith('userJob'))).toBe(true);
    expect(jobProblems({ ...valid(), userJob: 'Count words in pasted text that never leaves this device' }).some(p => p.startsWith('userJob'))).toBe(true);
    const dashed = `Count words in pasted text that never leaves this device${'\u2014'}locally.`;
    expect(dashed.length).toBeLessThanOrEqual(USER_JOB_MAX);
    expect(jobProblems({ ...valid(), userJob: dashed }).some(p => p.startsWith('userJob'))).toBe(true);
  });

  it('rejects a degree outside the scale and a non-boolean browserOnly', () => {
    const job = {
      ...valid(),
      repeatability: 'sometimes' as ToolJob['repeatability'],
      interactionDepth: 'sometimes' as ToolJob['interactionDepth'],
      privacyValue: 'sometimes' as ToolJob['privacyValue'],
      aiSubstitutability: 'sometimes' as ToolJob['aiSubstitutability'],
      browserOnly: 'yes' as unknown as boolean,
    };
    const problems = jobProblems(job);
    expect(problems).toEqual([
      'repeatability must be low, medium, or high',
      'interactionDepth must be low, medium, or high',
      'privacyValue must be low, medium, or high',
      'aiSubstitutability must be low, medium, or high',
      'browserOnly must be true or false',
    ]);
  });
});

describe('jobRatchetErrors', () => {
  it('passes the registry today, and the backlog is exactly the tools without a job', () => {
    expect(jobRatchetErrors(tools, JOB_BACKLOG)).toEqual([]);
    const without = tools.filter(t => !isDeclaredJob(t.job)).map(t => t.slug).sort();
    expect([...JOB_BACKLOG].sort()).toEqual(without);
  });

  it('the backlog is frozen at 166 and can only shrink', () => {
    // Raise this number never. Lower it in the same change that gives a backlog tool its job.
    expect(JOB_BACKLOG.length).toBeLessThanOrEqual(166);
    expect(Object.isFrozen(JOB_BACKLOG)).toBe(true);
  });

  it('fails a new tool without a usable job', () => {
    const errors = jobRatchetErrors(
      [{ slug: 'new-tool' }, { slug: 'lazy-tool', job: { ...valid(), userJob: 'TODO.' } }],
      [],
    );
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('Tool "new-tool" has no usable job');
    expect(errors[1]).toContain('Tool "lazy-tool"');
  });

  it('passes a new tool with a job and a backlog tool without one', () => {
    expect(jobRatchetErrors([{ slug: 'new-tool', job: valid() }, { slug: 'old-tool' }], ['old-tool'])).toEqual([]);
  });

  it('fails a backlog tool that gained a job until it leaves the backlog', () => {
    const errors = jobRatchetErrors([{ slug: 'old-tool', job: valid() }], ['old-tool']);
    expect(errors).toEqual([expect.stringContaining('Remove it from src/lib/tools/job-backlog.ts')]);
  });

  it('fails stale and duplicate backlog entries', () => {
    const errors = jobRatchetErrors([{ slug: 'old-tool' }], ['old-tool', 'old-tool', 'gone-tool']);
    expect(errors).toEqual([
      expect.stringContaining('lists "old-tool" twice'),
      expect.stringContaining('lists "gone-tool", which is not in the registry'),
    ]);
  });
});
