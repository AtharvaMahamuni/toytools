// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import { toolGroups } from '@data/tool-groups';
import {
  clearLegacyInputs,
  LEGACY_HISTORY_PREFIX,
  LEGACY_INPUT_IDS,
  LEGACY_RAW_KEYS,
  LEGACY_RULES,
  MARK,
  reduceEnvelope,
  runLegacyCleanup,
  type KeyValueStore,
} from './legacy-storage';

/** A Storage stand-in backed by a Map, in insertion order like the real thing. */
class MemoryStore implements KeyValueStore {
  readonly map = new Map<string, string>();
  constructor(seed: Record<string, string> = {}) {
    for (const [k, v] of Object.entries(seed)) this.map.set(k, v);
  }
  get length() { return this.map.size; }
  key(i: number) { return [...this.map.keys()][i] ?? null; }
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null; }
  setItem(k: string, v: string) { this.map.set(k, String(v)); }
  removeItem(k: string) { this.map.delete(k); }
}

const env = (data: unknown, v = 1) => JSON.stringify({ v, data });
const read = (s: MemoryStore, k: string) => JSON.parse(s.getItem(k)!);

describe('reduceEnvelope', () => {
  it('keeps only the named option fields of a converter envelope', () => {
    expect(reduceEnvelope({ input: 'secret', mode: 'decode', override: 'b' }, { keep: ['mode', 'override'] }))
      .toEqual({ mode: 'decode', override: 'b' });
  });

  it('moves select fields into opts, unwrapping Finance { value, raw } pairs, and drops typed fields', () => {
    expect(reduceEnvelope(
      { currency: 'INR', fields: { principal: { value: 5000, raw: '5000' }, frequency: { value: 'monthly', raw: 'monthly' } } },
      { keep: ['currency'], fieldOpts: ['frequency'] },
    )).toEqual({ currency: 'INR', opts: { frequency: 'monthly' } });
    expect(reduceEnvelope({ fields: { unit: 'metric', weight: '80', height: '180' } }, { fieldOpts: ['unit'] }))
      .toEqual({ opts: { unit: 'metric' } });
  });

  it('keeps an opts bag a newer build already wrote, and ignores empty selects', () => {
    expect(reduceEnvelope({ opts: { unit: 'imperial' }, fields: { unit: '' } }, { fieldOpts: ['unit'] }))
      .toEqual({ opts: { unit: 'imperial' } });
  });

  it('strips QR text, SSID and Wi-Fi password from generator options and keeps the rest', () => {
    const out = reduceEnvelope(
      { options: { contentType: 'wifi', ssid: 'HomeNet', wifiPassword: 'hunter2', text: 'https://x', errorLevel: 'H', size: 512 } },
      LEGACY_RULES['qr-code-generator'],
    );
    expect(out).toEqual({ options: { contentType: 'wifi', errorLevel: 'H', size: 512 } });
    expect(JSON.stringify(out)).not.toMatch(/hunter2|HomeNet|https:\/\/x/);
  });

  it('drops the options bag when only free text was in it', () => {
    expect(reduceEnvelope({ options: { names: 'Ann\nBob' } }, LEGACY_RULES['random-name-picker'])).toBeNull();
  });

  it('returns null for nothing usable', () => {
    expect(reduceEnvelope(null, { keep: ['mode'] })).toBeNull();
    expect(reduceEnvelope(['x'], { keep: ['mode'] })).toBeNull();
    expect(reduceEnvelope({ input: 'x' }, { keep: ['mode'] })).toBeNull();
    expect(reduceEnvelope({ fields: 'bad' }, { fieldOpts: ['unit'] })).toBeNull();
  });
});

