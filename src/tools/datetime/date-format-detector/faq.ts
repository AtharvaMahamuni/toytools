import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'date-format-detector-faq-1',
    question: 'Is this date DD/MM or MM/DD?',
    answer:
      'Both, until a locale says otherwise. Day first, 03/04/2026 is 3 April 2026. Month first, it is 4 March 2026. The page shows those two readings and does not pick one. A spreadsheet that assumes a US locale stores 4 March. The other rows where both numbers are 12 or under do the same.',
  },
  {
    id: 'date-format-detector-faq-2',
    question: 'How will this date be parsed?',
    answer:
      'One date per line, with no locale chosen and no zone invented. A row where both numbers are 12 or under shows both civil dates when those days differ. A row with a number above 12 shows the only order that is a real calendar day, and is unreadable when that day does not exist. Named months and an ISO 8601 date have one reading when the day exists. An unreadable row says why, such as mixed separators, a compact date like 20250403, or an ordinal like 3rd. The first 200 lines are read, and the note says where it stopped. The paste itself is left as you typed it.',
  },
  {
    id: 'date-format-detector-faq-3',
    question: 'Which rows in this column are an ambiguous date format?',
    answer:
      'The rows where both numbers are 12 or under and the two orders are different days. 03/04/2026 is one. 08/08/2026 is not, because both orders are 8 August. 13/04/2026 is not, because month 13 does not exist. 2026-04-03 is not, because the year comes first. When a line such as 13/04/2026 only works day first and no line only works month first, the hero says Day first, cites that line, and reads the ambiguous rows that way. Month first works the same. When one line only works day first and another only month first, the hero says Mixed and the rows stay ambiguous. With no deciding line, the hero counts the ambiguous rows. Open How this was worked out for the line numbers. The first 20 rows are written out.',
  },
  {
    id: 'date-format-detector-faq-4',
    question: 'How are two-digit years read?',
    answer:
      '00 to 69 are read as 2000 to 2069. 70 to 99 are read as 1970 to 1999. So 03/04/26 is 2026, and 03/04/70 is 1970. The row is marked Two-digit year because a source system splits the century at a different year. The page states this pivot under How this was worked out.',
  },
  {
    id: 'date-format-detector-faq-5',
    question: 'What happens to a timestamp with no time zone?',
    answer:
      '2026-04-03T18:00:00 keeps the civil date 3 April 2026 and is counted under Missing zone. The same instant with a Z, as in 2026-04-03T18:00:00Z, is not. A time with no offset can fall on the previous or next civil day once a zone is applied. The tool does not invent that zone. A date with no time, such as 2026-04-03, is not flagged.',
  },
  {
    id: 'date-format-detector-faq-6',
    question: 'Is the list uploaded?',
    answer:
      'No. The check runs in the browser. Nothing is uploaded. A column of dates from a spreadsheet can still be personal, which is why the page does not write it into the address on its own. Copy link builds a link only when you ask.',
  },
];
