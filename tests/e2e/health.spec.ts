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

test.describe('result layout', () => {
  test('folds the background away and keeps the answer open', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    const exp = page.locator('#bmi-calculator-experience');

    // Open by default: the answer and the chart. Workings (explanation, related
    // tools, assumptions) fold into one disclosure.
    await expect(exp.locator('[data-section="hero"]')).toBeVisible();
    await expect(exp.locator('[data-section="visualization"] svg')).toBeVisible();
    const workings = exp.locator('.experience-workings');
    await expect(workings).toBeVisible();
    await expect(workings).toHaveJSProperty('open', false);

    // Still reachable in one click.
    await workings.locator('summary').click();
    await expect(workings).toHaveJSProperty('open', true);
    await expect(exp.locator('[data-explanation]')).toContainText('BMI divides your weight');
  });

  test('the category reads as a journey, not a taxonomy', async ({ page }) => {
    await page.goto('/category/health-fitness/');
    await expect(page.getByText('Measure & Plan')).toBeVisible();
    await expect(page.getByText('Keep It Up')).toBeVisible();
  });
});

test.describe('density and alignment', () => {
  const CALCULATORS = [
    'bmi-calculator',
    'tdee-calculator',
    'macro-calculator',
    'heart-rate-zone-calculator',
    'body-fat-calculator',
    'ideal-weight-calculator',
    'bmr-calculator',
    'calorie-deficit-calculator',
    'protein-intake-calculator',
    'one-rep-max-calculator',
    'running-pace-calculator',
  ];

  // The answer paints once the engine chunk AND the page's one calculator chunk have arrived
  // (src/lib/engines/wellness/lazy.ts), so every measurement below waits for the drawn chart
  // rather than assuming the runtime beat the assertion.
  const answerDrawn = (page: import('@playwright/test').Page) =>
    page.locator('[data-viz] svg').first().waitFor({ state: 'attached' });

  test('the input form is its own height, not stretched to the result', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'equalization is a desktop-only rule');
    for (const slug of CALCULATORS) {
      await page.goto(`/tool/health/${slug}/`);
      await answerDrawn(page);
      const { input, result } = await page.evaluate(() => {
        const h = (el: Element | null) => (el ? Math.round(el.getBoundingClientRect().height) : 0);
        return {
          input: h(document.querySelector('.io-panel:not(.io-panel--result)')),
          result: h(document.querySelector('.io-panel--result')),
        };
      });
      // equalHeight={false}: each pane hugs its own content. Stretching would make
      // the heights match. After the ledger pass the form can be taller than the
      // folded result, so "form < result" is no longer the signal.
      expect(input, `${slug} form should render`).toBeGreaterThan(0);
      expect(result, `${slug} result should render`).toBeGreaterThan(0);
      expect(input === result, `${slug} panes were equalized to the same height`).toBe(false);
    }
  });

  // The answer and the START of its chart must be reachable without scrolling. This used to demand
  // the whole chart, which the group switcher no longer leaves room for: an 11-pill nav row costs
  // about 56px above the tool, and on the three tallest calculators (heart rate zones, body fat,
  // protein) the last 15 to 35px of chart now falls past a 1280x720 fold. Grouping is worth that,
  // but the hero answer being visible is not negotiable, so that is what is pinned here.
  test('the answer and the start of its chart land above the fold', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'phone stacks form then answer on chart-heavy health tools');
    for (const slug of CALCULATORS) {
      await page.goto(`/tool/health/${slug}/`);
      await answerDrawn(page);
      const { heroBottom, chartTop, vh } = await page.evaluate(() => {
        const viz = document.querySelector('[data-section="visualization"]')!;
        const hero = document.querySelector('[data-section="hero"]')!;
        return {
          heroBottom: Math.round(hero.getBoundingClientRect().bottom + window.scrollY),
          chartTop: Math.round(viz.getBoundingClientRect().top + window.scrollY),
          vh: window.innerHeight,
        };
      });
      expect(heroBottom, `${slug} answer must be visible without scrolling`).toBeLessThanOrEqual(vh);
      expect(chartTop, `${slug} chart must start above the fold`).toBeLessThanOrEqual(vh);
    }
  });

  test('the chart renders at its drawn size instead of stretching to the column', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await answerDrawn(page);
    const width = await page.evaluate(
      () => Math.round(document.querySelector('[data-viz] svg')!.getBoundingClientRect().width),
    );
    expect(width).toBeLessThanOrEqual(340);
  });
});

