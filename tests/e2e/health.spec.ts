// Deep suite for the Health & Fitness category (wellness + tracker engines). Generic render/a11y
// smoke is covered by smoke.spec.ts; this asserts the interactive behaviour build and unit tests
// cannot see: that the platform visualization renders real SVG in the browser, that a calculator
// recomputes live, and that the tracker's stored history survives a round trip.
import { test, expect, type Page } from '@playwright/test';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

// The storage runtime lives in an is:inline script, so it cannot be unit tested. These drive it
// through the real browser API, including the failure paths that used to be swallowed silently.
test.describe('storage durability', () => {
  test('exports and restores every toytools key', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const backup = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      TT.state.save('demo-tracker', { entries: [{ date: '2026-07-01', value: 6 }], goal: 8 });
      TT.state.save('demo-other', { fields: { weight: '70' } });
      return TT.data.serialize();
    });
    expect(backup).toContain('toytools.backup.v1');
    expect(backup).toContain('demo-tracker');

    const result = await page.evaluate((text) => {
      const TT = (window as any).ToyTools;
      localStorage.clear();
      const r = TT.data.restore(text);
      return { r, loaded: TT.state.load('demo-tracker') };
    }, backup);
    expect(result.r.ok).toBe(true);
    expect(result.r.restored).toBeGreaterThanOrEqual(2);
    expect(result.loaded.entries[0].value).toBe(6);
  });

  test('a restore merges rather than wiping unmentioned keys', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const kept = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      TT.state.save('keep-me', { fields: { a: '1' } });
      const backup = JSON.stringify({
        format: 'toytools.backup.v1',
        keys: { 'toytools:incoming': JSON.stringify({ v: 1, data: { fields: { b: '2' } } }) },
      });
      TT.data.restore(backup);
      return { keep: TT.state.load('keep-me'), incoming: TT.state.load('incoming') };
    });
    expect(kept.keep.fields.a).toBe('1');
    expect(kept.incoming.fields.b).toBe('2');
  });

  test('rejects a file that is not a ToyTools backup', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const out = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      return [TT.data.restore('not json'), TT.data.restore('{"format":"something-else"}')];
    });
    expect(out[0].ok).toBe(false);
    expect(out[1].ok).toBe(false);
    expect(out[1].error).toContain('ToyTools backup');
  });

  test('never writes outside the toytools namespace', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const leaked = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      TT.data.restore(JSON.stringify({
        format: 'toytools.backup.v1',
        keys: { 'evil-key': 'x', 'toytools:fine': '{"v":1,"data":{}}' },
      }));
      return localStorage.getItem('evil-key');
    });
    expect(leaked).toBeNull();
  });

  test('reports an oversized write instead of dropping it silently', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const saved = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      return TT.state.save('too-big', { blob: 'x'.repeat(60000) });
    });
    expect(saved).toBe(false);
    await expect(page.locator('#tt-toast')).toContainText('too much data');
  });

  test('migrates an older envelope instead of discarding it', async ({ page }) => {
    await page.goto('/tool/health/water-intake-tracker/');
    const out = await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      // Simulate a future bump: v1 data on disk, runtime now at v2 with a step registered.
      localStorage.setItem('toytools:migrate-me', JSON.stringify({ v: 1, data: { count: 3 } }));
      TT.state.VERSION = 2;
      TT.state.MIGRATIONS[1] = (d: any) => ({ total: d.count });
      const migrated = TT.state.load('migrate-me');
      // Without a registered step the caller still falls back to defaults rather than crashing.
      delete TT.state.MIGRATIONS[1];
      localStorage.setItem('toytools:no-step', JSON.stringify({ v: 1, data: { count: 9 } }));
      const unmigratable = TT.state.load('no-step');
      TT.state.VERSION = 1;
      return { migrated, unmigratable };
    });
    expect(out.migrated).toEqual({ total: 3 });
    expect(out.unmigratable).toBeNull();
  });
});

test.describe('shared body profile', () => {
  test('carries your details from one calculator to the next', async ({ page }) => {
    const errors = guardConsole(page);

    // Enter the body once, on BMI.
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="weight"]').fill('82');
    await page.locator('[data-field-id="height"]').fill('183');
    await expect(page.locator('#bmi-calculator-hero')).toHaveText('24.5');

    // TDEE asks for the same facts and should already know them.
    await page.goto('/tool/health/tdee-calculator/');
    await expect(page.locator('[data-field-id="weight"]')).toHaveValue('82');
    await expect(page.locator('[data-field-id="height"]')).toHaveValue('183');
    // The prefill is stated, never silent.
    const notice = page.locator('#tdee-calculator-profile');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('saved details');
    await expect(notice).toContainText('183 cm');

    // Body fat asks for height too.
    await page.goto('/tool/health/body-fat-calculator/');
    await expect(page.locator('[data-field-id="height"]')).toHaveValue('183');

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a value typed on this tool wins over the shared profile', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="height"]').fill('183');

    // Override height on TDEE only.
    await page.goto('/tool/health/tdee-calculator/');
    await page.locator('[data-field-id="height"]').fill('170');
    await page.reload();
    await expect(page.locator('[data-field-id="height"]')).toHaveValue('170');
  });

  test('carries the TDEE result into the macro calculator', async ({ page }) => {
    await page.goto('/tool/health/tdee-calculator/');
    const maintain = await page.locator('#tdee-calculator-hero').textContent();
    expect(maintain).toBeTruthy();

    await page.goto('/tool/health/macro-calculator/');
    const notice = page.locator('#macro-calculator-profile');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('From your TDEE');
    // The calorie field carries the number rather than the tool's generic default.
    const calories = await page.locator('[data-field-id="calories"]').inputValue();
    expect(Number(calories.replace(/[^0-9.]/g, ''))).toBeGreaterThan(1000);
  });

  test('forget clears the saved details', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="height"]').fill('183');
    await page.goto('/tool/health/tdee-calculator/');
    await expect(page.locator('#tdee-calculator-profile')).toBeVisible();
    await page.locator('#tdee-calculator-forget').click();
    await expect(page.locator('#tdee-calculator-profile')).toBeHidden();
    const stored = await page.evaluate(() => localStorage.getItem('toytools:profile:body'));
    expect(stored).toBeNull();
  });
});

