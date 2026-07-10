import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'unix-timestamp-converter-faq-1',
    question: 'How do I convert a Unix timestamp to a date?',
    answer: 'Keep the direction on "Timestamp to date", paste the number, and choose whether it is in seconds or milliseconds. The tool shows the moment in UTC, the ISO 8601 string, your local time, and the day of the week. For example, 1700000000 seconds is 22:13:20 UTC on Tuesday 14 November 2023.',
  },
  {
    id: 'unix-timestamp-converter-faq-2',
    question: 'How do I convert a date to a Unix timestamp?',
    answer: 'Switch the direction to "Date to timestamp" and enter a date and time. That time is read as UTC, so the result is the same everywhere, and you get the timestamp in both seconds and milliseconds. For example, 14 November 2023 at 22:13:20 UTC is the timestamp 1700000000.',
  },
  {
    id: 'unix-timestamp-converter-faq-3',
    question: 'Is a Unix timestamp in seconds or milliseconds?',
    answer: 'Both are common. Classic Unix time counts seconds since the epoch, while JavaScript and many APIs use milliseconds, which are 1000 times larger. If a timestamp converts to a date far in the future, it is almost certainly milliseconds being read as seconds. Pick the matching unit before converting.',
  },
  {
    id: 'unix-timestamp-converter-faq-4',
    question: 'What is the Unix epoch?',
    answer: 'The Unix epoch is midnight UTC on 1 January 1970. A Unix timestamp is simply the number of seconds (or milliseconds) that have elapsed since that instant. Times before 1970 are negative. Because the count starts from UTC, a timestamp carries no timezone of its own.',
  },
  {
    id: 'unix-timestamp-converter-faq-5',
    question: 'Is my data sent anywhere?',
    answer: 'No. The conversion runs entirely in your browser using your device clock and built-in timezone data. Nothing you type is uploaded, stored on a server, or shared, so it works offline once the page has loaded.',
  },
];
