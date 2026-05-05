import { Topic } from './types';

// Helper to quickly create multiple choice questions
const quickQuestion = (id: string, prompt: string, options: string[], correctAnswerId: string, explanation?: string) => ({
  id,
  type: 'mcq' as const,
  prompt,
  options: options.map((opt, i) => ({ id: ['a', 'b', 'c', 'd'][i], text: opt })),
  correctAnswer: correctAnswerId,
  explanation,
});

export const BIOLOGY_EXPANSION_TOPICS: Topic[] = [
  {
    id: 'ecology-ecosystems-topic',
    title: 'Ecology & Ecosystems',
    levelBand: 'secondary',
    curriculumTags: ['WAEC', 'Cambridge', 'NGSS'],
    summary: 'Study food webs, energy pyramids, and nutrient cycling in ecosystems.',
    subtopics: [
      {
        id: 'food-webs-energy',
        title: 'Food Webs and Energy Flow',
        lesson: { sections: [{ title: 'Trophic Levels', content: 'Energy enters ecosystems through producers (plants) via photosynthesis. It flows to primary consumers (herbivores), then secondary and tertiary consumers (carnivores). Only about 10% of energy is transferred between trophic levels.' }] },
        flashcards: [
          { id: 'eco-f1', question: 'What is the original source of energy in most ecosystems?', answer: 'The Sun' },
          { id: 'eco-f2', question: 'What percentage of energy transfers to the next trophic level?', answer: 'Approximately 10%' },
        ],
        checkpointAssessment: [
          quickQuestion('eco-q1', 'Producers are typically found at which trophic level?', ['First', 'Second', 'Third', 'Fourth'], 'a'),
        ],
      },
      {
        id: 'nutrient-cycling',
        title: 'Nutrient Cycling',
        lesson: { sections: [{ title: 'Carbon and Nitrogen Cycles', content: 'Nutrients are recycled. The carbon cycle involves photosynthesis, respiration, combustion, and decomposition. The nitrogen cycle relies on bacteria for nitrogen fixation, nitrification, and denitrification.' }] },
        flashcards: [
          { id: 'eco-f3', question: 'Which process removes carbon dioxide from the atmosphere?', answer: 'Photosynthesis' },
          { id: 'eco-f4', question: 'What organisms are crucial for the nitrogen cycle?', answer: 'Bacteria' },
        ],
        checkpointAssessment: [
          quickQuestion('eco-q2', 'Denitrifying bacteria convert nitrates into:', ['Ammonia', 'Nitrites', 'Nitrogen gas', 'Proteins'], 'c'),
        ],
      },
      {
        id: 'population-dynamics',
        title: 'Population Dynamics',
        lesson: { sections: [{ title: 'Growth and Limits', content: 'Populations grow exponentially if unconstrained, but are limited by carrying capacity due to density-dependent factors (competition, predation, disease) and density-independent factors (weather, natural disasters).' }] },
        flashcards: [
          { id: 'eco-f5', question: 'What is carrying capacity?', answer: 'The maximum population size an environment can support' },
          { id: 'eco-f6', question: 'Is predation a density-dependent or independent factor?', answer: 'Density-dependent' },
        ],
        checkpointAssessment: [
          quickQuestion('eco-q3', 'Which of the following is a density-independent limiting factor?', ['Disease', 'Competition', 'Forest fire', 'Predation'], 'c'),
        ],
      }
    ],
    finalAssessment: [
      quickQuestion('eco-final', 'If a primary consumer contains 1000J of energy, roughly how much reaches the secondary consumer?', ['1000J', '100J', '10J', '1J'], 'b'),
    ],
  }
];

