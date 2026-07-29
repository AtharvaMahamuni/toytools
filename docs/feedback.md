# Feedback & Product Discovery

`/feedback/` collects **user problems**, not feature requests. The form asks four questions
instead of showing one empty box, because "every Monday I export a 4,000-row report and split
it by region in a spreadsheet, since every site I found wants an upload" is something you can
build for, and "build a CSV splitter" is not.

**No backend, no database, no third party, no accounts, no stored state, no setup.** There are
deliberately no thumbs, ratings, votes, counters, or analytics events anywhere in this system.

## How it delivers, and why it works this way

A static page **cannot send an email**. There is no browser API for it, SMTP needs credentials
that would be public in the page source, and every hosted form endpoint (Web3Forms, Formspree,
and the rest) is somebody else's server. With no third party permitted, there is exactly one
mechanism left: a `mailto:` URL, which opens the **visitor's own** mail client with the subject
and body already written. They press Send.

That constraint pays for itself:

- **No endpoint exists**, so there is nothing to abuse. No honeypot, no captcha, no rate limit,
  no access key, no spam surface.
- **Nothing can be delivered without a human**, so a test run, a bot, or a stray script cannot
  reach the inbox. The E2E suite drives this form on every pull request and there is no guard to
  regress.
- **The visitor reads the whole message before it leaves their machine**, including anything
  attached from a tool. That is a stronger privacy position than any policy text.

The honest costs, which are real:

- **It needs a configured mail client.** On phones that is nearly universal (the Gmail app
  registers the handler). On a desktop where someone only uses webmail in a tab, clicking the
  button may do **nothing at all, silently**. That is why the composed message is always shown
  on the page with a **Copy message** button and the address in selectable text. The mailto is
  the fast path, never the only path.
- **There is a second step.** They have to press Send in their own app, and some will not.
  Expect fewer submissions than a hosted form would produce, in exchange for owning the whole
  pipeline.
- **The address is in the page.** A `mailto:` URL has to contain a real address. It is stored in
  two halves and joined at runtime (`config.ts`), which defeats naive `text@text` harvesters and
  nothing cleverer. Treat this as friction for bulk scrapers, **not** as privacy.

## Setup

None. It works the moment it deploys. To change the destination address, edit `ADDRESS_LOCAL`
and `ADDRESS_DOMAIN` in `src/lib/feedback/config.ts`.

## Gmail filters

Worth creating so submissions sort themselves. Note these arrive **from the sender's own
address**, not from a relay, so filter on the subject.

| Filter (Has the words) | Do this |
|---|---|
| `subject:("[ToyTools]" BUG)` | Apply label `ToyTools/Bug`, Star it |
| `subject:("[ToyTools]" IDEA)` | Apply label `ToyTools/Ideas` |
| `subject:("[ToyTools]" IMPROVEMENT)` | Apply label `ToyTools/Improvements` |
| `subject:"[ToyTools]"` | Apply label `ToyTools`, Never send to Spam |

Ad-hoc triage needs no filter, just search: `subject:"Word Counter"` for one tool.

> Gmail treats a bare `-` as a NOT operator, which is why every token above is a whole word
> inside a quoted `subject:` clause. Do not "simplify" these into unquoted hyphenated tags.

The **Never send to Spam** rule on the catch-all matters more here than it would with a relay:
these are ordinary personal emails from strangers, so without it some will land in spam.

## The email contract

Subject: `[ToyTools]`, then the type token, then the tool.

```
[ToyTools] BUG · Word Counter
[ToyTools] IDEA · QR Code Generator
[ToyTools] IMPROVEMENT · JSON Formatter
[ToyTools] FEEDBACK
```

For a new-tool idea with no existing tool, the label falls back to the opening of "what are you
trying to do?", trimmed to 40 characters. Subjects are flattened before composition: a newline
in a subject line is a header-injection vector, not a formatting wrinkle.

Body: labelled sections in a fixed order, empty ones omitted, then a metadata block.

```
Feedback Type
Bug Report

Current Tool
Word Counter

Problem
Emoji count is incorrect.

Ideal Solution
Count emojis correctly.

Example Input
hello world

Example Output
Expected count = 2

Browser          Chrome
Platform         Android
Language         en-IN
URL              https://toytoolsapp.com/tool/text/word-counter/
ToyTools Version 1.4.2
Time             2026-07-30 18:42 IST
```

