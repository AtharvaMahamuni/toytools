# The X account: what it is for, and what it is not for

**Status:** the model this account runs on, and the pipeline that implements it.
**Assets:** `brand/README.md`. **Playbook:** `.claude/skills/x-content/`.

## The claim this strategy refuses to make

X posts are not a Google ranking lever, and nothing here should be justified as one. Follower
count is not a ranking factor. A post carrying a link is not a backlink in any sense that moves
search: the links are nofollowed and wrapped in `t.co`, and posting hundreds of them
automatically would be effort spent on a mechanism that does not exist.

What X does is put the chain in motion:

```
post -> discovery -> a visit -> somebody searches, shares, or writes about ToyTools -> stronger signals
```

Every real benefit is in the middle of that chain, not at either end. So the question this
account asks before publishing is never "will this post improve our SEO?" It is:

> **Will this post help more people discover a topic ToyTools can permanently serve?**

If yes, publish it. The account is not the asset. The growing library of pages is the asset, and
X is one of the channels that feeds people, and ideas, into it.

| X activity | what it is actually worth |
|---|---|
| posting a tool URL | indirect, and the weakest thing the account can do |
| a useful educational post | indirect, and the reason to have the account |
| a thread that explains a topic | indirect, and the strongest repeatable form |
| someone sharing that thread | real: discovery and referral |
| someone writing about ToyTools and linking it | the strongest outcome available, and the only one that touches search directly |
| follower count | not a ranking factor by itself |
| bulk automated links | no strategic value, and a reason to be muted |

## The two things X is genuinely good for here

### 1. It reinforces a topic cluster

The site is already built in clusters. A tool has a guide, a FAQ, a knowledge file and derived
links to its siblings, all of which exist so that one topic is covered in one place by pages that
point at each other. That structure has a front door problem: it ranks over months, and nothing
sends anyone to it in the meantime.

A thread is that front door. Take Base64, which already carries a tool, a guide at
`/guide/developer-utilities/what-is-base64/`, nine FAQ entries and a knowledge file:

```
                        Base64
                          |
         +----------------+----------------+
         v                v                v
       tool             guide             FAQ
         |
         v
    related tools
```

A thread explaining what Base64 is, why it exists, how it differs from encryption, a worked
example, and when to use it, sends a reader into the guide. The guide holds the topic; the tool
is the call to action inside it; the related tools are what they find next. Social content and
SEO content stop being two programmes and become one system.

This is why **a thread lands on the guide, not on the tool.** A thread that lands on a tool page
spends its traffic on a single answer, and the reader leaves. The guide is also the page somebody
can cite when they write about the topic later, which is the one outcome in the table above that
reaches search directly.

"New Base64 encoder, check it out" does none of this.

### 2. It is a demand-discovery instrument

Post five real problems in one area. One of them gets noticeably more response than the other
four. That is a signal, and it is a kind of signal Search Console cannot produce, because Search
Console only reports demand that already exists as query volume.

```
Search Console  ->  what people already search for
X               ->  what people are interested in and arguing about
                            |
                            v
                    ToyTools turns both into permanent utilities
                            |
                            v
             tool + guide + FAQ + internal links = the evergreen asset
```

The loop closes in `research/datasets/*.json`. An engagement signal is **evidence**, so it is
written into a dataset and the RIE is re-run; it is never a reason to hand-edit a report or to
build something on a hunch. The standing rule in `CLAUDE.md` holds without exception here: to
change a recommendation, change the evidence.

Note what this costs. A probe post links nothing, on purpose. A probe carrying a call to action
measures the call to action rather than the interest, and the measurement is the whole point of
publishing it.

## What gets posted

Four kinds, ranked by what they are worth. `npm run x:generate` derives all four from the
registry.

| kind | source | lands on | how many exist today |
|---|---|---|---|
| **thread** | `knowledge.ts` + a registered guide | the guide | 131 |
| **gotcha** | `config.ts` -> `craft.solves` | the tool | 75 |
| **probe** | `commonMistakes` across one category | nothing, deliberately | 10 |
| **ship** | the top `CHANGELOG.md` entry | the new tool | 1 per release |

