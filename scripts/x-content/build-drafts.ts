// Derives X drafts from the registry. No draft here is invented: every factual line traces to a
// field somebody authored and a validator already checks, which is the only reason this can run
// unattended without the account making a claim the site does not make.
//
// Four kinds, in the order the strategy ranks them (docs/analysis/2026-08-25-x-content-strategy.md):
//
//   thread  a topic explained, landing on the GUIDE. The cluster's front door, and the only kind
//           that reliably earns a link from someone else, which is the one thing that moves search.
//   gotcha  one tool's craft touch. 75 of these exist because 75 tools declare a craft, and each
//           `solves` is already a specific failure with a cause -- the most publishable prose in
//           the repo, written to a standard a gate enforces.
//   probe   a list of real problems in one area, published to find out which one people react to.
//           This is the instrument, not the content: its output is evidence for the RIE.
//   ship    a release note. Generated last and capped, because an account that only announces
//           itself gives nobody a reason to follow it.
//
// The generator writes DRAFTS. A `[[slot]]` marks connective prose it cannot write, because that
// is a judgement about what a reader already knows. Filling them is the skill's job.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { tools } from '../../src/data/registry';
import { categories } from '../../src/data/categories';
import { KNOWLEDGE } from '../../src/lib/knowledge/registry';
import { faqsByToolSlug } from '../../src/data/faq-registry';
import type { Draft, DraftPost } from './types';

const SITE = 'https://toytoolsapp.com';
const ROOT = path.resolve(process.cwd());

const segmentOf = (categorySlug: string): string =>
  categories.find((c) => c.slug === categorySlug)?.segment ?? categorySlug;

export const toolUrl = (slug: string, categorySlug: string): string =>
  `/tool/${segmentOf(categorySlug)}/${slug}/`;

export const guideUrl = (slug: string, guideCategorySlug: string): string =>
  `/guide/${guideCategorySlug}/${slug}/`;

/** Every route a draft is allowed to link, for the validator's dead-link check. */
export function knownUrls(): Set<string> {
  const urls = new Set<string>(['/', '/about/', '/changelog/', '/feedback/', '/privacy/']);
  for (const t of tools) {
    urls.add(toolUrl(t.slug, t.categorySlug));
    if (t.guide) urls.add(guideUrl(t.guide.slug, t.guide.categorySlug));
    urls.add(`/category/${t.categorySlug}/`);
  }
  return urls;
}

const post = (index: number, text: string, sources: string[]): DraftPost => ({
  index,
  text: text.trim().replace(/\n{3,}/g, '\n\n'),
  sources,
});


// ── gotcha ───────────────────────────────────────────────────────────────────────────────────
//
// Text-only by default. The post carries the failure; a card is a rare supplement, not a paired
// asset every gotcha gets. `craft.solves` runs to a median of 230 characters and a maximum of
// 366 -- far past what a minimal card should carry -- so the card's `body` is left a `[[slot]]`
// rather than auto-filled with the full sentence. `x:cards` skips any card whose text still
// holds a slot, so nothing renders unless a human decides this specific post earns the extra
// reach and writes a short phrase for it, not a paragraph.
//
// The post body is also a slot rather than the sentence itself, because `craft.solves` is written
// for the next maintainer, not a reader: "instead of the decode the user came for" is precise and
// correct and talks about the user in the third person, which is an internal note, not a post.
function gotchaDrafts(): Draft[] {
  const drafts: Draft[] = [];

  for (const tool of tools) {
    if (!tool.craft) continue;
    const url = `${SITE}${toolUrl(tool.slug, tool.categorySlug)}`;

    drafts.push({
      id: `gotcha-${tool.slug}`,
      kind: 'gotcha',
      subject: tool.name,
      landing: url,
      rationale: `${tool.craft.kind} touch "${tool.craft.id}" -- a failure the tool handles and its incumbents do not`,
      posts: [
        post(
          1,
          `[[the failure in the reader's own words, second person, one or two lines. ` +
            `Keep the cause, drop the comparison to other tools. Material: ${tool.craft.solves}]]\n\n${url}`,
          [`src/tools/*/${tool.slug}/config.ts -> craft.solves`],
        ),
      ],
      card: {
        template: 'gotcha',
        eyebrow: tool.craft.kind,
        headline: tool.name,
        body: `[[only if this post earns extra reach: the failure in one short phrase, not the full sentence. Material: ${tool.craft.solves}]]`,
      },
    });
  }

  return drafts;
}

