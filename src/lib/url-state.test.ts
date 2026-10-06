import { describe, it, expect } from 'vitest';
import { urlStateMode, allowsUrlState, autoSyncsUrlState, toolUrlStateMode } from './url-state';
import { tools } from '@data/registry';

describe('urlStateMode', () => {
  it('never shares anything from a tool whose input may be a secret', () => {
    expect(urlStateMode('jwt', 'token-decode')).toBe('off');
    expect(urlStateMode('hashing', 'hash')).toBe('off');
    expect(urlStateMode('encoding', 'encode-decode')).toBe('off');
    expect(urlStateMode('generation', 'generate-credential')).toBe('off');
  });

  it('requires an explicit action for personal or pasted content', () => {
    expect(urlStateMode('wellness', 'health-calculate')).toBe('manual');
    expect(urlStateMode('tracker', 'health-track')).toBe('manual');
    expect(urlStateMode('text-analysis', 'text-metric')).toBe('manual');
    expect(urlStateMode('csv', 'csv-transform')).toBe('manual');
  });

  it('auto-syncs short structured calculators', () => {
    expect(urlStateMode('finance', 'finance-growth')).toBe('auto');
    expect(urlStateMode('math', 'math-calculate')).toBe('auto');
    expect(urlStateMode('datetime', 'datetime-calculate')).toBe('auto');
    expect(urlStateMode('units', 'unit-convert')).toBe('auto');
  });

  it('treats a health pattern as personal whatever engine carries it', () =>
    expect(urlStateMode('calculator', 'health-calculate')).toBe('manual'));

  it('defaults to auto when a tool declares no engine metadata', () =>
    expect(urlStateMode()).toBe('auto'));
});

describe('toolUrlStateMode', () => {
  it('turns auto into manual on a private page, including the default variant', () => {
    expect(toolUrlStateMode({ engine: 'finance', pattern: 'finance-growth' })).toBe('manual');
    expect(toolUrlStateMode({ engine: 'datetime', trustVariant: 'private' })).toBe('manual');
  });

  it('leaves other variants and the off and manual modes alone', () => {
    expect(toolUrlStateMode({ engine: 'finance', trustVariant: 'local' })).toBe('auto');
    expect(toolUrlStateMode({ engine: 'math', trustVariant: 'offline' })).toBe('auto');
    expect(toolUrlStateMode({ engine: 'jwt', trustVariant: 'private' })).toBe('off');
    expect(toolUrlStateMode({ engine: 'jwt', trustVariant: 'local' })).toBe('off');
    expect(toolUrlStateMode({ engine: 'wellness', trustVariant: 'local' })).toBe('manual');
  });
});

describe('allowsUrlState / autoSyncsUrlState', () => {
  it('allows a link for auto and manual, never for off', () => {
    expect(allowsUrlState('finance')).toBe(true);
    expect(allowsUrlState('wellness')).toBe(true);
    expect(allowsUrlState('jwt')).toBe(false);
  });

  it('only lets auto tools write to location themselves', () => {
    expect(autoSyncsUrlState('finance')).toBe(true);
    expect(autoSyncsUrlState('wellness')).toBe(false);
    expect(autoSyncsUrlState('jwt')).toBe(false);
  });
});

// The whole point of deriving this from engine/pattern is that the registry stays covered without
// a slug list. This asserts the outcome over the real catalog rather than the rule in isolation.
describe('the live catalog', () => {
  const modeOf = (slug: string) => {
    const tool = tools.find(t => t.slug === slug)!;
    expect(tool, `no tool "${slug}"`).toBeTruthy();
    return urlStateMode(tool.engine, tool.pattern);
  };

  it('never shares from any hash, encoder, JWT or credential tool', () => {
    for (const tool of tools) {
      const sensitive =
        tool.engine === 'jwt' ||
        tool.engine === 'hashing' ||
        tool.engine === 'encoding' ||
        tool.pattern === 'generate-credential';
      if (sensitive) {
        expect(urlStateMode(tool.engine, tool.pattern), `${tool.slug} must be off`).toBe('off');
      }
    }
  });

  it('classes the money and date calculators as shareable', () => {
    expect(modeOf('compound-interest-calculator')).toBe('auto');
    expect(modeOf('sip-calculator')).toBe('auto');
    expect(modeOf('discount-calculator')).toBe('auto');
    expect(modeOf('date-difference-calculator')).toBe('auto');
  });

  // beta-v12.4.2: a private page ("Nothing stored unless you choose to save it") never writes what
  // was typed into the address bar, where a reload would refill it. Copy link stays.
  it('never auto-syncs a private tool page; shareable ones become explicit Copy link', () => {
    const autoPrivate: string[] = [];
    for (const tool of tools) {
      const mode = toolUrlStateMode(tool);
      if ((tool.trustVariant ?? 'private') === 'private') {
        expect(mode, `${tool.slug} is private`).not.toBe('auto');
        if (urlStateMode(tool.engine, tool.pattern) === 'auto' && mode === 'manual') autoPrivate.push(tool.slug);
      } else {
        expect(mode).toBe(urlStateMode(tool.engine, tool.pattern));
      }
    }
    for (const slug of ['age-calculator', 'date-difference-calculator', 'sip-calculator', 'cidr-calculator',
      'matrix-calculator', 'equalizer-settings-generator', 'unix-timestamp-converter']) {
      expect(autoPrivate, slug).toContain(slug);
    }
  });

  it('keeps every health tool on an explicit action', () => {
    expect(modeOf('bmi-calculator')).toBe('manual');
    expect(modeOf('body-fat-calculator')).toBe('manual');
    expect(modeOf('body-weight-tracker')).toBe('manual');
  });

  it('keeps password and token tools off entirely', () => {
    expect(modeOf('password-generator')).toBe('off');
    expect(modeOf('jwt-decoder')).toBe('off');
    expect(modeOf('sha256-hash-generator')).toBe('off');
    expect(modeOf('base64-encoder-decoder')).toBe('off');
  });
});
