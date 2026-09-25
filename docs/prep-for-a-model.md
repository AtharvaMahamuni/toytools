# Prep for a model

AI does the thinking. ToyTools does the preparation.

Prep for a model is a category of deterministic browser tools that prepare text before a person pastes it into an external model. ToyTools does not run that model. It does not call OpenAI, Anthropic, Gemini, Grok, or any other provider. It does not take an API key.

The category is not on this branch yet. This note is the boundary for the commits that add it.

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

Guides listed for later, not written yet:

- how to structure a prompt
- what a context window is
- what JSON Schema is
- what llms.txt is
- how token counting works
