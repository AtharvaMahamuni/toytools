// Network engine types. CIDR/subnet math is a consumer of the platform layers: a calculator's
// result IS an InteractiveResult and a field IS a platform SmartFieldDef. Lookup tools (what is
// my IP) sit on the same engine for subject matter and call the `network` namespace instead of
// `runNetwork`.

import type { SmartFieldDef } from '@lib/inputs/field';
import type { InteractiveResult, SectionId, Capabilities } from '@lib/results/types';

export type NetworkFieldDef = SmartFieldDef;
export type NetworkInput = Record<string, number | string>;
export type NetworkResult = InteractiveResult;

export interface NetworkOpts {
  locale?: string;
}

export interface NetworkCalculator {
  id: string;
  family: string;
  fields: NetworkFieldDef[];
  layout?: SectionId[];
  capabilities?: Partial<Capabilities>;
  calculate(input: NetworkInput, opts: NetworkOpts): NetworkResult;
}

/** Kind of IPv4 address, used by both the CIDR calculator and the public-IP lookup craft. */
export type IPv4Kind =
  | 'public'
  | 'private'
  | 'cgnat'
  | 'loopback'
  | 'link-local'
  | 'multicast'
  | 'reserved'
  | 'unspecified'
  | 'broadcast';

export interface ParsedIPv4 {
  /** The typed address as an unsigned 32-bit integer. */
  addr: number;
  prefix: number;
  source: 'cidr' | 'mask' | 'wildcard' | 'host';
}

export interface IPv4Subnet {
  addr: number;
  prefix: number;
  mask: number;
  wildcard: number;
  network: number;
  broadcast: number;
  hostBits: number;
  total: number;
  usable: number;
  firstUsable: number;
  lastUsable: number;
  /** False when the typed address had host bits set. */
  hostWasNetwork: boolean;
  rfc3021: boolean;
  hostRoute: boolean;
}

export interface PublicLookup {
  ipv4?: string;
  ipv6?: string;
  error?: string;
}
