// Pop It board behaviour on desktop Chromium and Pixel 5.
//
// Unit tests cover Feel itself; this spec locks the widget contract: finite default,
// Infinite mode on/off (chrome + scroll-load), Reset, Feel cues, and local toggles syncing prefs.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/pop-it/';

const bubbles = (page: Page) => page.locator('[data-pop-bubble]');
const status = (page: Page) => page.locator('[data-pop-status]');
const reset = (page: Page) => page.locator('[data-pop-reset]');
const scroller = (page: Page) => page.locator('[data-pop-scroller]');
const infiniteBtn = (page: Page) => page.locator('[data-pop-infinite]');
const exitInfinite = (page: Page) => page.locator('[data-pop-exit-infinite]');
const feelStrip = (page: Page) => page.locator('[data-pop-feel-strip]');

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

  test('finite default: scrolling does not append rows until Infinite mode is on', async ({
    page,
  }) => {
    await page.goto(URL);
    await expect(bubbles(page)).toHaveCount(12);
    await expect(page.locator('html')).not.toHaveClass(/tt-infinite-mode/);

    await scroller(page).evaluate((el) => {
      const node = el as HTMLElement;
      node.scrollTop = node.scrollHeight;
    });
    // Give any mistaken scroll listener a beat; count must stay finite.
    await page.waitForTimeout(300);
    await expect(bubbles(page)).toHaveCount(12);
  });

  test('Infinite mode: enter/exit chrome, scroll-load only while on, exit restores finite', async ({
    page,
  }) => {
    await page.goto(URL);

    await expect(page.locator('.tool-signature')).toBeVisible();
    await expect(page.locator('.knowledge-drawers')).toBeVisible();
    await expect(feelStrip(page)).toBeVisible();

    await infiniteBtn(page).click();
    await expect(page.locator('html')).toHaveClass(/tt-infinite-mode/);
    await expect(page.locator('.tool-signature')).toBeHidden();
    await expect(page.locator('.knowledge-drawers')).toBeHidden();
    await expect(page.locator('footer[role="contentinfo"]')).toBeHidden();
    await expect(page.locator('.tool-bar')).toBeVisible();
    await expect(page.locator('[data-pop-feel-link]')).toBeVisible();
    await expect(exitInfinite(page)).toBeVisible();
    await expect(feelStrip(page)).toBeHidden();

    // Entering Infinite may seed rows so the tall scroller overflows; scroll still loads more.
    await expect
      .poll(async () => bubbles(page).count(), { timeout: 5_000 })
      .toBeGreaterThan(12);

    const afterEnter = await bubbles(page).count();

    await expect
      .poll(
        async () => {
          await scroller(page).evaluate((el) => {
            const node = el as HTMLElement;
            node.scrollTop = node.scrollHeight;
          });
          return bubbles(page).count();
        },
        { timeout: 10_000 },
      )
      .toBeGreaterThan(afterEnter);

    const grown = await bubbles(page).count();
    expect(grown % 4).toBe(0);

    await exitInfinite(page).click();
    await expect(page.locator('html')).not.toHaveClass(/tt-infinite-mode/);
    await expect(page.locator('.tool-signature')).toBeVisible();
    await expect(bubbles(page)).toHaveCount(12);
    await expect(feelStrip(page)).toBeVisible();

    await infiniteBtn(page).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveClass(/tt-infinite-mode/);
    await expect(bubbles(page)).toHaveCount(12);
  });

  test('Reset clears all loaded bubbles, restores ready status, and scrolls to top', async ({
    page,
  }) => {
    await page.goto(URL);

    await infiniteBtn(page).click();
    await expect
      .poll(async () => bubbles(page).count(), { timeout: 5_000 })
      .toBeGreaterThan(12);

    const seeded = await bubbles(page).count();
    await expect
      .poll(
        async () => {
          await scroller(page).evaluate((el) => {
            const node = el as HTMLElement;
            node.scrollTop = node.scrollHeight;
          });
          return bubbles(page).count();
        },
        { timeout: 10_000 },
      )
      .toBeGreaterThan(seeded);

    const loaded = await bubbles(page).count();

    for (const i of [0, 1, 2, 5]) {
      await bubbles(page).nth(i).click();
    }
    await expect(status(page)).toHaveText(`${loaded - 4} left`);

    // Mid-board scroll so Reset is not racing a near-bottom append re-arm.
    await scroller(page).evaluate((el) => {
      const node = el as HTMLElement;
      node.scrollTop = Math.min(120, Math.floor(node.scrollHeight / 3));
    });

    await reset(page).click();

    const after = await bubbles(page).count();
    // Reset does not shrink; a stray scroll-append may add a batch, never remove.
    expect(after).toBeGreaterThanOrEqual(loaded);
    await expect(status(page)).toHaveText(`${after} ready`);
    for (let i = 0; i < Math.min(after, 16); i++) {
      const bubble = bubbles(page).nth(i);
      await expect(bubble).toHaveAttribute('aria-pressed', 'false');
      await expect(bubble).not.toHaveClass(/is-popped/);
    }
    await expect
      .poll(async () => scroller(page).evaluate((el) => (el as HTMLElement).scrollTop))
      .toBe(0);
  });

  test('local Sound and Haptics toggles write the same feel prefs as Settings', async ({
    page,
  }) => {
    await page.goto(URL);

    // Defaults: sound on, haptics off.
    await expect(page.locator('[data-pop-sound="on"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-pop-haptics="off"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-pop-sound="off"]').click();
    await page.locator('[data-pop-haptics="on"]').click();

    const prefs = await page.evaluate(() => {
      const TT = (window as unknown as { ToyTools?: { prefs?: { get: (k: string, f?: unknown) => unknown } } }).ToyTools;
      if (!TT?.prefs) return null;
      return {
        sound: TT.prefs.get('feel.sound', true),
        haptics: TT.prefs.get('feel.haptics', false),
      };
    });
    expect(prefs).toEqual({ sound: false, haptics: true });

    // Pop still works with Feel cues gated by prefs (no throw).
    await bubbles(page).first().click();
    await expect(bubbles(page).first()).toHaveAttribute('aria-pressed', 'true');
    await expect(status(page)).toHaveText('11 left');
  });
});
