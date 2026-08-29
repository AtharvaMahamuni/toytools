// Deep suite for the Chemistry Lab simulation domain (chemistry-lab engine). Generic render/a11y
// smoke is covered by smoke.spec.ts; this asserts the interactive behaviour of each chemistry sim:
// boot, the slider to measurement wiring, presets, and the two on-canvas interactions. Add each new
// chemistry sim's slug to the boot list below (the chemistry twin of physics.spec.ts).
import { test, expect, type Page } from '@playwright/test';

const NEWMAN = '/tool/chemistry/newman-projection-calculator/';
const CRYSTAL_FIELD = '/tool/chemistry/crystal-field-splitting-calculator/';
const REACTION = '/tool/chemistry/reaction-rate-calculator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('every chemistry tool', () => {
  for (const slug of [
    'newman-projection-calculator',
    'crystal-field-splitting-calculator',
    'reaction-rate-calculator',
  ]) {
    test(`${slug} boots its canvas without console errors`, async ({ page }) => {
      const errors = guardConsole(page);
      await page.goto(`/tool/chemistry/${slug}/`);
      await expect(page.locator('[data-sim-canvas]')).toBeVisible();
      await expect(page.locator('[data-sim-fallback]')).toBeHidden();
      await expect(page.locator('[data-sim-graph]')).toBeVisible();
      await page.waitForTimeout(200);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('newman projection simulator', () => {
  test('presets move the dihedral and the strain follows', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(NEWMAN);
    await page.getByRole('button', { name: 'Pause' }).click();

    // Butane anti is the global minimum: zero strain by definition.
    await page.getByRole('button', { name: 'Butane, anti' }).click();
    await expect(page.getByLabel('Dihedral angle in °')).toHaveValue('180');
    await expect(page.locator('[data-measurement="strain"]')).toHaveText(/0\.0 kJ\/mol/);

    // Butane gauche is the textbook 3.8 kJ/mol above it, all of it steric.
    await page.getByRole('button', { name: 'Butane, gauche' }).click();
    await expect(page.locator('[data-measurement="strain"]')).toHaveText(/3\.8 kJ\/mol/);
    await expect(page.locator('[data-measurement="torsional"]')).toHaveText(/0\.0 kJ\/mol/);

    // Ethane has no steric term at all, which is the point of the size slider.
    await page.getByRole('button', { name: 'Ethane, eclipsed' }).click();
    await expect(page.locator('[data-measurement="steric"]')).toHaveText(/0\.0 kJ\/mol/);
    await expect(page.locator('[data-measurement="strain"]')).toHaveText(/12\.0 kJ\/mol/);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('raising the temperature evens out the conformer populations', async ({ page }) => {
    await page.goto(NEWMAN);
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.getByRole('button', { name: 'Butane, anti' }).click();

    const anti = page.locator('[data-measurement="antiPopulation"]');
    const before = await anti.textContent();

    const temperature = page.getByLabel('Temperature in K');
    await temperature.fill('600');
    await temperature.dispatchEvent('input');
    await expect(anti).not.toHaveText(before!);
    // Hotter means less of the population sits in the deepest well.
    const after = Number((await anti.textContent())!.replace('%', ''));
    expect(after).toBeLessThan(Number(before!.replace('%', '')));
  });
});

test.describe('crystal field splitting simulator', () => {
  test('a strong field flips the complex from high spin to low spin', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(CRYSTAL_FIELD);
    await page.getByRole('button', { name: 'Pause' }).click();

    // Water is a weak field ligand: d6 stays high spin with four unpaired electrons.
    await page.getByRole('button', { name: '[Fe(H2O)6]2+ high spin' }).click();
    await expect(page.locator('[data-measurement="unpaired"]')).toHaveText(/^4/);
    await expect(page.locator('[data-measurement="moment"]')).toHaveText(/4\.90 BM/);

    // Cyanide is a strong field ligand: the same ion pairs up and goes diamagnetic.
    await page.getByRole('button', { name: '[Fe(CN)6]4- low spin' }).click();
    await expect(page.locator('[data-measurement="unpaired"]')).toHaveText(/^0/);
    await expect(page.locator('[data-measurement="moment"]')).toHaveText(/0\.00 BM/);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('tapping the complex switches geometry and shrinks the splitting', async ({ page }) => {
    await page.goto(CRYSTAL_FIELD);
    await page.getByRole('button', { name: 'Pause' }).click();
    const splitting = page.locator('[data-measurement="splitting"]');
    await expect(splitting).toHaveText(/20000/);

    const canvas = page.locator('[data-sim-canvas]');
    await canvas.click({ position: { x: 40, y: 40 } });
    // Tetrahedral splitting is four ninths of octahedral: 20000 → 8889.
    await expect(splitting).toHaveText(/8889/);
    await expect(page.getByLabel(/Geometry/)).toHaveValue('1');
  });
});

test.describe('reaction rate simulator', () => {
  test('activation energy and temperature move the rate constant', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(REACTION);
    await page.getByRole('button', { name: 'Pause' }).click();

    const logRate = page.locator('[data-measurement="logRate"]');
    const fast = Number((await logRate.textContent())!);

    // The same reaction with a taller barrier is orders of magnitude slower.
    await page.getByRole('button', { name: 'Too slow to see' }).click();
    const slow = Number((await logRate.textContent())!);
    expect(slow).toBeLessThan(fast - 5);

    // Heating it puts the rate back within reach, which is the whole Arrhenius lesson.
    await page.getByRole('button', { name: 'Same reaction, heated' }).click();
    expect(Number((await logRate.textContent())!)).toBeGreaterThan(slow + 5);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('the formula panel works as an Arrhenius calculator', async ({ page }) => {
    await page.goto(REACTION);
    await page.getByRole('button', { name: 'Pause' }).click();

    const worked = page.locator('[data-formula-worked]');
    await expect(worked).toContainText('log₁₀ k =');

    const temperature = page.getByLabel('Temperature value in K');
    await temperature.fill('400');
    await temperature.dispatchEvent('input');
    await expect(worked).toContainText('400');
    await expect(page.getByLabel('Temperature in K')).toHaveValue('400');
  });
});