test.describe('tracker backup', () => {
  test('logs, exports a real file, clears, and restores the history', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/health/water-intake-tracker/');

    // Log three glasses through the real UI.
    const add = page.locator('[data-add="1"]');
    for (let i = 0; i < 3; i++) await add.click();
    await expect(page.locator('#water-intake-tracker-today')).toHaveText('3');

    // Export downloads an actual file.
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#water-intake-tracker-export').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^toytools-backup-\d{4}-\d{2}-\d{2}\.json$/);

    // Clear everything (two-tap confirm), then confirm it is really gone.
    const reset = page.locator('#water-intake-tracker-reset');
    await reset.click();
    await reset.click();
    await expect(page.locator('#water-intake-tracker-today')).toHaveText('0');

    // Read what actually landed on disk and feed it back through the restore path.
    const fs = await import('node:fs/promises');
    const text = await fs.readFile((await download.path())!, 'utf8');
    const out = await page.evaluate((t) => {
      const TT = (window as any).ToyTools;
      const r = TT.data.restore(t);
      return { r, state: TT.state.load('water-intake-tracker') };
    }, text);
    expect(out.r.ok).toBe(true);
    expect(out.state.entries.reduce((s: number, e: any) => s + e.value, 0)).toBe(3);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('shows backup controls alongside the destructive one', async ({ page }) => {
    await page.goto('/tool/health/body-weight-tracker/');
    await expect(page.locator('#body-weight-tracker-export')).toBeVisible();
    await expect(page.locator('#body-weight-tracker-import')).toBeVisible();
    await expect(page.locator('#body-weight-tracker-reset')).toBeVisible();
  });
});

test.describe('bmi calculator (wellness engine)', () => {
  test('renders a band chart that tracks the live value', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/health/bmi-calculator/');

    const hero = page.locator('#bmi-calculator-hero');
    const viz = page.locator('#bmi-calculator-experience [data-viz] svg');

    // Defaults (70 kg, 175 cm) compute on load once the deferred runtime attaches.
    await expect(hero).toHaveText('22.9');
    await expect(viz).toBeVisible();

    // Four WHO bands, and exactly one of them carries the accent.
    await expect(viz.locator('.viz-band')).toHaveCount(4);
    await expect(viz.locator('.viz-band--good')).toHaveCount(1);
    await expect(viz.locator('.viz-marker')).toHaveCount(1);

    // The caption states the healthy weight range for the entered height.
    await expect(page.locator('#bmi-calculator-experience [data-viz-caption]')).toContainText('kg');

    // The marker moves when the value changes: heavier input pushes it right.
    const markerX = async () =>
      Number(await viz.locator('.viz-marker-rule').getAttribute('x1'));
    const before = await markerX();
    await page.locator('[data-field-id="weight"]').fill('95');
    await expect(hero).toHaveText('31');
    expect(await markerX()).toBeGreaterThan(before);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('every wellness calculator draws its chart in a real browser', async ({ page }) => {
    // Unit tests assert the SPEC; only a browser proves the SVG mounts and the capability flag,
    // the renderer, and the CSS all line up. One case per chart kind.
    const cases: { slug: string; marks: string }[] = [
      { slug: 'body-fat-calculator', marks: '.viz-band' },
      { slug: 'ideal-weight-calculator', marks: '.viz-band' },
      { slug: 'tdee-calculator', marks: '.viz-part' },
      { slug: 'macro-calculator', marks: '.viz-part' },
      { slug: 'heart-rate-zone-calculator', marks: '.viz-bar--ranked' },
    ];
    for (const c of cases) {
      const errors = guardConsole(page);
      await page.goto(`/tool/health/${c.slug}/`);
      const viz = page.locator(`[data-viz] svg`);
      await expect(viz, c.slug).toBeVisible();
      expect(await viz.locator(c.marks).count(), c.slug).toBeGreaterThan(1);
      expect(errors, `${c.slug}: ${errors.join('\n')}`).toEqual([]);
    }
  });

  test('clears the chart when input is incomplete', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await expect(page.locator('#bmi-calculator-experience [data-viz] svg')).toBeVisible();
    await page.locator('[data-field-id="height"]').fill('');
    // Missing required input returns the empty state, so the chart goes away with it.
    await expect(page.locator('#bmi-calculator-experience [data-viz] svg')).toHaveCount(0);
  });
});
