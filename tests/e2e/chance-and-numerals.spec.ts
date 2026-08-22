// Behaviour for the nine tools added in alpha-v7.22, in a real browser.
//
// The generic suites already prove these pages render, carry accessible names, boot without a
// console error, and ship a [data-craft] element. What none of them can prove is that the craft
// actually FIRES: every one of these affordances starts hidden, so "the element is present" passes
// just as happily on a note that is wired to nothing. That gap is the reason this file exists.
//
// Each craft is asserted on both halves, the same way its unit tests are: that it appears on the
// input it exists for, and that it stays away otherwise.
import { test, expect } from '@playwright/test';

// ── the generation engine's note seam ────────────────────────────────────────
test.describe('chance tools: the note seam', () => {
  test('dice-roller reports what the roll was worth', async ({ page }) => {
    await page.goto('/tool/generate/dice-roller/');
    const note = page.locator('#dice-roller-note');
    await expect(note).toBeVisible();
    await expect(note).toContainText('or higher');

    // A pool too large to answer exactly says nothing rather than estimating.
    await page.locator('#dice-roller-f-notation').fill('60d6');
    await expect(note).toBeHidden();
  });

  test('coin-flipper stays quiet on one flip and answers on a run', async ({ page }) => {
    await page.goto('/tool/generate/coin-flipper/');
    const note = page.locator('#coin-flipper-note');
    await expect(note).toBeHidden();

    await page.locator('#coin-flipper-f-flips').fill('10');
    await expect(note).toBeVisible();
    await expect(note).toContainText('10');
  });

  test('random-name-picker flags a duplicate and removes it in one tap', async ({ page }) => {
    await page.goto('/tool/generate/random-name-picker/');
    const names = page.locator('#random-name-picker-f-names');
    const note = page.locator('#random-name-picker-note');
    const fix = page.locator('#random-name-picker-note-action');

    await names.fill('Ana\nBen\nChidi');
    await expect(note).toBeHidden();

    await names.fill('Ana\nBen\nana\nChidi');
    await expect(note).toBeVisible();
    await expect(note).toContainText('2 chances in 4');

    await fix.click();
    await expect(names).toHaveValue('Ana\nBen\nChidi');
    await expect(note).toBeHidden();
  });

  test('random-choice-picker splits a line that is really several options', async ({ page }) => {
    await page.goto('/tool/generate/random-choice-picker/');
    const options = page.locator('#random-choice-picker-f-options');
    const note = page.locator('#random-choice-picker-note');
    const fix = page.locator('#random-choice-picker-note-action');

    await expect(note).toBeHidden(); // the default list is already one per line

    await options.fill('Pizza, Sushi, Tacos');
    await expect(note).toBeVisible();
    await expect(fix).toHaveText('Split into 3 options');

    await fix.click();
    await expect(options).toHaveValue('Pizza\nSushi\nTacos');
    await expect(note).toBeHidden();
  });
});

// ── the encoding engine's recovery seam, on the numeral family ───────────────
test.describe('numeral converters', () => {
  test('roman numerals convert and the non-standard spelling gets corrected', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    const input = page.locator('#roman-numeral-converter-input');
    const output = page.locator('#roman-numeral-converter-output');
    const offer = page.locator('[data-craft="roman-canonical"]');

    await input.fill('1987');
    await expect(output).toHaveValue('MCMLXXXVII');
    await expect(offer).toBeHidden();

    await input.fill('IIII');
    await expect(output).toHaveValue('4');
    await expect(offer).toBeVisible();
    await offer.click();
    await expect(input).toHaveValue('IV');
    await expect(output).toHaveValue('4');
  });

  test('number-to-words rescues an amount pasted from a spreadsheet', async ({ page }) => {
    await page.goto('/tool/number/number-to-words/');
    const input = page.locator('#number-to-words-input');
    const output = page.locator('#number-to-words-output');
    const offer = page.locator('[data-craft="words-recover"]');

    await input.fill('4213');
    await expect(output).toHaveValue('four thousand two hundred thirteen');
    await expect(offer).toBeHidden();

    await input.fill('$4,213.75');
    await expect(offer).toBeVisible();
    await offer.click();
    await expect(input).toHaveValue('4213.75');
    await expect(output).toHaveValue('four thousand two hundred thirteen point seven five');
  });

  test('binary-converter converts both ways and cleans a spaced value', async ({ page }) => {
    await page.goto('/tool/number/binary-converter/');
    const input = page.locator('#binary-converter-input');
    const output = page.locator('#binary-converter-output');
    const offer = page.locator('[data-craft="base-recover"]');

    await input.fill('2026');
    await expect(output).toHaveValue('11111101010');
    await expect(offer).toBeHidden();

    await input.fill('1010 1100');
    await expect(offer).toBeVisible();
    await offer.click();
    await expect(input).toHaveValue('10101100');
    await expect(output).toHaveValue('172');
  });
});

// ── the two bespoke widgets ─────────────────────────────────────────────────
test.describe('text-repeater', () => {
  test('repeats with the chosen separator and numbering', async ({ page }) => {
    await page.goto('/tool/text/text-repeater/');
    await page.locator('#rep-input').fill('test');
    await page.locator('#rep-count').fill('3');
    await expect(page.locator('#rep-output')).toHaveValue('test\ntest\ntest');

    await page.locator('#rep-separator').selectOption('comma');
    await expect(page.locator('#rep-output')).toHaveValue('test, test, test');

    await page.locator('#rep-number').check();
    await expect(page.locator('#rep-output')).toHaveValue('1. test, 2. test, 3. test');
  });

  test('the size guardrail fires on a runaway count and offers one that fits', async ({ page }) => {
    await page.goto('/tool/text/text-repeater/');
    const note = page.locator('#rep-note');
    const fix = page.locator('#rep-note-action');

    await page.locator('#rep-input').fill('x'.repeat(500));
    await page.locator('#rep-count').fill('10');
    await expect(note).toBeHidden();

    await page.locator('#rep-count').fill('50000');
    await expect(note).toBeVisible();
    await expect(note).toContainText('MB');

    await fix.click();
    await expect(note).toBeHidden();
    expect(Number(await page.locator('#rep-count').inputValue())).toBeLessThan(50000);
    expect((await page.locator('#rep-output').inputValue()).length).toBeGreaterThan(0);
  });
});

test.describe('character-map', () => {
  test('searching by name narrows the grid', async ({ page }) => {
    await page.goto('/tool/text/character-map/');
    const cells = page.locator('.cm-c');
    const total = await cells.count();
    expect(total).toBeGreaterThan(300);

    await page.locator('#cm-search').fill('arrow');
    await expect(page.locator('#cm-count')).toContainText('match');
    const shown = await page.locator('.cm-c:not([hidden])').count();
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(total);

    await page.locator('#cm-search').fill('zzzzzz');
    await expect(page.locator('#cm-empty')).toBeVisible();
  });

  test('picking a character hands over its escapes', async ({ page }) => {
    await page.goto('/tool/text/character-map/');
    await page.locator('#cm-search').fill('degree');
    const cell = page.locator('.cm-c:not([hidden])').first();
    await cell.click();

    const detail = page.locator('#cm-detail');
    await expect(detail).toBeVisible();
    await expect(page.locator('#cm-detail-point')).toHaveText('U+00B0');
    await expect(page.locator('#cm-copy-html')).toHaveText('&deg;');
    await expect(page.locator('#cm-copy-css')).toHaveText('\\B0');
    await expect(page.locator('#cm-copy-js')).toHaveText('\\u00B0');
  });
});
