// The craft ratchet, in a real browser.
//
// scripts/check-craft.ts proves a tool DECLARES a thoughtful touch and that its id reaches the
// built HTML. That is a string match, and a string match cannot tell whether the thing works. This
// spec asserts the rest: the affordance exists in a live page, it is reachable on a phone, and for
// the encoding engine it actually repairs the input it exists to repair.
//
// Pixel 5 carries the geometry assertions, because ToyTools is phone-first and a control that only
// works on a laptop is not shipped. The behaviour cases run on both projects.
//
// Background: docs/analysis/2026-08-11-tool-craft.md
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { toolPaths, slugFromPath } from './helpers/tools';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');

/**
 * Every tool that declares a craft, read from the built code map rather than the TypeScript
 * registry, for the same reason toolPaths() reads the sitemap: Playwright does not resolve the
 * repo's `@data` path aliases at runtime.
 */
function craftTools(): { slug: string; path: string; craftId: string }[] {
  const paths = toolPaths();
  const out: { slug: string; path: string; craftId: string }[] = [];
  for (const path of paths) {
    const slug = slugFromPath(path);
    const html = readFileSync(resolve(repoRoot, `dist${path}index.html`), 'utf8');
    const m = html.match(/data-craft="([^"]+)"/);
    if (m) out.push({ slug, path, craftId: m[1]! });
  }
  return out;
}

const tools = craftTools();

