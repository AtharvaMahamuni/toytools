import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/slime/';

const canvas = (page: Page) => page.locator('[data-slime-canvas]');
const release = (page: Page) => page.locator('[data-slime-release]');

test.describe('slime', () => {
  test('reserves a canvas and keeps Release hidden until stuck', async ({ page }) => {
    await page.goto(URL);
    const box = await canvas(page).boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(80);
    await expect(release(page)).toBeHidden();
    await expect(release(page)).toHaveAttribute('data-craft', 'slime-release');
  });

  test('a grab and release on the canvas does not show Release', async ({ page }) => {
    await page.goto(URL);
    const box = await canvas(page).boundingBox();
    expect(box).toBeTruthy();
    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 30, y - 20, { steps: 4 });
    await page.mouse.up();
    await expect(release(page)).toBeHidden();
  });

  test('Play hides page chrome', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-feel-play]').click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);
  });

  test('missed pointerup shows Release and unsticks', async ({ page }) => {
    await page.goto(URL);
    const box = await canvas(page).boundingBox();
    expect(box).toBeTruthy();
    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 24, y - 18, { steps: 3 });
    await canvas(page).dispatchEvent('pointercancel');
    await expect(release(page)).toBeVisible();
    await release(page).click();
    await expect(release(page)).toBeHidden();
  });
});
