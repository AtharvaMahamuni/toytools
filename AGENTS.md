# Repository Guidelines

## Project Structure & Module Organization

ToyTools is an Astro site using strict TypeScript. Route files live in `src/pages/`, including dynamic routes such as `src/pages/tools/[slug].astro` and `src/pages/categories/[slug].astro`. Shared Astro components are in `src/components/`, page wrappers are in `src/layouts/`, and catalog data/types are in `src/data/`. Global CSS is split across `src/styles/reset.css`, `tokens.css`, and `global.css`. Static assets belong in `public/`; generated output in `dist/` should not be edited by hand.

## Build, Test, and Development Commands

- `npm install`: install dependencies. Requires Node `>=22.12.0`.
- `npm run dev`: start the Astro development server, usually at `localhost:4321`.
- `npm run build`: create the production build in `dist/`.
- `npm run preview`: serve the built site locally for verification.
- `npm run astro -- --help`: inspect Astro CLI commands.

Run commands from the repository root.

## Coding Style & Naming Conventions

Use two-space indentation in `.astro`, `.ts`, and CSS files. Prefer single quotes in TypeScript imports and data files. Use the configured path aliases (`@components/*`, `@data/*`, `@layouts/*`, `@styles/*`) instead of long relative imports. Name Astro components in PascalCase, for example `ToolCard.astro`; use kebab-case for slugs and URL-facing data such as `word-counter` or `developer-tools`. Keep data objects typed through `src/data/types.ts` and update `updatedAt` values using `YYYY-MM-DD`.

## Testing Guidelines

There is no committed test script yet. For current changes, run `npm run build` as the baseline verification because it validates Astro rendering and strict TypeScript. Playwright is installed, so future browser tests should live in a clear test directory such as `tests/` or `e2e/`, use descriptive names like `tool-search.spec.ts`, and add a matching npm script before relying on them in reviews.

## Commit & Pull Request Guidelines

Git history currently contains only `Initial commit`, so no detailed project-specific convention is established. Use short, imperative commit subjects such as `Add category page metadata` or `Fix tool card spacing`. Pull requests should include a focused summary, verification steps (`npm run build`, screenshots for visual changes), linked issues when available, and notes for any new routes, data entries, or configuration changes.

## Agent-Specific Instructions

Keep edits scoped to source files and documentation. Do not modify generated `dist/` output unless the task explicitly requires checking build artifacts. When adding tools or categories, update the typed data modules first and let pages consume that data through existing components.
