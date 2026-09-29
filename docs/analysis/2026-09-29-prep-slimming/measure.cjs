// Parameterised copy of measure.cjs: BASE=<url> OUT=<dir> node measure2.cjs
// Same geometry (widget = .tool-header bottom -> .tool-signature top), plus the
// json-schema-validator error case from sv.cjs, measured empty and after sample/fill.
const { chromium } = require('/workspace/toytools/node_modules/playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:4340';
const OUT = process.env.OUT || '/workspace/prep-ux/before-main';
const tools = [
  { slug: 'prompt-packer', sample: '#pp-sample', out: '#pp-out' },
  { slug: 'chat-export-cleaner', sample: '#cc-sample', out: '#cc-out' },
  { slug: 'json-to-schema', fill: ['#json-to-schema-input', '{"name":"Ada","age":30,"active":true,"tags":["a","b"],"address":{"city":"Pune","zip":"411001"}}'], out: '#json-to-schema-output' },
  { slug: 'json-schema-validator', sample: '#sv-sample', out: '#sv-status' },
  { slug: 'json-schema-validator', variant: 'errors', fills: [['#sv-schema', JSON.stringify({type:'object',required:['name','age','email','tags'],properties:{name:{type:'string'},age:{type:'integer',minimum:0},email:{type:'string'},tags:{type:'array',items:{type:'string'}},active:{type:'boolean'}},additionalProperties:false})], ['#sv-data', JSON.stringify({name:5,age:-3,tags:[1,2,'x'],active:'yes',extra:1})]], out: '#sv-status' },
  { slug: 'context-fit-checker', fill: ['#cf-text', 'Explain how Binder IPC works on Android. '.repeat(40)], out: '#cf-status' },
  { slug: 'llms-txt-generator', sample: '#lg-sample', out: '#lg-out' },
];
const vps = [{ name: 'mobile', width: 390, height: 844, mobile: true }, { name: 'desktop', width: 1280, height: 800, mobile: false }];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const vp of vps) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1 });
    for (const t of tools) {
      const page = await ctx.newPage();
      const name = t.slug + (t.variant ? '-' + t.variant : '');
      await page.goto(`${BASE}/tool/prep/${t.slug}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const geo = async () => page.evaluate((outSel) => {
        const y = el => el.getBoundingClientRect().top + window.scrollY;
        const hdr = document.querySelector('.tool-header');
        const sig = document.querySelector('.tool-signature');
        const top = hdr ? y(hdr) + hdr.getBoundingClientRect().height : 0;
        const bottom = sig ? y(sig) : document.documentElement.scrollHeight;
        const tas = [...document.querySelectorAll('main textarea')].filter(ta => ta.getBoundingClientRect().height > 0).map(ta => ({ id: ta.id, h: Math.round(ta.getBoundingClientRect().height) }));
        const out = outSel ? document.querySelector(outSel) : null;
        return { top: Math.round(top), bottom: Math.round(bottom), widgetH: Math.round(bottom - top), pageH: document.documentElement.scrollHeight, outTop: out ? Math.round(y(out)) : null, outH: out ? Math.round(out.getBoundingClientRect().height) : null, tas };
      }, t.out);
      const before = await geo();
      if (!t.variant) await page.screenshot({ path: `${OUT}/${name}-${vp.name}-first-screen.png` });
      if (t.sample) await page.click(t.sample);
      if (t.fill) await page.fill(t.fill[0], t.fill[1]);
      if (t.fills) for (const f of t.fills) await page.fill(f[0], f[1]);
      await page.waitForTimeout(400);
      const after = await geo();
      await page.screenshot({ path: `${OUT}/${name}-${vp.name}-widget-full.png`, fullPage: true, clip: { x: 0, y: Math.max(0, after.top - 40), width: vp.width, height: after.bottom - after.top + 80 } });
      results.push({ tool: name, vp: vp.name, vh: vp.height, before, after });
      const s = v => (v / vp.height).toFixed(2);
      console.log(`${vp.name.padEnd(7)} ${name.padEnd(29)} empty ${String(before.widgetH).padStart(5)}px ${s(before.widgetH)} scr | filled ${String(after.widgetH).padStart(5)}px ${s(after.widgetH)} scr | out top ${after.outTop} (${after.outTop!=null?s(after.outTop):'-'}) | tas ${after.tas.map(x=>x.id+':'+x.h).join(' ')}`);
      await page.close();
    }
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/measurements.json`, JSON.stringify(results, null, 1));
  await browser.close();
})();
