import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ipv4-converter-faq-1',
    question: 'How do I convert an IP address to an integer?',
    answer:
      'Type a dotted address such as 192.168.0.1. The page shows the dotted form, the decimal integer 3232235521, the hex form 0xC0A80001, and the 32 bits grouped by octet. You can also start from the integer, from 0x hex, or from 32 bits, and the dotted form comes back. The decimal is the unsigned 32-bit value, so it never goes negative.',
  },
  {
    id: 'ipv4-converter-faq-2',
    question: 'What is the hex form of 192.168.0.1?',
    answer:
      '0xC0A80001. Each octet becomes two hex digits, and the page always writes eight digits after 0x. 10.0.0.1 is 0x0A000001, with the leading zero kept, so it still lines up with a packet capture. A short hex value such as 0xC0A8 is a smaller integer, not an address with the zeros implied.',
  },
  {
    id: 'ipv4-converter-faq-3',
    question: 'Why is 256 rejected?',
    answer:
      'An IPv4 octet is a whole number from 0 to 255. 256.1.1.1 is not an address, and wrapping 256 into 0 would name a different host from the one you typed. The page says which number is outside 0 to 255 and shows no dotted result. The same refusal applies to an empty field and to text that is not an address.',
  },
  {
    id: 'ipv4-converter-faq-4',
    question: 'What happens if I paste an IPv6 address?',
    answer:
      'A plain IPv6 address such as 2001:db8::1 is refused. It is not cut down to a fragment and then shown as IPv4. An IPv4-mapped address such as ::ffff:192.0.2.1 is also refused as a result, and the page offers the embedded IPv4 address, 192.0.2.1, as a one-tap replacement. The hex form ::ffff:c000:0201 offers the same address.',
  },
  {
    id: 'ipv4-converter-faq-5',
    question: 'Why does 8888 offer 8.8.8.8?',
    answer:
      '8888 with no dots is the integer 8888, which is the host 0.0.34.184. It is also the only way to split those digits into four octets, 8.8.8.8. Those are different hosts. The page shows the integer reading and offers 8.8.8.8, because guessing silently would hide the mistake. 19216811 has more than one split, including 192.168.1.1, so the page names the ambiguity and does not pick one.',
  },
  {
    id: 'ipv4-converter-faq-6',
    question: 'Does this calculate a subnet?',
    answer:
      'No. One address in, four writings of that address out. The mask, the wildcard, and the usable range belong to the CIDR calculator. Paste the dotted form there when the question is the network rather than the host. Nothing you type is uploaded.',
  },
];
