// Home-nav option D: on a tool page the tool icon links home and wears a ToyTools badge.
// Runs on chromium (desktop) and pixel5 (mobile).
import { test, expect } from '@playwright/test';

const TOOL = '/tool/text/word-counter/';

test.describe('tool bar home link', () => {
  test('the tool icon is a labelled link to the home page with the badge inside it', async ({ page }) => {
    await page.goto(TOOL);
    const home = page.locator('.tool-bar [data-tb-home]');
    await expect(home).toBeVisible();
    await expect(home).toHaveAttribute('aria-label', 'ToyTools home');
    expect(await home.getAttribute('href')).toMatch(/\/$/);
    const badge = home.locator('[data-tb-badge]');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('alt', '');

    // The badge sits on the icon's bottom-right corner.
    const mark = await home.locator('.tb-mark').boundingBox();
    const b = await badge.boundingBox();
    expect(mark && b).toBeTruthy();
    expect(b!.x + b!.width).toBeGreaterThan(mark!.x + mark!.width);
    expect(b!.y + b!.height).toBeGreaterThan(mark!.y + mark!.height);
    expect(b!.x).toBeGreaterThan(mark!.x + mark!.width / 2);
    expect(b!.y).toBeGreaterThan(mark!.y + mark!.height / 2);

    // The link is exactly the icon's box, so the bar gained no width.
    const link = await home.boundingBox();
    expect(Math.round(link!.width)).toBe(Math.round(mark!.width));
  });

  test('clicking it goes home', async ({ page }) => {
    await page.goto(TOOL);
    await page.locator('.tool-bar [data-tb-home]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.tool-bar')).toHaveCount(0);
  });

  test('keyboard focus shows a visible ring', async ({ page }) => {
    await page.goto(TOOL);
    const home = page.locator('.tool-bar [data-tb-home]');
    await home.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(home).toBeFocused();
    const outline = await home.evaluate((el) => getComputedStyle(el).outlineStyle + ' ' + getComputedStyle(el).outlineWidth);
    expect(outline).toBe('solid 2px');
  });

  test('a short tool name stays on one line', async ({ page }) => {
    await page.goto(TOOL);
    const title = page.locator('.tb-title');
    const lh = await title.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    const box = await title.boundingBox();
    expect(box!.height).toBeLessThan(lh * 1.5);
  });

  test('the longest tool name is still shown whole', async ({ page }) => {
    await page.goto('/tool/math/combinations-permutations-calculator/');
    const title = page.locator('.tb-title');
    const clipped = await title.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
    expect(clipped).toBe(false);
  });

  test('platform pages have no tool-bar home link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-tb-home]')).toHaveCount(0);
  });
});
