import { Misconception } from '../../components/shared/MisconceptionAlert';

export type { Misconception };

export const ALGEBRA_EXPRESSION_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'combine-unlike',
    title: 'Combining Unlike Terms',
    misconception: '3x + 5 can be simplified to 8x.',
    correction: 'You can only combine like terms. 3x and 5 are unlike terms, so 3x + 5 is already in simplest form.',
    explanation: 'Like terms have the same variable raised to the same power. 3x and 2x are like terms (both have x), so 3x + 2x = 5x. But 3x and 5 are unlike terms — one has a variable and one is a constant — so they cannot be combined.',
    examples: [
      '3x + 2x = 5x ✓ (like terms)',
      '3x + 5 stays as 3x + 5 ✗ cannot combine',
      '4y + 2y = 6y ✓ (like terms)',
    ],
    relatedTopic: 'vars-expressions',
    difficulty: 'common',
  },
  {
    id: 'distribute-sign',
    title: 'Forgetting to Distribute the Negative',
    misconception: '-(3x + 2) equals -3x + 2.',
    correction: '-(3x + 2) equals -3x - 2. The negative sign must be distributed to EVERY term inside the parentheses.',
    explanation: 'When a negative sign is in front of parentheses, it acts like multiplying by -1. Every term inside must change sign. This is one of the most common algebra errors and leads to wrong answers throughout the solution.',
    examples: [
      '-(3x + 2) = -3x - 2 ✓',
      '-(3x + 2) ≠ -3x + 2 ✗',
      '-(5 - x) = -5 + x ✓',
    ],
    relatedTopic: 'vars-expressions',
    difficulty: 'common',
  },
  {
    id: 'exponent-distribute',
    title: 'Exponents Do Not Distribute Over Addition',
    misconception: '(x + 3)² equals x² + 9.',
    correction: '(x + 3)² = (x + 3)(x + 3) = x² + 6x + 9, NOT x² + 9.',
    explanation: 'An exponent applies to the ENTIRE expression inside parentheses. You must use FOIL or the distributive property to expand. Exponents only distribute over multiplication and division, not addition or subtraction.',
    examples: [
      '(2x)² = 4x² ✓ (exponent distributes over multiplication)',
      '(x + 3)² ≠ x² + 9 ✗ (exponent does NOT distribute over addition)',
      '(x + 3)² = x² + 6x + 9 ✓',
    ],
    relatedTopic: 'vars-expressions',
    difficulty: 'moderate',
  },
  {
    id: 'coefficient-one',
    title: 'Invisible Coefficient of 1',
    misconception: 'x is different from 1x, or x has no coefficient.',
    correction: 'x means 1x. The coefficient is 1, even though we do not write it.',
    explanation: 'By convention, we write x instead of 1x. But when combining like terms or solving equations, you must treat x as having a coefficient of 1. Similarly, -x means -1x.',
    examples: [
      '3x - x = 3x - 1x = 2x ✓',
      'x + x = 1x + 1x = 2x ✓',
      '-x means -1x ✓',
    ],
    relatedTopic: 'vars-expressions',
    difficulty: 'common',
  },
];

