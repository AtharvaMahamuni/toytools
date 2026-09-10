// Public-address lookup. The request leaves the browser toward an IP echo; ToyTools never sees
// the reply. Inject `fetchImpl` in tests. Never throws.

import { classifyIPv4String, looksLikeIPv6 } from './models';
import type { IPv4Kind, PublicLookup } from './types';

const IPV4_ECHO = 'https://api.ipify.org?format=json';
const IPV6_ECHO = 'https://api64.ipify.org?format=json';

export const LOOKUP_DISCLOSURE =
  'Your browser asks ipify.org for the address the internet already sees. ToyTools never sees the reply, and nothing is stored here.';

type FetchLike = (input: string, init?: { signal?: AbortSignal }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

async function readIp(fetchImpl: FetchLike, url: string, signal?: AbortSignal): Promise<string | undefined> {
  try {
    const res = await fetchImpl(url, signal ? { signal } : undefined);
    if (!res.ok) return undefined;
    const body = await res.json();
    const ip = body && typeof body === 'object' && 'ip' in body ? String((body as { ip: unknown }).ip).trim() : '';
    return ip || undefined;
  } catch {
    return undefined;
  }
}

export async function lookupPublic(fetchImpl: FetchLike = fetch as FetchLike, signal?: AbortSignal): Promise<PublicLookup> {
  const [a, b] = await Promise.all([readIp(fetchImpl, IPV4_ECHO, signal), readIp(fetchImpl, IPV6_ECHO, signal)]);
  const ipv4 = a && !a.includes(':') ? a : b && !b.includes(':') ? b : undefined;
  const ipv6 = a && looksLikeIPv6(a) ? a : b && looksLikeIPv6(b) ? b : undefined;
  if (!ipv4 && !ipv6) {
    return { error: 'The IP echo did not answer. Check the connection, or that a blocker is not stopping ipify.org.' };
  }
  return { ipv4, ipv6 };
}

export interface LookupCraft {
  text: string;
  kind: IPv4Kind | 'ipv6-only' | 'dual-stack';
}

/** One line of fact about the looked-up addresses. Silent when there is nothing extra to say. */
export function lookupCraft(result: PublicLookup): LookupCraft | null {
  if (result.error || (!result.ipv4 && !result.ipv6)) return null;
  if (result.ipv4) {
    const kind = classifyIPv4String(result.ipv4);
    if (kind === 'cgnat') {
      return {
        kind,
        text: `${result.ipv4} is a shared CGNAT address (100.64/10). Nothing on the public internet can dial it back.`,
      };
    }
    if (kind === 'private' || kind === 'loopback' || kind === 'link-local') {
      return {
        kind: kind ?? 'private',
        text: `${result.ipv4} is ${kind}. That is not a public address, so a remote whitelist of it will not match this connection.`,
      };
    }
  }
  if (result.ipv6 && !result.ipv4) {
    return {
      kind: 'ipv6-only',
      text: 'This connection has no IPv4. Copy the IPv6 address, or a v4-only form will reject it.',
    };
  }
  if (result.ipv4 && result.ipv6) {
    return {
      kind: 'dual-stack',
      text: 'This path has both families. Copy IPv4 for v4-only forms, IPv6 for the rest.',
    };
  }
  return null;
}
