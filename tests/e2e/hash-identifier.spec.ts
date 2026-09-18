import { test, expect } from '@playwright/test';

const URL = '/tool/developer-utilities/hash-identifier/';
const SHA256 = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
const SHA1 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';

test.describe('hash identifier', () => {
  test('names a SHA-1 length and does not call it SHA-256', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#hi-digest').fill(SHA1);
    await expect(page.locator('#hi-verdict')).toContainText('A SHA-1 length is not SHA-256.');
    await expect(page.locator('#hi-verdict')).not.toContainText('Does not match');
  });

  test('strips a filename, ignores case, and matches text', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#hi-digest').fill(`${SHA256.toUpperCase()}  hello.txt`);
    await expect(page.locator('#hi-verdict')).toContainText('A trailing filename was stripped.');
    await page.locator('#hi-text').fill('hello');
    await expect(page.locator('#hi-verdict')).toContainText('Matches SHA-256.');
    await expect(page.locator('#hi-verdict')).toContainText('Case differs, but the digest still matches.');
  });

  test('does not mismatch a SHA-1 digest when SHA-256 is selected', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#hi-algo').selectOption('sha256');
    await page.locator('#hi-digest').fill(SHA1);
    await page.locator('#hi-text').fill('hello');
    await expect(page.locator('#hi-verdict')).toContainText('A SHA-1 length is not SHA-256.');
    await expect(page.locator('#hi-verdict')).not.toContainText('Does not match');
  });

  test('hashes a local file in the page and reports a match', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#hi-digest').fill(SHA256);
    await page.locator('#hi-file').setInputFiles({
      name: 'hello.txt',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('hello'),
    });
    await expect(page.locator('#hi-verdict')).toContainText('Matches SHA-256.');
    await expect(page.locator('#hi-verdict')).toContainText('hello.txt');
  });

  test('calls an unknown length truncated and does not guess', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#hi-digest').fill('abc');
    await expect(page.locator('#hi-verdict')).toContainText('Truncated or unknown');
  });
});
