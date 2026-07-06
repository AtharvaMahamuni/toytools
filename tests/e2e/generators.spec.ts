// Generation Engine deep suite — behaviours the generic smoke does not cover: auto-generated
// output, Regenerate producing a fresh value, and Copy feedback. Registry-driven off the built
// sitemap (every /tool/generate/ page), so each new generator is covered automatically. Guards
// on output visibility so a content-first generator (e.g. QR, which waits for input) is handled.
import { test, expect } from '@playwright/test';
import { toolPaths, slugFromPath } from './helpers/tools';

const generatorPaths = toolPaths().filter((p) => p.startsWith('/tool/generate/'));

for (const path of generatorPaths) {
  const slug = slugFromPath(path);

  test(`generator ${slug}: auto-output + regenerate yields a fresh value`, async ({ page }) => {
    await page.goto(path);
    const textOutput = page.locator(`#${slug}-text`);

    // Text/lines generators auto-produce output on load; assert it is present, then that
    // Regenerate (a fresh random draw) changes it. Content-first generators (QR) skip this.
    if (await textOutput.isVisible()) {
      const first = (await textOutput.textContent()) ?? '';
      expect(first.length, 'auto-generated output is non-empty').toBeGreaterThan(0);

      await page.getByRole('button', { name: 'Regenerate' }).click();
      await expect
        .poll(async () => (await textOutput.textContent()) ?? '', { timeout: 2000 })
        .not.toBe(first);
    } else {
      // Still assert Regenerate is present and does not throw.
      await page.getByRole('button', { name: 'Regenerate' }).click();
    }
  });

  test(`generator ${slug}: copy gives success feedback`, async ({ page }) => {
    await page.goto(path);
    const textOutput = page.locator(`#${slug}-text`);
    if (!(await textOutput.isVisible())) return; // nothing to copy for a content-first generator yet

    await page.getByRole('button', { name: 'Copy' }).click();
    await expect(page.getByRole('button', { name: /Copied/ })).toBeVisible();
  });
}

// QR-specific: typing content renders the canvas and reveals the PNG + SVG download buttons.
const qrPath = generatorPaths.find((p) => p.includes('qr-code-generator'));
if (qrPath) {
  const slug = 'qr-code-generator';
  test('qr-code-generator: content renders a canvas + PNG/SVG downloads', async ({ page }) => {
    await page.goto(qrPath);
    const value = page.locator(`#${slug}-f-text`);
    await expect(value).toBeVisible();
    await value.fill('https://toytoolsapp.com');

    const canvas = page.locator(`#${slug}-canvas`);
    await expect(canvas).toBeVisible();
    // Canvas has real drawing dimensions once a matrix is rendered.
    await expect.poll(async () => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(0);

    await expect(page.getByRole('button', { name: 'Download PNG' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download SVG' })).toBeVisible();
  });
}
