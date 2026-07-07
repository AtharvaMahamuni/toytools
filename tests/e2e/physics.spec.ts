// Deep suite for the Physics Playground engine — drives the real canvas widget end-to-end
// on both viewports (chromium + pixel5 via playwright.config projects). Generic render/a11y
// smoke is already covered by smoke.spec.ts; this asserts the interactive behaviour: the
// animation loop, play/pause, reset, slider → measurement wiring, presets, speed, and that
// reduced-motion starts paused.
import { test, expect, type Page, type Locator } from '@playwright/test';

const FLAGSHIP = '/tool/physics/wave-speed-simulator/';

/** Data-URL fingerprint of the simulation canvas — changes iff the scene repainted. */
async function canvasFingerprint(canvas: Locator): Promise<string> {
  return canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
}

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('wave speed simulator', () => {
  test('animates while playing and freezes when paused', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(FLAGSHIP);

    const canvas = page.locator('[data-sim-canvas]');
    await expect(canvas).toBeVisible();
    const playBtn = page.getByRole('button', { name: 'Pause' }).or(page.getByRole('button', { name: 'Play' }));

    // Default (no reduced-motion) autoplays → the button offers "Pause".
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    // Two samples a moment apart should differ while the loop runs.
    const a = await canvasFingerprint(canvas);
    await page.waitForTimeout(350);
    const b = await canvasFingerprint(canvas);
    expect(b).not.toBe(a);

    // Pause → the canvas stops changing.
    await playBtn.click();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    const c = await canvasFingerprint(canvas);
    await page.waitForTimeout(350);
    const d = await canvasFingerprint(canvas);
    expect(d).toBe(c);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a slider updates the live measurement and formula', async ({ page }) => {
    await page.goto(FLAGSHIP);

    const speed = page.locator('[data-measurement="waveSpeed"]');
    // Pause first so the reading is stable to assert against.
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(speed).toHaveText(/2\.00 m\/s/);

    const frequency = page.getByLabel('Frequency in Hz');
    await frequency.focus();
    await frequency.press('ArrowRight'); // +0.05 Hz → v = 1.05 × 2 = 2.10 m/s
    await expect(speed).toHaveText(/2\.10 m\/s/);
    // The formula panel's v term mirrors the same value.
    await expect(page.locator('[data-term-value="v"]')).toHaveText(/2\.10 m\/s/);
  });

  test('a preset applies its scenario values', async ({ page }) => {
    await page.goto(FLAGSHIP);
    await page.getByRole('button', { name: 'Pause' }).click();

    await page.getByRole('button', { name: 'Ocean swell' }).click();
    // Ocean swell = 0.25 Hz × 4 m → v = 1.00 m/s.
    await expect(page.locator('[data-measurement="waveSpeed"]')).toHaveText(/1\.00 m\/s/);
    await expect(page.getByLabel('Frequency in Hz')).toHaveValue('0.25');
  });

  test('reset restores the default parameters', async ({ page }) => {
    await page.goto(FLAGSHIP);
    const frequency = page.getByLabel('Frequency in Hz');
    await frequency.focus();
    await frequency.press('ArrowRight');
    await expect(frequency).not.toHaveValue('1');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(frequency).toHaveValue('1');
  });

  test('speed buttons are mutually exclusive', async ({ page }) => {
    await page.goto(FLAGSHIP);
    const half = page.getByRole('button', { name: '0.5× speed' });
    const one = page.getByRole('button', { name: '1× speed' });
    await expect(one).toHaveAttribute('aria-pressed', 'true');
    await half.click();
    await expect(half).toHaveAttribute('aria-pressed', 'true');
    await expect(one).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('reduced motion', () => {
  test('starts paused with a static frame', async ({ page }) => {
    // Emulate the media query on the page directly (reliable regardless of project config).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FLAGSHIP);
    // Under reduce, boot draws one frame and does not autoplay → the button offers "Play".
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
    const canvas = page.locator('[data-sim-canvas]');
    const a = await canvasFingerprint(canvas);
    await page.waitForTimeout(350);
    expect(await canvasFingerprint(canvas)).toBe(a);
  });
});

test.describe('every physics tool', () => {
  for (const slug of [
    'wave-speed-simulator',
    'frequency-period-simulator',
    'pendulum-simulator',
    'heat-transfer-simulator',
  ]) {
    test(`${slug} boots its canvas without console errors`, async ({ page }) => {
      const errors = guardConsole(page);
      await page.goto(`/tool/physics/${slug}/`);
      await expect(page.locator('[data-sim-canvas]')).toBeVisible();
      // The fallback message must stay hidden — the sim booted successfully.
      await expect(page.locator('[data-sim-fallback]')).toBeHidden();
      await page.waitForTimeout(200);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});
