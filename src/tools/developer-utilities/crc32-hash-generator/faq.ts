import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'crc32-faq-1',
    question: 'What is CRC32 used for?',
    answer:
      'CRC32 is an error-detection checksum. Systems compute it before and after moving or storing data, and compare the two values; if they differ, the data was corrupted. It is built into formats like ZIP, PNG, and Ethernet frames for exactly this reason.',
  },
  {
    id: 'crc32-faq-2',
    question: 'Is CRC32 secure or cryptographic?',
    answer:
      'No. CRC32 is designed to catch accidental changes, not deliberate ones. It is fast and easy to forge, so an attacker can alter data and recompute a matching checksum. Never use it for passwords, signatures, or tamper protection. Use SHA-256 for that.',
  },
  {
    id: 'crc32-faq-3',
    question: 'Why is the output always eight characters?',
    answer:
      'CRC32 produces a 32-bit value, and 32 bits are written as eight hexadecimal digits (each hex digit is four bits). So every CRC32 result is exactly eight characters, zero-padded if the leading digits are zero.',
  },
  {
    id: 'crc32-faq-4',
    question: 'Can two different inputs have the same CRC32?',
    answer:
      'Yes. With only about four billion possible values, collisions are guaranteed once you hash enough inputs. That is fine for spotting random corruption but another reason CRC32 must not be used where collisions could be exploited.',
  },
  {
    id: 'crc32-faq-5',
    question: 'Why does my CRC32 differ from another tool?',
    answer:
      'There are several CRC-32 variants. This tool uses the common IEEE 802.3 / ISO-HDLC polynomial (0xEDB88320, reflected), the same one used by ZIP and PNG. A tool using a different polynomial, initial value, or bit order will produce a different result for the same input.',
  },
  {
    id: 'crc32-faq-7',
    question: 'What is a cyclic redundancy check?',
    answer:
      'A cyclic redundancy check (CRC) is an error-detection code: it treats your data as one long binary number, divides it by a fixed polynomial, and keeps the 32-bit remainder as the checksum. For example, this tool checksums hello as 3610a686, while hallo gives b97231d1, so one flipped character is caught instantly. That sensitivity to small changes is why ZIP, PNG, and Ethernet frames each embed a CRC.',
  },
  {
    id: 'crc32-faq-8',
    question: 'Should I use CRC32 or MD5?',
    answer:
      'Use CRC32 when you only need fast detection of accidental corruption, and MD5 when you want a wider non-security fingerprint; use neither against an attacker. CRC32 has a 32-bit output space of about 4.3 billion values, while MD5 outputs 128 bits, so MD5 repeats far less often for cache keys or deduplication. For example, checksumming millions of records will eventually repeat a CRC32 value, but an MD5 repeat at that scale is unrealistic. When tampering matters, skip both and use SHA-256.',
  },
  {
    id: 'crc32-faq-9',
    question: 'Does a matching CRC32 mean the file is authentic?',
    answer:
      'No, a matching CRC32 only shows the file was not accidentally corrupted; it proves nothing about who made it or whether it was deliberately altered. CRC32 is linear and trivial to forge: after modifying a file, an attacker can adjust four bytes so the checksum matches the original in microseconds. For example, malware substituted into a download can carry the exact CRC32 of the clean file. To verify authenticity, compare a SHA-256 hash published by a trusted source.',
  },
  {
    id: 'crc32-faq-6',
    question: 'Does the checksum run on my device?',
    answer:
      'Yes. CRC32 is computed in your browser with JavaScript. Your input is never uploaded or stored.',
  },
];
