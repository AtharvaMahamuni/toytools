import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'snk-faq-1',
    question: 'What is snake_case?',
    answer:
      'snake_case writes all letters in lowercase and joins words with underscores: "user profile image" becomes "user_profile_image". It is the dominant convention in Python for variables and functions, and in SQL for column and table names.',
  },
  {
    id: 'snk-faq-2',
    question: 'Why do Python and SQL prefer snake_case?',
    answer:
      'Underscores make multi-word names easy to read without ambiguity, and lowercase identifiers sort and compare predictably. SQL keywords are case-insensitive, so lowercase snake_case avoids surprises across databases.',
  },
  {
    id: 'snk-faq-3',
    question: 'What is SCREAMING_SNAKE_CASE?',
    answer:
      'It is snake_case in all capitals — "MAX_RETRY_COUNT" — used for constants in many languages. To produce it, convert to snake_case here and then use the uppercase converter.',
  },
  {
    id: 'snk-faq-4',
    question: 'How are different input formats handled?',
    answer:
      'Spaces, hyphens, existing underscores, and camelCase humps are all treated as word boundaries. So "first-name", "firstName", and "First Name" all become "first_name". Each line is converted independently.',
  },
];
