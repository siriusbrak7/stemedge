import type { Topic } from '../types';

export const QUADRATICS_TOPIC: Topic = {
  id: 'quadratics',
  title: 'Quadratic Functions and Equations',
  subtopics: [
    {
      id: 'quadratic-explorer',
      title: 'Quadratic Functions and Equations',
      lesson: {
        sections: [
          {
            title: 'The Standard Form',
            content: 'A quadratic function has the form f(x) = ax² + bx + c, where a ≠ 0. Its graph is a U-shaped or ∩-shaped curve called a parabola. If a > 0, the parabola opens upward (minimum point). If a < 0, it opens downward (maximum point). The constant c is always the y-intercept — the value of f when x = 0.',
            interactive: {
              type: 'reveal' as const,
              label: 'What is the y-intercept of f(x) = 3x² − 2x + 7?',
              hiddenContent: 'The y-intercept is c = 7. Substitute x = 0: f(0) = 3(0)² − 2(0) + 7 = 7. The graph crosses the y-axis at (0, 7).'
            }
          },
          {
            title: 'Vertex and Axis of Symmetry',
            content: 'The vertex is the turning point of the parabola — either the minimum (a > 0) or maximum (a < 0). Its x-coordinate is x = −b/(2a). The axis of symmetry is the vertical line x = −b/(2a). Vertex form: f(x) = a(x−h)² + k where (h, k) is the vertex. This form makes the vertex immediately obvious.',
            interactive: {
              type: 'expand' as const,
              label: 'Find the vertex of f(x) = 2x² − 8x + 3',
              hiddenContent: 'x = −(−8)/(2×2) = 8/4 = 2. Then y = 2(4) − 8(2) + 3 = 8 − 16 + 3 = −5. Vertex: (2, −5). Since a = 2 > 0, this is a minimum point.'
            }
          },
          {
            title: 'Finding the Roots',
            content: 'Roots (zeros) are where f(x) = 0 — the x-intercepts. Three methods: (1) Factorisation: find brackets (x−r₁)(x−r₂). (2) Completing the square: rearrange into a(x−h)² = k and take square roots. (3) Quadratic formula: x = (−b ± √(b²−4ac)) / 2a. The discriminant b²−4ac determines: >0 two real roots, =0 one repeated root, <0 no real roots.',
          },
          {
            title: 'Real-World Applications',
            content: 'Quadratic functions model projectile motion (height = −4.9t² + v₀t + h₀), revenue maximisation (revenue = −ax² + bx), and the shape of bridge arches, satellite dishes, and parabolic reflectors. The vertex gives the maximum/minimum value, and roots give where the quantity equals zero (e.g., when a ball hits the ground).',
            interactive: {
              type: 'reveal' as const,
              label: 'Ghana Bridge Arch example',
              hiddenContent: 'A bridge arch follows f(x) = −(1/25)x² + 4. At x = 0 (centre): f(0) = 4 m height. The arch meets the ground when f(x) = 0: x² = 100, so x = ±10 m. The bridge spans 20 m with a maximum height of 4 m.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'qe-f1', question: 'Standard form of a quadratic function?', answer: 'f(x) = ax² + bx + c' },
        { id: 'qe-f2', question: 'Formula for x-coordinate of vertex?', answer: 'x = −b / (2a)' },
        { id: 'qe-f3', question: 'Quadratic formula for roots?', answer: 'x = (−b ± √(b²−4ac)) / 2a' },
        { id: 'qe-f4', question: 'What does discriminant b²−4ac > 0 mean?', answer: 'Two distinct real roots' },
        { id: 'qe-f5', question: 'If a > 0, the parabola opens in which direction?', answer: 'Upward (U-shape, minimum point)' },
        { id: 'qe-f6', question: 'What is the y-intercept of f(x) = 3x² − 2x + 7?', answer: '7 (value of c)' },
        { id: 'qe-f7', question: 'Vertex form of a quadratic?', answer: 'f(x) = a(x−h)² + k, vertex at (h, k)' },
        { id: 'qe-f8', question: 'What are the roots of x² − 5x + 6 = 0?', answer: 'x = 2 and x = 3' }
      ],
      checkpointAssessment: [
        {
          id: 'qe-q1',
          type: 'mcq' as const,
          prompt: 'The vertex of f(x) = 2x² − 8x + 3 has x-coordinate:',
          options: [
            { id: 'a', text: '4' },
            { id: 'b', text: '2' },
            { id: 'c', text: '−4' },
            { id: 'd', text: '−2' }
          ],
          correctAnswer: 'b',
          explanation: 'x = −b/(2a) = −(−8)/(2×2) = 8/4 = 2'
        },
        {
          id: 'qe-q2',
          type: 'one-word' as const,
          prompt: 'The x-values where a quadratic function equals zero are called the?',
          correctAnswer: 'Roots',
          hint: 'Also called zeros or x-intercepts'
        },
        {
          id: 'qe-q3',
          type: 'mcq' as const,
          prompt: 'Discriminant = 0 means the quadratic has:',
          options: [
            { id: 'a', text: 'No real roots' },
            { id: 'b', text: 'Two distinct real roots' },
            { id: 'c', text: 'One repeated real root' },
            { id: 'd', text: 'Imaginary roots' }
          ],
          correctAnswer: 'c',
          explanation: 'When b²−4ac = 0, the parabola just touches the x-axis at one point — a repeated (double) root.'
        },
        {
          id: 'qe-q4',
          type: 'matching' as const,
          prompt: 'Match property to description:',
          pairs: [
      { left: 'a > 0', right: 'Opens upward' },
      { left: 'Vertex', right: 'Maximum or minimum point' },
      { left: 'c value', right: 'y-intercept' }
    ]
  },
  {
    id: 'qe-q5',
    type: 'one-word' as const,
    prompt: 'Factorise x² + 5x + 6 = (x+2)(x+?)',
    correctAnswer: '3',
    hint: '2 × 3 = 6 and 2 + 3 = 5'
  }
]
},
  {
    id: 'completing-square',
    title: 'Completing the Square',
    lesson: {
      sections: [
        {
          title: 'The Method',
          content: 'Completing the square rewrites x² + bx into a perfect-square form: x² + bx = (x + b/2)² − (b/2)². The steps: (1) Halve the coefficient of x. (2) Square that half. (3) Add and subtract the square inside the expression. Example: x² + 6x + 2. Halve 6 → 3. Square 3 → 9. Rewrite: x² + 6x = (x+3)² − 9, so x² + 6x + 2 = (x+3)² − 9 + 2 = (x+3)² − 7.',
          interactive: {
            type: 'reveal' as const,
            label: 'Complete the square for x² + 10x + 1',
            hiddenContent: 'Half of 10 is 5. Square 5 → 25. So x² + 10x + 1 = (x+5)² − 25 + 1 = (x+5)² − 24.'
          }
        },
        {
          title: 'Why Complete the Square?',
          content: 'Completing the square gives the vertex of a parabola directly. If f(x) = x² + bx + c = (x + b/2)² + (c − (b/2)²), then the vertex is at (−b/2, c − (b/2)²). This is often faster than using x = −b/(2a) and substituting. Completing the square is also the key step used to derive the quadratic formula from ax² + bx + c = 0.',
          interactive: {
            type: 'reveal' as const,
            label: 'How does completing the square give us the quadratic formula?',
            hiddenContent: 'Start: ax² + bx + c = 0. Divide by a: x² + (b/a)x + c/a = 0. Complete the square: (x + b/2a)² − (b/2a)² + c/a = 0. Isolate the square: (x + b/2a)² = b²/4a² − c/a = (b²−4ac)/4a². Take square root: x + b/2a = ±√(b²−4ac)/2a. Solve: x = (−b ± √(b²−4ac)) / 2a.'
          }
        },
        {
          title: 'WAEC Exam Technique',
          content: 'WAEC frequently asks: "Express x² + 8x − 3 in the form (x+a)² + b, then find the minimum value." Step 1: Halve 8 → 4. Square 4 → 16. x² + 8x − 3 = (x+4)² − 16 − 3 = (x+4)² − 19. So a = 4, b = −19. The minimum value of (x+a)² + b is b (achieved when the squared term equals 0, i.e., x = −a). Here the minimum is −19 at x = −4. AWA: always express in completed-square form first, then read off the vertex and minimum/maximum directly.',
          interactive: {
            type: 'expand' as const,
            label: 'WAEC 2023 style: Express x² − 12x + 5 in the form (x+p)² + q',
            hiddenContent: 'Half of −12 is −6. Square: 36. x² − 12x + 5 = (x−6)² − 36 + 5 = (x−6)² − 31. So p = −6, q = −31. Minimum value is −31 at x = 6.'
          }
        }
      ]
    },
    flashcards: [
      { id: 'cs-f1', question: 'What is the first step in completing the square for x² + bx?', answer: 'Halve the coefficient of x (take b/2)' },
      { id: 'cs-f2', question: 'Complete the square: x² + 6x = ?', answer: '(x + 3)² − 9' },
      { id: 'cs-f3', question: 'What is the vertex of y = (x + 4)² − 19?', answer: '(−4, −19)' },
      { id: 'cs-f4', question: 'How do you find the minimum value of (x+a)² + b?', answer: 'Set the squared term to 0; the minimum is b' },
      { id: 'cs-f5', question: 'Why do we complete the square instead of always using the quadratic formula?', answer: 'It reveals the vertex directly and is used to derive the formula' }
    ],
    checkpointAssessment: [
      {
        id: 'cs-q1',
        type: 'mcq' as const,
        prompt: 'Express x² + 10x in completed-square form:',
        options: [
          { id: 'a', text: '(x+5)² − 25' },
          { id: 'b', text: '(x+10)² − 100' },
          { id: 'c', text: '(x+5)² + 25' },
          { id: 'd', text: '(x+5)² − 5' }
        ],
        correctAnswer: 'a',
        explanation: 'Half of 10 is 5. (x+5)² = x² + 10x + 25, so x² + 10x = (x+5)² − 25.'
      },
      {
        id: 'cs-q2',
        type: 'mcq' as const,
        prompt: 'The minimum value of y = (x + 3)² − 11 is:',
        options: [
          { id: 'a', text: '3' },
          { id: 'b', text: '−3' },
          { id: 'c', text: '−11' },
          { id: 'd', text: '11' }
        ],
        correctAnswer: 'c',
        explanation: 'The minimum occurs when (x+3)² = 0, giving y = 0 − 11 = −11.'
      },
      {
        id: 'cs-q3',
        type: 'one-word' as const,
        prompt: 'x² + 8x + 2 = (x+4)² + ?',
        correctAnswer: '−14',
        hint: '(x+4)² = x² + 8x + 16, so you need to subtract 14'
      },
      {
        id: 'cs-q4',
        type: 'matching' as const,
        prompt: 'Match the expression to its completed-square form:',
        pairs: [
          { left: 'x² + 6x + 2', right: '(x+3)² − 7' },
          { left: 'x² − 4x + 1', right: '(x−2)² − 3' },
          { left: 'x² + 8x − 3', right: '(x+4)² − 19' }
        ]
      }
    ]
  },
  {
    id: 'projectile-math',
    title: 'Projectile Motion Math',
    lesson: {
      sections: [
        {
          title: 'Quadratics in Motion',
          content: 'The height of a projectile launched upward is given by h = −½gt² + ut + h₀, where g is acceleration due to gravity (≈9.8 m/s² or 10 m/s² in WAEC), u is the initial upward velocity, and h₀ is the initial height. This is a quadratic in t — it graphs as a downward-opening parabola. The maximum height occurs at the vertex: t = −b/(2a) = u/g. Example: a ball thrown upward from 2 m at 15 m/s. With g = 10: h = −5t² + 15t + 2. Vertex at t = 15/10 = 1.5 s, max height = −5(1.5)² + 15(1.5) + 2 = −11.25 + 22.5 + 2 = 13.25 m.',
          interactive: {
            type: 'reveal' as const,
            label: 'What if the ball is thrown at 20 m/s from ground level?',
            hiddenContent: 'h = −5t² + 20t + 0. Vertex at t = 20/10 = 2 s. Max height = −5(4) + 20(2) = −20 + 40 = 20 m.'
          }
        },
        {
          title: 'Solving for Time',
          content: 'When does the projectile hit the ground? Set h = 0 and solve the resulting quadratic equation. You get two solutions: one is the launch time (often negative and discarded), the other is the landing time. For h = −5t² + 15t + 2 = 0, use the quadratic formula with a = −5, b = 15, c = 2. The positive root gives the time of impact. Only physically meaningful (positive) times are kept.',
          interactive: {
            type: 'expand' as const,
            label: 'Worked example: when does h = −5t² + 15t + 2 hit the ground?',
            hiddenContent: '−5t² + 15t + 2 = 0 → 5t² − 15t − 2 = 0. t = (15 ± √(225 + 40)) / 10 = (15 ± √265) / 10 = (15 ± 16.28) / 10. t₁ = (15 − 16.28)/10 ≈ −0.13 s (discard, before launch). t₂ = (15 + 16.28)/10 ≈ 3.13 s. The ball lands at about 3.13 s.'
          }
        },
        {
          title: 'WAEC Context: Thrown Objects',
          content: 'A student at Achimota School throws a ball upward from a balcony 10 m high at 8 m/s. Using g = 10 m/s²: h = −5t² + 8t + 10. To find when it hits the ground: set h = 0 → −5t² + 8t + 10 = 0 → 5t² − 8t − 10 = 0. t = (8 ± √(64 + 200)) / 10 = (8 ± √264) / 10 = (8 ± 16.25) / 10. Positive root: t ≈ 2.43 s. WAEC tip: always state which root you discard and why. Physical reasoning: the negative root represents a time before the throw.',
          interactive: {
            type: 'reveal' as const,
            label: 'What is the maximum height reached by the Achimota School ball?',
            hiddenContent: 'Vertex at t = −b/(2a) = −8/(2×(−5)) = 8/10 = 0.8 s. h = −5(0.8)² + 8(0.8) + 10 = −3.2 + 6.4 + 10 = 13.2 m. Maximum height is 13.2 m.'
          }
        }
      ]
    },
    flashcards: [
      { id: 'pm-f1', question: 'Formula for projectile height?', answer: 'h = −½gt² + ut + h₀' },
      { id: 'pm-f2', question: 'At what time does a projectile reach maximum height?', answer: 't = u/g (the vertex of the parabola)' },
      { id: 'pm-f3', question: 'To find when a projectile lands, what do you set h equal to?', answer: '0 (ground level)' },
      { id: 'pm-f4', question: 'Why do we discard the negative root when solving for landing time?', answer: 'It represents a time before the launch — not physically meaningful' },
      { id: 'pm-f5', question: 'In WAEC, what value of g is commonly used?', answer: '10 m/s²' }
    ],
    checkpointAssessment: [
      {
        id: 'pm-q1',
        type: 'mcq' as const,
        prompt: 'A ball is thrown upward from ground level at 10 m/s (g = 10 m/s²). When does it reach maximum height?',
        options: [
          { id: 'a', text: '0.5 s' },
          { id: 'b', text: '1.0 s' },
          { id: 'c', text: '2.0 s' },
          { id: 'd', text: '10.0 s' }
        ],
        correctAnswer: 'b',
        explanation: 't = u/g = 10/10 = 1.0 s'
      },
      {
        id: 'pm-q2',
        type: 'mcq' as const,
        prompt: 'In h = −5t² + 12t + 3, the initial height h₀ is:',
        options: [
          { id: 'a', text: '−5' },
          { id: 'b', text: '12' },
          { id: 'c', text: '3' },
          { id: 'd', text: '5' }
        ],
        correctAnswer: 'c',
        explanation: 'h₀ is the constant term: h(0) = −5(0) + 12(0) + 3 = 3 m.'
      },
      {
        id: 'pm-q3',
        type: 'one-word' as const,
        prompt: 'A ball is thrown from 10 m at 8 m/s upward (g = 10). How many seconds until it hits the ground? (Round to 1 decimal place)',
        correctAnswer: '2.4',
        hint: 'Solve −5t² + 8t + 10 = 0 and take the positive root'
      },
      {
        id: 'pm-q4',
        type: 'matching' as const,
        prompt: 'Match each part of h = −½gt² + ut + h₀ to its meaning:',
        pairs: [
          { left: '−½gt²', right: 'Gravity pulling down' },
          { left: 'u', right: 'Initial upward velocity' },
          { left: 'h₀', right: 'Initial height at launch' }
        ]
      }
    ]
  },
  {
    id: 'quadratic-formula',
    title: 'The Quadratic Formula',
    lesson: {
      sections: [
        {
          title: 'Deriving the Formula',
          content: 'Starting from ax² + bx + c = 0 (a ≠ 0), divide through by a: x² + (b/a)x + c/a = 0. Complete the square: (x + b/2a)² = (b/2a)² − c/a = (b²−4ac)/4a². Take the square root of both sides: x + b/2a = ±√(b²−4ac) / 2a. Rearrange: x = (−b ± √(b² − 4ac)) / 2a. This formula solves ANY quadratic equation — no factorisation needed. Just plug in a, b, c and compute.',
          interactive: {
            type: 'reveal' as const,
            label: 'Solve 2x² + 5x − 3 = 0 using the formula',
            hiddenContent: 'a = 2, b = 5, c = −3. x = (−5 ± √(25 + 24)) / 4 = (−5 ± √49) / 4 = (−5 ± 7) / 4. x₁ = 2/4 = 0.5, x₂ = −12/4 = −3.'
          }
        },
        {
          title: 'The Discriminant',
          content: 'The discriminant Δ = b² − 4ac determines the nature of the roots without solving the equation. If Δ > 0: two distinct real roots (the parabola crosses the x-axis twice). If Δ = 0: one repeated real root (the parabola touches the x-axis at its vertex). If Δ < 0: no real roots (the parabola never crosses the x-axis). For example, x² + 2x + 5 = 0 has Δ = 4 − 20 = −16 < 0, so there are no real solutions.',
          interactive: {
            type: 'reveal' as const,
            label: 'What does the discriminant tell us about x² − 6x + 9 = 0?',
            hiddenContent: 'Δ = (−6)² − 4(1)(9) = 36 − 36 = 0. One repeated real root: x = 6/2 = 3. The parabola just touches the x-axis at x = 3.'
          }
        },
        {
          title: 'WAEC Problem Solving',
          content: 'Typical WAEC question: "Solve 3x² − 5x − 2 = 0, giving your answer to 2 decimal places." Using the formula: a = 3, b = −5, c = −2. x = (5 ± √(25 + 24)) / 6 = (5 ± √49) / 6 = (5 ± 7) / 6. x₁ = 2.00, x₂ = −0.33. Another common WAEC type: "Find the value of k for which x² + kx + 9 = 0 has equal roots." Set discriminant = 0: k² − 4(1)(9) = 0 → k² = 36 → k = ±6. Always check WAEC instructions about decimal places or exact form.',
          interactive: {
            type: 'expand' as const,
            label: 'WAEC practice: For what value of p does 2x² + px + 8 = 0 have equal roots?',
            hiddenContent: 'Equal roots → Δ = 0. p² − 4(2)(8) = 0 → p² − 64 = 0 → p² = 64 → p = ±8.'
          }
        }
      ]
    },
    flashcards: [
      { id: 'qf-f1', question: 'State the quadratic formula.', answer: 'x = (−b ± √(b² − 4ac)) / 2a' },
      { id: 'qf-f2', question: 'What is the discriminant?', answer: 'Δ = b² − 4ac' },
      { id: 'qf-f3', question: 'If Δ > 0, how many real roots?', answer: 'Two distinct real roots' },
      { id: 'qf-f4', question: 'If Δ = 0, how many real roots?', answer: 'One repeated real root' },
      { id: 'qf-f5', question: 'How do you find k for equal roots in ax² + kx + c = 0?', answer: 'Set k² − 4ac = 0 and solve for k' }
    ],
    checkpointAssessment: [
      {
        id: 'qf-q1',
        type: 'mcq' as const,
        prompt: 'Solve x² − 3x − 4 = 0 using the quadratic formula. The roots are:',
        options: [
          { id: 'a', text: '4 and −1' },
          { id: 'b', text: '−4 and 1' },
          { id: 'c', text: '3 and −4' },
          { id: 'd', text: '2 and −2' }
        ],
        correctAnswer: 'a',
        explanation: 'x = (3 ± √(9 + 16)) / 2 = (3 ± 5) / 2. x₁ = 4, x₂ = −1.'
      },
      {
        id: 'qf-q2',
        type: 'mcq' as const,
        prompt: 'For what value of k does x² + kx + 9 = 0 have equal roots?',
        options: [
          { id: 'a', text: 'k = 3' },
          { id: 'b', text: 'k = 6' },
          { id: 'c', text: 'k = ±6' },
          { id: 'd', text: 'k = 9' }
        ],
        correctAnswer: 'c',
        explanation: 'k² − 4(1)(9) = 0 → k² = 36 → k = ±6.'
      },
      {
        id: 'qf-q3',
        type: 'one-word' as const,
        prompt: 'If Δ < 0, how many real roots does the quadratic have?',
        correctAnswer: 'Zero',
        hint: 'The parabola does not cross the x-axis'
      },
      {
        id: 'qf-q4',
        type: 'matching' as const,
        prompt: 'Match the discriminant value to the nature of roots:',
        pairs: [
          { left: 'Δ > 0', right: 'Two distinct real roots' },
          { left: 'Δ = 0', right: 'One repeated real root' },
          { left: 'Δ < 0', right: 'No real roots' }
        ]
      }
    ]
  }
  ],
  finalAssessment: [
    {
      id: 'quad-final-1',
      type: 'mcq' as const,
      prompt: 'Solve for x: 2(x+3) = 12',
      options: [
        { id: 'a', text: 'x = 3' },
        { id: 'b', text: 'x = 6' },
        { id: 'c', text: 'x = 9' },
        { id: 'd', text: 'x = 0' }
      ],
      correctAnswer: 'a',
      explanation: '2(x+3) = 12 → x+3 = 6 → x = 3'
    },
    {
      id: 'quad-final-2',
      type: 'one-word' as const,
      prompt: 'The turning point (minimum or maximum) of a parabola is called the?',
      correctAnswer: 'Vertex'
    },
    {
      id: 'quad-final-3',
      type: 'matching' as const,
      prompt: 'Match form to key feature:',
      pairs: [
        { left: 'f(x) = ax²+bx+c', right: 'Standard form' },
        { left: 'f(x) = a(x−h)²+k', right: 'Vertex (h,k) visible' },
        { left: 'f(x) = a(x−r₁)(x−r₂)', right: 'Roots r₁ and r₂ visible' }
      ]
    }
  ]
};
