import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'upi-faq-1',
    question: 'Is this tax, legal, or payments advice?',
    answer:
      'No. This is not tax, legal, or payments advice.\nFor fun only. ToyTools does not support splitting payments to dodge a fee, a tax, or a reporting rule. We do not know whether NPCI, a bank, or a UPI app treats several payments as one total, so do not use this for that.',
  },
  {
    id: 'upi-faq-2',
    question: 'Does a customer owe a 2000 rupee UPI tax?',
    answer:
      'No. A customer does not owe a 2000 rupee UPI tax.\nThe Finance Ministry called GST-on-UPI-above-2000 reports false. There is no government tax on a UPI payment because the amount is above 2000 rupees.',
  },
  {
    id: 'upi-faq-3',
    question: 'What did PIB Delhi say on 15 Sep 2026?',
    answer:
      'Person-to-person UPI stays free at any amount.\nMDR is not a tax and is not collected by the government or NPCI. A 0.4% MDR can apply to some person-to-merchant payments above 2000 rupees. Customers are not supposed to pay that MDR.',
  },
  {
    id: 'upi-faq-4',
    question: 'Is MDR a tax?',
    answer:
      'No. MDR is not a tax.\nIt is not collected by the government or NPCI. A 0.4% MDR can apply to some person-to-merchant payments above 2000 rupees. Customers are not supposed to pay that MDR.',
  },
  {
    id: 'upi-faq-5',
    question: 'What does 5000 split into?',
    answer:
      '5000 becomes 1999 + 1999 + 1002.\nFor example, those three chunks sum to 5000. The last chunk is the remainder, and that remainder can sit under 1999. The page uses integer subtraction only.',
  },
  {
    id: 'upi-faq-6',
    question: 'What happens at 2000 rupees or less?',
    answer:
      'The page says one payment and nothing to split.\n2000 itself stays one payment, and 1999 stays one payment. 2001 becomes 1999 plus 2, because it crosses the locked line. A total under 2000 is the same quiet result.',
  },
  {
    id: 'upi-faq-7',
    question: 'Does splitting hide the total from the person you paid?',
    answer:
      'No. Splitting does not hide the total from the person you paid.\nThe chunks add to the same rupees you typed. The list does not hide that total. This page does not send a payment and does not change what the other person can see.',
  },
  {
    id: 'upi-faq-8',
    question: 'Why are 2000 and 1999 locked?',
    answer:
      'The threshold is locked at 2000 and the chunk is locked at 1999.\nThis is a meme, not a planner. There is no setting to change either number. Whole rupees only, with no paise.',
  },
  {
    id: 'upi-faq-9',
    question: 'What is the input cap?',
    answer:
      'The cap is 10,00,000 rupees.\nA larger total would print hundreds of rows, so the page refuses it and says so. 10,00,000 itself still lists the chunks. Their sum matches the typed total.',
  },
  {
    id: 'upi-faq-10',
    question: 'Are my numbers uploaded?',
    answer:
      'No. Runs entirely on your device. Nothing is uploaded.\nThe total stays in this tab. Close the tab and the number is gone. There is no account on this page.',
  },
  {
    id: 'upi-faq-11',
    question: 'How does the integer split work?',
    answer:
      'It subtracts 1999 until the remainder is 1999 or less.\nFor example, 3998 is 1999 plus 1999. 10000 is five chunks of 1999 plus 5. The math stays in whole rupees and does not invent a rate.',
  },
  {
    id: 'upi-faq-12',
    question: 'Is there a UPI tax above 2000?',
    answer:
      'No. There is no government tax because a UPI payment is above 2000 rupees.\nPIB Delhi said on 15 Sep 2026 that person-to-person UPI stays free at any amount. The guide links that press note. Do not treat a post as a rule.',
  },
  {
    id: 'upi-faq-13',
    question: 'How is this different from the tax calculator?',
    answer:
      'The tax calculator applies a rate you type. This page does not.\nA tip calculator adds a percent, and a discount calculator takes a percent off. This UPI split versus a tax calculator is a joke list, not a tax.',
  },
];
