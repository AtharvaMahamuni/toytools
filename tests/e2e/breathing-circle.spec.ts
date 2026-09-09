import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/breathing-circle/';

test.describe('breathing circle', () => {
  test('defaults to Box 4-4-4-4 with named presets', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-craft="breathing-presets"]')).toBeVisible();
    await expect(page.locator('[data-br-preset="box"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-br-status]')).toContainText('Box');
    await expect(page.locator('[data-br-status]')).toContainText('4-4-4-4');
  });

  test('switching to 4-7-8 changes the labelled pattern', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-br-preset="4-7-8"]').click();
    await expect(page.locator('[data-br-preset="4-7-8"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-br-status]')).toContainText('4-7-8');
  });

  test('Play session uses the night surface and Exit restores', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-feel-play]').click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await expect(page.locator('html')).toHaveAttribute('data-feel-play-surface', 'night');
    await expect(page.locator('.tool-signature')).toBeHidden();
    await page.locator('[data-feel-exit]').click();
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);
  });
});
