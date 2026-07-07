// Generic platform smoke — EVERY tool, BOTH viewports (chromium + pixel5).
//
// Data-driven from the built sitemap, so this guards all 32 tools today and every
// future tool automatically with zero per-tool maintenance. Each tool asserts:
//   • Render            — page responds < 400, <main> visible.
//   • Accessibility     — exactly one <h1>; every visible button has an accessible
//                         name; every visible text input/textarea/contenteditable
//                         has an accessible name (aria-label / label[for] / wrapping label).
//   • Interaction       — fill the first editable control; the value sticks (catches
//                         hydration / client-init failures static render can't see).
//   • Console / page    — no console.error/warning, no pageerror, no unhandled
//                         rejection (allowlist below for known-intentional noise).
import { test, expect, type Page } from '@playwright/test';
import { toolPaths, slugFromPath } from './helpers/tools';

// Known-intentional console messages (regex). Asserted empty otherwise.
const ALLOWED_CONSOLE: RegExp[] = [
  // GA/gtag + partytown can fail to reach the network in the offline test env.
  /google-analytics|googletagmanager|gtag|partytown/i,
  /Failed to load resource/i,
  /net::ERR_/i,
];

function isAllowed(text: string): boolean {
  return ALLOWED_CONSOLE.some((re) => re.test(text));
}

// In-page accessible-name check (smoke-level: aria-label / aria-labelledby /
// label[for] / wrapping <label>). Placeholder alone does NOT count as a name.
const HAS_NAME = (el: Element): boolean => {
  const aria = el.getAttribute('aria-label');
  if (aria && aria.trim()) return true;
  const lb = el.getAttribute('aria-labelledby');
  if (lb && lb.split(/\s+/).some((id) => document.getElementById(id)?.textContent?.trim())) return true;
  const id = (el as HTMLElement).id;
  if (id) {
    const lab = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (lab && lab.textContent && lab.textContent.trim()) return true;
  }
  if (el.closest('label')) return true;
  const txt = el.textContent;
  return !!(txt && txt.trim());
};

async function attachConsoleGuards(page: Page) {
  const consoleIssues: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (msg) => {
    const type = msg.type();
    if ((type === 'error' || type === 'warning') && !isAllowed(msg.text())) {
      consoleIssues.push(`[${type}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  await page.addInitScript(() => {
    (window as unknown as { __rejections: string[] }).__rejections = [];
    window.addEventListener('unhandledrejection', (e) => {
      (window as unknown as { __rejections: string[] }).__rejections.push(String(e.reason));
    });
  });
  return { consoleIssues, pageErrors };
}

for (const path of toolPaths()) {
  const slug = slugFromPath(path);

  test(`smoke: ${slug}`, async ({ page }) => {
    const { consoleIssues, pageErrors } = await attachConsoleGuards(page);

    // --- Render ---
    const resp = await page.goto(path);
    expect(resp?.status() ?? 0, 'HTTP status').toBeLessThan(400);
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // --- Accessibility ---
    await expect(page.locator('h1'), 'exactly one <h1>').toHaveCount(1);

    // Scope to <main> so we exercise the tool, not shared chrome (nav search, theme toggle).
    const buttons = main.getByRole('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i);
      if (!(await btn.isVisible())) continue;
      const named = await btn.evaluate(HAS_NAME);
      expect(named, `visible button #${i} has an accessible name`).toBe(true);
    }

    const fields = main.locator(
      'textarea, [contenteditable="true"], input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"])'
    );
    const fieldCount = await fields.count();
    for (let i = 0; i < fieldCount; i++) {
      const field = fields.nth(i);
      if (!(await field.isVisible())) continue;
      const named = await field.evaluate(HAS_NAME);
      expect(named, `visible input/textarea #${i} has an accessible name`).toBe(true);
    }

    // --- Interaction: exercise the first editable control, confirm it sticks ---
    const editable = fields.first();
    if ((await editable.count()) > 0 && (await editable.isVisible())) {
      const tag = await editable.evaluate((el) => el.tagName.toLowerCase());
      const type = await editable.getAttribute('type');
      if (type === 'range') {
        // A slider can't be .fill()ed with text (Playwright throws "Malformed value").
        // Drive it to its minimum and confirm the value applied.
        const min = (await editable.getAttribute('min')) ?? '0';
        await editable.fill(min);
        await expect(editable).toHaveValue(min);
      } else {
        const value = type === 'number' ? '42' : 'test';
        await editable.fill(value);
        if (tag === 'textarea' || tag === 'input') {
          await expect(editable).toHaveValue(value);
        } else {
          await expect(editable).toHaveText(value);
        }
      }
    }

    // --- Console / page-error hardening ---
    const rejections = await page.evaluate(
      () => (window as unknown as { __rejections: string[] }).__rejections ?? []
    );
    expect(pageErrors, 'no uncaught page errors').toEqual([]);
    expect(rejections, 'no unhandled promise rejections').toEqual([]);
    expect(consoleIssues, 'no console errors/warnings').toEqual([]);
  });
}
