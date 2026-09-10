import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { NetworkInput } from './types';

export const NETWORK_EXAMPLES: WorkedExample<NetworkInput>[] = [
  {
    id: 'cidr-home-24',
    engine: 'network',
    ref: 'cidr',
    title: 'A typical home /24',
    inputs: { cidr: '192.168.1.0/24' },
    expect: { usable: 254, total: 256 },
    narrative: '192.168.1.0/24 is a private /24: mask 255.255.255.0, 254 usable hosts from .1 to .254, broadcast .255.',
  },
  {
    id: 'cidr-host-bits-set',
    engine: 'network',
    ref: 'cidr',
    title: 'A host address in a /24',
    inputs: { cidr: '192.168.1.50/24' },
    expect: { usable: 254, total: 256 },
    narrative: '192.168.1.50/24 still describes the 192.168.1.0/24 network. The host bits are not the network address.',
  },
  {
    id: 'cidr-slash-31',
    engine: 'network',
    ref: 'cidr',
    title: 'Point-to-point /31',
    inputs: { cidr: '10.0.0.0/31' },
    expect: { usable: 2, total: 2 },
    narrative: '/31 is a point-to-point link: both addresses are usable and there is no broadcast, per RFC 3021.',
  },
  {
    id: 'cidr-host-route',
    engine: 'network',
    ref: 'cidr',
    title: 'A /32 host route',
    inputs: { cidr: '8.8.8.8/32' },
    expect: { usable: 1, total: 1 },
    narrative: '/32 is a single host. The only address is 8.8.8.8, and there is no broadcast.',
  },
];

export const networkExampleById = buildExampleRegistry(NETWORK_EXAMPLES);
export const networkExamplesFor = (ref: string) => examplesForRef(NETWORK_EXAMPLES, 'network', ref);
