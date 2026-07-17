import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sc-faq-1',
    question: 'What is sentence case?',
    answer:
      'Sentence case capitalizes only the first letter of each sentence, just like ordinary writing: "the quick brown fox. it runs." becomes "The quick brown fox. It runs." It is the default format for body text, UI labels, and button text because it mirrors natural speech.',
  },
  {
    id: 'sc-faq-2',
    question: 'How does the tool know where a sentence starts?',
    answer:
      'It capitalizes the very first letter of the text and the first letter after sentence-ending punctuation (a period, question mark, or exclamation mark followed by a space). This handles the vast majority of everyday text reliably.',
  },
  {
    id: 'sc-faq-3',
    question: 'Why do product teams prefer sentence case for UI copy?',
    answer:
      'Product teams prefer sentence case because it reads the way people speak, scans faster, and removes debates over which words deserve a capital. Google\'s Material Design and the Microsoft Writing Style Guide both specify sentence case for buttons, menus, and error messages. For example, a settings toggle labeled "Show notification badges" reads as a plain instruction, while "Show Notification Badges" reads like a formal title. Sentence case also survives translation better, since most languages have no Title Case tradition.',
  },
  {
    id: 'sc-faq-4',
    question: 'Is sentence case the same as making everything lowercase?',
    answer:
      'No, sentence case is not the same as lowercasing everything: it lowercases the text and then restores a capital at the start of every sentence, so the result is readable prose rather than a flat string. For example, "URGENT. CALL ME BACK." becomes "Urgent. Call me back." in sentence case, but "urgent. call me back." in lowercase. Choose sentence case for copy people will read, and lowercase for machine formats such as slugs and email addresses.',
  },
  {
    id: 'sc-faq-5',
    question: 'Are proper nouns still capitalized in sentence case?',
    answer:
      'Yes, as a writing style sentence case still keeps proper nouns capitalized: names, places, brands, and the pronoun "I" hold their capitals anywhere in the sentence. For example, correct sentence case is "Send the draft to Maria before the London launch", not "send the draft to maria". This automatic converter cannot recognize which words are names, so it outputs them lowercase. Treat its result as a first pass and restore proper nouns before publishing.',
  },
  {
    id: 'sc-faq-6',
    question: 'Why did the converter lowercase a name or brand in my text?',
    answer:
      'A proper noun got lowercased because the tool works mechanically: it lowercases the whole text, then capitalizes only sentence starts, and it carries no dictionary of names. For example, "Ask Maria about the iPhone rollout" comes back as "Ask maria about the iphone rollout", with only the sentence-opening word capitalized. Scan the output and restore each name by hand, or use the Find and Replace tool when the same name repeats through a long document.',
  },
  {
    id: 'sc-faq-7',
    question: 'Why is the word after an abbreviation like Dr. or e.g. capitalized?',
    answer:
      'The converter treats every period, exclamation mark, or question mark followed by a space as a sentence break, so the word after "e.g." or "Dr." receives a capital it should not have. For example, "we accept many formats, e.g. png files" converts to "We accept many formats, e.g. Png files", and "Dr. Lee called" comes back as "dr. Lee called" because the abbreviation itself is lowercased first. If capitalization after abbreviations looks off, lowercase those words by hand.',
  },
  {
    id: 'sc-faq-8',
    question: 'Is sentence case better than Title Case for most writing?',
    answer:
      'For body text, UI copy, and subheadings, yes, sentence case reads more naturally and is easier on the eye. Reserve Title Case for short headings and titles.',
  },
];
