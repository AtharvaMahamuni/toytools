// Favourites: pin a tool, find it again from anywhere.
import { test, expect } from '@playwright/test';

const TOOL = '/tool/text/word-counter/';

test.describe('favourites', () => {
  test('the star persists across a reload', async ({ page }) => {
    await page.goto(TOOL);
    const star = page.locator('[data-favorite="word-counter"]');
    await expect(star).toHaveAttribute('aria-pressed', 'false');

    await star.click();
    await expect(star).toHaveAttribute('aria-pressed', 'true');
    await expect(star).toContainText('Favourited');

    await page.reload();
    await expect(page.locator('[data-favorite="word-counter"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('unstarring removes it again', async ({ page }) => {
    await page.goto(TOOL);
    const star = page.locator('[data-favorite="word-counter"]');
    await star.click();
    await expect(star).toHaveAttribute('aria-pressed', 'true');
    await star.click();
    await expect(star).toHaveAttribute('aria-pressed', 'false');

    await page.goto('/');
    await expect(page.locator('#favorite-row')).toBeHidden();
  });

  // Chips are clones of the directory links, and members of a tool group collapse into one group
  // entry there, so these use ungrouped tools and assert their own names (see discovery.spec).
  test('a favourited tool appears on the home page', async ({ page }) => {
    await page.goto('/tool/text/reverse-text/');
    await page.locator('[data-favorite="reverse-text"]').click();

    await page.goto('/');
    const row = page.locator('#favorite-row');
    await expect(row).toBeVisible();
    await expect(row.getByRole('link', { name: 'Reverse Text' })).toBeVisible();
  });

  test('a favourite is not repeated in the recent row', async ({ page }) => {
    await page.goto('/tool/text/reverse-text/');
    await page.locator('[data-favorite="reverse-text"]').click();
    // Scientific Calculator is deliberately ungrouped, so it surfaces under its own name here
    // (a grouped tool would collapse to its group entry, which is the next test's subject).
    await page.goto('/tool/number/scientific-calculator/');

    await page.goto('/');
    await expect(page.locator('#favorite-chips').getByRole('link', { name: 'Reverse Text' })).toBeVisible();
    await expect(page.locator('#recent-chips').getByRole('link', { name: 'Reverse Text' })).toHaveCount(0);
    await expect(page.locator('#recent-chips').getByRole('link', { name: 'Scientific Calculator' })).toBeVisible();
  });

  test('favourites lead the palette before anything is typed', async ({ page }) => {
    await page.goto('/tool/text/reverse-text/');
    await page.locator('[data-favorite="reverse-text"]').click();

    await page.goto('/tool/number/tip-calculator/');
    await page.keyboard.press('Control+k');

    const first = page.locator('#tt-palette [data-url]').first();
    await expect(first).toContainText('Reverse Text');
    await expect(first).toContainText('Favourite');
  });
});
