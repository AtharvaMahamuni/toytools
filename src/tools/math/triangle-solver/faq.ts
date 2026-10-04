import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'triangle-solver-faq-1',
    question: 'How do I solve a triangle when I know only three parts?',
    answer:
      'Enter any three of the six boxes: sides a, b, and c, or angles A, B, and C in degrees. Leave the other three blank. Three sides, or two sides and the included angle, use the law of cosines. Two angles and any side use the law of sines after the third angle is set to 180 minus the other two. A fourth filled box is rejected, because the page cannot tell which three you meant.',
  },
  {
    id: 'triangle-solver-faq-2',
    question: 'What is the ambiguous case in a triangle?',
    answer:
      'The ambiguous case is SSA: two sides and an angle that is not between them. If the opposite side is longer than the height but shorter than the other given side, two triangles fit. Try angle A = 30 degrees, side a = 7, and side b = 10. The height is 5, so both an acute angle B and an obtuse angle B are drawn. Printing only the acute answer hides a real triangle.',
  },
  {
    id: 'triangle-solver-faq-3',
    question: 'Why will three angles not solve the triangle?',
    answer:
      'Three angles fix the shape and not the size. A 30-60-90 triangle and a larger 30-60-90 triangle share every angle and share no side length. The solver asks you to clear one angle and type a side, or to add a side and clear one angle, before it will scale the figure. AAA is a similarity class, not a unique triangle.',
  },
  {
    id: 'triangle-solver-faq-4',
    question: 'How does the Pythagorean theorem show up here?',
    answer:
      'Enter sides 3, 4, and 5 and leave the angles blank. The angle opposite 5 is 90 degrees, so the figure is a right triangle and 3 squared plus 4 squared equals 5 squared. The same check works for any right triangle: the longest side is the hypotenuse, and the right angle sits opposite it. If your three lengths fail that test, the triangle is oblique and the law of cosines is the right tool.',
  },
  {
    id: 'triangle-solver-faq-5',
    question: 'What is the difference between the law of sines and the law of cosines?',
    answer:
      'The law of cosines needs three sides, or two sides and the included angle, and it returns the angle (or the third side) without a second candidate. The law of sines compares a side with the sine of the opposite angle. Use it for ASA and AAS, where the angles already sum toward 180. Use it carefully for SSA, because sine of an acute angle equals sine of its supplement, which is why two triangles can appear.',
  },
  {
    id: 'triangle-solver-faq-6',
    question: 'Which side is opposite which angle?',
    answer:
      'Side a sits opposite angle A, side b opposite angle B, and side c opposite angle C. The drawing places A at the left, B at the right end of side c, and C up and to the right. If a homework diagram names the sides differently, copy the opposite pairs into these boxes rather than the left-to-right order on the paper. A swapped pair still solves, but it solves a different triangle.',
  },
  {
    id: 'triangle-solver-faq-7',
    question: 'Are the angles in degrees or radians?',
    answer:
      'Every angle box is degrees. A right angle is 90, a straight line is 180, and a full turn is 360, which cannot appear inside one triangle. If your notes are in radians, convert before you type: multiply by 180 and divide by pi. The unit circle tool on this site plots an angle in standard position if you want to check that conversion by eye.',
  },
  {
    id: 'triangle-solver-faq-8',
    question: 'Does this triangle calculator upload my numbers?',
    answer:
      'No. The sides, the angles, and the drawing are computed in the browser after the page loads. Nothing is uploaded, and there is no account. A class worksheet can stay on the device. Once the page is open it keeps working offline, which is the same privacy line as the other calculators here.',
  },
  {
    id: 'triangle-solver-faq-9',
    question: 'Why did my three lengths get rejected?',
    answer:
      'Each side has to be shorter than the other two added together. Sides 2, 3, and 6 fail because 2 + 3 is not greater than 6, so the ends never meet. Sides 2, 3, and 5 also fail, because 2 + 3 equals 5 and the figure collapses into a line segment. Nudge the long side down, or lengthen a short side, until the inequality is strict.',
  },
  {
    id: 'triangle-solver-faq-10',
    question: 'Can I use this for area, or only for the missing parts?',
    answer:
      'The page returns the three sides and the three angles, plus a figure on equal scale. It does not print area. With all three sides known you can compute area yourself with Heron, or with one half ab sin C once you have two sides and the included angle. The job here is the missing parts and the second SSA triangle, not a list of every triangle formula.',
  },
];
