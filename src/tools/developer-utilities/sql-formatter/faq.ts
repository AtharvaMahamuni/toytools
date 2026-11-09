import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sql-fmt-1',
    question: 'What does the SQL Formatter change?',
    answer:
      'Only layout. Keywords are uppercased, major clauses start on their own line, and nested lists inside parentheses are indented by two spaces. String literals, comments, numbers and identifiers stay exactly as you typed them, including escaped quotes like O\'\'Brien.',
  },
  {
    id: 'sql-fmt-2',
    question: 'Which SQL dialects does it understand?',
    answer:
      'The keyword list covers everyday Postgres, MySQL and SQLite: SELECT, JOIN variants, GROUP BY, ORDER BY, WITH, RETURNING, dollar-quoted strings, and the usual aggregates. Exotic vendor extensions are treated as ordinary identifiers and left alone, which is safe for readability.',
  },
  {
    id: 'sql-fmt-3',
    question: 'Is my query sent to a server?',
    answer:
      'No. Formatting runs entirely in your browser. Nothing leaves this tab, nothing is stored remotely, and the page keeps working after you disconnect. That is the point of a formatter you can use on production queries.',
  },
  {
    id: 'sql-fmt-4',
    question: 'Why should I avoid pasting queries with credentials into upload sites?',
    answer:
      'Many online formatters post your text to a server so they can run a library there. A query that still contains a password, API key or connection string then sits in that service\'s logs. Prefer a browser-only tool, and rotate any secret that has already been pasted elsewhere.',
  },
  {
    id: 'sql-fmt-5',
    question: 'What happens if a quote is missing?',
    answer:
      'The formatter stops and reports an unclosed single-quoted, double-quoted or backtick string. Fix the quote and try again. It does not guess where the string should have ended.',
  },
  {
    id: 'sql-fmt-6',
    question: 'Does it minify SQL as well?',
    answer:
      'This page pretty-prints. To shrink a query for a log line, start from the formatted output and join lines yourself, or use a dedicated minifier later. Pretty-print first so you can see what you are about to compress.',
  },
  {
    id: 'sql-fmt-7',
    question: 'Will formatting change how my query runs?',
    answer:
      'No. Whitespace and keyword case are insignificant in SQL. The data in string literals and the spelling of identifiers are preserved, so the query means the same thing after formatting.',
  },
  {
    id: 'sql-fmt-8',
    question: 'What about comments?',
    answer:
      'Line comments that start with -- and block comments between /* and */ are kept on their own lines. They are never deleted, because a formatter that drops comments is unsafe for production SQL.',
  },
];
