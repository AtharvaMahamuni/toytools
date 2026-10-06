// Generation Engine deep suite — behaviours the generic smoke does not cover: auto-generated
// output, Regenerate producing a fresh value, and Copy feedback. Registry-driven off the built
// sitemap (every /tool/generate/ page), so each new generator is covered automatically. Guards
// on output visibility so a content-first generator (e.g. QR, which waits for input) is handled.
import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { toolPaths, slugFromPath } from './helpers/tools';

const requireFromHere = createRequire(import.meta.url);

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

      // Pressing once and demanding a different value assumes the output space is huge, which is
      // true of a password and false of a coin: half of all single flips repeat the last one, so
      // that assertion failed on a correct generator. The real invariant is that the draw is not
      // frozen, so press until it moves. Twenty presses of the smallest possible output space (two
      // outcomes) leaves a false failure at about one run in five hundred thousand.
      const regenerate = page.getByRole('button', { name: 'Regenerate' });
      let changed = false;
      for (let i = 0; i < 20 && !changed; i++) {
        await regenerate.click();
        changed = ((await textOutput.textContent()) ?? '') !== first;
      }
      expect(changed, `${slug} produced the same value on 20 consecutive draws`).toBe(true);
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

// Phase B PR 2: emoji and CJK must scan back exactly. Decode the rendered canvas in the page with a
// real QR reader (jsQR, a dev dependency injected only into this test page), and check that the
// typed text still leaves no trace in storage (#245).
if (qrPath) {
  const slug = 'qr-code-generator';
  for (const text of ['Héllo 😀', '日本語 测试']) {
    test(`qr-code-generator: the rendered code decodes to exactly "${text}"`, async ({ page }) => {
      await page.goto(qrPath);
      await page.locator(`#${slug}-f-text`).fill(text);
      await page.getByRole('button', { name: 'Regenerate' }).click();
      const canvas = page.locator(`#${slug}-canvas`);
      await expect(canvas).toBeVisible();
      await expect(page.locator('main')).toContainText('Modules');

      await page.addScriptTag({ path: requireFromHere.resolve('jsqr/dist/jsQR.js') });
      const decoded = await canvas.evaluate((c: HTMLCanvasElement) => {
        // Pad with a white quiet zone so the reader never depends on the widget's own margin.
        const pad = 32;
        const out = document.createElement('canvas');
        out.width = c.width + pad * 2;
        out.height = c.height + pad * 2;
        const ctx = out.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, out.width, out.height);
        ctx.drawImage(c, pad, pad);
        const img = ctx.getImageData(0, 0, out.width, out.height);
        const read = (window as unknown as { jsQR: (d: Uint8ClampedArray, w: number, h: number) => { data: string } | null })
          .jsQR(img.data, img.width, img.height);
        return read ? read.data : null;
      });
      expect(decoded).toBe(text);

      const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
      expect(stored).not.toContain(text);
      expect(stored).not.toContain(JSON.stringify(text).slice(1, -1));
    });
  }
}

test('uuid-inspector: a pasted UUID shows its version, and the version check stays quiet', async ({ page }) => {
  await page.goto('/tool/generate/uuid-inspector/');
  const input = page.locator('#uuid-inspector-f-input');
  const output = page.locator('#uuid-inspector-text');
  const note = page.locator('[data-craft="uuid-version-check"]');

  await expect(note).toBeHidden();
  await input.fill('919108f7-52d1-4320-9bac-f847db4148a8');
  await expect(output).toContainText('valid, v4, RFC 4122');
  await expect(output).not.toContainText('UTC');
  await expect(note).toBeHidden();

  await page.locator('#uuid-inspector-f-expect').selectOption('7');
  await expect(note).toBeVisible();
  await expect(note).toContainText('version 7');
  await expect(output).toContainText('not version 7');

  await input.fill('919108f7-52d1');
  await expect(output).toContainText('wrong length');
  await expect(note).toBeHidden();
});
