# Filling the slots

Structural guidance for turning a generated draft into a publishable post. The model and the rules
live in `SKILL.md`; this is the craft.

## First principles: nothing should be a surprise

Write every slot as if the reader has never touched this corner of the tool before. That does not
mean explaining everything, it means never leaning on a word the reader has to already know to
follow the sentence.

- **Define before you use.** If a post needs "epoch," "checksum," "hex," "the fold," or any other
  term specific to the tool's domain, the first mention carries a plain-words clause. "Unix time
  counts seconds from 1970, so an epoch timestamp is just that count" earns the word; "your epoch
  timestamp is wrong" spends it before the reader has it.
- **Order like a beginner, not like the codebase.** The generated thread shape (what it is, why it
  exists, the mistake, the example, where it's used) already does this: each post gives the reader
  what the next one needs. Do not reorder it to lead with the interesting part if the interesting
  part depends on something the reader hasn't been given yet.
- **An acronym gets spelled out on first use**, even a common one. "UTC" can follow "Coordinated
  Universal Time" in the same sentence; it should not open one.
- **A worked example is the test.** If filling in real values from the guide requires the reader to
  already understand a term the post never defined, the post is missing a clause, not the example.
- **This is a judgement call the voice gate cannot make.** `x:generate -- --check` catches banned
  phrases and dead links, not an assumed-familiarity gap. Read the finished post as someone who has
  never opened this tool would read it.

## Hooks

The hook is the only line most people read, and it is the one thing the generator refuses to write
because it depends on what a reader already knows.

A hook works when it names a **specific wrong belief** the reader might hold, or a **specific
failure** they have hit. It fails when it announces that a thread exists.

| instead of | write |
|---|---|
| "A thread about Base64" | "Base64 is not encryption, and treating it as encryption is how secrets end up in logs" |
| "Some thoughts on aspect ratios" | "Your aspect ratio is correct and ffmpeg still refuses it. H.264 wants both dimensions even" |
| "Did you know about SHA-512?" | "A longer hash is not a slower hash. SHA-512 beats SHA-256 on most 64-bit CPUs" |

Two failure modes to avoid, in both directions:

- **Clickbait.** "Nobody understands Base64" is a claim about the reader, and the payoff never
  matches it. The material here is genuinely interesting; it does not need inflating.
- **The hedge.** "There are a few things worth knowing about Base64" opens with
  `directAnswerHedgeOpeners` and says nothing. The site's own rules ban this shape in guides for
  the same reason.

## Thread shape

The generated order is deliberate and should usually survive:

1. **Hook** - the wrong belief, named.
2. **What it is** - `knowledge.ts` summary, verbatim. Reader-facing already.
3. **Why it exists** - yours. The problem it was invented for. This is the post that turns a
   definition into an explanation, and it is the one most often left weak.
4. **The mistake** - `commonMistakes`, verbatim.
5. **The worked example** - yours, with real values lifted from the guide.
6. **Where it comes up** - `realWorldUseCases`.
7. **The links** - guide first, tool second.

Each post should stand alone well enough to be screenshotted. A post that only makes sense after
the previous one is a paragraph that got split, not a post.

## Second person, active, present

`craft.solves` is maintainer prose and needs converting. The pattern:

> **Source:** "Real Base64 arrives as a data URI, a base64url token or a value with its padding
> stripped, and all three currently get a correct rejection instead of the decode the user came
> for."
>
> **Post:** "Pasting a data URI into a Base64 decoder gets you an error, not your data. Same for a
> base64url token, and for anything with the padding stripped. All three are valid. Most decoders
> reject all three."

What changed: the reader is addressed, the failure comes first, and the comparison to other tools
became a plain statement of what happens rather than a claim about competitors.

## Length

`x:generate` reports every post as `n/280`, counting a URL as 23 characters the way X does. Slots
count as zero, so a post showing `20/280` with a slot to fill has 260 characters of room, not 260
characters of content.

Aim well under the limit. A post at 279 characters cannot be quote-tweeted with a comment, and
cannot survive an edit.

## What never goes in a post

- A claim about a tool that is not in `config.ts`, `knowledge.ts` or the guide.
- A link added by hand after generating, which skips the dead-link check.
- An em-dash.
- A number that is not in the registry or the guide. Tool counts go stale; the catalog grows most
  weeks.
