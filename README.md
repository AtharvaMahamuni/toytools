# ToyTools

Tiny tools for everyday problems.

Live at **[toytoolsapp.com](https://toytoolsapp.com)**

> Canonical docs for contributors (human or agent): **[CLAUDE.md](./CLAUDE.md)** (workflow,
> commands, conventions) and **[ARCHITECTURE.md](./ARCHITECTURE.md)** (system patterns). This
> README is a high-level orientation; those two are the source of truth.

---

## Architecture

Data-driven static site built with [Astro](https://astro.build). Every page is pre-rendered at
build time — no server, no database, no client-side framework. Tools are organized by **engine**
(text-analysis, text-processor, encoding, hashing, structured-data, jwt, calculator, productivity,
…), and almost everything (pages, category listings, search, sitemaps, related content) derives
from registries at build time.

```
src/
  tools/<segment>/<slug>/   # one dir per tool: config.ts, Widget.astro, faq.ts?, Guide.astro?, knowledge.ts?
    _shared/                # reusable widget primitives (TextMetricWidget, TextProcessorWidget, …)
  components/               # Nav, SearchBar, ToolCard, BackButton, ToyToolsRuntime, …
  data/                     # registry.ts (single source of truth), engines.ts, categories.ts, types.ts, *-registry.ts
  layouts/                  # BaseLayout, ToolLayout, GuideLayout
  lib/                      # engines/, text/, knowledge/, content/ (manifest), indexnow/, paths.ts (withBase)
  pages/                    # index, tool/[category]/[slug], category/[slug], guide/[...slug], sitemaps, robots
  styles/                   # tokens.css, tool-widget.css, global.css
scripts/                    # validate-registry, validate-knowledge, validate-architecture, platform-health, …
seo-engine/                 # local-first SEO/GEO research + content quality gate (tooling sidecar)
quality-guardian/           # crawl/validate/autofix pass (tooling sidecar)
```

Design system: CSS custom properties only (`src/styles/tokens.css`). One `--color-accent` token
controls all accent usage. Dark mode via `prefers-color-scheme` + a localStorage toggle. Zero JS
frameworks shipped to the client.

---

## How It Works

### Adding a tool (2 steps)

1. Create `src/tools/<segment>/<slug>/` with `config.ts` (a named `const config: ToolConfig`) and
   `Widget.astro`.
2. Add one import line and one array entry in `src/data/registry.ts`.

Tool page, category listing, search, sitemap, and homepage update automatically. The
**`add-tool` skill** (`.claude/skills/add-tool/`) walks the full checklist.

### Adding a guide / FAQ / knowledge file

- **Guide:** add `guide:` to `config.ts`, create `Guide.astro`, then register the slug in
  `src/data/guide-registry.ts` **and** add its import to `src/pages/guide/[...slug].astro`.
- **FAQ:** create `faq.ts` (`export const items: FAQItem[]`) and register it in
  `src/data/faq-registry.ts` (no `faq` config field — FAQ renders on the tool page).
- **Knowledge:** create `knowledge.ts` and register it in `src/lib/knowledge/registry.ts`.

`scripts/validate-registry.ts`, `validate-knowledge.ts`, and `validate-architecture.ts` fail the
build if any of these drift (missing, orphaned, unregistered, or duplicated).

### Routing (URLs are singular)

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/tool/{segment}/{slug}/` | `src/pages/tool/[category]/[slug].astro` |
| `/category/{slug}/` | `src/pages/category/[slug].astro` |
| `/guide/{category}/{slug}/` | `src/pages/guide/[...slug].astro` |
| `/search` | `src/pages/search.astro` (noindex) |

All internal links go through `withBase()` (`src/lib/paths.ts`).

### Shared client runtime

`ToyToolsRuntime.astro` is inlined once in `BaseLayout`, exposing `window.ToyTools` for Widget
inline scripts: `toast()`, `storage.get/set/clear()`, `copy()`, the engine runners
(`runEncoding`/`runHash`/…), and `state` persistence.

---

## Development Setup

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # validators + static output → dist/  (the verification step)
npm run preview    # serve dist/ locally

npm run test       # vitest unit tests
npm run test:e2e   # Playwright (chromium + pixel5)
npm run health     # post-build platform integrity superset
```

**Production build** (custom apex domain, served from root — **no** base path):

```sh
ASTRO_SITE=https://toytoolsapp.com npm run build
```

> Do **not** set `ASTRO_BASE_PATH=/toytools`. The site is served from the apex of
> `toytoolsapp.com` (`public/CNAME`); a base path would push every page under `/toytools/...` and
> the real root URLs would fall through to GitHub Pages' `noindex` 404. See CLAUDE.md.

Deployment is automatic via `.github/workflows/deploy.yml` on every push to `main`.

---

## Project Vision

A platform for small, fast, focused utility tools. Each tool solves exactly one problem. No
accounts. No upsells. ~48 tools across Text, Number, Developer, and Productivity categories.

Design principles (frozen):

- **Clarity over delight** — the interface disappears behind the tool
- **Mobile first** — thumb-reachable actions, 48px minimum touch targets
- **Performance is a feature** — HTML + CSS + minimal JS, no heavy bundles
- **Token-driven** — change one CSS variable to retheme the entire platform
