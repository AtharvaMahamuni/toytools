// The fold ratchet — the invariant that a tool page leads with its tool.
//
// ToyTools is phone-first and every tool installs to the home screen, so a tool page has to
// read as an application on a 393px screen rather than as an article with a widget in it.
// Nothing checked that, and it drifted. Measured across all 119 tools on Pixel 5 (2026-08-08):
// the chrome above the tool eats a median 59% of the first screen, and 30 tools (a quarter of
// the catalog) put no interactive control on the first screen at all. Desktop sat at a healthy
// 38-55% the whole time, which is exactly why reading the page on a laptop never surfaced it.
//
// TWO numbers, because they fail for different reasons and one alone is misleading:
//
//   CHROME_LIMIT  where the tool BEGINS: .tool-header's bottom edge over the viewport. This is
//                 platform-owned (nav, breadcrumb, title, description, trust, install) and is
//                 near-identical on every tool page, so it is the number the identity phases
//                 actually move.
//   FOLD_LIMIT    where the tool becomes USABLE: the first control inside the tool body. This
//                 one is widget-owned and is deliberately loose, because mobile stacking is
//                 answer-first by design (output above input): lorem-ipsum-generator measures
//                 176% not because it has a masthead but because its result panel correctly
//                 sits above its controls. Holding that to a tight number would be a test
//                 demanding the design rules be broken.
//
// Both are ratchets, like BUDGETS in scripts/check-budget.ts and THRESHOLDS in
// scripts/check-query-coverage.ts: they record what the catalog achieves today and only ever
// move DOWN, in the same commit as the change that earns it. Never raise one to make a build
// pass. A rise means a page grew chrome, which is the regression this file exists to catch.
//
// Pixel 5 only. The geometry is not in question on desktop, and asserting it there would spend
// CI proving something that has never been at risk.
//
// Plan and full measured baseline: docs/analysis/2026-08-08-tool-identity-architecture.md
import { test, expect } from '@playwright/test';
import { toolPaths, slugFromPath } from './helpers/tools';

/**
 * Ceiling for where the tool begins, as a fraction of the viewport height.
 *
 * 2026-08-08 baseline: min 0.51, median 0.59, worst 0.748
 * (combinations-permutations-calculator). An honest record of a bad state, not a target.
 *
 * Tighten to 0.32 after the header rebuild (phase 2) and 0.22 after the trust and install
 * affordances move below the widget (phase 4).
 */
const CHROME_LIMIT = 0.75;

/**
 * Ceiling for where the tool becomes usable. Loose on purpose: see the note above about
 * answer-first stacking.
 *
 * 2026-08-08 baseline: median 0.80, worst 1.758 (lorem-ipsum-generator).
 */
const FOLD_LIMIT = 1.76;

/** Controls a visitor can actually operate. Anchors are excluded: a link is not the tool. */
const CONTROL = 'textarea, input:not([type=hidden]), select, button';

test.describe('the tool owns the top of its page', () => {
  // The chrome above the widget is platform-owned and therefore identical on every tool page,
  // so CHROME_LIMIT holds for all of them or none. Running the whole registry rather than a
  // sample is still what catches the outliers: a ten-tool sample of this suite reported a worst
  // case of 139% and missed lorem-ipsum-generator at 176% entirely.
  for (const path of toolPaths()) {
    const slug = slugFromPath(path);

    test(`fold: ${slug}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'pixel5', 'phone geometry only');

      await page.goto(path, { waitUntil: 'load' });
      // Engine runtimes attach lazily (see src/lib/runtime/index.ts) and some widgets render
      // their controls on attach, so measuring at `load` can measure a page that has not
      // finished becoming itself.
      await page.waitForLoadState('networkidle');

      const measured = await page.evaluate((sel) => {
        // Everything above the tool body is chrome. The header's bottom edge is the boundary,
        // so a control belonging to the header (the favourite star, the install button) is
        // never mistaken for the tool.
        const header = document.querySelector('.tool-header');
        const floor = header ? header.getBoundingClientRect().bottom + window.scrollY : 0;

        const first = [...document.querySelectorAll(`main ${sel}`)]
          .map((el) => ({ el, rect: el.getBoundingClientRect() }))
          // A zero-size control is not on screen: install sheets and dialogs sit in the DOM of
          // every page and would otherwise win this race from inside a closed overlay.
          .filter(({ rect }) => rect.height > 0 && rect.width > 0)
          .filter(({ rect }) => rect.top + window.scrollY >= floor - 1)
          .sort((a, b) => a.rect.top - b.rect.top)[0];

        return {
          viewport: window.innerHeight,
          chrome: Math.round(floor),
          top: first ? Math.round(first.rect.top + window.scrollY) : null,
        };
      }, CONTROL);

      expect(measured.chrome, `${slug} renders no .tool-header`).toBeGreaterThan(0);
      expect(measured.top, `${slug} renders no interactive control`).not.toBeNull();

      const chromeRatio = measured.chrome / measured.viewport;
      expect(
        chromeRatio,
        `${slug}: the tool starts ${measured.chrome}px into a ${measured.viewport}px viewport ` +
          `(${(chromeRatio * 100).toFixed(0)}% of the first screen spent before the tool; ` +
          `ceiling ${(CHROME_LIMIT * 100).toFixed(0)}%). Shrink the chrome above the tool. ` +
          `Do not raise CHROME_LIMIT.`,
      ).toBeLessThanOrEqual(CHROME_LIMIT);

      const foldRatio = measured.top! / measured.viewport;
      expect(
        foldRatio,
        `${slug}: first control at ${measured.top}px of a ${measured.viewport}px viewport ` +
          `(${(foldRatio * 100).toFixed(0)}% of the fold; ceiling ` +
          `${(FOLD_LIMIT * 100).toFixed(0)}%). Do not raise FOLD_LIMIT.`,
      ).toBeLessThanOrEqual(FOLD_LIMIT);
    });
  }
});
