import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'uuid-generator-faq-1',
    question: 'What is a UUID?',
    answer:
      'A UUID is a Universally Unique Identifier: a 128-bit value written as 36 characters, like `f47ac10b-58cc-4372-a567-0e02b2c3d479`. It is a label you can generate anywhere, at any time, with near-zero chance of ever producing the same one twice. That lets separate systems create ids independently without a central authority handing them out.',
  },
  {
    id: 'uuid-generator-faq-2',
    question: 'What does UUID stand for, and is GUID the same thing?',
    answer:
      'UUID stands for Universally Unique Identifier. GUID stands for Globally Unique Identifier and is Microsoft\'s name for the same 128-bit value. They are interchangeable in practice. If a tool asks for a GUID, a UUID from this generator will work.',
  },
  {
    id: 'uuid-generator-faq-3',
    question: 'What version does this generator produce?',
    answer:
      'Version 4, the random variant. A v4 UUID fills almost all of its bits with random data, apart from a few fixed bits that mark the version and variant. It is the most common kind because it needs no timestamp, MAC address, or coordination, which makes it simple and private to generate.',
  },
  {
    id: 'uuid-generator-faq-4',
    question: 'How do I use this UUID generator?',
    answer:
      'Set how many UUIDs you want, then adjust the format if needed: keep or drop the hyphens, and choose lowercase or uppercase. The results appear right away. Press Copy to grab them all, or Regenerate for a fresh batch. One UUID is the default; raise the count for bulk output.',
  },
  {
    id: 'uuid-generator-faq-5',
    question: 'What does a version 4 UUID look like?',
    answer:
      'It is five groups of hexadecimal digits separated by hyphens, in an 8-4-4-4-12 pattern. The 13th digit is always 4 (the version), and the 17th is 8, 9, a, or b (the variant). For example, in `f47ac10b-58cc-4372-a567-0e02b2c3d479` you can see the 4 marking it as version 4.',
  },
  {
    id: 'uuid-generator-faq-6',
    question: 'Are UUIDs guaranteed to be unique?',
    answer:
      'Not guaranteed, but the odds of a repeat are so small they are ignored in practice. A version 4 UUID has 122 random bits, giving about 5 times 10 to the 36th power possibilities. You would need to generate billions per second for many years before a collision became likely. For real workloads, treat them as unique.',
  },
  {
    id: 'uuid-generator-faq-7',
    question: 'Is this UUID generator safe and private?',
    answer:
      'Yes. Every UUID is generated on your device with the browser\'s cryptographic random source. Nothing is sent to a server, logged, or stored remotely. You can open your browser network tools and confirm that generating UUIDs makes no requests.',
  },
  {
    id: 'uuid-generator-faq-8',
    question: 'Does the UUID generator work offline?',
    answer:
      'Yes. After the page loads once, it needs no internet connection. Generation runs entirely in local JavaScript, so you can disconnect and keep producing UUIDs. This also means no server ever sees the values you make.',
  },
  {
    id: 'uuid-generator-faq-9',
    question: 'Can I generate multiple UUIDs at once?',
    answer:
      'Yes. Set the count to the number you need, up to 100 at a time, and the tool lists them one per line. Copy grabs the whole list. This is handy for seeding a database, filling a test fixture, or preparing a batch of ids in advance.',
  },
  {
    id: 'uuid-generator-faq-10',
    question: 'How do I copy all the generated UUIDs?',
    answer:
      'Press the Copy button and every UUID currently shown is placed on your clipboard, one per line. You can then paste them straight into a spreadsheet, a code file, or a database script. There is no need to select them by hand.',
  },
  {
    id: 'uuid-generator-faq-11',
    question: 'Can I remove the hyphens?',
    answer:
      'Yes. Turn off the hyphens option and each UUID becomes a plain 32-character hexadecimal string. Some systems and URL formats prefer this compact form. The value is identical; only the display format changes.',
  },
  {
    id: 'uuid-generator-faq-12',
    question: 'Can I get uppercase UUIDs?',
    answer:
      'Yes. Enable the uppercase option and the letters a through f become A through F. UUIDs are case-insensitive by definition, so uppercase and lowercase forms represent the same value, but some systems display or expect one style.',
  },
  {
    id: 'uuid-generator-faq-13',
    question: 'When should I use a UUID instead of a normal id?',
    answer:
      'Use a UUID when ids must be created in more than one place without coordination: across microservices, on a client before it reaches the server, or in an offline app that syncs later. A plain auto-incrementing number is simpler when a single database controls all inserts.',
  },
  {
    id: 'uuid-generator-faq-14',
    question: 'What is the difference between UUID v4 and v1?',
    answer:
      'Version 1 builds the id from a timestamp and the machine\'s network address, so it can leak when and where it was made and it roughly sorts by time. Version 4 is almost entirely random, reveals nothing about its origin, and does not sort by time. This tool generates v4, the safer default for most uses.',
  },
  {
    id: 'uuid-generator-faq-15',
    question: 'Can I use a UUID as a password or security token?',
    answer:
      'It is better than nothing but not ideal. A v4 UUID has 122 bits of randomness, which is strong, but the fixed version and variant bits and the well-known format make it a poor secret. For tokens and passwords, use a dedicated random string or password generator that gives you full control over length and character set.',
  },
  {
    id: 'uuid-generator-faq-16',
    question: 'Do UUIDs sort in the order I created them?',
    answer:
      'No, not version 4. Because the value is random, two UUIDs made a second apart have no order between them. If you need time-ordered ids, add a separate timestamp column, or use a time-based id scheme. Do not rely on a v4 UUID to tell you what came first.',
  },
  {
    id: 'uuid-generator-faq-17',
    question: 'Are UUIDs secret or hard to guess?',
    answer:
      'A v4 UUID is hard to guess because most of it is random, but you should not treat it as a secret. It often appears in URLs, logs, and API responses, so assume anyone might see it. Use it as an identifier, not as an access key.',
  },
  {
    id: 'uuid-generator-faq-18',
    question: 'How should I store a UUID in a database?',
    answer:
      'If your database has a native UUID type, use it. It stores the value in 16 bytes and validates the format. Storing a UUID as a 36-character string works too but uses more space and skips that validation. Either way, index the column if you look records up by id.',
  },
  {
    id: 'uuid-generator-faq-19',
    question: 'Why did my database reject the UUID?',
    answer:
      'Usually a format mismatch. A native UUID column expects the hyphenated form, so if you stripped the hyphens it may fail. Some columns are also case-sensitive about how they store text. Re-enable hyphens, match the expected case, and try again.',
  },
  {
    id: 'uuid-generator-faq-20',
    question: 'Which browsers does the UUID generator work in?',
    answer:
      'All current browsers, including Chrome, Firefox, Safari, and Edge, on desktop and mobile. It uses standard Web Crypto features that have been supported for years. If secure randomness is unavailable, the tool reports an error rather than producing a weak value.',
  },
  {
    id: 'uuid-generator-faq-21',
    question: 'Does the tool remember the UUIDs I generate?',
    answer:
      'No. The UUIDs themselves are never saved. The tool only remembers your options, such as the count and format toggles, in your browser\'s local storage so the form looks familiar next time. That preference stays on your device and holds no generated values.',
  },
  {
    id: 'uuid-generator-faq-22',
    question: 'Is any UUID data uploaded or shared?',
    answer:
      'No. There is no account, no server call, and no analytics tied to the values you generate. UUIDs are created and shown entirely in your browser. The only thing kept is your local option preference, which never contains a UUID.',
  },
];
