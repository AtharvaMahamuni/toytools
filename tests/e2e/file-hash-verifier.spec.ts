// File Hash Verifier end to end on desktop and Pixel 5. Hashing is unit-tested in the hashing
// engine; this proves the page hashes a chosen file and never judges a new file against a digest
// left over from an earlier session.
import { test, expect } from '@playwright/test';

const URL = '/tool/developer-utilities/file-hash-verifier/';
const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const file = (name: string, text: string) => ({ name, mimeType: 'application/octet-stream', buffer: Buffer.from(text) });

test.describe('file hash verifier', () => {
  test('hashes a local file and matches the published digest', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#file-hash-verifier-file').setInputFiles(file('abc.txt', 'abc'));
    await expect(page.locator('#file-hash-verifier-digest')).toHaveText(ABC_SHA256);
    await page.locator('#file-hash-verifier-expected').fill(`${ABC_SHA256}  abc.txt`);
    await expect(page.locator('#file-hash-verifier-compare')).toHaveAttribute('data-state', 'match');
  });

  test('does not restore an old expected digest, and Clear empties the page', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#file-hash-verifier-file').setInputFiles(file('abc.txt', 'abc'));
    await page.locator('#file-hash-verifier-expected').fill(ABC_SHA256);
    await expect(page.locator('#file-hash-verifier-compare')).toHaveAttribute('data-state', 'match');

    await page.reload();
    await expect(page.locator('#file-hash-verifier-expected')).toHaveValue('');
    await page.locator('#file-hash-verifier-file').setInputFiles(file('other.txt', 'something else'));
    await expect(page.locator('#file-hash-verifier-digest')).not.toHaveText('');
    await expect(page.locator('#file-hash-verifier-compare')).toBeHidden();

    await page.locator('#file-hash-verifier-expected').fill('deadbeef');
    await page.locator('#file-hash-verifier-clear').click();
    await expect(page.locator('#file-hash-verifier-digest')).toHaveText('');
    await expect(page.locator('#file-hash-verifier-expected')).toHaveValue('');
    await expect(page.locator('#file-hash-verifier-compare')).toBeHidden();
  });
});