test.describe('input controls', () => {
  test('segmented units switch the calculation in one tap', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/health/bmi-calculator/');

    const group = page.locator('.smart-segmented').first();
    await expect(group).toHaveAttribute('role', 'radiogroup');
    const metric = group.locator('[data-segment-value="metric"]');
    const imperial = group.locator('[data-segment-value="imperial"]');
    await expect(metric).toHaveAttribute('aria-checked', 'true');
    await expect(imperial).toHaveAttribute('aria-checked', 'false');

    // Values that are in range under BOTH systems, so the switch changes the answer rather than
    // tripping the engine's unit-specific bounds.
    await page.locator('[data-field-id="weight"]').fill('154');
    await page.locator('[data-field-id="height"]').fill('69');
    await expect(page.locator('#bmi-calculator-hero')).toHaveText('323.5');

    await imperial.click();
    await expect(imperial).toHaveAttribute('aria-checked', 'true');
    await expect(metric).toHaveAttribute('aria-checked', 'false');
    // 154 lb at 69 in is a normal BMI; the one tap re-read every number.
    await expect(page.locator('#bmi-calculator-hero')).toHaveText('22.7');

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('segmented control is keyboard navigable', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    const group = page.locator('.smart-segmented').first();
    await group.locator('[data-segment-value="metric"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(group.locator('[data-segment-value="imperial"]')).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(group.locator('[data-segment-value="metric"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('pills repaint when the value is set by another code path', async ({ page }) => {
    // Reset to defaults writes through setField, which knows nothing about segmented controls.
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-segment-value="imperial"]').click();
    const reset = page.locator('#bmi-calculator-reset');
    await reset.click();
    await reset.click();
    await expect(page.locator('[data-segment-value="metric"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('the age slider and its number field stay in sync both ways', async ({ page }) => {
    await page.goto('/tool/health/tdee-calculator/');
    const slider = page.locator('.smart-slider[data-slider-for="age"]');
    const number = page.locator('[data-field-id="age"]');
    await expect(slider).toHaveValue('30');

    // Typing drives the slider.
    await number.fill('55');
    await number.blur();
    await expect(slider).toHaveValue('55');

    // Dragging drives the number and recomputes.
    const before = await page.locator('#tdee-calculator-hero').textContent();
    await slider.fill('20');
    await expect(number).toHaveValue('20');
    await expect(page.locator('#tdee-calculator-hero')).not.toHaveText(before ?? '');
  });
});

// Health calculators are private pages: what you type about your body stays on the page. Until
// beta-v12.4.2 they kept a per-day result history (the "change since your last check" line) and a
// shared body profile that prefilled the next calculator; both were stored typed input, so both
// are gone. Only the unit choice is remembered.
test.describe('calculator privacy', () => {
  test('keeps no reading history, even when an older build left one behind', async ({ page }) => {
    const errors = guardConsole(page);
    // An older build's envelope, with the one-time cleanup marked done so only the runtime policy
    // stands between this history and the page.
    await page.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('toytools.private-inputs-cleared', '1');
      localStorage.setItem('toytools:bmi-calculator', JSON.stringify({ v: 1, data: {
        fields: { weight: '90', height: '170' },
        history: [
          { day: '2026-07-01', raw: 24.5, value: '24.5' },
          { day: '2026-07-10', raw: 23.8, value: '23.8' },
        ],
      } }));
    });
    await page.goto('/tool/health/bmi-calculator/');
    await expect(page.locator('#bmi-calculator-hero')).toHaveText('22.9');
    await expect(page.locator('[data-field-id="weight"]')).not.toHaveValue('90');
    await expect(page.locator('#bmi-calculator-delta')).toBeHidden();

    await page.locator('[data-field-id="weight"]').fill('74');
    await expect(page.locator('#bmi-calculator-hero')).not.toHaveText('22.9');
    const stored = await page.evaluate(() => localStorage.getItem('toytools:bmi-calculator'));
    expect(stored ?? '').not.toMatch(/history|"74"|"90"/);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('does not carry body details from one calculator to the next', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="weight"]').fill('82');
    await page.locator('[data-field-id="height"]').fill('183');
    await expect(page.locator('#bmi-calculator-hero')).toHaveText('24.5');

    await page.goto('/tool/health/tdee-calculator/');
    await expect(page.locator('[data-field-id="weight"]')).not.toHaveValue('82');
    await expect(page.locator('[data-field-id="height"]')).not.toHaveValue('183');
    await expect(page.locator('#tdee-calculator-profile')).toBeHidden();

    await page.goto('/tool/health/macro-calculator/');
    await expect(page.locator('#macro-calculator-profile')).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem('toytools:profile:body'));
    expect(stored).toBeNull();
    expect(errors, errors.join('\n')).toEqual([]);
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