export const PHYSICS_EXPANSION_TOPICS: Topic[] = [
  {
    id: 'heat-energy-topic',
    title: 'Heat Energy',
    levelBand: 'secondary',
    curriculumTags: ['WAEC', 'Cambridge', 'NGSS'],
    summary: 'Model calorimetry, heating curves, and latent heat with measurable energy changes.',
    subtopics: [
      {
        id: 'heat-transfer',
        title: 'Conduction, Convection, Radiation',
        lesson: { sections: [{ title: 'Methods of Heat Transfer', content: 'Heat flows from hot to cold. Conduction occurs in solids via particle vibrations and free electrons. Convection occurs in fluids as warmer, less dense fluid rises. Radiation transfers energy via infrared electromagnetic waves.' }] },
        flashcards: [
          { id: 'he-f1', question: 'Why are metals good conductors?', answer: 'They have free (delocalised) electrons' },
          { id: 'he-f2', question: 'Which method of heat transfer can happen in a vacuum?', answer: 'Radiation' },
        ],
        checkpointAssessment: [
          quickQuestion('he-q1', 'Hot air rising is an example of:', ['Conduction', 'Convection', 'Radiation', 'Evaporation'], 'b'),
        ],
      },
      {
        id: 'specific-heat-capacity',
        title: 'Specific Heat Capacity',
        lesson: { sections: [{ title: 'Heating and Cooling', content: 'Specific heat capacity (c) is the energy required to raise the temperature of 1 kg of a substance by 1°C. Formula: Q = mcΔT. Water has a high specific heat capacity, making it a good coolant.' }] },
        flashcards: [
          { id: 'he-f3', question: 'What is the formula for heat energy change?', answer: 'Q = mcΔT' },
          { id: 'he-f4', question: 'A high specific heat capacity means?', answer: 'It takes a lot of energy to change its temperature' },
        ],
        checkpointAssessment: [
          quickQuestion('he-q2', 'If mass and specific heat capacity are constant, energy supplied is proportional to:', ['Volume', 'Density', 'Temperature change', 'Time'], 'c'),
        ],
      },
      {
        id: 'latent-heat',
        title: 'Latent Heat and Heating Curves',
        lesson: { sections: [{ title: 'Changing State', content: 'During a change of state, temperature remains constant as energy breaks intermolecular bonds. Specific latent heat (L) is energy needed to change the state of 1 kg of substance. Q = mL.' }] },
        flashcards: [
          { id: 'he-f5', question: 'Why does temperature not change during melting?', answer: 'Energy is used to break intermolecular bonds' },
          { id: 'he-f6', question: 'Formula for latent heat energy?', answer: 'Q = mL' },
        ],
        checkpointAssessment: [
          quickQuestion('he-q3', 'On a heating curve, a flat horizontal line indicates:', ['Cooling', 'Constant heating rate', 'Change of state', 'Measurement error'], 'c'),
        ],
      }
    ],
    finalAssessment: [
      quickQuestion('he-final', 'Energy needed to boil 2kg of a liquid (L = 300 kJ/kg) is:', ['150 kJ', '300 kJ', '600 kJ', '900 kJ'], 'c'),
    ],
  }
];

