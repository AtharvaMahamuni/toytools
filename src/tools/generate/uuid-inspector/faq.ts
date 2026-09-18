import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: "uuid-inspector-faq-1",
    question: "What is a UUID inspector?",
    answer:
      "A UUID inspector reads an identifier you already have. It does not create a new one. Paste one value, or one per line, and each line is marked valid or invalid. A valid line shows the version and the variant. Version 1, version 6, and version 7 also show the time stored in the bits, in UTC. An invalid line gets one reason, such as wrong length or bad hex. Check the value here before a database does.",
  },
  {
    id: "uuid-inspector-faq-2",
    question: "Does the paste stay on my device?",
    answer:
      "Yes. The paste stays on your device. Runs entirely on your device. Nothing is uploaded. There is no account, and the page does not send the value to a UUID service. Open the network panel while you paste: inspecting makes no request. The reading exists only in this tab. Close it when you are done, and nothing was stored on a server.",
  },
  {
    id: "uuid-inspector-faq-3",
    question: "What versions can this read?",
    answer:
      "It labels nil, max, version 1 through version 8, and unknown. Nil is the all-zero value. Max is the all-ones value. Both are special, not a normal version 4. Version 2 is the rare DCE security form, and version 8 is a custom layout. The tool names those versions and does not pretend to decode their extra fields. A nibble outside 1 through 8, other than nil and max, is unknown.",
  },
  {
    id: "uuid-inspector-faq-4",
    question: "Why can a version 4 UUID look fine when a system wants version 7?",
    answer:
      "A v4 looks fine to a human even when a system wants v7. Both are 36 characters with the same hyphens, so a glance cannot tell them apart. The version is one hex digit in the third group. Version 4 means random bits. Version 7 means a Unix time in milliseconds plus random bits. Set Expected version to 7 and a version 4 line is marked not version 7. The check stays quiet when you leave it on Any version.",
  },
  {
    id: "uuid-inspector-faq-5",
    question: "What happens if I paste a truncated UUID?",
    answer:
      "A truncated UUID fails here before a database rejects it. Drop one character and the line says wrong length, instead of a later error about some other column. For example, a string that stops after the third group is not 32 hex digits, so it is invalid here. Fix the copy, then paste again. The database never has to be the first checker.",
  },
  {
    id: "uuid-inspector-faq-6",
    question: "Do I need hyphens in the UUID?",
    answer:
      "No. Hyphenated form and a plain 32-hex string are both valid. A missing hyphen is not an error, because the compact form is the same 128 bits. Wrong hyphen positions are different: if the digits are 32 hex characters but the dashes sit in the wrong places, the line says hyphens are in the wrong places. Letters may be upper or lower case. A UUID does not change when you change case.",
  },
  {
    id: "uuid-inspector-faq-7",
    question: "What is the nil UUID?",
    answer:
      "The nil UUID is 00000000-0000-0000-0000-000000000000. Every bit is zero. People use it as a placeholder for no value. It is not a normal version 4, and it is not a random draw that happened to be small. This tool calls it nil UUID. Its variant bits read as NCS, which the spec notes, and that label is not a reason to treat the value as a real identifier.",
  },
  {
    id: "uuid-inspector-faq-8",
    question: "What is the max UUID?",
    answer:
      "The max UUID is every bit set to one, written as ffffffff-ffff-ffff-ffff-ffffffffffff. It is a sentinel, the opposite of nil, sometimes used as the end of a range. It is not a version 4 and not a version 15 you should store as an id. This tool calls it max UUID. The variant bits fall in the future range, which the line also shows.",
  },
  {
    id: "uuid-inspector-faq-9",
    question: "What does the variant tell me?",
    answer:
      "The variant is the top bits of the fourth group. When those bits are 10, the line says RFC 4122, which is the layout almost every modern UUID uses, including versions 1 through 8. Older layouts still appear. If the bits say so, the line says NCS, Microsoft, or future instead. A value can look well formed and still be the wrong layout. The variant is how you see that.",
  },
  {
    id: "uuid-inspector-faq-10",
    question: "Which versions show a timestamp?",
    answer:
      "Only version 1, version 6, and version 7. Version 1 and version 6 store 100-nanosecond ticks since 15 October 1582, and the line shows that instant in UTC down to that precision. Version 7 stores Unix milliseconds, so the line stops at milliseconds and does not invent finer digits. Version 4 has no time. Version 3 and version 5 are name hashes. None of those get a clock.",
  },
  {
    id: "uuid-inspector-faq-11",
    question: "How is this different from the UUID generator?",
    answer:
      "The UUID generator mints a new version 4 value. This tool reads one you already copied from a log, an API, or a row. Use the generator when you need a fresh id. Use the inspector when something rejected an id and you need the version, the variant, or the time. They sit next to each other because the job often starts in one and ends in the other. This page does not generate.",
  },
  {
    id: "uuid-inspector-faq-12",
    question: "How many UUIDs can I paste at once?",
    answer:
      "Up to 50 non-blank lines. Blank lines are skipped, so a trailing newline does not count. Paste more than 50 and the tool checks the first 50 and says how many were left out. It does not silently drop them. There is no file upload. Paste from the clipboard. Each line is independent, so one bad line does not hide the rest.",
  },
];
