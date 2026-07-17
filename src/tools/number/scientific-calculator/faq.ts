import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sci-calc-faq-8',
    question: 'What is a scientific calculator?',
    answer:
      'A scientific calculator evaluates a full expression with correct order of operations and adds functions a basic model lacks: trigonometry, logarithms, powers, roots, and factorials. For example, typing 2 + 3 x 4 returns 14 because multiplication is applied before addition, and sin(30) in DEG mode returns 0.5. This one also includes the constants pi and e, memory keys, an Ans key for the previous answer, and a reusable history list.',
  },
  {
    id: 'sci-calc-faq-1',
    question: 'What order of operations does the calculator use?',
    answer:
      'It follows standard math order of operations. Powers and roots are applied first, then multiplication, division, and modulo, and finally addition and subtraction, with anything in parentheses evaluated first. So 2 + 3 x 4 is 14, not 20, and (2 + 3) x 4 is 20. You can type a whole expression and the calculator resolves the precedence for you.',
  },
  {
    id: 'sci-calc-faq-10',
    question: 'What is the difference between a scientific calculator and a basic calculator?',
    answer:
      'A basic calculator applies one operation at a time and ignores precedence, while a scientific calculator reads the whole expression and resolves the order of operations for you. Press 2 + 3 x 4 on a basic model and you get 20; here the same keys give 14, the correct answer. A scientific keypad also adds sin, cos, tan, ln, log, x^y, square root, factorial, and the constants pi and e.',
  },
  {
    id: 'sci-calc-faq-2',
    question: 'How do I switch between degrees and radians?',
    answer:
      'Use the DEG and RAD buttons above the keypad. The choice changes how the trig functions read angles: in DEG, sin(30) is 0.5, while in RAD the same expression treats 30 as radians and gives a different value. Inverse trig functions such as asin return their answer in whichever unit is selected. Most school problems use degrees.',
  },
  {
    id: 'sci-calc-faq-11',
    question: 'Why is my trig answer wrong?',
    answer:
      'Check the angle mode: a wrong-looking trig answer means the calculator is reading your angle in the wrong unit. sin(30) is 0.5 in DEG mode but about -0.988 in RAD mode, because RAD treats 30 as 30 radians, almost five full turns around the circle. The highlighted button above the keypad shows the current mode; press DEG for degree homework and RAD for calculus. For the picture behind the two units, open the unit circle explorer.',
  },
  {
    id: 'sci-calc-faq-9',
    question: 'How do I raise a number to a power?',
    answer:
      'Press the x^y key, or type the caret ^ directly on your keyboard. For example, 2 ^ 10 evaluates to 1024, and the x² key squares the current value in one tap. Chained powers are read right to left, so 2^3^2 means 2^(3^2) = 512, not 64. For a fractional exponent, wrap it in parentheses: 8^(1/3) returns 2, the cube root of 8.',
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
    id: 'sci-calc-faq-12',
    question: 'Why does the calculator say the result is undefined?',
    answer:
      'The expression asked for a value that does not exist in real numbers, so the calculator reports "Result is undefined (check the values)". Common triggers are sqrt(-1), ln(-5), log(0), and asin(2) or acos(-3), since inverse sine and cosine only accept inputs from -1 to 1. Division by zero shows a separate message about dividing by zero. Fix the input, not the calculator: asin(0.5) returns 30 in DEG mode, but asin(2) has no answer.',
  },
  {
    id: 'sci-calc-faq-7',
    question: 'Is my data uploaded anywhere?',
    answer:
      'No. The calculator runs entirely in your browser, and your expressions and history stay on your device. Nothing is sent to a server, and it keeps working offline once the page has loaded.',
  },
];
