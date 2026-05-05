import type { Topic } from '../types';

export const CELL_BIOLOGY_TOPIC: Topic =
      {
        id: 'cell-structure-function',
        title: 'Cell Structure and Function',
        subtopics: [
          {
            id: 'animal-vs-plant',
            title: 'Animal vs Plant Cells',
            lesson: {
              sections: [
                {
                  title: 'Universal Structures',
                  content: 'All eukaryotic cells (both animal and plant) share common features: Cytoplasm, Nucleus, Mitochondria, and Ribosomes. These carry out fundamental processes like respiration and protein synthesis.',
                },
                {
                  title: 'The Plant Cell Fortress',
                  content: 'Plant cells have unique structures that provide support and energy. These include a rigid Cell Wall made of cellulose and Large Permanent Vacuoles for storage.',
                  interactive: {
                    type: 'reveal',
                    label: 'What is the Cell Wall made of?',
                    hiddenContent: 'Cellulose, which provides structural strength to prevent the cell from bursting if it takes in too much water.'
                  }
                },
                {
                  title: 'Photosynthesis Machines',
                  content: 'Plant cells contain Chloroplasts, which house chlorophyll to capture light energy for photosynthesis. Animal cells never have chloroplasts as they ingest food instead.',
                }
              ]
            },
            flashcards: [
              { id: 'b1f1', question: 'Which organelle is only found in plant cells for structural support?', answer: 'Cell Wall' },
              { id: 'b1f2', question: 'Do animal cells have a large permanent vacuole?', answer: 'No, they have small temporary ones.' },
              { id: 'b1f3', question: 'What chemical makes the cell wall rigid?', answer: 'Cellulose' },
              { id: 'b1f4', question: 'Which organelle carries out photosynthesis?', answer: 'Chloroplast' },
              { id: 'b1f5', question: 'Name a structure found in both cell types.', answer: 'Nucleus / Mitochondria / Ribosome / Cytoplasm' }
            ],
            checkpointAssessment: [
              {
                id: 'b1q1',
                type: 'mcq',
                prompt: 'In a microscope, you see a cell with a large central vacuole and a green pigment. What is it?',
                options: [
                  { id: 'a', text: 'Cheek cell' },
                  { id: 'b', text: 'Nerve cell' },
                  { id: 'c', text: 'Palisade cell (Plant)' },
                  { id: 'd', text: 'Bacterial cell' }
                ],
                correctAnswer: 'c',
                explanation: 'Large vacuoles and chloroplasts (green pigment) are characteristic of plant cells like the palisade mesophyll.'
              },
              {
                id: 'b1q2',
                type: 'one-word',
                prompt: 'What is the basic unit of life?',
                correctAnswer: 'Cell',
                explanation: 'A cell is the smallest functional unit of a living organism.'
              },
              {
                id: 'b1q3',
                type: 'matching',
                prompt: 'Match the organelle to its unique presence:',
                pairs: [
                  { left: 'Chloroplast', right: 'Plant only' },
                  { left: 'Cellulose Wall', right: 'Plant only' },
                  { left: 'Centrioles', right: 'Animal only' }
                ]
              },
              {
                id: 'b1q4',
                type: 'mcq',
                prompt: 'Which organelle is the site of protein synthesis?',
                options: [
                  { id: 'a', text: 'Nucleus' },
                  { id: 'b', text: 'Ribosome' },
                  { id: 'c', text: 'Mitochondria' },
                  { id: 'd', text: 'Vacuole' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'b1q5',
                type: 'one-word',
                prompt: 'Which structure controls the movement of substances in and out of the cell?',
                correctAnswer: 'Membrane',
                hint: 'Cell ...'
              }
            ]
          },
          {
            id: 'membrane-transport',
            title: 'Cell Membrane and Transport',
            lesson: {
              sections: [
                {
                  title: 'The Gatekeeper',
                  content: 'The cell membrane is "partially permeable." It chooses what enters and leaves, maintaining a stable internal environment.',
                },
                {
                  title: 'Passive Transport: Diffusion',
                  content: 'Movement of particles from a high concentration to a low concentration until they are evenly spread out. This requires NO energy.',
                  interactive: {
                    type: 'expand',
                    label: 'Learn about Osmosis',
                    hiddenContent: 'Osmosis is a special type of diffusion involving only water molecules moving across a partially permeable membrane from a dilute to a concentrated solution.'
                  }
                },
                {
                  title: 'Active Transport',
                  content: 'Sometimes cells need to move substances "uphill" from a low concentration to a high concentration. This requires energy (ATP) from respiration.',
                }
              ]
            },
            flashcards: [
              { id: 'b2f1', question: 'Does diffusion require energy?', answer: 'No (it is passive)' },
              { id: 'b2f2', question: 'Which transport type uses energy?', answer: 'Active Transport' },
              { id: 'b2f3', question: 'Osmosis is the diffusion of which molecule?', answer: 'Water' },
              { id: 'b2f4', question: 'What describes a membrane that only lets some things through?', answer: 'Partially Permeable' },
              { id: 'b2f5', question: 'Where does the energy for active transport come from?', answer: 'Respiration (Mitochondria)' }
            ],
            checkpointAssessment: [
              {
                id: 'b2q1',
                type: 'mcq',
                prompt: 'Oxygen moves from the lungs into the blood where there is less oxygen. What is this?',
                options: [
                  { id: 'a', text: 'Osmosis' },
                  { id: 'b', text: 'Diffusion' },
                  { id: 'c', text: 'Active Transport' },
                  { id: 'd', text: 'Bulk Flow' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'b2q2',
                type: 'matching',
                prompt: 'Match the mode to the movement:',
                pairs: [
                  { left: 'High to Low (Passive)', right: 'Diffusion' },
                  { left: 'Low to High (Active)', right: 'Active Transport' },
                  { left: 'Water via Membrane', right: 'Osmosis' }
                ]
              },
              {
                id: 'b2q3',
                type: 'one-word',
                prompt: 'What molecule carries energy for active transport?',
                correctAnswer: 'ATP',
                explanation: 'Adenosine Triphosphate is the energy currency of the cell.'
              },
              {
                id: 'b2q4',
                type: 'mcq',
                prompt: 'If a cell is placed in pure water, what will happen to it?',
                options: [
                  { id: 'a', text: 'Shrink' },
                  { id: 'b', text: 'Swell/Burst' },
                  { id: 'c', text: 'Stay the same' },
                  { id: 'd', text: 'Turn green' }
                ],
                correctAnswer: 'b',
                explanation: 'Water enters the cell via osmosis because the cell has a lower water potential than the pure water.'
              },
              {
                id: 'b2q5',
                type: 'one-word',
                prompt: 'Which term describes a solution with the same concentration as the cell?',
                correctAnswer: 'Isotonic',
                hint: 'Iso...'
              }
            ]
          },
          {
            id: 'levels-organization',
            title: 'Levels of Organization',
            lesson: {
              sections: [
                {
                  title: 'The Biological Hierarchy',
                  content: 'Life is organized into a hierarchy of increasing complexity: Cells -> Tissues -> Organs -> Organ Systems -> Organism.',
                },
                {
                  title: 'Tissues and Organs',
                  content: 'A Tissue is a group of similar cells working together. An Organ is a group of different tissues working together to perform a specific job (like the heart or a leaf).',
                },
                {
                  title: 'Organ Systems',
                  content: 'Systems like the Circulatory System or Digestive System consist of multiple organs working in coordination to keep the organism alive.',
                  interactive: {
                    type: 'reveal',
                    label: 'Example of an organ system?',
                    hiddenContent: 'The Digestive System: includes the stomach, intestines, liver, and esophagus.'
                  }
                }
              ]
            },
            flashcards: [
              { id: 'b3f1', question: 'What is a group of similar cells called?', answer: 'Tissue' },
              { id: 'b3f2', question: 'Is the heart a tissue or an organ?', answer: 'Organ' },
              { id: 'b3f3', question: 'What follows "Organ System" in the hierarchy?', answer: 'Organism' },
              { id: 'b3f4', question: 'What is a group of different tissues working together?', answer: 'Organ' },
              { id: 'b3f5', question: 'Name a plant organ.', answer: 'Leaf / Stem / Root / Flower' }
            ],
            checkpointAssessment: [
              {
                id: 'b3q1',
                type: 'mcq',
                prompt: 'Which of the following is the correct order of organization?',
                options: [
                  { id: 'a', text: 'Cell -> Organ -> Tissue -> System' },
                  { id: 'b', text: 'Cell -> Tissue -> Organ -> System' },
                  { id: 'c', text: 'Organ -> System -> Tissue -> Cell' },
                  { id: 'd', text: 'Tissue -> Cell -> Organ -> System' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'b3q2',
                type: 'one-word',
                prompt: 'What level of organization is the stomach?',
                correctAnswer: 'Organ',
                explanation: 'The stomach contains muscle tissue, nervous tissue, and epithelial tissue working together.'
              },
              {
                id: 'b3q3',
                type: 'matching',
                prompt: 'Match the example to the level:',
                pairs: [
                  { left: 'Red Blood Cell', right: 'Cell' },
                  { left: 'Cardiac Muscle', right: 'Tissue' },
                  { left: 'Respiratory', right: 'Organ System' }
                ]
              },
              {
                id: 'b3q4',
                type: 'mcq',
                prompt: 'Which is the largest level of organization listed?',
                options: [
                  { id: 'a', text: 'Organ' },
                  { id: 'b', text: 'Organism' },
                  { id: 'c', text: 'Tissue' },
                  { id: 'd', text: 'Cell' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'b3q5',
                type: 'one-word',
                prompt: 'A group of organs working together is called an organ ... ?',
                correctAnswer: 'System',
                hint: 'Digestion ...'
              }
            ]
          }
        ],
        finalAssessment: [
          {
            id: 'b-final-1',
            type: 'mcq',
            prompt: 'Why do plants have cell walls but animals do not?',
            options: [
              { id: 'a', text: 'Plants eat other cells' },
              { id: 'b', text: 'Plants need skeleton-like support since they lack bones' },
              { id: 'c', text: 'Animal cells are larger' },
              { id: 'd', text: 'To capture sunlight' }
            ],
            correctAnswer: 'b'
          },
          {
            id: 'b-final-2',
            type: 'one-word',
            prompt: 'Diffusion of water through a partially permeable membrane is called ... ?',
            correctAnswer: 'Osmosis'
          },
          {
            id: 'b-final-3',
            type: 'matching',
            prompt: 'Sync the terms:',
            pairs: [
              { left: 'Chloroplast', right: 'Plant Energy' },
              { left: 'Active Transport', right: 'Needs ATP' },
              { left: 'Epithelium', right: 'Tissue Example' }
            ]
          }
        ]
      }
