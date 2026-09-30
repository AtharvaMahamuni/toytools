// The tool-job ratchet.
//
// A page exists because a user job exists (docs/tool-design.md). `job` on ToolConfig is how a
// tool says so, in a shape the rest of the system can read. It is not rendered and it is not a
// public score.
//
// The rule: every NEW tool sets a job that passes isDeclaredJob(). This list's sibling, the
// frozen backlog in ./job-backlog.ts, is the catalog that shipped before the field. The backlog
// only shrinks. validate-registry calls jobRatchetErrors().

import { TOOL_DEGREES, TOOL_INTENTS, type ToolDegree, type ToolIntent, type ToolJob } from '@data/types';

/** One sentence, long enough to name the job, short enough to stay one sentence. */
export const USER_JOB_MIN = 40;
export const USER_JOB_MAX = 180;

const EM_DASH = '\u2014';

function isIntent(value: unknown): value is ToolIntent {
  return typeof value === 'string' && (TOOL_INTENTS as readonly string[]).includes(value);
}

function isDegree(value: unknown): value is ToolDegree {
  return typeof value === 'string' && (TOOL_DEGREES as readonly string[]).includes(value);
}

/**
 * What is wrong with `job`, or [] when it is fit to ship.
 * A missing job is one problem (`missing job`). A present job lists each field that fails.
 */
export function jobProblems(job: Partial<ToolJob> | undefined): string[] {
  if (!job) return ['missing job'];
  const problems: string[] = [];
  if (!isIntent(job.intent)) problems.push('intent is not a ToolIntent');

  const sentence = typeof job.userJob === 'string' ? job.userJob.trim() : '';
  const sentenceOk =
    sentence.length >= USER_JOB_MIN &&
    sentence.length <= USER_JOB_MAX &&
    sentence.endsWith('.') &&
    !sentence.includes(EM_DASH);
  if (!sentenceOk) {
    problems.push(
      `userJob must be one sentence of ${USER_JOB_MIN}-${USER_JOB_MAX} characters, ending in a period, with no em dash`,
    );
  }

  const degrees: readonly (keyof ToolJob)[] = [
    'repeatability',
    'interactionDepth',
    'privacyValue',
    'aiSubstitutability',
  ];
  for (const key of degrees) {
    if (!isDegree(job[key])) problems.push(`${key} must be low, medium, or high`);
  }
  if (typeof job.browserOnly !== 'boolean') problems.push('browserOnly must be true or false');
  return problems;
}

/** True when `job` is present and each field is in range. */
export function isDeclaredJob(job: Partial<ToolJob> | undefined): boolean {
  return jobProblems(job).length === 0;
}

type JobTool = { slug: string; job?: ToolJob };

/**
 * Errors for validate-registry:
 *   - a tool NOT on the backlog whose job is missing or unusable (the rule for every new tool);
 *   - a tool ON the backlog that now has a usable job (remove it: the backlog only shrinks);
 *   - a backlog slug that is not in the registry, or is listed twice.
 */
export function jobRatchetErrors(tools: readonly JobTool[], backlog: readonly string[]): string[] {
  const errors: string[] = [];
  const listed = new Set<string>();
  for (const slug of backlog) {
    if (listed.has(slug)) errors.push(`job backlog lists "${slug}" twice (src/lib/tools/job-backlog.ts)`);
    listed.add(slug);
  }

  const known = new Set(tools.map(t => t.slug));
  for (const tool of tools) {
    const problems = jobProblems(tool.job);
    if (!listed.has(tool.slug) && problems.length > 0) {
      errors.push(
        `Tool "${tool.slug}" has no usable job (${problems.join('; ')}). ` +
          'Every new tool sets `job` on its config (a simulation sets it on its manifest): ' +
          'intent, userJob, repeatability, interactionDepth, privacyValue, aiSubstitutability, browserOnly. ' +
          'See docs/tool-design.md.',
      );
    }
    if (listed.has(tool.slug) && problems.length === 0) {
      errors.push(
        `Tool "${tool.slug}" now has a declared job. Remove it from ` +
          'src/lib/tools/job-backlog.ts in the same change (the backlog only shrinks).',
      );
    }
  }
  for (const slug of listed) {
    if (!known.has(slug)) {
      errors.push(`job backlog lists "${slug}", which is not in the registry. Remove it from src/lib/tools/job-backlog.ts.`);
    }
  }
  return errors;
}
