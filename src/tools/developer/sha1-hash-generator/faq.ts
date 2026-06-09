import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sha1-faq-1',
    question: 'What is SHA-1?',
    answer:
      'SHA-1 (Secure Hash Algorithm 1) is a cryptographic hash function that produces a 160-bit digest, displayed as 40 hexadecimal characters. It was designed by the NSA and published as a U.S. federal standard in 1995. It\'s been deprecated for security use since 2017, when a practical collision attack — SHAttered — was demonstrated.',
  },
  {
    id: 'sha1-faq-2',
    question: 'What does a SHA-1 hash look like?',
    answer:
      'Always 40 lowercase hexadecimal characters. The string "hello" hashes to `aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d`. It\'s always the same length regardless of input size — that\'s the point of a fixed-output hash function.',
  },
  {
    id: 'sha1-faq-3',
    question: 'Is SHA-1 still safe to use?',
    answer:
      'Not for security. NIST deprecated SHA-1 in 2011 and all major browsers dropped SHA-1 SSL certificates in 2017. The SHAttered attack generated two different PDF files with the same SHA-1 hash — a practical collision. For checksums in internal systems where tamper resistance isn\'t required, SHA-1 still works. For any security-critical use, switch to SHA-256.',
  },
  {
    id: 'sha1-faq-4',
    question: 'What was the SHAttered attack?',
    answer:
      'In February 2017, researchers from CWI Amsterdam and Google produced two PDF files with identical SHA-1 hashes — the first practical SHA-1 collision. They named it SHAttered. The attack required roughly 9.2 × 10¹⁸ SHA-1 computations and 6.5 × 10²⁰ SHA-1 compressions. That\'s expensive, but within reach of well-resourced attackers, which is why it ended SHA-1\'s use in certificates and code signing.',
  },
  {
    id: 'sha1-faq-5',
    question: 'What should I use instead of SHA-1?',
    answer:
      'SHA-256 for general cryptographic hashing. It\'s part of the SHA-2 family, produces a 256-bit output, and has no known collision attacks. If you need HMAC, HMAC-SHA256 is the current standard recommendation. For password hashing specifically, use bcrypt, scrypt, or Argon2 — none of the SHA family is designed for that.',
  },
  {
    id: 'sha1-faq-6',
    question: 'Does Git use SHA-1? Is that a problem?',
    answer:
      'Git historically used SHA-1 to identify commits, trees, and blobs. For data integrity inside a repository, this is acceptable because Git\'s collision detection — added after SHAttered — flags if two different objects produce the same hash. Git is also transitioning to SHA-256 as its default. The exposure is limited: an attacker would need write access to your repository to exploit a crafted collision.',
  },
  {
    id: 'sha1-faq-7',
    question: 'Can you reverse a SHA-1 hash?',
    answer:
      'No. SHA-1 is a one-way function. You can\'t derive the original input from the hash. What\'s possible is a lookup: if the input is short or common, it might appear in a precomputed rainbow table. That\'s why password storage with any bare hash — SHA-1, SHA-256, or otherwise — is wrong. Use a slow hashing algorithm with a salt.',
  },
  {
    id: 'sha1-faq-8',
    question: 'What\'s the difference between SHA-1 and SHA-256?',
    answer:
      'Output size and security. SHA-1 produces 160 bits (40 hex characters); SHA-256 produces 256 bits (64 hex characters). SHA-1 has known collision attacks; SHA-256 does not. SHA-256 is slower — which matters in high-throughput contexts but is rarely significant for individual operations. Use SHA-256 for anything new.',
  },
  {
    id: 'sha1-faq-9',
    question: 'Is HMAC-SHA1 still secure?',
    answer:
      'HMAC constructions are more resilient to collision attacks than bare hashing, because HMAC depends on a secret key, not just the hash function\'s collision resistance. HMAC-SHA1 is still considered secure for many use cases — for example, it\'s used in TOTP (one-time passwords, RFC 6238). That said, new protocols should use HMAC-SHA256 for margin and clarity.',
  },
];
