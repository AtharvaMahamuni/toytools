// Discovery surfaces — the homepage tool directory and the sectioned category pages.
// Both replaced tile-grid walls; these specs pin the compact structure: full coverage
// with tool-group collapse, recent-tools chips, and pattern-based category sections.
import { test, expect } from '@playwright/test';

test.describe('homepage directory', () => {
  test('renders four category columns with collapsed tool groups', async ({ page }) => {
    await page.goto('/');
    const directory = page.getByRole('navigation', { name: 'All tools by category' });
    await expect(directory.locator('.dir-column')).toHaveCount(4);

    // Case converters collapse to a single entry that still covers every member slug.
    const caseEntry = directory.getByRole('link', { name: 'Case Converter' });
    await expect(caseEntry).toHaveCount(1);
    await expect(caseEntry).toHaveAttribute('data-group-slugs', /snake-case-converter/);

    // JSON tools (formatter, minifier, tree viewer) collapse the same way.
    const jsonEntry = directory.getByRole('link', { name: 'JSON Tools' });
    await expect(jsonEntry).toHaveCount(1);
    await expect(jsonEntry).toHaveAttribute('data-group-slugs', /json-tree-viewer/);

    // 48 tools, with every tool group collapsed to a single entry:
    //   −6 case converters (7→1), −2 JSON tools (3→1), −1 JSON↔YAML (2→1), −1 JSON↔CSV (2→1).
    // 48 − 10 = 38 directory links.
    await expect(directory.locator('.dir-link')).toHaveCount(38);
  });

  test('recent chips appear after visiting a tool', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.goto('/');
    const row = page.locator('#recent-row');
    await expect(row).toBeVisible();
    await expect(row.getByRole('link', { name: 'Word Counter' })).toBeVisible();
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

    // The case-converter group renders as one row with all seven mode chips.
    await expect(page.locator('.cat-chip')).toHaveCount(7);
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
