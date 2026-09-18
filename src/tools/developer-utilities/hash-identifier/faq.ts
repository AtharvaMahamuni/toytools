import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'hi-faq-1',
    question: 'What is a hash identifier?',
    answer:
      'A hash identifier reads a digest you already have. It does not create one. Paste one line, or up to 20, and each line is named by length: MD5 is 32 hex characters, SHA-1 is 40, SHA-256 is 64, SHA-512 is 128, and CRC32 is 8. A length outside that set is truncated or unknown. The page will not guess a neighbor. For example, 64 hex characters are SHA-256, and 40 are SHA-1.',
  },
  {
    id: 'hi-faq-2',
    question: 'Does the paste stay on my device?',
    answer:
      'Yes. The paste stays on your device. Runs entirely on your device. Nothing is uploaded. A file you pick is read with the browser file reader and hashed in this tab. There is no account and no upload request. Open the network panel while you paste: identifying makes no request. Close the tab when you are done, and nothing was stored on a server.',
  },
  {
    id: 'hi-faq-3',
    question: 'Which algorithms can this recognize?',
    answer:
      'Five. MD5 is 32 hex characters, SHA-1 is 40, SHA-256 is 64, SHA-512 is 128, and CRC32 is 8. Those widths come from RFC 1321, FIPS 180-4, and the IEEE CRC-32 used by zip files. If two algorithms shared a length, the line would say so. These five do not overlap, so a match is one name. HMAC, SHA-384, and password cracking are out of scope.',
  },
  {
    id: 'hi-faq-4',
    question: 'Why is a SHA-1 length not SHA-256?',
    answer:
      'SHA-256 is 64 hex characters. SHA-1 is 40. A 40 character digest cannot be a SHA-256 result. The common mistake is to paste a SHA-1 value into a SHA-256 checker, see a mismatch, and blame the file. This page names the length first. For example, aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d is the SHA-1 of the word hello, not a broken SHA-256.',
  },
  {
    id: 'hi-faq-5',
    question: 'What happens if the digest is truncated?',
    answer:
      'A length that matches none of the five is truncated or unknown. The page does not pick the nearest algorithm. SHA-224 is 56 hex characters and SHA-384 is 96, and neither is in the set, so both stay unknown. For example, dropping the last four characters of a SHA-256 digest leaves 60 hex characters. That line says truncated or unknown. Paste the full digest before you verify.',
  },
  {
    id: 'hi-faq-6',
    question: 'Does a case difference count as a mismatch?',
    answer:
      'No. Hex is the same in upper case and lower case. Windows certutil prints upper case, and this page prints lower case. If the only difference is case, the result still matches, and the line says so. A real mismatch is a different digit, not a different case. For example, 2CF24DBA and 2cf24dba are the same start of the SHA-256 of the word hello.',
  },
  {
    id: 'hi-faq-7',
    question: 'What does a sha256sum line look like?',
    answer:
      'Two shapes. Text mode is the hex digest, two spaces, then the filename. Binary mode is the hex digest, one space, an asterisk, then the filename. For example, 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  hello.txt. The filename is stripped before the length is measured, and the result line says a trailing filename was stripped. A single space is not that format.',
  },
  {
    id: 'hi-faq-8',
    question: 'How do I verify a file without uploading it?',
    answer:
      'Pick the file with the file control. The browser reads the bytes locally and hashes them with the algorithm you picked, or with the one inferred from the digest. The bytes stay on this device. Runs entirely on your device. Nothing is uploaded. Files over 32 MB are refused so the tab does not freeze, and that refusal is local too. Text in the other box is ignored while a file is selected.',
  },
  {
    id: 'hi-faq-9',
    question: 'Why does pasted text fail to match a file checksum?',
    answer:
      'Because the two inputs are not the same bytes. Text is hashed as UTF-8. A file is hashed as the raw bytes, including a trailing newline you did not paste. For example, the SHA-256 of hello with no newline is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824. Add a newline and the digest changes. Use the file control when the checksum was of a file.',
  },
  {
    id: 'hi-faq-10',
    question: 'Is CRC32 the same kind of hash as SHA-256?',
    answer:
      'No. CRC32 is an 8 character checksum for accidental change, such as a damaged zip. It is easy to forge, so it is not a security check. SHA-256 is a 64 character cryptographic digest. Use CRC32 when the publisher printed CRC32. Use SHA-256 when they printed SHA-256. Length tells you which check you should run. Confusing the two is a mismatch that says nothing about the file.',
  },
  {
    id: 'hi-faq-11',
    question: 'Can this crack a hash or find the original text?',
    answer:
      'No. A digest is one way. This page will not search for an input that produces your hash, and it does not send the digest anywhere to be looked up. Generating a new digest is a different job. Use the SHA-256 generator or the MD5 generator when you already have the text. This page only identifies a digest you were given and compares it.',
  },
  {
    id: 'hi-faq-12',
    question: 'When should I use a hash generator instead?',
    answer:
      'Use a generator when you do not have a digest yet and you want to create one. Use this page when someone handed you a digest and you need the algorithm, or whether your text or file matches. The generators compare against one algorithm you already chose. This page starts from the digest and infers the algorithm when the length matches exactly one of the five.',
  },
];
