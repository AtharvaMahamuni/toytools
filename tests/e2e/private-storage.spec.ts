// Private pages keep typed input out of storage (beta-v12.4.2). A tool page whose trust notice says
// "Nothing stored unless you choose to save it" now forgets what you typed on reload, keeps Recent
// conversions in memory for the page view only, and still remembers its options. Visitors whose
// browser holds input an older build saved get it removed once, on their next page load.
//
// The policy itself is unit tested against the inline runtime (src/lib/privacy/*.test.ts); this
// proves it end to end through the real widgets, on desktop and Pixel 5.
import { test, expect, type Page } from '@playwright/test';

const MARK = 'toytools.private-inputs-cleared';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

/** Every toytools key in both stores, values included, so a test can search them for typed text. */
async function storedText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const s of [localStorage, sessionStorage]) {
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i)!;
        if (k.startsWith('toytools')) out.push(`${k}=${s.getItem(k)}`);
      }
    }
    return out.join('\n');
  });
}

test.describe('typed input is gone after a reload', () => {
  test('base64: input and Recent conversions are forgotten, the direction is kept', async ({ page }) => {
    const errors = guardConsole(page);
    const url = '/tool/developer-utilities/base64-encoder-decoder/';
    await page.goto(url);
    const input = page.locator('#base64-encoder-decoder-input');
    const mode = page.locator('#base64-encoder-decoder-mode');

    await mode.selectOption('decode');
    await input.fill('cHJpdmF0ZS10ZXN0');
    await expect(page.locator('#base64-encoder-decoder-output')).toHaveValue('private-test');
    // Recent conversions still work for this page view.
    const history = page.locator('#base64-encoder-decoder-history');
    await expect(history).toContainText('private-test');

    expect(await storedText(page)).not.toMatch(/cHJpdmF0ZS10ZXN0|private-test/);

    await page.reload();
    await expect(input).toHaveValue('');
    await expect(mode).toHaveValue('decode');
    await expect(page.locator('[data-conv-history]')).toBeHidden();
    await expect(history.locator('li')).toHaveCount(0);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('sha256: input and history are forgotten', async ({ page }) => {
    const url = '/tool/developer-utilities/sha256-hash-generator/';
    await page.goto(url);
    const input = page.locator('#sha256-hash-generator-input');
    await input.fill('persist-test-xyz');
    await expect(page.locator('#sha256-hash-generator-history')).toContainText('persist-test-xyz');
    expect(await storedText(page)).not.toContain('persist-test-xyz');

    await page.reload();
    await expect(input).toHaveValue('');
    await expect(page.locator('#sha256-hash-generator-history li')).toHaveCount(0);
  });

  test('age: a date of birth is gone after a reload, and never reaches the address bar', async ({ page }) => {
    const url = '/tool/datetime/age-calculator/';
    await page.goto(url);
    const birth = page.locator('#age-calculator-f-birthDate');
    await birth.fill('2000-01-31');
    await expect(page.locator('#age-calculator-hero')).toContainText('years');
    await page.waitForTimeout(600); // longer than the 300ms URL-write debounce
    expect(new URL(page.url()).search).toBe('');
    expect(await storedText(page)).not.toContain('2000-01-31');

    await page.reload();
    await expect(birth).toHaveValue('');
    expect(new URL(page.url()).search).toBe('');
  });

  test('age: an incoming link still fills the form', async ({ page }) => {
    await page.goto('/tool/datetime/age-calculator/?birthDate=1990-05-15&asOf=2026-07-08');
    await expect(page.locator('#age-calculator-f-birthDate')).toHaveValue('1990-05-15');
    await expect(page.locator('#age-calculator-hero')).toContainText('36 years');
  });

  test('date difference: dates are gone after a reload, and never reach the address bar', async ({ page }) => {
    const url = '/tool/datetime/date-difference-calculator/';
    await page.goto(url);
    await page.locator('#date-difference-calculator-f-startDate').fill('2026-01-01');
    await page.locator('#date-difference-calculator-f-endDate').fill('2026-07-08');
    await page.waitForTimeout(600);
    expect(new URL(page.url()).search).toBe('');
    expect(await storedText(page)).not.toMatch(/2026-01-01|2026-07-08/);

    await page.reload();
    await expect(page.locator('#date-difference-calculator-f-startDate')).toHaveValue('');
    await expect(page.locator('#date-difference-calculator-f-endDate')).toHaveValue('');
    expect(new URL(page.url()).search).toBe('');
  });

  // The other shared widgets that used to auto-sync: Math, Network and EQ (the preset name).
  for (const [path, field, value] of [
    ['/tool/math/fraction-calculator/', 'input[data-field-id]:visible >> nth=0', '7'],
    ['/tool/developer-utilities/cidr-calculator/', 'input[data-field-id]:visible >> nth=0', '10.1.2.0/24'],
    ['/tool/music/equalizer-settings-generator/', '#equalizer-settings-generator-name', 'My Car Preset'],
  ] as const) {
    test(`${path}: typing writes no query, reload does not refill`, async ({ page }) => {
      await page.goto(path);
      const el = page.locator(field);
      const before = await el.inputValue();
      await el.fill(value);
      await page.waitForTimeout(600);
      expect(new URL(page.url()).search).toBe('');
      await page.reload();
      await expect(page.locator(field)).toHaveValue(before);
    });
  }

  test('qr Wi-Fi: SSID and password are never stored, the options are', async ({ page }) => {
    const errors = guardConsole(page);
    const url = '/tool/generate/qr-code-generator/';
    await page.goto(url);
    await page.locator('#qr-code-generator-f-contentType').selectOption('wifi');
    await page.locator('#qr-code-generator-f-errorCorrection').selectOption('H');

    const ssid = page.locator('#qr-code-generator-f-ssid');
    const pass = page.locator('#qr-code-generator-f-wifiPassword');
    await ssid.fill('TestNet');
    // The password is masked, with a toggle to check what was typed.
    await expect(pass).toHaveAttribute('type', 'password');
    await pass.fill('dummyPass123');
    const toggle = page.locator('[data-secret-toggle="qr-code-generator-f-wifiPassword"]');
    await toggle.click();
    await expect(pass).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(pass).toHaveAttribute('type', 'password');

    await expect(page.locator('#qr-code-generator-canvas')).toBeVisible();
    expect(await storedText(page)).not.toMatch(/TestNet|dummyPass123/);

    await page.goto(url);
    await expect(page.locator('#qr-code-generator-f-contentType')).toHaveValue('wifi');
    await expect(page.locator('#qr-code-generator-f-errorCorrection')).toHaveValue('H');
    await expect(ssid).toHaveValue('');
    await expect(pass).toHaveValue('');

    // Text content is not stored either.
    await page.locator('#qr-code-generator-f-contentType').selectOption('text');
    await page.locator('#qr-code-generator-f-text').fill('https://example.com/secret-path');
    await page.reload();
    await expect(page.locator('#qr-code-generator-f-text')).toHaveValue('');
    expect(await storedText(page)).not.toContain('secret-path');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('grouped tools', () => {
  test('text follows a switcher pill, but is gone on reload and never stored', async ({ page }) => {
    await page.goto('/tool/developer-utilities/base64-encoder-decoder/');
    await page.locator('#base64-encoder-decoder-input').fill('carry-me-along');
    const nav = page.getByRole('navigation', { name: 'Encoder / Decoder modes' });
    await nav.getByRole('link', { name: 'URL' }).click();
    await expect(page).toHaveURL(/\/url-encoder-decoder\/$/);
    const input = page.locator('#url-encoder-decoder-input');
    await expect(input).toHaveValue('carry-me-along');
    expect(await storedText(page)).not.toContain('carry-me-along');
    expect(await page.evaluate(() => window.name)).toBe('');

    await page.reload();
    await expect(input).toHaveValue('');
  });
});

test.describe('options still persist', () => {
  test('password generator keeps its length', async ({ page }) => {
    await page.goto('/tool/generate/password-generator/');
    const length = page.locator('#password-generator-f-length');
    await length.fill('24');
    await length.blur();
    await expect.poll(() => storedText(page)).toContain('24');
    await page.reload();
    await expect(length).toHaveValue('24');
  });
});

test.describe('one-time cleanup of what older builds saved', () => {
  test('removes legacy input and history keys, keeps options and data tools', async ({ page }) => {
    const errors = guardConsole(page);
    await page.addInitScript(() => {
      if (sessionStorage.getItem('pb1-seeded')) return;
      const env = (data: unknown) => JSON.stringify({ v: 1, data });
      localStorage.setItem('toytools:qr-code-generator', env({ options: { contentType: 'wifi', ssid: 'TestNet', wifiPassword: 'dummyPass123', errorCorrection: 'Q' } }));
      localStorage.setItem('toytools:base64-encoder-decoder', env({ input: 'aGVsbG8=', mode: 'decode' }));
      localStorage.setItem('toytools:group:hash-generators', env({ input: 'persist-test-xyz' }));
      localStorage.setItem('toytools:age-calculator', env({ fields: { birthDate: '2000-01-31' } }));
      localStorage.setItem('toytools.base64.input', 'hello');
      localStorage.setItem('toytools:profile:body', JSON.stringify({ unit: 'metric', weight: 80 }));
      localStorage.setItem('toytools:password-generator', env({ options: { length: 30 } }));
      localStorage.setItem('toytools:notepad', env({ text: 'my notes' }));
      localStorage.setItem('toytools:prefs', JSON.stringify({ currency: 'INR' }));
      sessionStorage.setItem('toytools:hist:sha256-hash-generator', JSON.stringify([{ input: 'persist-test-xyz', output: 'x' }]));
      sessionStorage.setItem('pb1-seeded', '1');
    });
    // Any page runs the cleanup; the home page proves it does not depend on a tool widget.
    await page.goto('/');
    await expect.poll(() => page.evaluate((m) => localStorage.getItem(m), MARK)).toBe('1');

    const left = await page.evaluate(() => ({
      qr: localStorage.getItem('toytools:qr-code-generator'),
      base64: localStorage.getItem('toytools:base64-encoder-decoder'),
      group: localStorage.getItem('toytools:group:hash-generators'),
      age: localStorage.getItem('toytools:age-calculator'),
      raw: localStorage.getItem('toytools.base64.input'),
      profile: localStorage.getItem('toytools:profile:body'),
      password: localStorage.getItem('toytools:password-generator'),
      notepad: localStorage.getItem('toytools:notepad'),
      prefs: localStorage.getItem('toytools:prefs'),
      hist: sessionStorage.getItem('toytools:hist:sha256-hash-generator'),
    }));
    expect(JSON.parse(left.qr!).data).toEqual({ options: { contentType: 'wifi', errorCorrection: 'Q' } });
    expect(JSON.parse(left.base64!).data).toEqual({ mode: 'decode' });
    expect(left.group).toBeNull();
    expect(left.age).toBeNull();
    expect(left.raw).toBeNull();
    expect(left.profile).toBeNull();
    expect(left.hist).toBeNull();
    expect(JSON.parse(left.password!).data).toEqual({ options: { length: 30 } });
    expect(JSON.parse(left.notepad!).data).toEqual({ text: 'my notes' });
    expect(left.prefs).toBe(JSON.stringify({ currency: 'INR' }));
    expect(await storedText(page)).not.toMatch(/dummyPass123|TestNet|persist-test-xyz|2000-01-31/);

    // The chunk is fetched once: with the mark set, the next load does not request it.
    const fetched: string[] = [];
    page.on('request', (r) => { if (/legacy-storage\./.test(r.url())) fetched.push(r.url()); });
    await page.goto('/tool/generate/qr-code-generator/');
    await expect(page.locator('#qr-code-generator-f-errorCorrection')).toHaveValue('Q');
    await expect(page.locator('#qr-code-generator-f-ssid')).toHaveValue('');
    await expect(page.locator('#qr-code-generator-f-wifiPassword')).toHaveValue('');
    expect(fetched).toEqual([]);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
