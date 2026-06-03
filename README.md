# ToyTools

Tiny tools for everyday problems.

Live at **[atharvamahamuni.github.io/toytools](https://atharvamahamuni.github.io/toytools)**

---

## Architecture

Static site built with [Astro](https://astro.build). Every page is pre-rendered at build time — no server, no database, no client-side framework.

```
src/
  components/       # Nav, SearchBar, ToolCard, CategoryCard, Footer
  data/             # Tool and Category definitions (TypeScript)
  layouts/          # BaseLayout, ToolLayout
  pages/            # index, tools/[slug], categories/[slug], 404
  styles/           # tokens.css, reset.css, global.css
  lib/              # withBase() path helper
```

Design system: CSS custom properties only. One `--color-accent` token controls all accent usage. Dark mode via `prefers-color-scheme` + a localStorage toggle. Zero JS frameworks shipped to the client.

---

## How It Works

**Adding a tool**

1. Add an entry to `src/data/tools.ts`
2. Add UI to the matching slot in `src/pages/tools/[slug].astro` — inputs go in `slot="inputs"`, the primary button in `slot="action"`, output in `slot="result"`
3. The tool page, category listing, and homepage "Recently added" section update automatically at build time

**Page flow** (enforced by `ToolLayout.astro` named slots):

```
Title → Description → Inputs → Action → Result → Explanation → FAQ → Related Tools
```

**Routing**

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/tools/[slug]` | `src/pages/tools/[slug].astro` |
| `/categories/[slug]` | `src/pages/categories/[slug].astro` |
| `/404` | `src/pages/404.astro` |

---

## Project Vision

A platform for small, fast, focused utility tools. Each tool solves exactly one problem. No accounts. No tracking. No upsells.

Design principles (frozen):

- **Clarity over delight** — the interface disappears behind the tool
- **Mobile first** — thumb-reachable actions, 48px minimum touch targets
- **Performance is a feature** — HTML + CSS + minimal JS, no heavy bundles
- **Token-driven** — change one CSS variable to retheme the entire platform

---

## Development Setup

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # static output → dist/
npm run preview    # serve dist/ locally
```

**Building for GitHub Pages** (base path `/toytools`):

```sh
ASTRO_SITE=https://atharvamahamuni.github.io \
ASTRO_BASE_PATH=/toytools \
npm run build
```

Deployment is automatic via `.github/workflows/deploy.yml` on every push to `main`.

---

## Roadmap

**Current tools (4)**
- Word Counter
- Case Converter
- Percentage Calculator
- Base64 Encoder / Decoder

**Planned**
- JSON Formatter
- URL Encoder / Decoder
- Markdown Preview
- Color Converter
- Unix Timestamp Converter
- Lorem Ipsum Generator
- Regex Tester
- Diff Checker
