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

## Discovery files

`/llms.txt` is a short overview: what the site is, the privacy line, a fixed list of core tools, and the categories. It links to `/llms-full.txt`.

`/llms-full.txt` is generated from the tool registry (`src/lib/llms/render.ts`). One block per published tool: name, URL, one-line use, the privacy sentence for that tool's trust variant, and what it does not do. There is no second hand-maintained list. A tool added to the registry appears in the file on the next build.

`robots.txt` allows `/` for every crawler, and names GPTBot, ClaudeBot, PerplexityBot, and Google-Extended so the file states that public pages are available to them. It does not disallow anything. The deployed site has no private directory.

## Citation

A tool may set `citation` on its config:

- `problem`: one sentence, the job.
- `nonGoal`: completes "It does not …". Lowercase verb, period at the end.

The tool page renders that, plus `privacyStatement(trustVariant)`, under "When to send someone here". Lookup tools must not claim that nothing is uploaded. The privacy sentence comes from the trust variant, not from the citation.

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
