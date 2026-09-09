// Pop It board behaviour on desktop Chromium and Pixel 5.
//
// Unit tests cover Feel itself; this spec locks the widget contract: finite default (no scroll),
// Infinite mode board-only chrome + scroll-load, Escape exit, Reset, Feel cues, local toggles,
// and visible pop styles on dynamically appended bubbles.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/pop-it/';

const bubbles = (page: Page) => page.locator('[data-pop-bubble]');
const status = (page: Page) => page.locator('[data-pop-status]');
const reset = (page: Page) => page.locator('[data-pop-reset]');
const scroller = (page: Page) => page.locator('[data-pop-scroller]');
const infiniteBtn = (page: Page) => page.locator('[data-feel-play]');
const feelStrip = (page: Page) => page.locator('[data-feel-strip]');
const feelLink = (page: Page) => page.locator('[data-feel-settings]');
const toolbar = (page: Page) => page.locator('[data-feel-toolbar]');
const bar = (page: Page) => page.locator('[data-feel-bar]');
const exitPlay = (page: Page) => page.locator('[data-feel-exit]');

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

  test('finite default: board is not scrollable and scrolling does not append rows', async ({
    page,
  }) => {
    await page.goto(URL);
    await expect(bubbles(page)).toHaveCount(12);
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);

    const metrics = await scroller(page).evaluate((el) => {
      const node = el as HTMLElement;
      const style = getComputedStyle(node);
      node.scrollTop = node.scrollHeight;
      return {
        overflowY: style.overflowY,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        scrollTopAfter: node.scrollTop,
      };
    });
    expect(['hidden', 'clip']).toContain(metrics.overflowY);
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
    expect(metrics.scrollTopAfter).toBe(0);

    await page.waitForTimeout(300);
    await expect(bubbles(page)).toHaveCount(12);
  });

  test('Infinite mode: board-only chrome, Escape exits, scroll-load, pops visible on appended', async ({
    page,
  }) => {
    await page.goto(URL);

    await expect(page.locator('.tool-signature')).toBeVisible();
    await expect(page.locator('.knowledge-drawers')).toBeVisible();
    await expect(feelStrip(page)).toBeVisible();
    await expect(feelLink(page)).toBeVisible();
    await expect(toolbar(page)).toBeVisible();
    await expect(bar(page)).toBeVisible();

    await expect(exitPlay(page)).toBeHidden();
    await infiniteBtn(page).click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await expect(page.locator('.tool-signature')).toBeHidden();
    await expect(page.locator('.knowledge-drawers')).toBeHidden();
    await expect(page.locator('footer[role="contentinfo"]')).toBeHidden();
    await expect(page.locator('.tool-bar')).toBeVisible();

    // Play chrome = board only: Feel strip/toolbar/bar hide. Exit is the way out on a phone.
    await expect(feelLink(page)).toBeHidden();
    await expect(feelStrip(page)).toBeHidden();
    await expect(toolbar(page)).toBeHidden();
    await expect(bar(page)).toBeHidden();
    await expect(reset(page)).toBeHidden();
    await expect(exitPlay(page)).toBeVisible();

    const overflowY = await scroller(page).evaluate(
      (el) => getComputedStyle(el as HTMLElement).overflowY,
    );
    expect(['auto', 'scroll', 'overlay']).toContain(overflowY);

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

    // Appended bubbles must paint pop visuals (Astro scoped CSS used to miss createElement nodes).
    const appended = bubbles(page).nth(afterEnter);
    await appended.scrollIntoViewIfNeeded();
    await appended.click();
    await expect(appended).toHaveAttribute('aria-pressed', 'true');
    await expect(appended).toHaveClass(/is-popped/);
    const painted = await appended.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        borderRadius: s.borderRadius,
        background: s.backgroundColor,
        cursor: s.cursor,
      };
    });
    expect(painted.borderRadius).not.toBe('0px');
    expect(painted.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(painted.cursor).toBe('default');

    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);
    await expect(page.locator('.tool-signature')).toBeVisible();
    await expect(bubbles(page)).toHaveCount(12);
    await expect(feelStrip(page)).toBeVisible();
    await expect(feelLink(page)).toBeVisible();
    await expect(toolbar(page)).toBeVisible();
    await expect(bar(page)).toBeVisible();
  });

  test('Reset clears all loaded bubbles, restores ready status, and scrolls to top', async ({
    page,
  }) => {
    await page.goto(URL);

    for (const i of [0, 1, 2, 5]) {
      await bubbles(page).nth(i).click();
    }
    await expect(status(page)).toHaveText('8 left');

    await reset(page).click();

    await expect(bubbles(page)).toHaveCount(12);
    await expect(status(page)).toHaveText('12 ready');
    for (let i = 0; i < 12; i++) {
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
    await expect(page.locator('[data-feel-spin-speed]')).toHaveCount(0);
    await expect(page.locator('[data-feel-sound="on"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-feel-haptics="off"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('[data-feel-sound="off"]').click();
    await page.locator('[data-feel-haptics="on"]').click();

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