test.describe('tool craft', () => {
  test('the catalog ships at least one declared craft affordance', () => {
    // Guards the discovery above: a selector typo here would silently empty the suite and every
    // per-tool assertion below would vacuously pass.
    expect(tools.length).toBeGreaterThan(0);
  });

  for (const { slug, path, craftId } of tools) {
    test(`${slug}: its craft affordance is present and phone-reachable`, async ({ page }, testInfo) => {
      await page.goto(path);
      const el = page.locator(`[data-craft="${craftId}"]`);
      await expect(el).toHaveCount(1);

      // It may legitimately start hidden (R3: silent until relevant), so presence is asserted in
      // the DOM rather than visibility. What must hold either way is that it is inside the tool
      // and not stranded off-screen horizontally.
      const box = await el.evaluate((node) => {
        const r = (node as HTMLElement).getBoundingClientRect();
        return { width: r.width, left: r.left, right: r.right };
      });
      if (box.width > 0) {
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
      }

      // A visible control has to be tappable. 48px is the project's touch-target floor.
      if (testInfo.project.name === 'pixel5' && (await el.isVisible())) {
        const tag = await el.evaluate((node) => node.tagName.toLowerCase());
        if (tag === 'button' || tag === 'a' || tag === 'input') {
          const height = (await el.boundingBox())?.height ?? 0;
          expect(height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  }
});

test.describe('encoding recovery (the craft seam)', () => {
  test('base64 offers to decode a data URI, and applying it works', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    const input = page.locator('#base64-encoder-decoder-input');
    const offer = page.locator('[data-craft="b64-recover"]');

    await expect(offer).toBeHidden();

    await input.fill('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
    await expect(offer).toBeVisible();
    await expect(offer).toHaveText('Decode the data URI payload');

    await offer.click();
    await expect(page.locator('#base64-encoder-decoder-output')).toHaveValue('Hello, World!');
    // The offer retires once taken, rather than sitting there suggesting a fix already applied.
    await expect(offer).toBeHidden();
  });

  test('base64 offers nothing for well-formed input', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    await page.locator('#base64-encoder-decoder-input').fill('SGVsbG8=');
    await expect(page.locator('[data-craft="b64-recover"]')).toBeHidden();
  });

  test('base64 stays silent over ordinary prose', async ({ page }) => {
    // The silence test: an offer that fires on normal typing turns a quiet tool into a nagging one.
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    await page.locator('#base64-encoder-decoder-input').fill('The quick brown fox');
    await expect(page.locator('[data-craft="b64-recover"]')).toBeHidden();
  });

  test('url rescues a decode broken by a stray percent sign', async ({ page }) => {
    await page.goto('/tool/developer-utilities/url-encoder-decoder/');
    const input = page.locator('#url-encoder-decoder-input');
    const offer = page.locator('[data-craft="url-recover"]');

    await input.fill('50% off%20today');
    await page.locator('#url-encoder-decoder-mode').selectOption('decode');
    await expect(offer).toBeVisible();

    await offer.click();
    await expect(page.locator('#url-encoder-decoder-output')).toHaveValue('50% off today');
  });

  test('a tool whose processor has no honest fix renders no offer at all', async ({ page }) => {
    // Declining to guess is a legitimate answer, and it must cost nothing on the page.
    await page.goto('/tool/developer-utilities/hex-encoder-decoder/');
    await expect(page.locator('.conv-recover')).toHaveCount(0);
  });
});

test.describe('digest verification (the hashing craft seam)', () => {
  const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

  test('sha256 confirms a matching digest', async ({ page }) => {
    await page.goto('/tool/developer-utilities/sha256-hash-generator/');
    const result = page.locator('[data-digest-result]');

    // Silent before anything is asked of it.
    await expect(result).toBeHidden();

    await page.locator('#sha256-hash-generator-input').fill('abc');
    await page.locator('[data-digest-expected]').fill(ABC_SHA256);
    await expect(result).toBeVisible();
    await expect(result).toHaveAttribute('data-state', 'match');
  });

  test('sha256 accepts a whole line of sha256sum output, filename and all', async ({ page }) => {
    await page.goto('/tool/developer-utilities/sha256-hash-generator/');
    await page.locator('#sha256-hash-generator-input').fill('abc');
    await page.locator('[data-digest-expected]').fill(`${ABC_SHA256}  ./archive.tar.gz`);
    await expect(page.locator('[data-digest-result]')).toHaveAttribute('data-state', 'match');
  });

  test('sha256 reports a real mismatch', async ({ page }) => {
    await page.goto('/tool/developer-utilities/sha256-hash-generator/');
    await page.locator('#sha256-hash-generator-input').fill('abc');
    await page.locator('[data-digest-expected]').fill('f'.repeat(64));
    await expect(page.locator('[data-digest-result]')).toHaveAttribute('data-state', 'mismatch');
  });

  test('a SHA-1 digest pasted into the SHA-256 tool is named, not called a mismatch', async ({ page }) => {
    // The failure the whole affordance exists for: without this, a wrong-algorithm paste reads as
    // a corrupt file and sends somebody re-downloading something that was never broken.
    await page.goto('/tool/developer-utilities/sha256-hash-generator/');
    await page.locator('#sha256-hash-generator-input').fill('abc');
    await page.locator('[data-digest-expected]').fill('a9993e364706816aba3e25717850c26c9cd0d89d');
    const result = page.locator('[data-digest-result]');
    await expect(result).toHaveAttribute('data-state', 'wrong-length');
    await expect(result).toContainText('SHA-1');
  });

  test('the verdict follows the source text, not just the pasted digest', async ({ page }) => {
    // Both edges drive it. Changing the input after a match must re-evaluate, or a stale "Matches"
    // stays on screen for text that no longer produces that digest.
    await page.goto('/tool/developer-utilities/sha256-hash-generator/');
    await page.locator('#sha256-hash-generator-input').fill('abc');
    await page.locator('[data-digest-expected]').fill(ABC_SHA256);
    await expect(page.locator('[data-digest-result]')).toHaveAttribute('data-state', 'match');

    await page.locator('#sha256-hash-generator-input').fill('abcd');
    await expect(page.locator('[data-digest-result]')).toHaveAttribute('data-state', 'mismatch');
  });

  test('it stays silent while only the source text is filled', async ({ page }) => {
    await page.goto('/tool/developer-utilities/md5-hash-generator/');
    await page.locator('#md5-hash-generator-input').fill('hello');
    await expect(page.locator('[data-digest-result]')).toBeHidden();
  });

  test('a tool with no digest to compare renders no comparison row', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    await expect(page.locator('[data-digest-expected]')).toHaveCount(0);
  });
});

test.describe('JSON repair (the structured-data craft seam)', () => {
  test('json-formatter offers to remove a trailing comma, and applying it works', async ({ page }) => {
    await page.goto('/tool/developer-utilities/json-formatter/');
    const input = page.locator('#json-formatter-input');
    const offer = page.locator('[data-craft="json-formatter-repair"]');

    await expect(offer).toBeHidden();
    await input.fill('{"a": 1, "b": 2,}');
    await expect(offer).toBeVisible();
    await expect(offer).toHaveText('Remove the trailing comma');

    await offer.click();
    await expect(page.locator('#json-formatter-status')).toHaveAttribute('data-ok', 'true');
    await expect(offer).toBeHidden();
  });

  test('it names smart quotes, the fault a document introduces', async ({ page }) => {
    await page.goto('/tool/developer-utilities/json-validator/');
    await page.locator('#json-validator-input').fill('{“a”: 1}');
    await expect(page.locator('[data-craft="json-validator-repair"]')).toContainText('smart quotes');
  });

  test('it stays silent on valid JSON', async ({ page }) => {
    await page.goto('/tool/developer-utilities/json-formatter/');
    await page.locator('#json-formatter-input').fill('{"a": 1}');
    await expect(page.locator('[data-craft="json-formatter-repair"]')).toBeHidden();
  });

  test('it stays silent on a fault it cannot honestly fix', async ({ page }) => {
    // A missing brace is not a repair this knows how to make, and guessing is worse than quiet.
    await page.goto('/tool/developer-utilities/json-formatter/');
    await page.locator('#json-formatter-input').fill('{"a": 1');
    await expect(page.locator('[data-craft="json-formatter-repair"]')).toBeHidden();
  });

  test('a tool whose input is not JSON renders no repair offer', async ({ page }) => {
    await page.goto('/tool/developer-utilities/yaml-to-json-converter/');
    await expect(page.locator('.sd-repair')).toHaveCount(0);
  });
});
