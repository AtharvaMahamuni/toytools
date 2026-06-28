import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'puny-faq-1',
    question: 'What is Punycode?',
    answer:
      'Punycode is a way to represent Unicode text using only the ASCII letters, digits, and hyphens that DNS allows. It is what makes internationalized domain names (IDNs) like münchen.de work: the domain is stored as xn--mnchen-3ya.de so the existing DNS infrastructure can carry it.',
  },
  {
    id: 'puny-faq-2',
    question: 'What does the "xn--" prefix mean?',
    answer:
      'xn-- is the IDNA "ACE prefix". It marks a domain label that has been Punycode-encoded. When software sees a label starting with xn--, it knows the rest is Punycode and can decode it back to the original Unicode for display.',
  },
  {
    id: 'puny-faq-3',
    question: 'Why was only part of my domain converted?',
    answer:
      'Punycode works on each dot-separated label independently. Labels that are already plain ASCII are left unchanged, and only labels containing non-ASCII characters get encoded and the xn-- prefix. So münchen.de becomes xn--mnchen-3ya.de — the ".de" stays as-is.',
  },
  {
    id: 'puny-faq-4',
    question: 'How is Punycode different from URL encoding?',
    answer:
      'They cover different parts of a URL. Punycode encodes the domain name (the host) so it fits in DNS. URL/percent encoding handles the path and query string. A fully internationalized URL often uses both: Punycode for the host and percent-encoding for the path.',
  },
  {
    id: 'puny-faq-5',
    question: 'Can Punycode be used to fake a domain?',
    answer:
      'Punycode itself is just an encoding, but it enables homograph attacks: characters from other alphabets can look almost identical to Latin letters, so a lookalike domain can impersonate a real one. Decoding a suspicious xn-- domain here reveals the actual Unicode characters behind it.',
  },
  {
    id: 'puny-faq-6',
    question: 'Does this do full IDNA normalization?',
    answer:
      'This tool performs the raw Punycode (RFC 3492) encode and decode per label. It does not run the full IDNA processing pipeline (case folding, normalization, and validation). For most inspection and conversion tasks that is exactly what you want; for registering a domain, also apply your registrar’s IDNA rules.',
  },
];
