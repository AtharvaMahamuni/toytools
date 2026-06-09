import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sha256-faq-1',
    question: 'What is SHA-256?',
    answer:
      'SHA-256 is a cryptographic hash function that produces a 256-bit digest, displayed as 64 hexadecimal characters. It\'s part of the SHA-2 family designed by the NSA and published as a federal standard in 2001. It has no known collision attacks and is the current baseline recommendation for general-purpose cryptographic hashing.',
  },
  {
    id: 'sha256-faq-2',
    question: 'What does a SHA-256 hash look like?',
    answer:
      'Always 64 lowercase hexadecimal characters. The string "hello" hashes to `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`. Change a single character and the output changes completely — that\'s the avalanche effect, and it\'s by design.',
  },
  {
    id: 'sha256-faq-3',
    question: 'Can SHA-256 be reversed?',
    answer:
      'No. SHA-256 is a one-way function. You can\'t derive the input from the hash. For common or short inputs, rainbow tables (precomputed hash lookup databases) can identify the original string — which is why raw SHA-256 is wrong for password storage. For passwords, use bcrypt, scrypt, or Argon2, which add a salt and are designed to be slow.',
  },
  {
    id: 'sha256-faq-4',
    question: 'Why is SHA-256 considered secure?',
    answer:
      'Because no practical attacks exist against the full algorithm. The best published attacks break 52 of 64 rounds — the full 64-round algorithm remains intact. SHA-256 also benefits from the avalanche effect: a one-bit input change flips roughly half the output bits, making it infeasible to reverse-engineer or craft collisions. It\'s also been scrutinized publicly for over two decades with no successful breaks.',
  },
  {
    id: 'sha256-faq-5',
    question: 'Is SHA-256 safe for password hashing?',
    answer:
      'No. SHA-256 is fast — millions of hashes per second per CPU core, billions on a GPU. That\'s exactly wrong for passwords, where you want computation to be expensive enough to slow brute-force attacks. Use bcrypt, scrypt, or Argon2. They are slow by design, support salting, and are specifically built for credential storage.',
  },
  {
    id: 'sha256-faq-6',
    question: 'How is SHA-256 used in Bitcoin?',
    answer:
      'Two places. Mining (proof of work) requires finding a nonce such that SHA-256(SHA-256(block_header)) produces a hash below a target value. The difficulty adjusts so this takes roughly 10 minutes across the entire network. Transaction IDs are also SHA-256 double-hashes of the transaction data. The choice of SHA-256 was deliberate — a widely audited, collision-resistant function with no known vulnerabilities.',
  },
  {
    id: 'sha256-faq-7',
    question: 'What\'s the difference between SHA-256 and SHA-512?',
    answer:
      'Both are in the SHA-2 family. SHA-256 produces a 256-bit (64 hex character) digest; SHA-512 produces a 512-bit (128 hex character) digest. SHA-512 uses 64-bit words and 80 rounds versus SHA-256\'s 32-bit words and 64 rounds, which makes SHA-512 faster on 64-bit CPUs for large inputs. For most applications, SHA-256 is sufficient. SHA-512 is used where extra margin is desired.',
  },
  {
    id: 'sha256-faq-8',
    question: 'How does SHA-256 compare to MD5 and SHA-1?',
    answer:
      'MD5 is 128-bit (32 hex chars) and has collision attacks. SHA-1 is 160-bit (40 hex chars) and has a demonstrated practical collision. SHA-256 is 256-bit (64 hex chars) with no known attacks. Both MD5 and SHA-1 are broken for security use. SHA-256 is the current baseline for new applications.',
  },
  {
    id: 'sha256-faq-9',
    question: 'What is the SHA-2 family?',
    answer:
      'SHA-2 is a set of hash functions — SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, and SHA-512/256 — all designed by the NSA and published by NIST between 2001 and 2012. They share the same Merkle–Damgård construction but differ in output size and internal word size. SHA-256 and SHA-512 are the most commonly used members. SHA-3 is a completely separate family with a different design (Keccak sponge construction).',
  },
];
