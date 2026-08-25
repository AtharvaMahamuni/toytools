// The voice and format gate for X drafts.
//
// The site already owns a written voice, enforced on every guide and FAQ by seo:gate against
// seo-engine/config/writing-rules.json. An X account that writes differently is a second voice
// for the same product, so this reads THE SAME rule files rather than restating them: change the
// site's banned-phrase list and the account inherits it on the next run.
//
// The em-dash ban is the one rule copied rather than read, because it lives in CLAUDE.md as prose
// and nowhere as data. It is absolute: seo:gate fails on any occurrence in authored content.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Draft, ValidationIssue } from './types';

const ROOT = path.resolve(process.cwd());

const writingRules = JSON.parse(
  readFileSync(path.join(ROOT, 'seo-engine/config/writing-rules.json'), 'utf8'),
) as Record<string, string[]>;

const intelRules = JSON.parse(
  readFileSync(path.join(ROOT, 'seo-engine/config/content-intelligence-rules.json'), 'utf8'),
) as Record<string, string[]>;

/**
 * X counts a URL as 23 characters regardless of its real length (t.co wraps every link), so a
 * naive .length over-counts a post carrying a toytoolsapp.com URL by about 15 and would reject
 * posts that publish fine. Measured the way X measures.
 */
const TCO_LENGTH = 23;
export const X_LIMIT = 280;

export function postLength(text: string): number {
  const withoutSlots = text.replace(/\[\[[^\]]*\]\]/g, '');
  const urls = withoutSlots.match(/https?:\/\/\S+/g) ?? [];
  const bare = withoutSlots.replace(/https?:\/\/\S+/g, '');
  return [...bare].length + urls.length * TCO_LENGTH;
}

/** Every phrase list the site bans, merged. Sourced, not restated. */
const BANNED: { rule: string; phrases: string[] }[] = [
  { rule: 'aiTellPhrases', phrases: writingRules.aiTellPhrases ?? [] },
  { rule: 'fluffPhrases', phrases: writingRules.fluffPhrases ?? [] },
  { rule: 'boringPhrases', phrases: writingRules.boringPhrases ?? [] },
  { rule: 'jargonWords', phrases: writingRules.jargonWords ?? [] },
  { rule: 'thinContentPhrases', phrases: intelRules.thinContentPhrases ?? [] },
];

/**
 * A banned phrase matches only as whole words, and never as the tail of a hyphenated compound.
 *
 * A plain substring test reads "distraction-free online notepad" as the thin-content phrase
 * "free online" and rejects a summary that is doing nothing wrong. The lookarounds exclude a
 * hyphen on either side, so the compound word is one word and "free online" is not in it.
 */
const phraseRegex = (phrase: string): RegExp =>
  new RegExp(`(?<![\\w-])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')}(?![\\w-])`, 'i');

export function validate(drafts: Draft[], knownUrls: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const draft of drafts) {
    for (const post of draft.posts) {
      const push = (rule: string, detail: string) =>
        issues.push({ draftId: draft.id, postIndex: post.index, rule, detail });

      const len = postLength(post.text);
      if (len > X_LIMIT) push('length', `${len} chars, limit ${X_LIMIT}`);

      // The site's hard rule. An em-dash in a post is the same failure seo:gate catches in a guide.
      if (/[—–]/.test(post.text)) push('em-dash', 'contains an em-dash or en-dash');

      for (const { rule, phrases } of BANNED) {
        for (const phrase of phrases) {
          if (phraseRegex(phrase).test(post.text)) push(rule, `contains "${phrase}"`);
        }
      }

      // A post that links a page the registry does not have is the one failure that damages
      // the account rather than just reading badly, so it is checked against the real routes.
      for (const url of post.text.match(/https:\/\/toytoolsapp\.com\/\S*/g) ?? []) {
        const cleaned = url.replace(/[.,)]+$/, '');
        const relPath = cleaned.replace('https://toytoolsapp.com', '');
        if (!knownUrls.has(relPath)) push('dead-link', `${cleaned} is not a route in the registry`);
      }

      if (!post.sources.length) push('unsourced', 'no registry field backs this post');
    }
  }

  return issues;
}
