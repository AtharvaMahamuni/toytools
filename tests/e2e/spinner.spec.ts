import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/fidget/spinner/';

const status = (page: Page) => page.locator('[data-spin-status]');
const stage = (page: Page) => page.locator('[data-spin-stage]');

test.describe('fidget spinner', () => {
  test('opens Stopped and declares rest craft', async ({ page }) => {
    await page.goto(URL);
    await expect(status(page)).toHaveText('Stopped');
    await expect(status(page)).toHaveAttribute('data-craft', 'spinner-rest');
  });

  test('a flick starts a spin that can reach Stopped', async ({ page }) => {
    await page.goto(URL);
    const box = await stage(page).boundingBox();
    expect(box).toBeTruthy();
    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 40, y - 80, { steps: 4 });
    await page.mouse.up();
    await expect(status(page)).toHaveText(/Spinning|Stopped/);
    await expect.poll(async () => status(page).textContent(), { timeout: 8_000 }).toBe('Stopped');
  });

  test('Play fills the stage and Escape exits', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-feel-play]').click();
    await expect(page.locator('html')).toHaveClass(/tt-play-mode/);
    await expect(page.locator('[data-feel-exit]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).not.toHaveClass(/tt-play-mode/);
  });
});
