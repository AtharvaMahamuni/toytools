// Triangle Solver end to end on desktop and Pixel 5. The solving and rounding rules are unit-tested
// in src/lib/engines/math/triangle.test.ts; this proves the MathWidget wiring shows them.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/math/triangle-solver/';
const field = (page: Page, id: string) => page.locator(`#triangle-solver-f-${id}`);
const experience = (page: Page) => page.locator('#triangle-solver-experience');

async function enter(page: Page, parts: Record<string, string>) {
  for (const id of ['a', 'b', 'c', 'A', 'B', 'C']) await field(page, id).fill(parts[id] ?? '');
}

test.describe('triangle solver', () => {
  test('solves the default 3-4-5 as a right triangle and draws it', async ({ page }) => {
    await page.goto(URL);
    await expect(experience(page)).toContainText('Right triangle');
    await expect(experience(page)).toContainText('Angle A 36.87°, B 53.13°, C 90°.');
    await expect(page.locator('main svg').first()).toBeVisible();
  });

  test('shows equal base angles for an isosceles 1, 3, 3 triangle', async ({ page }) => {
    await page.goto(URL);
    await enter(page, { a: '1', b: '3', c: '3' });
    await expect(experience(page)).toContainText('Angle A 19.188°, B 80.406°, C 80.406°.');
  });

  test('names both SSA triangles when two fit', async ({ page }) => {
    await page.goto(URL);
    await enter(page, { a: '7', b: '10', A: '30' });
    await expect(experience(page)).toContainText('Two triangles');
    await expect(experience(page)).toContainText('second triangle');
  });
});
