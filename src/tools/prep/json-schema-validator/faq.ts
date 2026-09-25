import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jsv-faq-1',
    question: 'Which schema keywords are checked?',
    answer:
      'type, properties, required, items (a single schema, not a tuple), additionalProperties, enum, const, minimum, maximum, exclusiveMinimum, exclusiveMaximum, minLength, maxLength, minItems, and maxItems.',
  },
  {
    id: 'jsv-faq-2',
    question: 'What happens to a keyword this page does not know?',
    answer:
      'It is listed as not checked. A result can still say Valid. That means the keywords above passed, not that format, pattern, or anyOf was applied.',
  },
  {
    id: 'jsv-faq-3',
    question: 'Does a valid result mean an AI wrote correct JSON?',
    answer:
      'No. It means the JSON matches the keywords this page checks. ToyTools does not call a model, and it does not decide whether the data is the right business object.',
  },
  {
    id: 'jsv-faq-4',
    question: 'Is the schema or the JSON uploaded?',
    answer:
      'No. Both panes are checked in your browser. Runs entirely on your device. Nothing is uploaded.',
  },
];
