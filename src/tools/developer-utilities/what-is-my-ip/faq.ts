import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'what-is-my-ip-faq-1',
    question: 'What is my IP address?',
    answer:
      'It is the address this connection presents to the rest of the internet. This page shows public IPv4 and, when the path has it, public IPv6. Copy the family the form in front of you actually accepts. A v4-only field will reject an IPv6 address even when both are correct.',
  },
  {
    id: 'what-is-my-ip-faq-2',
    question: 'Why do I see both IPv4 and IPv6?',
    answer:
      'Dual-stack networks have both families at once. The IPv4 address is what older forms, some CDNs, and many allowlists still want. The IPv6 address is what a v6-first peer sees. They are not two writings of the same number, so copying the wrong family looks like the lookup failed.',
  },
  {
    id: 'what-is-my-ip-faq-3',
    question: 'Why is my IP in 100.64.x.x?',
    answer:
      '100.64.0.0/10 is shared address space for carrier-grade NAT (RFC 6598). Your device is behind an ISP NAT. That address is not globally reachable, so opening a port on it, or whitelisting it on a remote host, will not match traffic from the public internet.',
  },
  {
    id: 'what-is-my-ip-faq-4',
    question: 'Does a VPN change what this page shows?',
    answer:
      'Yes. The echo sees the VPN egress, not your home router. Turn the VPN off and look up again for the home address, or whitelist the egress on purpose.',
  },
  {
    id: 'what-is-my-ip-faq-5',
    question: 'Is my IP sent to ToyTools?',
    answer:
      'No. Your browser asks ipify.org for the address the internet already sees. The reply comes back to this tab. ToyTools has no server in the path, and nothing is stored here.',
  },
];
