import type { Topic } from '../types';

export const CALCULUS_TOPIC: Topic = {
  id: 'calculus',
  title: 'Calculus Fundamentals',
  subtopics: [
    {
      id: 'limits-continuity',
      title: 'Limits and Continuity',
      lesson: {
        sections: [
          {
            title: 'What is a Limit?',
            content: 'A limit describes the value a function approaches as x gets closer and closer to some value. We write lim(x→a) f(x) = L to say "as x approaches a, f(x) approaches L." The function does not need to be defined at x = a — we only care about the behaviour near a. For example, lim(x→2) (x²−4)/(x−2) = 4, even though the expression is undefined at x = 2, because factoring gives (x+2)(x−2)/(x−2) = x+2, which equals 4 when x = 2.',
            interactive: {
              type: 'reveal' as const,
              label: 'Find lim(x→3) (x²−9)/(x−3)',
              hiddenContent: 'Factor: (x−3)(x+3)/(x−3) = x+3. As x→3, the limit is 3+3 = 6.'
            }
          },
          {
            title: 'Continuity',
            content: 'A function is continuous at x = a if three conditions hold: (1) f(a) is defined, (2) lim(x→a) f(x) exists, and (3) lim(x→a) f(x) = f(a). A function is continuous if you can draw its graph without lifting your pen. Polynomials are continuous everywhere. Functions with holes, jumps, or vertical asymptotes are discontinuous at those points. For instance, f(x) = 1/x is discontinuous at x = 0 because the limit does not exist (it approaches ±∞ from each side).',
            interactive: {
              type: 'expand' as const,
              label: 'Is f(x) = (x²−1)/(x−1) continuous at x = 1?',
              hiddenContent: 'f(1) is undefined (0/0), so condition 1 fails. The limit exists — lim(x→1) (x+1) = 2 — but since f(1) is not defined, the function is discontinuous at x = 1. This is a removable discontinuity (a hole).'
            }
          },
          {
            title: 'WAEC Limit Problems',
            content: 'WAEC commonly tests limits of rational functions and piecewise functions. Typical question: "Evaluate lim(x→2) (x³−8)/(x²−4)." Factor both numerator and denominator: x³−8 = (x−2)(x²+2x+4) and x²−4 = (x−2)(x+2). Cancel (x−2): lim = (x²+2x+4)/(x+2) at x = 2 = (4+4+4)/4 = 12/4 = 3. Another WAEC favourite: limits at infinity. For lim(x→∞) (3x²+2x)/(5x²−1), divide top and bottom by x² → 3/5.',
            interactive: {
              type: 'reveal' as const,
              label: 'WAEC practice: Find lim(x→∞) (2x²+3x)/(4x²−7)',
              hiddenContent: 'Divide numerator and denominator by x²: (2 + 3/x)/(4 − 7/x²). As x→∞, 3/x→0 and 7/x²→0. Limit = 2/4 = 1/2.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'lc-f1', question: 'What does lim(x→a) f(x) = L mean?', answer: 'As x gets closer to a, f(x) gets closer to L' },
        { id: 'lc-f2', question: 'Three conditions for continuity at x = a?', answer: 'f(a) is defined, lim(x→a) f(x) exists, and the limit equals f(a)' },
        { id: 'lc-f3', question: 'How do you evaluate lim(x→∞) of a rational function?', answer: 'Divide numerator and denominator by the highest power of x' },
        { id: 'lc-f4', question: 'What is a removable discontinuity?', answer: 'A hole where the limit exists but the function is not defined' },
        { id: 'lc-f5', question: 'Find lim(x→0) sin(x)/x?', answer: '1' }
      ],
      checkpointAssessment: [
        {
          id: 'lc-q1',
          type: 'mcq' as const,
          prompt: 'lim(x→1) (x²−1)/(x−1) equals:',
          options: [
            { id: 'a', text: '0' },
            { id: 'b', text: '1' },
            { id: 'c', text: '2' },
            { id: 'd', text: 'Undefined' }
          ],
          correctAnswer: 'c',
          explanation: 'Factor: (x−1)(x+1)/(x−1) = x+1 → limit as x→1 is 2.'
        },
        {
          id: 'lc-q2',
          type: 'mcq' as const,
          prompt: 'lim(x→∞) (5x²+3x)/(2x²−1) equals:',
          options: [
            { id: 'a', text: '5/2' },
            { id: 'b', text: '5/3' },
            { id: 'c', text: '2/5' },
            { id: 'd', text: '∞' }
          ],
          correctAnswer: 'a',
          explanation: 'Divide by x²: (5 + 3/x)/(2 − 1/x²) → 5/2 as x→∞.'
        },
        {
          id: 'lc-q3',
          type: 'one-word' as const,
          prompt: 'A function with a hole but an existing limit has what type of discontinuity?',
          correctAnswer: 'Removable',
          hint: 'The discontinuity can be "removed" by defining f(a) = the limit'
        },
        {
          id: 'lc-q4',
          type: 'matching' as const,
          prompt: 'Match the limit expression to its value:',
          pairs: [
            { left: 'lim(x→2) (x²−4)/(x−2)', right: '4' },
            { left: 'lim(x→∞) (3x)/(6x)', right: '1/2' },
            { left: 'lim(x→0) sin(x)/x', right: '1' }
          ]
        }
      ]
    },
    {
      id: 'derivative-explorer',
      title: 'Derivative Explorer',
      lesson: {
        sections: [
          {
            title: 'What is a Derivative?',
            content: 'The derivative measures the rate of change of a function. Formally: dy/dx = lim(Δx→0) [f(x+Δx) − f(x)] / Δx. Geometrically, it is the gradient of the tangent to the curve at a point. A positive derivative means the function is increasing; a negative derivative means it is decreasing; a zero derivative means a stationary point. If y = x², then dy/dx = 2x — the rate of change doubles as x increases. At x = 3, the gradient is 6.',
            interactive: {
              type: 'reveal' as const,
              label: 'Find the gradient of y = x² at x = 5',
              hiddenContent: 'dy/dx = 2x. At x = 5, gradient = 2(5) = 10.'
            }
          },
          {
            title: 'Rules of Differentiation',
            content: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Constant rule: d/dx(c) = 0. Sum rule: differentiate term by term. Examples: d/dx(x³) = 3x², d/dx(5x⁷) = 35x⁶, d/dx(4) = 0. For a polynomial like y = 3x⁴ − 2x² + 7x − 5, differentiate each term: dy/dx = 12x³ − 4x + 7. These rules replace the slow limit-definition method for standard functions.',
            interactive: {
              type: 'reveal' as const,
              label: 'Differentiate y = 3x⁴ − 2x² + 7x − 5',
              hiddenContent: 'dy/dx = 3(4)x³ − 2(2)x + 7(1) − 0 = 12x³ − 4x + 7.'
            }
          },
          {
            title: 'Applications: Rates and Turning Points',
            content: 'Setting dy/dx = 0 finds stationary points (where the curve is flat). The second derivative test classifies them: if d²y/dx² < 0 at the point, it is a maximum; if d²y/dx² > 0, it is a minimum. WAEC often asks to find and classify turning points. Example: y = x³ − 6x² + 9x + 1. dy/dx = 3x² − 12x + 9 = 3(x² − 4x + 3) = 3(x−1)(x−3). Stationary points at x = 1 and x = 3. d²y/dx² = 6x − 12. At x = 1: d²y/dx² = −6 < 0 → maximum. At x = 3: d²y/dx² = 6 > 0 → minimum.',
            interactive: {
              type: 'expand' as const,
              label: 'WAEC style: Find and classify the turning points of y = 2x³ − 3x² − 12x + 8',
              hiddenContent: 'dy/dx = 6x² − 6x − 12 = 6(x² − x − 2) = 6(x−2)(x+1). Stationary at x = 2 and x = −1. d²y/dx² = 12x − 6. At x = 2: 24 − 6 = 18 > 0 → minimum (y = 2(8)−3(4)−12(2)+8 = −12). At x = −1: −12−6 = −18 < 0 → maximum (y = 2(−1)−3(1)−12(−1)+8 = 15).'
            }
          }
        ]
      },
      flashcards: [
        { id: 'de-f1', question: 'What does the derivative measure?', answer: 'The rate of change (gradient of the tangent)' },
        { id: 'de-f2', question: 'Power rule: d/dx(xⁿ)?', answer: 'nxⁿ⁻¹' },
        { id: 'de-f3', question: 'What does dy/dx = 0 tell you?', answer: 'There is a stationary point (max, min, or inflection)' },
        { id: 'de-f4', question: 'Second derivative test: d²y/dx² < 0 means?', answer: 'The stationary point is a maximum' },
        { id: 'de-f5', question: 'd/dx(5x³ − 2x + 4) = ?', answer: '15x² − 2' }
      ],
      checkpointAssessment: [
        {
          id: 'de-q1',
          type: 'mcq' as const,
          prompt: 'Differentiate y = 4x³ − 2x² + x:',
          options: [
            { id: 'a', text: '12x² − 4x + 1' },
            { id: 'b', text: '12x² − 4x' },
            { id: 'c', text: '4x² − 2x + 1' },
            { id: 'd', text: '12x³ − 4x² + 1' }
          ],
          correctAnswer: 'a',
          explanation: 'd/dx(4x³) = 12x², d/dx(−2x²) = −4x, d/dx(x) = 1. So dy/dx = 12x² − 4x + 1.'
        },
        {
          id: 'de-q2',
          type: 'mcq' as const,
          prompt: 'At a stationary point where d²y/dx² = 8 > 0, the point is a:',
          options: [
            { id: 'a', text: 'Maximum' },
            { id: 'b', text: 'Minimum' },
            { id: 'c', text: 'Inflection' },
            { id: 'd', text: 'Undefined' }
          ],
          correctAnswer: 'b',
          explanation: 'A positive second derivative at a stationary point indicates a minimum.'
        },
        {
          id: 'de-q3',
          type: 'one-word' as const,
          prompt: 'What is d/dx(x⁵)?',
          correctAnswer: '5x⁴',
          hint: 'Apply the power rule: nxⁿ⁻¹'
        },
        {
          id: 'de-q4',
          type: 'matching' as const,
          prompt: 'Match the function to its derivative:',
          pairs: [
            { left: 'y = x³', right: '3x²' },
            { left: 'y = 6x²', right: '12x' },
            { left: 'y = 7', right: '0' }
          ]
        }
      ]
    },
    {
      id: 'integral-accumulator',
      title: 'The Integral Accumulator',
      lesson: {
        sections: [
          {
            title: 'Integration as Anti-Differentiation',
            content: 'Integration reverses differentiation. If dy/dx = 6x², then y = ∫6x² dx = 2x³ + C. The constant of integration C is essential because differentiating any constant gives 0 — so the original function could have had any constant term. This is called an indefinite integral. A definite integral (with limits a and b) gives a number: ∫ₐᵇ f(x) dx = F(b) − F(a), where F is the anti-derivative. The constant C cancels out in definite integrals.',
            interactive: {
              type: 'reveal' as const,
              label: 'Find ∫4x³ dx',
              hiddenContent: 'Apply anti-power rule: ∫4x³ dx = 4(x⁴/4) + C = x⁴ + C.'
            }
          },
          {
            title: 'Area Under a Curve',
            content: 'The definite integral ∫ₐᵇ f(x) dx equals the area between the curve and the x-axis from x = a to x = b. If f(x) > 0 on [a, b], the area is simply the integral. If f(x) < 0, the integral gives a negative value — for total area, take the absolute value. If the curve crosses the x-axis, split the integral at the crossing point and take the absolute value of each part. Net area (with signs) vs total area (all positive) is a key distinction.',
            interactive: {
              type: 'expand' as const,
              label: 'Why does area below the x-axis give a negative integral?',
              hiddenContent: 'The integral sums f(x)·Δx. Below the x-axis, f(x) is negative while Δx is positive, so each strip contributes a negative amount. For total area, we need |f(x)|·Δx. Example: ∫₀² (x−1) dx = [x²/2 − x]₀² = (2−2) − (0) = 0 (net area), but the total area is 1 (a triangle above + a triangle below).'
            }
          },
          {
            title: 'WAEC: Definite Integral Calculations',
          content: 'Typical WAEC: "Find the area bounded by y = x² + 1, the x-axis, x = 1 and x = 3." Step 1: Set up the integral: ∫₁³ (x² + 1) dx. Step 2: Find the anti-derivative: x³/3 + x. Step 3: Evaluate: F(3) − F(1) = (27/3 + 3) − (1/3 + 1) = (9 + 3) − (1/3 + 1) = 12 − 4/3 = 32/3 ≈ 10.67 square units. Always include units (square units) in your WAEC answer.',
            interactive: {
              type: 'reveal' as const,
              label: 'WAEC practice: Find ∫₀² (3x² − 2x) dx',
              hiddenContent: 'Anti-derivative: x³ − x². Evaluate: F(2) − F(0) = (8 − 4) − (0 − 0) = 4.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'ia-f1', question: 'What is the anti-derivative of 6x²?', answer: '2x³ + C' },
        { id: 'ia-f2', question: 'Why is the constant C needed in indefinite integration?', answer: 'Because differentiating any constant gives 0, so the original constant is unknown' },
        { id: 'ia-f3', question: 'What does ∫ₐᵇ f(x) dx represent geometrically?', answer: 'The area between the curve and the x-axis from a to b' },
        { id: 'ia-f4', question: 'How do you handle area below the x-axis?', answer: 'Take the absolute value of the integral for that region' },
        { id: 'ia-f5', question: 'Power rule for integration: ∫xⁿ dx?', answer: 'xⁿ⁺¹/(n+1) + C, for n ≠ −1' }
      ],
      checkpointAssessment: [
        {
          id: 'ia-q1',
          type: 'mcq' as const,
          prompt: '∫(3x² + 2x) dx equals:',
          options: [
            { id: 'a', text: 'x³ + x² + C' },
            { id: 'b', text: '6x + 2 + C' },
            { id: 'c', text: '3x³ + 2x² + C' },
            { id: 'd', text: 'x³ + x + C' }
          ],
          correctAnswer: 'a',
          explanation: '∫3x² dx = x³, ∫2x dx = x². Combined: x³ + x² + C.'
        },
        {
          id: 'ia-q2',
          type: 'mcq' as const,
          prompt: 'The area bounded by y = x², the x-axis, x = 0 and x = 2 is:',
          options: [
            { id: 'a', text: '4/3' },
            { id: 'b', text: '8/3' },
            { id: 'c', text: '2' },
            { id: 'd', text: '4' }
          ],
          correctAnswer: 'b',
          explanation: '∫₀² x² dx = [x³/3]₀² = 8/3 − 0 = 8/3 square units.'
        },
        {
          id: 'ia-q3',
          type: 'one-word' as const,
          prompt: 'Evaluate ∫₁³ (2x) dx',
          correctAnswer: '8',
          hint: 'Anti-derivative is x². Compute F(3) − F(1).'
        },
        {
          id: 'ia-q4',
          type: 'matching' as const,
          prompt: 'Match the function to its indefinite integral:',
          pairs: [
            { left: '6x²', right: '2x³ + C' },
            { left: '4x³', right: 'x⁴ + C' },
            { left: '1', right: 'x + C' }
          ]
        }
      ]
    },
    {
      id: 'optimization-sandbox',
      title: 'Optimization Sandbox',
      lesson: {
        sections: [
          {
            title: 'What is Optimization?',
            content: 'Optimization finds the maximum or minimum value of a quantity. The strategy: (1) Write an expression for the quantity to maximise/minimise. (2) Express it in terms of a single variable (use a constraint to eliminate other variables). (3) Differentiate and set the derivative equal to zero. (4) Solve for the variable. (5) Verify it is a max/min using the second derivative. If d²y/dx² < 0 → maximum, d²y/dx² > 0 → minimum.',
            interactive: {
              type: 'reveal' as const,
              label: 'Why set the derivative to zero for optimization?',
              hiddenContent: 'At a maximum or minimum, the tangent is horizontal — the gradient is zero. So dy/dx = 0 identifies all stationary points. The second derivative test then confirms whether each is a max or min.'
            }
          },
          {
            title: 'Classic Problem: Maximum Area',
            content: 'A farmer has 100 m of fencing. What dimensions give the largest rectangular enclosure? Let width = x, then length = (100 − 2x)/2 = 50 − x. Area A = x(50 − x) = 50x − x². Differentiate: dA/dx = 50 − 2x = 0 → x = 25. Then length = 25. d²A/dx² = −2 < 0, confirming maximum. Maximum area = 25 × 25 = 625 m². The optimal shape is always a square for a fixed perimeter — a useful check.',
            interactive: {
              type: 'reveal' as const,
              label: 'What if the farmer uses a wall as one side (only 3 sides need fencing)?',
              hiddenContent: 'With 100 m for 3 sides: A = x(100 − 2x). dA/dx = 100 − 4x = 0 → x = 25. Length = 50. Max area = 25 × 50 = 1250 m² — double the four-sided case.'
            }
          },
          {
            title: 'WAEC Optimization',
            content: 'Typical WAEC: "A rectangular box with no lid is made from 300 cm² of card. Find the dimensions for maximum volume." Let base = x by x, height = h. Surface area: x² + 4xh = 300 → h = (300 − x²)/(4x). Volume V = x²h = x²(300 − x²)/(4x) = (300x − x³)/4. dV/dx = (300 − 3x²)/4 = 0 → x² = 100 → x = 10. Then h = (300 − 100)/40 = 5. d²V/dx² = −6x/4 = −15 < 0 → maximum. Maximum volume = 10 × 10 × 5 = 500 cm³.',
            interactive: {
              type: 'expand' as const,
              label: 'WAEC practice: A farmer in Kumasi has 120 m of fencing for a rectangular pen along a river (no fence on the river side). Find the maximum area.',
              hiddenContent: 'Only 3 sides fenced: width = x, length = 120 − 2x. A = x(120 − 2x) = 120x − 2x². dA/dx = 120 − 4x = 0 → x = 30. Length = 60. Max area = 30 × 60 = 1800 m². d²A/dx² = −4 < 0, confirming maximum.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'os-f1', question: 'First step in an optimization problem?', answer: 'Write an expression for the quantity to maximise or minimise' },
        { id: 'os-f2', question: 'Why do you set the derivative to zero?', answer: 'To find stationary points where the gradient is zero (potential max/min)' },
        { id: 'os-f3', question: 'Second derivative test for a maximum?', answer: 'd²y/dx² < 0 at the stationary point' },
        { id: 'os-f4', question: 'For a fixed perimeter, which rectangle has maximum area?', answer: 'A square' },
        { id: 'os-f5', question: 'How do you reduce a two-variable problem to one variable?', answer: 'Use the constraint equation to eliminate one variable' }
      ],
      checkpointAssessment: [
        {
          id: 'os-q1',
          type: 'mcq' as const,
          prompt: 'A rectangle has perimeter 80 m. What width maximises the area?',
          options: [
            { id: 'a', text: '10 m' },
            { id: 'b', text: '20 m' },
            { id: 'c', text: '30 m' },
            { id: 'd', text: '40 m' }
          ],
          correctAnswer: 'b',
          explanation: 'A = x(40−x). dA/dx = 40−2x = 0 → x = 20. The square (20×20) maximises area.'
        },
        {
          id: 'os-q2',
          type: 'mcq' as const,
          prompt: 'At a stationary point, if d²y/dx² = 5, the point is a:',
          options: [
            { id: 'a', text: 'Maximum' },
            { id: 'b', text: 'Minimum' },
            { id: 'c', text: 'Inflection' },
            { id: 'd', text: 'Undefined' }
          ],
          correctAnswer: 'b',
          explanation: 'A positive second derivative at a stationary point means the curve curves upward → minimum.'
        },
        {
          id: 'os-q3',
          type: 'one-word' as const,
          prompt: 'A square enclosure with 100 m of fencing has what maximum area (in m²)?',
          correctAnswer: '625',
          hint: 'Side = 25 m. Area = 25 × 25.'
        },
        {
          id: 'os-q4',
          type: 'matching' as const,
          prompt: 'Match the step to its purpose in optimization:',
          pairs: [
            { left: 'Set dy/dx = 0', right: 'Find stationary points' },
            { left: 'Use constraint', right: 'Reduce to one variable' },
            { left: 'Check d²y/dx²', right: 'Classify as max or min' }
          ]
        }
      ]
    }
  ],
  finalAssessment: [
    {
      id: 'calc-final-1',
      type: 'mcq' as const,
      prompt: 'lim(x→2) (x²−4)/(x−2) equals:',
      options: [
        { id: 'a', text: '0' },
        { id: 'b', text: '2' },
        { id: 'c', text: '4' },
        { id: 'd', text: 'Undefined' }
      ],
      correctAnswer: 'c',
      explanation: 'Factor: (x−2)(x+2)/(x−2) = x+2 → limit as x→2 is 4.'
    },
    {
      id: 'calc-final-2',
      type: 'one-word' as const,
      prompt: 'What is the derivative of y = x³?',
      correctAnswer: '3x²'
    },
    {
      id: 'calc-final-3',
      type: 'matching' as const,
      prompt: 'Match the calculus concept to its description:',
      pairs: [
        { left: 'Derivative', right: 'Rate of change / gradient' },
        { left: 'Definite integral', right: 'Area under a curve' },
        { left: 'd²y/dx² < 0', right: 'Stationary point is a maximum' }
      ]
    }
  ]
};
