import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cidr-calculator-faq-1',
    question: 'What is CIDR notation?',
    answer:
      'CIDR notation writes an IPv4 address and its prefix length together, like 192.168.1.0/24. The number after the slash is how many leading bits identify the network. The remaining bits identify hosts inside that network. /24 is the same as subnet mask 255.255.255.0.',
  },
  {
    id: 'cidr-calculator-faq-2',
    question: 'How do I calculate a subnet from a CIDR?',
    answer:
      'Paste the CIDR, for example 10.0.0.0/16, or an address and dotted mask like 10.0.0.1 255.255.0.0. The calculator ANDs the address with the mask to get the network, sets the host bits for the broadcast, and lists the usable range, wildcard mask, and host count. For example, 192.168.1.0/24 has 254 usable hosts from 192.168.1.1 to 192.168.1.254.',
  },
  {
    id: 'cidr-calculator-faq-3',
    question: 'Why is a /31 or /32 different?',
    answer:
      'The usual usable-host formula subtracts two addresses: the network and the broadcast. That does not apply at the edges. A /32 is a single host route, so there is one address and no broadcast. A /31 is a point-to-point link under RFC 3021, so both addresses are usable and there is no broadcast.',
  },
  {
    id: 'cidr-calculator-faq-4',
    question: 'What is a wildcard mask?',
    answer:
      'A wildcard mask is the inverse of the subnet mask, used in Cisco-style ACLs. For 255.255.255.0 the wildcard is 0.0.0.255. Bits that are 0 in the wildcard must match; bits that are 1 are ignored. The calculator shows it next to the subnet mask so you do not have to invert it by hand.',
  },
  {
    id: 'cidr-calculator-faq-5',
    question: 'Is my data sent anywhere?',
    answer:
      'No. The CIDR math runs entirely in your browser. Nothing you type is uploaded, stored on a server, or shared, so the page works offline once it has loaded.',
  },
];
