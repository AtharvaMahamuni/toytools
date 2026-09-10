import { describe, expect, it } from 'vitest';
import {
  classifyIPv4,
  classifyIPv4String,
  intToIp,
  ipToInt,
  kindLabel,
  looksLikeIPv6,
  maskToPrefix,
  parseDotted,
  parseIPv4Network,
  prefixToMask,
  subnetFrom,
} from './models';

describe('IPv4 integers', () => {
  it('round-trips dotted addresses including 0.0.0.0 and 255.255.255.255', () => {
    expect(intToIp(ipToInt(192, 168, 1, 1))).toBe('192.168.1.1');
    expect(intToIp(0)).toBe('0.0.0.0');
    expect(intToIp(0xffffffff)).toBe('255.255.255.255');
  });

  it('rejects octets outside 0-255', () => {
    expect(parseDotted('256.0.0.1').ok).toBe(false);
    expect(parseDotted('1.2.3').ok).toBe(false);
  });
});

describe('masks', () => {
  it('maps prefix 0, 24 and 32 to contiguous masks', () => {
    expect(intToIp(prefixToMask(0))).toBe('0.0.0.0');
    expect(intToIp(prefixToMask(24))).toBe('255.255.255.0');
    expect(intToIp(prefixToMask(32))).toBe('255.255.255.255');
  });

  it('clamps a prefix below 0 or above 32 to the all-zero and all-one masks', () => {
    expect(intToIp(prefixToMask(-1))).toBe('0.0.0.0');
    expect(intToIp(prefixToMask(40))).toBe('255.255.255.255');
  });

  it('reads prefix 0 back from the all-zero mask', () => {
    expect(maskToPrefix(0)).toBe(0);
  });

  it('rejects a mask with a hole in the bits', () => {
    const hole = parseDotted('255.0.255.0');
    expect(hole.ok).toBe(true);
    if (hole.ok) expect(maskToPrefix(hole.value)).toBeNull();
  });
});

describe('parseIPv4Network', () => {
  it('reads CIDR, dotted mask, wildcard, and a bare host', () => {
    const cidr = parseIPv4Network('192.168.1.50/24');
    expect(cidr.ok).toBe(true);
    if (cidr.ok) {
      expect(cidr.value.prefix).toBe(24);
      expect(cidr.value.source).toBe('cidr');
    }
    const mask = parseIPv4Network('10.0.0.1 255.255.0.0');
    expect(mask.ok).toBe(true);
    if (mask.ok) {
      expect(mask.value.prefix).toBe(16);
      expect(mask.value.source).toBe('mask');
    }
    const wild = parseIPv4Network('10.0.0.1 0.0.0.255');
    expect(wild.ok).toBe(true);
    if (wild.ok) {
      expect(wild.value.prefix).toBe(24);
      expect(wild.value.source).toBe('wildcard');
    }
    const host = parseIPv4Network('8.8.8.8');
    expect(host.ok).toBe(true);
    if (host.ok) {
      expect(host.value.prefix).toBe(32);
      expect(host.value.source).toBe('host');
    }
  });

  it('reads a dotted mask after the slash the same way as a space-separated pair', () => {
    const slashMask = parseIPv4Network('10.0.0.1/255.255.0.0');
    expect(slashMask.ok).toBe(true);
    if (slashMask.ok) {
      expect(slashMask.value.prefix).toBe(16);
      expect(slashMask.value.source).toBe('mask');
    }
  });

  it('rejects IPv6, a non-contiguous mask, an empty string, a prefix past 32, and junk', () => {
    expect(parseIPv4Network('2001:db8::1').ok).toBe(false);
    expect(parseIPv4Network('10.0.0.1 255.0.255.0').ok).toBe(false);
    expect(parseIPv4Network('10.0.0.1/255.0.255.0').ok).toBe(false);
    expect(parseIPv4Network('').ok).toBe(false);
    expect(parseIPv4Network('   ').ok).toBe(false);
    expect(parseIPv4Network('10.0.0.1/33').ok).toBe(false);
    expect(parseIPv4Network('not-an-address').ok).toBe(false);
  });

  it('treats commas as spaces so 192.168.1.0,/24 still parses', () => {
    const parsed = parseIPv4Network('192.168.1.0,/24');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.value.prefix).toBe(24);
  });
});

