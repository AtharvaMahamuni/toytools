# Prep for a model

AI does the thinking. ToyTools does the preparation.

Prep for a model is a category of deterministic browser tools that prepare text before a person pastes it into an external model. ToyTools does not run that model. It does not call OpenAI, Anthropic, Gemini, Grok, or any other provider. It does not take an API key.

The category is `/category/prep/`. Tools:

| Tool | URL | Engine |
|---|---|---|
| Prompt Packer | `/tool/prep/prompt-packer/` | text-processor, `packPrompt` |
| Chat Export Cleaner | `/tool/prep/chat-export-cleaner/` | text-processor, `cleanChatExport` |
| JSON to JSON Schema | `/tool/prep/json-to-schema/` | structured-data, `json-to-schema` |
| JSON Schema Validator | `/tool/prep/json-schema-validator/` | structured-data, `validateJsonSchema` |
| Context Fit Checker | `/tool/prep/context-fit-checker/` | text-processor, `estimateContextFit` |
| llms.txt Generator | `/tool/prep/llms-txt-generator/` | text-processor, `buildLlmsTxt` |

Prompt Packer assembles fields. It does not write the prompt. Context windows in `src/lib/text/contextModels.ts` are copied from the vendor URL on each row. The divisor is 4 characters per estimated token. That is not a tokenizer. JSON Schema validation checks only the keywords named on the validator page. An exact tokenizer is not in this branch: if it is added later, it has to be a lazy chunk on its own route, not a shared dependency.

## Phone-first layout (beta-v12.1)

Each Prep tool is meant to feel like a focused app on a 390px phone, with the result on or near
the first screen. The shared pieces:

- `src/tools/_shared/Disclosure.astro`: a counted `<button aria-expanded aria-controls>` over a
  `[hidden]` region ("More fields (3)", "Optional (3)", Chat Export Cleaner's live
  "Cleanup: 6 of 6 on · Keep: Everything"). A widget that writes into hidden fields (Sample, a
  restored form) dispatches `tt:disclosure-sync` on the region, which opens it when any field
  inside holds text. It never re-closes by itself.
- `src/tools/_shared/MoreAbout.astro`: explanatory text moved out of a widget (Context Fit's
  window source and checked date, JSON to Schema's explanation and technical rows) into Zone C's
  "More about" row. Still in the HTML.
- `ToolActions sticky`: Copy (and Download on llms.txt) pinned to the bottom of a phone screen
  while the widget is in view. Focus scrolling stops above it, so Tab never lands under it.
- `src/styles/prep-slim.css`: the CSS for all of the above, imported only by Prep widgets.

Heights are set per widget with `--io-pane-h` (PR #232 textareas stay resizable): inputs open at
about three to six rows, outputs at 12rem on phones (16 to 20rem on desktop). Craft lines stay on
the tool screen, never in a drawer: `#pp-omit`, `#cc-status`, `#sv-status`, `#cf-warn`, `#lg-omit`.
`tests/e2e/prep-slim.spec.ts` pins the layout; `tests/e2e/prep.spec.ts` pins behaviour and privacy.

## Discovery files

`/llms.txt` is a short overview: what the site is, the privacy line, a fixed list of core tools, and the categories. It links to `/llms-full.txt`.

`/llms-full.txt` is generated from the tool registry (`src/lib/llms/render.ts`). One block per published tool: name, URL, one-line use, the privacy sentence for that tool's trust variant, and what it does not do. There is no second hand-maintained list. A tool added to the registry appears in the file on the next build.

`robots.txt` allows `/` for every crawler, and names GPTBot, ClaudeBot, PerplexityBot, and Google-Extended so the file states that public pages are available to them. It does not disallow anything. The deployed site has no private directory.

## Citation

A tool may set `citation` on its config:

- `problem`: one sentence, the job.
- `nonGoal`: completes "It does not …". Lowercase verb, period at the end.

Every NEW tool must set a specific `nonGoal` (what this tool does not do, not only "call an AI model"): `validate-registry` fails the build otherwise. It is also the tool's "Does not:" line in `/llms-full.txt`. The tools that predate the rule are listed in `src/lib/llms/nongoal-backlog.ts`, which only shrinks.

The tool page does not show it as a block (the visible "When to send someone here" block was removed on 2026-09-30). The same copy, "problem, `privacyStatement(trustVariant)`, It does not nonGoal", is the `abstract` of the tool's SoftwareApplication JSON-LD (`src/lib/schema/abstract.ts`), and the llms files read it through `toolFacts()`. Lookup tools must not claim that nothing is uploaded. The privacy sentence comes from the trust variant, not from the citation.

## Not this project

Do not add a chatbot, a model API, BYOK, prompt rewriting, an opaque prompt score, or a tokenizer on the shared bundle. If a feature needs a model to function, it does not belong here.

Guides shipped with the tools, under `/guide/prep/`:

- how to structure a prompt
- how to clean a chat export
- what a JSON example can tell a schema
- how to validate JSON against a schema
- what a context window is
- what llms.txt is

Exact token counting is still not written. If it is added, it stays a lazy chunk on its own route.
