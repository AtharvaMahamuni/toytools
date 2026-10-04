import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'matrix-calculator-faq-1',
    question: 'How do I multiply two matrices?',
    answer:
      'Leave the operation on Multiply. Type matrix A with one row on each line, numbers separated by spaces or commas. Type matrix B the same way. The columns of A must equal the rows of B. The headline number is the top-left entry of the product. Step 1 writes that entry as a dot product, such as 1×5 + 2×7 = 19 for the default matrices.',
  },
  {
    id: 'matrix-calculator-faq-2',
    question: 'What does the shape error mean?',
    answer:
      'Multiply needs the inner sizes to match. A 2×3 matrix times a 2×3 matrix fails because 3 does not equal 2. The message names both shapes, A is 2×3 and B is 2×3, instead of a generic error. Add and subtract need the same shape on both sides. Transpose, determinant, and inverse read matrix A only, so B can stay blank.',
  },
  {
    id: 'matrix-calculator-faq-3',
    question: 'How is the determinant of a 2 by 2 matrix found?',
    answer:
      'For rows a b and c d, the determinant is a×d - b×c. The default matrix 1 2 / 3 4 gives 1×4 - 2×3 = -2. Larger square matrices use elimination, and the step reports that value. A non-square matrix has no determinant. The message then names the shape, such as A is 2×3, and says a square matrix is required.',
  },
  {
    id: 'matrix-calculator-faq-4',
    question: 'When does a matrix have no inverse?',
    answer:
      'A matrix with determinant 0 has no inverse. The page says that in those words and does not invent a result. The matrix must also be square. A 2 by 2 example that fails is 1 2 / 2 4, because the second row is twice the first. The inverse of 1 2 / 3 4 exists. Its top-left entry is -2.',
  },
  {
    id: 'matrix-calculator-faq-5',
    question: 'How do I type a matrix?',
    answer:
      'Put one row on each line. Separate numbers with spaces or commas. A semicolon also starts a new row, so 1, 2; 3, 4 is the same matrix as two lines. Blank lines are skipped. Each row must have the same count of numbers. The largest grid is 8 by 8. A wider paste is refused before any arithmetic runs.',
  },
  {
    id: 'matrix-calculator-faq-6',
    question: 'What are the first steps?',
    answer:
      'Each result shows one worked step, not a paywalled expansion of every cell. For a product, the step is the first dot product. For a sum, it is the first entry added. For a 2 by 2 determinant, it is a×d - b×c. For an inverse, it names the top-left entry after Gauss-Jordan. The rest of the matrix is listed row by row under that step.',
  },
  {
    id: 'matrix-calculator-faq-7',
    question: 'Why do tenths not print as long decimals?',
    answer:
      '0.1 + 0.2 is not stored as 0.3 in binary floating point. A raw print shows 0.30000000000000004. This page tidies values so a result that is a tenth prints as 0.3, and a result that is a whole number prints as that whole number. The assumption line under the result says so. The arithmetic is still ordinary multiplication and addition.',
  },
  {
    id: 'matrix-calculator-faq-8',
    question: 'What does transpose do?',
    answer:
      'Transpose turns each row of A into a column. A 2×3 matrix becomes 3×2. Matrix B is ignored. The step says row 1 of A becomes column 1 of the result. The headline is still the top-left entry, which does not move, and the row list shows the new shape. Use it to check that you flipped the grid the way a textbook asks.',
  },
  {
    id: 'matrix-calculator-faq-9',
    question: 'Why is there no RREF button?',
    answer:
      'This page does not row-reduce a matrix to reduced row echelon form, and it does not solve a linear system. Inverse uses Gauss-Jordan internally, and the step reports the top-left entry, not a full elimination tableau. If you need RREF, this is the wrong tool. The operations here are add, subtract, multiply, transpose, determinant, and inverse.',
  },
  {
    id: 'matrix-calculator-faq-10',
    question: 'Does the matrix leave my device?',
    answer:
      'No. The entries stay in the browser tab. There is no upload and no account. A chat can multiply a small matrix if you paste it. This page lets you change one entry and watch the shape note or the first step update without sending the grid anywhere. Runs entirely on your device. Nothing is uploaded.',
  },
];
