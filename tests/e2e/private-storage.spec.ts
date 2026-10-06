// Private pages keep typed input out of storage (beta-v12.4.2). A tool page whose trust notice says
// "Nothing stored unless you choose to save it" now forgets what you typed on reload, keeps Recent
// conversions in memory for the page view only, and still remembers its options. Visitors whose
// browser holds input an older build saved get it removed once, on their next page load.
//
// The exception is the work-in-progress tools flagged keepInput (JSON, CSV, regex, find and
// replace, text compare): their notice says "Your input stays on this device (never uploaded)",
// a reload restores the input, Clear saved input wipes it, and the cleanup leaves their keys.
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

  test('age: after an edit, the shared link query leaves the address, so a reload does not bring it back', async ({ page }) => {
    await page.goto('/tool/datetime/age-calculator/?birthDate=1990-05-15&asOf=2026-07-08');
    const birth = page.locator('#age-calculator-f-birthDate');
    await expect(birth).toHaveValue('1990-05-15');
    // Filling the form from the link is not an edit: the query stays until the visitor changes something.
    expect(new URL(page.url()).search).not.toBe('');

    // A real keystroke (trusted events, as a person typing would send).
    await birth.click();
    await page.keyboard.press('ArrowUp');
    await expect(birth).not.toHaveValue('1990-05-15');
    await expect.poll(() => new URL(page.url()).search).toBe('');
    expect(new URL(page.url()).pathname).toBe('/tool/datetime/age-calculator/');

    await page.reload();
    await expect(birth).toHaveValue('');
    expect(new URL(page.url()).search).toBe('');
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

test.describe('JSON tools group', () => {
  test('Tree View receives and passes text through the pills, and keeps it on this device', async ({ page }) => {
    const json = '{"carry":"tree-view-check","n":1}';
    await page.goto('/tool/developer-utilities/json-formatter/');
    await page.locator('#json-formatter-input').fill(json);
    const nav = page.getByRole('navigation', { name: 'JSON Tools modes' });
    await nav.getByRole('link', { name: 'Tree View' }).click();
    await expect(page).toHaveURL(/\/json-tree-viewer\/$/);
    const tree = page.locator('#json-tree-viewer-input');
    await expect(tree).toHaveValue(json);

    // And back the other way, with an edit made in Tree View. On a phone the handed-over JSON
    // opens on the Tree tab, so switch to Input first.
    const inputTab = page.locator('.jtv-mtab[data-view="input"]');
    if (await inputTab.isVisible()) await inputTab.click();
    const edited = '{"carry":"edited-in-tree","n":2}';
    await tree.fill(edited);
    await nav.getByRole('link', { name: 'Format' }).click();
    await expect(page).toHaveURL(/\/json-formatter\/$/);
    await expect(page.locator('#json-formatter-input')).toHaveValue(edited);
    // JSON tools are keep-input tools: the group text is saved on this device.
    await expect.poll(() => storedText(page)).toContain('edited-in-tree');

    await nav.getByRole('link', { name: 'Tree View' }).click();
    await page.reload();
    if (await inputTab.isVisible()) await inputTab.click();
    await expect(page.locator('#json-tree-viewer-input')).toHaveValue(edited);
  });
});

test.describe('work-in-progress tools keep typed input (keepInput)', () => {
  test('JSON formatter: a reload restores the input, Clear saved input wipes it', async ({ page }) => {
    const json = '{"wip":"keep-me-on-device"}';
    await page.goto('/tool/developer-utilities/json-formatter/');
    await expect(page.locator('.tool-signature .trust-tooltip')).toContainText('Your input stays on this device (never uploaded).');
    await expect(page.locator('.tool-signature .trust-tooltip')).not.toContainText('Nothing stored');
    const input = page.locator('#json-formatter-input');
    await input.fill(json);
    await expect.poll(() => storedText(page)).toContain('keep-me-on-device');
    await page.reload();
    await expect(input).toHaveValue(json);

    const clear = page.getByRole('button', { name: 'Clear saved input' });
    await expect(clear).toBeVisible();
    await Promise.all([page.waitForEvent('load'), clear.click()]);
    await expect(input).toHaveValue('');
    expect(await page.evaluate(() => localStorage.getItem('toytools:group:json-tools'))).toBeNull();
    expect(await storedText(page)).not.toContain('keep-me-on-device');
    await page.reload();
    await expect(input).toHaveValue('');
  });

  test('regex tester: a reload restores the pattern and test text', async ({ page }) => {
    await page.goto('/tool/developer-utilities/regex-tester/');
    await page.locator('#rt-pattern').fill('wip-\\d+');
    await page.locator('#rt-text').fill('wip-42 and wip-7');
    await expect.poll(() => storedText(page)).toContain('wip-42 and wip-7');
    await page.reload();
    await expect(page.locator('#rt-pattern')).toHaveValue('wip-\\d+');
    await expect(page.locator('#rt-text')).toHaveValue('wip-42 and wip-7');
  });

  test('regex tester: Clear saved input wipes the input and keeps the flags setting', async ({ page }) => {
    await page.goto('/tool/developer-utilities/regex-tester/');
    await page.locator('#rt-pattern').fill('wipe-me');
    await page.locator('#rt-text').fill('wipe-me too');
    await page.locator('#rt-flags').fill('gi');
    await expect.poll(() => storedText(page)).toContain('"flags":"gi"');
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Clear saved input' }).click()]);
    await expect(page.locator('#rt-pattern')).toHaveValue('');
    await expect(page.locator('#rt-text')).toHaveValue('');
    await expect(page.locator('#rt-flags')).toHaveValue('gi');
    expect(await storedText(page)).not.toContain('wipe-me');
  });

  test('Clear saved input removes a leftover own key as well as the group key', async ({ page }) => {
    // A grouped tool's own key from before its group existed, with the cleanup already done (so
    // only Clear can remove it).
    await page.addInitScript((mark) => {
      if (sessionStorage.getItem('r4-seeded')) return;
      const env = (data: unknown) => JSON.stringify({ v: 1, data });
      localStorage.setItem(mark, '1');
      localStorage.setItem('toytools:group:json-tools', env({ input: '{"from":"group"}' }));
      localStorage.setItem('toytools:json-formatter', env({ input: '{"from":"own-legacy"}' }));
      sessionStorage.setItem('r4-seeded', '1');
    }, MARK);
    await page.goto('/tool/developer-utilities/json-formatter/');
    const input = page.locator('#json-formatter-input');
    await expect(input).toHaveValue('{"from":"group"}');
    await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Clear saved input' }).click()]);
    await page.reload();
    await expect(input).toHaveValue('');
    const keys = await page.evaluate(() => [localStorage.getItem('toytools:group:json-tools'), localStorage.getItem('toytools:json-formatter')]);
    expect(keys).toEqual([null, null]);
  });

  test('a lone legacy own key moves into the group key and still shows', async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('r4-seeded')) return;
      const env = (data: unknown) => JSON.stringify({ v: 1, data });
      localStorage.setItem('toytools:json-formatter', env({ input: '{"only":"copy"}' }));
      localStorage.setItem('toytools:csv-diff', env({ input: 'id,name\n1,a' }));
      localStorage.setItem('toytools:csv-diff:b', env({ input: 'id,name\n1,b' }));
      localStorage.setItem('toytools:yaml-to-json-converter', env({ input: 'legacy: yaml' }));
      sessionStorage.setItem('r4-seeded', '1');
    });
    await page.goto('/tool/developer-utilities/json-formatter/');
    await expect(page.locator('#json-formatter-input')).toHaveValue('{"only":"copy"}');
    await expect.poll(() => page.evaluate((m) => localStorage.getItem(m), MARK)).toBe('1');
    const left = await page.evaluate(() => ({
      own: localStorage.getItem('toytools:json-formatter'),
      group: localStorage.getItem('toytools:group:json-tools'),
      csvOwn: localStorage.getItem('toytools:csv-diff'),
      yamlOwn: localStorage.getItem('toytools:yaml-to-json-converter'),
    }));
    expect(left.own).toBeNull();
    expect(left.csvOwn).toBeNull();
    expect(left.yamlOwn).toBeNull();
    expect(JSON.parse(left.group!).data).toEqual({ input: '{"only":"copy"}' });

    await page.goto('/tool/developer-utilities/csv-diff/');
    await expect(page.locator('#csv-diff-input')).toHaveValue('id,name\n1,a');
    await expect(page.locator('#csv-diff-input-b')).toHaveValue('id,name\n1,b');
    await page.goto('/tool/developer-utilities/yaml-to-json-converter/');
    await expect(page.locator('#yaml-to-json-converter-input')).toHaveValue('legacy: yaml');
  });

  for (const path of [
    '/tool/developer-utilities/json-formatter/',
    '/tool/developer-utilities/json-tree-viewer/',
    '/tool/prep/json-schema-validator/',
    '/tool/prep/json-to-schema/',
  ]) {
    test(`${path}: Clear saved input raises no console error or unhandled rejection`, async ({ page }) => {
      const errors = guardConsole(page);
      await page.goto(path);
      await page.locator('textarea:visible').first().fill('{"a":1}');
      await page.waitForTimeout(400);
      await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Clear saved input' }).click()]);
      await page.waitForTimeout(800);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('a quick converter beside them still keeps nothing', async ({ page }) => {
    await page.goto('/tool/developer-utilities/json-escape/');
    await expect(page.locator('.tool-signature .trust-tooltip')).toContainText('Nothing stored unless you choose to save it.');
    await expect(page.getByRole('button', { name: 'Clear saved input' })).toHaveCount(0);
  });
});

test.describe('options still persist', () => {
  test('regex tester keeps only real flag letters in its flags setting', async ({ page }) => {
    await page.goto('/tool/developer-utilities/regex-tester/');
    await page.locator('#rt-pattern').fill('some-pattern');
    await page.locator('#rt-flags').fill('gzqx1ii');
    await expect.poll(() => storedText(page)).toContain('"flags":"gi"');
    expect(await storedText(page)).not.toMatch(/zqx/);
    await page.reload();
    await expect(page.locator('#rt-flags')).toHaveValue('gi');

    // Only invalid letters: the default g is kept, not an empty setting.
    await page.locator('#rt-pattern').fill('x');
    await page.locator('#rt-flags').fill('zz9');
    await expect.poll(() => storedText(page)).toContain('"flags":"g"');
    await page.reload();
    await expect(page.locator('#rt-flags')).toHaveValue('g');
  });


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
      localStorage.setItem('toytools:group:json-tools', env({ input: '{"legacy":"saved-json"}' }));
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
      json: localStorage.getItem('toytools:group:json-tools'),
    }));
    // Keep-input tools are exempt: a returning visitor keeps their saved JSON.
    expect(JSON.parse(left.json!).data).toEqual({ input: '{"legacy":"saved-json"}' });
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
