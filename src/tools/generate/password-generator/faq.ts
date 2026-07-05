import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'password-generator-faq-1',
    question: 'What is a password generator?',
    answer:
      'A password generator is a tool that builds a random password for you from a set of characters. Instead of inventing a password yourself, you pick the length and which character types to include, and the tool draws each character at random. Random passwords are much harder to guess than ones people make up, because they follow no pattern.',
  },
  {
    id: 'password-generator-faq-2',
    question: 'How do I use this password generator?',
    answer:
      'Set the length in the length box, then turn character sets on or off (uppercase, lowercase, numbers, symbols). A password appears right away and updates as you change the options. Press Regenerate for a fresh one, or Copy to put it on your clipboard. That is the whole flow.',
  },
  {
    id: 'password-generator-faq-3',
    question: 'How long should my password be?',
    answer:
      'Longer is stronger. For most accounts, 16 characters is a good baseline. For important accounts like email or a password manager, use 20 or more. Length adds strength faster than adding symbols does, so when in doubt, make it longer rather than more complex.',
  },
  {
    id: 'password-generator-faq-4',
    question: 'Is this password generator safe to use?',
    answer:
      'Yes. Every password is created on your device inside your browser. Nothing you generate is sent over the network, logged, or stored on a server. You can confirm this by opening your browser network tools and watching: generating a password makes no requests.',
  },
  {
    id: 'password-generator-faq-5',
    question: 'Does the password generator work offline?',
    answer:
      'Yes. Once the page has loaded, it needs no internet connection. The generation runs entirely in local JavaScript, so you can disconnect and keep making passwords. This also means there is no server that could see or keep your passwords.',
  },
  {
    id: 'password-generator-faq-6',
    question: 'Are the passwords truly random?',
    answer:
      'They use your browser\'s cryptographic random source (the Web Crypto API), which is designed for security-sensitive work. Each character is picked with a method that avoids bias, so every character in the pool is equally likely. This is far stronger than the ordinary random functions used for things like shuffling.',
  },
  {
    id: 'password-generator-faq-7',
    question: 'What is password entropy?',
    answer:
      'Entropy is a measure of how hard a password is to guess, counted in bits. Each extra bit doubles the number of guesses an attacker would need. The tool shows the entropy for your current settings. As a rough guide, under 40 bits is weak, 60 to 80 bits is solid for most accounts, and 100 or more bits is very strong.',
  },
  {
    id: 'password-generator-faq-8',
    question: 'How is the entropy calculated?',
    answer:
      'It is the password length multiplied by the base-2 logarithm of the character pool size. If you allow all four sets (about 88 characters) and pick 16 characters, that is roughly 16 times 6.46, or about 103 bits. Turning sets off shrinks the pool and lowers the entropy per character, which is why the number drops when you disable a set.',
  },
  {
    id: 'password-generator-faq-9',
    question: 'What does the strength indicator mean?',
    answer:
      'The bar summarizes the entropy in plain words: Very weak, Weak, Fair, Strong, or Very strong. It is a quick visual cue so you do not have to read the bit count. Aim for Strong or Very strong for anything that matters. The label is based only on entropy, not on whether the password appears in a breach list.',
  },
  {
    id: 'password-generator-faq-10',
    question: 'Should I include symbols?',
    answer:
      'Symbols help, but they matter less than length. Adding symbols grows the character pool from about 62 to about 88, which is a modest gain. Adding four more characters to the length usually adds more strength than turning on symbols. Include them when a site allows it, but do not rely on them as your main defense.',
  },
  {
    id: 'password-generator-faq-11',
    question: 'What are ambiguous characters and why exclude them?',
    answer:
      'Some characters look alike in many fonts: the letter O and the number 0, or the lowercase l, capital I, and the number 1. If you will type a password by hand or read it aloud, excluding these avoids mistakes. If you always copy and paste, you can leave them in for a slightly larger pool.',
  },
  {
    id: 'password-generator-faq-12',
    question: 'Can I generate a password with only numbers?',
    answer:
      'Yes. Turn off uppercase, lowercase, and symbols, and leave numbers on. This produces a numeric PIN-style string. Be aware that a digits-only password has a small pool (10 characters), so you need much more length to reach the same strength as a mixed password.',
  },
  {
    id: 'password-generator-faq-13',
    question: 'Why did my password get rejected by a website?',
    answer:
      'Some sites cap the length or ban certain symbols. If a password is rejected, lower the length to the site\'s limit or turn off symbols and try again. It is a limitation of that site, not the generator. When possible, still use the longest password the site allows.',
  },
  {
    id: 'password-generator-faq-14',
    question: 'Can two people get the same password?',
    answer:
      'It is possible in theory but astronomically unlikely for any reasonable length. A 16-character password from the full set is one of more than 10 to the 31st power possibilities. You would need to generate an unimaginable number of passwords before a repeat became likely, so collisions are not a practical concern.',
  },
  {
    id: 'password-generator-faq-15',
    question: 'Where should I store the generated password?',
    answer:
      'Use a password manager. It stores your passwords encrypted, fills them in for you, and means you only memorize one master password. Do not save passwords in a plain text file, a note, or a spreadsheet. Generating a strong password is only half the job; storing it safely is the other half.',
  },
  {
    id: 'password-generator-faq-16',
    question: 'Does the tool remember the passwords I generate?',
    answer:
      'No. The password itself is never saved. The tool only remembers your option choices (length and which sets are on) so the form looks the same next time. That preference is stored locally on your device, and it never includes a generated password.',
  },
  {
    id: 'password-generator-faq-17',
    question: 'Can I generate more than one password at a time?',
    answer:
      'This tool makes one password at a time and lets you press Regenerate for a new one. That fits the common case of setting up a single account. If you need many random strings at once, the random string generator is a better fit for bulk output.',
  },
  {
    id: 'password-generator-faq-18',
    question: 'What is the difference between a password and a passphrase?',
    answer:
      'A password is a string of characters. A passphrase is several words strung together, like four random words. Passphrases can be easier to remember and still very strong if the words are truly random. This tool generates character-based passwords, which are ideal when you will store them in a password manager rather than memorize them.',
  },
  {
    id: 'password-generator-faq-19',
    question: 'Does a longer password beat a more complex short one?',
    answer:
      'Usually yes. A long password from a smaller set often has more entropy than a short password from a large set. For example, a 20-character lowercase password can be stronger than a 10-character password using every symbol. This is why the tool nudges you toward length first.',
  },
  {
    id: 'password-generator-faq-20',
    question: 'Which browsers does it work in?',
    answer:
      'It works in every current browser, including Chrome, Firefox, Safari, and Edge, on desktop and mobile. It relies on the Web Crypto API, which has been supported everywhere for years. If a browser somehow lacks secure randomness, the tool reports an error rather than falling back to a weaker source.',
  },
  {
    id: 'password-generator-faq-21',
    question: 'Can I use this for API keys or tokens?',
    answer:
      'You can, though the random string generator gives you more control over length and character sets for that purpose. For a quick secret, a long password from this tool works. For repeatable formats or very long tokens, the random string tool is the better choice.',
  },
  {
    id: 'password-generator-faq-22',
    question: 'How often should I change my passwords?',
    answer:
      'Change a password when there is a reason to: a service reports a breach, you suspect it was exposed, or you reused it somewhere else. Routine forced changes on a fixed schedule are no longer recommended by most security guidance, because they push people toward weaker, predictable variations.',
  },
  {
    id: 'password-generator-faq-23',
    question: 'Is my clipboard a security risk after I copy a password?',
    answer:
      'It can be. Other apps can sometimes read the clipboard, and clipboard history features may keep a copy. After you paste a password into the right field, copy something harmless to overwrite it, and clear your clipboard history if your system keeps one. A password manager avoids this by filling passwords without the clipboard.',
  },
  {
    id: 'password-generator-faq-24',
    question: 'Is any of my data uploaded or shared?',
    answer:
      'No. There is no account, no server call, and no analytics tied to what you generate. Passwords are created and displayed entirely in your browser. The only thing kept is your local option preference, which stays on your device and contains no passwords.',
  },
];
