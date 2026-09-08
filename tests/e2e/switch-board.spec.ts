// Switch Board behaviour on desktop Chromium and Pixel 5.
//
// Unit tests cover Feel itself; this spec locks the widget contract: latch once per press,
// All off craft, Feel strip writes the shared prefs, keyboard is one tab stop.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/switch-board/';

const switches = (page: Page) => page.locator('[data-sb-switch]');
const status = (page: Page) => page.locator('[data-sb-status]');
const allOff = (page: Page) => page.locator('[data-sb-all-off]');
const board = (page: Page) => page.locator('[data-sb-board]');

test.describe('switch board', () => {
  test('flipping one switch latches it and updates the count', async ({ page }) => {
    await page.goto(URL);

    await expect(switches(page)).toHaveCount(16);
    await expect(status(page)).toHaveText('0 on');
    await expect(allOff(page)).toBeHidden();

    const first = switches(page).first();
    await expect(first).toHaveAttribute('aria-pressed', 'false');

    await first.click();

    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(first).toHaveClass(/is-on/);
    await expect(status(page)).toHaveText('1 on');
    await expect(allOff(page)).toBeVisible();
  });

  test('a second activation on the same press does not double-flip', async ({ page }) => {
    await page.goto(URL);

    const first = switches(page).first();
    await first.dispatchEvent('pointerdown', { button: 0 });
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(status(page)).toHaveText('1 on');

    // The matching click from the same press must not unlatch.
    await first.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(status(page)).toHaveText('1 on');
  });

  test('All off clears every latch and hides itself', async ({ page }) => {
    await page.goto(URL);

    for (const i of [0, 3, 7, 15]) {
      await switches(page).nth(i).click();
    }
    await expect(status(page)).toHaveText('4 on');
    await expect(allOff(page)).toBeVisible();
    await expect(allOff(page)).toHaveAttribute('data-craft', 'switch-board-all-off');

    await allOff(page).click();

    await expect(status(page)).toHaveText('0 on');
    await expect(allOff(page)).toBeHidden();
    for (let i = 0; i < 16; i++) {
      await expect(switches(page).nth(i)).toHaveAttribute('aria-pressed', 'false');
    }
  });

  test('local Sound and Haptics toggles write the same feel prefs as Settings', async ({
    page,
  }) => {
    await page.goto(URL);

    await expect(page.locator('[data-sb-sound="on"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-sb-haptics="off"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-sb-sound="off"]').click();
    await page.locator('[data-sb-haptics="on"]').click();

    const prefs = await page.evaluate(() => {
      const TT = (window as unknown as { ToyTools?: { prefs?: { get: (k: string, f?: unknown) => unknown } } }).ToyTools;
      if (!TT?.prefs) return null;
      return {
        sound: TT.prefs.get('feel.sound', true),
        haptics: TT.prefs.get('feel.haptics', false),
      };
    });
    expect(prefs).toEqual({ sound: false, haptics: true });
  });

  test('the board is one tab stop, not sixteen', async ({ page }) => {
    await page.goto(URL);

    await board(page).focus();
    const tabStops = await switches(page).evaluateAll(
      (nodes) => nodes.filter((n) => (n as HTMLElement).tabIndex >= 0).length,
    );
    expect(tabStops).toBeLessThanOrEqual(1);
  });
});
