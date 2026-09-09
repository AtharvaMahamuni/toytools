import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/kinetic-sand/';

const canvas = (page: Page) => page.locator('[data-sand-canvas]');
const reset = (page: Page) => page.locator('[data-sand-reset]');

test.describe('kinetic sand', () => {
  test('reserves a canvas box and exposes Reset pile', async ({ page }) => {
    await page.goto(URL);
    const box = await canvas(page).boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThan(80);
    await expect(reset(page)).toHaveAttribute('data-craft', 'sand-reset');
  });

  test('Reset pile stays available after a drag', async ({ page }) => {
    await page.goto(URL);
    const box = await canvas(page).boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 40, box!.y + box!.height / 2, { steps: 6 });
    await page.mouse.up();
    await reset(page).click();
    await expect(page.locator('[data-sand-status]')).toHaveText(/Mound restored|Drag through the pile/);
  });

  test('Play hides Zone B and keeps ToolBar', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-feel-play]').click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await expect(page.locator('.tool-signature')).toBeHidden();
    await expect(page.locator('.tool-bar')).toBeVisible();
    await page.locator('[data-feel-exit]').click();
    await expect(page.locator('.tool-signature')).toBeVisible();
  });
});
