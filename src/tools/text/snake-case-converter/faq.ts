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
      'It is snake_case in all capitals ("MAX_RETRY_COUNT") used for constants in many languages. To produce it, convert to snake_case here and then use the uppercase converter.',
  },
  {
    id: 'snk-faq-4',
    question: 'How are different input formats handled?',
    answer:
      'Spaces, hyphens, existing underscores, and camelCase humps are all treated as word boundaries. So "first-name", "firstName", and "First Name" all become "first_name". Each line is converted independently.',
  },
  {
    id: 'snk-faq-5',
    question: 'How do I turn spreadsheet headers into database column names?',
    answer:
      'Paste the headers with one label per line; each line converts independently, so a whole header row becomes a ready list of snake_case column names. For example, "Order Date" becomes order_date and "Customer ID" becomes customer_id. Punctuation such as parentheses and slashes counts as a boundary and is dropped, so "Price (USD)" becomes price_usd, a name you can paste straight into a CREATE TABLE statement.',
  },
  {
    id: 'snk-faq-6',
    question: 'Should I use snake_case or camelCase for variable names?',
    answer:
      'Match the convention of the language you are writing: snake_case belongs to Python, Ruby, Rust, and SQL, while camelCase belongs to JavaScript, TypeScript, Java, and Swift. For example, the same field is naturally user_name in a Python model and userName in the JavaScript client that reads it. Pick per file by language, never per personal taste; every mainstream linter flags the wrong style, and reviewers will too.',
  },
  {
    id: 'snk-faq-7',
    question: 'Why did the number in my text get its own underscore?',
    answer:
      'A digit group becomes its own underscore-separated section whenever a space, hyphen, or other separator touches it in the input; digits glued directly to letters stay in the same word. For example, "base64 encode" becomes base64_encode, but "base 64 encode" becomes base_64_encode, and "utf-8" becomes utf_8. To keep a number attached to a word, delete the separator before converting. One extra rule: a digit followed by a capital starts a new word, so "item2Name" becomes item2_name.',
  },
  {
    id: 'snk-faq-8',
    question: 'How do I create an environment variable name from a phrase?',
    answer:
      'Convert the phrase to snake_case here, then uppercase the result, since environment variables use the SCREAMING_SNAKE_CASE form. For example, "database connection timeout" becomes database_connection_timeout, and uppercasing gives DATABASE_CONNECTION_TIMEOUT, ready for a .env file or a shell export line. Underscores matter here: POSIX shells reject hyphens in variable names, so a kebab-case key like api-key must pass through this converter first, yielding api_key and then API_KEY.',
  },
];
