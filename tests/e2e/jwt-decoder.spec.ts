// Deep functional suite for the JWT Decoder — exercises the interactive decoded panel: header +
// payload, summary card, live validity panel + countdown, structural insights, the interactive
// claims list (tooltips, click-to-copy value/path, expand long/nested values), auto-clean, and
// actionable errors. Runs on desktop and Pixel 5. The decoded output is a custom composite, so it
// gets its own locators.
import { test, expect, type Page } from '@playwright/test';

const SLUG = 'jwt-decoder';

// base64url-encode a JSON object the same way the engine decodes it.
async function makeToken(page: Page, header: unknown, payload: unknown, sig = 'sig') {
  return page.evaluate(
    ([h, p, s]) => {
      const enc = (o: unknown) =>
        btoa(unescape(encodeURIComponent(JSON.stringify(o))))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/g, '');
      return `${enc(h)}.${enc(p)}.${s}`;
    },
    [header, payload, sig] as const,
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto(`/tool/developer-utilities/${SLUG}/`);
});

test('decodes header and payload for a valid token', async ({ page }) => {
  const token = await makeToken(page, { alg: 'HS256', typ: 'JWT' }, { sub: '1234', name: 'Ada' });
  await page.locator(`#${SLUG}-input`).fill(token);

  await expect(page.locator(`#${SLUG}-status`)).toContainText('✓ Decoded');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('HS256');
  await expect(page.locator(`#${SLUG}-header`)).toContainText('"alg": "HS256"');
  await expect(page.locator(`#${SLUG}-payload`)).toContainText('"name": "Ada"');
});

test('summary card shows algorithm, claim count and status', async ({ page }) => {
  const future = Math.floor(Date.now() / 1000) + 3600;
  const token = await makeToken(page, { alg: 'HS256' }, { sub: '1', name: 'Ada', exp: future });
  await page.locator(`#${SLUG}-input`).fill(token);

  const summary = page.locator(`#${SLUG}-summary`);
  await expect(summary).toContainText('Algorithm');
  await expect(summary).toContainText('HS256');
  await expect(summary).toContainText('Claims');
  await expect(summary.locator('[data-sum="status"]')).toContainText('Valid');
});

test('live validity panel shows a future expiry countdown', async ({ page }) => {
  const future = Math.floor(Date.now() / 1000) + 3600;
  const token = await makeToken(page, { alg: 'HS256' }, { iat: Math.floor(Date.now() / 1000) - 60, exp: future });
  await page.locator(`#${SLUG}-input`).fill(token);

  const v = page.locator(`#${SLUG}-validity`);
  await expect(v.locator('.jwt-vstatus')).toHaveText('Valid');
  await expect(v.locator('.jwt-vcountdown')).toContainText('Expires in');
  await expect(v.locator('.jwt-vbar')).toBeVisible();
});

test('expired token: validity reads Expired and the bar fill is danger', async ({ page }) => {
  const past = Math.floor(Date.now() / 1000) - 86400;
  const token = await makeToken(page, { alg: 'HS256' }, { iat: past - 60, exp: past });
  await page.locator(`#${SLUG}-input`).fill(token);

  await expect(page.locator(`#${SLUG}-validity .jwt-vstatus`)).toHaveText('Expired');
  await expect(page.locator(`#${SLUG}-validity .jwt-vbar-fill`)).toHaveClass(/is-expired/);
  // The exp claim row still carries the snapshot Expired badge.
  await expect(page.locator('.jwt-badge', { hasText: 'Expired' })).toBeVisible();
  // Expiry is no longer duplicated in the status line.
  await expect(page.locator(`#${SLUG}-status`)).not.toContainText('Expired');
});

test('insights warn when a token never expires', async ({ page }) => {
  const token = await makeToken(page, { alg: 'HS256' }, { sub: '1' });
  await page.locator(`#${SLUG}-input`).fill(token);
  await expect(page.locator(`#${SLUG}-insights`)).toContainText('never expires');
});

test('auto-cleans a Bearer prefix and decodes', async ({ page }) => {
  const token = 'Bearer ' + (await makeToken(page, { alg: 'HS256' }, { sub: 'abc' }));
  await page.locator(`#${SLUG}-input`).fill(token);
  await expect(page.locator(`#${SLUG}-status`)).toContainText('✓ Decoded');
  await expect(page.locator(`#${SLUG}-payload`)).toContainText('"sub": "abc"');
});

test('registered claims expose an explanation tooltip', async ({ page }) => {
  const token = await makeToken(page, { alg: 'HS256' }, { aud: 'my-api' });
  await page.locator(`#${SLUG}-input`).fill(token);
  const aud = page.locator('.jwt-claim-label.has-tip', { hasText: 'Audience' });
  await expect(aud).toHaveAttribute('data-tooltip', /audience/i);
});

test('clicking a claim value copies it (toast feedback)', async ({ page }) => {
  const token = await makeToken(page, { alg: 'HS256' }, { sub: 'user_42' });
  await page.locator(`#${SLUG}-input`).fill(token);
  await page.locator('.jwt-claim-val .jwt-val', { hasText: 'user_42' }).click();
  await expect(page.locator('#tt-toast')).toHaveText('Copied!');
});

test('long values truncate and expand inline', async ({ page }) => {
  const long = 'x'.repeat(200);
  const token = await makeToken(page, { alg: 'HS256' }, { data: long });
  await page.locator(`#${SLUG}-input`).fill(token);

  const more = page.locator('.jwt-claim-more');
  await expect(more).toBeHidden();
  await page.getByRole('button', { name: 'Show full' }).click();
  await expect(more).toBeVisible();
  await expect(more).toHaveText(long);
});

test('nested objects expand to child rows with copyable paths', async ({ page }) => {
  const token = await makeToken(page, { alg: 'HS256' }, { permissions: { admin: true } });
  await page.locator(`#${SLUG}-input`).fill(token);

  await page.locator('.jwt-expand').first().click();
  // Nested child row carries the dotted JSON path.
  await expect(page.locator('.jwt-claim-path[data-copy-path="permissions.admin"]')).toBeVisible();
});

test('shows an actionable error for a malformed token', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('only.two');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('✗');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('Found 2 segments');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('copied the complete token');
  await expect(page.locator(`#${SLUG}-sections`)).toBeHidden();
});

test('teaching empty state before any input', async ({ page }) => {
  await expect(page.locator(`#${SLUG}-empty`)).toContainText('cleaned automatically');
});

test('Sample button loads a decodable token', async ({ page }) => {
  await page.getByRole('button', { name: 'Load a sample token' }).click();
  await expect(page.locator(`#${SLUG}-status`)).toContainText('✓ Decoded');
  await expect(page.locator(`#${SLUG}-payload`)).toContainText('Ada Lovelace');
});

test('shows the local-only privacy assurance', async ({ page }) => {
  await expect(page.locator('.jwt-privacy')).toContainText('never sent to any server');
});
