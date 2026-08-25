---
name: x-content
description: Write ToyTools' X (Twitter) content - cluster threads that send readers into a guide, gotcha posts built from a tool's craft touch, demand probes that feed the research roadmap, and the branded cards that go with them. Use when asked to write a post or thread, plan the X calendar, turn a tool or topic into social content, make a social card, or decide what to post next. Also covers turning engagement back into RIE evidence.
---

# X content

The account is not the asset. The library of pages is the asset, and X is a channel that feeds
people, and ideas, into it. Nothing here is justified as a Google ranking lever, because it is not
one: the links are nofollowed and wrapped in `t.co`, and follower count ranks nothing.

> **The test, before anything is published.** Not "will this post improve our SEO?" but
> **"will this post help more people discover a topic ToyTools can permanently serve?"**

Full model, including what X is and is not worth here:
`docs/analysis/2026-08-25-x-content-strategy.md`.

## Start here, always

```sh
npm run x:generate                     # derive every draft from the registry
npm run x:generate -- --kind gotcha    # one kind
npm run x:generate -- --slug base64-encoder-decoder
```

Drafts land in `brand/social/x/queue/` (gitignored, regenerated in seconds). **Never write a post
from a blank page.** Every draft is already sourced to a registry field, already length-checked the
way X counts, and already through the site's own voice rules. Starting fresh throws all of that
away and risks a claim the site does not make.

Then fill the slots. A `[[slot]]` is the one thing the generator will not do: connective prose,
which is a judgement about what a reader already knows.

## The four kinds, and what each is for

| kind | lands on | the job |
|---|---|---|
| **thread** | the **guide** | explain a topic well enough that someone cites it |
| **gotcha** | the tool | one specific failure, its cause, and what handles it |
| **probe** | nothing, deliberately | find out which problem people actually have |
| **ship** | the new tool | say what it lets you do. Capped, not every release |

### Threads land on the guide, never on the tool

This is the rule most worth not breaking. A thread that lands on a tool page spends its traffic on
one answer and the reader leaves. The guide holds the topic, links the siblings, and is the page
somebody can cite when they write about it later, which is the only outcome that reaches search
directly. Put the tool link in the last post, under the guide link, for people who just want the
answer.

The generated beats come from fields a guide already needed: `summary` defines, `commonMistakes`
carries the distinction people get wrong, `realWorldUseCases` says when it matters. Two slots are
yours:

- **The hook.** One line naming the thing people get wrong. Not "a thread about Base64".
- **The worked example.** Real values. The guide already has one; reuse it rather than inventing a
  second set of numbers that has to be right.

### Gotchas are the daily voice

75 tools declare a craft touch, each a specific failure the tool handles and its incumbents do not.
It is the most publishable writing in the repo because `check:craft` already holds it to a standard.

**But `craft.solves` is written for the next maintainer, not for a reader.** "Instead of the decode
the user came for" is precise, correct, and talks about the user in the third person. Rewrite it in
second person, keep the cause, and drop the comparison to other tools: the reader does not care
what other calculators do, they care that their encoder just refused a correct answer. The exact
sentence still gets published, on the card.

### Probes link nothing

That is not an oversight. A probe carrying a call to action measures the call to action rather than
the interest, and the measurement is the entire reason to post it. End on a real question.

## Cards

```sh
npm run x:cards                        # every card in the current queue
npm run x:cards -- --id gotcha-base64-encoder-decoder
```

1600x900, on the site's paper, type and gold, from the shared tokens in `scripts/brand/render.ts`.
A card is declared by its draft, so a post and its image cannot say different things. A card whose
text still holds a `[[slot]]` is skipped rather than rendered with the instruction on it.

Attach a card to a gotcha (it carries the exact sentence the post had to shorten) and to a thread
(it is the cover). A probe gets none: it is a question, and a branded image makes it look like an
ad for the answer.

## Turning engagement into evidence

This is the part that makes the account worth running, and the part that is easiest to do wrong.

When a probe item lands, that is a **demand signal Search Console cannot produce**, because Search
Console only reports demand that already exists as query volume. Write it into
`research/datasets/*.json` as evidence and re-run the RIE:

```sh
npm run research:next
```

**Never hand-edit a report, and never build on a hunch because a post did well.** The standing rule
in `CLAUDE.md` holds here without exception: to change a recommendation, change the evidence. One
probe is not a dataset, and a single popular reply is an anecdote.

## Rules that are not style preferences

- **Never invent a claim about a tool.** If it is not in `config.ts`, `knowledge.ts` or the guide,
  it does not go in a post. The generator cannot break this rule; a human writing freehand can.
- **Never link a page that does not exist.** `x:generate` checks every URL against the registry.
  Adding a link by hand after generating skips that check.
- **No em-dashes.** The site's hard rule, absolute in authored content, and the gate enforces it on
  drafts too.
- **One voice.** The banned-phrase lists come from `seo-engine/config/writing-rules.json`, the same
  file `seo:gate` uses on guides. Do not restate them in a post and do not work around them.
- **Nothing here posts.** There is no X credential in this repo and none should be added: an account
  that auto-posts cannot notice what its probes are measuring.

## Validating before you post

```sh
npm run x:generate -- --check    # non-zero exit if any draft fails the voice gate
```

A failing draft is held back rather than written to the queue, so anything in the queue has cleared
the same bar the site's prose clears. If the gate rejects something, **fix the source field or the
template, not the gate.** A rejection has twice pointed at a real defect in an authored
`knowledge.ts` file rather than at the draft.

## References

- `references/writing-posts.md` - filling slots, hooks that are not clickbait, thread shape
- `docs/analysis/2026-08-25-x-content-strategy.md` - the model and what it refuses to claim
- `brand/README.md` - the account assets and how they are regenerated
