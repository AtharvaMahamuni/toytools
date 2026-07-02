// Tool Groups — unified workspace behaviour across grouped tools.
// The switcher pills are real links (SEO: crawlable internal links); input text
// survives navigation via the shared `group:{id}` state key.
import { test, expect } from '@playwright/test';

const INPUT = 'Hello World Example';

test.describe('case-converter group switcher', () => {
  test('renders all modes with the active one marked', async ({ page }) => {
    await page.goto('/tool/text/camel-case-converter/');
    const nav = page.getByRole('navigation', { name: 'Case Converter modes' });
    await expect(nav.getByRole('link')).toHaveCount(7);
    await expect(nav.getByRole('link', { name: 'camelCase' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'snake_case' })).not.toHaveAttribute('aria-current', 'page');
  });

  test('input survives a mode switch and output re-converts', async ({ page }) => {
    await page.goto('/tool/text/camel-case-converter/');
    const nav = page.getByRole('navigation', { name: 'Case Converter modes' });

    await page.locator('#camel-case-converter-input').fill(INPUT);
    await expect(page.locator('#camel-case-converter-output')).toHaveValue('helloWorldExample');

    await nav.getByRole('link', { name: 'snake_case' }).click();
    await expect(page).toHaveURL(/\/tool\/text\/snake-case-converter\/$/);

    // Same input restored from the shared group state, recomputed in the new mode.
    await expect(page.locator('#snake-case-converter-input')).toHaveValue(INPUT);
    await expect(page.locator('#snake-case-converter-output')).toHaveValue('hello_world_example');

    // Active pill follows the page.
    await expect(nav.getByRole('link', { name: 'snake_case' })).toHaveAttribute('aria-current', 'page');
  });

  test('non-group processor tools keep per-tool state keys', async ({ page }) => {
    await page.goto('/tool/text/reverse-text/');
    await expect(page.locator('[data-state-key="reverse-text"]')).toHaveCount(1);
    await page.goto('/tool/text/camel-case-converter/');
    await expect(page.locator('[data-state-key="group:case-converters"]')).toHaveCount(1);
  });
});

test.describe('text-cleanup group switcher', () => {
  test('input survives a mode switch and output re-processes', async ({ page }) => {
    await page.goto('/tool/text/remove-extra-spaces/');
    const nav = page.getByRole('navigation', { name: 'Text Cleanup modes' });
    await expect(nav.getByRole('link')).toHaveCount(9);

    await page.locator('#remove-extra-spaces-input').fill('a  b\n\nc');
    await expect(page.locator('#remove-extra-spaces-output')).toHaveValue('a b\n\nc');

    await nav.getByRole('link', { name: 'Blank Lines' }).click();
    await expect(page).toHaveURL(/\/tool\/text\/remove-blank-lines\/$/);
    await expect(page.locator('#remove-blank-lines-input')).toHaveValue('a  b\n\nc');
    await expect(page.locator('#remove-blank-lines-output')).toHaveValue('a  b\nc');
  });
});

test.describe('encoder group switcher', () => {
  test('input survives a switch; conversion direction stays per-tool', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    const nav = page.getByRole('navigation', { name: 'Encoder / Decoder modes' });
    await expect(nav.getByRole('link')).toHaveCount(8);

    const b64Input = page.locator('#base64-encoder-decoder-input');
    await b64Input.fill(INPUT);
    await expect(page.locator('#base64-encoder-decoder-output')).toHaveValue('SGVsbG8gV29ybGQgRXhhbXBsZQ==');

    // Force base64 into decode — this must NOT leak into the url tool's direction.
    await page.locator('#base64-encoder-decoder-mode').selectOption('decode');

    await nav.getByRole('link', { name: 'URL' }).click();
    await expect(page).toHaveURL(/\/tool\/developer-utilities\/url-encoder-decoder\/$/);
    await expect(page.locator('#url-encoder-decoder-input')).toHaveValue(INPUT);
    await expect(page.locator('#url-encoder-decoder-output')).toHaveValue('Hello%20World%20Example');
  });
});

test.describe('text-counter group switcher', () => {
  test('text survives a switch and metrics recompute', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    const nav = page.getByRole('navigation', { name: 'Text Counter modes' });
    await expect(nav.getByRole('link')).toHaveCount(9);

    await page.locator('#word-counter-input').fill(INPUT);
    await expect(page.locator('.hero-value')).toHaveText('3');

    await nav.getByRole('link', { name: 'Characters' }).click();
    await expect(page).toHaveURL(/\/tool\/text\/character-counter\/$/);
    await expect(page.locator('#character-counter-input')).toHaveValue(INPUT);
    await expect(page.locator('.hero-value')).toHaveText('19');
  });
});

test.describe('json-yaml group switcher', () => {
  test('input survives a switch and recomputes live (no Convert button)', async ({ page }) => {
    await page.goto('/tool/developer-utilities/json-to-yaml-converter/');
    await page.locator('#json-to-yaml-converter-input').fill('{"a": 1}');
    await expect(page.locator('#json-to-yaml-converter-output')).toContainText('a: 1');

    const nav = page.getByRole('navigation', { name: 'JSON ↔ YAML modes' });
    await nav.getByRole('link', { name: 'YAML → JSON' }).click();
    await expect(page).toHaveURL(/\/tool\/developer-utilities\/yaml-to-json-converter\/$/);
    // JSON is valid YAML, so the shared input converts straight back.
    await expect(page.locator('#yaml-to-json-converter-input')).toHaveValue('{"a": 1}');
    await expect(page.locator('#yaml-to-json-converter-output')).toContainText('"a": 1');
  });
});

test.describe('hash group switcher', () => {
  test('input survives a switch and the new digest computes', async ({ page }) => {
    await page.goto('/tool/developer-utilities/md5-hash-generator/');
    const nav = page.getByRole('navigation', { name: 'Hash Generator modes' });
    await expect(nav.getByRole('link')).toHaveCount(5);

    await page.locator('#md5-hash-generator-input').fill(INPUT);
    const md5Out = page.locator('#md5-hash-generator-output');
    await expect(md5Out).not.toHaveAttribute('data-empty', '');

    await nav.getByRole('link', { name: 'SHA-256' }).click();
    await expect(page).toHaveURL(/\/tool\/developer-utilities\/sha256-hash-generator\/$/);
    await expect(page.locator('#sha256-hash-generator-input')).toHaveValue(INPUT);
    await expect(page.locator('#sha256-hash-generator-output')).not.toHaveAttribute('data-empty', '');
  });
});
