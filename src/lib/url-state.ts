/**
 * Policy for putting a tool's inputs in the URL.
 *
 * Shareable, bookmarkable results are the single most expected behaviour of an online calculator,
 * but "put the inputs in the address bar" is not a safe blanket rule: the address bar is also the
 * browser history, the referrer on any outbound click, and whatever gets pasted into a chat.
 *
 * So this is a build-time gate, deliberately mirroring allowsInputCapture in src/lib/feedback:
 * derived from the registry's engine/pattern metadata rather than a hand-maintained slug list, so a
 * new hashing or health tool is covered the day it ships without anyone remembering.
 *
 *   off    — the input may be a secret. Nothing is ever written to the URL, and no copy-link
 *            action is offered either: a link containing a bearer token is exactly the leak.
 *   manual — the input is personal (body metrics) or arbitrary pasted content. The page never
 *            touches location on its own; a link is built only when someone asks for one.
 *   auto   — short, structured, impersonal values (amounts, rates, dates, units). Synced to the
 *            URL as they change, so reload and back both do the obvious thing.
 */

import { SENSITIVE_ENGINES, SENSITIVE_PATTERNS } from './feedback/config';

export type UrlStateMode = 'auto' | 'manual' | 'off';

/**
 * Engines whose inputs are personal or unbounded. Auto-sync would write someone's body weight,
 * or a paragraph they pasted from a private email, into their browser history without asking.
 */
export const MANUAL_URL_ENGINES: readonly string[] = [
  'wellness',
  'tracker',
  'text-analysis',
  'text-processor',
  'text-interactive',
  'csv',
  'structured-data',
];

/** Patterns that are personal regardless of engine. */
export const MANUAL_URL_PATTERNS: readonly string[] = ['health-calculate', 'health-track'];

export function urlStateMode(engine?: string, pattern?: string): UrlStateMode {
  if (engine && SENSITIVE_ENGINES.includes(engine)) return 'off';
  if (pattern && SENSITIVE_PATTERNS.includes(pattern)) return 'off';
  if (engine && MANUAL_URL_ENGINES.includes(engine)) return 'manual';
  if (pattern && MANUAL_URL_PATTERNS.includes(pattern)) return 'manual';
  return 'auto';
}

/** Whether a shareable link may be offered at all (true for auto and manual, false for off). */
export function allowsUrlState(engine?: string, pattern?: string): boolean {
  return urlStateMode(engine, pattern) !== 'off';
}

/** Whether the page may write to location by itself. */
export function autoSyncsUrlState(engine?: string, pattern?: string): boolean {
  return urlStateMode(engine, pattern) === 'auto';
}

/**
 * Cap on the serialized query. Browsers and chat clients truncate long URLs unpredictably, and a
 * silently truncated link is worse than no link: it looks like it worked. Past this the tool says
 * so instead of producing one.
 */
export const MAX_URL_STATE_LENGTH = 1500;
