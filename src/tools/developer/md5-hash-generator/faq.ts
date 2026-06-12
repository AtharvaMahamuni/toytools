import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'md5-faq-1',
    question: 'What is MD5?',
    answer:
      'MD5 is a hash function. It takes any input (a single character, a paragraph, a file) and produces a fixed-length 32-character hexadecimal string called a digest. Designed by Ronald Rivest in 1991, it was built as a cryptographic hash, though it\'s no longer considered safe for security-sensitive work due to known collision vulnerabilities.',
  },
  {
    id: 'md5-faq-2',
    question: 'What does an MD5 hash look like?',
    answer:
      'It\'s always 32 lowercase hexadecimal characters. The string "hello" hashes to `5d41402abc4b2a76b9719d911017c592`. "Hello" (capital H) produces a completely different hash: `8b1a9953c4611296a827abf8c47804d7`. Same length, radically different output: that\'s the avalanche effect.',
  },
  {
    id: 'md5-faq-3',
    question: 'Can you reverse an MD5 hash back to the original text?',
    answer:
      'Not mathematically. MD5 is a one-way function: the hash is designed so the original input can\'t be derived from the output. In practice, short or common inputs can be looked up in precomputed "rainbow tables" that map known strings to their MD5 hashes. That\'s why MD5 is unsuitable for password storage: an attacker with your hash can often find the original password via lookup, not reversal.',
  },
  {
    id: 'md5-faq-4',
    question: 'Is MD5 safe to use?',
    answer:
      'For non-security uses, yes. For anything security-related, no. MD5 has known collision vulnerabilities (two different inputs can produce the same hash) which means it can\'t be trusted for digital signatures, SSL certificates, or tamper detection. For checksums, cache keys, or deduplication where an attacker isn\'t in the picture, it works fine.',
  },
  {
    id: 'md5-faq-5',
    question: 'Can I use MD5 to hash passwords?',
    answer:
      'No. MD5 is fast by design, which is the opposite of what you want for passwords. A modern GPU can compute billions of MD5 hashes per second, making brute-force attacks trivially fast. Use a dedicated password hashing function like bcrypt, scrypt, or Argon2: they\'re intentionally slow and designed to resist exactly this kind of attack.',
  },
  {
    id: 'md5-faq-6',
    question: 'What is a hash collision?',
    answer:
      'A collision is when two different inputs produce the same hash output. For a 128-bit hash like MD5 you\'d expect collisions to be astronomically rare. Researchers found ways to craft them deliberately as early as 2004, and today collisions can be generated in seconds on a regular computer. This makes MD5 untrustworthy for security applications that depend on the hash being unique.',
  },
  {
    id: 'md5-faq-7',
    question: 'What is MD5 still useful for today?',
    answer:
      'File integrity checks against accidental corruption, not malicious tampering. Cache key generation. Deduplication in storage systems. Content-addressable identifiers. Database sharding keys. Anything where speed matters, collisions are an acceptable risk, and an adversary isn\'t trying to forge a matching hash. MD5 is still fast and ubiquitous: just not a security tool.',
  },
  {
    id: 'md5-faq-8',
    question: 'What\'s the difference between MD5 and SHA-256?',
    answer:
      'Output size and security. MD5 produces 128 bits (32 hex characters). SHA-256 produces 256 bits (64 hex characters). SHA-256 has no known collision attacks and is considered cryptographically secure. If you need a hash for anything security-sensitive (signatures, certificates, tamper detection) use SHA-256. If speed matters more than security for an internal use case, MD5 is still practical.',
  },
  {
    id: 'md5-faq-9',
    question: 'Why does the same input always produce the same MD5 hash?',
    answer:
      'Because hash functions are deterministic. Given the same input, the algorithm performs the same operations in the same order, producing the same output every time. That determinism is what makes hashes useful for verification: you can hash a file today, then hash it again tomorrow, and a matching hash confirms the file hasn\'t changed.',
  },
];
