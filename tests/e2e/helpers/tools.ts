// Shared E2E helpers — the reusable "framework", not copy-paste per spec.
//
// `toolPaths()` reads the BUILT sitemap (dist/sitemaps/tools.xml) and returns each
// tool's site-relative path. Reading the build artifact (not the source registry)
// decouples the tests from source path-aliases like `@tools` that Playwright won't
// resolve at runtime, and means every future tool is covered automatically.
//
// `DevTool` is a viewport-agnostic page object for the developer-engine widgets:
// it locates by role/label/id so the same locators work on desktop and mobile.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Page, Locator } from '@playwright/test';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../..');

/** Site-relative paths (e.g. `/tool/text/word-counter/`) for every tool in the sitemap. */
export function toolPaths(): string[] {
  const xml = readFileSync(resolve(repoRoot, 'dist/sitemaps/tools.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  return locs.map((loc) => new URL(loc).pathname);
}

/** Last non-empty path segment — the tool slug (e.g. `word-counter`). */
export function slugFromPath(path: string): string {
  return path.split('/').filter(Boolean).pop() ?? path;
}

/** Viewport-agnostic page object for an encoding/hashing/structured-data tool page. */
export class DevTool {
  readonly page: Page;
  readonly slug: string;
  constructor(page: Page, slug: string) {
    this.page = page;
    this.slug = slug;
  }
  async goto() {
    await this.page.goto(`/tool/developer-utilities/${this.slug}/`);
  }
  get input(): Locator {
    return this.page.locator(`#${this.slug}-input`);
  }
  get output(): Locator {
    return this.page.locator(`#${this.slug}-output`);
  }
  get status(): Locator {
    return this.page.locator(`#${this.slug}-status`);
  }
  get mode(): Locator {
    return this.page.locator(`#${this.slug}-mode`);
  }
  action(name: string): Locator {
    return this.page.getByRole('button', { name });
  }
  async fill(text: string) {
    await this.input.fill(text);
  }
}
