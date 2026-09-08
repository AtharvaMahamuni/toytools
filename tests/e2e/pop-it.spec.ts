// Pop It board behaviour on desktop Chromium and Pixel 5.
//
// Unit tests cover Feel itself; this spec locks the widget contract: a tap pops one bubble,
// a second activation on the same cell is a no-op for remaining/status, and Reset restores all 12.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/pop-it/';

const bubbles = (page: Page) => page.locator('[data-pop-bubble]');
const status = (page: Page) => page.locator('[data-pop-status]');
const reset = (page: Page) => page.locator('[data-pop-reset]');

test.describe('pop it', () => {
  test('popping one bubble marks it pressed and updates the count', async ({ page }) => {
    await page.goto(URL);

    await expect(bubbles(page)).toHaveCount(12);
    await expect(status(page)).toHaveText('12 ready');

    const first = bubbles(page).first();
    await expect(first).toHaveAttribute('aria-pressed', 'false');
    await expect(first).not.toHaveClass(/is-popped/);

    await first.click();

    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(first).toHaveClass(/is-popped/);
    await expect(status(page)).toHaveText('11 left');
  });

  test('a second activation on a popped bubble does not change remaining or status', async ({
    page,
  }) => {
    await page.goto(URL);

    const first = bubbles(page).first();
    await first.click();
    await expect(status(page)).toHaveText('11 left');
    await expect(first).toHaveAttribute('aria-pressed', 'true');

    const before = await status(page).textContent();
    const pressedCountBefore = await bubbles(page).evaluateAll(
      (nodes) => nodes.filter((n) => n.getAttribute('aria-pressed') === 'true').length,
    );

    // Second click (and a keyboard re-activation) must be ignored for board state.
    await first.click();
    await first.press('Enter');
    await first.press(' ');

    await expect(status(page)).toHaveText(before ?? '');
    const pressedCountAfter = await bubbles(page).evaluateAll(
      (nodes) => nodes.filter((n) => n.getAttribute('aria-pressed') === 'true').length,
    );
    expect(pressedCountAfter).toBe(pressedCountBefore);
    await expect(bubbles(page).nth(1)).toHaveAttribute('aria-pressed', 'false');
  });

  test('Reset clears all 12 bubbles and restores the ready status', async ({ page }) => {
    await page.goto(URL);

    // Pop a handful so Reset has something to undo.
    for (const i of [0, 1, 2, 5]) {
      await bubbles(page).nth(i).click();
    }
    await expect(status(page)).toHaveText('8 left');

    await reset(page).click();

    await expect(status(page)).toHaveText('12 ready');
    for (let i = 0; i < 12; i++) {
      const bubble = bubbles(page).nth(i);
      await expect(bubble).toHaveAttribute('aria-pressed', 'false');
      await expect(bubble).not.toHaveClass(/is-popped/);
    }
  });

});