**Threads** are the form to spend real effort on. **Gotchas** are the account's daily voice: 75
tools each declare one specific failure they handle and their incumbents do not, and that is the
most publishable writing in the repo because a gate already holds it to a standard. **Probes**
are the instrument. **Ships** are capped, because an account that only announces itself gives
nobody a reason to follow it.

## Why a generator rather than a list of post ideas

The same reason `brand/` holds a generator rather than an exported design file. A hand-written
list of 75 post ideas goes stale the first time a tool's craft sentence is rewritten, and nothing
fails when it does. Regenerating from the registry means a draft that no longer matches the site
cannot survive a run.

It also removes the failure that would actually damage the account. Every factual line in a draft
traces to a field somebody authored and a validator already checks, so the account structurally
cannot make a claim the site does not make, or link a page that does not exist.

**Two things the generator does not do.** It does not post: there is no X credential in this repo
and no intention to add one, and an account that auto-posts cannot notice what its probes are
measuring. And it does not write the connective prose. A `[[slot]]` marks a judgement about what a
reader already knows, which is the writer's job.

## One voice, enforced from one place

The site owns a written voice, held on every guide and FAQ by `seo:gate` against
`seo-engine/config/writing-rules.json`. An account that writes differently is a second voice for
the same product, so `npm run x:generate` reads **those same rule files** rather than restating
them: the banned-phrase lists, the AI tells, the jargon list. Change the site's rules and the
account inherits them on the next run. The em-dash ban is copied rather than read, because it
lives in `CLAUDE.md` as prose and nowhere as data.

A draft that fails the gate is held back rather than written to the queue, so anything in the
queue has already cleared the bar the site's own prose clears.

One distinction is worth keeping straight, because it decides what can be published verbatim.
**`knowledge.ts` is written for a reader** and already reaches the site as prose, so a thread
quotes it as-is. **`craft.solves` is written for the next maintainer**: "instead of the decode the
user came for" is precise, correct, and talks about the user in the third person. Publishing it as
written would give the account a voice nobody on X is being addressed in, so a gotcha's post body
is a slot with the sentence supplied as material. The card is where the exact sentence goes.

## The cards: text-only by default

This account posts words, not pictures of words. A card is a rare, minimal supplement, never the
default asset for a kind and never a paragraph rendered as an image.

`npm run x:cards` renders 1600x900 images on the site's own paper, type and gold, through the same
Chromium and sharp path the account assets use, from the same shared tokens
(`scripts/brand/render.ts`), but it only ever renders what a draft already declares, and most
drafts declare nothing:

- **Threads carry no card.** The thread is seven posts of text; a cover image spends a click before
  any of that text and adds nothing the posts don't already say.
- **A gotcha's card is opt-in.** `craft.solves` runs to a median of 230 characters and a maximum of
  366, which is exact but far too dense for a minimal image, so `build-drafts.ts` leaves the card's
  `body` a `[[slot]]` instead of auto-filling the full sentence. `x:cards` skips any card that still
  holds a slot, so nothing renders until a human decides one specific gotcha earns the extra reach
  and writes a short phrase for it, not the sentence.
- **Ship keeps a default card**, because a release is worth a glance and its card was already the
  minimal shape: a headline and one sentence.

Two templates render in practice: `gotcha` (opt-in, one phrase) and `ship` (default, one sentence).
`thread` support stays in the renderer for the rare case a specific thread earns a cover by hand,
but nothing generates one automatically. Where a card is genuinely warranted for something visual,
a small diagram beats a block of text: an image should show the reader something, not restate a
sentence in a bigger font.

None of them draws a frame. The site removed container borders catalog-wide and `check:craft`
holds separator rules at zero, so a card with a box round it would be the one ToyTools surface
still doing what every other surface stopped doing.

## What this does not solve

- **Nothing here measures whether the account works.** Referral traffic from X shows up in GA4 and
  is worth watching, but no gate reads it and no report is generated from it.
- **The engagement-to-evidence step is manual.** Reading which probe item landed and writing it
  into a dataset is a judgement, and deliberately stays one.
- **Nothing validates the queue against the live site.** The dead-link check reads the registry, so
  a draft written before a slug is renamed is caught on the next run, not at posting time.
- **Query coverage still measures us against ourselves.** X reactions are the first demand signal
  in this project that comes from outside the phrases we wrote, which is exactly why the probe
  exists, and also why one probe is not a dataset.
