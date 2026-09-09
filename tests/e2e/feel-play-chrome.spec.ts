import { test, expect, type Page } from '@playwright/test';

const TOOLS: { url: string; surface: string }[] = [
  { url: '/tool/fidget/gears/', surface: '[data-gears-svg]' },
  { url: '/tool/fidget/spinner/', surface: '[data-spin-stage]' },
  { url: '/tool/fidget/kinetic-sand/', surface: '[data-sand-canvas]' },
  { url: '/tool/fidget/slime/', surface: '[data-slime-canvas]' },
  { url: '/tool/fidget/pop-it/', surface: '[data-pop-board]' },
  { url: '/tool/fidget/switch-board/', surface: '[data-sb-board]' },
  { url: '/tool/fidget/breathing-circle/', surface: '[data-br-stage]' },
];

function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

async function assertNoOverlap(page: Page, a: string, b: string) {
  const boxA = await page.locator(a).boundingBox();
  const boxB = await page.locator(b).boundingBox();
  expect(boxA, a).toBeTruthy();
  expect(boxB, b).toBeTruthy();
  expect(overlaps(boxA!, boxB!), `${a} overlaps ${b}`).toBe(false);
}

test.describe('feel play chrome stays off the toy', () => {
  for (const tool of TOOLS) {
    test(`${tool.url} Exit and Mute do not cover the stage`, async ({ page }) => {
      await page.goto(tool.url);
      await page.locator('[data-feel-play]').click();
      await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
      await expect(page.locator('[data-feel-exit]')).toBeVisible();
      await expect(page.locator('[data-feel-mute]')).toBeVisible();
      await assertNoOverlap(page, '[data-feel-exit]', tool.surface);
      await assertNoOverlap(page, '[data-feel-mute]', tool.surface);
    });
  }

  test('kinetic sand Reset pile sits below the canvas in Play', async ({ page }) => {
    await page.goto('/tool/fidget/kinetic-sand/');
    await page.locator('[data-feel-play]').click();
    await expect(page.locator('[data-sand-reset-play]')).toBeVisible();
    await assertNoOverlap(page, '[data-sand-reset-play]', '[data-sand-canvas]');
  });
});
