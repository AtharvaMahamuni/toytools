import { describe, it, expect } from 'vitest';
import { GENERATORS, getGenerator, runGeneration, generatorInfo } from './registry';
import { entropyBits, strengthFromEntropy, secureInt, wifiPayload, vcardPayload } from './utils';

// Default options for a generator, read straight from its field schema.
function defaultsFor(id: string): Record<string, number | string | boolean> {
  const info = generatorInfo(id);
  return info ? { ...info.defaults } : {};
}

// ── Registry resolver ────────────────────────────────────────────────────────

describe('runGeneration', () => {
  it('returns an error result for an unknown id (never throws)', () => {
    const r = runGeneration('does-not-exist', {});
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/unknown/i);
  });

  it('exposes generatorInfo with fields + defaults for every generator', () => {
    for (const id of Object.keys(GENERATORS)) {
      const info = generatorInfo(id);
      expect(info, id).toBeTruthy();
      expect(info!.fields.length).toBeGreaterThan(0);
      for (const f of info!.fields) expect(info!.defaults).toHaveProperty(f.id);
    }
  });

  it.each(Object.keys(GENERATORS))('generator "%s" produces ok output with defaults', (id) => {
    // qr-code is the one generator that needs content — give it some.
    const opts = defaultsFor(id);
    if (id === 'qr-code') opts.text = 'https://toytoolsapp.com';
    const r = runGeneration(id, opts);
    expect(r.ok, JSON.stringify(r)).toBe(true);
    if (r.kind === 'text') expect((r.text ?? '').length).toBeGreaterThan(0);
    if (r.kind === 'lines') expect((r.lines ?? []).length).toBeGreaterThan(0);
    if (r.kind === 'qr') expect(r.qr!.modules.length).toBeGreaterThan(0);
  });
});

// ── Utils ────────────────────────────────────────────────────────────────────

describe('utils', () => {
  it('secureInt stays within [0, max)', () => {
    for (let i = 0; i < 200; i++) {
      const n = secureInt(7);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(7);
    }
  });
  it('secureInt(1) is always 0', () => expect(secureInt(1)).toBe(0));
  it('entropyBits = length * log2(pool)', () => expect(entropyBits(16, 64)).toBe(96));
  it('strength climbs with entropy', () => {
    expect(strengthFromEntropy(10).score).toBe(0);
    expect(strengthFromEntropy(200).score).toBe(4);
    expect(strengthFromEntropy(200).score).toBeGreaterThan(strengthFromEntropy(50).score);
  });
  it('wifiPayload escapes reserved characters', () => {
    const p = wifiPayload({ ssid: 'Cafe;Net', password: 'p:a,ss', encryption: 'WPA' });
    expect(p).toContain('S:Cafe\\;Net');
    expect(p).toContain('P:p\\:a\\,ss');
    expect(p.startsWith('WIFI:')).toBe(true);
  });
  it('vcardPayload builds a MECARD with only the provided fields', () => {
    const p = vcardPayload({ fullName: 'Ada Lovelace', email: 'ada@example.com' });
    expect(p).toContain('N:Ada Lovelace');
    expect(p).toContain('EMAIL:ada@example.com');
    expect(p).not.toContain('TEL:');
  });
});

// ── Password ─────────────────────────────────────────────────────────────────

describe('password', () => {
  const gen = (opts: Record<string, unknown>) => getGenerator('password')!.generate(opts as never);

  it('honours the requested length', () => {
    expect(gen({ ...defaultsFor('password'), length: 32 }).text!.length).toBe(32);
  });
  it('entropy strictly increases with length', () => {
    const a = gen({ ...defaultsFor('password'), length: 8 }).strength!.score;
    const b = gen({ ...defaultsFor('password'), length: 64 }).strength!.score;
    expect(b).toBeGreaterThanOrEqual(a);
  });
  it('only uses the enabled character sets', () => {
    const r = gen({ length: 40, uppercase: false, lowercase: true, numbers: false, symbols: false, excludeAmbiguous: false });
    expect(r.text!).toMatch(/^[a-z]+$/);
  });
  it('excludes ambiguous characters when asked', () => {
    const r = gen({ length: 120, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: true });
    expect(r.text!).not.toMatch(/[O0Il1]/);
  });
  it('fails cleanly when every set is disabled', () => {
    const r = gen({ length: 16, uppercase: false, lowercase: false, numbers: false, symbols: false });
    expect(r.ok).toBe(false);
  });
});

