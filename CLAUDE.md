# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # static output → dist/
npm run preview  # serve dist/ locally

# Production build (GitHub Pages — base path /toytools)
ASTRO_SITE=https://atharvamahamuni.github.io ASTRO_BASE_PATH=/toytools npm run build
```

`npm run build` is the verification step — it runs Astro rendering and strict TypeScript together. There are no separate lint or test scripts.

## Architecture

**Data-driven static site.** All pages are pre-rendered at build time. No server, no database, no client-side framework.

### Adding a tool (2 steps)

1. Create `src/tools/<slug>/` with two required files:
   - `config.ts` — exports a named `const config: ToolConfig` with all tool metadata
   - `Widget.astro` — self-contained Astro component: HTML + `<style is:global>` + `<script is:inline>`
2. Add one import line and one array entry in `src/data/registry.ts` — **this is the only other file that changes**.

All tool pages, category pages, search, and homepage update automatically at build time.

### Removing a tool (2 steps)

1. Delete `src/tools/<slug>/`
2. Remove the import and array entry from `src/data/registry.ts`

Nothing else needs to change.

### Adding a guide or FAQ to a tool

In `config.ts`, add a `guide: GuideConfig` and/or `faq: FaqConfig` object.
Then create `Guide.astro` and/or `faq.ts` in the same tool directory.

For a new guide, also add a static import to `src/pages/guide/[...slug].astro`.
For a new FAQ, also add an import to `src/data/faq-registry.ts`.

### Tool directory structure

```
src/tools/<slug>/
├── config.ts        # ToolConfig — slug, name, description, categorySlug, tags, guide?, faq?
├── Widget.astro     # Self-contained tool UI (required)
├── faq.ts           # exports: const items: FAQItem[] (optional — only if tool has FAQ)
└── Guide.astro      # Wraps GuideLayout with full guide content (optional)
```

Shared sub-components for widgets: `src/tools/_shared/ToolSection.astro`, `ToolAction.astro`.

### Data layer

```
src/data/
├── types.ts          # ToolConfig, GuideConfig, FaqConfig, FAQItem, Category, EcosystemEntry
├── categories.ts     # Category definitions (accent colors, segments)
├── registry.ts       # Single source of truth — imports all tool configs
└── faq-registry.ts   # Imports all faq.ts files by tool slug
```

### Widget JavaScript rules

All tool scripts use `<script is:inline>` inside `Widget.astro`:
- No TypeScript, no imports, no `import.meta.env`
- Access shared helpers via `ToyTools.*` global (from `ToyToolsRuntime.astro` in BaseLayout):
  - `ToyTools.toast(msg)` — show the global toast notification
  - `ToyTools.storage.get/set/clear(key)` — localStorage with 50 KB cap
  - `ToyTools.copy(text)` — clipboard copy with toast feedback
- localStorage key convention: `toytools.<slug>.<field>`, 50 KB cap

### BackButton

`src/components/BackButton.astro` renders a mobile-only ← Back button (hidden above 640px).
It is automatically included in `ToolLayout`, `FAQLayout`, and `GuideLayout`.
Do not add it manually in widgets.

### Path/URL handling — always use `withBase`

Every internal `href` and form `action` must go through `src/lib/paths.ts:withBase()`. It prepends `import.meta.env.BASE_URL` (empty locally, `/toytools` on GitHub Pages). Bypassing it breaks deployed links.

```ts
// correct
<a href={withBase(`/categories/${category.slug}/`)}>
// wrong — breaks on GitHub Pages
<a href={`/categories/${category.slug}/`}>
```

`withBase` is a build-time server function; do not call it inside `<script is:inline>`.

### Dark mode

Two CSS layers in `src/styles/tokens.css`:
- `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])` — respects OS preference
- `:root[data-theme="dark"]` — user override

The user's choice is stored in `localStorage` and applied before first paint by an inline script in `BaseLayout.astro`'s `<head>`. Toggle logic lives in `Nav.astro`.

### CopyButton protocol

`CopyButton.astro` reads two data attributes on its target element:
- `data-empty` — present when output is the placeholder state → shows "Nothing to copy!" toast
- `data-error` — present when output is an error state, value is the error message → shows that message as toast, blocks copy

Add `data-copy-bar` to any panel header that should turn green on copy.

### CSS design system

All values come from `src/styles/tokens.css` custom properties. Key constraints:
- Single accent token: `--color-accent`. Change it to retheme everything.
- Transitions: only `color`, `background-color`, `border-color`. Durations: `150ms` or `200ms` only.
- Touch targets: minimum `var(--touch-target)` (48px).
- Widths: tool pages `var(--width-tool)` (800px), category/nav `var(--width-category)` / `var(--width-nav)` (1200px). Applied via `BaseLayout`'s `maxWidth` prop on an inner `.page-content` div — `<main>` itself always spans nav width to keep left-edge alignment consistent.
- Shared widget CSS lives in `src/styles/tool-widget.css` (imported by `global.css`).

### TypeScript path aliases

`@components/*`, `@data/*`, `@layouts/*`, `@styles/*`, `@tools/*`, `@lib/*` — configured in `tsconfig.json`, auto-synced to Vite by Astro.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with `ASTRO_BASE_PATH=/toytools` and deploys `dist/` to GitHub Pages at `https://atharvamahamuni.github.io/toytools/`.
