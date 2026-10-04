// Accessibility baseline.
//
// One sample of each page type rather than all 248 pages: the pages are generated from a handful
// of layouts, so a violation is nearly always a layout or component bug that shows up on the first
// page of its kind. Runs on Desktop and Pixel 5 like everything else.
//
// Scoped to serious and critical. Below that, axe reports a long tail of advisory items that would
// make this spec noise rather than a gate.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES: [string, string][] = [
  ['home', '/'],
  ['tool', '/tool/text/word-counter/'],
  ['calculator tool', '/tool/finance/compound-interest-calculator/'],
  ['guide', '/guide/productivity/pomodoro-technique/'],
  ['category', '/category/text-utilities/'],
  ['search', '/search/'],
  ['settings', '/settings/'],
  ['privacy', '/privacy/'],
  ['404', '/tool/text/does-not-exist/'],
  // The six beta-v12.3 tools: two math-engine widgets, a date-time widget and three hand-built
  // widgets. Type scale failed scrollable-region-focusable (8 nodes) before beta-v12.4.0.
  ['triangle solver', '/tool/math/triangle-solver/'],
  ['matrix calculator', '/tool/math/matrix-calculator/'],
  ['sleep cycle calculator', '/tool/datetime/sleep-cycle-calculator/'],
  ['color shades generator', '/tool/design/color-shades-generator/'],
  ['type scale generator', '/tool/design/type-scale-generator/'],
  ['file hash verifier', '/tool/developer-utilities/file-hash-verifier/'],
];

for (const [name, path] of PAGES) {
  test(`${name} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    // Hand-built widgets render their output after the runtime is ready; scan that state.
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      v => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      blocking.map(v => `${v.id}: ${v.help} (${v.nodes.length} node(s))`),
      `${name} (${path})`,
    ).toEqual([]);
  });
}

test('the open command palette is accessible', async ({ page }) => {
  await page.goto('/category/text-utilities/');
  await page.keyboard.press('/');
  await expect(page.locator('#tt-palette')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('#tt-palette')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter(
    v => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(blocking.map(v => `${v.id}: ${v.help}`)).toEqual([]);
});

test('the skip link is the first thing a keyboard reaches, and it works', async ({ page }) => {
  // A category page, not a tool page: text tools autofocus their textarea, so focus already sits
  // inside the content there and the first Tab moves on from it rather than to the skip link.
  await page.goto('/category/text-utilities/');
  await page.keyboard.press('Tab');

  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible(); // hidden until focused, so this proves the reveal

  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