All four submission types map into the same section vocabulary (`EMAIL_SECTION_ORDER` in
`templates.ts`), so every email has the same shape whatever produced it. `templates.test.ts`
pins the rendered body character for character. **If you change a heading, that test fails, and
so would the Gmail filters.** That is the point.

### Length

Mail clients disagree about how long a `mailto:` they will accept, and the historical floor is
the Windows shell's ~2,048-character limit. Over it, clients truncate or ignore the link, which
looks like a broken button. So `buildMailtoUrl` trims the **mailto** body to fit
(`MAX_MAILTO_LENGTH`, 1800) and appends a notice saying so, while `composed.body` stays complete
for the Copy button. Nothing anyone writes is ever lost; it may just not all fit through the
mail app.

Two subtleties the tests cover: encoded length is not proportional to character count (a newline
costs three characters, an emoji up to twelve), and trimming happens on whole **code points**,
because slicing mid-emoji leaves a lone surrogate and `encodeURIComponent` throws `URIError` on
that. Given this form exists partly to collect bug reports about emoji handling, that is a
certainty rather than an edge case.

## Architecture

```
src/lib/feedback/
├── config.ts        # address, mailto ceiling, the four types, SENSITIVE_ENGINES
├── templates.ts     # the questions AND the email they produce (one contract, one file)
├── validate.ts      # per-type required answers + a low length floor
├── environment.ts   # browser/platform/time for the metadata block
└── deliver.ts       # compose + build the mailto URL; pure, synchronous, no network

src/components/feedback/
├── FeedbackLink.astro          # the one quiet link, rendered by ToolLayout
├── FeedbackTypeSelector.astro  # thin wrapper over SmartInput type:'segmented'
├── FeedbackForm.astro          # the form markup
└── feedbackForm.client.ts      # DOM glue; every decision lives in the pure modules
```

`src/pages/feedback.astro` is a standalone content page, **not** a registry tool. It reaches the
sitemap and IndexNow through `STANDALONE_PAGES` in `src/lib/content/manifest.ts`, which is the
only edit needed to add another such page.

### The form is one union of fields

Every question any type can ask is rendered once, with `data-shown-for` / `data-required-for`
listing the types it applies to. Switching type toggles classes. That keeps ids unique, lets a
half-typed answer survive a change of mind, and avoids re-rendering anything.

Visibility is controlled with a **class, never the `hidden` attribute**: a `display` rule in the
stylesheet silently overrides `[hidden]` and the field comes back.

### Validation

Required answers per type and a 10-character floor on free text. Nothing else: no rate limiting,
no quota, no duplicate detection, no submission history. Four questions about a real problem is a
stronger filter than any counter, and a hard floor only punishes someone being concise.

## The reproduction opt-in

On a bug report only, and unticked by default, someone can attach whatever they had typed into
the tool they came from. `FeedbackLink` stashes it in `sessionStorage` on the way out (this tab,
this trip, read once and cleared), and the form offers it back by name: "Include what I typed
into Word Counter".

Whether it is offered at all is decided **at build time** from registry metadata via
`allowsInputCapture(engine, pattern)`. On `jwt`, `hashing`, `encoding`, and any
`generate-credential` tool, the capturing script is not even emitted, because someone debugging
those is holding a live secret. Deriving this from engine and pattern rather than a slug list
means a new tool in one of those families is covered the day it ships.

## Where it is linked from

The sitewide footer (every page), the 404 page, the search no-results state, and the bottom of
every tool via `ToolLayout`. No tool file mentions feedback.

A failed site search is the clearest statement of unmet need anywhere on the site: someone said
exactly what they wanted, in their own words, at the moment they wanted it. `/search/` hands that
query to `/feedback/?type=new&q=…`, which opens on "Suggest a New Tool" with the answer to "what
are you trying to do?" already filled in.

## Verification

```sh
npm run test                       # the email contract, mailto fitting, validation rules
npm run build                      # validators + Astro + strict TypeScript
npx playwright test feedback.spec  # desktop AND Pixel 5, both must pass
```

Under automation the click that opens the mail app is skipped (an unhandled `mailto:` would hang
the run or unload the page), but the link is in the DOM with a live href, and that is what the
E2E assertions read.
