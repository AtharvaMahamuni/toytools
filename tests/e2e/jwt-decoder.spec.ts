// Deep functional suite for the JWT Decoder — exercises the interactive widget (decode header +
// payload, humanized claims, expired badge, error states, Sample button, local-only privacy line)
// end to end on both viewports. The decoded output is a custom composite, so it gets its own
// locators rather than the generic engine page object.
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

test('flags an expired token with a badge', async ({ page }) => {
  const past = Math.floor(Date.now() / 1000) - 3600;
  const token = await makeToken(page, { alg: 'HS256' }, { exp: past });
  await page.locator(`#${SLUG}-input`).fill(token);

  const badge = page.locator('.jwt-badge', { hasText: 'Expired' });
  await expect(badge).toBeVisible();
});

test('does not flag a future token as expired', async ({ page }) => {
  const future = Math.floor(Date.now() / 1000) + 3600;
  const token = await makeToken(page, { alg: 'HS256' }, { exp: future });
  await page.locator(`#${SLUG}-input`).fill(token);

  await expect(page.locator('.jwt-badge')).toHaveCount(0);
  await expect(page.locator('.jwt-claim-human').first()).toContainText('in ');
});

test('shows a specific error for a malformed token', async ({ page }) => {
  await page.locator(`#${SLUG}-input`).fill('only.two');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('✗');
  await expect(page.locator(`#${SLUG}-status`)).toContainText('3 segments');
  await expect(page.locator(`#${SLUG}-sections`)).toBeHidden();
});

test('Sample button loads a decodable token', async ({ page }) => {
  await page.getByRole('button', { name: 'Load a sample token' }).click();
  await expect(page.locator(`#${SLUG}-status`)).toContainText('✓ Decoded');
  await expect(page.locator(`#${SLUG}-payload`)).toContainText('Ada Lovelace');
});

test('shows the local-only privacy assurance', async ({ page }) => {
  await expect(page.locator('.jwt-privacy')).toContainText('never sent to any server');
});
