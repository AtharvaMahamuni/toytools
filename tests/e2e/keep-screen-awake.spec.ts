// Deep suite for Keep Screen Awake, on desktop and Pixel 5.
//
// The Wake Lock API is stubbed via addInitScript rather than exercised for real: a headless
// browser is not a visible screen, so `wakeLock.request('screen')` rejects there and every
// assertion below would be testing the failure path. The stub also makes the thing that actually
// matters testable, which is what the widget does when a lock it HELD goes away mid session. That
// regression (lock released while the tab stayed visible was never re-acquired, while the UI went
// on showing "Awake" over a sleeping screen) is the reason this spec exists.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/productivity/keep-screen-awake/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

/**
 * Installs a controllable `navigator.wakeLock`. Exposes `__wl` on the page:
 *   `__wl.granted`  - how many sentinels have been handed out
 *   `__wl.deny`     - when true, every request rejects
 *   `__wl.drop()`   - release the live sentinel the way an OS power policy would
 */
async function stubWakeLock(page: Page) {
  await page.addInitScript(() => {
    const state = {
      granted: 0,
      deny: false,
      current: null as null | { release: () => void },
      drop() {
        if (state.current) state.current.release();
      },
    };
    (window as unknown as { __wl: typeof state }).__wl = state;

    class Sentinel extends EventTarget {
      released = false;
      release() {
        if (this.released) return Promise.resolve();
        this.released = true;
        if (state.current === (this as unknown as { release: () => void })) state.current = null;
        this.dispatchEvent(new Event('release'));
        return Promise.resolve();
      }
    }

    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: {
        request: () => {
          if (state.deny) return Promise.reject(new Error('NotAllowedError'));
          const s = new Sentinel();
          state.granted += 1;
          state.current = s as unknown as { release: () => void };
          return Promise.resolve(s);
        },
      },
    });
  });
}

const toggle = (page: Page) => page.locator('#wl-toggle');
const hero = (page: Page) => page.locator('#wl-hero');
const lock = (page: Page) => page.locator('#wl-lock');

test.describe('keep screen awake', () => {
  test.beforeEach(async ({ page }) => stubWakeLock(page));

  test('duration is chosen up front, not behind a settings disclosure', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);

    // The presets are visible on arrival: picking a length is the reason people come here.
    await expect(page.getByRole('button', { name: '30 min' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Until I stop' })).toBeVisible();

    await page.getByRole('button', { name: '30 min' }).click();
    // The hero previews the session that is about to start, and the length is shareable.
    await expect(hero(page)).toHaveText('30:00');
    await expect(page).toHaveURL(/[?&]d=30/);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a shared link reproduces the session length', async ({ page }) => {
    await page.goto(`${URL}?d=15`);
    await expect(hero(page)).toHaveText('15:00');
    await expect(page.getByRole('button', { name: '15 min' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('choosing a duration does not fill the back button', async ({ page }) => {
    await page.goto('/category/productivity/');
    await page.goto(URL);

    for (const name of ['15 min', '30 min', '1 hour']) {
      await page.getByRole('button', { name }).click();
    }
    await expect(page).toHaveURL(/d=60/);

    // replaceState, not pushState: one Back must leave the tool entirely.
    await page.goBack();
    await expect(page).toHaveURL(/\/category\/productivity\/$/);
  });

  test('starting a session reports a real, held lock', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);

    await toggle(page).click();

    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle(page)).toHaveText('Stop');
    await expect(lock(page)).toContainText('Wake lock held');
    await expect(page.locator('#wl-meta')).toBeVisible();
    await expect(page.locator('#wl-started-value')).not.toBeEmpty();

    expect(await page.evaluate(() => (window as never as { __wl: { granted: number } }).__wl.granted)).toBe(1);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a lock dropped while the tab stays visible is reported and re-acquired', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    await toggle(page).click();
    await expect(lock(page)).toContainText('Wake lock held');

    // Deny re-acquisition, then drop the lock the way a battery saver would. The old build
    // only listened for visibilitychange, so this state was permanent and invisible.
    await page.evaluate(() => {
      const w = (window as never as { __wl: { deny: boolean; drop: () => void } }).__wl;
      w.deny = true;
      w.drop();
    });

    await expect(lock(page)).toContainText('Lock lost');
    // The session itself keeps running: the timer is still the user's session, only the lock went.
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');

    // Allow it back: the ticker retries every second, with no interaction required.
    await page.evaluate(() => {
      (window as never as { __wl: { deny: boolean } }).__wl.deny = false;
    });
    await expect(lock(page)).toContainText('Wake lock held', { timeout: 5000 });

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a session that never gets a lock does not claim to be running', async ({ page }) => {
    await page.goto(URL);
    await page.evaluate(() => {
      (window as never as { __wl: { deny: boolean } }).__wl.deny = true;
    });

    await toggle(page).click();

    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle(page)).toHaveText('Keep Screen Awake');
  });

  test('stopping releases the lock and logs the session', async ({ page }) => {
    await page.goto(URL);
    await toggle(page).click();
    await expect(lock(page)).toContainText('Wake lock held');

    // Let at least a second of session accrue so it is worth recording.
    await expect(hero(page)).not.toHaveText('0:00', { timeout: 4000 });
    await toggle(page).click();

    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#wl-today')).toContainText('1 session');
    expect(
      await page.evaluate(() => (window as never as { __wl: { current: unknown } }).__wl.current),
    ).toBeNull();
  });

  test('ambient mode shows a clock and closes on Escape', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);

    await page.getByRole('button', { name: 'Ambient mode' }).click();
    const ambient = page.locator('#wl-ambient');
    await expect(ambient).toBeVisible();
    await expect(page.locator('#wl-amb-clock')).toHaveText(/\d/);
    await expect(page.locator('#wl-amb-state')).toHaveText('Sleeping');

    await page.keyboard.press('Escape');
    await expect(ambient).toBeHidden();

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('the primary control and presets meet the touch-target minimum', async ({ page }) => {
    await page.goto(URL);

    // 48px is the platform floor. The control this tool lives by used to be an 18px switch.
    const primary = await toggle(page).boundingBox();
    expect(primary!.height).toBeGreaterThanOrEqual(48);

    const preset = await page.getByRole('button', { name: '30 min' }).boundingBox();
    expect(preset!.height).toBeGreaterThanOrEqual(48);
  });

  test('the page never scrolls horizontally', async ({ page }) => {
    await page.goto(URL);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
