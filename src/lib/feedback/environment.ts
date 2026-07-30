// The metadata block at the foot of every feedback email.
//
// Kept deliberately thin: enough to reproduce a bug (which browser, which platform, which
// version of the site, which page) and nothing more. No fingerprinting, no identifiers, no
// screen or hardware profile. Every value here is one the visitor's browser already sends to
// any server it talks to.
//
// Pure: the ambient values are passed in, so the whole thing is testable without a browser.

import type { FeedbackEnv } from './templates';

export interface EnvironmentInput {
  userAgent: string;
  language: string;
  url: string;
  version: string;
  now: Date;
  /** IANA zone, e.g. 'Asia/Kolkata'. Falls back to UTC when unavailable. */
  timeZone?: string;
}

const UNKNOWN = 'Unknown';

/**
 * Name the browser from its user-agent string.
 *
 * Order matters, because user agents lie by design for compatibility: Edge claims to be
 * Chrome, Chrome claims to be Safari, and almost everything claims to be Mozilla. Testing the
 * most specific token first is what keeps the answer honest.
 */
export function detectBrowser(userAgent: string): string {
  const ua = userAgent || '';
  if (/\bEdg\//.test(ua)) return 'Edge';
  if (/\bOPR\/|\bOpera\//.test(ua)) return 'Opera';
  if (/\bSamsungBrowser\//.test(ua)) return 'Samsung Internet';
  if (/\bFirefox\/|\bFxiOS\//.test(ua)) return 'Firefox';
  if (/\bCriOS\//.test(ua)) return 'Chrome';
  if (/\bChrome\//.test(ua)) return 'Chrome';
  if (/\bSafari\//.test(ua)) return 'Safari';
  return UNKNOWN;
}

/** Name the operating system from the same string, by the same most-specific-first rule. */
export function detectPlatform(userAgent: string): string {
  const ua = userAgent || '';
  if (/\bAndroid\b/.test(ua)) return 'Android';
  // iPadOS reports itself as a Mac, so the touch-capable Macintosh case is checked first.
  if (/\biPhone\b/.test(ua)) return 'iOS';
  if (/\biPad\b/.test(ua)) return 'iPadOS';
  if (/\bWindows\b/.test(ua)) return 'Windows';
  if (/\bCrOS\b/.test(ua)) return 'ChromeOS';
  if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) return 'macOS';
  if (/\bLinux\b/.test(ua)) return 'Linux';
  return UNKNOWN;
}

/**
 * A readable local timestamp: `2026-07-30 18:42 IST`.
 *
 * Rendered in the visitor's own zone rather than UTC, because "it broke at 18:42 my time" is
 * what they will say if you write back, and matching that costs nothing.
 */
export function formatTime(now: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  };
  if (timeZone) options.timeZone = timeZone;

  try {
    const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find(part => part.type === type)?.value ?? '';
    const date = `${get('year')}-${get('month')}-${get('day')}`;
    const time = `${get('hour')}:${get('minute')}`;
    const zone = get('timeZoneName');
    return zone ? `${date} ${time} ${zone}` : `${date} ${time}`;
  } catch {
    // An invalid zone must never cost us the whole email.
    return now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  }
}

/** Assemble the metadata block from ambient values. */
export function describeEnvironment(input: EnvironmentInput): FeedbackEnv {
  return {
    browser: detectBrowser(input.userAgent),
    platform: detectPlatform(input.userAgent),
    language: input.language || UNKNOWN,
    url: input.url,
    version: input.version,
    time: formatTime(input.now, input.timeZone),
  };
}
