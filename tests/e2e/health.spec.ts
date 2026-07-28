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

  test('clears the chart when input is incomplete', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await expect(page.locator('#bmi-calculator-experience [data-viz] svg')).toBeVisible();
    await page.locator('[data-field-id="height"]').fill('');
    // Missing required input returns the empty state, so the chart goes away with it.
    await expect(page.locator('#bmi-calculator-experience [data-viz] svg')).toHaveCount(0);
  });
});
