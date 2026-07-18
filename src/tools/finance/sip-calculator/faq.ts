import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sip-faq-1',
    question: 'What is a SIP?',
    answer:
      'A SIP, or systematic investment plan, is a fixed amount you invest on a schedule, monthly in almost every plan, into a fund or portfolio. Instead of timing the market with one large deposit, you invest steadily. Each instalment then compounds for the rest of the investment period, so the earliest payments do the most work.',
  },
  {
    id: 'sip-faq-2',
    question: 'How is the SIP maturity value calculated?',
    answer:
      'Each monthly instalment grows for the months it stays invested, and the maturity value is the sum of all those grown instalments. The closed form is the future value of an annuity: instalment times ((1 + i)^n minus 1) divided by i, where i is the monthly rate and n is the number of months. This calculator assumes instalments at the end of each month with monthly compounding.',
  },
  {
    id: 'sip-faq-3',
    question: 'What return rate should I assume?',
    answer:
      'Use a rate that matches what you invest in and stay conservative. Broad equity index funds have historically returned high single digits to low double digits per year over long periods, while debt funds and deposits earn less. The expected return is an assumption, not a promise, so re-run the result at a lower rate to see a cautious floor.',
  },
  {
    id: 'sip-faq-4',
    question: 'Is a SIP better than investing a lump sum?',
    answer:
      'They answer different situations. If you already have the money, a lump sum has more time in the market and ends higher on average. A SIP suits money that arrives monthly, like a salary, and it smooths your purchase price because the same amount buys more units when prices fall. You can also combine both, which this calculator supports with the starting lump sum field.',
  },
  {
    id: 'sip-faq-5',
    question: 'What does rupee cost averaging or dollar cost averaging mean?',
    answer:
      'It is the effect of investing a fixed amount on a schedule. When prices are low your instalment buys more units, and when prices are high it buys fewer. Over time your average purchase price reflects many market levels rather than one entry point, which removes the pressure of picking the right day to invest.',
  },
  {
    id: 'sip-faq-6',
    question: 'Why does starting earlier matter so much?',
    answer:
      'Because compounding is strongest at the end of a long period. An instalment invested in year one compounds for the whole term, while one invested near the end barely grows. Starting five years earlier at the same monthly amount adds more to the final value than a later raise in the instalment does in most plans.',
  },
  {
    id: 'sip-faq-7',
    question: 'Does this calculator account for inflation or taxes?',
    answer:
      'No. The result is the nominal value of the investment before tax. Prices rise over long periods, so the purchasing power of the maturity value will be lower than the number suggests. Use the inflation calculator to convert the result into current money, and check the tax rules for your investment type separately.',
  },
  {
    id: 'sip-faq-8',
    question: 'Is it better to invest more each month or for a longer time?',
    answer:
      'Time in the market beats a bigger instalment when the total you put in is the same. Lengthening the plan gives every payment more months to compound. For example, at a 10% return, $500 a month for 20 years grows to about $380,000, while $1,000 a month for 10 years reaches only about $204,000. Both invest $120,000, yet the longer plan finishes far ahead because its early instalments compound the longest.',
  },
  {
    id: 'sip-faq-9',
    question: 'Why does doubling the SIP duration more than double the result?',
    answer:
      'Doubling the duration more than doubles the result because compounding grows fastest in the final years. The extra time lets every instalment, especially the early ones, keep multiplying. For example, $500 a month at 10% grows to about $102,000 in 10 years but about $380,000 in 20 years, roughly 3.7 times more, not twice. You only double the money you contribute, yet the growth portion expands far faster than the instalments do.',
  },
  {
    id: 'sip-faq-10',
    question: 'Why is my SIP wealth gain so small in the early years?',
    answer:
      'Early instalments have had little time to compound, so wealth gained stays small at the start and steepens later. Growth needs duration, and in the first years most of the value is simply the money you paid in. For example, $500 a month at 10% shows only about $1,200 of growth after two years on $12,000 invested, but roughly $260,000 of growth after 20 years. Stay invested and the curve accelerates.',
  },
  {
    id: 'sip-faq-11',
    question: 'Why does my SIP value differ from my fund statement?',
    answer:
      'This calculator assumes one constant return with clean monthly compounding, while a real fund moves with a variable NAV and charges costs. Each instalment buys units at whatever price the market sets that day, so returns arrive unevenly rather than smoothly. Fund fees, an expense ratio, exit loads, and the exact dates your instalments clear all shift the outcome. Treat the projection as a planning estimate, not a record of your actual holdings.',
  },
  {
    id: 'sip-faq-12',
    question: 'Is my financial data uploaded anywhere?',
    answer:
      'No. The calculation runs entirely in your browser. Nothing you type is sent to a server, stored remotely, or shared, and the page works the same if you go offline after loading it.',
  },
];
