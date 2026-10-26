// @vitest-environment happy-dom
//
// Group pills prefetch a sibling page only on intent. Before alpha-v13.13.1 every tool in a group
// shipped one <link rel="prefetch"> per sibling, so a health calculator fetched up to 16 pages
// (about 360 KB) during load. This evaluates the inline script in GroupSwitcher.astro that visitors run.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';

const switcher = readFileSync(path.resolve(__dirname, '../../components/tool/GroupSwitcher.astro'), 'utf8');
const inline = /<script is:inline>([\s\S]*?)<\/script>/.exec(switcher)?.[1] ?? '';

function boot(connection?: { saveData?: boolean; effectiveType?: string }) {
  const win = new Window({ url: 'https://toytoolsapp.com/tool/health/bmi-calculator/' });
  const doc = win.document;
  doc.documentElement.setAttribute('data-ephemeral', '');
  doc.body.innerHTML = `<nav class="group-switcher">
    <a class="group-pill" href="/tool/health/bmi-calculator/" aria-current="page">BMI</a>
    <a class="group-pill" href="/tool/health/macro-calculator/">Macros</a>
  </nav>`;
  const nav = { connection };
  new Function('window', 'document', 'navigator', inline)(win, doc, nav);
  const prefetches = () => [...doc.querySelectorAll('link[rel="prefetch"]')].map(l => l.getAttribute('href'));
  return { win, doc, prefetches };
}

describe('group pill prefetch', () => {
  it('the switcher markup ships no prefetch link', () => {
    expect(inline).toContain('prefetch');
    expect(switcher).not.toMatch(/<link rel="prefetch" href/);
  });

  it('fetches nothing at load', () => {
    expect(boot().prefetches()).toEqual([]);
  });

  it('prefetches a sibling once on hover, focus or touch, never the current page', () => {
    const { win, doc, prefetches } = boot();
    const [current, sibling] = [...doc.querySelectorAll('.group-pill')];
    current.dispatchEvent(new win.Event('pointerover', { bubbles: true }));
    expect(prefetches()).toEqual([]);
    sibling.dispatchEvent(new win.Event('pointerover', { bubbles: true }));
    sibling.dispatchEvent(new win.Event('focusin', { bubbles: true }));
    sibling.dispatchEvent(new win.Event('touchstart', { bubbles: true }));
    expect(prefetches()).toEqual(['https://toytoolsapp.com/tool/health/macro-calculator/']);
  });

  const hover = (env: ReturnType<typeof boot>) => {
    const sibling = env.doc.querySelectorAll('.group-pill')[1];
    sibling.dispatchEvent(new env.win.Event('pointerover', { bubbles: true }));
    sibling.dispatchEvent(new env.win.Event('touchstart', { bubbles: true }));
    return env.prefetches();
  };

  it('skips prefetch when the visitor asked to save data', () => {
    expect(hover(boot({ saveData: true, effectiveType: '4g' }))).toEqual([]);
  });

  it('skips prefetch on 2g and slow-2g', () => {
    expect(hover(boot({ effectiveType: '2g' }))).toEqual([]);
    expect(hover(boot({ effectiveType: 'slow-2g' }))).toEqual([]);
  });

  it('still prefetches on 3g, 4g, or when the browser has no Network Information API', () => {
    const want = ['https://toytoolsapp.com/tool/health/macro-calculator/'];
    expect(hover(boot({ effectiveType: '3g' }))).toEqual(want);
    expect(hover(boot({ effectiveType: '4g', saveData: false }))).toEqual(want);
    expect(hover(boot())).toEqual(want);
  });
});
