// Deep suite for the Applied Math simulation domain (math-lab engine). Generic render/a11y smoke
// is covered by smoke.spec.ts; this asserts the interactive behaviour of each math sim: boot,
// animation, the slider → measurement wiring, and on-canvas dragging. Add each new math sim's
// slug to the boot list below (the math twin of physics.spec.ts).
import { test, expect, type Page, type Locator } from '@playwright/test';

const UNIT_CIRCLE = '/tool/math/unit-circle-explorer/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('every math tool', () => {
  for (const slug of ['unit-circle-explorer', 'quadratic-equation-explorer']) {
    test(`${slug} boots its canvas without console errors`, async ({ page }) => {
      const errors = guardConsole(page);
      await page.goto(`/tool/math/${slug}/`);
      await expect(page.locator('[data-sim-canvas]')).toBeVisible();
      await expect(page.locator('[data-sim-fallback]')).toBeHidden();
      // The graph tile is optional (the quadratic's canvas IS its graph).
      if (await page.locator('[data-sim-graph]').count()) {
        await expect(page.locator('[data-sim-graph]')).toBeVisible();
      }
      await page.waitForTimeout(200);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('fraction calculator (math engine)', () => {
  test('computes live, reacts to operation changes, and validates input', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/math/fraction-calculator/');
    const hero = page.locator('#fraction-calculator-hero');
    // Defaults 1/2 + 3/4 compute on load once the runtime attaches.
    await expect(hero).toHaveText('5/4');
    // Switching the operation recomputes: 1/2 ÷ 3/4 = 2/3.
    await page.locator('[data-field-id="op"]').selectOption('divide');
    await expect(hero).toHaveText('2/3');
    // Mixed numbers: 1 1/2 × 2 2/3 = 4.
    await page.locator('[data-field-id="first"]').fill('1 1/2');
    await page.locator('[data-field-id="op"]').selectOption('multiply');
    await page.locator('[data-field-id="second"]').fill('2 2/3');
    await expect(hero).toHaveText('4');
    // Malformed input surfaces as a validation message, not a crash.
    await page.locator('[data-field-id="first"]').fill('abc');
    await expect(page.locator('#fraction-calculator-experience')).toContainText('whole number');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('combinations & permutations calculator (math engine)', () => {
  test('counts live and switches between nCr and nPr', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/math/combinations-permutations-calculator/');
    const hero = page.locator('#combinations-permutations-calculator-hero');
    await expect(hero).toHaveText('10'); // C(5, 2)
    await page.locator('[data-field-id="mode"]').selectOption('permutations');
    await expect(hero).toHaveText('20'); // P(5, 2)
    await page.locator('[data-field-id="mode"]').selectOption('combinations');
    await page.locator('[data-field-id="n"]').fill('49');
    await page.locator('[data-field-id="r"]').fill('6');
    await expect(hero).toHaveText('13,983,816'); // the lottery classic
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('prime factorization calculator (math engine)', () => {
  test('factors live and derives GCF/LCM from a second number', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto('/tool/math/prime-factorization-calculator/');
    const hero = page.locator('#prime-factorization-calculator-hero');
    await expect(hero).toHaveText('2³ × 3² × 5'); // default 360
    await page.locator('[data-field-id="number"]').fill('97');
    await expect(hero).toHaveText('97 (prime)');
    await page.locator('[data-field-id="number"]').fill('36');
    await page.locator('[data-field-id="second"]').fill('60');
    const experience = page.locator('#prime-factorization-calculator-experience');
    await expect(experience).toContainText('12'); // GCF
    await expect(experience).toContainText('180'); // LCM
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('unit circle explorer', () => {
  test('the angle slider drives the trig measurements', async ({ page }) => {
    await page.goto(UNIT_CIRCLE);
    await page.getByRole('button', { name: 'Pause' }).click();
    // 90°: sin θ = 1, cos θ = 0.
    await page.getByLabel(/Angle θ/).fill('90');
    await expect(page.locator('[data-measurement="sin"]')).toHaveText(/1\.000/);
    await expect(page.locator('[data-measurement="cos"]')).toHaveText(/0\.000/);
    // The tan readout is clamped, never Infinity/NaN.
    const tan = (await page.locator('[data-measurement="tan"]').textContent())!;
    expect(tan).not.toMatch(/Infinity|NaN/);
  });

  test('a preset jumps to its special angle', async ({ page }) => {
    await page.goto(UNIT_CIRCLE);
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.getByRole('button', { name: '30°', exact: true }).click();
    await expect(page.locator('[data-measurement="sin"]')).toHaveText(/0\.500/);
  });

  test('the graph tile lives in the dashboard and never overlays the scene', async ({ page }) => {
    await page.goto(UNIT_CIRCLE);
    const canvas = page.locator('[data-sim-canvas]');
    const graph = page.locator('.phys-dash [data-sim-graph]');
    await expect(graph).toBeVisible();
    // In-flow beside/below the canvas — the boxes never intersect.
    const c = (await canvas.boundingBox())!;
    const g = (await graph.boundingBox())!;
    const overlap =
      g.x < c.x + c.width && c.x < g.x + g.width && g.y < c.y + c.height && c.y < g.y + g.height;
    expect(overlap).toBe(false);
  });

  test('tiles swap with their physical neighbor along the arrow and persist', async ({ page }) => {
    await page.goto(UNIT_CIRCLE);
    const order = () =>
      page.$$eval('[data-sim-panel]', (els) => els.map((e) => e.getAttribute('data-sim-panel')));
    expect(await order()).toEqual(['controls', 'measurements', 'graph', 'formula', 'observations', 'explanation']);
    // ↓ on Controls swaps it with the tile physically below it (Live measurements) in BOTH the
    // desktop grid and the stacked mobile column.
    await page.locator('[data-sim-panel="controls"] [data-panel-move="down"]').click();
    expect(await order()).toEqual(['measurements', 'controls', 'graph', 'formula', 'observations', 'explanation']);
    // The order persists across a reload (and thus across simulations).
    await page.reload();
    expect(await order()).toEqual(['measurements', 'controls', 'graph', 'formula', 'observations', 'explanation']);

    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      // Desktop grid: the bottom-left Graph tile can swap right (Formula) but has nothing to its
      // left (only spatially-truthful arrows are offered).
      await expect(page.locator('[data-sim-panel="graph"] [data-panel-move="right"]')).toBeVisible();
      await expect(page.locator('[data-sim-panel="graph"] [data-panel-move="left"]')).toBeHidden();
      await page.locator('[data-sim-panel="graph"] [data-panel-move="right"]').click();
      expect(await order()).toEqual(['measurements', 'controls', 'formula', 'graph', 'observations', 'explanation']);
    } else {
      // Stacked column: no sideways neighbors, so no sideways arrows.
      await expect(page.locator('[data-sim-panel="graph"] [data-panel-move="right"]')).toBeHidden();
      await expect(page.locator('[data-sim-panel="graph"] [data-panel-move="down"]')).toBeVisible();
    }
  });

  test('dragging the point around the circle sets the angle', async ({ page }) => {
    await page.goto(UNIT_CIRCLE);
    await page.getByRole('button', { name: 'Pause' }).click();
    expect(await page.getByLabel(/Angle θ/).inputValue()).toBe('45'); // default
    // Drag to straight above the circle centre (0.28, 0.52) → 90°.
    const canvas = page.locator('[data-sim-canvas]');
    const box = (await canvas.boundingBox())!;
    const pts: [number, number][] = [
      [0.4, 0.35],
      [0.34, 0.25],
      [0.28, 0.18],
    ].map(([x, y]) => [box.x + box.width * x, box.y + box.height * y]);
    await canvas.evaluate((el, points: [number, number][]) => {
      const fire = (type: string, x: number, y: number) =>
        el.dispatchEvent(
          new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true, cancelable: true }),
        );
      fire('pointerdown', points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) fire('pointermove', points[i][0], points[i][1]);
      fire('pointerup', points[points.length - 1][0], points[points.length - 1][1]);
    }, pts);
    const angle = Number(await page.getByLabel(/Angle θ/).inputValue());
    expect(angle).toBeGreaterThan(70);
    expect(angle).toBeLessThan(110);
  });
});
