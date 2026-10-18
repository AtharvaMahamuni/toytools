// Home-nav option D: on a tool page the tool icon links home and wears a ToyTools badge.
// Runs on chromium (desktop) and pixel5 (mobile); the narrow-width checks set their own viewport.
import { test, expect, type Page } from '@playwright/test';

const TOOL = '/tool/text/word-counter/';
const LONGEST = '/tool/math/combinations-permutations-calculator/';
const home = (page: Page) => page.locator('.tool-bar [data-tb-home]');

async function box(page: Page, sel: string) {
  const b = await page.locator(sel).first().boundingBox();
  if (!b) throw new Error(`no box for ${sel}`);
  return b;
}

test.describe('tool bar home link', () => {
  test('the icon is a labelled link home with the badge rendered at its bottom-right', async ({ page }) => {
    await page.goto(TOOL);
    await expect(home(page)).toBeVisible();
    await expect(home(page)).toHaveAccessibleName('ToyTools home');
    expect(await home(page).getAttribute('href')).toMatch(/\/$/);
    await expect(page.getByRole('link', { name: 'ToyTools home' })).toHaveCount(1);

    const badge = home(page).locator('[data-tb-badge]');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('alt', '');
    const mark = await box(page, '.tool-bar .tb-mark');
    const b = await box(page, '.tool-bar [data-tb-badge]');
    expect(Math.round(b.width)).toBe(14);
    expect(b.x + b.width).toBeCloseTo(mark.x + mark.width + 4, 0);
    expect(b.y + b.height).toBeCloseTo(mark.y + mark.height + 5, 0);

    const style = await badge.evaluate((el) => {
      const s = getComputedStyle(el);
      return { position: s.position, shadow: s.boxShadow, display: s.display };
    });
    expect(style.position).toBe('absolute');
    expect(style.display).not.toBe('none');
    expect(style.shadow).toMatch(/0px 0px 0px 2px/);

    // The link is exactly the icon's box, so the bar gained no width.
    const link = await box(page, '.tool-bar [data-tb-home]');
    expect(Math.round(link.width)).toBe(Math.round(mark.width));
  });

  for (const width of [320, 390]) {
    test(`the icon stays 22x22 next to the longest tool name at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(LONGEST);
      const mark = await box(page, '.tool-bar .tb-mark');
      expect(Math.round(mark.width)).toBe(22);
      expect(Math.round(mark.height)).toBe(22);
      await expect(home(page).locator('[data-tb-badge]')).toBeVisible();
      const clipped = await page.locator('.tb-title').evaluate((el) => el.scrollHeight > el.clientHeight + 1);
      expect(clipped).toBe(false);
    });
  }

  test('clicking it goes home', async ({ page }) => {
    await page.goto(TOOL);
    await home(page).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.tool-bar')).toHaveCount(0);
  });

  test('keyboard focus draws the ring around the icon and the badge', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(TOOL);
    // Reach it by keyboard so :focus-visible applies: focus, step back, then Tab onto it.
    await home(page).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(home(page)).toBeFocused();
    const ring = await home(page).evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), offset: parseFloat(s.outlineOffset) };
    });
    expect(ring.style).toBe('solid');
    expect(ring.width).toBe(2);
    const link = await box(page, '.tool-bar [data-tb-home]');
    const b = await box(page, '.tool-bar [data-tb-badge]');
    // The ring's inner edge sits `offset` px outside the link; the badge must end inside it.
    expect(b.x + b.width).toBeLessThanOrEqual(link.x + link.width + ring.offset);
    expect(b.y + b.height).toBeLessThanOrEqual(link.y + link.height + ring.offset);
  });

  test('a short tool name stays on one line', async ({ page }) => {
    await page.goto(TOOL);
    const title = page.locator('.tb-title');
    const lh = await title.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    const b = await title.boundingBox();
    expect(b!.height).toBeLessThan(lh * 1.5);
  });

  test('platform pages have no tool-bar home link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-tb-home]')).toHaveCount(0);
  });

  test('framed by another page: plain icon, no link, no badge', async ({ page, baseURL }) => {
    await page.setContent(`<iframe src="${baseURL}${TOOL}" width="390" height="600"></iframe>`);
    const frame = page.frameLocator('iframe');
    await expect(frame.locator('.tool-bar .tb-title')).toBeVisible();
    await expect(frame.locator('[data-tb-home]')).toHaveCount(0);
    await expect(frame.locator('[data-tb-badge]')).toHaveCount(0);
    await expect(frame.locator('.tool-bar .tb-mark')).toBeVisible();
    const mark = await frame.locator('.tool-bar .tb-mark').boundingBox();
    expect(Math.round(mark!.width)).toBe(22);
  });

  test('installed app (display-mode standalone): plain icon, no link, no badge', async ({ page }) => {
    await page.addInitScript(() => {
      const real = window.matchMedia.bind(window);
      window.matchMedia = (q: string) =>
        q.includes('display-mode: standalone')
          ? ({ matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false } as MediaQueryList)
          : real(q);
    });
    await page.goto(TOOL);
    await expect(page.locator('.tool-bar .tb-title')).toBeVisible();
    await expect(page.locator('[data-tb-home]')).toHaveCount(0);
    await expect(page.locator('[data-tb-badge]')).toHaveCount(0);
    await expect(page.locator('.tool-bar .tb-mark')).toBeVisible();
  });
});
