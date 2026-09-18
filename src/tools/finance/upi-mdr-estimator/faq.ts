import type { FAQItem } from '@data/types';
import { NOT_A_CUSTOMER_FEE } from '@lib/engines/finance/calculators/upi-mdr-estimator';

export const items: FAQItem[] = [
  {
    id: 'mdr-faq-1',
    question: 'What is UPI MDR on this page?',
    answer:
      `MDR is a merchant discount rate, and on this page it is an estimate of that charge in rupees.\n${NOT_A_CUSTOMER_FEE} The page only uses the rates in the PIB note from 15 Sep 2026.`,
  },
  {
    id: 'mdr-faq-2',
    question: 'Is MDR a tax?',
    answer:
      'No. MDR is not a tax and it is not a customer charge.\nIt is not collected by the government. A customer does not owe the figure this page prints. The figure is an estimate of a merchant-side charge on some person-to-merchant payments.',
  },
  {
    id: 'mdr-faq-3',
    question: 'Does the customer owe this charge?',
    answer:
      'No. The customer does not owe this charge.\nThe line under the number says so on purpose. Person-to-person UPI stays free at any amount, and this page does not estimate a person-to-person payment.',
  },
  {
    id: 'mdr-faq-4',
    question: 'What did PIB say on 15 Sep 2026?',
    answer:
      'Person-to-person UPI stays free at any amount.\nMDR is not a tax and not a customer charge. Some person-to-merchant payments above 2000 rupees are 0.4 percent, capped at 300 rupees once the amount is 75000 or more. Essential sectors above 2000 are a flat 5 rupees. Capital-market payments above 2000 are 0.02 percent, capped at 300. The guide links the press note.',
  },
  {
    id: 'mdr-faq-5',
    question: 'What does 5000 ordinary become?',
    answer:
      '5000 rupees on an ordinary merchant is 20 rupees of MDR.\n0.4 percent of 5000 is 20. The page shows that as rupees, rounded to paise. 2000 itself is zero. 2001 ordinary is 8 rupees.',
  },
  {
    id: 'mdr-faq-6',
    question: 'What happens at 2000 rupees or less?',
    answer:
      'Every kind is zero at 2000 rupees or less.\nOrdinary, essential, capital market, and the small-merchant what-if all print zero. The page does not invent a fee under that line.',
  },
  {
    id: 'mdr-faq-7',
    question: 'What happens at 74999 and at 75000?',
    answer:
      '74999 ordinary still uses 0.4 percent.\nThat product rounds to 300 rupees of paise, but the rule is still the percent. 75000 ordinary is the cap: the MDR is 300 rupees, not a fresh percent. The page labels those two rules differently.',
  },
  {
    id: 'mdr-faq-8',
    question: 'What is the essential-sector charge above 2000?',
    answer:
      'Essential sector above 2000 rupees is a flat 5 rupees.\nThe PIB note names rail, telecom, insurance, fuel, and agri inputs. 2001 is 5. A much larger amount is still 5. 2000 is zero.',
  },
  {
    id: 'mdr-faq-9',
    question: 'When does the capital-market cap apply?',
    answer:
      'Capital-market payments above 2000 are 0.02 percent, capped at 300 rupees.\nFor example, 2001 is 0.40 rupees. 10,00,000 is 200 rupees. 20,00,000 would be 400 rupees before the cap, so the page prints 300.',
  },
  {
    id: 'mdr-faq-10',
    question: 'Why is small merchant always zero here?',
    answer:
      'Small merchant is a what-if, and it is zero at any amount on this toy.\nThe PIB note says small merchants on P2PM, about 1 lakh a month of UPI QR, stay on zero MDR. Real status depends on the bank. This toggle does not check that status and does not change it.',
  },
  {
    id: 'mdr-faq-11',
    question: 'Are my numbers uploaded?',
    answer:
      'No. Runs entirely on your device. Nothing is uploaded.\nThe amount stays in this tab. Close the tab and the number is gone. There is no account on this page.',
  },
  {
    id: 'mdr-faq-12',
    question: 'How is this different from the UPI 1999 split?',
    answer:
      'The UPI 1999 split is a meme calculator. This page estimates a merchant charge.\nUnlike that list of chunks, this page applies the PIB rates and then says the result is not a tax you owe. A tax calculator applies a rate you type. This page does not.',
  },
];