describe('clearLegacyInputs', () => {
  it('removes input-only envelopes, group envelopes, raw input keys and the body profile', () => {
    const local = new MemoryStore({
      'toytools:age-calculator': env({ fields: { dob: '1990-01-01' } }),
      'toytools:group:encoders': env({ input: 'shared secret' }),
      'toytools:csv-diff:b': env({ input: 'b,c' }),
      'toytools:json-tree-viewer': env({ input: '{"a":1}' }),
      'toytools.base64.input': 'aGVsbG8=',
      'toytools.file-hash-verifier.expected': 'abc123',
      'toytools.color-shades-generator.color': '#ff0000',
      'toytools:profile:body': JSON.stringify({ unit: 'metric', weight: 80 }),
    });
    const report = clearLegacyInputs(local, null);
    expect(local.length).toBe(0);
    expect(report.removed).toHaveLength(8);
  });

  it('rewrites mixed envelopes down to options, keeping the envelope version', () => {
    const local = new MemoryStore({
      'toytools:base64-encoder-decoder': env({ input: 'hello', mode: 'decode' }, 1),
      'toytools:sha256-hash-generator': env({ input: 'pw', mode: 'hash' }),
      'toytools:qr-code-generator': env({ options: { contentType: 'wifi', ssid: 'Net', wifiPassword: 'p@ss', errorLevel: 'Q' } }),
      'toytools:bmi-calculator': env({ fields: { unit: 'metric', weight: '70' }, history: [{ bmi: 22 }] }),
    });
    const report = clearLegacyInputs(local, null);
    expect(read(local, 'toytools:base64-encoder-decoder')).toEqual({ v: 1, data: { mode: 'decode' } });
    expect(read(local, 'toytools:sha256-hash-generator').data).toEqual({ mode: 'hash' });
    expect(read(local, 'toytools:qr-code-generator').data).toEqual({ options: { contentType: 'wifi', errorLevel: 'Q' } });
    expect(read(local, 'toytools:bmi-calculator').data).toEqual({ opts: { unit: 'metric' } });
    expect([...local.map.values()].join()).not.toMatch(/hello|p@ss|"Net"|"70"|history/);
    expect(report.rewritten).toHaveLength(4);
  });

  it('removes a mixed envelope with no option left, and leaves an already clean one alone', () => {
    const clean = env({ mode: 'decode' });
    const local = new MemoryStore({
      'toytools:url-encoder-decoder': env({ input: 'a b' }),
      'toytools:base64-encoder-decoder': clean,
    });
    const report = clearLegacyInputs(local, null);
    expect(local.getItem('toytools:url-encoder-decoder')).toBeNull();
    expect(local.getItem('toytools:base64-encoder-decoder')).toBe(clean);
    expect(report.rewritten).toEqual([]);
  });

  it('removes malformed values under a private tool key', () => {
    const local = new MemoryStore({
      'toytools:tax-calculator': '{not json',
      'toytools:margin-calculator': JSON.stringify({ data: { mode: 'x' } }),
    });
    clearLegacyInputs(local, null);
    expect(local.length).toBe(0);
  });

  it('never touches option-only generators, data tools, preferences or unrelated keys', () => {
    const untouched: Record<string, string> = {
      'toytools:password-generator': env({ options: { length: 24, symbols: true } }),
      'toytools:uuid-generator': env({ options: { count: 5 } }),
      'toytools:lorem-ipsum-generator': env({ options: { paragraphs: 3 } }),
      'toytools:coin-flip': env({ options: { count: 1 } }),
      'toytools:habit-tracker': env({ habits: [{ name: 'Run' }] }),
      'toytools:notepad': env({ text: 'my notes' }),
      'toytools:todo-list': env({ items: ['milk'] }),
      'toytools:body-weight-tracker': env({ entries: [{ kg: 80 }] }),
      'toytools:prefs': JSON.stringify({ currency: 'INR' }),
      'toytools:recent': JSON.stringify(['base64-encoder-decoder']),
      'toytools:favorites': JSON.stringify(['notepad']),
      theme: 'dark',
      'other-site-key': 'x',
    };
    const local = new MemoryStore(untouched);
    const session = new MemoryStore({ 'toytools:feedback': 'x', 'unrelated': 'y' });
    const report = clearLegacyInputs(local, session);
    expect(Object.fromEntries(local.map)).toEqual(untouched);
    expect(session.length).toBe(2);
    expect(report).toEqual({ removed: [], rewritten: [] });
  });

  it('removes every Recent conversions list from session storage', () => {
    const session = new MemoryStore({
      [`${LEGACY_HISTORY_PREFIX}group:encoders`]: '[{"input":"a"}]',
      [`${LEGACY_HISTORY_PREFIX}sha256-hash-generator`]: '[{"input":"pw"}]',
      keep: '1',
    });
    const report = clearLegacyInputs(null, session);
    expect([...session.map.keys()]).toEqual(['keep']);
    expect(report.removed).toHaveLength(2);
  });
});

