// Phase C item 11: JSON Diff no longer saves its panes, and the legacy cleanup removes the old key.
import { describe, it, expect } from 'vitest';
import { clearLegacyInputs, LEGACY_INPUT_IDS, KEEP_INPUT_KEYS, type KeyValueStore } from './legacy-storage';
import { config } from '@tools/developer-utilities/json-diff/config';

function store(init: Record<string, string>): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(init));
  return {
    data,
    get length() { return data.size; },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => { data.set(k, v); },
    removeItem: (k) => { data.delete(k); },
  };
}

describe('JSON Diff storage (item 11)', () => {
  it('is a private page that does not keep input', () => {
    expect(config.trustVariant ?? 'private').toBe('private');
    expect(config.keepInput).not.toBe(true);
    expect(KEEP_INPUT_KEYS).not.toContain('json-diff');
  });

  it('the legacy cleanup removes the saved panes', () => {
    expect(LEGACY_INPUT_IDS).toContain('json-diff');
    const local = store({ 'toytools:json-diff': JSON.stringify({ v: 1, data: { left: '{"a":1}', right: '{"a":2}' } }), 'toytools:theme': 'dark' });
    const report = clearLegacyInputs(local, null);
    expect(report.removed).toContain('toytools:json-diff');
    expect(local.data.has('toytools:json-diff')).toBe(false);
    expect(local.data.get('toytools:theme')).toBe('dark');
  });
});
