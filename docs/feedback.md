# Feedback & Product Discovery

`/feedback/` collects **user problems**, not feature requests. The form asks four questions
instead of showing one empty box, because "every Monday I export a 4,000-row report and split
it by region in a spreadsheet, since every site I found wants an upload" is something you can
build for, and "build a CSV splitter" is not.

Email-first and fully static: the browser composes a structured message and hands it to
Web3Forms, which relays it to the inbox. No backend, no database, no accounts, no stored state
of any kind. There are deliberately **no** thumbs, ratings, votes, counters, or analytics events
anywhere in this system. Its only output is email.

## One-time setup

1. Sign up at [web3forms.com](https://web3forms.com) with the destination address. They email
   back an **access key**.
2. In the Web3Forms dashboard, **restrict the key to `toytoolsapp.com`**. The key is visible in
   the page HTML by design (it only permits submitting, never reading), so the domain allow-list
   is the actual protection, not secrecy.
3. Add the key as a GitHub repository secret named `PUBLIC_WEB3FORMS_KEY`. It is consumed in
   `.github/workflows/deploy.yml`.
4. Create the Gmail filters below.

Until the key exists, the form composes the email and **shows it on the page instead of
sending**. That is what local development, forks, and E2E runs get.

## The Gmail filters

| Filter (Has the words) | Do this |
|---|---|
| `subject:("[ToyTools]" BUG)` | Apply label `ToyTools/Bug`, Star it |
| `subject:("[ToyTools]" IDEA)` | Apply label `ToyTools/Ideas` |
| `subject:("[ToyTools]" IMPROVEMENT)` | Apply label `ToyTools/Improvements` |
| `subject:"[ToyTools]"` | Apply label `ToyTools`, Never send to Spam |

Ad-hoc triage needs no filter, just search: `subject:"Word Counter"` for one tool,
`subject:IDEA` for the whole idea pile.

> Gmail treats a bare `-` as a NOT operator, which is why every token above is a whole word
> inside a quoted `subject:` clause. Do not "simplify" these into unquoted hyphenated tags.

## The email contract

Subject: `[ToyTools]`, then the type token, then the tool.

```
[ToyTools] BUG · Word Counter
[ToyTools] IDEA · QR Code Generator
[ToyTools] IMPROVEMENT · JSON Formatter
[ToyTools] FEEDBACK
```

For a new-tool idea with no existing tool, the label falls back to the opening of "what are you
trying to do?", trimmed to 40 characters, so subjects stay short. Subjects are flattened before
composition: a newline in a subject line is a header-injection vector, not a formatting wrinkle.

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

All four submission types map into the same section vocabulary
(`EMAIL_SECTION_ORDER` in `templates.ts`), so every email has the same shape whatever produced
it. `templates.test.ts` pins the rendered body character for character. **If you change a
heading, that test fails, and so would the Gmail filters.** That is the point.

## Architecture

```
src/lib/feedback/
├── config.ts        # endpoint, access key, the four types, SENSITIVE_ENGINES
├── templates.ts     # the questions AND the email they produce (one contract, one file)
├── validate.ts      # per-type required answers + a low length floor
├── environment.ts   # browser/platform/time for the metadata block
└── submit.ts        # environment guard + honeypot + relay POST; never throws

src/components/feedback/
├── FeedbackLink.astro          # the one quiet link, rendered by ToolLayout
├── FeedbackTypeSelector.astro  # thin wrapper over SmartInput type:'segmented'
├── FeedbackForm.astro          # the form markup
└── feedbackForm.client.ts      # DOM glue; every decision lives in the pure modules
```

`src/pages/feedback.astro` is a standalone content page, **not** a registry tool. It is
registered for the sitemap and IndexNow through `STANDALONE_PAGES` in
`src/lib/content/manifest.ts`, which is the only edit needed to add another such page.

### The form is one union of fields

Every question any type can ask is rendered once, with `data-shown-for` / `data-required-for`
listing the types it applies to. Switching type toggles classes. That keeps ids unique, lets a
half-typed answer survive a change of mind, and avoids re-rendering anything.

Visibility is controlled with a **class, never the `hidden` attribute**: a `display` rule in the
stylesheet silently overrides `[hidden]` and the field comes back.

## The two protections, and why only these two

Validation is deliberately thin: required answers per type, a 10-character floor on free text,
nothing else. No rate limiting, no daily quota, no duplicate detection, no submission history.
Four questions about a real problem is a stronger filter than any counter, and a hard floor only
punishes someone being concise.

Two things are not validation and are load-bearing:

1. **A hidden honeypot** (`botcheck`, positioned off-screen rather than `display:none`, because a
   bot that skips hidden fields would sail past that). A hit is swallowed and reported as success
   so the bot gets no signal to adapt to.
2. **The environment guard**, which delegates to `isAnalyticsEnabled` in
   `src/lib/analytics/guard.ts` rather than repeating its four checks. It refuses submission from
   dev, localhost, browser automation, and `PUBLIC_E2E=true`. This is correctness, not
   throttling: the Playwright suite drives this form on every pull request across desktop and
   Pixel 5, and without the guard **CI would email the inbox on every run**.
   `tests/e2e/feedback.spec.ts` fails the run if anything reaches the relay.

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
exactly what they wanted, in their own words, at the moment they wanted it. `/search/` now hands
that query to `/feedback/?type=new&q=…`, which opens on "Suggest a New Tool" with the answer to
"what are you trying to do?" already filled in.

## Verification

```sh
npm run test                       # the email contract and the validation rules
npm run build                      # validators + Astro + strict TypeScript
npx playwright test feedback.spec  # desktop AND Pixel 5, both must pass
```
