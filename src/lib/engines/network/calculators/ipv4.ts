// IPv4 literal converter: dotted, decimal, hex, and binary for one address.
// Craft: an IPv4-mapped IPv6 paste is refused, and the embedded address is a
// one-tap replacement. An undotted integer that is exactly one glued-octet
// reading gets the same offer. Several glued readings are named and not guessed.

import type { NetworkCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import { intToIp } from '../models';
import { assumption, decisions, insight, toolDecision } from '../story';
import { formatBinary, formatHex, parseIPv4Literal } from '../ipv4-literal';

export const ipv4Calculator: NetworkCalculator = {
  id: 'ipv4',
  family: 'addressing',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'address',
      label: 'IPv4 address',
      type: 'text',
      default: '192.168.0.1',
      help: 'Dotted quad, decimal, 0x hex, or 32 bits. An octet above 255 is rejected.',
      presets: [
        { label: '192.168.0.1', value: '192.168.0.1' },
        { label: '127.0.0.1', value: '127.0.0.1' },
        { label: '8.8.8.8', value: '8.8.8.8' },
      ],
    },
  ],

  calculate(input) {
    const raw = input.address;
    if (raw === undefined || raw === '' || raw === null) {
      return validationError('Enter an IPv4 address, or its decimal, hex, or binary form.');
    }
    const parsed = parseIPv4Literal(String(raw));
    if (!parsed.ok) {
      const result = validationError(parsed.error);
      if (parsed.mapped) {
        result.meta = {
          craftApplyField: 'address',
          craftApplyValue: parsed.mapped,
          craftLabel: `Use the IPv4 address ${parsed.mapped}`,
        };
      }
      return result;
    }

    const addr = parsed.value.addr;
    const dotted = intToIp(addr);
    const hex = formatHex(addr);
    const binary = formatBinary(addr);
    const glued = parsed.value.glued;
    const meta: Record<string, string> = {};
    const insights = [];

    if (glued?.unique) {
      insights.push(
        insight(
          `${String(raw).trim()} as a 32-bit integer is ${dotted}. Written without dots it is one address, ${glued.unique}.`,
          'caution',
        ),
      );
      meta.craftApplyField = 'address';
      meta.craftApplyValue = glued.unique;
      meta.craftLabel = `Use ${glued.unique} instead of the integer`;
    } else if (glued && glued.splits.length > 1) {
      const sample = glued.splits.slice(0, 3).join(', ');
      insights.push(
        insight(
          `${String(raw).trim()} as a 32-bit integer is ${dotted}. Without dots it can also be ${sample}. The page did not guess which.`,
          'caution',
        ),
      );
    }

    return successResult({
      hero: card('dotted', 'Dotted decimal', dotted, { emphasis: 'hero', raw: addr }),
      metrics: [
        card('decimal', 'Decimal', String(addr), { raw: addr }),
        card('hex', 'Hex', hex),
        card('binary', 'Binary', binary),
      ],
      insights,
      assumptions: [
        assumption('32-bit value', String(addr)),
        assumption('Hex keeps eight digits', hex),
      ],
      decisions: decisions([
        toolDecision('See the network, mask, and wildcard', 'cidr-calculator'),
        toolDecision('Read a number as binary', 'binary-converter'),
      ]),
      meta,
    });
  },
};
