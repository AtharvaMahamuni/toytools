import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cml-faq-1',
    question: 'What is camelCase?',
    answer:
      'camelCase joins words with no separators, lowercasing the first word and capitalizing the first letter of each word after it: "user profile image" becomes "userProfileImage". It is widely used for variable and function names in JavaScript, TypeScript, Java, and Swift.',
  },
  {
    id: 'cml-faq-2',
    question: 'How is camelCase different from PascalCase?',
    answer:
      'In camelCase the first letter is lowercase ("myValue"); in PascalCase every word is capitalized including the first ("MyValue"). camelCase is typical for variables and functions, while PascalCase is typical for classes and components.',
  },
  {
    id: 'cml-faq-3',
    question: 'How does the converter split my text into words?',
    answer:
      'It treats spaces, hyphens, underscores, and other non-alphanumeric characters as word boundaries, and also splits existing camelCase humps. So "first-name", "first_name", and "First Name" all become "firstName".',
  },
  {
    id: 'cml-faq-4',
    question: 'What happens with multiple lines?',
    answer:
      'Each line is converted independently, so a list of phrases becomes a list of camelCase identifiers, one per line. Blank lines are preserved.',
  },
];
