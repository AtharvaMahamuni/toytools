// CIDR / subnet calculator: IPv4 network, broadcast, usable range, mask, wildcard.
// Craft: when the typed address has host bits set, offer the canonical network as a one-tap replace.

import type { NetworkCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import { cidrField } from '../validation';
import { classifyIPv4, dottedBinary, formatCount, intToIp, kindLabel, subnetFrom } from '../models';
import { assumption, decisions, insight, step, toolDecision } from '../story';

export const cidrCalculator: NetworkCalculator = {
  id: 'cidr',
  family: 'addressing',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'cidr',
      label: 'IPv4 address or CIDR',
      type: 'text',
      default: '192.168.1.0/24',
      help: 'CIDR like 192.168.1.0/24, or an address and mask like 10.0.0.1 255.255.255.0.',
      presets: [
        { label: '/8', value: '10.0.0.0/8' },
        { label: '/16', value: '172.16.0.0/16' },
        { label: '/24', value: '192.168.1.0/24' },
        { label: '/32', value: '192.168.1.50/32' },
      ],
    },
  ],

  calculate(input) {
    const parsed = cidrField(input, 'cidr');
    if (!parsed.ok) return parsed.result;
    const net = subnetFrom(parsed.value);
    const networkIp = intToIp(net.network);
    const cidr = `${networkIp}/${net.prefix}`;
    const kind = classifyIPv4(net.network);

    const steps = [];
    let n = 1;
    steps.push(step(n++, `Prefix /${net.prefix} keeps the first ${net.prefix} bits as the network and leaves ${net.hostBits} host bits.`));
    steps.push(step(n++, `AND the address with mask ${intToIp(net.mask)} to get network ${networkIp}.`));
    if (net.hostRoute) {
      steps.push(step(n++, `/32 is a host route: the only address is ${networkIp}, and there is no broadcast.`));
    } else if (net.rfc3021) {
      steps.push(step(n++, `/31 is a point-to-point link (RFC 3021): both addresses are usable and there is no broadcast.`));
    } else {
      steps.push(step(n++, `Broadcast is the network with every host bit set: ${intToIp(net.broadcast)}. Usable hosts skip the network and the broadcast.`));
    }

    const insights = [...steps];
    if (!net.hostWasNetwork) {
      insights.push(
        insight(
          `You typed ${intToIp(net.addr)}, which is a host in ${cidr}. Firewall rules and route statements want the network address.`,
          'caution',
        ),
      );
    }
    if (kind === 'private' || kind === 'cgnat') {
      insights.push(insight(`This block is ${kindLabel(kind)}, so it is not a globally routed public prefix.`));
    }

    const meta: Record<string, string> = {};
    if (!net.hostWasNetwork) {
      meta.craftApplyField = 'cidr';
      meta.craftApplyValue = cidr;
      meta.craftLabel = `Use the network address ${cidr}`;
    }

    const usableNote = net.hostRoute
      ? 'the host itself'
      : net.rfc3021
        ? 'both addresses, RFC 3021'
        : 'excluding network and broadcast';

    return successResult({
      hero: card('network', 'Network', cidr, { emphasis: 'hero' }),
      metrics: [
        card('mask', 'Subnet mask', intToIp(net.mask)),
        card('wildcard', 'Wildcard mask', intToIp(net.wildcard)),
        card('broadcast', 'Broadcast', net.hostRoute || net.rfc3021 ? 'none' : intToIp(net.broadcast)),
        card('first', 'First usable', intToIp(net.firstUsable)),
        card('last', 'Last usable', intToIp(net.lastUsable)),
        card('usable', 'Usable hosts', formatCount(net.usable), { note: usableNote, raw: net.usable }),
        card('total', 'Addresses', formatCount(net.total), { raw: net.total }),
        card('kind', 'Range', kindLabel(kind)),
      ],
      insights,
      assumptions: [
        assumption('Mask bits', dottedBinary(net.mask)),
        assumption('Host bits', String(net.hostBits)),
        assumption('Typed address', intToIp(net.addr)),
      ],
      decisions: decisions([
        toolDecision('See the address this connection presents', 'what-is-my-ip'),
        toolDecision('Read an address as binary', 'binary-converter'),
      ]),
      meta,
    });
  },
};
