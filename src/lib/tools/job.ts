// The tool-job ratchet.
//
// A page exists because a user job exists (docs/tool-design.md). `job` on ToolConfig is how a
// tool says so. It is not rendered and it is not a public score.
//
// Two states are legal:
//   - no `job`, and the slug is on the frozen backlog in ./job-backlog.ts (shipped before the field);
//   - a `job` that passes isDeclaredJob(), and the slug is not on that backlog.
// A present `job` that fails the shape check fails the build either way. The backlog only excuses
// absence. It only shrinks: a tool that gains a usable job leaves the list in the same change.
// validate-registry calls jobRatchetErrors().

import { TOOL_DEGREES, TOOL_INTENTS, type ToolDegree, type ToolIntent, type ToolJob } from '@data/types';

/** One sentence, long enough to name the job, short enough to stay one sentence. */
export const USER_JOB_MIN = 40;
export const USER_JOB_MAX = 180;

const EM_DASH = '\u2014';
const USER_JOB_RULE =
  `userJob must be one sentence of ${USER_JOB_MIN}-${USER_JOB_MAX} characters, ending in a period, with no em dash`;

const INTENTS: ReadonlySet<string> = new Set(TOOL_INTENTS);
const DEGREES: ReadonlySet<string> = new Set(TOOL_DEGREES);

const DEGREE_FIELDS = ['repeatability', 'interactionDepth', 'privacyValue', 'aiSubstitutability'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIntent(value: unknown): value is ToolIntent {
  return typeof value === 'string' && INTENTS.has(value);
}

function isDegree(value: unknown): value is ToolDegree {
  return typeof value === 'string' && DEGREES.has(value);
}

/** One period, and it is the last character. A second sentence, or a trailing abbreviation, fails. */
function isOneSentence(sentence: string): boolean {
  return (
    sentence.length >= USER_JOB_MIN &&
    sentence.length <= USER_JOB_MAX &&
    sentence.endsWith('.') &&
    sentence.indexOf('.') === sentence.length - 1 &&
    !sentence.includes(EM_DASH)
  );
}

/**
 * What is wrong with `job`, or [] when it is fit to ship.
 * `null` and `undefined` are one problem (`missing job`). Anything else that is not a plain
 * object, or a plain object with a bad field, lists what failed.
 */
export function jobProblems(job: unknown): string[] {
  if (job == null) return ['missing job'];
  if (!isRecord(job)) return ['job must be an object'];

  const problems: string[] = [];
  if (!isIntent(job.intent)) problems.push('intent is not a ToolIntent');
  if (typeof job.userJob !== 'string' || !isOneSentence(job.userJob.trim())) problems.push(USER_JOB_RULE);
  for (const key of DEGREE_FIELDS) {
    if (!isDegree(job[key])) problems.push(`${key} must be low, medium, or high`);
  }
  if (typeof job.browserOnly !== 'boolean') problems.push('browserOnly must be true or false');
  return problems;
}

/** True when `job` is present and each field is in range. */
export function isDeclaredJob(job: unknown): job is ToolJob {
  return job != null && jobProblems(job).length === 0;
}

type JobTool = { slug: string; job?: unknown };

/**
 * Errors for validate-registry:
 *   - a tool NOT on the backlog with no job (the rule for every new tool);
 *   - any tool whose job is present but unusable, backlog or not;
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
    const absent = tool.job == null;
    if (problems.length > 0 && !(listed.has(tool.slug) && absent)) {
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
