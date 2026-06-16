import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'hed-faq-1',
    question: 'What is hex encoding?',
    answer:
      'Hex encoding converts each byte of data into a two-character hexadecimal string using the digits 0-9 and letters A-F. The character "A" (ASCII value 65) becomes "41" in hex. It is a readable way to display binary data without losing any information.',
  },
  {
    id: 'hed-faq-2',
    question: 'How do I convert text to hex?',
    answer:
      'Paste or type your text into the input field, then select "Encode → Hex" from the mode selector. The tool converts each character to its UTF-8 byte value and displays the result as pairs of hex digits, like "48 65 6c 6c 6f" for "Hello". The output appears instantly.',
  },
  {
    id: 'hed-faq-3',
    question: 'How do I decode hex back to text?',
    answer:
      'Paste your hex string into the input field and select "Decode ← Hex" from the mode selector. The tool reads each pair of hex digits as one byte and converts the sequence back to text. If the input contains invalid characters or an odd number of digits, the tool shows an error.',
  },
  {
    id: 'hed-faq-4',
    question: 'Why does each character produce two hex digits?',
    answer:
      'Each byte has 256 possible values (0-255). A single hex digit covers only 16 values (0-F), so two hex digits are required to represent the full 0-255 range. The letter "A" is byte 65, which in hex is 4 × 16 + 1 = 41. Two digits, always.',
  },
  {
    id: 'hed-faq-5',
    question: 'What characters are valid in a hex string?',
    answer:
      'A valid hex string uses only the characters 0-9 and A-F (or a-f). Spaces, colons, and "0x" prefixes are common separators that many tools add for readability, but you must strip them before decoding. An odd number of hex digits is also invalid, since each byte needs exactly two digits.',
  },
  {
    id: 'hed-faq-6',
    question: 'What is the difference between hex encoding and Base64?',
    answer:
      'Both convert binary data to printable text, but hex is simpler and more readable while Base64 is more compact. Hex output is always twice the byte length of the input. Base64 output is about 33% larger than the input. Developers use hex for debugging and inspecting bytes; they use Base64 when transferring data in JSON or HTML.',
  },
  {
    id: 'hed-faq-7',
    question: "Why does 'A' encode to 41 in hex?",
    answer:
      'The letter "A" has ASCII code 65 in decimal. To convert 65 to hex: 65 divided by 16 is 4 remainder 1, giving "41". Every character has a fixed position in the ASCII (and UTF-8) table, so its hex value is always predictable. "B" is 42, "C" is 43, and so on.',
  },
  {
    id: 'hed-faq-8',
    question: "What does hex value 41 decode to?",
    answer:
      'Hex 41 represents the decimal value 65, which is the ASCII code for the uppercase letter "A". Hex 61 is the lowercase "a". If you paste "41 42 43" into the decoder, you get "ABC". This predictable mapping is what makes hex useful for inspecting raw byte data.',
  },
  {
    id: 'hed-faq-9',
    question: 'Does hex encoding work with non-English text?',
    answer:
      'Yes. The tool encodes text as UTF-8 bytes, so any character, including Chinese, Arabic, emoji, and accented letters, is supported. Multi-byte UTF-8 characters use 2-4 bytes, so they produce 4-8 hex digits rather than the 2 digits that ASCII characters produce.',
  },
  {
    id: 'hed-faq-10',
    question: 'Is hex encoding a form of encryption?',
    answer:
      'No. Hex encoding provides no security. It is a display format, not a protection mechanism. Anyone who sees hex output can decode it instantly with any hex decoder. If you need to protect sensitive data, use encryption such as AES. Using hex for passwords or API keys gives a false sense of security.',
  },
];
