// Phase C batch C1/C2 page checks: slugify note, reverse by grapheme, emoji ZWJ kept, named
// HTML entities, and JSON Diff keeping nothing.
import { test, expect } from '@playwright/test';
import { DevTool } from './helpers/tools';

test('JSON Diff removes its old saved panes and saves nothing new (item 11)', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('toytools:json-diff', JSON.stringify({ v: 1, data: { left: '{"secret":1}', right: '{"secret":2}' } }));
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto('/tool/developer-utilities/json-diff/');
  const panes = page.locator('textarea');
  await expect(panes.first()).toHaveValue('');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('toytools:json-diff'))).toBeNull();
  await panes.first().fill('{"a":1}');
  await panes.nth(1).fill('{"a":2}');
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.includes('json-diff')))).toEqual([]);
  await expect(page.getByText('Runs entirely on your device. Nothing is uploaded.').first()).toBeAttached();
});

test('slugify transliterates and explains a non-Latin line (item 3)', async ({ page }) => {
  await page.goto('/tool/text/slugify-text/');
  await page.locator('#slugify-text-input').fill('Straße Øresund Łódź æble');
  await expect(page.locator('#slugify-text-output')).toHaveValue('strasse-oresund-lodz-aeble');
  await page.locator('#slugify-text-input').fill('Привет мир');
  await expect(page.locator('[data-craft="slug-empty"]')).toContainText('no Latin letters or digits');
});

test('reverse text keeps a combining accent and a ZWJ emoji whole (item 4)', async ({ page }) => {
  await page.goto('/tool/text/reverse-text/');
  await page.locator('#reverse-text-input').fill('Cafe\u0301 👩‍💻!');
  await expect(page.locator('#reverse-text-output')).toHaveValue('!👩‍💻 e\u0301faC');
});

test('invisible character cleaning keeps the ZWJ inside emoji (item 5)', async ({ page }) => {
  await page.goto('/tool/text/invisible-character-detector/');
  await page.locator('#ic-input').fill('a\u200Bb 👩‍💻 👨‍👩‍👧');
  await expect(page.locator('#ic-clean')).toHaveValue('ab 👩‍💻 👨‍👩‍👧');
});

test('HTML entity decoder decodes HTML5 named references (item 8)', async ({ page }) => {
  const t = new DevTool(page, 'html-entity-encoder-decoder');
  await t.goto();
  await t.fill('caf&eacute; &euro;5 &frac34; &NotNestedGreaterGreater; &Bscr;');
  await expect(t.output).toHaveValue('café €5 ¾ ⪢̸ ℬ');
});

test('JSON to CSV keeps a big integer exact (item 7)', async ({ page }) => {
  const t = new DevTool(page, 'json-to-csv-converter');
  await t.goto();
  await t.fill('[{"id":12345678901234567890}]');
  await expect.poll(async () => t.output.textContent()).toBe('id\n12345678901234567890');
});
