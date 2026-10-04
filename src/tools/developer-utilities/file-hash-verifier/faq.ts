import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'file-hash-verifier-faq-1',
    question: 'How do I hash a file in the browser?',
    answer:
      'Choose the file with the file control. Leave SHA-256 selected unless the download page names another algorithm. The digest appears under the file name, with the size in bytes. Copy takes the hex. Paste the published line into Expected digest. The page says match, mismatch, or wrong length. The bytes stay on your device. Nothing is uploaded.',
  },
  {
    id: 'file-hash-verifier-faq-2',
    question: 'What is a SHA256 file checksum?',
    answer:
      'A SHA256 checksum is 64 hex characters made from the file bytes. Change one byte and the whole string changes. Download pages print it so you can see that the file you saved is the file they published. This page writes the same digest as sha256sum on the same bytes. People write that name as sha256, and the digest is still those 64 hex characters.',
  },
  {
    id: 'file-hash-verifier-faq-3',
    question: 'How do I verify a download checksum?',
    answer:
      'Copy the line from the download page into Expected digest. A sha256sum line is fine. The page keeps the first hex token and drops the filename after the spaces. When the lengths match and the hex matches, the line says Matches. When the length is 32, 40, or 128, the line names MD5, SHA-1, or SHA-512 instead of calling the file corrupt.',
  },
  {
    id: 'file-hash-verifier-faq-4',
    question: 'Why does an empty file still have a hash?',
    answer:
      'Zero bytes is a real input. SHA-256 of an empty file is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. CRC32 of the same file is 00000000. A failed download is also zero bytes, so the digest matches the empty file and not the ISO you wanted. The note under the digest says the file is 0 bytes. Check the size before you trust the match.',
  },
  {
    id: 'file-hash-verifier-faq-5',
    question: 'What if the file is larger than 32 MB?',
    answer:
      'SHA-256 and CRC32 read the file in 1 MB slices, so a multi-gigabyte ISO does not have to sit in one array. MD5, SHA-1, and SHA-512 still hash in one shot. Above 32 MB those three stop, and the note offers Use SHA-256. That button switches the menu and hashes the same file in slices. The tab stays up because the page never asks for the whole ISO at once.',
  },
  {
    id: 'file-hash-verifier-faq-6',
    question: 'Is MD5 enough to check a download?',
    answer:
      'MD5 is 32 hex characters. Use it when the publisher printed MD5 and nothing else. It is a weak fingerprint for security, because collisions exist, so a careful attacker can build a different file with the same MD5. For a normal mirror check it still catches a truncated download. If the page also prints SHA-256, use SHA-256. The menu defaults there for that reason.',
  },
  {
    id: 'file-hash-verifier-faq-7',
    question: 'Does this upload my file?',
    answer:
      'No. The hash runs in the browser on the bytes you chose. There is no form post and no hash server. Closing the tab drops the file from memory. The line under the file control says the same thing: nothing is uploaded. A chat box cannot do this job, because sending the file to a model would be an upload. Keep the ISO here.',
  },
  {
    id: 'file-hash-verifier-faq-8',
    question: 'Why did a sha256sum line fail to match?',
    answer:
      'sha256sum prints the digest, two spaces, then the filename. Pasting that whole line into a box that keeps every character makes the digest look longer than 64 hex characters. This page takes the first token, so archive.bin falls away and the hex is what gets compared. Uppercase hex from certutil is folded to lowercase. A colon prefix such as sha256: is stripped too.',
  },
  {
    id: 'file-hash-verifier-faq-9',
    question: 'What is the difference between CRC32 and SHA-256?',
    answer:
      'CRC32 is 8 hex characters. It catches accidental bit flips in a zip or a disk block. It is not a security hash. SHA-256 is 64 hex characters and is the checksum download pages use when they care about tampering. Both algorithms here read the file in slices, so size is not the reason to pick one. Pick the algorithm whose length matches the line you were given.',
  },
  {
    id: 'file-hash-verifier-faq-10',
    question: 'Can I hash text on this page?',
    answer:
      'This page hashes a file you choose, not a string you type. Text and file bytes differ once the editor adds a newline or changes line endings. For a sentence, open the SHA-256 hash generator and paste the text there. For a download, stay here and choose the file. The two digests will not match, and that difference is the file, not a bug.',
  },
];
