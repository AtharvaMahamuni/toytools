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

  test('em dashes split words in Words, Unique Words and Top Words', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('#word-counter-input').fill('The dog\u2014tired\u2014slept');
    await expect(page.locator('.hero-value')).toHaveText('4');
    await expect(page.locator('[data-metric="uniqueWords"]')).toHaveText('4');
    const words = await page.locator('#wc-top-list .wc-word-text').allTextContents();
    expect([...words].sort()).toEqual(['dog', 'slept', 'the', 'tired'].sort());
  });

  test('pasted markup in Top Words renders as literal text and injects no element', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    const dialogs: string[] = [];
    page.on('dialog', d => { dialogs.push(d.message()); void d.dismiss(); });
    await page.locator('#word-counter-input').fill('<b>bold</b> <img src=x onerror=alert(1)>');
    const words = await page.locator('#wc-top-list .wc-word-text').allTextContents();
    expect(words).toContain('b>bold</b');
    expect(words).toContain('img');
    await expect(page.locator('#wc-top-list b, #wc-top-list img, #wc-top-list [onerror]')).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });

  test('a URL with commas in its query is one word', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('#word-counter-input').fill('see https://ex.com/?a=1,b=2 now');
    await expect(page.locator('.hero-value')).toHaveText('3');
    await expect(page.locator('[data-metric="uniqueWords"]')).toHaveText('3');
    const words = await page.locator('#wc-top-list .wc-word-text').allTextContents();
    expect(words).toContain('https://ex.com/?a=1,b=2');
  });

  test('the empty goal row is hidden until a goal is set', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await expect(page.locator('#wc-goal-bar-wrap')).toBeHidden();
    await page.locator('#wc-goal-input').fill('10');
    await expect(page.locator('#wc-goal-bar-wrap')).toBeVisible();
    await page.locator('#wc-goal-clear').click();
    await expect(page.locator('#wc-goal-bar-wrap')).toBeHidden();
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

  test('em dashes and letter commas split words in the table', async ({ page }) => {
    await page.goto('/tool/text/word-frequency-counter/');
    const filter = page.locator('#wf-stop-filter');
    if (await filter.isChecked()) await filter.uncheck();
    await page.locator('#word-frequency-counter-input').fill('The dog\u2014tired\u2014slept red,green 1,000');
    await expect(page.locator('[data-metric="words"]')).toHaveText('7');
    const words = await page.locator('#wf-list .wf-word').allTextContents();
    expect([...words].sort()).toEqual(['1,000', 'dog', 'green', 'red', 'slept', 'the', 'tired'].sort());
  });

  test('straight and curly apostrophes count as one word', async ({ page }) => {
    await page.goto('/tool/text/word-frequency-counter/');
    const filter = page.locator('#wf-stop-filter');
    if (await filter.isChecked()) await filter.uncheck();
    await page.locator('#word-frequency-counter-input').fill("don't don\u2019t");
    await expect(page.locator('[data-metric="words"]')).toHaveText('2');
    expect(await page.locator('#wf-list .wf-word').allTextContents()).toEqual(["don't"]);
  });
});

test.describe('word frequency counter: Ignore numbers', () => {
  const TEXT = 'In 2026, 1,000 people paid 3.14 each; 1,000 left at 10:30 on the 1st.';

  test('off by default; on drops number tokens but keeps words like 1st', async ({ page }) => {
    await page.goto('/tool/text/word-frequency-counter/');
    const filter = page.locator('#wf-stop-filter');
    if (await filter.isChecked()) await filter.uncheck();
    const nums = page.locator('#wf-ignore-numbers');
    await expect(nums).not.toBeChecked();
    await page.locator('#word-frequency-counter-input').fill(TEXT);
    let words = await page.locator('#wf-list .wf-word').allTextContents();
    expect(words).toContain('1,000');
    expect(words).toContain('2026');
    await nums.check();
    words = await page.locator('#wf-list .wf-word').allTextContents();
    expect(words.filter(w => /^[\d.,:%/-]+$/.test(w))).toEqual([]);
    expect(words).toContain('1st');
    expect(words).toContain('people');
    // The headline counts describe the text itself, so they do not change with a table filter.
    await expect(page.locator('[data-metric="words"]')).toHaveText('14');
  });

  test('read from the URL, never written to it or stored', async ({ page }) => {
    await page.goto('/tool/text/word-frequency-counter/?numbers=ignore&common=show');
    await expect(page.locator('#wf-ignore-numbers')).toBeChecked();
    await expect(page.locator('#wf-stop-filter')).not.toBeChecked();
    await page.locator('#word-frequency-counter-input').fill(TEXT);
    expect(await page.locator('#wf-list .wf-word').allTextContents()).not.toContain('2026');
    await page.goto('/tool/text/word-frequency-counter/');
    await expect(page.locator('#wf-ignore-numbers')).not.toBeChecked();
    await page.locator('#wf-ignore-numbers').check();
    await page.waitForTimeout(400);
    expect(new URL(page.url()).search).toBe('');
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    expect(stored).not.toMatch(/numbers|ignore-numbers/i);
  });
});