export const CHEMISTRY_EXPANSION_TOPICS: Topic[] = [
  {
    id: 'organic-chemistry-topic',
    title: 'Organic Chemistry',
    levelBand: 'advanced',
    curriculumTags: ['WAEC', 'Cambridge', 'NGSS'],
    summary: 'Explore hydrocarbons, functional groups, and isomerism.',
    subtopics: [
      {
        id: 'hydrocarbons',
        title: 'Alkanes and Alkenes',
        lesson: { sections: [{ title: 'Saturated vs Unsaturated', content: 'Alkanes are saturated hydrocarbons with single bonds (CnH2n+2). Alkenes are unsaturated with at least one C=C double bond (CnH2n). Alkenes decolorize bromine water.' }] },
        flashcards: [
          { id: 'org-f1', question: 'General formula for alkanes?', answer: 'CnH2n+2' },
          { id: 'org-f2', question: 'Test for unsaturation (alkenes)?', answer: 'Bromine water turns from orange to colorless' },
        ],
        checkpointAssessment: [
          quickQuestion('org-q1', 'Which of the following is an alkene?', ['CH4', 'C2H6', 'C3H6', 'C4H10'], 'c'),
        ],
      },
      {
        id: 'functional-groups',
        title: 'Alcohols, Acids and Esters',
        lesson: { sections: [{ title: 'Oxygen in Organic Molecules', content: 'Alcohols contain the -OH group. Carboxylic acids contain the -COOH group. Reacting an alcohol with a carboxylic acid (with acid catalyst) produces an ester and water.' }] },
        flashcards: [
          { id: 'org-f3', question: 'Functional group of alcohols?', answer: '-OH (hydroxyl)' },
          { id: 'org-f4', question: 'What is produced when an alcohol reacts with a carboxylic acid?', answer: 'An ester and water' },
        ],
        checkpointAssessment: [
          quickQuestion('org-q2', 'The compound CH3CH2OH is:', ['An alkane', 'An alkene', 'An alcohol', 'A carboxylic acid'], 'c'),
        ],
      },
      {
        id: 'polymers',
        title: 'Addition and Condensation Polymers',
        lesson: { sections: [{ title: 'Making Long Chains', content: 'Addition polymerization joins alkene monomers by breaking the double bond. Condensation polymerization joins monomers with two functional groups, eliminating a small molecule like water (e.g., polyesters, polyamides).' }] },
        flashcards: [
          { id: 'org-f5', question: 'What type of polymerization involves alkenes?', answer: 'Addition polymerization' },
          { id: 'org-f6', question: 'What small molecule is often lost in condensation polymerization?', answer: 'Water' },
        ],
        checkpointAssessment: [
          quickQuestion('org-q3', 'Proteins are natural polymers made of:', ['Ethene', 'Glucose', 'Amino acids', 'Fatty acids'], 'c'),
        ],
      }
    ],
    finalAssessment: [
      quickQuestion('org-final', 'Which process converts long-chain alkanes into shorter alkanes and alkenes?', ['Distillation', 'Cracking', 'Polymerization', 'Esterification'], 'b'),
    ],
  }
];

