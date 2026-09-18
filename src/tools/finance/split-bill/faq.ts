import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'bill-faq-1',
    question: 'What is Split Bill?',
    answer:
      'Split Bill divides a dinner total into equal shares.\nYou type the bill, a people count from 2 to 30, and an optional tip from 0 to 30 percent. The page adds the tip first, then hands each person a share. The shares sum to the total.',
  },
  {
    id: 'bill-faq-2',
    question: 'How does the leftover paise work?',
    answer:
      'The last person takes the leftover paise.\nThe page works in paise. It gives everyone the same base share, then adds the remainder to the last person. For example, 100 rupees across 3 people is 33.33, 33.33, and 33.34. Those three sum to 100.',
  },
  {
    id: 'bill-faq-3',
    question: 'What does 1000 at 10 percent across 3 people look like?',
    answer:
      'A 1000 rupee bill with a 10 percent tip is 1100 rupees total.\nThree people pay 366.66, 366.66, and 366.68. The last share holds the extra 2 paise. 366.66 plus 366.66 plus 366.68 equals 1100.',
  },
  {
    id: 'bill-faq-4',
    question: 'What if the total divides evenly?',
    answer:
      'Then every share is the same, and the leftover line stays quiet.\nA 900 rupee bill, no tip, across 3 people is 300 each. The page says the shares add up and does not mention leftover paise, because there are none.',
  },
  {
    id: 'bill-faq-5',
    question: 'What tip percents are allowed?',
    answer:
      'The tip is optional and must be a whole number from 0 to 30.\nBlank means no tip. 10 means 10 percent of the bill, added before the split. 31 is rejected. The tip is not a fee from a payment network.',
  },
  {
    id: 'bill-faq-6',
    question: 'How many people can share a bill?',
    answer:
      'From 2 to 30 people.\nOne person is not a split, so 1 is rejected. 31 is rejected so the page does not print a huge list. 2.5 is rejected because people have to be a whole number.',
  },
  {
    id: 'bill-faq-7',
    question: 'Does this page keep accounts?',
    answer:
      'No. There is no account, no friend list, and no saved names.\nYou see Person 1, Person 2, and so on. Close the tab and the bill is gone. The page does not remember who came to dinner.',
  },
  {
    id: 'bill-faq-8',
    question: 'Is this a payment-fee tool?',
    answer:
      'No. This is a dinner split, not a payment-fee tool.\nIt adds a tip you choose and splits that total. It does not look up a network charge. Use the UPI MDR estimator on a different page if you wanted that other question.',
  },
  {
    id: 'bill-faq-9',
    question: 'Are my numbers uploaded?',
    answer:
      'No. Runs entirely on your device. Nothing is uploaded.\nThe bill stays in this tab. There is no signup and no sync. Export is not even a button here, because nothing is stored.',
  },
  {
    id: 'bill-faq-10',
    question: 'Split Bill versus the tip calculator',
    answer:
      'The tip calculator works out a tip. This page goes one step further and assigns shares.\nUnlike a tip-only total, the shares here are built so they sum to the total with tip. The difference is the leftover paise, which the last person takes.',
  },
];