// ── thread ───────────────────────────────────────────────────────────────────────────────────
//
// Only tools carrying knowledge AND a guide qualify. A thread that lands on a bare tool page wastes
// the traffic: the tool answers one question and the reader leaves, whereas the guide is the page
// that holds a topic, links the siblings and can be cited by somebody writing about it later.
//
// The beats come from fields that already exist because a guide needed them: the summary defines,
// commonMistakes carries the distinction people actually get wrong, realWorldUseCases says when it
// matters, commonQuestions is the FAQ the thread can promise to answer.
//
// No card. A thread is seven posts of text explaining a topic; a cover image adds a click before
// the reader reaches any of it and is exactly the text-dense-image shape this account avoids. The
// thread itself is the content.
function threadDrafts(): Draft[] {
  const drafts: Draft[] = [];

  for (const tool of tools) {
    const k = KNOWLEDGE.get(tool.slug);
    if (!k || !tool.guide) continue;
    if (!k.commonMistakes?.length || !k.realWorldUseCases?.length) continue;

    const gUrl = `${SITE}${guideUrl(tool.guide.slug, tool.guide.categorySlug)}`;
    const tUrl = `${SITE}${toolUrl(tool.slug, tool.categorySlug)}`;
    const topic = k.primaryConcepts[0] ?? tool.name;
    const mistakes = k.commonMistakes.slice(0, 2);
    const uses = k.realWorldUseCases.slice(0, 2);

    const posts: DraftPost[] = [
      post(
        1,
        `[[hook: the one thing people get wrong about ${topic}, in a line. Material below.]]\n\n${topic}, explained.`,
        [`knowledge.ts -> primaryConcepts[0]`],
      ),
      post(2, `What it is:\n\n${k.summary}`, ['knowledge.ts -> summary']),
      post(
        3,
        `[[why it exists: the problem it was invented for. Not in the registry, write it.]]`,
        ['judgement'],
      ),
      post(
        4,
        `The part people get wrong:\n\n${mistakes[0]}`,
        ['knowledge.ts -> commonMistakes[0]'],
      ),
      post(
        5,
        `[[a worked example with real values. The guide has one, reuse it rather than inventing.]]`,
        [`Guide.astro for ${tool.slug}`],
      ),
      post(6, `Where it actually comes up:\n\n${uses.map((u) => `- ${u}`).join('\n')}`, [
        'knowledge.ts -> realWorldUseCases',
      ]),
      post(
        7,
        `The long version, with the edge cases:\n${gUrl}\n\nThe tool, if you just need the answer:\n${tUrl}`,
        ['guide + tool routes'],
      ),
    ];

    if (mistakes[1]) {
      posts.splice(5, 0, post(5, `And the second one:\n\n${mistakes[1]}`, ['knowledge.ts -> commonMistakes[1]']));
      posts.forEach((p, i) => (p.index = i + 1));
    }

    drafts.push({
      id: `thread-${tool.slug}`,
      kind: 'thread',
      subject: tool.name,
      landing: gUrl,
      rationale: `cluster thread for ${topic}: tool + guide + ${(faqsByToolSlug[tool.slug] ?? []).length} FAQ entries already exist, so the thread has somewhere permanent to send people`,
      posts,
    });
  }

  return drafts;
}

// ── probe ────────────────────────────────────────────────────────────────────────────────────
//
// The demand-discovery instrument. One post lists real failures drawn from several tools in one
// category; whichever item draws the reaction is a signal about what people care about, and that
// signal is worth more than the post's own reach. It links nothing on purpose: a probe carrying a
// CTA measures the CTA instead of the interest.
//
// Items are authored commonMistakes rather than invented annoyances, so a probe cannot accidentally
// test demand for something the site has no business building.
function probeDrafts(): Draft[] {
  const byCategory = new Map<string, { tool: string; mistake: string }[]>();

  for (const tool of tools) {
    const k = KNOWLEDGE.get(tool.slug);
    const mistake = k?.commonMistakes?.[0];
    if (!mistake) continue;
    const list = byCategory.get(tool.categorySlug) ?? [];
    list.push({ tool: tool.name, mistake });
    byCategory.set(tool.categorySlug, list);
  }

  const drafts: Draft[] = [];
  for (const [categorySlug, items] of byCategory) {
    if (items.length < 5) continue;
    const category = categories.find((c) => c.slug === categorySlug);
    const picked = items.slice(0, 5);

    drafts.push({
      id: `probe-${categorySlug}`,
      kind: 'probe',
      subject: category?.name ?? categorySlug,
      landing: '',
      rationale:
        'demand probe: the item that draws replies becomes evidence in research/datasets, not a guess about what to build',
      posts: [
        post(
          1,
          `Five ${(category?.name ?? categorySlug).toLowerCase()} problems that cost people an afternoon:\n\n` +
            picked.map((p, i) => `${i + 1}. [[one line, from: ${p.mistake}]]`).join('\n') +
            `\n\nWhich of these got you most recently?`,
          picked.map((p) => `knowledge.ts -> commonMistakes[0] (${p.tool})`),
        ),
      ],
    });
  }

  return drafts;
}

// ── ship ─────────────────────────────────────────────────────────────────────────────────────
//
// Read from the changelog's top section only. The cap is the point: 41 releases in the log and a
// release most days means an account posting every one of them says nothing else.
//
// The one kind that keeps a default card, because a release is the one thing genuinely worth a
// glance rather than a read, and its card is already the minimal shape this account wants
// everywhere: a headline and one slot for a single sentence, never the full authored text.
function shipDrafts(): Draft[] {
  const changelog = readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const section = changelog.split(/^## \[/m)[1];
  if (!section) return [];

  const version = section.split(']')[0] ?? 'unreleased';
  const added = section.split('### Added')[1]?.split('###')[0] ?? '';
  const bullet = added.split(/^- /m)[1];
  if (!bullet) return [];

  const headline = (bullet.replace(/\*\*/g, '').split(/[.,]/)[0] ?? bullet).trim();
  const urlMatch = bullet.match(/`(\/tool\/[^`]+)`/);
  const url = urlMatch ? `${SITE}${urlMatch[1]}` : '';

  return [
    {
      id: `ship-${version}`,
      kind: 'ship',
      subject: headline,
      landing: url,
      rationale: `newest entry in CHANGELOG.md (${version}). Post the thing it does, not the version number.`,
      posts: [
        post(
          1,
          `[[what it lets you do, in a line. Not "new tool shipped": ${headline}]]${url ? `\n\n${url}` : ''}`,
          [`CHANGELOG.md -> ${version}`],
        ),
      ],
      ...(url
        ? {
            card: {
              template: 'ship' as const,
              eyebrow: 'new',
              headline,
              body: '[[one sentence on what it does]]',
            },
          }
        : {}),
    },
  ];
}

export function buildDrafts(): Draft[] {
  return [...threadDrafts(), ...gotchaDrafts(), ...probeDrafts(), ...shipDrafts()];
}
