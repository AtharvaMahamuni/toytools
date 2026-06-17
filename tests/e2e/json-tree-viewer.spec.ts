// Deep functional suite for the JSON Tree Viewer — exercises the interactive widget
// (summary, collapse/expand, search + match navigation, copy, large-payload guard) end to
// end on both viewports. The tree UI is custom, so it gets its own locators rather than the
// generic DevTool page object.
//
// Layout note: desktop shows input + tree side by side; below 1024px a pill switches between
// them and the tree pane starts hidden. `showTree()` taps that pill when it is visible (mobile),
// and is a no-op on desktop — so the same assertions run on both projects.
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'json-tree-viewer';

async function showTree(page: Page) {
  const tab = page.locator('.jtv-mtab[data-view="tree"]');
  if (await tab.isVisible()) await tab.click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(`/tool/developer-utilities/${SLUG}/`);
});

test('renders a tree and summary for valid JSON', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('{"user":{"name":"Ada","roles":["admin","author"]}}');
  await showTree(page);

  await expect(page.locator('#jtv-status')).toContainText('✓ Valid');
  await expect(page.locator('#jtv-summary')).toBeVisible();
  // Object-member keys across the document: user, name, roles = 3
  await expect(page.locator('#jtv-keys')).toHaveText('3');
  await expect(page.locator('.jtv-row').first()).toBeVisible();
  await expect(page.locator('.jtv-key', { hasText: 'name' })).toBeVisible();
});

test('shows a parse error for invalid JSON', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('{bad');
  await showTree(page);
  await expect(page.locator('#jtv-status')).toContainText('✗');
  await expect(page.locator('#jtv-tree-section')).toBeHidden();
});

test('expand all / collapse all toggles deep nodes', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('{"user":{"name":"Ada","roles":["admin","author"]}}');
  await showTree(page);

  const deepValue = page.locator('.jtv-val.jtv-string', { hasText: 'admin' });

  await page.getByRole('button', { name: 'Expand all' }).click();
  await expect(deepValue).toBeVisible();

  await page.getByRole('button', { name: 'Collapse all' }).click();
  await expect(deepValue).toBeHidden();
});

test('search highlights matches and reports Match N of M', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('{"a":{"name":"x"},"b":{"name":"y"}}');
  await showTree(page);

  await page.locator('#jtv-search').fill('name');
  await expect(page.locator('#jtv-matchinfo')).toHaveText(/Match 1 of 2/);
  await expect(page.locator('.jtv-row.is-match')).toHaveCount(2);

  await page.locator('#jtv-next').click();
  await expect(page.locator('#jtv-matchinfo')).toHaveText(/Match 2 of 2/);
});

test('large payloads are guarded until Render anyway', async ({ page }) => {
  test.slow(); // the opted-in full render of thousands of nodes is intentionally heavy
  // Just over the ~5000-node render guard.
  const big = JSON.stringify(Array.from({ length: 5200 }, (_, i) => i));
  await page.locator(`#${SLUG}-input`).fill(big);
  await showTree(page);

  await expect(page.locator('#jtv-guard')).toBeVisible();
  await expect(page.locator('#jtv-tree-section')).toBeHidden();
  // Summary still renders so the user knows what they pasted.
  await expect(page.locator('#jtv-summary')).toBeVisible();

  await page.getByRole('button', { name: 'Render anyway' }).click();
  await expect(page.locator('#jtv-tree-section')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#jtv-guard')).toBeHidden();
});

test('download button is present for valid JSON', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('{"a":1}');
  await showTree(page);
  await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
});
