import { describe, it, expect } from 'vitest';
import { runJwt, JWT_TOOLS } from './registry';
import { decodeJwt } from './decode';

// Helper: build a compact JWT from header/payload objects (signature is a fixed dummy — never
// verified). base64url-encode mirrors the decoder: btoa(UTF-8) then +/→-/_ and strip padding.
function b64url(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function makeToken(header: unknown, payload: unknown, sig = 'sigsig'): string {
  return `${b64url(header)}.${b64url(payload)}.${sig}`;
}

// --- Registry resolver ---

describe('runJwt', () => {
  it('decodes a valid token through the resolver', () => {
    const token = makeToken({ alg: 'HS256', typ: 'JWT' }, { sub: '42' });
    const r = runJwt('jwt-decoder', token);
    expect(r.ok).toBe(true);
    expect(r.decoded?.algorithm).toBe('HS256');
  });
  it('reports an unknown tool id without throwing', () => {
    const r = runJwt('nope', 'a.b.c');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/unknown/i);
  });
  it('captures a decode failure as a result error (does not throw)', () => {
    const r = runJwt('jwt-decoder', 'only.two');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/3 segments/i);
  });
  it('exposes a working sample token', () => {
    const r = runJwt('jwt-decoder', JWT_TOOLS['jwt-decoder'].sample!);
    expect(r.ok).toBe(true);
    expect(r.decoded?.type).toBe('JWT');
  });
});

// --- decodeJwt ---

describe('decodeJwt', () => {
  it('pretty-prints header and payload JSON', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256', typ: 'JWT' }, { name: 'Ada' }));
    expect(d.headerJson).toContain('\n');
    expect(JSON.parse(d.payloadJson).name).toBe('Ada');
  });

  it('keeps the raw signature segment', () => {
    expect(decodeJwt(makeToken({ alg: 'none' }, {}, 'abc123')).signature).toBe('abc123');
  });

  it('falls back to "unknown" for a missing alg/typ', () => {
    const d = decodeJwt(makeToken({}, {}));
    expect(d.algorithm).toBe('unknown');
    expect(d.type).toBe('unknown');
  });

  it('humanizes registered time claims in canonical order', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { iat: 1516239022, exp: 1516242622, sub: '1' }));
    const keys = d.claims.map(c => c.key);
    expect(keys).toEqual(['sub', 'exp', 'iat']); // canonical: sub, exp, iat
    const exp = d.claims.find(c => c.key === 'exp')!;
    expect(exp.human).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('flags an expired token', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const exp = decodeJwt(makeToken({ alg: 'HS256' }, { exp: past })).claims.find(c => c.key === 'exp')!;
    expect(exp.expired).toBe(true);
    expect(exp.human).toMatch(/ago/);
  });

  it('does not flag a future token as expired', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const exp = decodeJwt(makeToken({ alg: 'HS256' }, { exp: future })).claims.find(c => c.key === 'exp')!;
    expect(exp.expired).toBe(false);
    expect(exp.human).toMatch(/in /);
  });

  it('decodes base64url with - and _ and missing padding', () => {
    // Payload chosen so its base64 contains + and / (→ - and _) and needs padding.
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { data: '<<???>>ÿþ' }));
    expect(JSON.parse(d.payloadJson).data).toBe('<<???>>ÿþ');
  });

  it('throws on the wrong segment count', () => {
    expect(() => decodeJwt('a.b')).toThrow(/3 segments/i);
    expect(() => decodeJwt('a.b.c.d')).toThrow(/3 segments/i);
  });

  it('throws a specific error for a non-JSON payload segment', () => {
    const header = b64url({ alg: 'HS256' });
    const badPayload = btoa('not json at all').replace(/=+$/g, '');
    expect(() => decodeJwt(`${header}.${badPayload}.sig`)).toThrow(/payload.*valid JSON/i);
  });

  it('throws for an empty token', () => {
    expect(() => decodeJwt('')).toThrow(/3 segments/i);
  });

  // --- sanitize (#1 / #11) ---

  it('strips a Bearer prefix before decoding', () => {
    const token = 'Bearer ' + makeToken({ alg: 'HS256' }, { sub: 'x' });
    expect(decodeJwt(token).claims.find(c => c.key === 'sub')!.value).toBe('x');
  });

  it('strips wrapping quotes and internal whitespace (line-wrapped token)', () => {
    const t = makeToken({ alg: 'HS256' }, { sub: 'y' });
    const wrapped = '"' + t.slice(0, 10) + '\n' + t.slice(10) + '"';
    expect(decodeJwt(wrapped).claims.find(c => c.key === 'sub')!.value).toBe('y');
  });

  // --- actionable errors (#12) ---

  it('reports the segment count in the error', () => {
    expect(() => decodeJwt('a.b')).toThrow(/Found 2 segments/i);
    expect(() => decodeJwt('')).toThrow(/Found 0 segments/i);
  });

  // --- all claims, registered flag, custom claims (#3 / #6 / #10) ---

  it('includes custom claims with registered:false after the registered ones', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { role: 'admin', sub: '1', 'permissions': { admin: true } }));
    expect(d.claimCount).toBe(3);
    expect(d.claims[0].key).toBe('sub');            // registered first
    const role = d.claims.find(c => c.key === 'role')!;
    expect(role.registered).toBe(false);
    expect(role.kind).toBe('scalar');
    const perms = d.claims.find(c => c.key === 'permissions')!;
    expect(perms.kind).toBe('json');
  });

  it('attaches a description to registered claims only', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { aud: 'api', custom: 1 }));
    expect(d.claims.find(c => c.key === 'aud')!.description).toMatch(/audience/i);
    expect(d.claims.find(c => c.key === 'custom')!.description).toBeUndefined();
  });

  // --- time claim enrichment (#5) ---

  it('enriches time claims with epoch and absolute UTC', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { iat: 1516239022 }));
    const iat = d.claims.find(c => c.key === 'iat')!;
    expect(iat.epoch).toBe(1516239022);
    expect(iat.isoUtc).toMatch(/\d{2} \w{3} \d{4} \d{2}:\d{2} UTC/);
  });

  it('exposes raw epoch times for the validity panel', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { iat: 1000, exp: 2000 }));
    expect(d.times).toEqual({ iat: 1000, exp: 2000 });
  });

  // --- structural insights (#7) ---

  it('warns when the token never expires and notes a jti', () => {
    const d = decodeJwt(makeToken({ alg: 'HS256' }, { jti: 'abc' }));
    expect(d.insights.some(i => i.tone === 'warn' && /never expires/i.test(i.text))).toBe(true);
    expect(d.insights.some(i => /JWT ID/i.test(i.text))).toBe(true);
  });

  it('warns when alg is none', () => {
    const d = decodeJwt(makeToken({ alg: 'none' }, { exp: 9999999999 }));
    expect(d.insights.some(i => i.tone === 'warn' && /unsigned|none/i.test(i.text))).toBe(true);
  });
});
