import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'shop-faq-1',
    question: 'What is Shop UPI Tally?',
    answer:
      'Shop UPI Tally is a local monthly count of UPI receipts you type in yourself.\nYou add an amount. The page shows this calendar month total and how far that total sits from 1,00,000 rupees. It is your notebook, not a bank statement.',
  },
  {
    id: 'shop-faq-2',
    question: 'What does this month include?',
    answer:
      'Only receipts whose date falls in the current local calendar month.\nA receipt you add now is stamped with this device clock. A receipt from last month stays in the file and drops out of the total. The page names the month above the number.',
  },
  {
    id: 'shop-faq-3',
    question: 'What happens when the calendar month changes?',
    answer:
      'The total rolls to the new month. Older receipts stay in the export.\nOn the first day of the next month the visible total starts at zero if you have not added a receipt yet. The file still holds last month. Importing that file later brings last month back into the file, not into this month total.',
  },
  {
    id: 'shop-faq-4',
    question: 'Does crossing 1,00,000 change my merchant status?',
    answer:
      'No. Crossing or staying under 1,00,000 rupees here does not change your merchant status.\nThis is your own tally, not your bank or NPCI category. The caution stays on the page so the number cannot be read as a status switch.',
  },
  {
    id: 'shop-faq-5',
    question: 'Is this my bank or NPCI category?',
    answer:
      'No. This is not your bank, and it is not an NPCI category.\nThe bank decides small-merchant status. This page never asks a bank. A total you typed here cannot prove which category you are in.',
  },
  {
    id: 'shop-faq-6',
    question: 'Where is the tally stored?',
    answer:
      'The browser stores it under the key toytools.shop-upi-tally.v1.\nThat is local storage on this device. Another browser, another phone, and a private window do not see it. The page cap on a single write is 50000 characters.',
  },
  {
    id: 'shop-faq-7',
    question: 'How do export and import work?',
    answer:
      'Export downloads a JSON file of every receipt still on this device.\nImport replaces the tally after you confirm. The file has version 1 and a list of receipts, each with paise and a timestamp. A broken file is rejected and the current tally stays.',
  },
  {
    id: 'shop-faq-8',
    question: 'Are my numbers uploaded?',
    answer:
      'No. Runs entirely on your device. Nothing is uploaded.\nAdding a receipt, exporting JSON, and importing a file you already have all stay in the browser. There is no account and no sync.',
  },
  {
    id: 'shop-faq-9',
    question: 'What if I clear site data?',
    answer:
      'Clearing site data deletes it.\nThe caution says that because the tally has no second copy on a server. Export the JSON first if you want a file. The Clear tally button asks before it wipes the key on this device.',
  },
  {
    id: 'shop-faq-10',
    question: 'Will this page tell me to split receipts?',
    answer:
      'No. This page will not help you split receipts, and it will not tell you a band trick.\nStaying under 1,00,000 here, or going over it, does not change merchant status. Use the number as your own count and nothing more.',
  },
  {
    id: 'shop-faq-11',
    question: 'Shop UPI Tally versus the MDR estimator',
    answer:
      'The MDR estimator prices one payment from the PIB note. This page adds receipts you already took.\nUnlike that estimate, the tally remembers a month on this device. The estimator does not look at your stored receipts, and this tally does not print an MDR.',
  },
];
