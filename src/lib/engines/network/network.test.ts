import { describe, expect, it, vi } from 'vitest';
import { NETWORK_CALCULATORS, getNetworkCalculator, networkApi, networkFields, runNetwork } from './registry';
import { NETWORK_EXAMPLES, networkExamplesFor } from './examples';
import { LOOKUP_DISCLOSURE, lookupCraft, lookupPublic } from './lookup';
import { decisions, insight, toolDecision } from './story';
import type { InteractiveResult } from '@lib/results/types';

function cardRaw(result: InteractiveResult, id: string): number | undefined {
  if (result.hero?.id === id) return result.hero.raw;
  return result.metrics.find((c) => c.id === id)?.raw;
}

function cardValue(result: InteractiveResult, id: string): string | undefined {
  if (result.hero?.id === id) return result.hero.value;
  return result.metrics.find((c) => c.id === id)?.value;
}

describe('network registry', () => {
  it('every calculator exposes fields and a calculate()', () => {
    for (const [id, calc] of Object.entries(NETWORK_CALCULATORS)) {
      expect(calc.id).toBe(id);
      expect(networkFields(id).length).toBeGreaterThan(0);
      expect(typeof calc.calculate).toBe('function');
    }
  });

  it('unknown ids surface as calculation errors, never exceptions', () => {
    expect(runNetwork('nope', {}).uiState).toBe('calculation-error');
    expect(networkFields('nope')).toEqual([]);
    expect(getNetworkCalculator('cidr')?.id).toBe('cidr');
    expect(getNetworkCalculator('nope')).toBeUndefined();
  });

  it('turns a throwing calculator into a calculation error', () => {
    const orig = NETWORK_CALCULATORS.cidr;
    NETWORK_CALCULATORS.cidr = {
      ...orig,
      calculate() {
        throw new Error('boom');
      },
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(runNetwork('cidr', { cidr: '10.0.0.0/24' }).uiState).toBe('calculation-error');
    } finally {
      NETWORK_CALCULATORS.cidr = orig;
      warn.mockRestore();
    }
  });

  it('exposes the lookup helpers on the browser namespace', () => {
    expect(networkApi.disclosure).toBe(LOOKUP_DISCLOSURE);
    expect(networkApi.classifyIPv4('8.8.8.8')).toBe('public');
  });
});

describe('worked examples', () => {
  it.each(NETWORK_EXAMPLES.map((e) => [e.id, e] as const))('%s reproduces its expected values', (_id, ex) => {
    const res = runNetwork(ex.ref, ex.inputs, {});
    expect(res.uiState).toBe('success');
    for (const [cardId, raw] of Object.entries(ex.expect ?? {})) {
      expect(cardRaw(res, cardId), cardId).toBe(raw);
    }
  });

  it('lists the cidr examples for the widget and none for an unknown ref', () => {
    expect(networkExamplesFor('cidr').length).toBeGreaterThan(0);
    expect(networkExamplesFor('nope')).toEqual([]);
  });
});

describe('cidr calculator', () => {
  it('names the network as the hero and lists mask, wildcard and usable range', () => {
    const res = runNetwork('cidr', { cidr: '192.168.1.0/24' }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.value).toBe('192.168.1.0/24');
    expect(cardValue(res, 'mask')).toBe('255.255.255.0');
    expect(cardValue(res, 'wildcard')).toBe('0.0.0.255');
    expect(cardValue(res, 'first')).toBe('192.168.1.1');
    expect(cardValue(res, 'last')).toBe('192.168.1.254');
    expect(cardValue(res, 'broadcast')).toBe('192.168.1.255');
  });

  it('offers to replace a host address with the network, and stays silent on the network itself', () => {
    const host = runNetwork('cidr', { cidr: '192.168.1.50/24' }, {});
    expect(host.meta?.craftApplyValue).toBe('192.168.1.0/24');
    expect(String(host.meta?.craftLabel)).toContain('192.168.1.0/24');
    const network = runNetwork('cidr', { cidr: '192.168.1.0/24' }, {});
    expect(network.meta?.craftApplyValue).toBeUndefined();
  });

  it('does not subtract two hosts on /31 or /32', () => {
    expect(cardRaw(runNetwork('cidr', { cidr: '10.0.0.0/31' }, {}), 'usable')).toBe(2);
    expect(cardValue(runNetwork('cidr', { cidr: '10.0.0.0/31' }, {}), 'broadcast')).toBe('none');
    expect(cardRaw(runNetwork('cidr', { cidr: '8.8.8.8/32' }, {}), 'usable')).toBe(1);
  });

  it('rejects empty input, IPv6, and a holey mask without throwing', () => {
    expect(runNetwork('cidr', { cidr: '' }, {}).uiState).toBe('validation-error');
    expect(runNetwork('cidr', { cidr: '2001:db8::/32' }, {}).uiState).toBe('validation-error');
    expect(runNetwork('cidr', { cidr: '10.0.0.1 255.0.255.0' }, {}).uiState).toBe('validation-error');
  });
});

