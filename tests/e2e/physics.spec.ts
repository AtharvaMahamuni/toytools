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
    'projectile-motion-simulator',
    'ohms-law-simulator',
    'shm-spring-simulator',
  ]) {
    test(`${slug} boots its canvas without console errors`, async ({ page }) => {
      const errors = guardConsole(page);
      await page.goto(`/tool/physics/${slug}/`);
      await expect(page.locator('[data-sim-canvas]')).toBeVisible();
      // The fallback message must stay hidden — the sim booted successfully.
      await expect(page.locator('[data-sim-fallback]')).toBeHidden();
      await expect(page.locator('[data-sim-graph]')).toBeVisible(); // every sim has a graph
      await page.waitForTimeout(200);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

// Direct on-canvas manipulation (pointer). Drives the boot pointer wiring + each sim's
// pointer.handle in a real browser with a real canvas — the paths happy-dom cannot rasterize.
// We dispatch PointerEvents in-page rather than page.mouse: some Chromium builds don't bridge
// synthetic mouse input to pointer events, so this keeps the drag deterministic everywhere.
async function pointerDrag(
  canvas: Locator,
  from: [number, number],
  to: [number, number],
  steps = 5,
) {
  const box = (await canvas.boundingBox())!;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    pts.push([
      box.x + box.width * (from[0] + (to[0] - from[0]) * f),
      box.y + box.height * (from[1] + (to[1] - from[1]) * f),
    ]);
  }
  await canvas.evaluate((el, points: [number, number][]) => {
    const fire = (type: string, x: number, y: number) =>
      el.dispatchEvent(
        new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true, cancelable: true }),
      );
    fire('pointerdown', points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) fire('pointermove', points[i][0], points[i][1]);
    fire('pointerup', points[points.length - 1][0], points[points.length - 1][1]);
  }, pts);
}

test.describe('canvas direct manipulation', () => {
  test('wave: dragging the wave sets the amplitude', async ({ page }) => {
    await page.goto(FLAGSHIP);
    await page.getByRole('button', { name: 'Pause' }).click();
    expect(await page.getByLabel('Amplitude in m').inputValue()).toBe('0.5'); // default
    // Drag to the top edge → maximum amplitude.
    await pointerDrag(page.locator('[data-sim-canvas]'), [0.5, 0.5], [0.5, 0.02]);
    expect(Number(await page.getByLabel('Amplitude in m').inputValue())).toBeGreaterThan(0.9);
    // Amplitude must not change the wave speed.
    await expect(page.locator('[data-measurement="waveSpeed"]')).toHaveText(/2\.00 m\/s/);
  });

  test('pendulum: grabbing the bob sets a release angle', async ({ page }) => {
    await page.goto('/tool/physics/pendulum-simulator/');
    await page.getByRole('button', { name: 'Pause' }).click();
    expect(await page.getByLabel(/Initial angle/).inputValue()).toBe('20'); // default
    // Grab and drag well to the right of the pivot → a large release angle, distinct from default.
    await pointerDrag(page.locator('[data-sim-canvas]'), [0.42, 0.3], [0.85, 0.5]);
    expect(Number(await page.getByLabel(/Initial angle/).inputValue())).toBeGreaterThan(40);
  });

  test('heat: dragging a block changes its temperature', async ({ page }) => {
    await page.goto('/tool/physics/heat-transfer-simulator/');
    await page.getByRole('button', { name: 'Pause' }).click();
    // Drag the left block (A) to the bottom → cools it toward 0 °C.
    await pointerDrag(page.locator('[data-sim-canvas]'), [0.2, 0.4], [0.2, 0.95]);
    expect(Number(parseFloat((await page.locator('[data-measurement="tempA"]').textContent())!))).toBeLessThan(30);
  });
});

// Theme switching must re-read the palette and redraw (the canvas can't use CSS var()).
test.describe('theme', () => {
  test('switching theme repaints the canvas', async ({ page }) => {
    await page.goto(FLAGSHIP);
    await page.getByRole('button', { name: 'Pause' }).click();
    const canvas = page.locator('[data-sim-canvas]');
    const light = await canvasFingerprint(canvas);
    // Force dark theme the same way the Nav toggle does (data-theme on <html>).
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(150);
    const dark = await canvasFingerprint(canvas);
    expect(dark).not.toBe(light);
  });
});

// Formula-as-calculator: paramId terms render as number boxes that solve the formula and drive the
// simulation; the measurement term is the live computed answer. Heat transfer has no editable terms.
test.describe('formula calculator', () => {
  test('typing a value solves the formula, shows the worked line, and moves the slider', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(FLAGSHIP); // wave-speed-simulator: v = f × λ
    await page.getByRole('button', { name: 'Pause' }).click();

    const freq = page.locator('#wave-speed-simulator-fx-frequency');
    const wavelength = page.locator('#wave-speed-simulator-fx-wavelength');
    const answer = page.locator('[data-term-value="v"]');
    const worked = page.locator('[data-formula-worked]');

    await expect(wavelength).toHaveValue('2');
    await freq.fill('1.5'); // v = 1.5 × 2 = 3.00 m/s

    await expect(answer).toHaveText(/3\.00\s*m\/s/);
    await expect(worked).toHaveText(/v = 1\.50 × 2\.0 = 3\.00\s*m\/s/);
    // Linked: the frequency slider follows the typed value.
    await expect(page.locator('[data-param="frequency"]')).toHaveValue('1.5');

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('clamps an out-of-range entry to the parameter limit', async ({ page }) => {
    await page.goto(FLAGSHIP);
    await page.getByRole('button', { name: 'Pause' }).click();
    const freq = page.locator('#wave-speed-simulator-fx-frequency');
    await freq.fill('99'); // max frequency is 3 → clamps; v = 3 × 2 = 6.00
    await freq.blur();
    await expect(freq).toHaveValue('3');
    await expect(page.locator('[data-term-value="v"]')).toHaveText(/6\.00\s*m\/s/);
  });

  test('moving the slider updates the formula box (two-way link)', async ({ page }) => {
    await page.goto(FLAGSHIP);
    await page.getByRole('button', { name: 'Pause' }).click();
    const slider = page.locator('[data-param="wavelength"]');
    await slider.fill('3');
    await slider.dispatchEvent('input');
    await expect(page.locator('#wave-speed-simulator-fx-wavelength')).toHaveValue('3');
  });

  test('a formula with no editable inputs stays display-only', async ({ page }) => {
    await page.goto('/tool/physics/heat-transfer-simulator/'); // Q = m × c × ΔT (both terms computed)
    await expect(page.locator('.phys-formula')).toBeVisible();
    await expect(page.locator('[data-formula-input]')).toHaveCount(0);
  });
});
