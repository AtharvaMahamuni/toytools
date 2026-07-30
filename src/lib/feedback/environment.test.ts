import { describe, it, expect } from 'vitest';
import { describeEnvironment, detectBrowser, detectPlatform, formatTime } from './environment';

// Real user-agent strings. They are quoted verbatim because the whole difficulty of this
// function is that browsers deliberately impersonate each other, and a paraphrased string
// would not exercise that.
const AGENTS = {
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  edgeWindows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  chromeIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.0.0 Mobile/15E148 Safari/604.1',
  firefoxLinux:
    'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  operaWindows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0',
  samsungAndroid:
    'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
  ipad:
    'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  chromebook:
    'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

describe('detectBrowser', () => {
  // Every one of these strings also contains "Safari", and most contain "Chrome", so these
  // cases are what prove the most-specific-token-first ordering is right.
  it.each([
    ['Chrome on Android', AGENTS.chromeAndroid, 'Chrome'],
    ['Edge, which claims to be Chrome', AGENTS.edgeWindows, 'Edge'],
    ['Opera, which also claims to be Chrome', AGENTS.operaWindows, 'Opera'],
    ['Samsung Internet, likewise', AGENTS.samsungAndroid, 'Samsung Internet'],
    ['Safari on iPhone', AGENTS.safariIphone, 'Safari'],
    ['Chrome on iOS, which is Safari underneath', AGENTS.chromeIos, 'Chrome'],
    ['Firefox', AGENTS.firefoxLinux, 'Firefox'],
    ['Safari on macOS', AGENTS.safariMac, 'Safari'],
  ])('names %s', (_label, ua, expected) => {
    expect(detectBrowser(ua)).toBe(expected);
  });

  it('says Unknown rather than guessing', () => {
    expect(detectBrowser('curl/8.4.0')).toBe('Unknown');
    expect(detectBrowser('')).toBe('Unknown');
  });
});

describe('detectPlatform', () => {
  it.each([
    ['Android', AGENTS.chromeAndroid, 'Android'],
    ['Windows', AGENTS.edgeWindows, 'Windows'],
    ['iPhone', AGENTS.safariIphone, 'iOS'],
    ['iPad', AGENTS.ipad, 'iPadOS'],
    ['Linux', AGENTS.firefoxLinux, 'Linux'],
    ['macOS', AGENTS.safariMac, 'macOS'],
    ['ChromeOS, which also says Linux-ish things', AGENTS.chromebook, 'ChromeOS'],
  ])('names %s', (_label, ua, expected) => {
    expect(detectPlatform(ua)).toBe(expected);
  });

  it('says Unknown rather than guessing', () => {
    expect(detectPlatform('curl/8.4.0')).toBe('Unknown');
    expect(detectPlatform('')).toBe('Unknown');
  });
});

describe('formatTime', () => {
  const moment = new Date('2026-07-30T13:12:00Z');

  it('renders the visitor local time with its zone', () => {
    expect(formatTime(moment, 'Asia/Kolkata')).toBe('2026-07-30 18:42 GMT+5:30');
  });

  it('renders UTC when no zone is known', () => {
    expect(formatTime(moment, 'UTC')).toBe('2026-07-30 13:12 UTC');
  });

  it('falls back instead of throwing on a nonsense zone', () => {
    expect(formatTime(moment, 'Not/AZone')).toBe('2026-07-30 13:12 UTC');
  });
});

describe('describeEnvironment', () => {
  it('assembles the whole metadata block', () => {
    expect(
      describeEnvironment({
        userAgent: AGENTS.chromeAndroid,
        language: 'en-IN',
        url: 'https://toytoolsapp.com/tool/text/word-counter/',
        version: '1.4.2',
        now: new Date('2026-07-30T13:12:00Z'),
        timeZone: 'UTC',
      }),
    ).toEqual({
      browser: 'Chrome',
      platform: 'Android',
      language: 'en-IN',
      url: 'https://toytoolsapp.com/tool/text/word-counter/',
      version: '1.4.2',
      time: '2026-07-30 13:12 UTC',
    });
  });

  it('does not leave the language blank', () => {
    const env = describeEnvironment({
      userAgent: AGENTS.safariMac,
      language: '',
      url: 'https://toytoolsapp.com/feedback/',
      version: '1.4.2',
      now: new Date('2026-07-30T13:12:00Z'),
      timeZone: 'UTC',
    });
    expect(env.language).toBe('Unknown');
  });
});
