import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'timezone-converter-faq-1',
    question: 'How do I convert a time between two time zones?',
    answer: 'Enter a date and time, pick the timezone it is in under "From", and the timezone you want under "To". The tool reads the entered time as local to the source zone, works out the matching instant, and shows it in the target zone along with the UTC time. For example, 09:00 in New York on 8 July 2026 becomes 22:00 the same day in Tokyo.',
  },
  {
    id: 'timezone-converter-faq-2',
    question: 'What is the time difference between two cities?',
    answer: 'The result includes a time difference line, such as "+13:00", and a plain sentence like "Tokyo is 13h ahead of New York". It is worked out from each zone offset on the exact date you enter, so a summer date and a winter date can give different gaps where daylight saving applies.',
  },
  {
    id: 'timezone-converter-faq-3',
    question: 'Does it handle daylight saving time?',
    answer: 'Yes. Offsets come from your browser IANA timezone database and are read for the specific date you enter, so a conversion in July uses summer time and one in January uses standard time. That is why the difference between two cities is not always fixed across the year.',
  },
  {
    id: 'timezone-converter-faq-4',
    question: 'Why does the converted time show a different day?',
    answer: 'When zones are far apart, the same instant can fall on a different calendar day. Convert an evening time in New York to Tokyo and it is already the next morning there. The tool notes when the conversion crosses into the next or previous day so the date is never ambiguous.',
  },
  {
    id: 'timezone-converter-faq-5',
    question: 'Is my data sent anywhere?',
    answer: 'No. The conversion runs entirely in your browser using its built-in timezone data. Nothing you type is uploaded, stored on a server, or shared, so it works offline once the page has loaded.',
  },
];
