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

### How a tool gets rendered

1. Add a `Tool` entry to `src/data/tools.ts` (typed by `src/data/types.ts`).
2. `src/pages/tools/[slug].astro` picks it up via `getStaticPaths`, which maps every tool to `{ params, props }` including the resolved `Category`.
3. The page renders into `ToolLayout.astro`, which wraps `BaseLayout.astro` and exposes named slots in the frozen page-flow order: `inputs → action → result → explanation → faq → related`.
4. Category pages and the search page update automatically — they read from the same data arrays.

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

### JavaScript rules

All scripts use `<script is:inline>` (not Astro module scripts), which means:
- No TypeScript, no imports, no `import.meta.env`
- Each script is output verbatim into the HTML
- `src/lib/storage.ts` documents the localStorage key convention (`toytools.<slug>.<field>`, 50 KB cap) but cannot be imported — copy the pattern inline

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

### TypeScript path aliases

`@components/*`, `@data/*`, `@layouts/*`, `@styles/*` — configured in `tsconfig.json`, auto-synced to Vite by Astro.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with `ASTRO_BASE_PATH=/toytools` and deploys `dist/` to GitHub Pages at `https://atharvamahamuni.github.io/toytools/`.
