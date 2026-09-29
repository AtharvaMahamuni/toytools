import { test, expect, type Page, type Locator } from '@playwright/test';

// Prep slimming (beta-v12.1): each Prep tool reads as a focused app on a phone. These pin the
// behaviour the slimming added, so a later tidy cannot quietly undo it:
//   - counted disclosures that start closed, are real buttons, and open themselves when a field
//     behind them gets text (Prompt Packer "More fields (3)", llms.txt "Optional (3)")
//   - Chat Export Cleaner's options folded into one live summary line
//   - the JSON Schema Validator verdict badge, first three problems, "Show all (N)"
//   - Context Fit's one-line result, with the estimate label still inline (craft)
//   - explanatory text handed to Zone C's More about, still in the DOM
//   - StructuredDataWidget `slim` is opt-in: the other structured-data tools are unchanged
//   - sticky Copy on phones only, and the retuned --io-pane-h heights
// prep.spec.ts still owns the "does it compute, does it upload" contract; this file owns layout.

const PP = '/tool/prep/prompt-packer/';
const CC = '/tool/prep/chat-export-cleaner/';
const J2S = '/tool/prep/json-to-schema/';
const SV = '/tool/prep/json-schema-validator/';
const CF = '/tool/prep/context-fit-checker/';
const LG = '/tool/prep/llms-txt-generator/';

async function box(el: Locator) {
  const b = await el.boundingBox();
  if (!b) throw new Error('element has no box');
  return b;
}

async function isPhone(page: Page) {
  return (page.viewportSize()?.width ?? 1280) < 640;
}

