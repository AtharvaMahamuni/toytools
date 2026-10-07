// Word counter and word frequency counter share one tokenizer with the headline Words count
// (Phase B PR 3, bug log batch 1): Unique Words <= Words, and Top Words lists whole words.
import { test, expect } from '@playwright/test';

test.describe('word counter: one tokenizer', () => {
  test('hyphenated words and contractions stay whole in Words, Unique Words and Top Words', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('#word-counter-input').fill("don't stop well-known e-mail");
    await expect(page.locator('.hero-value')).toHaveText('4');
    await expect(page.locator('[data-metric="uniqueWords"]')).toHaveText('4');
    const top = page.locator('#wc-top-list .wc-word-text');
    await expect(top).toHaveCount(4);
    const words = await top.allTextContents();
    expect([...words].sort()).toEqual(["don't", 'e-mail', 'stop', 'well-known'].sort());
    expect(words).not.toContain('well');
    expect(words).not.toContain('mail');
  });

  test('numbers like 1,000 and 3.14 are one word each', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('#word-counter-input').fill('1,000 and 3.14');
    await expect(page.locator('.hero-value')).toHaveText('3');
    await expect(page.locator('[data-metric="uniqueWords"]')).toHaveText('3');
  });

  test('a pasted tag is shown as text in Top Words, never as markup', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('#word-counter-input').fill('<b>bold</b> <img>');
    await expect(page.locator('#wc-top-list .wc-word-text').first()).toBeVisible();
    await expect(page.locator('#wc-top-list b, #wc-top-list img')).toHaveCount(0);
  });
});

test.describe('word frequency counter: same tokenizer', () => {
  test('the table lists whole words and its distinct count matches Unique Words', async ({ page }) => {
    await page.goto('/tool/text/word-frequency-counter/');
    const filter = page.locator('#wf-stop-filter');
    if (await filter.isChecked()) await filter.uncheck();
    await page.locator('#word-frequency-counter-input').fill("Well-known e-mail, well-known 1,000 don't. Don't!");
    await expect(page.locator('.hero-value')).toHaveText('4');
    await expect(page.locator('[data-metric="words"]')).toHaveText('6');
    const words = await page.locator('#wf-list .wf-word').allTextContents();
    expect([...words].sort()).toEqual(["don't", '1,000', 'e-mail', 'well-known'].sort());
  });
});
