import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import type { ToolJob } from '@data/types';
import { JOB_BACKLOG } from './job-backlog';
import { USER_JOB_MAX, isDeclaredJob, jobProblems, jobRatchetErrors } from './job';

function valid(): ToolJob {
  return {
    intent: 'analyze',
    userJob: 'Count words in pasted text that never leaves this device.',
    repeatability: 'high',
    interactionDepth: 'low',
    privacyValue: 'high',
    aiSubstitutability: 'medium',
    browserOnly: true,
  };
}

describe('jobProblems', () => {
  it('accepts a complete job', () => {
    expect(jobProblems(valid())).toEqual([]);
    expect(isDeclaredJob(valid())).toBe(true);
  });

  it('treats null and undefined as missing, and any other non-object as the wrong shape', () => {
    expect(jobProblems(undefined)).toEqual(['missing job']);
    expect(jobProblems(null)).toEqual(['missing job']);
    expect(isDeclaredJob(undefined)).toBe(false);
    expect(jobProblems('analyze')).toEqual(['job must be an object']);
    expect(jobProblems([])).toEqual(['job must be an object']);
  });

  it('rejects an intent outside ToolIntent and a userJob that is not one sentence', () => {
    const job = valid();
    const problems = jobProblems({ ...job, intent: 'seo-page', userJob: 'Count words.' });
    expect(problems).toContain('intent is not a ToolIntent');
    expect(problems.some(p => p.startsWith('userJob'))).toBe(true);
    expect(jobProblems({ ...job, intent: 1 })).toContain('intent is not a ToolIntent');
    expect(jobProblems({ ...job, userJob: undefined }).some(p => p.startsWith('userJob'))).toBe(true);
  });

  it('rejects a userJob that is too long, has no period, has two sentences, or contains an em dash', () => {
    expect(jobProblems({ ...valid(), userJob: `${'word '.repeat(80)}.` }).some(p => p.startsWith('userJob'))).toBe(true);
    expect(jobProblems({ ...valid(), userJob: 'Count words in pasted text that never leaves this device' }).some(p => p.startsWith('userJob'))).toBe(true);
    expect(jobProblems({ ...valid(), userJob: 'Count words in pasted text. Then count them again on this device.' }).some(p => p.startsWith('userJob'))).toBe(true);
    const dashed = `Count words in pasted text that never leaves this device${'\u2014'}locally.`;
    expect(dashed.length).toBeLessThanOrEqual(USER_JOB_MAX);
    expect(jobProblems({ ...valid(), userJob: dashed }).some(p => p.startsWith('userJob'))).toBe(true);
  });

  it('rejects a degree outside the scale and a non-boolean browserOnly', () => {
    const problems = jobProblems({
      ...valid(),
      repeatability: 'sometimes',
      interactionDepth: 'sometimes',
      privacyValue: 'sometimes',
      aiSubstitutability: 'sometimes',
      browserOnly: 'yes',
    });
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
  it('passes the registry today, and the backlog is exactly the tools with no job', () => {
    expect(jobRatchetErrors(tools, JOB_BACKLOG)).toEqual([]);
    const absent = tools.filter(t => t.job == null).map(t => t.slug).sort();
    expect([...JOB_BACKLOG].sort()).toEqual(absent);
    for (const tool of tools) {
      if (tool.job != null) expect(isDeclaredJob(tool.job), tool.slug).toBe(true);
    }
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

  it('fails a backlog tool whose job is present but unusable', () => {
    const errors = jobRatchetErrors([{ slug: 'old-tool', job: { ...valid(), userJob: 'TODO.' } }], ['old-tool']);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('Tool "old-tool" has no usable job');
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
