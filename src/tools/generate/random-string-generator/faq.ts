import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'random-string-generator-faq-1',
    question: 'What is a random string generator?',
    answer:
      'It is a tool that builds a string of random characters to a length and alphabet you choose. Unlike a password meant for a person to handle, a random string is often used by software: as an API key, a token, a nonce, or a unique name. Each character is drawn at random, so the result follows no pattern.',
  },
  {
    id: 'random-string-generator-faq-2',
    question: 'How do I use it?',
    answer:
      'Set the length, then pick which character sets to include: uppercase, lowercase, numbers, and symbols. Or type your own set in the custom field to use exactly those characters. The string appears right away. Press Regenerate for a new one, or Copy to grab it.',
  },
  {
    id: 'random-string-generator-faq-3',
    question: 'What is the difference between this and the password generator?',
    answer:
      'They share an engine, but the random string generator is aimed at machine-facing values like tokens and keys, and it adds a custom alphabet field. The password generator is tuned for human-facing passwords, with an exclude-ambiguous option. Use whichever framing fits, since both produce strong random output.',
  },
  {
    id: 'random-string-generator-faq-4',
    question: 'What is a custom character set?',
    answer:
      'It is your own list of allowed characters. Type, for example, `ABCDEF0123456789` and the string will contain only those characters. This is useful when a system accepts a limited alphabet, such as hexadecimal only or letters without symbols. The custom set overrides the on-off toggles when it is filled in.',
  },
  {
    id: 'random-string-generator-faq-5',
    question: 'Is it safe to use for tokens and keys?',
    answer:
      'Yes. Each character is chosen with your browser\'s cryptographic random source, the kind meant for security work, and the pick is unbiased. As long as you choose enough length, the output is suitable for API keys, session tokens, and similar secrets. The tool also shows the entropy so you can judge the strength.',
  },
  {
    id: 'random-string-generator-faq-6',
    question: 'Does the random string generator work offline?',
    answer:
      'Yes. After the page loads once, it needs no connection. Generation runs entirely in local JavaScript, so you can disconnect and keep producing strings. Nothing you generate is sent anywhere.',
  },
  {
    id: 'random-string-generator-faq-7',
    question: 'How long should a token be?',
    answer:
      'For a security token, aim for at least 128 bits of entropy. With a 62-character alphabet (letters and numbers) that is about 22 characters; with symbols added, a little less. The entropy readout tells you when you have crossed that line. When in doubt, longer is safer.',
  },
  {
    id: 'random-string-generator-faq-8',
    question: 'What is entropy and why does it matter?',
    answer:
      'Entropy measures how hard the string is to guess, in bits. Each bit doubles the number of guesses an attacker would need. It equals the length times the base-2 logarithm of the alphabet size. A bigger alphabet or a longer string raises entropy, and the tool shows the current value so you can size a token correctly.',
  },
  {
    id: 'random-string-generator-faq-9',
    question: 'Are the strings truly random?',
    answer:
      'They use the Web Crypto API, your browser\'s secure random source, not the ordinary random function used for things like shuffling. Each character is selected so every option in the alphabet is equally likely, with no bias. That makes the output suitable for security-sensitive uses.',
  },
  {
    id: 'random-string-generator-faq-10',
    question: 'Can I generate a hexadecimal string?',
    answer:
      'Yes. Put `0123456789abcdef` in the custom field, set your length, and you get a hex string. This is handy for values that must be hexadecimal, such as some keys and identifiers. For uppercase hex, use `0123456789ABCDEF` instead.',
  },
  {
    id: 'random-string-generator-faq-11',
    question: 'Can I exclude symbols?',
    answer:
      'Yes. Turn off the symbols toggle and the string uses only letters and numbers. Many systems reject symbols in keys or URLs, so an alphanumeric string is often the safe choice. You can also use the custom field to specify exactly which characters are allowed.',
  },
  {
    id: 'random-string-generator-faq-12',
    question: 'What is a nonce?',
    answer:
      'A nonce is a value used once, to prevent replay. For example, a server might issue a nonce and reject any request that reuses it. A random string of enough length makes a good nonce because the chance of generating the same one twice is negligible. Never reuse a value that is meant to be a nonce.',
  },
  {
    id: 'random-string-generator-faq-13',
    question: 'Can two generated strings ever match?',
    answer:
      'For any reasonable length, the chance is negligible. A 24-character alphanumeric string is one of more than 10 to the 42nd power possibilities. You would have to generate an unimaginable number before a repeat became likely, so for practical purposes each string is unique.',
  },
  {
    id: 'random-string-generator-faq-14',
    question: 'Can I generate a random slug or file name?',
    answer:
      'Yes. Use a lowercase-and-numbers alphabet, or a custom set, and pick a modest length like 8 to 12 characters. The result is a compact, unique-enough string for a URL slug or a file name. For guaranteed-unique names across systems, a UUID may be a better fit.',
  },
  {
    id: 'random-string-generator-faq-15',
    question: 'Why did a system reject my string?',
    answer:
      'Usually it contained a character the system does not accept, often a symbol. Turn off symbols, or use the custom field to restrict the alphabet to exactly what the target allows. Some systems also cap the length, so shorten the string if needed.',
  },
  {
    id: 'random-string-generator-faq-16',
    question: 'What is the maximum length?',
    answer:
      'You can generate up to 256 characters at a time, which is far more than any token needs. Most security tokens sit between 20 and 40 characters. If you need something longer for a specific format, set the length up to the limit.',
  },
  {
    id: 'random-string-generator-faq-17',
    question: 'Is a random string a good password?',
    answer:
      'It can be, if it is long enough and you store it in a password manager. The password generator is a slightly better fit for that because of its human-focused options, but a random string of sufficient length is perfectly strong. Do not try to memorize it; save it in a manager.',
  },
  {
    id: 'random-string-generator-faq-18',
    question: 'Does the tool remember the strings I generate?',
    answer:
      'No. The strings themselves are never saved. The tool only remembers your options, such as the length and which sets are enabled, in local storage so the form looks familiar next time. That preference stays on your device and holds no generated values.',
  },
  {
    id: 'random-string-generator-faq-19',
    question: 'Which browsers does it work in?',
    answer:
      'All current browsers, including Chrome, Firefox, Safari, and Edge, on desktop and mobile. It relies on the Web Crypto API, which has been supported everywhere for years. If secure randomness is unavailable, the tool reports an error rather than using a weaker source.',
  },
  {
    id: 'random-string-generator-faq-20',
    question: 'Can I copy the string with one click?',
    answer:
      'Yes. Press Copy and the current string is placed on your clipboard, ready to paste into a config file, a terminal, or a form. After you paste a sensitive value, copy something harmless to overwrite it, since other apps can sometimes read the clipboard.',
  },
  {
    id: 'random-string-generator-faq-21',
    question: 'When should I use a random string instead of a UUID?',
    answer:
      'Use a random string when you need control over the length and alphabet, such as a token of a specific size or a value limited to certain characters. Use a UUID when you want a standard, widely recognized 128-bit identifier in a fixed format. They overlap, but the shapes differ.',
  },
  {
    id: 'random-string-generator-faq-22',
    question: 'Is any of my data uploaded or shared?',
    answer:
      'No. There is no account, no server call, and no analytics tied to the values you generate. Strings are created and shown entirely in your browser. The only thing kept is your local option preference, which never contains a generated string.',
  },
];
