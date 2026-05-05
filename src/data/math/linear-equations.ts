import type { Topic } from '../types';

export const LINEAR_EQUATIONS_TOPIC: Topic =
      {
        id: 'linear-equations',
        title: 'Linear Equations and Functions',
        subtopics: [
          {
            id: 'vars-expressions',
            title: 'Variables and Expressions',
            lesson: {
              sections: [
                {
                  title: 'What is a variable?',
                  content: 'In algebra, a variable is a symbol (usually a letter like x or y) that represents an unknown number.',
                },
                {
                  title: 'Parts of an Expression',
                  content: 'In 4x + 7, "x" is the variable, "4" is the coefficient, and "7" is a constant.',
                  interactive: {
                    type: 'reveal',
                    label: 'Simplify 3x + 2x?',
                    hiddenContent: '5x. We add the coefficients of the "like terms."'
                  }
                },
                {
                  title: 'Evaluating Expressions',
                  content: 'To evaluate means to substitute a number for the variable. If x = 3, then 2x + 5 = 2(3) + 5 = 11.',
                }
              ]
            },
            flashcards: [
              { id: 'm1f1', question: 'What do we call a letter representing a number?', answer: 'Variable' },
              { id: 'm1f2', question: 'In 5y - 2, what is the constant?', answer: '-2' },
              { id: 'm1f3', question: 'Can you add 2x and 3y?', answer: 'No (they are not like terms)' },
              { id: 'm1f4', question: 'Simplify: 7a + 2a - a', answer: '8a' },
              { id: 'm1f5', question: 'Evaluate 10 - z if z = 4', answer: '6' }
            ],
            checkpointAssessment: [
              {
                id: 'm1q1',
                type: 'mcq',
                prompt: 'Simplify 4x + 3y + 2x - y:',
                options: [
                  { id: 'a', text: '6x + 2y' },
                  { id: 'b', text: '7x + y' },
                  { id: 'c', text: '6x + 4y' },
                  { id: 'd', text: '8xy' }
                ],
                correctAnswer: 'a'
              },
              {
                id: 'm1q2',
                type: 'one-word',
                prompt: 'What is the term for the number multiplying a variable (e.g., the 5 in 5x)?',
                correctAnswer: 'Coefficient',
                explanation: 'A coefficient quantifies the variable.'
              },
              {
                id: 'm1q3',
                type: 'matching',
                prompt: 'Identify the parts:',
                pairs: [
                  { left: 'x', right: 'Variable' },
                  { left: '12', right: 'Constant' },
                  { left: '4n', right: 'Variable term' }
                ]
              },
              {
                id: 'm1q4',
                type: 'mcq',
                prompt: 'Evaluate (x + 2) / 2 if x = 10:',
                options: [
                  { id: 'a', text: '5' },
                  { id: 'b', text: '6' },
                  { id: 'c', text: '7' },
                  { id: 'd', text: '12' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'm1q5',
                type: 'one-word',
                prompt: 'Simplify: x + x + x',
                correctAnswer: '3x',
                hint: 'Coefficient is 3'
              }
            ]
          },
          {
            id: 'solve-linear',
            title: 'Solving Linear Equations',
            lesson: {
              sections: [
                {
                  title: 'The Golden Rule',
                  content: 'Whatever you do to one side of the equation, you MUST do to the other side to keep it balanced.',
                },
                {
                  title: 'Inverse Operations',
                  content: 'To solve x + 5 = 12, use the inverse of addition (subtraction). Subtract 5 from both sides: x = 7.',
                  interactive: {
                    type: 'expand',
                    label: 'Two-step example',
                    hiddenContent: '2x + 4 = 10. Step 1: Subtract 4 (2x = 6). Step 2: Divide by 2 (x = 3).'
                  }
                },
                {
                  title: 'Equating Variables',
                  content: 'If 3x = 15, divide by the coefficient: 15 / 3 = 5. So x = 5.',
                }
              ]
            },
            flashcards: [
              { id: 'm2f1', question: 'Inverse of multiplication?', answer: 'Division' },
              { id: 'm2f2', question: 'Solve x - 10 = 30', answer: 'x = 40' },
              { id: 'm2f3', question: 'Solve 4x = 24', answer: 'x = 6' },
              { id: 'm2f4', question: 'Solve x/2 = 5', answer: 'x = 10' },
              { id: 'm2f5', question: 'Goal of solving an equation?', answer: 'Isolate the variable' }
            ],
            checkpointAssessment: [
              {
                id: 'm2q1',
                type: 'mcq',
                prompt: 'Solve 3x - 5 = 10:',
                options: [
                  { id: 'a', text: 'x = 5' },
                  { id: 'b', text: 'x = 15' },
                  { id: 'c', text: 'x = 3' },
                  { id: 'd', text: 'x = 1' }
                ],
                correctAnswer: 'a'
              },
              {
                id: 'm2q2',
                type: 'one-word',
                prompt: 'What is the inverse of subtraction?',
                correctAnswer: 'Addition',
                explanation: 'Adding cancels out a negative value.'
              },
              {
                id: 'm2q3',
                type: 'matching',
                prompt: 'Match Equation to Solution:',
                pairs: [
                  { left: 'x + 4 = 10', right: 'x = 6' },
                  { left: 'x - 4 = 10', right: 'x = 14' },
                  { left: '4x = 10', right: 'x = 2.5' }
                ]
              },
              {
                id: 'm2q4',
                type: 'mcq',
                prompt: 'Solve for y: y/3 = 12',
                options: [
                  { id: 'a', text: '4' },
                  { id: 'b', text: '36' },
                  { id: 'c', text: '15' },
                  { id: 'd', text: '9' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'm2q5',
                type: 'one-word',
                prompt: 'Solve 10 + x = 10',
                correctAnswer: '0',
                hint: 'Isolate x'
              }
            ]
          },
          {
            id: 'graph-linear',
            title: 'Graphing Linear Functions',
            lesson: {
              sections: [
                {
                  title: 'The Heroic Formula',
                  content: 'Most lines follow the format y = mx + c. "m" is the gradient (slope) and "c" is the y-intercept (where it hits the vertical axis).',
                },
                {
                  title: 'Calculating Gradient',
                  content: 'Gradient (m) = Rise / Run. It tells you how steep the line is.',
                  interactive: {
                    type: 'reveal',
                    label: 'Positive vs Negative?',
                    hiddenContent: 'A positive slope goes "uphill" from left to right. Negative goes "downhill."'
                  }
                },
                {
                  title: 'Plotting Points',
                  content: 'Using a table of values, we can pick x-values, solve for y, and plot these coordinates on a Cartesian plane.',
                }
              ]
            },
            flashcards: [
              { id: 'm3f1', question: 'What does "c" represent in y=mx+c?', answer: 'y-intercept' },
              { id: 'm3f2', question: 'Slope is defined as Rise over...', answer: 'Run' },
              { id: 'm3f3', question: 'Gradient of y = 3x - 1?', answer: '3' },
              { id: 'm3f4', question: 'Intercept of y = -2x + 5?', answer: '5' },
              { id: 'm3f5', question: 'Is a horizontal line’s slope zero or infinite?', answer: 'Zero' }
            ],
            checkpointAssessment: [
              {
                id: 'm3q1',
                type: 'mcq',
                prompt: 'Where does the line y = 4x - 7 cross the y-axis?',
                options: [
                  { id: 'a', text: '(0, 4)' },
                  { id: 'b', text: '(0, -7)' },
                  { id: 'c', text: '(4, 0)' },
                  { id: 'd', text: '(7, 0)' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'm3q2',
                type: 'one-word',
                prompt: 'What term describes how steep a line is?',
                correctAnswer: 'Gradient',
                explanation: 'Also known as the slope.'
              },
              {
                id: 'm3q3',
                type: 'matching',
                prompt: 'Match Equation to slope:',
                pairs: [
                  { left: 'y = x + 1', right: '1' },
                  { left: 'y = 5x', right: '5' },
                  { left: 'y = -2x + 9', right: '-2' }
                ]
              },
              {
                id: 'm3q4',
                type: 'mcq',
                prompt: 'Which line is steeper?',
                options: [
                  { id: 'a', text: 'y = 2x' },
                  { id: 'b', text: 'y = 10x' },
                  { id: 'c', text: 'y = 0.5x' },
                  { id: 'd', text: 'y = x + 100' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'm3q5',
                type: 'one-word',
                prompt: 'A line goes up 10 and right 2. Gradient = ... ?',
                correctAnswer: '5',
                hint: '10 / 2'
              }
            ]
          },
          {
            id: 'algebraic-systems',
            title: 'Simultaneous Equations & Algebraic Systems',
            lesson: {
              sections: [
                {
                  title: 'Two Unknowns, Two Equations',
                  content: 'A system of simultaneous equations involves two (or more) equations that must be satisfied at the same time. The solution is the set of values that makes ALL equations true. Graphically, this is the point where two lines intersect.',
                },
                {
                  title: 'Elimination Method',
                  content: 'Add or subtract the equations to eliminate one variable. Make coefficients equal first if needed by multiplying one or both equations. Example: 2x + y = 7 and x + y = 5. Subtracting: x = 2. Substituting: y = 3.',
                  interactive: {
                    type: 'expand',
                    label: 'Worked example: solve 3x + 2y = 12 and x - y = 1',
                    hiddenContent: 'From the second equation: x = y + 1. Substitute into first: 3(y+1) + 2y = 12 → 5y = 9 → y = 1.8, x = 2.8. Check: 3(2.8) + 2(1.8) = 8.4 + 3.6 = 12 ✓'
                  }
                },
                {
                  title: 'Graphical Interpretation',
                  content: 'Two distinct lines meeting at one point → one unique solution. Two parallel lines (same gradient, different intercept) → no solution. Two identical lines → infinitely many solutions. The graphical view connects algebra to geometry and helps spot impossible or dependent systems.',
                }
              ]
            },
            flashcards: [
              { id: 'alg-f1', question: 'A simultaneous solution satisfies how many equations?', answer: 'All equations in the system simultaneously' },
              { id: 'alg-f2', question: 'Graphically, the unique solution is the?', answer: 'Intersection point of the lines' },
              { id: 'alg-f3', question: 'Two parallel lines produce how many solutions?', answer: 'No solution (inconsistent system)' },
              { id: 'alg-f4', question: 'Substitution method involves?', answer: 'Expressing one variable in terms of another and substituting' },
              { id: 'alg-f5', question: 'If both equations are identical, solutions are?', answer: 'Infinitely many' }
            ],
            checkpointAssessment: [
              {
                id: 'alg-q1',
                type: 'mcq',
                prompt: 'If two lines cross once, the system has:',
                options: [
                  { id: 'a', text: 'No solution' },
                  { id: 'b', text: 'One unique solution' },
                  { id: 'c', text: 'Infinite solutions' },
                  { id: 'd', text: 'Only negative solutions' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'alg-q2',
                type: 'one-word',
                prompt: 'Solve: x + y = 10 and x - y = 2. What is x?',
                correctAnswer: '6',
                explanation: 'Adding equations: 2x = 12, so x = 6.'
              }
            ]
          },
          {
            id: 'function-transformation-composer',
            title: 'Function Transformations',
            lesson: {
              sections: [
                {
                  title: 'Translations (Shifts)',
                  content: 'Adding a constant k to the output shifts the graph vertically: y = f(x) + k moves the graph up by k. Replacing x with (x - h) shifts the graph horizontally: y = f(x - h) moves the graph right by h (note the counterintuitive sign!).',
                  interactive: {
                    type: 'reveal',
                    label: 'y = (x - 3)² vs y = x² — what changes?',
                    hiddenContent: 'The vertex moves from (0,0) to (3,0). The entire parabola shifts 3 units to the right. Remember: subtracting inside the brackets moves right; adding moves left.'
                  }
                },
                {
                  title: 'Stretches and Reflections',
                  content: 'Multiplying the output by a scales vertically: y = af(x). |a| > 1 stretches; 0 < |a| < 1 compresses; a < 0 reflects in the x-axis. Replacing x with (x/b) scales horizontally: y = f(x/b) stretches by factor b.',
                },
                {
                  title: 'Combining Transformations',
                  content: 'Multiple transformations can be combined: y = af(x - h) + k. Apply in order: horizontal shift, stretch/reflection, vertical shift. For quadratics this gives vertex form: y = a(x - h)² + k, where (h, k) is the vertex.',
                  interactive: {
                    type: 'expand',
                    label: 'Describe the transformation from y = x² to y = 2(x + 1)² - 3',
                    hiddenContent: '1. Shift left 1 (x replaced by x+1). 2. Vertical stretch ×2. 3. Shift down 3. Vertex moves from (0,0) to (-1, -3).'
                  }
                }
              ]
            },
            flashcards: [
              { id: 'ftc-f1', question: 'What does +k do in y = f(x) + k?', answer: 'Shifts the graph vertically up by k' },
              { id: 'ftc-f2', question: 'What does negative a do in y = af(x)?', answer: 'Reflects the graph in the x-axis' },
              { id: 'ftc-f3', question: 'y = f(x - 3) shifts the graph how?', answer: 'Right by 3 units (horizontal translation)' },
              { id: 'ftc-f4', question: 'What is vertex form for a quadratic?', answer: 'y = a(x - h)² + k, vertex at (h, k)' },
              { id: 'ftc-f5', question: '|a| > 1 in y = af(x) causes?', answer: 'Vertical stretch (makes graph taller/narrower)' }
            ],
            checkpointAssessment: [
              {
                id: 'ftc-q1',
                type: 'mcq',
                prompt: 'y = (x - 3)² moves y = x² in which direction?',
                options: [
                  { id: 'a', text: 'Left 3' },
                  { id: 'b', text: 'Right 3' },
                  { id: 'c', text: 'Up 3' },
                  { id: 'd', text: 'Down 3' }
                ],
                correctAnswer: 'b',
                explanation: 'Replacing x with (x-3) shifts the graph right by 3.'
              },
              {
                id: 'ftc-q2',
                type: 'one-word',
                prompt: 'In y = a f(x), larger |a| causes a vertical ... ?',
                correctAnswer: 'Stretch',
              }
            ]
          }
        ],
        finalAssessment: [
          {
            id: 'm-final-1',
            type: 'mcq',
            prompt: 'Solve for x: 2(x + 3) = 12',
            options: [
              { id: 'a', text: '3' },
              { id: 'b', text: '6' },
              { id: 'c', text: '9' },
              { id: 'd', text: '0' }
            ],
            correctAnswer: 'a'
          },
          {
            id: 'm-final-2',
            type: 'one-word',
            prompt: 'Simplify 5x + 2 - 3x + 10',
            correctAnswer: '2x + 12'
          },
          {
            id: 'm-final-3',
            type: 'matching',
            prompt: 'Identify functional parts:',
            pairs: [
              { left: 'm', right: 'Slope' },
              { left: 'x', right: 'Input' },
              { left: 'y', right: 'Output' }
            ]
          }
        ]
      }
