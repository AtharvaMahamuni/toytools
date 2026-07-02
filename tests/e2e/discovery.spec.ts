// Discovery surfaces — the homepage tool directory and the sectioned category pages.
// Both replaced tile-grid walls; these specs pin the compact structure: full coverage
// with tool-group collapse, recent-tools chips, and pattern-based category sections.
import { test, expect } from '@playwright/test';

test.describe('homepage directory', () => {
  test('renders five category columns with collapsed tool groups', async ({ page }) => {
    await page.goto('/');
    const directory = page.getByRole('navigation', { name: 'All tools by category' });
    await expect(directory.locator('.dir-column')).toHaveCount(5);

    // Case converters collapse to a single entry that still covers every member slug.
    const caseEntry = directory.getByRole('link', { name: 'Case Converter' });
    await expect(caseEntry).toHaveCount(1);
    await expect(caseEntry).toHaveAttribute('data-group-slugs', /snake-case-converter/);

    // JSON tools (formatter, minifier, tree viewer) collapse the same way.
    const jsonEntry = directory.getByRole('link', { name: 'JSON Tools' });
    await expect(jsonEntry).toHaveCount(1);
    await expect(jsonEntry).toHaveAttribute('data-group-slugs', /json-tree-viewer/);

    // All tools, with every tool group collapsed to a single entry:
    //   −6 case converters (7→1), −2 JSON tools (3→1), −1 JSON↔YAML (2→1), −1 JSON↔CSV (2→1),
    //   −7 text cleanup (8→1), −5 encoders (6→1), −4 hash generators (5→1), −7 text counters (8→1).
    // 63 tools − 33 = 30 directory links (finance tools are not grouped).
    await expect(directory.locator('.dir-link')).toHaveCount(30);
  });

  test('recent chips appear after visiting a tool', async ({ page }) => {
    // An ungrouped tool surfaces under its own name (group members surface as
    // their group entry — covered by the next test).
    await page.goto('/tool/text/reverse-text/');
    await page.goto('/');
    const row = page.locator('#recent-row');
    await expect(row).toBeVisible();
    await expect(row.getByRole('link', { name: 'Reverse Text' })).toBeVisible();
  });

  test('a visited group member surfaces as its group entry', async ({ page }) => {
    await page.goto('/tool/text/snake-case-converter/');
    await page.goto('/');
    await expect(page.locator('#recent-row').getByRole('link', { name: 'Case Converter' })).toBeVisible();
  });
});

test.describe('category pages', () => {
  test('text-utilities groups into three titled sections', async ({ page }) => {
    await page.goto('/category/text-utilities/');
    const headings = page.locator('.cat-section-heading');
    await expect(headings).toHaveText(['Counting & Analysis', 'Case Conversion', 'Cleanup', 'Find & Compare']);

    // Grouped rows render mode chips: 7 case converters + 8 text-cleanup + 8 text counters.
    await expect(page.locator('.cat-chip')).toHaveCount(23);
    await expect(page.getByRole('link', { name: 'snake_case' })).toHaveAttribute(
      'href', /\/tool\/text\/snake-case-converter\/$/,
    );
  });

  test('single-section categories render no section headings', async ({ page }) => {
    await page.goto('/category/productivity/');
    await expect(page.locator('.cat-section-heading')).toHaveCount(0);
    await expect(page.locator('.cat-row')).toHaveCount(4);
  });
});
