import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sg-faq-1',
    question: 'How much should I save each month to reach my goal?',
    answer:
      'The monthly amount depends on your goal, how much you have already saved, the return you expect, and how long you have. This tool solves a sinking fund: it finds the level monthly contribution so that your current savings plus future contributions, both growing at your assumed return, reach the goal exactly on time.',
  },
  {
    id: 'sg-faq-2',
    question: 'How do investment returns change what I need to save?',
    answer:
      'A positive return does part of the work for you, so the higher the return you assume, the lower the monthly amount you need. The growth on your contributions and current balance counts toward the goal. The trade off is that higher assumed returns usually mean more risk and less certainty, so it is wise to be conservative.',
  },
  {
    id: 'sg-faq-3',
    question: 'What return rate should I assume for a savings goal?',
    answer:
      'It depends on where you keep the money and your time frame. Cash and short term savings earn little, while diversified investments have historically earned more over long periods but with ups and downs. For a short goal of a year or two, a low rate is safer. For a longer goal, you might assume a higher rate but plan for variability.',
  },
  {
    id: 'sg-faq-4',
    question: 'What happens if I start saving later?',
    answer:
      'Starting later shortens the time your money has to grow, so the required monthly amount rises, often sharply. Time is the most powerful lever in saving because of compounding. Even a year or two earlier can noticeably reduce how much you need to set aside each month.',
  },
  {
    id: 'sg-faq-5',
    question: 'Should I include my current savings?',
    answer:
      'Yes. Enter what you already have set aside for this goal. Those savings keep growing at your assumed return and count toward the target, which lowers the monthly amount you still need. If your current savings already exceed the goal, the required monthly contribution is zero.',
  },
  {
    id: 'sg-faq-6',
    question: 'Should I build an emergency fund before saving for goals?',
    answer:
      'Usually yes. A common approach is to build a basic emergency fund first so that an unexpected cost does not force you to raid your goal savings. Once that buffer is in place, you can direct monthly contributions toward other goals. The emergency fund calculator can help you size that buffer.',
  },
  {
    id: 'sg-faq-7',
    question: 'Does this account for inflation?',
    answer:
      'No, the goal is treated as a fixed future amount. If your goal is years away, the real cost may be higher than today price because of inflation. To set a more realistic target, run your goal through the inflation calculator first and use the future cost as your goal here.',
  },
];
