import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'dice-faq-1',
    question: 'What does 4d6+2 mean?',
    answer:
      'Roll four six-sided dice, add them together, then add two to the total. The number before the d is how many dice, the number after it is how many faces each one has, and anything after that is a flat bonus or penalty applied once to the sum rather than once per die. So 4d6+2 runs from 6 to 26, and d20 on its own means a single twenty-sided die.',
  },
  {
    id: 'dice-faq-2',
    question: 'Is an online dice roller actually random?',
    answer:
      'This one draws from your browser\'s cryptographic random number generator, the same source a password generator uses, and it rejects the values that would bias the result rather than taking a shortcut with a remainder. That makes it fairer than a physical die, which has weight in its pips and wear on its corners. What it cannot do is look fair, which is why the tool reports how likely each result was: the number is checkable in a way a rolling animation is not.',
  },
  {
    id: 'dice-faq-3',
    question: 'What are the odds of rolling 15 or higher on 2d6+3?',
    answer:
      'About 17 percent, or six outcomes in thirty six. Two six-sided dice do not spread evenly: seven comes up six times as often as two, so the totals bunch hard in the middle and the ends are rare. The tool works this out exactly for whatever pool you rolled and says it under the result, which is the number you actually need when deciding whether a plan is worth trying.',
  },
  {
    id: 'dice-faq-4',
    question: 'Why do 2d6 and 1d12 behave so differently?',
    answer:
      'They cover a similar span and nothing else about them matches. A single twelve-sided die gives every number the same one in twelve chance, so a 12 is exactly as likely as a 7. Two six-sided dice have to agree with each other, and there are six ways to make a 7 against one way to make a 12. If you need a reliable middling result, take the pair. If you need the occasional spike, take the single die.',
  },
  {
    id: 'dice-faq-5',
    question: 'I rolled low six times. Am I due a high roll?',
    answer:
      'No. Dice have no memory, so the next roll has exactly the same distribution as the first one did. What does change is your sample: over hundreds of rolls the average settles close to the expected value, not because bad luck gets repaid but because later rolls swamp the early ones. A run of six low rolls on a d20 happens roughly once in every seventy attempts, which is often enough to happen to you.',
  },
  {
    id: 'dice-faq-6',
    question: 'How many dice can I roll at once?',
    answer:
      'Up to 100 dice of up to 1000 faces each, and up to 20 separate rolls of that pool in one go, which covers stat lines, damage on a critical hit and any board game you are likely to meet. The odds line under the result is exact rather than estimated, so it stops appearing for pools past 20 dice or 100 faces, where computing it exactly would cost more than the answer is worth. Silence there means the tool declined to guess.',
  },
];
