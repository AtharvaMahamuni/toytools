import { test, expect, type Page } from '@playwright/test';

// The feedback system in a real browser, on desktop and Pixel 5.
//
// There is no endpoint behind this form and no network call anywhere in it: the page composes a
// message and hands it to the visitor's own mail client. So these tests verify the composed
// mailto: URL and the copy fallback rather than a delivery.
//
// Under automation the click that opens the mail app is skipped, because an unhandled mailto:
// would either hang the run or unload the page. The link is still in the DOM with a live href,
// which is what the assertions read.

const pill = (page: Page, type: string) => page.locator(`[data-segment-value="${type}"]`);
const field = (page: Page, id: string) => page.locator(`[data-field="${id}"]`);

/** The mailto: URL the form composed, decoded so assertions read like the message does. */
async function composedMail(page: Page): Promise<string> {
  const href = await page.locator('[data-mail-link]').getAttribute('href');
  return decodeURIComponent(href ?? '');
}

test.describe('the link on a tool page', () => {
  test('sits at the bottom of the tool and carries the tool with it', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');

    const link = page.locator('[data-feedback-link]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/feedback\/\?tool=word-counter$/);

    // Comfortable to hit with a thumb, which is the only reason anyone finds it.
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('lands on the form with the tool already named', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('[data-feedback-link]').click();

    await expect(page).toHaveURL(/\/feedback\/\?tool=word-counter/);
    // The slug becomes the readable name, because that is what ends up in the subject line.
    await expect(page.locator('#feedback-tool')).toHaveValue('Word Counter');
  });
});

test.describe('the form', () => {
  test('asks a different set of questions for each type', async ({ page }) => {
    await page.goto('/feedback/');

    // Suggest a New Tool is the default: the full discovery interview.
    await expect(field(page, 'goal')).toBeVisible();
    await expect(field(page, 'today')).toBeVisible();
    await expect(field(page, 'frustration')).toBeVisible();
    await expect(field(page, 'problem')).toBeHidden();

    await pill(page, 'bug').click();
    // A bug wants observed versus expected, not a discovery interview.
    await expect(field(page, 'problem')).toBeVisible();
    await expect(field(page, 'expected')).toBeVisible();
    await expect(field(page, 'goal')).toBeHidden();
    await expect(field(page, 'today')).toBeHidden();

    await pill(page, 'general').click();
    await expect(field(page, 'message')).toBeVisible();
    await expect(field(page, 'problem')).toBeHidden();
  });

  test('keeps what you already typed when you change your mind about the type', async ({ page }) => {
    await page.goto('/feedback/');
    await page.locator('#feedback-tool').fill('Word Counter');

    await pill(page, 'bug').click();
    await pill(page, 'improve').click();

    await expect(page.locator('#feedback-tool')).toHaveValue('Word Counter');
  });

  test('refuses an empty submission and says which answers are missing', async ({ page }) => {
    await page.goto('/feedback/');
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-error-for="goal"]')).toHaveText(/fill this in/i);
    await expect(page.locator('[data-status]')).toHaveText(/complete the highlighted/i);
    await expect(page.locator('[data-review]')).toBeHidden();
  });

  test('asks for more than a single word', async ({ page }) => {
    await page.goto('/feedback/');
    await page.locator('#feedback-goal').fill('stuff');
    await page.locator('#feedback-today').fill('I do it by hand every single week');
    await page.locator('#feedback-frustration').fill('It takes far too long to finish');
    await page.locator('#feedback-ideal').fill('Give me the answer in one step');
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-error-for="goal"]')).toHaveText(/more detail/i);
  });

  test('composes a mailto the visitor can send from their own mail app', async ({ page }) => {
    await page.goto('/feedback/?tool=word-counter');
    await pill(page, 'bug').click();

    await page.locator('#feedback-problem').fill('Emoji are counted as two characters each');
    await page.locator('#feedback-expected').fill('They should count as one, like Twitter does');
    await page.locator('[data-submit]').click();

    const mail = await composedMail(page);
    expect(mail).toContain('mailto:');
    // The pinned email format, seen end to end rather than only in a unit test.
    expect(mail).toContain('subject=[ToyTools] BUG · Word Counter');
    expect(mail).toContain('Feedback Type');
    expect(mail).toContain('Bug Report');
    expect(mail).toContain('ToyTools Version');
  });

  // A mailto: link does nothing on a machine with no mail app, and it fails silently. The
  // visible copy is what stops that being a dead end.
  test('always shows the message so it can be copied, mail app or not', async ({ page }) => {
    await page.goto('/feedback/?tool=word-counter');
    await pill(page, 'bug').click();
    await page.locator('#feedback-problem').fill('Emoji are counted as two characters each');
    await page.locator('#feedback-expected').fill('They should count as one, like Twitter does');
    await page.locator('[data-submit]').click();

    const review = page.locator('[data-review]');
    await expect(review).toBeVisible();
    await expect(page.locator('[data-preview]')).toContainText('Feedback Type');
    await expect(page.locator('[data-copy]')).toBeVisible();
    // The destination has to be readable, since typing it by hand is the last resort.
    await expect(page.locator('[data-address]')).toContainText('@');
  });

  test('copies the message to the clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are chromium-only here');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/feedback/');
    await page.locator('#feedback-goal').fill('Split a CSV export into one file per region');
    await page.locator('#feedback-today').fill('I do it by hand in a spreadsheet every Monday');
    await page.locator('#feedback-frustration').fill('It takes twenty minutes and I make mistakes');
    await page.locator('#feedback-ideal').fill('Give me the separate files in one step');
    await page.locator('[data-submit]').click();
    await page.locator('[data-copy]').click();

    await expect(page.locator('[data-copy]')).toHaveText(/copied/i);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('Feedback Type');
    expect(clipboard).toContain('Split a CSV export into one file per region');
  });
});

