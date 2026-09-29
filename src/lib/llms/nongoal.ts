// The citation.nonGoal ratchet for llms-full.txt's "Does not:" line.
//
// A nonGoal is SPECIFIC when it says something about this tool that is not true of every tool on
// the site. "Call an AI model" is true of all of them (it is the fallback doesNotLine() prints),
// so on its own, or reworded as "send it to an AI model", it is not specific. Naming a real limit
// first and adding the AI clause after ("verify the signature or send the token to an AI model")
// is specific, and that is the shape the 17 authored nonGoals already use.

import type { Tool } from '@data/types';

/** Normalised forms that only restate the site-wide "no AI model" fact. */
const GENERIC_NON_GOALS = new Set([
  'call an ai model',
  'use an ai model',
  'run an ai model',
  'call a model',
  'run a model',
  'send it to an ai model',
  'send the text to an ai model',
  'send the input to an ai model',
  'send your data to an ai model',
]);

function normalise(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!]+$/, '');
}

/** True when `nonGoal` is present and says more than the site-wide default. */
export function isSpecificNonGoal(nonGoal: string | undefined): boolean {
  if (!nonGoal) return false;
  const text = normalise(nonGoal);
  return text.length > 0 && !GENERIC_NON_GOALS.has(text);
}

type CitedTool = Pick<Tool, 'slug' | 'citation'>;

/**
 * Errors for validate-registry:
 *   - a tool NOT on the backlog without a specific nonGoal (the rule for every new tool);
 *   - a tool ON the backlog that now has one (remove it: the backlog only shrinks);
 *   - a backlog slug that is not in the registry, or is listed twice.
 */
export function nonGoalRatchetErrors(tools: readonly CitedTool[], backlog: readonly string[]): string[] {
  const errors: string[] = [];
  const listed = new Set<string>();
  for (const slug of backlog) {
    if (listed.has(slug)) errors.push(`nonGoal backlog lists "${slug}" twice (src/lib/llms/nongoal-backlog.ts)`);
    listed.add(slug);
  }

  const known = new Set(tools.map(t => t.slug));
  for (const tool of tools) {
    const specific = isSpecificNonGoal(tool.citation?.nonGoal);
    if (!listed.has(tool.slug) && !specific) {
      errors.push(
        `Tool "${tool.slug}" has no specific citation.nonGoal, so llms-full.txt prints the generic ` +
          '"Does not: Call an AI model." for it. Every new tool sets one: `citation: { problem, nonGoal }` ' +
          'in config.ts (a simulation sets it on its manifest), naming what THIS tool does not do. ' +
          'See CLAUDE.md, "LLM files".',
      );
    }
    if (listed.has(tool.slug) && specific) {
      errors.push(
        `Tool "${tool.slug}" now has a specific citation.nonGoal. Remove it from ` +
          'src/lib/llms/nongoal-backlog.ts in the same change (the backlog only shrinks).',
      );
    }
  }
  for (const slug of listed) {
    if (!known.has(slug)) {
      errors.push(`nonGoal backlog lists "${slug}", which is not in the registry. Remove it from src/lib/llms/nongoal-backlog.ts.`);
    }
  }
  return errors;
}
