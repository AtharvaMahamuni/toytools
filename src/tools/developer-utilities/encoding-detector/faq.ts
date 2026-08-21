import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ed-faq-1',
    question: 'How do I know if a string is Base64 or hex?',
    answer:
      'Length and alphabet decide it. Hex uses only 0-9 and a-f and always has an even number of characters, because every byte takes exactly two. Base64 draws on the full A-Z, a-z, 0-9 range plus two symbols, so a single uppercase letter or a "+" rules hex out. Paste the string above and both readings are tried for you, with the decoded result under each, so you can see which one produces text a person would recognise.',
  },
  {
    id: 'ed-faq-2',
    question: 'Why does my Base64 string decode to gibberish?',
    answer:
      'Almost always because it is Base64URL rather than standard Base64. The URL-safe variant swaps "+" for "-" and "/" for "_" so the value can travel in a URL without being escaped again. A standard decoder either rejects those two characters or silently produces the wrong bytes. JWTs, OAuth tokens and signed URLs all use the URL-safe alphabet, which is why values copied out of a browser address bar are the ones that fail.',
  },
  {
    id: 'ed-faq-3',
    question: 'What does it mean when the decoded output is still encoded?',
    answer:
      'It means the value was encoded twice, which happens to anything that travelled through a URL. A Base64 token placed in a query string gets percent-encoded on top, so decoding the percent-encoding returns Base64 rather than readable text. That result looks identical to corrupt data, which is why this tool says so explicitly and offers to decode the next layer instead of leaving you to guess.',
  },
  {
    id: 'ed-faq-4',
    question: 'Can you detect ROT13?',
    answer:
      'No, and no tool honestly can. ROT13 turns letters into other letters, so its output has the same shape, length and character range as ordinary English text. There is no structural property that separates "Uryyb" from a word in a language you do not happen to speak. Encodings that can be detected are the ones that constrain the alphabet or the length, which is why Base64, hex, binary and percent-encoding are all recognisable and ROT13 is not.',
  },
  {
    id: 'ed-faq-5',
    question: 'Why is a long hex string reported with low confidence?',
    answer:
      'Because it is probably a hash, not encoded text. Digests have fixed lengths: 32 hex characters for MD5, 40 for SHA-1, 64 for SHA-256. A string of exactly those lengths is far more likely to be a fingerprint than a message, and a hash does not decode to anything at all: it is one-way by design. The reading is still shown in case the length is a coincidence, but the warning is there so you do not spend time trying to reverse something that cannot be reversed.',
  },
  {
    id: 'ed-faq-6',
    question: 'Is my data uploaded anywhere?',
    answer:
      'No. Detection runs entirely in your browser using ordinary JavaScript, and nothing you paste leaves the page. That matters here more than on most tools, because the strings people cannot identify are tokens, session values and fragments of production data.',
  },
];
