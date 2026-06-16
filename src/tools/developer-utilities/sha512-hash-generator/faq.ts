import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sha512-faq-1',
    question: 'What is SHA-512?',
    answer:
      'SHA-512 is a cryptographic hash function that produces a 512-bit digest, displayed as 128 hexadecimal characters. It is part of the SHA-2 family, designed by the NSA and standardized by NIST in 2001. It has no known collision attacks and is stronger than SHA-256 for applications requiring extra security margin.',
  },
  {
    id: 'sha512-faq-2',
    question: 'How many characters is a SHA-512 hash?',
    answer:
      'Always 128 lowercase hexadecimal characters. The string "hello" hashes to a fixed 128-character output every time. This is twice the length of a SHA-256 hash (64 characters) because SHA-512 produces a 512-bit digest versus SHA-256\'s 256-bit digest.',
  },
  {
    id: 'sha512-faq-3',
    question: 'Can SHA-512 be reversed?',
    answer:
      'No. SHA-512 is a one-way function. You cannot derive the input from the hash output. For short or common inputs, precomputed lookup tables (rainbow tables) can identify the original string, which is why SHA-512 alone is wrong for password storage. For passwords, use bcrypt, scrypt, or Argon2 instead.',
  },
  {
    id: 'sha512-faq-4',
    question: 'Is SHA-512 better than SHA-256?',
    answer:
      'SHA-512 has a larger output (128 hex chars vs 64) and is faster than SHA-256 on 64-bit CPUs because it uses 64-bit arithmetic. For most applications, SHA-256 is sufficient and more widely supported. SHA-512 is the right choice when maximum output length is a requirement or when running on 64-bit hardware where its speed advantage matters.',
  },
  {
    id: 'sha512-faq-5',
    question: 'Is SHA-512 safe for password hashing?',
    answer:
      'No. SHA-512 is fast by design, computing billions of hashes per second on modern hardware. Fast hashing is exactly wrong for passwords: speed makes brute-force attacks practical. Use bcrypt, scrypt, or Argon2 for passwords. They are deliberately slow, support salting, and are built for credential storage.',
  },
  {
    id: 'sha512-faq-6',
    question: 'What is SHA-512 used for in practice?',
    answer:
      'SHA-512 is used for file integrity verification (checksums), HMAC-SHA512 signatures in API authentication, data integrity checks in distributed systems, and digital certificate signing where a large output is preferred. It also appears in some cryptographic protocols as a component of key derivation functions.',
  },
  {
    id: 'sha512-faq-7',
    question: 'What is the difference between SHA-512 and SHA-256?',
    answer:
      'Both are in the SHA-2 family. SHA-256 produces a 256-bit (64 hex character) digest using 32-bit words and 64 rounds. SHA-512 produces a 512-bit (128 hex character) digest using 64-bit words and 80 rounds. SHA-512 is faster on 64-bit hardware for large inputs. For most web and API use cases, SHA-256 is the standard choice.',
  },
  {
    id: 'sha512-faq-8',
    question: 'Does the same input always produce the same SHA-512 hash?',
    answer:
      'Yes. SHA-512 is deterministic: the same input always produces the same 128-character output. This is called determinism and is fundamental to how checksums work. It also means SHA-512 has no randomness: two identical inputs produce identical hashes, which is why a salt is required for password hashing.',
  },
  {
    id: 'sha512-faq-9',
    question: 'How does SHA-512 compare to MD5 and SHA-1?',
    answer:
      'MD5 (128-bit, 32 hex chars) and SHA-1 (160-bit, 40 hex chars) both have known collision attacks and are broken for security use. SHA-512 (512-bit, 128 hex chars) has no known practical attacks. Use SHA-512 (or SHA-256) for any new security-sensitive application, and migrate away from MD5 and SHA-1.',
  },
];
