import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/gears/';

const ratio = (page: Page) => page.locator('[data-gears-ratio]');
const play = (page: Page) => page.locator('[data-feel-play]');
const exit = (page: Page) => page.locator('[data-feel-exit]');

test.describe('gears', () => {
  test('opens a 1 : 2 pair and keeps the mesh guardrail', async ({ page }) => {
    await page.goto(URL);
    await expect(ratio(page)).toHaveText('1 : 2');
    await expect(page.locator('[data-craft="gears-mesh"]')).toBeVisible();
    await expect(page.locator('[data-gears-driver="12"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-gears-driven="24"]')).toHaveAttribute('aria-pressed', 'true');
    const driven = await page.locator('[data-gears-driven-g]').getAttribute('transform');
    expect(driven).toMatch(/rotate\(/);
  });

  test('changing teeth updates the ratio when the pair still fits', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-gears-driver="8"]').click();
    await expect(ratio(page)).toHaveText('1 : 3');
  });

  test('Reset layout restores 12 and 24', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-gears-driver="16"]').click();
    await page.locator('[data-gears-reset]').click();
    await expect(ratio(page)).toHaveText('1 : 2');
    await expect(page.locator('[data-gears-driver="12"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('exposes a swipe-speed slider that writes Feel prefs', async ({ page }) => {
    await page.goto(URL);
    const slider = page.locator('[data-feel-spin-speed]');
    await expect(slider).toBeVisible();
    await slider.fill('0.05');
    await expect(page.locator('[data-feel-spin-speed-value]')).toHaveText('0.05×');
    await slider.fill('1.5');
    await expect(page.locator('[data-feel-spin-speed-value]')).toHaveText('1.5×');
    const stored = await page.evaluate(() => {
      const TT = (window as unknown as { ToyTools?: { prefs?: { get: (n: string, f?: unknown) => unknown } } }).ToyTools;
      return TT && TT.prefs ? TT.prefs.get('feel.spinSpeed', 1) : null;
    });
    expect(Number(stored)).toBeCloseTo(1.5);
  });

  test('Play hides page chrome and Exit restores it', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('.tool-signature')).toBeVisible();
    await expect(exit(page)).toBeHidden();
    await play(page).click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await expect(page.locator('.tool-signature')).toBeHidden();
    await expect(page.locator('.tool-bar')).toBeVisible();
    await expect(exit(page)).toBeVisible();
    await exit(page).click();
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);
    await expect(page.locator('.tool-signature')).toBeVisible();
  });
});