export const MATHEMATICS_EXPANSION_TOPICS: Topic[] = [
  {
    id: 'geometry-trig-topic',
    title: 'Geometry & Trigonometry',
    levelBand: 'secondary',
    curriculumTags: ['WAEC', 'Cambridge', 'NGSS'],
    summary: 'Explore spatial reasoning, right-angled triangles, and circle theorems.',
    subtopics: [
      {
        id: 'pythagoras-trig',
        title: 'Pythagoras and Right-Angled Trigonometry',
        lesson: { sections: [{ title: 'SOH CAH TOA', content: 'For right-angled triangles, a² + b² = c². Trigonometric ratios: sin = Opp/Hyp, cos = Adj/Hyp, tan = Opp/Adj. These find missing sides and angles.' }] },
        flashcards: [
          { id: 'geo-f1', question: 'Pythagoras theorem?', answer: 'a² + b² = c²' },
          { id: 'geo-f2', question: 'sin(θ) equals?', answer: 'Opposite / Hypotenuse' },
        ],
        checkpointAssessment: [
          quickQuestion('geo-q1', 'If Opposite is 3 and Adjacent is 4, what is the Hypotenuse?', ['5', '6', '7', '25'], 'a'),
        ],
      },
      {
        id: 'circle-theorems',
        title: 'Circle Theorems',
        lesson: { sections: [{ title: 'Angles in Circles', content: 'Angles subtended by the same arc are equal. Angle at the centre is twice the angle at the circumference. Angle in a semicircle is a right angle.' }] },
        flashcards: [
          { id: 'geo-f3', question: 'Angle in a semicircle is?', answer: '90 degrees' },
          { id: 'geo-f4', question: 'Angle at the centre is?', answer: 'Twice the angle at the circumference' },
        ],
        checkpointAssessment: [
          quickQuestion('geo-q2', 'If the angle at the circumference is 40°, the angle at the centre from the same arc is:', ['20°', '40°', '80°', '160°'], 'c'),
        ],
      },
      {
        id: '3d-shapes',
        title: 'Surface Area and Volume of 3D Shapes',
        lesson: { sections: [{ title: 'Prisms, Pyramids, and Spheres', content: 'Volume of a prism = base area × length. Volume of a pyramid/cone = 1/3 × base area × height. Surface area is the sum of all faces.' }] },
        flashcards: [
          { id: 'geo-f5', question: 'Volume of a cylinder?', answer: 'πr²h' },
          { id: 'geo-f6', question: 'Volume of a cone compared to a cylinder of same base and height?', answer: 'One third (1/3)' },
        ],
        checkpointAssessment: [
          quickQuestion('geo-q3', 'Volume of a cuboid with dimensions 2x3x4 is:', ['9', '14', '24', '48'], 'c'),
        ],
      }
    ],
    finalAssessment: [
      quickQuestion('geo-final', 'tan(θ) is equivalent to:', ['sin(θ)/cos(θ)', 'cos(θ)/sin(θ)', '1/sin(θ)', '1/cos(θ)'], 'a'),
    ],
  },
  {
    id: 'data-prob-stats-topic',
    title: 'Data, Probability & Statistics',
    levelBand: 'secondary',
    curriculumTags: ['WAEC', 'Cambridge', 'NGSS'],
    summary: 'Analyze data representations, basic probability, and statistical distributions.',
    subtopics: [
      {
        id: 'data-representation',
        title: 'Data Representation',
        lesson: { sections: [{ title: 'Charts and Graphs', content: 'Data can be represented in histograms (continuous data), bar charts (discrete data), pie charts, and scatter graphs (correlation).' }] },
        flashcards: [
          { id: 'stat-f1', question: 'Which chart is best for continuous grouped data?', answer: 'Histogram' },
          { id: 'stat-f2', question: 'What does a scatter graph show?', answer: 'Correlation between two variables' },
        ],
        checkpointAssessment: [
          quickQuestion('stat-q1', 'In a histogram, the frequency is proportional to:', ['Height', 'Area', 'Width', 'Perimeter'], 'b'),
        ],
      },
      {
        id: 'basic-probability',
        title: 'Probability and Tree Diagrams',
        lesson: { sections: [{ title: 'Calculating Chance', content: 'P(event) = successful outcomes / total possible outcomes. Independent events: multiply probabilities (AND). Mutually exclusive events: add probabilities (OR). Tree diagrams help model multiple events.' }] },
        flashcards: [
          { id: 'stat-f3', question: 'Sum of all mutually exclusive probabilities?', answer: '1' },
          { id: 'stat-f4', question: 'Rule for independent events (AND rule)?', answer: 'Multiply probabilities' },
        ],
        checkpointAssessment: [
          quickQuestion('stat-q2', 'Probability of flipping two heads in a row with a fair coin?', ['1/2', '1/4', '1/8', '1/3'], 'b'),
        ],
      },
      {
        id: 'probability-distributions',
        title: 'Probability Distributions',
        lesson: { sections: [{ title: 'Binomial and Normal Models', content: 'A probability distribution assigns probabilities to outcomes. The binomial model applies to fixed independent trials. The normal distribution is a continuous bell-shaped curve.' }] },
        flashcards: [
          { id: 'stat-f5', question: 'Mean of binomial distribution?', answer: 'np' },
          { id: 'stat-f6', question: 'Shape of normal distribution?', answer: 'Symmetrical bell-shaped curve' },
        ],
        checkpointAssessment: [
          quickQuestion('stat-q3', 'For a distribution, the sum of all probabilities is:', ['0', '0.5', '1', '100'], 'c'),
        ],
      }
    ],
    finalAssessment: [
      quickQuestion('stat-final', 'If P(A) = 0.3 and P(B) = 0.4 (independent), P(A and B) is:', ['0.12', '0.7', '0.1', '0.8'], 'a'),
    ],
  }
];
