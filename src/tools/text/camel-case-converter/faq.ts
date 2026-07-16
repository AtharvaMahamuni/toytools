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
  {
    id: 'cml-faq-5',
    question: 'Where is camelCase used in code?',
    answer:
      'camelCase is the standard style for variable and function names in JavaScript, TypeScript, Java, Kotlin, and Swift, and for property keys in most JSON APIs. For example, a fetch response might expose firstName, createdAt, and isActive. The related PascalCase style covers class names, React components, and TypeScript interfaces, while Python and SQL prefer snake_case, so camelCase belongs specifically to identifiers and keys in the JavaScript and JVM world.',
  },
  {
    id: 'cml-faq-6',
    question: 'How do I turn a phrase into a JSON key?',
    answer:
      'Paste the phrase into the converter and copy the camelCase output; that string is a valid JSON key. For example, "date of birth" becomes dateOfBirth and "shipping address line 1" becomes shippingAddressLine1. Because each line converts independently, you can paste a whole list of field labels and get one key per line, ready to drop into a JSON schema or API payload.',
  },
  {
    id: 'cml-faq-7',
    question: 'Should I write userId or userID in camelCase?',
    answer:
      'Write userId. Major style guides, including the Google Java and TypeScript guides, treat acronyms as ordinary words in camelCase, so only the first letter stays capitalized: userId, htmlParser, apiUrl. This converter applies that rule automatically; typing "user ID" or "user_ID" produces userId. Some older codebases keep full caps (userID, parseHTML), so if your linter enforces that style, adjust the acronym by hand after converting.',
  },
  {
    id: 'cml-faq-8',
    question: 'Why do numbers split my identifier oddly?',
    answer:
      'Digits stay attached to the letters before them, but a digit followed by a capital letter starts a new word, and punctuation around a number becomes a boundary. For example, "utf-8 decoder" becomes utf8Decoder and "top 10 list" becomes top10List, while base64 stays intact inside base64Encode. One caution: a phrase that starts with a number, like "2 factor auth", produces 2FactorAuth, which is not a legal JavaScript identifier, so rename it to twoFactorAuth.',
  },
  {
    id: 'cml-faq-9',
    question: 'Why did my acronym come out as Html instead of HTML?',
    answer:
      'The converter treats every word the same way: lowercase it fully, then capitalize the first letter, so HTML becomes Html and "parse HTML" becomes parseHtml. This matches the userId convention most JavaScript and Java style guides prescribe. One side effect: a run of capitals reads as a single word, so pasting XMLHttpRequest returns xmlhttpRequest, because XMLHttp cannot be separated into XML and Http without extra hints. Add a space (XML Http Request) to control the boundaries yourself, giving xmlHttpRequest.',
  },
];
