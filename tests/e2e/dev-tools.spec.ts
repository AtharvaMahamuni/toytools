// Pilot deep suite — the 9 developer-engine tools (encoding / hashing / structured-data).
// Exercises the real widget JS end-to-end on both viewports via the shared DevTool page
// object, so these functional assertions double as the template future engine specs reuse.
import { test, expect } from '@playwright/test';
import { DevTool } from './helpers/tools';

test.describe('encoding tools', () => {
  test('base64: encode, decode, swap, sample', async ({ page }) => {
    const t = new DevTool(page, 'base64-encoder-decoder');
    await t.goto();

    await t.fill('Hello');
    await expect(t.output).toHaveText('SGVsbG8=');

    await t.mode.selectOption('decode');
    await t.fill('SGVsbG8=');
    await expect(t.output).toHaveText('Hello');

    // Swap: output → input, mode flips, recompute.
    await t.mode.selectOption('encode');
    await t.fill('Hello');
    await expect(t.output).toHaveText('SGVsbG8=');
    await t.action('Swap').click();
    await expect(t.input).toHaveValue('SGVsbG8=');
    await expect(t.mode).toHaveValue('decode');
    await expect(t.output).toHaveText('Hello');

    // Sample: loads the encoder's sample in encode mode.
    await t.action('Sample').click();
    await expect(t.input).toHaveValue('Hello, World!');
    await expect(t.mode).toHaveValue('encode');
    await expect(t.output).toHaveText('SGVsbG8sIFdvcmxkIQ==');
  });

  test('url: percent-encodes reserved characters', async ({ page }) => {
    const t = new DevTool(page, 'url-encoder-decoder');
    await t.goto();
    await t.fill('a b&c');
    await expect(t.output).toHaveText('a%20b%26c');
  });

  test('html-entity: escapes markup', async ({ page }) => {
    const t = new DevTool(page, 'html-entity-encoder-decoder');
    await t.goto();
    await t.fill('<b>');
    await expect(t.output).toHaveText('&lt;b&gt;');
  });
});

test.describe('hashing tools (live, async)', () => {
  const cases: Array<[string, string]> = [
    ['md5-hash-generator', '900150983cd24fb0d6963f7d28e17f72'],
    ['sha1-hash-generator', 'a9993e364706816aba3e25717850c26c9cd0d89d'],
    ['sha256-hash-generator', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['sha512-hash-generator', 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'],
  ];
  for (const [slug, digest] of cases) {
    test(`${slug}: hashes "abc" live`, async ({ page }) => {
      const t = new DevTool(page, slug);
      await t.goto();
      await t.fill('abc');
      // No Generate button — the digest settles asynchronously on input.
      await expect(t.output).toHaveText(digest);
    });
  }
});

test.describe('structured-data tools', () => {
  test('json-formatter: pretty-prints with 2-space indent', async ({ page }) => {
    const t = new DevTool(page, 'json-formatter');
    await t.goto();
    await t.fill('{"a":1}');
    await expect.poll(async () => t.output.textContent()).toBe('{\n  "a": 1\n}');
  });

  test('json-minifier: strips whitespace', async ({ page }) => {
    const t = new DevTool(page, 'json-minifier');
    await t.goto();
    await t.fill('{\n  "a": 1\n}');
    await expect.poll(async () => t.output.textContent()).toBe('{"a":1}');
  });

  test('json-validator: reports valid and invalid', async ({ page }) => {
    const t = new DevTool(page, 'json-validator');
    await t.goto();
    await t.fill('{"a":1}');
    await expect(t.status).toHaveText('✓ Valid');
    await t.fill('{bad');
    await expect(t.status).toContainText('✗');
  });
});
