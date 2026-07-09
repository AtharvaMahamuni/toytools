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
    id: 'crc32-faq-6',
    question: 'Does the checksum run on my device?',
    answer:
      'Yes. CRC32 is computed in your browser with JavaScript. Your input is never uploaded or stored.',
  },
];
