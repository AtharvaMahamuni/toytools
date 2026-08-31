---
name: x-content
description: Suggest ToyTools' X (Twitter) posts conversationally - ask for an idea and get a handful of concrete, sourced candidates (thread, gotcha, probe or ship) with image guidance, then a ready-to-paste post for the one picked. The user posts it themselves; nothing here posts automatically. Use when asked for a post idea, what to post next, to turn a tool or topic into social content, or to plan the X calendar. Also covers making a social card and turning engagement back into RIE evidence.
---

# X content

The account is not the asset. The library of pages is the asset, and X is a channel that feeds
people, and ideas, into it. Nothing here is justified as a Google ranking lever, because it is not
one: the links are nofollowed and wrapped in `t.co`, and follower count ranks nothing.

> **The test, before anything is published.** Not "will this post improve our SEO?" but
> **"will this post help more people discover a topic ToyTools can permanently serve?"**

Full model, including what X is and is not worth here:
`docs/analysis/2026-08-25-x-content-strategy.md`.

## The default flow: ask, I suggest, you post

This is a conversation, not a batch job. The user asks for a post idea (or "what should we post
today", or "give me a gotcha for the developer tools"); the reply is 2-4 concrete candidates right
in the chat, not a pile of files to browse. Nothing here ever posts to X -- there is no credential
in this repo -- so every suggestion ends with the user copying text and posting it themselves.

**1. Find candidates.** Look across the four kinds (table below) for a few that are genuinely
different from each other -- not four gotchas, not four tools from the same category -- using
whatever the user's request narrows it to. Sources: `src/data/registry.ts` / `docs/code-map.json`
for which tools carry a `craft` touch or a `guide` + `knowledge.ts` pair, `CHANGELOG.md`'s top entry
for a ship, and common mistakes grouped by category for a probe. Picking *which* candidates are
worth surfacing is a judgement call, same as it is for any editorial choice on this account --
there is no scored ranking system here the way there is for `next-tool`, because "which gotcha is
interesting today" isn't the kind of thing a formula should decide.

**2. Pitch each one in a line or two**, not the full post yet: the kind, the subject, why it's worth
posting now, and the image call (see below) -- so the user can pick without reading a draft.

**3. Once the user picks one**, pull its validated, sourced material without touching any files on
disk:

```sh
npm run x:generate -- --slug base64-encoder-decoder --kind thread --print
```

`--print` runs the same registry derivation and voice gate as the bulk export, but writes nothing --
not the queue, not its index -- so reaching for one idea never disturbs whatever bulk export already
exists. It also means a suggestion can never invent a claim the site doesn't make or link a page
that doesn't exist: read the output before writing anything.

**4. Fill any `[[slot]]` yourself**, in the reply, following `references/writing-posts.md` (hooks,
second person, first principles). Hand back the finished post as plain text, ready to select and
paste into X. Fill the slot in the chat reply -- never hand-edit the file `--print` read from, since
the next `x:generate` regenerates it from the registry anyway.

Only fall back to a blank page -- writing a post with no draft behind it at all -- when nothing in
the registry backs what the user is asking for. Say so rather than inventing a claim.

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

## Text-only is the default. Cards are the rare exception.

This account prefers posting words over posting pictures of words. A post stands on its own text;
an image, when one exists at all, is a small supplement to it, never the thing carrying the claim.
Concretely:

- **Threads carry no card at all.** Seven posts of text explain the topic; a cover image is a click
  spent before the reader reaches any of that text, which is the opposite of what a thread is for.
- **A gotcha's card is opt-in, per post.** The generator leaves its `body` as a `[[slot]]` rather
  than auto-filling the full `craft.solves` sentence (up to 366 characters), so `x:cards` renders
  nothing for it by default. Only fill that slot for a specific gotcha you have decided deserves
  extra visual reach, and when you do, write **one short phrase**, not the sentence. Every
  `gotcha/<slug>.md` file shows an `image` line on its draft that says exactly this.
- **Ship keeps a default card.** It is the one kind worth a glance rather than a read, and its card
  is already minimal: a headline plus one sentence, never a paragraph.
- **A probe gets none.** It is a question, and a branded image makes it look like an ad for the
  answer.

If a card is ever warranted for something visual, prefer a small diagram over a block of text: a
picture is for showing a reader something they'd otherwise have to imagine, not for restating a
sentence in a bigger font.

```sh
npm run x:cards                        # renders every card currently filled in the queue
npm run x:cards -- --id gotcha-base64-encoder-decoder
```

1600x900, on the site's paper, type and gold, from the shared tokens in `scripts/brand/render.ts`.
A card is declared by its draft, so a post and its image cannot say different things. A card whose
text still holds a `[[slot]]` is skipped rather than rendered with the instruction on it -- which is
also the mechanism that makes gotcha cards opt-in: nothing renders until you fill the slot.

## Turning engagement into evidence

This is the part that makes the account worth running, and the part that is easiest to do wrong.

When a probe item lands, that is a **demand signal Search Console cannot produce**, because Search
Console only reports demand that already exists as query volume. Record it as a structured signal
against the seed record it belongs to, then re-run the RIE:

```sh
npm run research:signal -- --tool <slug> --kind x-probe --strength 60 \
  --observation "what was actually seen, in words" --url https://x.com/...
npm run research:signal -- --tool <slug> --list      # what is already recorded
npm run research:next
```

`--kind` is one of `x-probe`, `x-reply`, `search-console`, `feedback`, `support-thread`.
`--strength` (0-100) is how strongly **this one observation** argues the need is real: a reply
describing the exact workflow scores high, a like on a post about something else scores low.

**Write what you saw, not how it felt.** "Did well" is rejected by the validator, and rightly:
"three replies described diffing semicolon-delimited exports by eye" is evidence, and the other is a
mood. The command refuses anything the RIE's own dataset validator would reject, so a bad signal
fails here rather than silently at the next research run.

**A signal raises `confidence`, never `finalScore`.** This is deliberate and worth understanding
before recording one: `searchDemand` measures how loudly a need is already being asked for in
search, and a post doing well is a different fact. Folding the second into the first would let one
good post reorder the roadmap. What a signal buys is that we are more sure the need is real, and the
recommendation reports it under its own heading so nobody mistakes it for traffic.

**Nudging `demand` by hand instead is the thing this replaces.** A raised number carries no date, no
words, and no link, so a month later it is indistinguishable from research. Use the command.

**Never hand-edit a report, and never build on a hunch because a post did well.** The standing rule
in `CLAUDE.md` holds here without exception: to change a recommendation, change the evidence. One
probe is not a dataset, and a single popular reply is an anecdote.

## Nothing should read as a surprise

Every post is written from first principles: a term is defined, in plain words, before it is ever
used. Do not assume the reader already knows what an epoch, a checksum, a hex digit, or a fold ratio
is just because the tool's audience mostly does. If a word would stop an unfamiliar reader for even
a second, that word gets a clause explaining it or gets replaced. This is a judgement call, not
something the voice gate checks, and it applies to every hook, slot and worked example. See
`references/writing-posts.md` for how this shapes hook-writing and thread order.

## Bulk export (occasional, not the default)

```sh
npm run x:generate                     # every draft, writes brand/social/x/queue/
npm run x:generate -- --kind gotcha    # one kind
```

Reach for this when the ask is genuinely "let me browse everything," not for a single suggestion --
use `--print` for that (above). It writes **one file per draft**: `gotcha/json-formatter.md`,
`thread/base64-encoder-decoder.md`, and so on, named for the tool or topic, plus `queue/index.md`
listing every draft with its image status. Each post inside a draft sits in its own fenced code
block, so selecting and copying it grabs exactly the text that gets pasted into X.

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

Every path -- `--print`, the bulk export, `--check` -- runs the same voice gate, so a failing draft
never reaches you as a suggestion, a queue file, or `--print` output: `--print` exits non-zero and
prints the failure instead of printing the draft. If the gate rejects something, **fix the source
field or the template, not the gate.** A rejection has twice pointed at a real defect in an authored
`knowledge.ts` file rather than at the draft.

## References

- `references/writing-posts.md` - filling slots, hooks that are not clickbait, thread shape
- `docs/analysis/2026-08-25-x-content-strategy.md` - the model and what it refuses to claim
- `brand/README.md` - the account assets and how they are regenerated
