import { test, expect } from '@playwright/test';

const PATH = '/tool/number/height-comparison/';

async function ready(page: import('@playwright/test').Page) {
  await page.goto(PATH);
  await expect(page.locator('.hc-mark')).toHaveCount(2);
}

test.describe('height comparison', () => {
  test('opens with You beside the door', async ({ page }) => {
    await ready(page);
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 33.2 cm taller than You.');
  });

  test('offers 5 ft 11 in when feet mode is given 5.11', async ({ page }) => {
    await ready(page);
    await page.locator('#height-comparison-unit-ft').click();
    await page.locator('#height-comparison-height-you').fill('5.11');
    const note = page.locator('#height-comparison-note');
    await expect(note).toBeVisible();
    await expect(note).toContainText('5 ft 11 in');
    await page.locator('#height-comparison-note-action').click();
    await expect(note).toBeHidden();
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 9 in taller than You.');
    await expect(page.locator('#height-comparison-height-you')).toHaveValue('5 ft 11 in');
  });

  test('stays silent for 5 ft 11 in and for 180 cm', async ({ page }) => {
    await ready(page);
    const note = page.locator('#height-comparison-note');
    await page.locator('#height-comparison-unit-ft').click();
    await page.locator('#height-comparison-height-you').fill("5'11");
    await expect(note).toBeHidden();
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 9 in taller than You.');

    await page.locator('#height-comparison-unit-cm').click();
    await page.locator('#height-comparison-height-you').fill('180');
    await expect(note).toBeHidden();
    await expect(page.locator('#height-comparison-hero')).toContainText('Door is');
    await expect(page.locator('#height-comparison-hero')).toContainText('taller than You');
  });

  test('adds a preset and removes a mark', async ({ page }) => {
    await ready(page);
    await page.getByRole('button', { name: 'Average man' }).click();
    await expect(page.locator('#height-comparison-sheet')).toContainText('Average man');
    await page.locator('#height-comparison-remove-door').click();
    await expect(page.locator('#height-comparison-sheet')).not.toContainText('Door');
    await expect(page.locator('#height-comparison-hero')).not.toContainText('Door');
  });

  test('draws every bar with a real height', async ({ page }) => {
    await ready(page);
    const heights = await page.locator('.hc-mark').evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().height),
    );
    expect(heights).toHaveLength(2);
    for (const h of heights) expect(h).toBeGreaterThan(20);
    // The door (203.2 cm) stands taller than You (170 cm).
    expect(heights[1]!).toBeGreaterThan(heights[0]!);
  });

  test('accepts 5 ft 11.5 in and curly quotes', async ({ page }) => {
    await ready(page);
    await page.locator('#height-comparison-unit-ft').click();
    await expect(page.locator('#height-comparison-height-you')).toHaveAttribute('inputmode', 'text');
    await page.locator('#height-comparison-height-you').fill('5 ft 11.5 in');
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 8.5 in taller than You.');
    await page.locator('#height-comparison-height-you').fill('5\u201911');
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 9 in taller than You.');
  });

  test('does not scroll the page sideways', async ({ page }) => {
    await ready(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('height comparison stores nothing (audit H-1)', () => {
  test('typed names and heights never reach storage, and reload shows the defaults', async ({ page }) => {
    await ready(page);
    await page.locator('#height-comparison-unit-ft').click();
    await page.locator('#height-comparison-height-you').fill("6'2");
    await page.locator('#height-comparison-height-you').blur();
    const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.includes('height-comparison')));
    expect(stored).toEqual([]);
    await page.reload();
    await expect(page.locator('.hc-mark')).toHaveCount(2);
    await expect(page.locator('#height-comparison-hero')).toHaveText('Door is 33.2 cm taller than You.');
  });

  test('a record an older build left behind is removed, not restored', async ({ page }) => {
    await page.goto(PATH);
    await page.evaluate(() =>
      localStorage.setItem(
        'toytools:height-comparison',
        JSON.stringify({ v: 1, data: { unit: 'ft', figures: [{ id: 'p1', name: 'Secret', cm: 150, kind: 'person' }] } }),
      ),
    );
    await page.reload();
    await expect(page.locator('.hc-mark')).toHaveCount(2);
    await expect(page.getByText('Secret')).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem('toytools:height-comparison'))).toBeNull();
  });
});