describe('runLegacyCleanup', () => {
  it('cleans the real stores once and sets the mark', () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('toytools:age-calculator', env({ fields: { dob: '2000-02-02' } }));
    sessionStorage.setItem(`${LEGACY_HISTORY_PREFIX}x`, '[]');
    const report = runLegacyCleanup();
    expect(report?.removed).toEqual(['toytools:age-calculator', `${LEGACY_HISTORY_PREFIX}x`]);
    expect(localStorage.getItem(MARK)).toBe('1');
    expect(sessionStorage.length).toBe(0);
  });

  it('leaves the mark unset when the store throws, so the next load retries', () => {
    const store = new MemoryStore({ 'toytools:age-calculator': '1' });
    store.setItem = () => { throw new Error('QuotaExceededError'); };
    store.removeItem = () => { throw new Error('locked'); };
    const real = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { value: store, configurable: true });
    try {
      expect(runLegacyCleanup()).toBeNull();
      expect(store.getItem(MARK)).toBeNull();
    } finally {
      if (real) Object.defineProperty(globalThis, 'localStorage', real);
    }
  });

  it('does nothing without local storage', () => {
    const real = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('blocked'); }, configurable: true });
    try {
      expect(runLegacyCleanup()).toBeNull();
    } finally {
      if (real) Object.defineProperty(globalThis, 'localStorage', real);
    }
  });
});

describe('the frozen key lists', () => {
  const bySlug = new Map(tools.map((t) => [t.slug, t]));
  const isPrivate = (slug: string) => (bySlug.get(slug)?.trustVariant ?? 'private') === 'private';

  it('names only private tools, so no data tool can lose its saved data', () => {
    for (const slug of Object.keys(LEGACY_RULES)) {
      expect(bySlug.has(slug), slug).toBe(true);
      expect(isPrivate(slug), slug).toBe(true);
    }
    for (const id of LEGACY_INPUT_IDS) {
      if (id.startsWith('group:')) continue;
      const slug = id.replace(/:b$/, '');
      if (slug === 'case-converter') continue; // the retired combined page's envelope
      expect(bySlug.has(slug), id).toBe(true);
      expect(isPrivate(slug), id).toBe(true);
    }
  });

  it('names only groups whose every member is private', () => {
    const groups = new Map(toolGroups.map((g) => [g.id, g]));
    for (const id of LEGACY_INPUT_IDS.filter((x) => x.startsWith('group:'))) {
      const g = groups.get(id.slice('group:'.length));
      expect(g, id).toBeDefined();
      for (const { slug } of g!.members) expect(isPrivate(slug), `${id} member ${slug}`).toBe(true);
    }
  });

  it('has no key in two lists and no non-toytools raw key', () => {
    const ids = [...Object.keys(LEGACY_RULES), ...LEGACY_INPUT_IDS];
    expect(new Set(ids).size).toBe(ids.length);
    for (const k of LEGACY_RAW_KEYS) expect(k.startsWith('toytools')).toBe(true);
  });

  it('matches the literal the runtime gates the import on', () => {
    const src = readFileSync(path.resolve(__dirname, '../runtime/index.ts'), 'utf8');
    expect(src).toContain(`localStorage.getItem('${MARK}')`);
    expect(src).toContain("import('@lib/privacy/legacy-storage')");
  });
});

