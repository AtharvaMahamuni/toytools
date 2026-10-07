import { describe, expect, it } from 'vitest';
import { runNetwork } from './registry';
import { formatBinary, formatHex, parseIPv4Literal } from './ipv4-literal';

describe('parseIPv4Literal', () => {
  it('reads a dotted address and keeps eight hex digits', () => {
    const parsed = parseIPv4Literal('192.168.0.1');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.addr).toBe(3232235521);
    expect(parsed.value.glued).toBeNull();
    expect(formatHex(parsed.value.addr)).toBe('0xC0A80001');
    expect(formatBinary(parsed.value.addr)).toBe('11000000.10101000.00000000.00000001');
  });

  it('rejects a leading zero instead of dropping it or reading octal', () => {
    const parsed = parseIPv4Literal('010.0.0.1');
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain('010');
    expect(parsed.mapped).toBeUndefined();
    const mapped = parseIPv4Literal('::ffff:192.168.01.01');
    expect(mapped.ok).toBe(false);
    if (mapped.ok) return;
    expect(mapped.error).toContain('01');
    expect(mapped.mapped).toBeUndefined();
  });

  it('rejects an octet above 255 and does not offer a replacement', () => {
    const parsed = parseIPv4Literal('256.1.1.1');
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain('256');
    expect(parsed.mapped).toBeUndefined();
  });

  it('refuses a bare IPv6 address instead of truncating it', () => {
    const parsed = parseIPv4Literal('2001:db8::1');
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain('IPv6');
    expect(parsed.mapped).toBeUndefined();
  });

  it('names the IPv4 address inside a mapped IPv6 value', () => {
    const dotted = parseIPv4Literal('::ffff:192.0.2.1');
    expect(dotted.ok).toBe(false);
    if (dotted.ok) return;
    expect(dotted.mapped).toBe('192.0.2.1');

    const hex = parseIPv4Literal('::ffff:c000:0201');
    expect(hex.ok).toBe(false);
    if (hex.ok) return;
    expect(hex.mapped).toBe('192.0.2.1');
  });

  it('treats 8888 as an integer and records the one glued reading', () => {
    const parsed = parseIPv4Literal('8888');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.glued?.unique).toBe('8.8.8.8');
  });

  it('does not guess when 19216811 has more than one glued reading', () => {
    const parsed = parseIPv4Literal('19216811');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.glued?.unique).toBeNull();
    expect(parsed.value.glued!.splits.length).toBeGreaterThan(1);
    expect(parsed.value.glued!.splits).toContain('192.168.1.1');
  });

  it('stays quiet for the decimal form of 192.168.0.1', () => {
    const parsed = parseIPv4Literal('3232235521');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.glued).toBeNull();
  });
});

describe('ipv4 calculator', () => {
  it('shows dotted, decimal, padded hex, and binary for 192.168.0.1', () => {
    const res = runNetwork('ipv4', { address: '192.168.0.1' });
    expect(res.uiState).toBe('success');
    expect(res.hero?.value).toBe('192.168.0.1');
    expect(res.metrics.find(m => m.id === 'decimal')?.value).toBe('3232235521');
    expect(res.metrics.find(m => m.id === 'hex')?.value).toBe('0xC0A80001');
    expect(res.meta?.craftApplyValue).toBeUndefined();
  });

  it('offers 8.8.8.8 for the integer 8888 and stays quiet after that address is dotted', () => {
    const glued = runNetwork('ipv4', { address: '8888' });
    expect(glued.hero?.value).toBe('0.0.34.184');
    expect(glued.meta?.craftApplyValue).toBe('8.8.8.8');
    const dotted = runNetwork('ipv4', { address: '8.8.8.8' });
    expect(dotted.hero?.value).toBe('8.8.8.8');
    expect(dotted.meta?.craftApplyValue).toBeUndefined();
  });

  it('offers the embedded address for mapped IPv6 and refuses a plain IPv6 paste', () => {
    const mapped = runNetwork('ipv4', { address: '::ffff:192.0.2.1' });
    expect(mapped.uiState).toBe('validation-error');
    expect(mapped.meta?.craftApplyValue).toBe('192.0.2.1');
    const v6 = runNetwork('ipv4', { address: '2001:db8::1' });
    expect(v6.uiState).toBe('validation-error');
    expect(v6.meta?.craftApplyValue).toBeUndefined();
    expect(v6.error).toContain('not cut down');
  });

  it('reads hex and binary back to the same dotted address', () => {
    expect(runNetwork('ipv4', { address: '0xC0A80001' }).hero?.value).toBe('192.168.0.1');
    expect(runNetwork('ipv4', { address: '11000000.10101000.00000000.00000001' }).hero?.value).toBe('192.168.0.1');
  });
});