test.describe('prep slimming: disclosures', () => {
  test('Prompt Packer shows Role and Task, hides three fields behind a counted button', async ({ page }) => {
    await page.goto(PP);
    await expect(page.locator('#pp-role')).toBeVisible();
    await expect(page.locator('#pp-task')).toBeVisible();

    const toggle = page.locator('#pp-more-toggle');
    await expect(toggle).toHaveText(/More fields\s*\(3\)/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'pp-more');
    for (const id of ['#pp-context', '#pp-constraints', '#pp-format-field']) {
      await expect(page.locator(id)).toBeHidden();
      await expect(page.locator(id)).toHaveCount(1); // hidden, not removed
    }

    // Keyboard: it is a real button, reachable and operable without a pointer.
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#pp-context')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#pp-context')).toBeHidden();
  });

  test('Prompt Packer opens More fields by itself when Sample fills them', async ({ page }) => {
    await page.goto(PP);
    await page.locator('#pp-sample').click();
    await expect(page.locator('#pp-more-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#pp-context')).toBeVisible();
    await expect(page.locator('#pp-context')).not.toHaveValue('');
    await expect(page.locator('#pp-out')).toHaveValue(/## Context/);
  });

  test('Prompt Packer layout switch lives in the output header', async ({ page }) => {
    await page.goto(PP);
    const header = page.locator('.io-panel', { has: page.locator('#pp-out') }).locator('.io-header');
    await expect(header.locator('#pp-md')).toBeVisible();
    await expect(header.locator('#pp-xml')).toBeVisible();
    await page.locator('#pp-task').fill('Explain Binder.');
    await header.locator('#pp-xml').click();
    await expect(page.locator('#pp-xml')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#pp-out')).toHaveValue(/<task>/);
    // The craft line stays in the widget, not behind the disclosure.
    await expect(page.locator('#pp-omit')).toBeVisible();
  });

  test('llms.txt keeps Name, URL, Purpose and Tools open; three optional fields folded', async ({ page }) => {
    await page.goto(LG);
    for (const id of ['#lg-name', '#lg-url', '#lg-purpose', '#lg-pages']) await expect(page.locator(id)).toBeVisible();
    const toggle = page.locator('#lg-more-toggle');
    await expect(toggle).toHaveText(/Optional\s*\(3\)/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    for (const id of ['#lg-contact', '#lg-usage', '#lg-policy']) await expect(page.locator(id)).toBeHidden();

    // Sample writes a crawler policy, so the region opens rather than hiding a filled field.
    await page.locator('#lg-sample').click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#lg-policy')).toBeVisible();
    await expect(page.locator('#lg-policy')).not.toHaveValue('');
  });
});

test.describe('prep slimming: summaries and verdicts', () => {
  test('Chat Export Cleaner folds its ten options into one live summary line', async ({ page }) => {
    await page.goto(CC);
    const toggle = page.locator('#cc-options-toggle');
    await expect(toggle).toHaveText('Cleanup: 6 of 6 on · Keep: Everything');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#cc-times')).toBeHidden();

    await toggle.click();
    await expect(page.locator('#cc-times')).toBeVisible();
    await page.locator('#cc-times').uncheck();
    await page.locator('#cc-user').check();
    await expect(toggle).toHaveText('Cleanup: 5 of 6 on · Keep: User messages');

    // The craft status line and the result stay on the tool screen, result directly below it.
    await toggle.click();
    await page.locator('#cc-sample').click();
    const status = page.locator('#cc-status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('changed');
    const gap = (await box(page.locator('#cc-out'))).y - ((await box(status)).y + (await box(status)).height);
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThan(120); // only the pane label sits between them
  });

  test('Schema Validator shows a verdict badge, the first three problems and Show all (N)', async ({ page }) => {
    await page.goto(SV);
    await page.locator('#sv-sample').click();
    const badge = page.locator('#sv-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('✓ Valid');
    await expect(badge).toHaveAttribute('data-verdict', 'valid');

    // Badge sits right under the two panes.
    const data = await box(page.locator('#sv-data'));
    const b = await box(badge);
    expect(b.y).toBeGreaterThan(data.y + data.height);
    expect(b.y - (data.y + data.height)).toBeLessThan(40);

    await page.locator('#sv-schema').fill(JSON.stringify({
      type: 'object', required: ['name', 'age', 'email', 'tags'],
      properties: { name: { type: 'string' }, age: { type: 'integer', minimum: 0 }, email: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, active: { type: 'boolean' } },
      additionalProperties: false,
    }));
    await page.locator('#sv-data').fill(JSON.stringify({ name: 5, age: -3, tags: [1, 2, 'x'], active: 'yes', extra: 1 }));
    await expect(badge).toHaveText('✗ Invalid');
    const items = page.locator('#sv-errors li');
    const n = await items.count();
    expect(n).toBeGreaterThan(3);
    await expect(page.locator('#sv-errors li:visible')).toHaveCount(3);

    const more = page.locator('#sv-show-all');
    await expect(more).toHaveText(`Show all (${n})`);
    await expect(more).toHaveAttribute('aria-expanded', 'false');
    await more.focus();
    await page.keyboard.press('Enter');
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#sv-errors li:visible')).toHaveCount(n);
    await more.click();
    await expect(page.locator('#sv-errors li:visible')).toHaveCount(3);

    // Few problems: no button at all.
    await page.locator('#sv-data').fill(JSON.stringify({ name: 'a', age: 1, email: 'e', tags: [], extra: 1 }));
    await expect(page.locator('#sv-errors li')).toHaveCount(1);
    await expect(more).toBeHidden();

    // Unreadable input still says so, with its own badge.
    await page.locator('#sv-data').fill('{');
    await expect(page.locator('#sv-status')).toContainText('Data is not valid JSON');
    await expect(badge).toHaveAttribute('data-verdict', 'unreadable');
    await expect(page.locator('#sv-errors')).toBeHidden();
  });

  test('Schema Validator puts Paste on the action row with Sample and Clear', async ({ page }) => {
    await page.goto(SV);
    const row = page.locator('.tool-actions', { has: page.locator('#sv-sample') });
    await expect(row.locator('[data-action="paste"]')).toBeVisible();
    await expect(row.locator('#sv-clear')).toBeVisible();
    const p = await box(row.locator('[data-action="paste"]'));
    const s = await box(page.locator('#sv-sample'));
    expect(Math.abs(p.y - s.y)).toBeLessThan(2);
  });

  test('Context Fit reads as one result line with the estimate label inline', async ({ page }) => {
    await page.goto(CF);
    await page.locator('#cf-text').fill('a'.repeat(4000));
    const line = page.locator('.cf-result');
    await expect(line).toHaveText(/^~1,000 tokens · [\d.]+% of [\d,]+ · Fits$/);
    // craft: the estimate label is visible on the tool screen, beside the number, not in a drawer
    const warn = page.locator('#cf-warn');
    await expect(warn).toBeVisible();
    await expect(warn).toContainText('estimate');
    expect(await warn.evaluate((el) => !!el.closest('.knowledge-drawers'))).toBe(false);
    const lb = await box(line);
    const wb = await box(warn);
    expect(wb.y - (lb.y + lb.height)).toBeLessThan(40);
  });
});

test.describe('prep slimming: text handed to More about', () => {
  test('Context Fit source and checked date live in Zone C, still in the DOM', async ({ page }) => {
    await page.goto(CF);
    const source = page.locator('#cf-source');
    await expect(source).toHaveCount(1);
    await expect(source).toContainText('https://');
    await expect(source).toContainText('Window checked');
    expect(await source.evaluate((el) => !!el.closest('.knowledge-drawers'))).toBe(true);
  });

  test('Context Fit source is also in the served HTML, not only written by script', async ({ request }) => {
    const html = await (await request.get(CF)).text();
    expect(html).toMatch(/id="cf-source"[^>]*>Window checked [^<]*https:\/\//);
  });

  test('JSON to Schema moves its explanation and technical details to More about', async ({ page }) => {
    await page.goto(J2S);
    const widgetScope = page.locator('main .conv-insight');
    await expect(widgetScope).toHaveCount(0);
    await expect(page.locator('main details.conv-tech')).toHaveCount(0);
    const about = page.locator('#json-to-schema-about');
    await expect(about).toHaveCount(1);
    expect(await about.evaluate((el) => !!el.closest('.knowledge-drawers'))).toBe(true);
    await expect(about.locator('summary h2')).toHaveText('How JSON to JSON Schema works');
    // Text is present in the DOM whether or not the drawer is open.
    expect(((await about.textContent()) ?? '').length).toBeGreaterThan(80);
  });

  test('JSON to Schema keeps Paste, Clear, Download and Sample on one row', async ({ page }) => {
    await page.goto(J2S);
    const row = page.locator('.sd-slim .tool-actions');
    const buttons = row.locator('button');
    await expect(buttons).toHaveCount(4);
    await expect(row.locator('[data-conv-example]')).toHaveText('Sample');
    const ys = new Set<number>();
    for (let i = 0; i < 4; i++) ys.add(Math.round((await box(buttons.nth(i))).y));
    expect(ys.size).toBe(1);
    const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hscroll).toBe(false);
  });

  // The opt-in proof, in a browser: every other StructuredDataWidget tool still renders its
  // insight card and Technical details inside the widget, keeps "Load example", and gets none of
  // the slim markup. (The PR also diffed the built HTML of all seven against main: byte-identical.)
  const OTHERS = [
    'json-formatter', 'json-minifier', 'json-validator', 'json-to-yaml-converter',
    'yaml-to-json-converter', 'json-to-csv-converter', 'csv-to-json-converter',
  ];
  for (const slug of OTHERS) {
    test(`slim is opt-in: ${slug} renders as before`, async ({ page }) => {
      await page.goto(`/tool/developer-utilities/${slug}/`);
      await expect(page.locator('.sd-slim')).toHaveCount(0);
      await expect(page.locator('[data-more-about]')).toHaveCount(0);
      await expect(page.locator('.conv-insight')).toBeVisible();
      await expect(page.locator('details.conv-tech')).toHaveCount(1);
      expect(await page.locator('.conv-insight').evaluate((el) => !!el.closest('.knowledge-drawers'))).toBe(false);
      await expect(page.locator('[data-conv-example]')).toHaveText('Load example');
    });
  }
});

test.describe('prep slimming: heights and sticky actions', () => {
  test('outputs open tall enough to read, inputs smaller', async ({ page }) => {
    const phone = await isPhone(page);
    const cases: [string, string, string][] = [
      [PP, '#pp-task', '#pp-out'],
      [CC, '#cc-in', '#cc-out'],
      [LG, '#lg-pages', '#lg-out'],
    ];
    for (const [url, inputSel, outSel] of cases) {
      await page.goto(url);
      const input = (await box(page.locator(inputSel))).height;
      const out = (await box(page.locator(outSel))).height;
      // Phone outputs sit in the 10-14rem band (160-224px); desktop outputs are at least as tall.
      if (phone) {
        expect(out, url).toBeGreaterThanOrEqual(160);
        expect(out, url).toBeLessThanOrEqual(224);
      } else {
        expect(out, url).toBeGreaterThanOrEqual(192);
      }
      expect(input, url).toBeLessThan(out);
      // Still resizable (PR #232).
      expect(await page.locator(outSel).evaluate((el) => getComputedStyle(el).resize)).toBe('vertical');
    }
    await page.goto(SV);
    const sch = (await box(page.locator('#sv-schema'))).height;
    expect(sch).toBeGreaterThanOrEqual(128);
    expect(sch).toBeLessThanOrEqual(152);
    await page.goto(CF);
    const cf = (await box(page.locator('#cf-text'))).height;
    expect(cf).toBeGreaterThanOrEqual(140);
    expect(cf).toBeLessThanOrEqual(160);
    await page.goto(J2S);
    const j = (await box(page.locator('#json-to-schema-input'))).height;
    expect(j).toBeGreaterThanOrEqual(150);
  });

  // WCAG 2.2 SC 2.4.11 Focus Not Obscured: the floating bar must never sit on top of the field
  // the keyboard just moved to. html:has(.tool-actions--sticky) { scroll-padding-bottom } makes
  // focus scrolling stop above the bar. Runs on pixel5 as the device, and on the chromium
  // project as the audit's 390x844 phone, so both reported cases (#lg-policy y 796-844,
  // #pp-format-field y 809-913 under a bar at y 763) are pinned on both.
  for (const [url, root, sample, named] of [
    [PP, '.pp', '#pp-sample', '#pp-format-field'],
    [CC, '.cc', '#cc-sample', null],
    [LG, '.lg', '#lg-sample', '#lg-policy'],
  ] as const) {
    test(`Tab never lands under the sticky bar on a phone: ${url}`, async ({ page, browser }, testInfo) => {
      let p = page;
      let ctx;
      if (testInfo.project.name !== 'pixel5') {
        ctx = await browser.newContext({
          viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
        });
        p = await ctx.newPage();
      }
      try {
        await p.goto(url);
        await p.locator(sample).click();
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.locator(sample).focus();
        const seen: string[] = [];
        for (let i = 0; i < 80; i++) {
          await p.keyboard.press('Tab');
          const r = await p.evaluate((rootSel) => {
            const a = document.activeElement as HTMLElement | null;
            const w = document.querySelector(rootSel);
            const bar = document.querySelector('.tool-actions--sticky');
            if (!a || !w || !bar || !w.contains(a)) return null;
            const ra = a.getBoundingClientRect();
            return {
              id: a.id || a.tagName.toLowerCase(),
              inBar: bar.contains(a),
              top: ra.top,
              barTop: bar.getBoundingClientRect().top,
            };
          }, root);
          if (!r) break; // focus left the widget
          seen.push(r.id);
          if (r.inBar) continue;
          expect(r.top, `${url} ${r.id} top vs bar top`).toBeLessThan(r.barTop);
        }
        // The walk covered the fields behind the disclosure, not just the first one or two.
        expect(seen.length, seen.join(',')).toBeGreaterThan(4);
        if (named) expect(seen, seen.join(',')).toContain(named.slice(1));
      } finally {
        await ctx?.close();
      }
    });
  }

  for (const [url, hasDownload] of [[PP, false], [CC, false], [LG, true]] as const) {
    test(`sticky Copy${hasDownload ? ' + Download' : ''} on phones only: ${url}`, async ({ page }) => {
      await page.goto(url);
      const bar = page.locator('.tool-actions--sticky');
      await expect(bar).toHaveCount(1);
      await expect(bar.locator('[data-action="copy"]')).toBeVisible();
      if (hasDownload) await expect(bar.locator('[data-action="download"]')).toBeVisible();
      const vh = page.viewportSize()!.height;
      const position = await bar.evaluate((el) => getComputedStyle(el).position);
      if (await isPhone(page)) {
        expect(position).toBe('sticky');
        // Fill the long form so the bar's own slot is below the fold: it must float at the bottom.
        const sample = page.locator('#pp-sample, #cc-sample, #lg-sample').first();
        await sample.click();
        await page.evaluate(() => window.scrollTo(0, 0));
        const b = await box(bar);
        expect(Math.abs(b.y + b.height - vh)).toBeLessThanOrEqual(2);
        // At the end of the widget it returns to its own slot: nothing is left covered.
        await page.locator('.tool-signature').scrollIntoViewIfNeeded();
        const sig = await box(page.locator('.tool-signature'));
        const b2 = await box(bar);
        expect(b2.y + b2.height).toBeLessThanOrEqual(sig.y + 1);
      } else {
        expect(position).toBe('static');
      }
    });
  }
});