describe('subnetFrom', () => {
  it('normalises a host in a /24 and reports the host bits', () => {
    const parsed = parseIPv4Network('192.168.1.50/24');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const net = subnetFrom(parsed.value);
    expect(intToIp(net.network)).toBe('192.168.1.0');
    expect(intToIp(net.broadcast)).toBe('192.168.1.255');
    expect(intToIp(net.firstUsable)).toBe('192.168.1.1');
    expect(intToIp(net.lastUsable)).toBe('192.168.1.254');
    expect(net.usable).toBe(254);
    expect(net.hostWasNetwork).toBe(false);
  });

  it('keeps both addresses on a /31 and the single host on a /32', () => {
    const p31 = parseIPv4Network('10.0.0.0/31');
    expect(p31.ok).toBe(true);
    if (p31.ok) {
      const net = subnetFrom(p31.value);
      expect(net.rfc3021).toBe(true);
      expect(net.usable).toBe(2);
      expect(intToIp(net.firstUsable)).toBe('10.0.0.0');
      expect(intToIp(net.lastUsable)).toBe('10.0.0.1');
    }
    const p32 = parseIPv4Network('8.8.8.8/32');
    expect(p32.ok).toBe(true);
    if (p32.ok) {
      const net = subnetFrom(p32.value);
      expect(net.hostRoute).toBe(true);
      expect(net.usable).toBe(1);
      expect(intToIp(net.network)).toBe('8.8.8.8');
    }
  });

  it('covers the whole IPv4 space on /0', () => {
    const parsed = parseIPv4Network('0.0.0.0/0');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const net = subnetFrom(parsed.value);
    expect(intToIp(net.network)).toBe('0.0.0.0');
    expect(intToIp(net.broadcast)).toBe('255.255.255.255');
    expect(net.usable).toBe(2 ** 32 - 2);
  });
});

describe('classifyIPv4', () => {
  it('names RFC 1918, CGNAT, loopback and public', () => {
    expect(classifyIPv4(ipToInt(10, 0, 0, 1))).toBe('private');
    expect(classifyIPv4(ipToInt(172, 16, 5, 1))).toBe('private');
    expect(classifyIPv4(ipToInt(192, 168, 0, 1))).toBe('private');
    expect(classifyIPv4(ipToInt(100, 64, 0, 1))).toBe('cgnat');
    expect(classifyIPv4(ipToInt(127, 0, 0, 1))).toBe('loopback');
    expect(classifyIPv4(ipToInt(8, 8, 8, 8))).toBe('public');
    expect(classifyIPv4String('169.254.1.1')).toBe('link-local');
  });

  it('names broadcast, unspecified, multicast and reserved', () => {
    expect(classifyIPv4(0xffffffff)).toBe('broadcast');
    expect(classifyIPv4(0)).toBe('unspecified');
    expect(classifyIPv4(ipToInt(224, 0, 0, 1))).toBe('multicast');
    expect(classifyIPv4(ipToInt(240, 0, 0, 1))).toBe('reserved');
  });

  it('returns null for a string that is not dotted IPv4', () => {
    expect(classifyIPv4String('not-an-ip')).toBeNull();
    expect(kindLabel('cgnat')).toContain('CGNAT');
    expect(kindLabel('broadcast')).toBe('limited broadcast');
  });
});

describe('looksLikeIPv6', () => {
  it('accepts a compressed v6 and rejects dotted v4', () => {
    expect(looksLikeIPv6('2001:db8::1')).toBe(true);
    expect(looksLikeIPv6('192.168.1.1')).toBe(false);
  });

  it('rejects a single-colon token and a string with non-hex characters', () => {
    expect(looksLikeIPv6('a:b')).toBe(false);
    expect(looksLikeIPv6('gggg::1')).toBe(false);
  });
});
