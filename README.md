# ToyTools

ToyTools is the internet's little toolbox. 🔧

Tiny tools for everyday problems, each one a single job that opens instantly.

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
scripts/                    # scaffold-tool, validate-registry/knowledge/architecture, check-duplication, platform-health, …
seo-engine/                 # local-first SEO/GEO research + content quality gate (tooling sidecar)
quality-guardian/           # crawl/validate/autofix pass (tooling sidecar)
```

Design system: CSS custom properties only (`src/styles/tokens.css`). One `--color-accent` token
controls all accent usage. Dark mode via `prefers-color-scheme` + a localStorage toggle. Zero JS
frameworks shipped to the client.

---

## How It Works

### Adding a tool

**One command** generates the directory and wires every registry:

```sh
npm run scaffold:tool -- --slug my-tool --name "My Tool" --category text-utilities \
  --engine text-processor --pattern text-transform --family transform \
  --processor-id myProcessor --description "One-line description." [--faq] [--guide] [--dry-run]
```

It writes `config.ts` + `Widget.astro` (+ optional `faq.ts`/`Guide.astro`/`knowledge.ts` stubs) and
inserts the matching import + entry into `registry.ts`, `faq-registry.ts`, `guide-registry.ts` + the
guide route, and the knowledge registry — then you fill in the TODOs. Engine-backed engines get a
real 3-line widget; bespoke engines get a placeholder. Tool page, category listing, search,
sitemap, and homepage all update automatically at build time.

Prefer doing it by hand? Create `src/tools/<segment>/<slug>/{config.ts,Widget.astro}` and add one
import + entry to `src/data/registry.ts`; the **`add-tool` skill** (`.claude/skills/add-tool/`)
walks the full checklist and the validators below catch any missed wiring.

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
| `/tool/{segment}/{slug}/` | `src/pages/tool/<segment>/[slug].astro` (one generated route file per segment — no cross-segment catch-all) |
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

Authoring & quality automation:

```sh
npm run scaffold:tool -- --slug … --name … …  # generate a tool + wire every registry (one command)
npm run validate:architecture                 # drift/orphan/dead-entry lint (also runs in build)
npm run check:duplication                      # near-duplicate content guard (WARN-only)
npm run check:indexing -- --dry-run            # which URLs Google has indexed (GSC API; see docs/indexing.md)
npm run intel                                  # content-gap / roadmap analysis → dist/content-intelligence/
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
accounts. No upsells. 114+ tools across Text, Number, Developer, Productivity, Money & Finance,
Generators, Physics, Applied Math, Date & Time, Health & Fitness, and Design & CSS categories.

Design principles (frozen):

- **Clarity over delight** — the interface disappears behind the tool
- **Mobile first** — thumb-reachable actions, 48px minimum touch targets
- **Performance is a feature** — HTML + CSS + minimal JS, no heavy bundles
- **Token-driven** — change one CSS variable to retheme the entire platform