export const LINEAR_EQUATION_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'both-sides-operation',
    title: 'Forgetting to Do the Same Operation on Both Sides',
    misconception: 'To solve 2x + 4 = 10, you can just subtract 4 from the left side: 2x = 10.',
    correction: 'Whatever you do to one side of an equation, you MUST do to the other side. So 2x + 4 = 10 → 2x + 4 - 4 = 10 - 4 → 2x = 6.',
    explanation: 'An equation is like a balance scale. If you remove something from one side, the scale tips. You must remove the same thing from the other side to keep it balanced. This is the fundamental principle of algebra.',
    examples: [
      '2x + 4 = 10 → subtract 4 from BOTH sides → 2x = 6 ✓',
      '3x = 12 → divide BOTH sides by 3 → x = 4 ✓',
      'Adding 5 to only the left side breaks the equation ✗',
    ],
    relatedTopic: 'solve-linear',
    difficulty: 'common',
  },
  {
    id: 'divide-not-subtract',
    title: 'Dividing When You Should Subtract (or Vice Versa)',
    misconception: 'To isolate x in 2x = 6, subtract 2 from both sides: x = 4.',
    correction: '2x means 2 TIMES x, so you must DIVIDE both sides by 2: x = 3.',
    explanation: 'To undo an operation, you apply the INVERSE operation. Multiplication is undone by division. Addition is undone by subtraction. 2x means "2 times x", so divide by 2 to isolate x. Subtracting 2 from both sides gives (2x - 2) = 4, which does not help.',
    examples: [
      '2x = 6 → divide by 2 → x = 3 ✓',
      '2x = 6 → subtract 2 → 2x - 2 = 4 ✗ (x is still not isolated)',
      'x + 3 = 7 → subtract 3 → x = 4 ✓',
    ],
    relatedTopic: 'solve-linear',
    difficulty: 'common',
  },
  {
    id: 'verify-solution',
    title: 'Not Checking Your Answer',
    misconception: 'Once you find x, you are done — no need to check.',
    correction: 'Always substitute your answer back into the ORIGINAL equation to verify it is correct.',
    explanation: 'Verification catches arithmetic mistakes, sign errors, and cases where you may have lost a solution. It takes only a few seconds and gives you confidence in your answer. Professional mathematicians always check their work.',
    examples: [
      'For 2x + 4 = 10, if you find x = 3: check 2(3) + 4 = 10 ✓',
      'If you accidentally got x = 4: check 2(4) + 4 = 12 ≠ 10 ✗ error caught!',
    ],
    relatedTopic: 'solve-linear',
    difficulty: 'moderate',
  },
  {
    id: 'negative-variable',
    title: 'Negative Sign on the Variable',
    misconception: '-x = 5 cannot be solved because x cannot be negative.',
    correction: '-x = 5 means x = -5. The negative sign is part of the coefficient (-1), not a property of the variable.',
    explanation: 'When you see -x, it means -1 times x. To solve -x = 5, divide both sides by -1 to get x = -5. The variable x CAN be negative. The negative sign in front is just a coefficient of -1.',
    examples: [
      '-x = 5 → divide by -1 → x = -5 ✓',
      '-x = -3 → divide by -1 → x = 3 ✓',
      '-2x = 8 → divide by -2 → x = -4 ✓',
    ],
    relatedTopic: 'solve-linear',
    difficulty: 'common',
  },
  {
    id: 'move-vs-operation',
    title: '"Moving" Terms vs. Applying Operations',
    misconception: 'To solve 2x + 4 = 10, move the 4 to the other side and change its sign: 2x = 10 - 4.',
    correction: 'While the shortcut works, you are actually SUBTRACTING 4 from both sides. Understanding WHY it works is more important than the shortcut.',
    explanation: 'The "move and change sign" shortcut is really applying the same operation to both sides. When you "move +4 to the other side as -4", you are subtracting 4 from both sides. Understanding this helps you handle more complex cases correctly.',
    examples: [
      '"Move +4" = subtract 4 from both sides',
      '"Move ×2" = divide both sides by 2',
      '"Move -3" = add 3 to both sides',
    ],
    relatedTopic: 'solve-linear',
    difficulty: 'moderate',
  },
];

export const QUADRATIC_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'square-root-both-roots',
    title: 'Forgetting Both Roots When Solving x² = k',
    misconception: 'If x² = 9, then x = 3.',
    correction: 'If x² = 9, then x = 3 OR x = -3. A squared equation always has two solutions.',
    explanation: 'Because (-3)² = 9 and (3)² = 9, both values satisfy the equation. When you take the square root of both sides, you must write x = ±√9 = ±3. Forgetting the negative root is one of the most common WAEC exam errors.',
    examples: [
      'x² = 16 → x = ±4 ✓ (not just x = 4)',
      'x² = 0 → x = 0 (only one root, repeated)',
      'x² = -4 → no real solutions (cannot square-root a negative)',
    ],
    relatedTopic: 'quadratics',
    difficulty: 'common',
  },
];

export const ALL_MATH_MISCONCEPTIONS = [
  ...ALGEBRA_EXPRESSION_MISCONCEPTIONS,
  ...LINEAR_EQUATION_MISCONCEPTIONS,
  ...QUADRATIC_MISCONCEPTIONS,
];
