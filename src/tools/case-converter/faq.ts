import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cc-faq-1',
    question: 'What is text case conversion?',
    answer:
      'Text case conversion is the process of changing the capitalization pattern of a string — for example, turning "hello world" into "Hello World" or "HELLO_WORLD". It is useful in writing for consistency and in programming where variable naming conventions require specific formats like camelCase or snake_case.',
  },
  {
    id: 'cc-faq-2',
    question: 'What is the difference between camelCase and PascalCase?',
    answer:
      'In camelCase, the first word is lowercase and subsequent words start with a capital letter: "myVariableName". In PascalCase (also called UpperCamelCase), every word starts with a capital letter: "MyVariableName". camelCase is common for variable and function names in JavaScript; PascalCase is common for class names and React components.',
  },
  {
    id: 'cc-faq-3',
    question: 'When should I use snake_case vs kebab-case?',
    answer:
      'snake_case uses underscores to separate words and is common in Python variables, database column names, and file names: "user_profile_image". kebab-case uses hyphens and is common in CSS class names, HTML attributes, and URL slugs: "user-profile-image". The choice usually follows the convention of the language or system you are working in.',
  },
  {
    id: 'cc-faq-4',
    question: 'What is Title Case and when should I use it?',
    answer:
      'Title Case capitalizes the first letter of each major word: "The Quick Brown Fox". It is used for headings, article titles, book titles, and proper names. Style guides (AP, Chicago, APA) differ on which words to capitalize — generally short prepositions and articles like "a", "the", and "of" are kept lowercase unless they start the title.',
  },
  {
    id: 'cc-faq-5',
    question: 'What is sentence case?',
    answer:
      'Sentence case capitalizes only the first letter of the first word and any proper nouns, just like a regular sentence: "The quick brown fox". It is the default format for body text and is often preferred over Title Case for UI labels, button text, and subheadings because it reads more naturally.',
  },
  {
    id: 'cc-faq-6',
    question: 'Does case conversion affect numbers or special characters?',
    answer:
      'No. Numbers, punctuation, and special characters are unaffected by case conversion — only alphabetic letters change. For example, converting "hello-world_2024!" to uppercase gives "HELLO-WORLD_2024!". The hyphens, underscores, numbers, and exclamation mark remain exactly as they are.',
  },
  {
    id: 'cc-faq-7',
    question: 'Why do programming languages use different naming conventions?',
    answer:
      'Different languages developed their own conventions based on community standards, language syntax, and readability preferences. Python adopted snake_case because underscores read clearly without ambiguity. JavaScript and Java use camelCase. CSS uses kebab-case because hyphens are valid in property names. Following the convention of your language makes code consistent and easier for others to read.',
  },
  {
    id: 'cc-faq-8',
    question: 'Can I use this tool to fix inconsistent capitalization in my text?',
    answer:
      'Yes. Paste your text, choose the case style that matches your target format, and copy the result. This is useful for normalizing data from multiple sources, fixing copy-pasted content with random capitalization, or preparing variable names before inserting them into code.',
  },
];
