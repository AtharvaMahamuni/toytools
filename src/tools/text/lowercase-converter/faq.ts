import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'lc-faq-1',
    question: 'How do I convert text to lowercase?',
    answer:
      'Paste or type your text and the lowercase version appears instantly. Every capital letter becomes its small equivalent: "HELLO World" becomes "hello world". Click Copy to reuse the result.',
  },
  {
    id: 'lc-faq-2',
    question: 'Where is lowercase text required?',
    answer:
      'Lowercase is the convention for email addresses, URL slugs, hashtags, and many code identifiers (such as Python module names). Normalising input to lowercase also makes text comparisons reliable, since "Email@x.com" and "email@x.com" should usually be treated as the same address.',
  },
  {
    id: 'lc-faq-3',
    question: 'How do I normalize email addresses before storing them?',
    answer:
      'Convert the full address to lowercase before saving it, because the same mailbox can be typed with any capitalization. For example, "Jane.Doe@Example.COM" becomes "jane.doe@example.com", so a second sign-up with different casing matches the existing account instead of creating a duplicate. Paste one address or a whole column of them into this converter, copy the lowercase result, and store that version. Keep the original casing only if you need it for display.',
  },
  {
    id: 'lc-faq-4',
    question: 'Should I normalize text to lowercase or uppercase?',
    answer:
      'Choose lowercase. It is the standard normalization form for emails, usernames, URL slugs, and hashtags, so lowercased values match what other systems already expect. For example, storing "SUPPORT@SHOP.COM" as "support@shop.com" lines up with how mail servers and databases treat addresses, while uppercase is reserved for emphasis, headings, and code constants like MAX_RETRIES. Uppercase normalization works technically, but every web convention points the other way, so lowercase saves you conversion steps later.',
  },
  {
    id: 'lc-faq-5',
    question: 'Why does my comparison still fail after converting to lowercase?',
    answer:
      'You must lowercase both sides of the comparison, not just one. For example, lowercasing user input to "jane@example.com" still fails against a stored "Jane@Example.com"; convert the stored value too and the two strings match. Also check for invisible differences that case conversion never touches: leading or trailing spaces, tabs, and non-breaking spaces. Even case-insensitive matching depends on consistent casing at some layer, so normalize both values to lowercase before comparing.',
  },
  {
    id: 'lc-faq-6',
    question: 'Does it change numbers or symbols?',
    answer:
      'No. Only letters are affected. Digits, punctuation, and symbols are preserved exactly, so "ID-2024!" becomes "id-2024!".',
  },
  {
    id: 'lc-faq-7',
    question: 'Why did some characters not change when I converted to lowercase?',
    answer:
      'Characters without an uppercase form stay exactly as they are: digits, punctuation, emoji, and scripts with no letter case, such as Chinese, Japanese, and Arabic. For example, "PRICE: $49 東京" becomes "price: $49 東京"; only the Latin letters change. Accented capitals do convert, so "ÉTÉ" becomes "été". If a capital appears to survive, check whether it is a lookalike symbol instead of a real letter, because symbols never convert.',
  },
  {
    id: 'lc-faq-8',
    question: 'Will converting text to lowercase ruin names and acronyms?',
    answer:
      'Yes, lowercasing flattens proper nouns and acronyms along with everything else, and that lost capitalization carries meaning. For example, "NASA sent Rover data to London" becomes "nasa sent rover data to london", where "NASA" reads as a plain word and "London" loses its proper-noun signal. Lowercase the copy you use for slugs, tags, or comparisons, and keep the original text for anything a person will read.',
  },
  {
    id: 'lc-faq-9',
    question: 'Does the tool work offline?',
    answer:
      'Yes. After the page loads once, the conversion runs entirely in your browser and needs no internet connection. Your text never leaves your device.',
  },
];
