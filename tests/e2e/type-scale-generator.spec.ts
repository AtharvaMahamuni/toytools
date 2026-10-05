// Type Scale Generator end to end on desktop and Pixel 5. The ramp math is unit-tested in
// src/lib/engines/units/scale.test.ts.
import { test, expect } from '@playwright/test';

const URL = '/tool/design/type-scale-generator/';

test.describe('type scale generator', () => {
  test('renders eight steps, none of them a scroll trap', async ({ page }) => {
    await page.goto(URL);
    const samples = page.locator('#type-scale-generator-scale .ts-sample');
    await expect(samples).toHaveCount(8);
    // Every sample fits its line box (the g descender used to overflow a 1.1 line height by 1 to
    // 4 px), and none of them can scroll. Checked at the default 16px base and at 24px.
    const traps = () =>
      samples.evaluateAll((els) =>
        els
          .filter((el) => el.scrollHeight > el.clientHeight + 0.5 || ['auto', 'scroll'].includes(getComputedStyle(el).overflowY))
          .map((el) => `${(el as HTMLElement).style.fontSize} ${el.scrollHeight}/${el.clientHeight} ${getComputedStyle(el).overflowY}`),
      );
    expect(await traps()).toEqual([]);
    await page.locator('#type-scale-generator-base').fill('24');
    await expect(samples.first()).toHaveAttribute('style', /font-size: 15\.36px/);
    expect(await traps()).toEqual([]);
    await expect(page.locator('#type-scale-generator-css')).toContainText('rem');
  });

  test('rejects a base under 1px with the message it promises', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#type-scale-generator-base').fill('0.5');
    await expect(page.locator('#type-scale-generator-error')).toHaveText('Enter a base size between 1 and 200 pixels.');
  });
});
