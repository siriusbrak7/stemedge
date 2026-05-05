import type { Topic } from '../types';

export const FORCES_MOTION_TOPIC: Topic =
      {
        id: 'forces-motion',
        title: 'Forces and Motion',
        subtopics: [
          {
            id: 'types-forces',
            title: 'Types of Forces',
            lesson: {
              sections: [
                {
                  title: 'What is a Force?',
                  content: 'A force is a push or pull that acts upon an object as a result of its interaction with another object. Forces can change an object’s shape, speed, or direction.',
                },
                {
                  title: 'Contact vs Non-Contact',
                  content: 'Contact forces require physical touch (e.g., Friction, Air Resistance, Tension). Non-contact forces act over a distance (e.g., Gravity, Magnetic, Electrostatic).',
                  interactive: {
                    type: 'reveal',
                    label: 'Example of non-contact force?',
                    hiddenContent: 'Gravity: pulling an apple toward the Earth without needing to touch it first.'
                  }
                },
                {
                  title: 'Resultant Forces',
                  content: 'The "Resultant Force" is the single force that has the same effect as all the individual forces acting on an object combined. If the resultant force is zero, forces are balanced.',
                }
              ]
            },
            flashcards: [
              { id: 'p1f1', question: 'What is the unit of force?', answer: 'Newton (N)' },
              { id: 'p1f2', question: 'Is friction a contact or non-contact force?', answer: 'Contact Force' },
              { id: 'p1f3', question: 'Name a non-contact force.', answer: 'Gravity / Magnetic / Electrostatic' },
              { id: 'p1f4', question: 'What do you call balanced forces that sum to zero?', answer: 'Zero Resultant Force' },
              { id: 'p1f5', question: 'Force that opposes motion between surfaces?', answer: 'Friction' }
            ],
            checkpointAssessment: [
              {
                id: 'p1q1',
                type: 'mcq',
                prompt: 'Which force pulls objects toward the center of the Earth?',
                options: [
                  { id: 'a', text: 'Tension' },
                  { id: 'b', text: 'Gravity' },
                  { id: 'c', text: 'Friction' },
                  { id: 'd', text: 'Magnetic' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'p1q2',
                type: 'one-word',
                prompt: 'What unit do we used to measure force?',
                correctAnswer: 'Newton',
                explanation: 'Named after Sir Isaac Newton, the unit is N.'
              },
              {
                id: 'p1q3',
                type: 'matching',
                prompt: 'Classify the forces:',
                pairs: [
                  { left: 'Friction', right: 'Contact' },
                  { left: 'Weight', right: 'Non-contact' },
                  { left: 'Air Resistance', right: 'Contact' }
                ]
              },
              {
                id: 'p1q4',
                type: 'mcq',
                prompt: 'What happens if the resultant force on a stationary object is zero?',
                options: [
                  { id: 'a', text: 'It starts moving' },
                  { id: 'b', text: 'It stays stationary' },
                  { id: 'c', text: 'It accelerates' },
                  { id: 'd', text: 'It changes shape' }
                ],
                correctAnswer: 'b',
                explanation: 'Balanced forces do not change the state of motion.'
              },
              {
                id: 'p1q5',
                type: 'one-word',
                prompt: 'A force that pulls on a string or rope is called?',
                correctAnswer: 'Tension',
                hint: 'Ten...'
              }
            ]
          },
          {
            id: 'newton-laws',
            title: 'Newton’s Laws of Motion',
            lesson: {
              sections: [
                {
                  title: 'Law 1: Inertia',
                  content: 'An object at rest stays at rest, and an object in motion stays in motion unless acted on by an external force.',
                },
                {
                  title: 'Law 2: F = ma',
                  content: 'Force equals Mass times Acceleration. The more mass an object has, the more force you need to accelerate it.',
                  interactive: {
                    type: 'expand',
                    label: 'Example Calculation',
                    hiddenContent: 'To accelerate a 2kg mass by 5m/s², you need a force of 2 x 5 = 10 Newtons.'
                  }
                },
                {
                  title: 'Law 3: Action & Reaction',
                  content: 'For every action, there is an equal and opposite reaction. If you push a wall, the wall pushes back on you with equal force.',
                }
              ]
            },
            flashcards: [
              { id: 'p2f1', question: 'Newton’s First Law is also called...', answer: 'The Law of Inertia' },
              { id: 'p2f2', question: 'What is the formula for the Second Law?', answer: 'F = m x a' },
              { id: 'p2f3', question: 'Third Law says forces come in...', answer: 'Pairs (Equal and Opposite)' },
              { id: 'p2f4', question: 'If mass increases, what happens to acceleration for the same force?', answer: 'It decreases' },
              { id: 'p2f5', question: 'Do balanced forces cause acceleration?', answer: 'No' }
            ],
            checkpointAssessment: [
              {
                id: 'p2q1',
                type: 'mcq',
                prompt: 'Which law explains why you slide forward in a car when it brakes suddenly?',
                options: [
                  { id: 'a', text: 'First Law (Inertia)' },
                  { id: 'b', text: 'Second Law (F=ma)' },
                  { id: 'c', text: 'Third Law (Action/Reaction)' },
                  { id: 'd', text: 'Law of Gravity' }
                ],
                correctAnswer: 'a'
              },
              {
                id: 'p2q2',
                type: 'one-word',
                prompt: 'A 10kg cat accelerates at 2m/s². What is the force in Newtons?',
                correctAnswer: '20',
                explanation: 'Force = mass x acceleration = 10 x 2 = 20N.'
              },
              {
                id: 'p2q3',
                type: 'matching',
                prompt: 'Link the Law to the Concept:',
                pairs: [
                  { left: '1st Law', right: 'Stationary stays stationary' },
                  { left: '2nd Law', right: 'F = m x a' },
                  { left: '3rd Law', right: 'Rocket thrust' }
                ]
              },
              {
                id: 'p2q4',
                type: 'mcq',
                prompt: 'Action-reaction forces act on...',
                options: [
                  { id: 'a', text: 'The same object' },
                  { id: 'b', text: 'Different objects' },
                  { id: 'c', text: 'Stationary objects only' },
                  { id: 'd', text: 'Moving objects only' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'p2q5',
                type: 'one-word',
                prompt: 'What term describes the resistance of an object to change its motion?',
                correctAnswer: 'Inertia',
                hint: 'Starts with I'
              }
            ]
          },
          {
            id: 'velocity-accel',
            title: 'Speed, Velocity, and Acceleration',
            lesson: {
              sections: [
                {
                  title: 'Scalar vs Vector',
                  content: 'Speed is "Scalar" (how fast you go). Velocity is "Vector" (speed in a specific direction).',
                },
                {
                  title: 'Acceleration',
                  content: 'Acceleration is the rate of change of velocity. If you speed up, slow down, or change direction, you are accelerating.',
                  interactive: {
                    type: 'reveal',
                    label: 'Formula for Acceleration?',
                    hiddenContent: 'Acceleration = (Final Velocity - Initial Velocity) / Time'
                  }
                },
                {
                  title: 'Calculating Speed',
                  content: 'Speed = Distance / Time. Units are typically meters per second (m/s).',
                }
              ]
            },
            flashcards: [
              { id: 'p3f1', question: 'What is the unit of acceleration?', answer: 'm/s²' },
              { id: 'p3f2', question: 'Is velocity scalar or vector?', answer: 'Vector' },
              { id: 'p3f3', question: 'Formula for speed?', answer: 'Speed = Distance / Time' },
              { id: 'p3f4', question: 'What does a horizontal line on a distance-time graph mean?', answer: 'Stationary (Stop)' },
              { id: 'p3f5', question: 'What describes "speed with a direction"?', answer: 'Velocity' }
            ],
            checkpointAssessment: [
              {
                id: 'p3q1',
                type: 'mcq',
                prompt: 'A car travels 100 meters in 5 seconds. What is its speed?',
                options: [
                  { id: 'a', text: '10 m/s' },
                  { id: 'b', text: '20 m/s' },
                  { id: 'c', text: '500 m/s' },
                  { id: 'd', text: '105 m/s' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'p3q2',
                type: 'one-word',
                prompt: 'What do we call acceleration that makes you slow down?',
                correctAnswer: 'Deceleration',
                explanation: 'Also known as negative acceleration.'
              },
              {
                id: 'p3q3',
                type: 'matching',
                prompt: 'Match properties:',
                pairs: [
                  { left: 'Distance', right: 'Scalar' },
                  { left: 'Displacement', right: 'Vector' },
                  { left: 'Speed', right: 'Scalar' }
                ]
              },
              {
                id: 'p3q4',
                type: 'mcq',
                prompt: 'If a car is turning a corner at a constant speed, is it accelerating?',
                options: [
                  { id: 'a', text: 'Yes, direction is changing' },
                  { id: 'b', text: 'No, speed is constant' },
                  { id: 'c', text: 'Only if it goes faster' },
                  { id: 'd', text: 'Only if it brakes' }
                ],
                correctAnswer: 'a'
              },
              {
                id: 'p3q5',
                type: 'one-word',
                prompt: 'Formula for Distance is Speed multiplied by ... ?',
                correctAnswer: 'Time',
                hint: 'S x T'
              }
            ]
          },
          {
            id: 'kinematics-linear',
            title: 'Kinematics: Motion Equations & Graphs',
            lesson: {
              sections: [
                {
                  title: 'Ticker Tape & Uniform Motion',
                  content: "A ticker timer stamps dots at equal time intervals. Equal spacing means constant velocity; increasing spacing means acceleration. Ticker tape gives a real-time record of an object's motion that can be analysed directly.",
                  interactive: {
                    type: 'reveal',
                    label: 'How do you find acceleration from ticker tape?',
                    hiddenContent: 'Measure the spacing between consecutive groups of dots (e.g., every 5 dots = 0.1 s). Use a = (v − u) / t where v and u are measured from early and late sections of the tape.'
                  }
                },
                {
                  title: 'SUVAT Equations of Motion',
                  content: "For constant acceleration: v = u + at, s = ut + ½at², v² = u² + 2as, and s = ½(u + v)t. These four equations link displacement s, initial velocity u, final velocity v, acceleration a, and time t. Identify the known quantities and pick the equation containing the unknown.",
                  interactive: {
                    type: 'expand',
                    label: 'Example: A car accelerates from rest at 3 m/s² for 4 s',
                    hiddenContent: 'u = 0, a = 3, t = 4. Using v = u + at: v = 0 + 3 × 4 = 12 m/s. Using s = ut + ½at²: s = 0 + ½ × 3 × 16 = 24 m.'
                  }
                },
                {
                  title: 'Interpreting Motion Graphs',
                  content: 'On a distance-time (s-t) graph the gradient equals velocity; a horizontal line means stationary. On a velocity-time (v-t) graph the gradient equals acceleration and the area under the curve equals displacement. A curved s-t graph indicates changing speed; a sloped straight v-t line indicates constant acceleration.',
                }
              ]
            },
            flashcards: [
              { id: 'kin-f1', question: 'Gradient of a distance-time graph gives?', answer: 'Speed or velocity' },
              { id: 'kin-f2', question: 'Area under a velocity-time graph gives?', answer: 'Displacement' },
              { id: 'kin-f3', question: 'Equal spacing on ticker tape indicates?', answer: 'Constant speed' },
              { id: 'kin-f4', question: 'Which SUVAT equation has no displacement term?', answer: 'v = u + at' },
              { id: 'kin-f5', question: 'Which quantity is measured in m/s²?', answer: 'Acceleration' }
            ],
            checkpointAssessment: [
              {
                id: 'kin-q1',
                type: 'mcq',
                prompt: 'A horizontal line on a velocity-time graph means:',
                options: [
                  { id: 'a', text: 'Constant acceleration' },
                  { id: 'b', text: 'Constant velocity (zero acceleration)' },
                  { id: 'c', text: 'Object is stationary' },
                  { id: 'd', text: 'Negative displacement' }
                ],
                correctAnswer: 'b',
                explanation: 'Zero gradient on a v-t graph means no change in velocity, i.e., constant velocity.'
              },
              {
                id: 'kin-q2',
                type: 'one-word',
                prompt: 'A car goes from 10 m/s to 30 m/s in 5 s. Acceleration = ? (in m/s²)',
                correctAnswer: '4',
                explanation: 'a = (v − u)/t = (30 − 10)/5 = 4 m/s²'
              },
              {
                id: 'kin-q3',
                type: 'matching',
                prompt: 'Match graph feature to meaning:',
                pairs: [
                  { left: 'Gradient of s-t graph', right: 'Velocity' },
                  { left: 'Gradient of v-t graph', right: 'Acceleration' },
                  { left: 'Area under v-t graph', right: 'Displacement' }
                ]
              }
            ]
          }
        ,
      {
        id: 'properties-matter-sub',
      title: 'Density, Buoyancy and Fluid Pressure',
      lesson: { sections: [{ title: 'Density', content: "Density = mass / volume. Objects denser than a fluid sink; less dense objects float. Density explains why ice floats on water and why hot air rises — heating a gas reduces its density." }, { title: 'Fluid Pressure', content: "Pressure in a fluid increases with depth: P = ρgh. Pressure acts equally in all directions at a given depth. This explains why dams are thicker at the base and why deep-sea creatures need special adaptations." }, { title: 'Archimedes Principle', content: "An object immersed in a fluid experiences an upthrust (buoyant force) equal to the weight of fluid displaced. If upthrust equals weight, the object floats. This principle underlies ship design, hydrometers, and submarine ballast systems." }] },
      flashcards: [{ id: 'pm-f1', question: 'Density equals?', answer: 'Mass divided by volume' }, { id: 'pm-f2', question: 'Fluid pressure increases with?', answer: 'Depth' }, { id: 'pm-f3', question: 'Archimedes principle links upthrust to?', answer: 'Weight of displaced fluid' }, { id: 'pm-f4', question: 'Units of density?', answer: 'kg/m³' }, { id: 'pm-f5', question: 'Pressure formula for fluids?', answer: 'P = ρgh' }],
      checkpointAssessment: [{ id: 'pm-q1', type: 'mcq' as const, prompt: 'An object floats when its average density is:', options: [{ id: 'a', text: 'Greater than the fluid' }, { id: 'b', text: 'Less than the fluid' }, { id: 'c', text: 'Always 1' }, { id: 'd', text: 'Unrelated' }], correctAnswer: 'b' }, { id: 'pm-q2', type: 'one-word' as const, prompt: 'Pressure is force divided by?', correctAnswer: 'Area' }]
    },
    {
      id: 'energy-transfer-sub',
      title: 'Energy Transfer, Efficiency and Sankey Diagrams',
      lesson: { sections: [{ title: 'Conservation of Energy', content: "Energy cannot be created or destroyed, only transferred between stores. The main energy stores are kinetic, gravitational potential, elastic, thermal, chemical, nuclear, magnetic, and electrostatic." }, { title: 'Efficiency and Waste', content: "Efficiency = useful output energy / total input energy × 100%. No device is 100% efficient — energy is always dissipated to thermal stores in surroundings. Reducing friction and improving insulation increase efficiency." }, { title: 'Sankey Diagrams', content: "Sankey diagrams show energy flow with arrow widths proportional to energy amounts. The input arrow splits into useful output and wasted pathways. They allow quick visual comparison of efficiency between devices." }] },
      flashcards: [{ id: 'ets-f1', question: 'What does a wider Sankey arrow mean?', answer: 'A larger amount of energy' }, { id: 'ets-f2', question: 'Efficiency formula?', answer: 'Useful output / total input × 100%' }, { id: 'ets-f3', question: 'Can energy be destroyed?', answer: 'No — only transferred or dissipated' }, { id: 'ets-f4', question: 'Wasted energy usually ends up as?', answer: 'Thermal energy in surroundings' }, { id: 'ets-f5', question: 'Name 3 energy stores', answer: 'Kinetic, gravitational potential, thermal' }],
      checkpointAssessment: [{ id: 'ets-q1', type: 'mcq' as const, prompt: 'A 100J lamp gives 25J of light. Efficiency is:', options: [{ id: 'a', text: '25%' }, { id: 'b', text: '50%' }, { id: 'c', text: '75%' }, { id: 'd', text: '100%' }], correctAnswer: 'a' }, { id: 'ets-q2', type: 'one-word' as const, prompt: 'Wasted energy is usually transferred to thermal?', correctAnswer: 'Surroundings' }]
    }
        ],
        finalAssessment: [
          {
            id: 'p-final-1',
            type: 'mcq',
            prompt: 'Which force opposes weight for a book resting on a table?',
            options: [
              { id: 'a', text: 'Gravity' },
              { id: 'b', text: 'Friction' },
              { id: 'c', text: 'Normal Contact Force' },
              { id: 'd', text: 'Tension' }
            ],
            correctAnswer: 'c'
          },
          {
            id: 'p-final-2',
            type: 'one-word',
            prompt: 'If a resultant force acts on an object, it will always ... ?',
            correctAnswer: 'Accelerate'
          },
          {
            id: 'p-final-3',
            type: 'matching',
            prompt: 'Sync Physics constants:',
            pairs: [
              { left: 'Gravity (Earth)', right: 'Approx 9.8 m/s²' },
              { left: 'Friction', right: 'Opposes Motion' },
              { left: 'Newton', right: 'Unit of Force' }
            ]
          }
        ]
      }
