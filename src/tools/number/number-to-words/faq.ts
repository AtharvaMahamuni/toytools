import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'numwords-faq-1',
    question: 'Where does the hyphen go in a number written out?',
    answer:
      'Only between a ten and a unit. Twenty-one, thirty-four and ninety-nine all take one. Hundreds, thousands and millions do not, so four thousand two hundred thirteen carries no hyphen anywhere. The rule catches people out because a hyphen looks tidy in four-thousand, and every style guide from Chicago to Oxford rejects it there.',
  },
  {
    id: 'numwords-faq-2',
    question: 'Should I write one hundred and five or one hundred five?',
    answer:
      'American English drops the and, British English keeps it. The converter writes one hundred five, because that is the form cheque and invoice software expects and the form that reads unambiguously in a legal document. Both spellings are accepted going the other way, so pasting one hundred and five returns 105 without complaint. Add the and back by hand if your house style wants it.',
  },
  {
    id: 'numwords-faq-3',
    question: 'How do I write an amount on a cheque?',
    answer:
      'Spell the whole part out in words, then write the cents as a fraction over 100. An amount of 4213.75 becomes Four thousand two hundred thirteen and 75/100. Convert the whole part here, capitalise the first letter, and add the fraction. The point of the words line is that digits can be altered and a sentence cannot, so banks read the words when the two disagree.',
  },
  {
    id: 'numwords-faq-4',
    question: 'Why is 4.75 read as four point seven five?',
    answer:
      'Because reading the decimal part as a whole number stops working past two places. Four point seventy-five is understood at two digits and ambiguous at three: four point one two five could be read as one hundred twenty-five thousandths or as twelve point five. Digit by digit stays unambiguous at any length, which is why aviation, finance and dictation all use it.',
  },
  {
    id: 'numwords-faq-5',
    question: 'What is the short scale?',
    answer:
      'It is the naming system where each new word is a thousand times the last, so a billion is a thousand million and a trillion is a thousand billion. English uses it everywhere it is written today. The long scale, where a billion meant a million million, was standard in British English until the 1970s and survives in French, German and Spanish, which is why a translated financial figure is worth checking twice.',
  },
  {
    id: 'numwords-faq-6',
    question: 'My amount had a dollar sign and commas in it. What happened?',
    answer:
      'The converter needs digits and at most one decimal point, so $4,213.75 does not parse as it stands. Rather than failing there, it offers to strip the formatting and use 4213.75 in one tap. It recognises currency symbols from any script, thousands separators written as commas, spaces or apostrophes, and a few common currency codes. A bare number triggers nothing.',
  },
];
