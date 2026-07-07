import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sci-calc-faq-1',
    question: 'What order of operations does the calculator use?',
    answer:
      'It follows standard math order of operations. Powers and roots are applied first, then multiplication, division, and modulo, and finally addition and subtraction, with anything in parentheses evaluated first. So 2 + 3 x 4 is 14, not 20, and (2 + 3) x 4 is 20. You can type a whole expression and the calculator resolves the precedence for you.',
  },
  {
    id: 'sci-calc-faq-2',
    question: 'How do I switch between degrees and radians?',
    answer:
      'Use the DEG and RAD buttons above the keypad. The choice changes how the trig functions read angles: in DEG, sin(30) is 0.5, while in RAD the same expression treats 30 as radians and gives a different value. Inverse trig functions such as asin return their answer in whichever unit is selected. Most school problems use degrees.',
  },
  {
    id: 'sci-calc-faq-3',
    question: 'What functions and constants are available?',
    answer:
      'Trigonometry (sin, cos, tan and their inverses), natural log (ln), log base 10 (log), the exponential e^x, square root, cube root, absolute value, floor, ceiling, round, powers with ^, and factorial with the x! key. Constants include pi and e, and Ans reuses your previous answer. You can also nest functions and parentheses as deeply as you need.',
  },
  {
    id: 'sci-calc-faq-4',
    question: 'What do the memory keys do?',
    answer:
      'MS stores the current value in memory, MR recalls it into your expression, and MC clears it. M+ adds the current value to what is already in memory and M- subtracts it, which is handy for running totals. A small M indicator appears whenever memory holds a value.',
  },
  {
    id: 'sci-calc-faq-5',
    question: 'Can I type with my keyboard?',
    answer:
      'Yes. Click the display, then use your physical keyboard for digits, the operators + - * / ^ and %, parentheses, and the factorial mark. Press Enter or = to calculate, Backspace to delete, and Escape to clear. The on-screen keys and your keyboard stay in sync, so you can mix the two.',
  },
  {
    id: 'sci-calc-faq-6',
    question: 'Does implicit multiplication work?',
    answer:
      'Yes. Writing 2pi, 2(3 + 4), or (1 + 2)(3 + 4) is understood as multiplication, so you do not need to type every times sign. Note that a division such as 1/2pi is read left to right as (1/2) x pi, so add parentheses when you mean 1/(2 x pi).',
  },
  {
    id: 'sci-calc-faq-7',
    question: 'Is my data uploaded anywhere?',
    answer:
      'No. The calculator runs entirely in your browser, and your expressions and history stay on your device. Nothing is sent to a server, and it keeps working offline once the page has loaded.',
  },
];
