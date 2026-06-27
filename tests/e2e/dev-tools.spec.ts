// Pilot deep suite — the 9 developer-engine tools (encoding / hashing / structured-data).
// Exercises the real widget JS end-to-end on both viewports via the shared DevTool page
// object, so these functional assertions double as the template future engine specs reuse.
import { test, expect } from '@playwright/test';
import { DevTool } from './helpers/tools';

test.describe('encoding tools', () => {
  // The output pane is an editable textarea (two-way editing), so assert on its value.
  test('base64: encode, decode, swap, example', async ({ page }) => {
    const t = new DevTool(page, 'base64-encoder-decoder');
    await t.goto();

    await t.fill('Hello');
    await expect(t.output).toHaveValue('SGVsbG8=');

    await t.mode.selectOption('decode');
    await t.fill('SGVsbG8=');
    await expect(t.output).toHaveValue('Hello');

    // Swap: output → input, mode flips, recompute.
    await t.mode.selectOption('encode');
    await t.fill('Hello');
    await expect(t.output).toHaveValue('SGVsbG8=');
    await t.action('Swap').click();
    await expect(t.input).toHaveValue('SGVsbG8=');
    await expect(t.mode).toHaveValue('decode');
    await expect(t.output).toHaveValue('Hello');

    // Load example: fills the encoder's sample and recomputes (auto-detected to encode).
    await t.action('Load example').click();
    await expect(t.input).toHaveValue('Hello, World!');
    await expect(t.mode).toHaveValue('encode');
    await expect(t.output).toHaveValue('SGVsbG8sIFdvcmxkIQ==');
  });

  test('base64: auto-detects encoded input and shows a status line', async ({ page }) => {
    const t = new DevTool(page, 'base64-encoder-decoder');
    await t.goto();
    // A padded Base64 string is detected as decode without touching the mode select.
    await t.fill('SGVsbG8=');
    await expect(t.mode).toHaveValue('decode');
    await expect(t.output).toHaveValue('Hello');
    await expect(t.status).toContainText('Base64');
  });

  test('base64: two-way editing recomputes the opposite side', async ({ page }) => {
    const t = new DevTool(page, 'base64-encoder-decoder');
    await t.goto();
    await t.fill('Hello');
    await expect(t.output).toHaveValue('SGVsbG8=');
    // Editing the output (encoded side) decodes back into the input, no loop.
    await t.output.fill('d29ybGQ=');
    await expect(t.input).toHaveValue('world');
  });

  test('url: percent-encodes reserved characters', async ({ page }) => {
    const t = new DevTool(page, 'url-encoder-decoder');
    await t.goto();
    await t.fill('a b&c');
    await expect(t.output).toHaveValue('a%20b%26c');
  });

  test('html-entity: escapes markup', async ({ page }) => {
    const t = new DevTool(page, 'html-entity-encoder-decoder');
    await t.goto();
    await t.fill('<b>');
    await expect(t.output).toHaveValue('&lt;b&gt;');
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
      // No Generate button — the digest settles asynchronously on input. The output is
      // shown grouped for readability, so the raw digest lives on data-copy-value.
      await expect(t.output).toHaveAttribute('data-copy-value', digest);
    });
  }

  test('sha256: grouped display preserves the raw digest, and example loads', async ({ page }) => {
    const t = new DevTool(page, 'sha256-hash-generator');
    await t.goto();
    await t.fill('abc');
    const digest = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    // Visible text is grouped (contains spaces) but strips back to the raw digest.
    await expect(t.output).toHaveAttribute('data-copy-value', digest);
    const shown = (await t.output.textContent()) ?? '';
    expect(shown).toContain(' ');
    expect(shown.replace(/\s+/g, '')).toBe(digest);
    // Load example fills the sample and recomputes a fresh digest.
    await t.action('Load example').click();
    await expect(t.input).toHaveValue('The quick brown fox jumps over the lazy dog');
    await expect(t.output).toHaveAttribute(
      'data-copy-value',
      'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    );
  });
});

test.describe('structured-data tools', () => {
  test('json-formatter: pretty-prints with 2-space indent', async ({ page }) => {
    const t = new DevTool(page, 'json-formatter');
    await t.goto();
    await t.fill('{"a":1}');
    await expect.poll(async () => t.output.textContent()).toBe('{\n  "a": 1\n}');
  });

  test('json-formatter: load example fills and validates', async ({ page }) => {
    const t = new DevTool(page, 'json-formatter');
    await t.goto();
    await t.action('Load example').click();
    await expect(t.input).not.toHaveValue('');
    await expect(t.status).toHaveText('✓ Valid');
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
