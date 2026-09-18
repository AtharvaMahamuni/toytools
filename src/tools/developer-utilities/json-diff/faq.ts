import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jd-faq-1',
    question: 'What is a JSON diff?',
    answer:
      'A JSON diff compares two JSON values by structure, not by line. Paste the left document and the right document. The page parses both with JSON.parse, then lists paths that were added, removed, or changed. A path looks like user.name or tags[0]. It is not a pretty-printer and it is not a text diff of the source. For example, moving "name" above "id" is not a change. Changing tags[0] from "a" to "b" is.',
  },
  {
    id: 'jd-faq-2',
    question: 'Does the paste stay on my device?',
    answer:
      'Yes. Both panes are parsed in this tab. Runs entirely on your device. Nothing is uploaded. There is no account and no request when you paste. Open the network panel and compare: the result does not wait on a server. Close the tab and the documents are gone. That matters because JSON handoffs often hold tokens, customer records, or config that should not leave the machine.',
  },
  {
    id: 'jd-faq-3',
    question: 'Why does object key order not count as a change?',
    answer:
      'JSON objects are unordered maps. {"b":1,"a":2} and {"a":2,"b":1} are the same value. Editors, JSON.stringify, and pretty-printers reorder keys all the time. A line diff flags every line. This page does not. The result says the values match, and it says so only when the text itself still differs. If the two pastes are already the same characters, that note stays quiet and the line reads "No differences."',
  },
  {
    id: 'jd-faq-4',
    question: 'Does array order count as a change?',
    answer:
      'Yes. JSON arrays are ordered. [1,2] and [2,1] are different. The page compares index by index, so you see changed [0] and changed [1], not a single "array differs" blob. An extra element is added at its index, for example added tags[2]. A missing element is removed. If you sorted a list on one side only, those index changes are the point. Object key order still does not count inside an element.',
  },
  {
    id: 'jd-faq-5',
    question: 'Are 1 and 1.0 equal?',
    answer:
      'Yes, when both are JSON numbers. JSON.parse turns 1 and 1.0 into the same number, and the page compares numbers with numeric equality. The text still differs, so the result says the values match. A string "1" is not a number 1. true is not 1. null is not 0 and it is not false. Those comparisons are strict. For example, changed qty: 1 to "1" means one side quoted the value.',
  },
  {
    id: 'jd-faq-6',
    question: 'What happens if one side is not valid JSON?',
    answer:
      'The page names the side and the JSON.parse error, and it does not print a diff. Left is not valid JSON and Right is not valid JSON are separate sentences when both fail. A blank pane is only quiet when both panes are blank. One blank side with a document on the other is an error, because an empty string is not JSON. A trailing comma, a single quote, and a comment all fail the same way. Use the JSON formatter if you want a repair. This page will not invent one.',
  },
  {
    id: 'jd-faq-7',
    question: 'How do I read a changed path?',
    answer:
      'Each line starts with added, removed, or changed, then a path, then the value. Dot paths are object keys that are plain names, such as user.email. Bracket paths are array indexes or awkward keys, such as tags[0] or ["a.b"]. The summary counts how many of each kind. A long value is cut with an ellipsis so one field cannot fill the page. When more than 40 paths differ, the page shows the first 40 and says how many exist.',
  },
  {
    id: 'jd-faq-8',
    question: 'Why not use a text diff on the two files?',
    answer:
      'A text diff compares lines. Indentation, key order, and 1 versus 1.0 all look like edits even when the values match. A real change, such as flags[2] going from false to true, sits inside that noise and is easy to miss. This page ignores the noise and names the path. Use CSV Diff when the files are tables. Use a line diff when you actually care about the source text, including spacing. Those are different jobs.',
  },
  {
    id: 'jd-faq-9',
    question: 'Does this pretty-print JSON?',
    answer:
      'No. Pretty-printing is the JSON formatter. This page will not reformat either side as its result. If the only difference is spacing, the result says the values match. If you need indented JSON, open the formatter after you are sure the values are the ones you wanted. Mixing the two jobs is how a "diff" tool starts hiding the path that changed under a full reprint of the file.',
  },
  {
    id: 'jd-faq-10',
    question: 'Can it compare JSON against YAML or a schema?',
    answer:
      'No. Both panes must be JSON. YAML belongs in the YAML to JSON converter before you compare. JSON Schema, merge, and three-way diff are out of scope. Duplicate keys are whatever JSON.parse keeps, which is the last value. The page does not warn that an earlier key was dropped, because the parser already dropped it on both sides the same way. Paste the documents you mean, not a schema that describes them.',
  },
  {
    id: 'jd-faq-11',
    question: 'What does a path look like for a nested edit?',
    answer:
      'Nested objects use dots. Nested arrays use indexes. A change inside the first item is items[0].qty, not a reprint of items[0]. If the types disagree, the path stops there. For example, changed user: {"id":1} to [1] means the right side replaced an object with an array. The page does not pretend the old id was removed and a new index added. That would invent a structure the right side does not have.',
  },
  {
    id: 'jd-faq-12',
    question: 'What if the numbers are larger than JavaScript can tell apart?',
    answer:
      'JSON numbers are parsed as JavaScript numbers before they are compared. Integers past 2^53, about 9007199254740992, can collapse to the same value even when the source digits differ. For example, 9007199254740993 and 9007199254740992 are not distinct after parse. If you need those digits preserved, quote them as strings and compare the strings. The page will then treat a one-digit change as a real change.',
  },
];
