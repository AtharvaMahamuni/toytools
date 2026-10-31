import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/infinity-cube/';

const count = (page: Page) => page.locator('#infinity-cube-count');

async function ready(page: Page) {
  await page.goto(URL);
  await page.waitForFunction(() => {
    const TT = (window as unknown as { ToyTools?: { feel?: { infinityCube?: unknown; setPrefs?: (p: unknown) => unknown } } }).ToyTools;
    return Boolean(TT && TT.feel && TT.feel.infinityCube);
  });
  await page.evaluate(() => {
    const TT = (window as unknown as { ToyTools?: { feel?: { setPrefs?: (p: { motion: string }) => unknown } } }).ToyTools;
    if (TT && TT.feel && TT.feel.setPrefs) TT.feel.setPrefs({ motion: 'full' });
  });
}

test.describe('infinity cube', () => {
  test('folds once, ignores a second input during the fold, and reset closes it', async ({ page }) => {
    await ready(page);
    await expect(page.locator('[data-craft="infinity-cube-hinge"]')).toBeVisible();
    await expect(count(page)).toContainText('Closed');
    await expect(count(page)).toContainText('0 folds');
    await expect(page.locator('#infinity-cube-stage .infinity-cue')).toHaveCount(0);

    // The first locked face's box overlaps the free half. Tap one whose pixels are actually gray.
    await page.evaluate(() => {
      const svg = document.querySelector('#infinity-cube-stage');
      if (!svg) throw new Error('missing stage');
      const locked = [...svg.querySelectorAll('[data-infinity-cube][data-free="0"]')];
      const exposed = locked.find((poly) => {
        const box = poly.getBoundingClientRect();
        const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return top === poly;
      });
      if (!exposed) throw new Error('missing locked face');
      exposed.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    });
    await expect(count(page)).toContainText('0 folds');

    await page.evaluate(() => {
      const fire = () => {
        const cube = document.querySelector('[data-infinity-cube][data-free="1"]');
        if (!cube) throw new Error('missing free cube');
        cube.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
      };
      fire();
      fire();
    });

    await expect(count(page)).toContainText('1 fold', { timeout: 3000 });
    await expect(count(page)).toHaveAttribute('data-infinity-folds', '1');
    await expect(page.locator('[data-infinity-phase]')).toHaveAttribute('data-infinity-phase', 'open');

    await page.locator('#infinity-cube-reset').click();
    await expect(count(page)).toContainText('Closed');
    await expect(count(page)).toContainText('0 folds');
    await expect(page.locator('[data-infinity-phase]')).toHaveAttribute('data-infinity-phase', 'closed');
  });

  test('does not scroll the page sideways at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