test.describe('arriving from somewhere', () => {
  test('a failed search brings its query with it', async ({ page }) => {
    // Deliberately something the catalogue does not have. A query that happens to match
    // would leave the empty state hidden and quietly pass on nothing.
    await page.goto('/search/?q=xylophone%20tuner');

    const suggest = page.locator('#empty-suggest');
    await expect(suggest).toBeVisible();
    await suggest.click();

    // Opens on the right type, with the unmet need already written down.
    await expect(page.locator('#feedback-f-type')).toHaveValue('new-tool');
    await expect(page.locator('#feedback-goal')).toHaveValue(/xylophone tuner/i);
  });

  test('a hand-written short alias still selects the right type', async ({ page }) => {
    await page.goto('/feedback/?type=improvement');
    await expect(page.locator('#feedback-f-type')).toHaveValue('improve');
    await expect(pill(page, 'improve')).toHaveAttribute('aria-checked', 'true');
  });

  test('a nonsense type falls back rather than breaking the form', async ({ page }) => {
    await page.goto('/feedback/?type=banana');
    await expect(page.locator('#feedback-f-type')).toHaveValue('new-tool');
    await expect(field(page, 'goal')).toBeVisible();
  });
});

test.describe('the reproduction opt-in', () => {
  test('offers to attach what you typed, on a bug, from an ordinary tool', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('main textarea').first().fill('hello world from a real session');
    await page.locator('[data-feedback-link]').click();

    // Not offered until it is relevant.
    await expect(page.locator('[data-capture-row]')).toBeHidden();

    await pill(page, 'bug').click();
    const row = page.locator('[data-capture-row]');
    await expect(row).toBeVisible();
    await expect(row).toContainText('Word Counter');
    // Sharing what you typed is a decision, never a default.
    await expect(page.locator('[data-capture-toggle]')).not.toBeChecked();
  });

  test('attaches it to the email only once you tick the box', async ({ page }) => {
    await page.goto('/tool/text/word-counter/');
    await page.locator('main textarea').first().fill('hello world from a real session');
    await page.locator('[data-feedback-link]').click();
    await pill(page, 'bug').click();

    await page.locator('#feedback-problem').fill('The count is wrong for this input');
    await page.locator('#feedback-expected').fill('It should have said five words');
    await page.locator('[data-capture-toggle]').check();
    await page.locator('[data-submit]').click();

    expect(await composedMail(page)).toContain('hello world from a real session');
  });

  // The whole point of the engine-level gate: someone debugging a JWT decoder is holding a
  // bearer token, so the option is never offered and nothing is ever stashed.
  test('is never offered on a tool whose input may be a secret', async ({ page }) => {
    await page.goto('/tool/developer-utilities/jwt-decoder/');
    await page.locator('main textarea').first().fill('eyJhbGciOiJIUzI1NiJ9.secret.signature');
    await page.locator('[data-feedback-link]').click();
    await pill(page, 'bug').click();

    await expect(page.locator('[data-capture-row]')).toBeHidden();

    await page.locator('#feedback-problem').fill('The decoder rejects a token jwt.io accepts');
    await page.locator('#feedback-expected').fill('It should decode the payload the same way');
    await page.locator('[data-submit]').click();

    expect(await composedMail(page)).not.toContain('signature');
    await expect(page.locator('[data-preview]')).not.toContainText('signature');
  });
});

test.describe('mobile and layout', () => {
  test('never scrolls sideways, whatever the viewport', async ({ page }) => {
    await page.goto('/feedback/');
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows).toBe(false);
  });

  test('does not shift the page when the type changes', async ({ page }) => {
    await page.goto('/feedback/');
    const before = await page.evaluate(() => window.scrollY);
    await pill(page, 'bug').click();
    await expect(field(page, 'problem')).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });

  test('every pill and the send button are thumb-sized', async ({ page }) => {
    await page.goto('/feedback/');
    for (const locator of [pill(page, 'bug'), page.locator('[data-submit]')]) {
      const box = await locator.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('discoverability', () => {
  test('is reachable from the footer on every page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href$="/feedback/"]')).toBeVisible();
  });

  test('is indexable, unlike the search page', async ({ page }) => {
    await page.goto('/feedback/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/feedback\/$/);
  });

  test('answers the questions someone would ask before writing in', async ({ page }) => {
    await page.goto('/feedback/');
    await expect(page.getByRole('heading', { name: 'Common questions' })).toBeVisible();
    // The most useful thing on the page for a would-be requester.
    await expect(page.getByRole('heading', { name: /does not build/i })).toBeVisible();
  });
});