describe('lookupPublic', () => {
  it('reads v4 and v6 from the echo JSON', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      const ip = String(url).includes('api64') ? '2001:db8::1' : '8.8.8.8';
      return { ok: true, json: async () => ({ ip }) };
    });
    const res = await lookupPublic(fetchImpl);
    expect(res.ipv4).toBe('8.8.8.8');
    expect(res.ipv6).toBe('2001:db8::1');
    expect(res.error).toBeUndefined();
  });

  it('takes v4 from the second echo when the first one is v6', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      const ip = String(url).includes('api64') ? '1.1.1.1' : '2001:db8::1';
      return { ok: true, json: async () => ({ ip }) };
    });
    const res = await lookupPublic(fetchImpl);
    expect(res.ipv4).toBe('1.1.1.1');
    expect(res.ipv6).toBe('2001:db8::1');
  });

  it('forwards an abort signal and treats a non-ok or empty body as a miss', async () => {
    const signal = new AbortController().signal;
    const fetchImpl = vi.fn(async (url: string, init?: { signal?: AbortSignal }) => {
      expect(init?.signal).toBe(signal);
      if (String(url).includes('api64')) return { ok: false, json: async () => ({ ip: '8.8.8.8' }) };
      return { ok: true, json: async () => ({ ip: '  ' }) };
    });
    const res = await lookupPublic(fetchImpl, signal);
    expect(res.error).toBeTruthy();
  });

  it('returns an error when both echoes fail', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('offline');
    });
    const res = await lookupPublic(fetchImpl);
    expect(res.error).toBeTruthy();
    expect(res.ipv4).toBeUndefined();
  });

  it('returns an error when the body has no ip field', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    const res = await lookupPublic(fetchImpl);
    expect(res.error).toBeTruthy();
  });
});

describe('lookupCraft', () => {
  it('warns on CGNAT and stays silent on a plain public v4-only result', () => {
    expect(lookupCraft({ ipv4: '100.64.0.10' })?.kind).toBe('cgnat');
    expect(lookupCraft({ ipv4: '8.8.8.8' })).toBeNull();
  });

  it('names dual-stack and v6-only so the wrong family is not copied', () => {
    expect(lookupCraft({ ipv4: '8.8.8.8', ipv6: '2001:db8::1' })?.kind).toBe('dual-stack');
    expect(lookupCraft({ ipv6: '2001:db8::1' })?.kind).toBe('ipv6-only');
  });

  it('names a private, loopback or link-local echo so it is not copied as public', () => {
    expect(lookupCraft({ ipv4: '10.0.0.1' })?.kind).toBe('private');
    expect(lookupCraft({ ipv4: '127.0.0.1' })?.kind).toBe('loopback');
    expect(lookupCraft({ ipv4: '169.254.1.1' })?.kind).toBe('link-local');
  });

  it('stays silent when the lookup failed or the v4 string is not an address', () => {
    expect(lookupCraft({ error: 'offline' })).toBeNull();
    expect(lookupCraft({ ipv4: 'not-an-ip' })).toBeNull();
    expect(lookupCraft({})).toBeNull();
  });
});

describe('story helpers', () => {
  it('drops a decision whose slug is not on this engine', () => {
    expect(toolDecision('Nope', 'no-such-tool')).toBeNull();
    const kept = decisions([toolDecision('See the public address', 'what-is-my-ip'), null]);
    expect(kept).toHaveLength(1);
    expect(kept[0]?.href).toContain('what-is-my-ip');
    expect(insight('A note').tone).toBe('info');
  });
});
