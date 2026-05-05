import type { Topic } from '../types';

export const ATOMIC_PERIODIC_TOPIC: Topic =
      {
        id: 'atomic-periodic',
        title: 'Atomic Structure and Periodic Table',
        subtopics: [
          {
            id: 'atomic-structure',
            title: 'Structure of the Atom',
            lesson: {
              sections: [
                {
                  title: 'Subatomic Particles',
                  content: 'Atoms consist of Protons (+), Neutrons (0), and Electrons (-). Protons and Neutrons are in the nucleus. Electrons orbit in shells.',
                },
                {
                  title: 'Numbers and Identity',
                  content: 'Atomic Number = Number of Protons. All atoms of the same element have the same atomic number. Mass Number = Protons + Neutrons.',
                  interactive: {
                    type: 'reveal',
                    label: 'Calculations',
                    hiddenContent: 'To find Neutrons: Subtract Atomic Number from Mass Number.'
                  }
                },
                {
                  title: 'Neutrality',
                  content: 'In a neutral atom, the number of Protons equals the number of Electrons.',
                }
              ]
            },
            flashcards: [
              { id: 'c1f1', question: 'What is the charge of a proton?', answer: 'Positive (+1)' },
              { id: 'c1f2', question: 'Which particle has no charge?', answer: 'Neutron' },
              { id: 'c1f3', question: 'Where are neutrons located?', answer: 'The Nucleus' },
              { id: 'c1f4', question: 'What determines the identity of an element?', answer: 'Number of Protons (Atomic Number)' },
              { id: 'c1f5', question: 'What is the charge of an electron?', answer: 'Negative (-1)' }
            ],
            checkpointAssessment: [
              {
                id: 'c1q1',
                type: 'mcq',
                prompt: 'An atom has 6 protons and 8 neutrons. What is its mass number?',
                options: [
                  { id: 'a', text: '6' },
                  { id: 'b', text: '8' },
                  { id: 'c', text: '14' },
                  { id: 'd', text: '2' }
                ],
                correctAnswer: 'c'
              },
              {
                id: 'c1q2',
                type: 'one-word',
                prompt: 'What name is given to atoms of the same element with different numbers of neutrons?',
                correctAnswer: 'Isotopes',
                explanation: 'Isotopes have the same atomic number but different mass numbers.'
              },
              {
                id: 'c1q3',
                type: 'matching',
                prompt: 'Match particle to mass:',
                pairs: [
                  { left: 'Proton', right: '1 unit' },
                  { left: 'Neutron', right: '1 unit' },
                  { left: 'Electron', right: 'Almost 0' }
                ]
              },
              {
                id: 'c1q4',
                type: 'mcq',
                prompt: 'Where is most of the mass of an atom concentrated?',
                options: [
                  { id: 'a', text: 'Electron shells' },
                  { id: 'b', text: 'The Nucleus' },
                  { id: 'c', text: 'Empty space' },
                  { id: 'd', text: 'Orbitals' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'c1q5',
                type: 'one-word',
                prompt: 'The atomic number is equal to the number of ... ?',
                correctAnswer: 'Protons',
                hint: 'In the nucleus'
              }
            ]
          },
          {
            id: 'electron-config',
            title: 'Electron Configuration (Basic)',
            lesson: {
              sections: [
                {
                  title: 'The Shell Model',
                  content: 'Electrons organize into shells around the nucleus. The first shell can hold 2, the second and third can hold 8.',
                },
                {
                  title: 'Valence Electrons',
                  content: 'The electrons in the outermost shell are "Valence Electrons." They determine how the atom reacts chemically.',
                  interactive: {
                    type: 'expand',
                    label: 'Example: Oxygen',
                    hiddenContent: 'Oxygen (8 protons) has 2 in the first shell and 6 in the second shell. Configuration: 2, 6.'
                  }
                },
                {
                  title: 'Stable States',
                  content: 'Atoms react to gain or lose electrons to achieve a full outer shell, which is more stable.',
                }
              ]
            },
            flashcards: [
              { id: 'c2f1', question: 'How many electrons can the 1st shell hold?', answer: '2' },
              { id: 'c2f2', question: 'What is the configuration for Neon (Atomic #10)?', answer: '2, 8' },
              { id: 'c2f3', question: 'What do we call the outer shell electrons?', answer: 'Valence Electrons' },
              { id: 'c2f4', question: 'Which atoms have full outer shells naturally?', answer: 'Noble Gases (Group 18)' },
              { id: 'c2f5', question: 'If an atom has 11 electrons, what is its configuration?', answer: '2, 8, 1' }
            ],
            checkpointAssessment: [
              {
                id: 'c2q1',
                type: 'mcq',
                prompt: 'What is the electron configuration of Sodium (Atomic number 11)?',
                options: [
                  { id: 'a', text: '2, 9' },
                  { id: 'b', text: '1, 2, 8' },
                  { id: 'c', text: '2, 8, 1' },
                  { id: 'd', text: '2, 8, 2' }
                ],
                correctAnswer: 'c'
              },
              {
                id: 'c2q2',
                type: 'one-word',
                prompt: 'Elements in the same group have the same number of ... electrons?',
                correctAnswer: 'Valence',
                explanation: 'This explains why elements in the same group react similarly.'
              },
              {
                id: 'c2q3',
                type: 'matching',
                prompt: 'Match Atom to config:',
                pairs: [
                  { left: 'Helium', right: '2' },
                  { left: 'Carbon', right: '2, 4' },
                  { left: 'Magnesium', right: '2, 8, 2' }
                ]
              },
              {
                id: 'c2q4',
                type: 'mcq',
                prompt: 'Why are Noble Gases unreactive?',
                options: [
                  { id: 'a', text: 'They are too heavy' },
                  { id: 'b', text: 'Full outer shells' },
                  { id: 'c', text: 'No protons' },
                  { id: 'd', text: 'They are metals' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'c2q5',
                type: 'one-word',
                prompt: 'How many shells would an atom with configuration 2, 8, 8 have?',
                correctAnswer: '3',
                hint: 'Count the numbers'
              }
            ]
          },
          {
            id: 'periodic-trends',
            title: 'Periodic Table Trends',
            lesson: {
              sections: [
                {
                  title: 'Groups and Periods',
                  content: 'Groups are vertical columns (tell us valence electrons). Periods are horizontal rows (tell us number of electron shells).',
                },
                {
                  title: 'Group 1: Alkali Metals',
                  content: 'Highly reactive metals. Reactivity INCREASES as you go down the group because the outer electron is further from the nucleus.',
                  interactive: {
                    type: 'reveal',
                    label: 'Reaction with water?',
                    hiddenContent: 'Alkali metals react with water to form hydrogen gas and an alkaline solution.'
                  }
                },
                {
                  title: 'Group 17/7: Halogens',
                  content: 'Reactive non-metals. Reactivity DECREASES as you go down because it becomes harder to attract an electron.',
                }
              ]
            },
            flashcards: [
              { id: 'c3f1', question: 'What does the group number tell you?', answer: 'Number of valence electrons' },
              { id: 'c3f2', question: 'What does the period number tell you?', answer: 'Number of electron shells' },
              { id: 'c3f3', question: 'Which group contains the Alkali Metals?', answer: 'Group 1' },
              { id: 'c3f4', question: 'What are Halogens?', answer: 'Reactive non-metals in Group 17/7' },
              { id: 'c3f5', question: 'Does Magnesium belong to Group 1 or 2?', answer: 'Group 2 (Alkaline Earth Metals)' }
            ],
            checkpointAssessment: [
              {
                id: 'c3q1',
                type: 'mcq',
                prompt: 'In Group 1, which element is most reactive?',
                options: [
                  { id: 'a', text: 'Lithium' },
                  { id: 'b', text: 'Sodium' },
                  { id: 'c', text: 'Potassium' },
                  { id: 'd', text: 'Cesium' }
                ],
                correctAnswer: 'd',
                explanation: 'Reactivity increases down Group 1.'
              },
              {
                id: 'c3q2',
                type: 'one-word',
                prompt: 'What name is given to elements found in the middle block of the table?',
                correctAnswer: 'Transition',
                explanation: 'Transition Metals have variable oxidation states.'
              },
              {
                id: 'c3q3',
                type: 'matching',
                prompt: 'Match Property to Trend:',
                pairs: [
                  { left: 'Down Group 1', right: 'Increase Reactivity' },
                  { left: 'Down Group 7', right: 'Decrease Reactivity' },
                  { left: 'Across Period', right: 'Metal to Non-Metal' }
                ]
              },
              {
                id: 'c3q4',
                type: 'mcq',
                prompt: 'Which element is a Halogen?',
                options: [
                  { id: 'a', text: 'Chlorine' },
                  { id: 'b', text: 'Iron' },
                  { id: 'c', text: 'Calcium' },
                  { id: 'd', text: 'Argon' }
                ],
                correctAnswer: 'a'
              },
              {
                id: 'c3q5',
                type: 'one-word',
                prompt: 'Horizontal rows in the table are called ... ?',
                correctAnswer: 'Periods',
                hint: 'Vertical = Groups'
              }
            ]
          }
        ,
      {
        id: 'states-matter-gas-sub',
      title: 'States of Matter and Gas Laws',
      lesson: { sections: [{ title: 'Particle Model', content: "Solids have particles in fixed positions vibrating. Liquids have particles close but moving past each other. Gases have particles far apart moving randomly at high speed. Heating increases particle kinetic energy." }, { title: 'Gas Laws', content: "Boyle law: at constant temperature, pressure is inversely proportional to volume (PV = constant). Charles law: at constant pressure, volume is directly proportional to absolute temperature. Combined gas law: PV/T = constant." }, { title: 'Kinetic Theory', content: "Gas pressure results from particle collisions with container walls. Higher temperature means faster particles and more forceful collisions. Reducing volume increases collision frequency and therefore pressure." }] },
      flashcards: [{ id: 'gas-f1', question: 'Boyle law links pressure and?', answer: 'Volume (inversely)' }, { id: 'gas-f2', question: 'Charles law links volume and?', answer: 'Temperature (directly)' }, { id: 'gas-f3', question: 'What causes gas pressure?', answer: 'Particle collisions with walls' }, { id: 'gas-f4', question: 'What happens to volume when gas is heated at constant pressure?', answer: 'It increases' }, { id: 'gas-f5', question: 'Absolute zero is?', answer: '0 Kelvin or -273°C' }],
      checkpointAssessment: [{ id: 'gas-q1', type: 'mcq' as const, prompt: 'At constant temperature, reducing gas volume:', options: [{ id: 'a', text: 'Reduces pressure' }, { id: 'b', text: 'Increases pressure' }, { id: 'c', text: 'Freezes the gas' }, { id: 'd', text: 'Removes particles' }], correctAnswer: 'b' }, { id: 'gas-q2', type: 'one-word' as const, prompt: 'PV = constant describes which law?', correctAnswer: 'Boyle' }]
    },
    {
      id: 'molecular-geometry-sub',
      title: 'Molecular Geometry and VSEPR',
      lesson: { sections: [{ title: 'Electron Domain Geometry', content: "VSEPR theory: electron pairs around a central atom arrange to minimize repulsion. Lone pairs repel more strongly than bonding pairs, compressing bond angles below ideal values." }, { title: 'Common Molecular Shapes', content: "2 domains → linear (180°). 3 domains → trigonal planar (120°). 4 domains → tetrahedral (109.5°). 5 domains → trigonal bipyramidal. 6 domains → octahedral. Lone pairs modify these ideal geometries." }, { title: 'Polarity from Shape', content: "A molecule is polar if it has polar bonds AND an asymmetric shape. CO2 is linear and nonpolar despite polar bonds. Water is bent and polar. Symmetry cancels dipoles; asymmetry creates a net dipole." }] },
      flashcards: [{ id: 'vs-f1', question: 'Shape of methane CH4?', answer: 'Tetrahedral' }, { id: 'vs-f2', question: 'Tetrahedral bond angle?', answer: '109.5°' }, { id: 'vs-f3', question: 'Shape of water H2O?', answer: 'Bent (V-shaped)' }, { id: 'vs-f4', question: 'Lone pairs repel more or less than bonding pairs?', answer: 'More' }, { id: 'vs-f5', question: 'VSEPR stands for?', answer: 'Valence Shell Electron Pair Repulsion' }],
      checkpointAssessment: [{ id: 'vs-q1', type: 'mcq' as const, prompt: '2 bonds and 2 lone pairs gives which shape?', options: [{ id: 'a', text: 'Linear' }, { id: 'b', text: 'Bent' }, { id: 'c', text: 'Tetrahedral' }, { id: 'd', text: 'Trigonal planar' }], correctAnswer: 'b' }, { id: 'vs-q2', type: 'one-word' as const, prompt: 'CO2 is linear and therefore?', correctAnswer: 'Nonpolar' }]
    }
        ],
        finalAssessment: [
          {
            id: 'c-final-1',
            type: 'mcq',
            prompt: 'How many electrons does an ion of Chlorine (Cl-) have?',
            options: [
              { id: 'a', text: '17' },
              { id: 'b', text: '18' },
              { id: 'c', text: '16' },
              { id: 'd', text: '7' }
            ],
            correctAnswer: 'b'
          },
          {
            id: 'c-final-2',
            type: 'one-word',
            prompt: 'The particle in the atom with mass 1 and charge 0 is the ... ?',
            correctAnswer: 'Neutron'
          },
          {
            id: 'c-final-3',
            type: 'matching',
            prompt: 'Sync chemistry pairs:',
            pairs: [
              { left: 'Atomic Number', right: 'Protons' },
              { left: 'Group 0', right: 'Inert' },
              { left: 'Lithium', right: '2, 1' }
            ]
          }
        ]
      }
