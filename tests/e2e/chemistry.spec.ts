// Deep suite for the Chemistry Lab simulation domain (chemistry-lab engine). Generic render/a11y
// smoke is covered by smoke.spec.ts; this asserts the interactive behaviour of each chemistry sim:
// boot, the slider to measurement wiring, presets, and the two on-canvas interactions. Add each new
// chemistry sim's slug to the boot list below (the chemistry twin of physics.spec.ts).
import { test, expect, type Page } from '@playwright/test';

const NEWMAN = '/tool/chemistry/newman-projection-calculator/';
const CRYSTAL_FIELD = '/tool/chemistry/crystal-field-splitting-calculator/';
const REACTION = '/tool/chemistry/reaction-rate-calculator/';
const CONFIGURATION = '/tool/chemistry/electron-configuration-calculator/';
const BOND = '/tool/chemistry/chemical-bond-calculator/';

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
    'electron-configuration-calculator',
    'chemical-bond-calculator',
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

test.describe('electron configuration simulator', () => {
  test('takes 4s electrons before 3d when the atom becomes an ion', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(CONFIGURATION);
    await page.getByRole('button', { name: 'Pause' }).click();

    await page.getByRole('button', { name: 'Iron', exact: true }).click();
    await expect(page.locator('[data-measurement="electrons"]')).toHaveText(/^26/);
    await expect(page.locator('[data-measurement="valence"]')).toHaveText(/^2/);

    // Fe2+ keeps all six 3d electrons and loses both 4s ones, so the outer shell drops to 3.
    await page.getByRole('button', { name: 'Fe2+ (loses 4s first)' }).click();
    await expect(page.locator('[data-measurement="electrons"]')).toHaveText(/^24/);
    await expect(page.locator('[data-measurement="shells"]')).toHaveText(/^3/);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('names the aufbau exception when it lands on one', async ({ page }) => {
    await page.goto(CONFIGURATION);
    await page.getByRole('button', { name: 'Pause' }).click();

    await page.getByRole('button', { name: 'Chromium (exception)' }).click();
    // Chromium is 4s1 3d5: six unpaired electrons, which plain aufbau would never give.
    await expect(page.locator('[data-measurement="unpaired"]')).toHaveText(/^6/);
    await expect(page.locator('[data-sim-observations]')).toContainText(/aufbau/i);
  });

  test('the formula panel subtracts the charge from the atomic number', async ({ page }) => {
    await page.goto(CONFIGURATION);
    await page.getByRole('button', { name: 'Pause' }).click();
    const worked = page.locator('[data-formula-worked]');
    await expect(worked).toContainText('e =');

    // The formula input is labelled from the FORMULA TERM ('Atomic number'), not the slider
    // ('Atomic number Z'), which is why this is not the slider's label.
    const z = page.getByLabel('Atomic number value');
    await z.fill('17');
    await z.dispatchEvent('input');
    await expect(page.locator('[data-measurement="electrons"]')).toHaveText(/^17/);
  });
});

test.describe('chemical bond simulator', () => {
  test('slides from nonpolar to ionic as the partners change', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(BOND);
    await page.getByRole('button', { name: 'Pause' }).click();

    await page.getByRole('button', { name: 'O=O, nonpolar' }).click();
    await expect(page.locator('[data-measurement="deltaEN"]')).toHaveText(/0\.00/);
    await expect(page.locator('[data-measurement="ionicCharacter"]')).toHaveText(/0\.0 %/);

    await page.getByRole('button', { name: 'Na-Cl, ionic' }).click();
    await expect(page.locator('[data-measurement="deltaEN"]')).toHaveText(/2\.23/);
    await expect(page.locator('[data-measurement="ionicCharacter"]')).toHaveText(/71\.[0-9] %/);

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('warns where the 1.7 cutoff misclassifies a nonmetal pair', async ({ page }) => {
    await page.goto(BOND);
    await page.getByRole('button', { name: 'Pause' }).click();

    await page.getByRole('button', { name: 'H-F, where the cutoff fails' }).click();
    await expect(page.locator('[data-measurement="deltaEN"]')).toHaveText(/1\.78/);
    // Past the cutoff, so a naive tool would call it ionic. This one says why that is wrong.
    await expect(page.locator('[data-sim-observations]')).toContainText(/both partners are nonmetals/i);
  });
});