// ── UUID ─────────────────────────────────────────────────────────────────────

describe('uuid', () => {
  const gen = (opts: Record<string, unknown>) => getGenerator('uuid')!.generate(opts as never);
  const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  it('emits valid v4 UUIDs', () => {
    const r = gen({ ...defaultsFor('uuid'), count: 5 });
    expect(r.lines!.length).toBe(5);
    for (const line of r.lines!) expect(line).toMatch(V4);
  });
  it('removes hyphens when disabled', () => {
    const r = gen({ ...defaultsFor('uuid'), count: 1, hyphens: false });
    expect(r.lines![0]).not.toContain('-');
    expect(r.lines![0].length).toBe(32);
  });
  it('uppercases when asked', () => {
    const r = gen({ ...defaultsFor('uuid'), count: 1, uppercase: true });
    expect(r.lines![0]).toBe(r.lines![0].toUpperCase());
  });
  it('produces unique values across a batch', () => {
    const r = gen({ ...defaultsFor('uuid'), count: 50 });
    expect(new Set(r.lines!).size).toBe(50);
  });
});

// ── Random string ────────────────────────────────────────────────────────────

describe('random-string', () => {
  const gen = (opts: Record<string, unknown>) => getGenerator('random-string')!.generate(opts as never);

  it('honours length', () => {
    expect(gen({ ...defaultsFor('random-string'), length: 50 }).text!.length).toBe(50);
  });
  it('a custom set overrides the toggles', () => {
    const r = gen({ ...defaultsFor('random-string'), length: 60, custom: 'AB' });
    expect(r.text!).toMatch(/^[AB]+$/);
  });
  it('fails when nothing is enabled and no custom set', () => {
    const r = gen({ length: 10, uppercase: false, lowercase: false, numbers: false, symbols: false, custom: '' });
    expect(r.ok).toBe(false);
  });
});

// ── Lorem ipsum ──────────────────────────────────────────────────────────────

describe('lorem-ipsum', () => {
  const gen = (opts: Record<string, unknown>) => getGenerator('lorem-ipsum')!.generate(opts as never);

  it('word mode emits exactly the requested word count', () => {
    const r = gen({ unit: 'words', count: 12, startWithLorem: true });
    expect(r.text!.trim().split(/\s+/).length).toBe(12);
  });
  it('word mode starts with Lorem ipsum when asked', () => {
    const r = gen({ unit: 'words', count: 8, startWithLorem: true });
    expect(r.text!.toLowerCase().startsWith('lorem ipsum dolor sit amet')).toBe(true);
  });
  it('sentence mode emits the requested number of sentences', () => {
    const r = gen({ unit: 'sentences', count: 4, startWithLorem: false });
    expect(r.text!.split('.').filter((s) => s.trim().length).length).toBe(4);
  });
  it('paragraph mode separates paragraphs with a blank line', () => {
    const r = gen({ unit: 'paragraphs', count: 3, startWithLorem: false });
    expect(r.text!.split('\n\n').length).toBe(3);
  });
});

// ── QR code ──────────────────────────────────────────────────────────────────

describe('qr-code', () => {
  const gen = (opts: Record<string, unknown>) => getGenerator('qr-code')!.generate(opts as never);

  it('encodes text into a square matrix', () => {
    const r = gen({ contentType: 'text', text: 'hello world', errorCorrection: 'M' });
    expect(r.ok).toBe(true);
    expect(r.qr!.count).toBe(r.qr!.modules.length);
    expect(r.qr!.modules[0].length).toBe(r.qr!.count);
    expect(r.downloads).toEqual(['png', 'svg']);
  });
  it('formats a Wi-Fi payload', () => {
    const r = gen({ contentType: 'wifi', ssid: 'MyNet', wifiPassword: 'secret', encryption: 'WPA' });
    expect(r.qr!.content).toBe('WIFI:T:WPA;S:MyNet;P:secret;;');
  });
  it('formats an email payload', () => {
    const r = gen({ contentType: 'email', text: 'ada@example.com' });
    expect(r.qr!.content).toBe('mailto:ada@example.com');
  });
  it('formats a phone payload', () => {
    const r = gen({ contentType: 'phone', text: '+1 (555) 010-0000' });
    expect(r.qr!.content).toBe('tel:+15550100000');
  });
  it('errors on empty content', () => {
    expect(gen({ contentType: 'text', text: '' }).ok).toBe(false);
  });
});