describe('completeness', () => {
  // The spec-named offenders (manual bug log, Phase B batches 1 and 2), seeded with every key each
  // of them wrote before beta-v12.4.2. Dropping any of them from the lists fails here.
  it('leaves no typed value behind for the eight reported tools', () => {
    const typed = 'zq-typed-marker';
    const local = new MemoryStore({
      'toytools:base64-encoder-decoder': env({ input: typed, mode: 'encode' }),
      'toytools.base64.input': typed,
      'toytools:url-encoder-decoder': env({ input: typed, mode: 'decode' }),
      'toytools:group:encoders': env({ input: typed }),
      'toytools:sha256-hash-generator': env({ input: typed }),
      'toytools:group:hash-generators': env({ input: typed }),
      'toytools:age-calculator': env({ fields: { birthDate: typed } }),
      'toytools:date-difference-calculator': env({ fields: { startDate: typed, endDate: typed } }),
      'toytools:title-case-converter': env({ input: typed }),
      'toytools:group:case-converters': env({ input: typed }),
      'toytools:color-format-converter': env({ input: typed }),
      'toytools:qr-code-generator': env({ options: { contentType: 'wifi', text: typed, ssid: typed, wifiPassword: typed, errorCorrection: 'M' } }),
    });
    const session = new MemoryStore({
      [`${LEGACY_HISTORY_PREFIX}base64-encoder-decoder`]: JSON.stringify([{ input: typed }]),
      [`${LEGACY_HISTORY_PREFIX}url-encoder-decoder`]: JSON.stringify([{ input: typed }]),
      [`${LEGACY_HISTORY_PREFIX}sha256-hash-generator`]: JSON.stringify([{ input: typed }]),
    });
    clearLegacyInputs(local, session);
    expect([...local.map.values(), ...session.map.values()].join()).not.toContain(typed);
    expect(session.length).toBe(0);
    expect(local.getItem('toytools:color-format-converter')).toBeNull();
    expect(local.getItem('toytools:title-case-converter')).toBeNull();
  });

  // Every private tool that existed at this release is classified: its key is rewritten (rules),
  // removed (input ids), or it is listed below with the reason it needs neither. A tool dropped
  // from the lists, or one added before this date without a decision, fails here.
  const RELEASE = '2026-10-06';
  const OPTION_ONLY = ['coin-flipper', 'lorem-ipsum-generator', 'password-generator', 'uuid-generator'];
  const RAW_KEY_ONLY = ['color-shades-generator', 'file-hash-verifier'];
  const NO_STATE = [
    'breathing-circle', 'character-map', 'chat-export-cleaner', 'context-fit-checker', 'encoding-detector',
    'gears', 'invisible-character-detector', 'json-schema-validator', 'kinetic-sand', 'llms-txt-generator',
    'pop-it', 'prompt-packer', 'slime', 'spinner', 'switch-board', 'type-scale-generator',
  ];

  it('classifies every private tool that existed at this release', () => {
    const covered = new Set<string>([
      ...Object.keys(LEGACY_RULES),
      ...LEGACY_INPUT_IDS,
      ...OPTION_ONLY,
      ...RAW_KEY_ONLY,
      ...NO_STATE,
    ]);
    const missing = tools
      .filter((t) => (t.trustVariant ?? 'private') === 'private')
      .filter((t) => !t.addedOn || t.addedOn <= RELEASE)
      .map((t) => t.slug)
      .filter((slug) => !covered.has(slug));
    expect(missing).toEqual([]);
  });

  it('keeps the exemptions honest: none of them is also in the lists', () => {
    const listed = new Set<string>([...Object.keys(LEGACY_RULES), ...LEGACY_INPUT_IDS]);
    for (const slug of [...OPTION_ONLY, ...RAW_KEY_ONLY, ...NO_STATE]) expect(listed.has(slug), slug).toBe(false);
    expect(LEGACY_RAW_KEYS).toContain('toytools.color-shades-generator.color');
    expect(LEGACY_RAW_KEYS).toContain('toytools.file-hash-verifier.expected');
  });
});
