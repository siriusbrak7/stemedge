import { LabConfig } from './labTypes';

export const OSMOSIS_LAB: LabConfig = {
  id: 'osmosis-lab',
  title: 'Osmosis in Plant and Animal Cells',
  subject: 'biology',
  topic: 'cell-membrane-transport',
  difficulty: 'high-school',
  description: 'Investigate how different solution concentrations affect water movement across cell membranes in plant and animal cells.',
  learningObjectives: [
    'Understand the concept of osmosis and water potential',
    'Observe the effects of hypertonic, hypotonic, and isotonic solutions on cells',
    'Explain why plant cells have different responses to osmosis compared to animal cells',
    'Apply knowledge to real-world scenarios like food preservation and IV solutions',
  ],
  variables: [
    {
      id: 'solution-concentration',
      name: 'Solution Concentration',
      unit: '% NaCl',
      min: 0,
      max: 20,
      default: 5,
      step: 1,
      description: 'Salt concentration in the external solution. 0.9% is isotonic to human cells.',
    },
    {
      id: 'cell-type',
      name: 'Cell Type',
      unit: '',
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      description: '0 = Animal Cell (Red Blood Cell), 1 = Plant Cell (Elodea)',
    },
    {
      id: 'time',
      name: 'Observation Time',
      unit: 'min',
      min: 1,
      max: 60,
      default: 15,
      step: 5,
      description: 'Duration of exposure to the solution',
    },
  ],
  predictionPrompts: [
    {
      id: 'pred-1',
      question: 'What will happen to an animal cell placed in a 0% NaCl (pure water) solution?',
      type: 'multiple-choice',
      options: [
        'The cell will shrink (crenation)',
        'The cell will swell and possibly burst (lysis)',
        'The cell will stay the same size',
        'The cell will develop a cell wall',
      ],
      correctAnswer: 'The cell will swell and possibly burst (lysis)',
      explanation: 'In a hypotonic solution (lower solute concentration outside), water enters the cell by osmosis, causing it to swell and potentially burst.',
    },
    {
      id: 'pred-2',
      question: 'What will happen to a plant cell placed in a 20% NaCl (highly concentrated) solution?',
      type: 'multiple-choice',
      options: [
        'The cell will burst',
        'The cell will undergo plasmolysis (cell membrane pulls away from wall)',
        'The cell will stay the same',
        'The cell will become turgid',
      ],
      correctAnswer: 'The cell will undergo plasmolysis (cell membrane pulls away from wall)',
      explanation: 'In a hypertonic solution, water leaves the cell. The cell membrane shrinks away from the rigid cell wall, a process called plasmolysis.',
    },
    {
      id: 'pred-3',
      question: 'Predict the final mass change percentage for an animal cell in 5% NaCl solution after 15 minutes.',
      type: 'slider',
      correctAnswer: -15,
      explanation: '5% NaCl is hypertonic, so water will leave the cell, causing mass decrease.',
    },
  ],
  analysisPrompts: [
    {
      id: 'analysis-1',
      question: 'Compare your predictions with your observations. Were your predictions accurate? Explain any differences.',
      type: 'text',
      rubric: 'Student should reference specific predictions and compare with observed results, explaining scientific reasoning.',
    },
    {
      id: 'analysis-2',
      question: 'Why do plant cells respond differently to osmosis compared to animal cells? Use the terms "cell wall" and "turgor pressure" in your answer.',
      type: 'text',
      rubric: 'Answer should explain that plant cells have a rigid cell wall that prevents bursting and can develop turgor pressure when water enters.',
    },
    {
      id: 'analysis-3',
      question: 'Based on your data, what is the relationship between solution concentration and mass change? Describe the trend.',
      type: 'data-analysis',
      rubric: 'Student should identify inverse relationship: higher external concentration leads to greater mass loss (negative change).',
    },
    {
      id: 'analysis-4',
      question: 'A hospital needs to prepare an IV solution. Based on your lab results, what NaCl concentration should be used and why?',
      type: 'text',
      correctAnswer: '0.9% NaCl (isotonic)',
      rubric: 'Should identify 0.9% as isotonic to prevent cell damage.',
    },
  ],
  defaultVariables: {
    'solution-concentration': 5,
    'cell-type': 0,
    'time': 15,
  },
  trialLimit: 3,
  timeEstimate: 30,
  prerequisiteTopics: ['cell-membrane', 'diffusion'],
};

export const PHOTOSYNTHESIS_LAB: LabConfig = {
  id: 'photosynthesis-lab',
  title: 'Factors Affecting Photosynthesis Rate',
  subject: 'biology',
  topic: 'photosynthesis',
  difficulty: 'high-school',
  description: 'Investigate how light intensity, temperature, and CO2 concentration affect the rate of photosynthesis in aquatic plants.',
  learningObjectives: [
    'Understand the factors that limit photosynthesis rate',
    'Observe the production of oxygen bubbles as an indicator of photosynthesis',
    'Identify limiting factors at different environmental conditions',
    'Apply knowledge to agricultural practices and greenhouse management',
  ],
  variables: [
    {
      id: 'light-intensity',
      name: 'Light Intensity',
      unit: 'lux',
      min: 0,
      max: 10000,
      default: 5000,
      step: 500,
      description: 'Brightness of light source. Higher intensity provides more energy for photosynthesis.',
    },
    {
      id: 'temperature',
      name: 'Temperature',
      unit: '°C',
      min: 5,
      max: 45,
      default: 25,
      step: 5,
      description: 'Water temperature affecting enzyme activity in photosynthesis.',
    },
    {
      id: 'co2-concentration',
      name: 'CO₂ Concentration',
      unit: '%',
      min: 0.01,
      max: 0.1,
      default: 0.04,
      step: 0.01,
      description: 'Carbon dioxide concentration in the water.',
    },
  ],
  predictionPrompts: [
    {
      id: 'photo-pred-1',
      question: 'What will happen to the oxygen bubble production rate if light intensity is increased from 2000 to 8000 lux?',
      type: 'multiple-choice',
      options: [
        'Rate will decrease',
        'Rate will increase linearly',
        'Rate will increase then plateau',
        'Rate will stay the same',
      ],
      correctAnswer: 'Rate will increase then plateau',
      explanation: 'At low light, increasing intensity increases rate. Eventually, another factor (CO2 or temperature) becomes limiting.',
    },
    {
      id: 'photo-pred-2',
      question: 'Predict the bubble rate at 1000 lux, 25°C, 0.04% CO2.',
      type: 'slider',
      correctAnswer: 12,
      explanation: 'Low light intensity limits the rate significantly.',
    },
  ],
  analysisPrompts: [
    {
      id: 'photo-analysis-1',
      question: 'At what point did increasing light intensity no longer increase photosynthesis rate? What factor became limiting?',
      type: 'text',
      rubric: 'Student should identify the light saturation point and suggest CO2 or temperature as the new limiting factor.',
    },
    {
      id: 'photo-analysis-2',
      question: 'Why did the rate decrease at temperatures above 35°C?',
      type: 'text',
      correctAnswer: 'Enzyme denaturation',
      rubric: 'Should mention enzyme denaturation reducing the efficiency of photosynthetic enzymes.',
    },
  ],
  defaultVariables: {
    'light-intensity': 5000,
    'temperature': 25,
    'co2-concentration': 0.04,
  },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['cell-structure', 'enzymes'],
};

export const ENZYME_LAB: LabConfig = {
  id: 'enzyme-lab',
  title: 'Enzyme Activity and Environmental Factors',
  subject: 'biology',
  topic: 'enzymes',
  difficulty: 'high-school',
  description: 'Investigate how temperature and pH affect the rate of enzyme-catalyzed reactions using catalase and hydrogen peroxide.',
  learningObjectives: [
    'Understand the lock-and-key model of enzyme action',
    'Observe the effect of temperature on enzyme activity',
    'Investigate the optimal pH for enzyme function',
    'Explain enzyme denaturation and its causes',
  ],
  variables: [
    {
      id: 'temperature',
      name: 'Temperature',
      unit: '°C',
      min: 0,
      max: 80,
      default: 37,
      step: 5,
      description: 'Temperature of the reaction environment. Human enzymes work best at 37°C.',
    },
    {
      id: 'ph',
      name: 'pH Level',
      unit: '',
      min: 1,
      max: 14,
      default: 7,
      step: 1,
      description: 'Acidity or alkalinity of the solution. Catalase works best at neutral pH.',
    },
    {
      id: 'substrate-concentration',
      name: 'Substrate Concentration',
      unit: 'M',
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
      description: 'Concentration of hydrogen peroxide substrate.',
    },
  ],
  predictionPrompts: [
    {
      id: 'enzyme-pred-1',
      question: 'At what temperature will catalase show maximum activity?',
      type: 'multiple-choice',
      options: ['0°C', '20°C', '37°C', '60°C', '80°C'],
      correctAnswer: '37°C',
      explanation: 'Catalase from human sources has optimal activity at body temperature (37°C).',
    },
    {
      id: 'enzyme-pred-2',
      question: 'What will happen to the reaction rate if pH is changed from 7 to 2?',
      type: 'multiple-choice',
      options: [
        'Rate will increase',
        'Rate will decrease significantly',
        'Rate will stay the same',
        'Enzyme will become more active',
      ],
      correctAnswer: 'Rate will decrease significantly',
      explanation: 'Extreme pH changes the shape of the active site, reducing enzyme activity or causing denaturation.',
    },
  ],
  analysisPrompts: [
    {
      id: 'enzyme-analysis-1',
      question: 'Graph your results for temperature vs. reaction rate. Describe the shape of the curve and explain why it has this shape.',
      type: 'data-analysis',
      rubric: 'Should describe bell curve with optimal temperature, explaining denaturation at high temps and low kinetic energy at low temps.',
    },
    {
      id: 'enzyme-analysis-2',
      question: 'Why do enzymes stop working when denatured? Use the terms "active site" and "substrate" in your answer.',
      type: 'text',
      rubric: 'Should explain that denaturation changes the active site shape, preventing substrate binding.',
    },
  ],
  defaultVariables: {
    'temperature': 37,
    'ph': 7,
    'substrate-concentration': 1.0,
  },
  trialLimit: 5,
  timeEstimate: 30,
  prerequisiteTopics: ['proteins', 'chemical-reactions'],
};


export const PROTEIN_SYNTHESIS_LAB: LabConfig = {
  id: 'protein-synthesis-lab',
  title: 'Protein Synthesis',
  subject: 'biology',
  topic: 'genetics',
  difficulty: 'advanced',
  description: 'Transcribe DNA to mRNA and translate it into a protein chain. Observe how mutations alter the final protein.',
  learningObjectives: [
    'Transcribe a DNA template strand into mRNA using base pairing rules',
    'Translate mRNA codons into a polypeptide chain using the genetic code',
    'Predict the effect of point mutations and frameshift mutations on protein structure',
    'Explain the central dogma of molecular biology',
  ],
  variables: [
    { id: 'gene-template', name: 'Gene Template', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=HBB (normal), 1=Insulin, 2=Sickle Cell variant' },
    { id: 'mutation-type', name: 'Mutation Type', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=None, 1=Substitution, 2=Insertion, 3=Deletion' },
    { id: 'mutation-position', name: 'Mutation Position', unit: 'codon', min: 1, max: 10, default: 3, step: 1, description: 'Which codon to apply the mutation to' },
  ],
  predictionPrompts: [
    { id: 'ps-pred-1', question: 'If a substitution mutation changes codon 6 from GAG to GTG, what effect will this have on the protein?', type: 'multiple-choice', options: ['No change (silent mutation)', 'One amino acid changes (missense)', 'Protein shortens (nonsense)', 'All downstream amino acids change'], correctAnswer: 'One amino acid changes (missense)', explanation: 'GAG codes for Glutamic acid; GTG codes for Valine — a single amino acid substitution.' },
    { id: 'ps-pred-2', question: 'If one base is inserted at codon 3, what happens to all codons after position 3?', type: 'multiple-choice', options: ['They are unchanged', 'Their reading frame shifts, changing all downstream amino acids', 'Only codon 3 changes', 'The protein is not affected'], correctAnswer: 'Their reading frame shifts, changing all downstream amino acids', explanation: 'An insertion shifts the reading frame (frameshift), altering every subsequent codon.' },
  ],
  analysisPrompts: [
    { id: 'ps-analysis-1', question: 'Compare the protein produced with and without the sickle cell mutation. Why does a single amino acid change have such a large effect on red blood cell shape?', type: 'text', rubric: 'Should explain that valine is hydrophobic while glutamic acid is hydrophilic, causing haemoglobin to crystallise and cells to sickle under low O2.' },
    { id: 'ps-analysis-2', question: 'Why are frameshift mutations generally more severe than substitution mutations?', type: 'text', rubric: 'Should explain that frameshifts alter ALL downstream codons, while substitutions only affect one codon (and may be silent).' },
  ],
  defaultVariables: { 'gene-template': 0, 'mutation-type': 0, 'mutation-position': 3 },
  trialLimit: 3,
  timeEstimate: 25,
  prerequisiteTopics: ['dna-structure', 'central-dogma'],
};

export const FOOD_TESTS_LAB: LabConfig = {
  id: 'food-tests-lab',
  title: 'Food Tests: Identifying Nutrients',
  subject: 'biology',
  topic: 'nutrition',
  difficulty: 'high-school',
  description: 'Use iodine, Biuret, and Benedict reagents on food samples to identify starch, protein, and reducing sugars.',
  learningObjectives: [
    'Perform standard food tests using iodine, Biuret, and Benedict reagents',
    'Interpret colour changes to identify nutrients present',
    'Apply food test results to diagnose the composition of unknown samples',
    'Follow WAEC practical procedure for food testing',
  ],
  variables: [
    { id: 'food-sample', name: 'Food Sample', unit: '', min: 0, max: 4, default: 0, step: 1, description: '0=Bread, 1=Egg white, 2=Glucose solution, 3=Oil, 4=Milk' },
    { id: 'reagent', name: 'Reagent', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Iodine, 1=Biuret, 2=Benedict' },
    { id: 'temperature', name: 'Test Temperature', unit: '°C', min: 20, max: 100, default: 80, step: 10, description: 'Some tests require heating (Benedict)' },
  ],
  predictionPrompts: [
    { id: 'ft-pred-1', question: 'What colour change will you see when iodine is added to a food sample containing starch?', type: 'multiple-choice', options: ['Blue-black', 'Purple/violet', 'Brick-red precipitate', 'No change'], correctAnswer: 'Blue-black', explanation: 'Iodine turns blue-black in the presence of starch.' },
    { id: 'ft-pred-2', question: 'What result do you expect when Benedict reagent is added to egg white and heated?', type: 'multiple-choice', options: ['Blue-black', 'Purple/violet', 'Brick-red precipitate', 'Stays blue (negative)'], correctAnswer: 'Stays blue (negative)', explanation: 'Egg white contains protein, not reducing sugar. Benedict only tests positive for reducing sugars.' },
  ],
  analysisPrompts: [
    { id: 'ft-analysis-1', question: 'A food sample tested positive with both iodine and Biuret. What nutrients does it contain? Give an example of a food that would give this result.', type: 'text', rubric: 'Should identify starch and protein. Bread or milk could give both results.' },
    { id: 'ft-analysis-2', question: 'Why must Benedict test be heated while iodine and Biuret tests work at room temperature?', type: 'text', rubric: 'Should explain that Benedict requires heat to reduce the copper(II) sulfate to copper(I) oxide, producing the colour change.' },
  ],
  defaultVariables: { 'food-sample': 0, 'reagent': 0, 'temperature': 80 },
  trialLimit: 5,
  timeEstimate: 20,
  prerequisiteTopics: ['carbohydrates', 'proteins'],
};

export const TRANSPIRATION_LAB: LabConfig = {
  id: 'transpiration-potometer-lab',
  title: 'Transpiration and Environmental Factors',
  subject: 'biology',
  topic: 'plant-physiology',
  difficulty: 'high-school',
  description: 'Use a potometer to measure water uptake by a plant under different environmental conditions.',
  learningObjectives: [
    'Set up and read a potometer to measure transpiration rate',
    'Investigate the effect of light intensity, humidity, and wind on transpiration',
    'Explain how stomata control water loss in plants',
    'Apply knowledge to agricultural water management in Ghana',
  ],
  variables: [
    { id: 'light-intensity', name: 'Light Intensity', unit: 'lux', min: 0, max: 10000, default: 5000, step: 500, description: 'Light level affecting stomatal opening' },
    { id: 'humidity', name: 'Humidity', unit: '%', min: 20, max: 100, default: 60, step: 10, description: 'Relative humidity around the plant' },
    { id: 'temperature', name: 'Temperature', unit: '°C', min: 15, max: 40, default: 25, step: 5, description: 'Air temperature' },
  ],
  predictionPrompts: [
    { id: 'tr-pred-1', question: 'What will happen to the transpiration rate if humidity increases from 40% to 90%?', type: 'multiple-choice', options: ['Rate increases', 'Rate decreases', 'Rate stays the same', 'Rate doubles'], correctAnswer: 'Rate decreases', explanation: 'High humidity reduces the water vapour concentration gradient between leaf and air, slowing transpiration.' },
    { id: 'tr-pred-2', question: 'Predict the water uptake (cm3/hour) at 10000 lux, 40% humidity, 25C.', type: 'slider', correctAnswer: 4.5, explanation: 'High light opens stomata wide; low humidity creates a steep gradient — high transpiration rate.' },
  ],
  analysisPrompts: [
    { id: 'tr-analysis-1', question: 'Explain why increasing light intensity increases transpiration rate. Use the terms "stomata" and "guard cells" in your answer.', type: 'text', rubric: 'Should explain that light triggers guard cells to open stomata, increasing the pathway for water vapour to escape.' },
    { id: 'tr-analysis-2', question: 'A farmer in Tamale wants to reduce water loss from seedlings. Based on your results, what advice would you give about when to plant and how to protect them?', type: 'text', rubric: 'Should suggest planting in cooler parts of day, using shade, mulching, or windbreaks to reduce transpiration rates.' },
  ],
  defaultVariables: { 'light-intensity': 5000, 'humidity': 60, 'temperature': 25 },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['plant-structure', 'osmosis'],
};

export const PROJECTILE_LAB: LabConfig = {
  id: 'projectile-lab',
  title: 'Projectile Motion and Kinematics',
  subject: 'physics',
  topic: 'forces-motion',
  difficulty: 'high-school',
  description: 'Launch projectiles at different angles and velocities to investigate the relationship between launch parameters and range.',
  learningObjectives: [
    'Investigate how launch angle affects the range of a projectile',
    'Calculate the theoretical range using R = v2sin(2theta)/g',
    'Compare predicted and observed ranges to evaluate the model',
    'Identify the angle for maximum range (45 degrees in ideal conditions)',
  ],
  variables: [
    { id: 'launch-angle', name: 'Launch Angle', unit: '°', min: 10, max: 80, default: 45, step: 5, description: 'Angle of launch above horizontal' },
    { id: 'initial-velocity', name: 'Initial Velocity', unit: 'm/s', min: 5, max: 50, default: 20, step: 5, description: 'Speed at launch' },
    { id: 'mass', name: 'Projectile Mass', unit: 'kg', min: 0.1, max: 5, default: 1, step: 0.1, description: 'Mass of the projectile (affects air resistance in realistic mode)' },
  ],
  predictionPrompts: [
    { id: 'proj-pred-1', question: 'At what launch angle will a projectile travel the maximum horizontal distance (ignoring air resistance)?', type: 'multiple-choice', options: ['30°', '45°', '60°', '90°'], correctAnswer: '45°', explanation: 'R = v2sin(2theta)/g is maximised when sin(2theta) = 1, which occurs at theta = 45 degrees.' },
    { id: 'proj-pred-2', question: 'Predict the range (in metres) for a projectile launched at 20 m/s at 45 degrees (g = 9.81 m/s2).', type: 'slider', correctAnswer: 41, explanation: 'R = 20^2 * sin(90) / 9.81 = 400/9.81 = 40.8 m' },
  ],
  analysisPrompts: [
    { id: 'proj-analysis-1', question: 'Compare your predicted ranges with the observed ranges. At which angles was the prediction most accurate?', type: 'text', rubric: 'Should note predictions are most accurate at moderate angles and less accurate at extremes if air resistance is modelled.' },
    { id: 'proj-analysis-2', question: 'Why does mass NOT affect the range in the ideal (no air resistance) model? Use the equations of motion in your answer.', type: 'text', rubric: 'Should explain that horizontal and vertical accelerations (g) are independent of mass, so trajectory is the same.' },
  ],
  defaultVariables: { 'launch-angle': 45, 'initial-velocity': 20, 'mass': 1 },
  trialLimit: 5,
  timeEstimate: 20,
  prerequisiteTopics: ['kinematics', 'vectors'],
};

export const WAVE_LAB: LabConfig = {
  id: 'wave-lab',
  title: 'Wave Properties and the EM Spectrum',
  subject: 'physics',
  topic: 'waves',
  difficulty: 'high-school',
  description: 'Explore wave properties including frequency, amplitude, and wavelength across the electromagnetic spectrum.',
  learningObjectives: [
    'Investigate the relationship between frequency and wavelength (v = f*lambda)',
    'Observe the effect of amplitude on wave energy',
    'Explore different regions of the EM spectrum',
    'Apply wave equations to real-world examples like radio broadcasting',
  ],
  variables: [
    { id: 'frequency', name: 'Frequency', unit: 'Hz', min: 1, max: 100, default: 5, step: 1, description: 'Number of complete oscillations per second' },
    { id: 'amplitude', name: 'Amplitude', unit: 'cm', min: 1, max: 10, default: 5, step: 1, description: 'Maximum displacement from equilibrium' },
    { id: 'damping', name: 'Damping', unit: '', min: 0, max: 5, default: 0, step: 0.5, description: 'Energy loss per cycle — 0 = undamped' },
  ],
  predictionPrompts: [
    { id: 'wv-pred-1', question: 'If frequency is doubled from 5 Hz to 10 Hz while wave speed stays the same, what happens to wavelength?', type: 'multiple-choice', options: ['Wavelength doubles', 'Wavelength halves', 'Wavelength stays the same', 'Wavelength quadruples'], correctAnswer: 'Wavelength halves', explanation: 'v = f*lambda. If v is constant and f doubles, lambda must halve.' },
    { id: 'wv-pred-2', question: 'Predict the wavelength (in cm) for a wave with frequency 10 Hz and wave speed 50 cm/s.', type: 'slider', correctAnswer: 5, explanation: 'lambda = v/f = 50/10 = 5 cm' },
  ],
  analysisPrompts: [
    { id: 'wv-analysis-1', question: 'Citi FM broadcasts at 97.3 MHz. Using c = 3 x 10^8 m/s, calculate the wavelength and explain why radio waves can diffract around buildings but light cannot.', type: 'text', rubric: 'Should calculate lambda = 3.08 m and explain that diffraction is significant when wavelength is comparable to obstacle size.' },
    { id: 'wv-analysis-2', question: 'How does increasing damping affect the wave over time? Relate this to a real-world example.', type: 'text', rubric: 'Should describe amplitude decreasing over time. Real-world example: sound getting quieter over distance due to energy dissipation.' },
  ],
  defaultVariables: { 'frequency': 5, 'amplitude': 5, 'damping': 0 },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['wave-basics', 'em-spectrum'],
};

export const SIMPLE_PENDULUM_LAB: LabConfig = {
  id: 'simple-pendulum-lab',
  title: 'Simple Pendulum and Gravitational Acceleration',
  subject: 'physics',
  topic: 'forces-motion',
  difficulty: 'high-school',
  description: 'Measure the period of a simple pendulum at different string lengths to calculate the acceleration due to gravity.',
  learningObjectives: [
    'Measure the period of a pendulum accurately by timing multiple oscillations',
    'Investigate the relationship between string length and period (T = 2*pi*sqrt(L/g))',
    'Use experimental data to calculate g',
    'Identify sources of error in the measurement',
  ],
  variables: [
    { id: 'string-length', name: 'String Length', unit: 'm', min: 0.3, max: 2.0, default: 1.0, step: 0.1, description: 'Length of the pendulum string' },
    { id: 'bob-mass', name: 'Bob Mass', unit: 'g', min: 50, max: 300, default: 120, step: 10, description: 'Mass of the pendulum bob' },
    { id: 'oscillation-count', name: 'Oscillations to Time', unit: '', min: 5, max: 20, default: 10, step: 1, description: 'Number of complete swings to measure' },
  ],
  predictionPrompts: [
    { id: 'sp-pred-1', question: 'If the string length is doubled from 0.5 m to 1.0 m, what happens to the period T?', type: 'multiple-choice', options: ['T doubles', 'T increases by sqrt(2)', 'T halves', 'T stays the same'], correctAnswer: 'T increases by sqrt(2)', explanation: 'T = 2*pi*sqrt(L/g). If L doubles, T increases by sqrt(2) = 1.41.' },
    { id: 'sp-pred-2', question: 'Does the mass of the bob affect the period of a simple pendulum?', type: 'multiple-choice', options: ['Yes — heavier bobs swing slower', 'Yes — heavier bobs swing faster', 'No — mass does not appear in the formula', 'Only at very large masses'], correctAnswer: 'No — mass does not appear in the formula', explanation: 'T = 2*pi*sqrt(L/g). Mass is not in the equation, so it does not affect the period.' },
  ],
  analysisPrompts: [
    { id: 'sp-analysis-1', question: 'Calculate g from your best data point using g = 4*pi^2*L/T^2. How does your value compare with 9.81 m/s2?', type: 'data-analysis', rubric: 'Should show calculation and compare with 9.81, discussing measurement errors.' },
    { id: 'sp-analysis-2', question: 'Why is it better to time 10 oscillations rather than 1? Explain in terms of measurement uncertainty.', type: 'text', rubric: 'Should explain that timing 10 reduces the percentage error in both timing and counting, improving precision.' },
  ],
  defaultVariables: { 'string-length': 1.0, 'bob-mass': 120, 'oscillation-count': 10 },
  trialLimit: 5,
  timeEstimate: 20,
  prerequisiteTopics: ['kinematics', 'forces'],
};

export const HOOKES_LAW_LAB: LabConfig = {
  id: 'hookes-law-lab',
  title: "Hooke's Law and Spring Constants",
  subject: 'physics',
  topic: 'forces-motion',
  difficulty: 'high-school',
  description: "Investigate the relationship between force and extension for a spring, and determine its spring constant.",
  learningObjectives: [
    "State and apply Hooke's Law (F = kx)",
    'Determine the spring constant from a force-extension graph',
    'Identify the limit of proportionality and elastic limit',
    'Distinguish between elastic and plastic deformation',
  ],
  variables: [
    { id: 'spring-constant', name: 'Spring Constant k', unit: 'N/m', min: 10, max: 200, default: 50, step: 10, description: 'Stiffness of the spring' },
    { id: 'mass', name: 'Hanging Mass', unit: 'g', min: 50, max: 500, default: 100, step: 50, description: 'Mass attached to the spring' },
  ],
  predictionPrompts: [
    { id: 'hl-pred-1', question: 'A spring with k = 50 N/m is extended by 0.04 m. What is the force applied?', type: 'multiple-choice', options: ['0.5 N', '2.0 N', '5.0 N', '12.5 N'], correctAnswer: '2.0 N', explanation: 'F = kx = 50 * 0.04 = 2.0 N' },
    { id: 'hl-pred-2', question: 'What happens to the extension if the mass is doubled (within the proportional limit)?', type: 'multiple-choice', options: ['Extension doubles', 'Extension halves', 'Extension stays the same', 'Extension quadruples'], correctAnswer: 'Extension doubles', explanation: 'Within the proportional limit, F is proportional to x. Doubling the force (by doubling mass) doubles the extension.' },
  ],
  analysisPrompts: [
    { id: 'hl-analysis-1', question: 'From your force-extension graph, how can you determine the spring constant? What is the significance of the gradient?', type: 'text', rubric: 'Should explain that gradient = k (spring constant). The gradient of the linear region gives the spring constant.' },
    { id: 'hl-analysis-2', question: 'What happens to the spring when the force exceeds the limit of proportionality? Why must engineers know this value?', type: 'text', rubric: 'Should explain that beyond the limit, the spring deforms permanently (plastic deformation). Engineers need to know this to design safe structures.' },
  ],
  defaultVariables: { 'spring-constant': 50, 'mass': 100 },
  trialLimit: 4,
  timeEstimate: 20,
  prerequisiteTopics: ['forces', 'graphs'],
};

export const REACTION_LAB: LabConfig = {
  id: 'reaction-lab',
  title: 'Chemical Reactions: Acids and Bases',
  subject: 'chemistry',
  topic: 'reactions',
  difficulty: 'high-school',
  description: 'Observe reactions between acids and bases, carbonates, and metals. Monitor pH, temperature, and gas production.',
  learningObjectives: [
    'Observe neutralisation reactions between acids and bases',
    'Identify the products of acid-carbonate and acid-metal reactions',
    'Measure temperature changes in exothermic and endothermic reactions',
    'Follow WAEC practical procedures for acid reactions',
  ],
  variables: [
    { id: 'acid-concentration', name: 'Acid Concentration', unit: 'M', min: 0.5, max: 3.0, default: 1.0, step: 0.5, description: 'Concentration of hydrochloric acid' },
    { id: 'temperature', name: 'Reaction Temperature', unit: '°C', min: 20, max: 80, default: 25, step: 10, description: 'Temperature of the reaction mixture' },
    { id: 'reaction-type', name: 'Reaction Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Neutralisation, 1=Acid+Carbonate, 2=Metal+Acid' },
  ],
  predictionPrompts: [
    { id: 'rx-pred-1', question: 'What gas is produced when hydrochloric acid reacts with calcium carbonate?', type: 'multiple-choice', options: ['Hydrogen', 'Oxygen', 'Carbon dioxide', 'Chlorine'], correctAnswer: 'Carbon dioxide', explanation: 'Acid + carbonate produces salt + water + CO2. Limewater turns milky with CO2.' },
    { id: 'rx-pred-2', question: 'Will the neutralisation reaction be exothermic or endothermic?', type: 'multiple-choice', options: ['Exothermic (temperature rises)', 'Endothermic (temperature falls)', 'No temperature change', 'Depends on the acid'], correctAnswer: 'Exothermic (temperature rises)', explanation: 'Neutralisation reactions release heat energy — they are exothermic.' },
  ],
  analysisPrompts: [
    { id: 'rx-analysis-1', question: 'How does increasing acid concentration affect the reaction rate? Explain using collision theory.', type: 'text', rubric: 'Should explain that higher concentration means more particles per unit volume, increasing collision frequency and reaction rate.' },
    { id: 'rx-analysis-2', question: 'Write balanced equations for all three reaction types you tested.', type: 'text', rubric: 'Should provide: NaOH + HCl -> NaCl + H2O; CaCO3 + 2HCl -> CaCl2 + H2O + CO2; Zn + 2HCl -> ZnCl2 + H2' },
  ],
  defaultVariables: { 'acid-concentration': 1.0, 'temperature': 25, 'reaction-type': 0 },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['acids-bases', 'chemical-equations'],
};

export const STOICHIOMETRY_LAB: LabConfig = {
  id: 'stoichiometry-lab',
  title: 'Stoichiometry Factory: Moles and Yield',
  subject: 'chemistry',
  topic: 'quantitative-chemistry',
  difficulty: 'advanced',
  description: 'Calculate moles, identify limiting reagents, and optimise product yield in a virtual chemical factory.',
  learningObjectives: [
    'Calculate the number of moles from mass and molar mass',
    'Identify the limiting reagent from molar ratios',
    'Calculate theoretical yield and percentage yield',
    'Apply stoichiometry to optimise industrial chemical processes',
  ],
  variables: [
    { id: 'reactant-a-moles', name: 'Reactant A Moles', unit: 'mol', min: 0.5, max: 5.0, default: 2.0, step: 0.5, description: 'Amount of first reactant' },
    { id: 'reactant-b-moles', name: 'Reactant B Moles', unit: 'mol', min: 0.5, max: 5.0, default: 3.0, step: 0.5, description: 'Amount of second reactant' },
    { id: 'reaction-efficiency', name: 'Process Efficiency', unit: '%', min: 50, max: 100, default: 85, step: 5, description: 'Percentage yield of the process' },
  ],
  predictionPrompts: [
    { id: 'st-pred-1', question: 'In the reaction 2A + B -> 2C, if you have 3 mol A and 2 mol B, which is the limiting reagent?', type: 'multiple-choice', options: ['Reactant A', 'Reactant B', 'Neither — they are in exact ratio', 'Cannot be determined'], correctAnswer: 'Reactant A', explanation: '3 mol A requires 1.5 mol B. Since 2 mol B is available, A is the limiting reagent.' },
    { id: 'st-pred-2', question: 'Predict the moles of product C formed from 3 mol A and 2 mol B in 2A + B -> 2C.', type: 'slider', correctAnswer: 3, explanation: '3 mol A (limiting) produces 3 mol C (1:1 ratio of A:C).' },
  ],
  analysisPrompts: [
    { id: 'st-analysis-1', question: 'Explain why the limiting reagent determines the maximum amount of product. What happens to the excess reagent?', type: 'text', rubric: 'Should explain that the reaction stops when one reactant is used up. The excess remains unreacted.' },
    { id: 'st-analysis-2', question: 'In Ghanaian cement production (CaCO3 -> CaO + CO2), why is it important to use the correct proportions of reactants?', type: 'text', rubric: 'Should discuss cost efficiency, minimising waste, and environmental impact of excess CO2.' },
  ],
  defaultVariables: { 'reactant-a-moles': 2.0, 'reactant-b-moles': 3.0, 'reaction-efficiency': 85 },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['mole-concept', 'balancing-equations'],
};

export const ACID_BASE_TITRATION_LAB: LabConfig = {
  id: 'acid-base-titration-lab',
  title: 'Acid-Base Titration',
  subject: 'chemistry',
  topic: 'quantitative-chemistry',
  difficulty: 'high-school',
  description: 'Perform a titration to determine the concentration of an unknown acid or base using a standard solution.',
  learningObjectives: [
    'Set up a titration apparatus correctly',
    'Read a burette to 0.05 cm3 precision',
    'Calculate the concentration of an unknown solution using titration data',
    'Identify the equivalence point using an indicator',
  ],
  variables: [
    { id: 'acid-concentration', name: 'Acid Concentration', unit: 'M', min: 0.05, max: 0.5, default: 0.1, step: 0.05, description: 'Concentration of the unknown acid' },
    { id: 'base-volume', name: 'Base Volume Added', unit: 'cm3', min: 0, max: 50, default: 25, step: 0.5, description: 'Volume of base added from burette' },
    { id: 'indicator', name: 'Indicator', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Phenolphthalein, 1=Methyl orange, 2=Universal indicator' },
  ],
  predictionPrompts: [
    { id: 'ab-pred-1', question: 'What colour change will phenolphthalein show at the equivalence point of a strong acid-strong base titration?', type: 'multiple-choice', options: ['Colourless to pink', 'Pink to colourless', 'Yellow to red', 'Blue to yellow'], correctAnswer: 'Colourless to pink', explanation: 'Phenolphthalein is colourless in acid and turns pink in base. At the equivalence point, the solution becomes slightly basic.' },
    { id: 'ab-pred-2', question: 'If 25.0 cm3 of 0.1 M NaOH neutralises 20.0 cm3 of HCl, what is the concentration of the HCl?', type: 'slider', correctAnswer: 0.125, explanation: 'C1V1 = C2V2: 0.1 * 25 = C2 * 20, so C2 = 0.125 M' },
  ],
  analysisPrompts: [
    { id: 'ab-analysis-1', question: 'Why is it important to wash the burette with the solution it will contain before filling it?', type: 'text', rubric: 'Should explain that residual water would dilute the solution, giving inaccurate results.' },
    { id: 'ab-analysis-2', question: 'A WAEC titration question gives these results: 24.80, 24.50, 24.60 cm3. Calculate the mean titre and explain why you might discard one reading.', type: 'data-analysis', rubric: 'Should calculate mean of concordant results (24.50 and 24.60 = 24.55). 24.80 is discarded as it is not concordant (differs by > 0.10 cm3).' },
  ],
  defaultVariables: { 'acid-concentration': 0.1, 'base-volume': 25, 'indicator': 0 },
  trialLimit: 4,
  timeEstimate: 30,
  prerequisiteTopics: ['acids-bases', 'mole-concept'],
};

export const RATE_OF_REACTION_LAB: LabConfig = {
  id: 'rate-of-reaction-lab',
  title: 'Rate of Reaction: Factors and Measurement',
  subject: 'chemistry',
  topic: 'kinetics',
  difficulty: 'high-school',
  description: 'Investigate how temperature, concentration, and surface area affect the rate of reaction between marble chips and HCl.',
  learningObjectives: [
    'Measure reaction rate using gas collection',
    'Investigate the effect of temperature on reaction rate',
    'Investigate the effect of concentration on reaction rate',
    'Explain trends using collision theory',
  ],
  variables: [
    { id: 'temperature', name: 'Temperature', unit: '°C', min: 20, max: 80, default: 25, step: 5, description: 'Temperature of the HCl solution' },
    { id: 'concentration', name: 'HCl Concentration', unit: 'M', min: 0.5, max: 3.0, default: 1.0, step: 0.5, description: 'Concentration of hydrochloric acid' },
    { id: 'surface-area', name: 'Surface Area', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Large chips, 1=Small chips, 2=Powdered' },
  ],
  predictionPrompts: [
    { id: 'rr-pred-1', question: 'If the temperature is increased from 25C to 55C, what will happen to the reaction rate?', type: 'multiple-choice', options: ['Rate approximately doubles', 'Rate approximately triples', 'Rate decreases', 'Rate stays the same'], correctAnswer: 'Rate approximately doubles', explanation: 'As a rough rule, rate doubles for every 10C rise in temperature.' },
    { id: 'rr-pred-2', question: 'Which will react faster: large marble chips or powdered CaCO3 of the same mass?', type: 'multiple-choice', options: ['Large chips', 'Powdered CaCO3', 'Same rate', 'Depends on temperature'], correctAnswer: 'Powdered CaCO3', explanation: 'Powder has much larger surface area, allowing more particles to collide simultaneously.' },
  ],
  analysisPrompts: [
    { id: 'rr-analysis-1', question: 'Draw a graph of gas volume vs time for the reaction at 25C and at 55C. What is the same and what is different about the two curves?', type: 'text', rubric: 'Should describe same final volume (same amount of reactant) but steeper initial gradient at 55C (faster rate).' },
    { id: 'rr-analysis-2', question: 'Use collision theory to explain why increasing concentration increases the rate of reaction.', type: 'text', rubric: 'Should explain that more particles per unit volume means more frequent collisions, increasing the chance of successful collisions per second.' },
  ],
  defaultVariables: { 'temperature': 25, 'concentration': 1.0, 'surface-area': 0 },
  trialLimit: 4,
  timeEstimate: 25,
  prerequisiteTopics: ['collision-theory', 'chemical-equations'],
};

export const GRAPH_CHALLENGE_LAB: LabConfig = {
  id: 'graph-challenge-lab',
  title: 'Graph Challenge: Equations and Gradients',
  subject: 'math',
  topic: 'linear-equations',
  difficulty: 'high-school',
  description: 'Identify gradients, intercepts, and equations from graphs in a timed challenge format.',
  learningObjectives: [
    'Read the gradient from a linear graph',
    'Identify the y-intercept of a straight line',
    'Match equations to their graphs',
    'Solve problems involving parallel and perpendicular lines',
  ],
  variables: [
    { id: 'difficulty', name: 'Difficulty Level', unit: '', min: 1, max: 5, default: 3, step: 1, description: '1=Easy (integer gradients) to 5=Hard (fractional, parallel lines)' },
    { id: 'equation-type', name: 'Equation Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=y=mx+c, 1=Ax+By=C, 2=Mixed' },
  ],
  predictionPrompts: [
    { id: 'gc-pred-1', question: 'A line has gradient 2 and passes through (0, 3). What is its equation?', type: 'multiple-choice', options: ['y = 2x + 3', 'y = 3x + 2', 'y = 2x - 3', 'y = -2x + 3'], correctAnswer: 'y = 2x + 3', explanation: 'y = mx + c where m = 2, c = 3.' },
    { id: 'gc-pred-2', question: 'What is the gradient of a line parallel to y = -3x + 7?', type: 'slider', correctAnswer: -3, explanation: 'Parallel lines have the same gradient.' },
  ],
  analysisPrompts: [
    { id: 'gc-analysis-1', question: 'Explain how to find the gradient of a line from its graph without knowing the equation.', type: 'text', rubric: 'Should describe rise/run method: choose two points, calculate (change in y)/(change in x).' },
    { id: 'gc-analysis-2', question: 'A WAEC question asks: "Find the equation of the line passing through (2, 5) and (4, 11)." Show your working.', type: 'text', rubric: 'Should calculate m = (11-5)/(4-2) = 3, then substitute to find c = -1, giving y = 3x - 1.' },
  ],
  defaultVariables: { 'difficulty': 3, 'equation-type': 0 },
  trialLimit: 5,
  timeEstimate: 15,
  prerequisiteTopics: ['coordinates', 'gradients'],
};

export const PARABOLA_LAB: LabConfig = {
  id: 'parabola-lab',
  title: 'Parabola Architect: Roots and Vertices',
  subject: 'math',
  topic: 'quadratics',
  difficulty: 'high-school',
  description: 'Design parabolas by choosing coefficients, find roots and vertices, and apply quadratics to bridge design.',
  learningObjectives: [
    'Understand how the coefficients a, b, c affect the parabola shape',
    'Find the vertex and axis of symmetry of a parabola',
    'Determine roots from the graph and algebraically',
    'Apply quadratic functions to real-world problems',
  ],
  variables: [
    { id: 'a-coefficient', name: 'Coefficient a', unit: '', min: -5, max: 5, default: 1, step: 0.5, description: 'Controls the width and direction of the parabola' },
    { id: 'b-coefficient', name: 'Coefficient b', unit: '', min: -10, max: 10, default: 0, step: 1, description: 'Controls the horizontal position of the vertex' },
    { id: 'c-coefficient', name: 'Coefficient c (y-intercept)', unit: '', min: -10, max: 10, default: 0, step: 1, description: 'Where the parabola crosses the y-axis' },
  ],
  predictionPrompts: [
    { id: 'pl-pred-1', question: 'If a = -2, the parabola will:', type: 'multiple-choice', options: ['Open upward (U-shape)', 'Open downward (inverted-U shape)', 'Be a horizontal line', 'Have no real roots'], correctAnswer: 'Open downward (inverted-U shape)', explanation: 'When a < 0, the parabola opens downward.' },
    { id: 'pl-pred-2', question: 'For y = x2 - 4, what are the roots?', type: 'multiple-choice', options: ['x = 2 and x = -2', 'x = 4 and x = -4', 'x = 0', 'No real roots'], correctAnswer: 'x = 2 and x = -2', explanation: 'Set y = 0: x2 = 4, so x = +2 or -2.' },
  ],
  analysisPrompts: [
    { id: 'pl-analysis-1', question: 'A bridge has a parabolic arch described by y = -0.5x2 + 8. Find the maximum height and the width of the arch at ground level.', type: 'text', rubric: 'Vertex at x = 0, y = 8 (max height = 8 m). Roots at x = +4 and -4, so width = 8 m.' },
    { id: 'pl-analysis-2', question: 'How does changing coefficient b while keeping a and c constant affect the vertex position?', type: 'text', rubric: 'Should explain vertex x-coordinate is -b/(2a). Increasing b moves the vertex horizontally.' },
  ],
  defaultVariables: { 'a-coefficient': 1, 'b-coefficient': 0, 'c-coefficient': 0 },
  trialLimit: 4,
  timeEstimate: 20,
  prerequisiteTopics: ['quadratic-equations', 'graphs'],
};

// ─── New Biology Labs ────────────────────────────────────────────────────────

export const MITOSIS_LAB: LabConfig = {
  id: 'mitosis-lab',
  title: 'Mitosis Stage Identifier',
  subject: 'biology',
  topic: 'cell-biology',
  difficulty: 'high-school',
  description: 'Observe cells under a virtual microscope and identify the stages of mitosis by chromosome arrangement.',
  learningObjectives: [
    'Identify prophase, metaphase, anaphase, and telophase from cell images',
    'Describe the behaviour of chromosomes and spindle fibres at each stage',
    'Explain why mitosis produces genetically identical daughter cells',
  ],
  variables: [
    { id: 'cell-sample', name: 'Cell Sample', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Onion root tip, 1=Whitefish blastula, 2=Human skin, 3=Plant meristem' },
    { id: 'magnification', name: 'Magnification', unit: 'x', min: 100, max: 1000, default: 400, step: 100, description: 'Microscope magnification level' },
  ],
  predictionPrompts: [
    { id: 'mit-pred-1', question: 'In which stage of mitosis do chromosomes align at the cell equator?', type: 'multiple-choice', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correctAnswer: 'Metaphase', explanation: 'During metaphase, chromosomes line up along the metaphase plate (cell equator) attached to spindle fibres at their centromeres.' },
    { id: 'mit-pred-2', question: 'How many chromosomes will each daughter cell have compared to the parent cell in human mitosis?', type: 'multiple-choice', options: ['Half (23)', 'Same (46)', 'Double (92)', 'Variable'], correctAnswer: 'Same (46)', explanation: 'Mitosis produces genetically identical daughter cells with the same chromosome number as the parent cell.' },
  ],
  analysisPrompts: [
    { id: 'mit-anal-1', question: 'Explain how you would distinguish between late prophase and early metaphase under a microscope.', type: 'text', rubric: 'Should mention nuclear envelope breakdown for prophase and chromosome alignment at equator for metaphase.' },
    { id: 'mit-anal-2', question: 'Why is mitosis important for wound healing? Use a Ghana context example.', type: 'text', rubric: 'Should explain that mitosis replaces damaged cells. E.g. skin cells divide to close a wound after an injury at a market stall.' },
  ],
  defaultVariables: { 'cell-sample': 0, 'magnification': 400 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const DNA_EXTRACTION_LAB: LabConfig = {
  id: 'dna-extraction-lab',
  title: 'DNA Extraction Lab',
  subject: 'biology',
  topic: 'genetics-molecular',
  difficulty: 'high-school',
  description: 'Extract DNA from fruit or vegetable samples using household chemicals and observe the precipitated DNA.',
  learningObjectives: [
    'Perform a DNA extraction using salt, detergent, and alcohol',
    'Understand why each step works (lysis, precipitation, isolation)',
    'Compare DNA yield from different biological sources',
  ],
  variables: [
    { id: 'sample-type', name: 'Sample Type', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Banana, 1=Strawberry, 2=Onion, 3=Kiwi' },
    { id: 'salt-concentration', name: 'Salt Concentration', unit: 'g/L', min: 5, max: 50, default: 15, step: 5, description: 'NaCl concentration for the extraction buffer' },
    { id: 'alcohol-temp', name: 'Alcohol Temperature', unit: '°C', min: -20, max: 20, default: -5, step: 5, description: 'Cold alcohol precipitates DNA better' },
  ],
  predictionPrompts: [
    { id: 'dna-pred-1', question: 'Which sample will yield the most visible DNA?', type: 'multiple-choice', options: ['Banana (8 sets of chromosomes)', 'Strawberry (octoploid, 8x)', 'Onion (diploid, 2x)', 'Kiwi (hexaploid, 6x)'], correctAnswer: 'Strawberry (octoploid, 8x)', explanation: 'Strawberries are octoploid — they have 8 copies of each chromosome, giving more DNA per cell.' },
    { id: 'dna-pred-2', question: 'Why must the alcohol be ice-cold?', type: 'multiple-choice', options: ['Cold alcohol dissolves DNA better', 'Cold alcohol precipitates DNA while keeping proteins dissolved', 'Temperature does not matter', 'Cold alcohol kills bacteria'], correctAnswer: 'Cold alcohol precipitates DNA while keeping proteins dissolved', explanation: 'DNA is insoluble in cold alcohol but proteins and other molecules remain dissolved, allowing DNA to clump and become visible.' },
  ],
  analysisPrompts: [
    { id: 'dna-anal-1', question: 'Explain the role of the detergent (washing-up liquid) in the extraction process.', type: 'text', rubric: 'Should explain that detergent breaks down the cell membrane and nuclear envelope (lyses the cell) by dissolving the phospholipid bilayer.' },
    { id: 'dna-anal-2', question: 'At the Noguchi Memorial Institute in Ghana, DNA extraction is the first step in disease diagnosis. Why is extracting pure DNA important before PCR testing?', type: 'text', rubric: 'Should explain that PCR requires clean DNA template — contaminants (proteins, salts) can inhibit Taq polymerase, giving false negatives.' },
  ],
  defaultVariables: { 'sample-type': 0, 'salt-concentration': 15, 'alcohol-temp': -5 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const HEART_RATE_LAB: LabConfig = {
  id: 'heart-rate-lab',
  title: 'Heart Rate and Exercise Lab',
  subject: 'biology',
  topic: 'human-physiology',
  difficulty: 'high-school',
  description: 'Measure resting and exercising heart rates, investigate recovery time, and explore the cardiac cycle.',
  learningObjectives: [
    'Measure and record resting and exercising heart rates',
    'Understand how heart rate responds to physical activity',
    'Explain the cardiac cycle and its relationship to heart rate',
  ],
  variables: [
    { id: 'activity-level', name: 'Activity Level', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Resting, 1=Light (walking), 2=Moderate (jogging), 3=Vigorous (sprinting)' },
    { id: 'duration', name: 'Activity Duration', unit: 'min', min: 1, max: 15, default: 5, step: 1, description: 'How long the activity lasts' },
  ],
  predictionPrompts: [
    { id: 'hr-pred-1', question: 'What happens to heart rate during vigorous exercise compared to rest?', type: 'multiple-choice', options: ['It decreases to conserve energy', 'It increases to deliver more oxygen to muscles', 'It stays the same', 'It becomes irregular'], correctAnswer: 'It increases to deliver more oxygen to muscles', explanation: 'During exercise, muscles need more O₂ and glucose, and produce more CO₂. The heart beats faster to increase blood flow.' },
    { id: 'hr-pred-2', question: 'A fit athlete has a lower resting heart rate because:', type: 'multiple-choice', options: ['Their heart is weaker', 'Their heart pumps more blood per beat (larger stroke volume)', 'They have fewer red blood cells', 'Their arteries are narrower'], correctAnswer: 'Their heart pumps more blood per beat (larger stroke volume)', explanation: 'Athletic training increases stroke volume, so the heart needs fewer beats to deliver the same cardiac output.' },
  ],
  analysisPrompts: [
    { id: 'hr-anal-1', question: 'Plot heart rate vs activity level. Describe the relationship and explain it using the cardiac cycle (diastole and systole).', type: 'text', rubric: 'Should describe a positive correlation. At higher activity, shorter diastole means less filling time, so the heart compensates with stronger contractions.' },
    { id: 'hr-anal-2', question: 'At Korle Bu Hospital, doctors measure recovery heart rate as a fitness indicator. Explain why faster recovery indicates better cardiovascular fitness.', type: 'text', rubric: 'Should explain that fitter people clear lactic acid and CO₂ faster, so their heart rate returns to resting levels sooner after exercise.' },
  ],
  defaultVariables: { 'activity-level': 0, 'duration': 5 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const ECOSYSTEM_ENERGY_LAB: LabConfig = {
  id: 'ecosystem-energy-lab',
  title: 'Ecosystem Energy Flow Lab',
  subject: 'biology',
  topic: 'human-physiology',
  difficulty: 'high-school',
  description: 'Model energy transfer through trophic levels in a Ghanaian savanna ecosystem and calculate efficiency.',
  learningObjectives: [
    'Understand energy flow from producers to top consumers',
    'Calculate ecological efficiency between trophic levels',
    'Explain why food chains rarely exceed 4-5 trophic levels',
  ],
  variables: [
    { id: 'producer-energy', name: 'Producer Energy Input', unit: 'kJ', min: 1000, max: 50000, default: 10000, step: 1000, description: 'Solar energy captured by producers (grass)' },
    { id: 'transfer-efficiency', name: 'Transfer Efficiency', unit: '%', min: 5, max: 25, default: 10, step: 1, description: 'Percentage of energy transferred between trophic levels' },
  ],
  predictionPrompts: [
    { id: 'eco-pred-1', question: 'If producers capture 10,000 kJ and transfer efficiency is 10%, how much energy reaches the tertiary consumer (3rd trophic level)?', type: 'multiple-choice', options: ['1,000 kJ', '100 kJ', '10 kJ', '1 kJ'], correctAnswer: '10 kJ', explanation: 'Each level keeps 10%: Primary=1000 kJ, Secondary=100 kJ, Tertiary=10 kJ.' },
    { id: 'eco-pred-2', question: 'Why do food chains rarely exceed 4-5 trophic levels?', type: 'multiple-choice', options: ['Not enough species exist', 'Energy loss at each level leaves too little to sustain higher levels', 'Predators always eat producers', 'Decomposers break the chain'], correctAnswer: 'Energy loss at each level leaves too little to sustain higher levels', explanation: 'With ~10% efficiency per level, energy diminishes rapidly. By level 5, only ~0.01% of the original energy remains.' },
  ],
  analysisPrompts: [
    { id: 'eco-anal-1', question: 'In Mole National Park, grass captures solar energy and supports herbivores (kob, buffalo) and carnivores (lions). Calculate how many kJ reach a lion if grass captures 20,000 kJ and efficiency is 10%.', type: 'text', rubric: 'Grass→Herbivore=2000 kJ→Carnivore=200 kJ. The lion receives approximately 200 kJ.' },
    { id: 'eco-anal-2', question: 'Explain why eating at a lower trophic level (more plants, less meat) can feed more people with the same land area.', type: 'text', rubric: 'Should explain that eating producers directly captures more energy than eating consumers, since only ~10% transfers per level. This has implications for food security in Ghana.' },
  ],
  defaultVariables: { 'producer-energy': 10000, 'transfer-efficiency': 10 },
  trialLimit: 3,
  timeEstimate: 15,
};

export const BIODIVERSITY_LAB: LabConfig = {
  id: 'biodiversity-lab',
  title: 'Biodiversity Sampling Lab',
  subject: 'biology',
  topic: 'human-physiology',
  difficulty: 'high-school',
  description: 'Use quadrat sampling to estimate species richness and biodiversity index in different Ghanaian habitats.',
  learningObjectives: [
    'Use quadrat sampling to estimate population size',
    'Calculate Simpson\'s Index of Diversity',
    'Compare biodiversity between different habitats',
  ],
  variables: [
    { id: 'habitat', name: 'Habitat Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Rainforest (Kakum), 1=Savanna (Mole), 2=Urban (Accra)' },
    { id: 'quadrat-size', name: 'Quadrat Size', unit: 'm²', min: 1, max: 10, default: 1, step: 1, description: 'Area of each quadrat sample' },
  ],
  predictionPrompts: [
    { id: 'bio-pred-1', question: 'Which habitat will have the highest Simpson\'s Diversity Index?', type: 'multiple-choice', options: ['Rainforest (Kakum)', 'Savanna (Mole)', 'Urban (Accra)', 'They will all be equal'], correctAnswer: 'Rainforest (Kakum)', explanation: 'Tropical rainforests have the highest biodiversity on Earth due to stable climate, abundant rainfall, and complex structure providing many niches.' },
    { id: 'bio-pred-2', question: 'Increasing quadrat size generally leads to:', type: 'multiple-choice', options: ['Fewer species found', 'More representative sampling', 'Lower diversity index', 'No change in results'], correctAnswer: 'More representative sampling', explanation: 'Larger quadrats sample more area, capturing more species and giving better estimates of true biodiversity.' },
  ],
  analysisPrompts: [
    { id: 'bio-anal-1', question: 'Calculate Simpson\'s Index for your data using D = 1 - Σ(n/N)². What does a value close to 1 indicate?', type: 'text', rubric: 'D close to 1 indicates high diversity (many species, evenly distributed). D close to 0 indicates low diversity (few species, dominated by one).' },
    { id: 'bio-anal-2', question: 'Ghana\'s Atewa Forest is threatened by bauxite mining. Explain how biodiversity sampling data could inform conservation decisions.', type: 'text', rubric: 'Should explain that high diversity indices demonstrate ecological value, supporting arguments for protected status. Baseline data allows monitoring of mining impacts.' },
  ],
  defaultVariables: { 'habitat': 0, 'quadrat-size': 1 },
  trialLimit: 3,
  timeEstimate: 20,
};

export const PHOTOSYNTHESIS_RATE_LAB: LabConfig = {
  id: 'photosynthesis-rate-lab',
  title: 'Photosynthesis Rate Lab',
  subject: 'biology',
  topic: 'cell-biology',
  difficulty: 'high-school',
  description: 'Investigate how light intensity, CO₂ concentration, and temperature affect the rate of photosynthesis using an Elodea bubble-count method.',
  learningObjectives: [
    'Measure photosynthesis rate by counting oxygen bubbles',
    'Understand the limiting factors of photosynthesis',
    'Identify the light saturation point and optimal temperature',
  ],
  variables: [
    { id: 'light-intensity', name: 'Light Intensity', unit: '%', min: 0, max: 100, default: 50, step: 5, description: 'Percentage of maximum light intensity' },
    { id: 'co2-concentration', name: 'CO₂ Concentration', unit: '%', min: 0.01, max: 0.1, default: 0.04, step: 0.01, description: 'Carbon dioxide concentration in water' },
    { id: 'temperature', name: 'Temperature', unit: '°C', min: 5, max: 45, default: 25, step: 5, description: 'Water temperature around the Elodea' },
  ],
  predictionPrompts: [
    { id: 'ps-pred-1', question: 'What happens to the photosynthesis rate when light intensity increases from low to moderate?', type: 'multiple-choice', options: ['Rate increases proportionally', 'Rate decreases', 'Rate stays the same', 'Rate increases then plateaus'], correctAnswer: 'Rate increases proportionally', explanation: 'At low light, light is the limiting factor, so increasing it directly increases rate. At high light, other factors (CO₂, temperature) become limiting.' },
    { id: 'ps-pred-2', question: 'At what temperature does photosynthesis rate typically peak for Elodea?', type: 'multiple-choice', options: ['15°C', '25°C', '35°C', '45°C'], correctAnswer: '25°C', explanation: 'Most enzyme-catalysed reactions in plants peak around 25-30°C. Above 35°C, enzymes denature and rate drops sharply.' },
  ],
  analysisPrompts: [
    { id: 'ps-anal-1', question: 'Plot photosynthesis rate vs light intensity. Explain why the curve eventually levels off (plateaus).', type: 'text', rubric: 'Should describe an initial linear increase then plateau. At high light, another factor (CO₂ or temperature) becomes limiting — the law of limiting factors.' },
    { id: 'ps-anal-2', question: 'Cocoa farming in Ghana relies on shade trees. Explain how understanding limiting factors helps farmers decide how much shade to provide.', type: 'text', rubric: 'Should explain that too much shade limits light (reducing photosynthesis), but some shade prevents overheating above the optimal temperature. Balance is key.' },
  ],
  defaultVariables: { 'light-intensity': 50, 'co2-concentration': 0.04, 'temperature': 25 },
  trialLimit: 4,
  timeEstimate: 20,
};

// ─── New Physics Labs ────────────────────────────────────────────────────────

export const CIRCUIT_LAB: LabConfig = {
  id: 'circuit-lab',
  title: 'Ohm\'s Law and Circuit Lab',
  subject: 'physics',
  topic: 'electromagnetism',
  difficulty: 'high-school',
  description: 'Build series and parallel circuits, measure voltage and current, and verify Ohm\'s Law (V = IR).',
  learningObjectives: [
    'Verify Ohm\'s Law by measuring V and I for a resistor',
    'Compare series and parallel circuit characteristics',
    'Calculate total resistance for series and parallel combinations',
  ],
  variables: [
    { id: 'resistance', name: 'Resistance', unit: 'Ω', min: 10, max: 1000, default: 100, step: 10, description: 'Resistor value' },
    { id: 'voltage', name: 'Battery Voltage', unit: 'V', min: 1, max: 24, default: 9, step: 1, description: 'EMF of the power supply' },
    { id: 'circuit-type', name: 'Circuit Type', unit: '', min: 0, max: 1, default: 0, step: 1, description: '0=Series, 1=Parallel' },
  ],
  predictionPrompts: [
    { id: 'circ-pred-1', question: 'In a series circuit with two 100 Ω resistors and a 9V battery, what is the current?', type: 'multiple-choice', options: ['0.09 A', '0.045 A', '0.18 A', '9 A'], correctAnswer: '0.045 A', explanation: 'Total R = 200 Ω, I = V/R = 9/200 = 0.045 A.' },
    { id: 'circ-pred-2', question: 'In a parallel circuit, adding another resistor branch will:', type: 'multiple-choice', options: ['Increase total resistance', 'Decrease total resistance', 'Not change total resistance', 'Blow the fuse'], correctAnswer: 'Decrease total resistance', explanation: 'Parallel branches provide additional paths for current, reducing total resistance (1/R_total = 1/R1 + 1/R2 + ...).' },
  ],
  analysisPrompts: [
    { id: 'circ-anal-1', question: 'Plot V vs I for your resistor. Does it follow Ohm\'s Law? How can you tell from the graph?', type: 'text', rubric: 'Should describe a straight line through the origin, confirming V = IR. The gradient equals the resistance.' },
    { id: 'circ-anal-2', question: 'Ghana\'s national grid uses high voltage (161 kV) for long-distance transmission from Akosombo Dam. Explain why high voltage reduces energy loss, using P = I²R.', type: 'text', rubric: 'Should explain that for a given power P = VI, higher V means lower I, and since power loss in wires = I²R, lower I means much less energy wasted as heat.' },
  ],
  defaultVariables: { 'resistance': 100, 'voltage': 9, 'circuit-type': 0 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const CONVEX_LENS_LAB: LabConfig = {
  id: 'convex-lens-lab',
  title: 'Convex Lens and Image Formation Lab',
  subject: 'physics',
  topic: 'waves-optics',
  difficulty: 'high-school',
  description: 'Place objects at different distances from a convex lens and observe image formation. Verify the thin lens equation.',
  learningObjectives: [
    'Determine the focal length of a convex lens',
    'Verify the thin lens equation: 1/f = 1/u + 1/v',
    'Describe how image characteristics change with object distance',
  ],
  variables: [
    { id: 'object-distance', name: 'Object Distance (u)', unit: 'cm', min: 5, max: 50, default: 30, step: 1, description: 'Distance from object to lens' },
    { id: 'focal-length', name: 'Focal Length (f)', unit: 'cm', min: 5, max: 20, default: 10, step: 1, description: 'Focal length of the convex lens' },
  ],
  predictionPrompts: [
    { id: 'lens-pred-1', question: 'When the object is placed at 2f from a convex lens, the image will be:', type: 'multiple-choice', options: ['Virtual, upright, magnified', 'Real, inverted, same size', 'Real, inverted, magnified', 'Real, inverted, diminished'], correctAnswer: 'Real, inverted, same size', explanation: 'At u = 2f, v = 2f and the image is the same size as the object, real and inverted.' },
    { id: 'lens-pred-2', question: 'When the object is between the lens and the focal point (u < f), the image is:', type: 'multiple-choice', options: ['Real and inverted', 'Virtual, upright, and magnified', 'No image forms', 'Real and upright'], correctAnswer: 'Virtual, upright, and magnified', explanation: 'When u < f, the rays diverge after the lens. Extending them backward gives a virtual, upright, magnified image — this is how a magnifying glass works.' },
  ],
  analysisPrompts: [
    { id: 'lens-anal-1', question: 'Use your data to verify the thin lens equation (1/f = 1/u + 1/v). Calculate the percentage difference between your measured and theoretical values.', type: 'text', rubric: 'Should show calculation with 1/f calculated from 1/u + 1/v and compare to the known f. Small percentage difference confirms the equation.' },
    { id: 'lens-anal-2', question: 'At Cape Coast, fishermen use concave mirrors to start fires from sunlight. Explain how this differs from the convex lens experiment you just performed.', type: 'text', rubric: 'Should explain that concave mirrors converge parallel rays to a focal point (like a convex lens), but use reflection instead of refraction. Both can concentrate sunlight to ignite material.' },
  ],
  defaultVariables: { 'object-distance': 30, 'focal-length': 10 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const SPECIFIC_HEAT_LAB: LabConfig = {
  id: 'specific-heat-lab',
  title: 'Specific Heat Capacity Lab',
  subject: 'physics',
  topic: 'forces-motion',
  difficulty: 'high-school',
  description: 'Heat different materials with the same power source and measure temperature rise to determine specific heat capacity.',
  learningObjectives: [
    'Determine specific heat capacity using the method of mixtures',
    'Compare specific heat capacities of different materials',
    'Understand why water has a high specific heat capacity and its importance',
  ],
  variables: [
    { id: 'material', name: 'Material', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Water, 1=Aluminium, 2=Copper, 3=Iron' },
    { id: 'mass', name: 'Mass', unit: 'g', min: 50, max: 500, default: 100, step: 50, description: 'Mass of the material being heated' },
    { id: 'heater-power', name: 'Heater Power', unit: 'W', min: 20, max: 100, default: 50, step: 10, description: 'Power of the immersion heater' },
  ],
  predictionPrompts: [
    { id: 'sh-pred-1', question: 'Which material will heat up the fastest (smallest temperature rise for same energy)?', type: 'multiple-choice', options: ['Water (c = 4200 J/kg°C)', 'Aluminium (c = 900 J/kg°C)', 'Copper (c = 385 J/kg°C)', 'Iron (c = 450 J/kg°C)'], correctAnswer: 'Copper (c = 385 J/kg°C)', explanation: 'Copper has the lowest specific heat capacity, meaning it needs the least energy to raise its temperature by 1°C. It heats up fastest.' },
    { id: 'sh-pred-2', question: 'Why is water used in central heating systems and car engines as a coolant?', type: 'multiple-choice', options: ['It is cheap', 'It has a high specific heat capacity so it absorbs lots of energy with small temperature rise', 'It boils easily', 'It conducts electricity'], correctAnswer: 'It has a high specific heat capacity so it absorbs lots of energy with small temperature rise', explanation: 'Water\'s high c (4200 J/kg°C) means it can absorb large amounts of heat energy while only rising a few degrees — ideal for cooling engines and heating buildings.' },
  ],
  analysisPrompts: [
    { id: 'sh-anal-1', question: 'Calculate the specific heat capacity of your material using c = E/(mΔT), where E = Pt. Compare with the accepted value.', type: 'text', rubric: 'Should show: c = (heater power × time) / (mass × temperature rise). Water should give ~4200, aluminium ~900 J/kg°C.' },
    { id: 'sh-anal-2', question: 'Ghana\'s Volta River moderates the climate near Akosombo. Explain how water\'s high specific heat capacity causes this effect.', type: 'text', rubric: 'Should explain that the large water body absorbs heat during the day (staying cool) and releases it slowly at night, reducing temperature extremes near the lake.' },
  ],
  defaultVariables: { 'material': 0, 'mass': 100, 'heater-power': 50 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const FREEFALL_LAB: LabConfig = {
  id: 'freefall-lab',
  title: 'Free Fall and g Measurement Lab',
  subject: 'physics',
  topic: 'forces-motion',
  difficulty: 'high-school',
  description: 'Drop objects from different heights and time their fall to estimate the acceleration due to gravity, g.',
  learningObjectives: [
    'Measure g by timing free-fall from known heights',
    'Use the equation s = ut + ½at² with u = 0',
    'Identify sources of error in the experiment',
  ],
  variables: [
    { id: 'height', name: 'Drop Height', unit: 'm', min: 0.5, max: 10, default: 2, step: 0.5, description: 'Height from which the object is dropped' },
    { id: 'object-type', name: 'Object Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Steel ball, 1=Tennis ball, 2=Flat paper' },
  ],
  predictionPrompts: [
    { id: 'ff-pred-1', question: 'A steel ball is dropped from 5 m. Approximately how long does it take to reach the ground? (Use g = 10 m/s²)', type: 'multiple-choice', options: ['0.5 s', '1.0 s', '1.5 s', '2.0 s'], correctAnswer: '1.0 s', explanation: 's = ½gt² → 5 = ½(10)t² → t² = 1 → t = 1.0 s.' },
    { id: 'ff-pred-2', question: 'Why will the flat paper take longer to fall than the steel ball from the same height?', type: 'multiple-choice', options: ['Gravity is weaker on paper', 'Air resistance has a much greater effect on the flat paper', 'Paper has less mass', 'Paper is affected by static electricity'], correctAnswer: 'Air resistance has a much greater effect on the flat paper', explanation: 'The flat paper has a large surface area relative to its weight, so air resistance significantly opposes its fall. The steel ball is streamlined and heavy, so air resistance is negligible.' },
  ],
  analysisPrompts: [
    { id: 'ff-anal-1', question: 'Use your data to calculate g from s = ½gt². How does your value compare with 9.8 m/s²? Explain any difference.', type: 'text', rubric: 'Should rearrange to g = 2s/t² and calculate. Likely to get a lower value due to air resistance and reaction time errors.' },
    { id: 'ff-anal-2', question: 'Galileo allegedly dropped objects from the Leaning Tower of Pisa. Design a better experiment to measure g more accurately using modern equipment.', type: 'text', rubric: 'Should suggest: electronic timing (light gates), vacuum chamber to eliminate air resistance, taller drop for less timing error, or using a pendulum (T = 2π√(L/g)).' },
  ],
  defaultVariables: { 'height': 2, 'object-type': 0 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const ELECTROMAGNET_LAB: LabConfig = {
  id: 'electromagnet-lab',
  title: 'Electromagnet Strength Lab',
  subject: 'physics',
  topic: 'electromagnetism',
  difficulty: 'high-school',
  description: 'Investigate how current, number of turns, and core material affect the strength of an electromagnet.',
  learningObjectives: [
    'Measure electromagnet strength by counting picked-up paper clips',
    'Understand the relationship between current and magnetic field',
    'Explain why an iron core strengthens an electromagnet',
  ],
  variables: [
    { id: 'current', name: 'Current', unit: 'A', min: 0.5, max: 5, default: 2, step: 0.5, description: 'Current through the coil' },
    { id: 'turns', name: 'Number of Turns', unit: '', min: 10, max: 200, default: 50, step: 10, description: 'Number of wire turns on the coil' },
    { id: 'core-material', name: 'Core Material', unit: '', min: 0, max: 2, default: 1, step: 1, description: '0=Air, 1=Soft iron, 2=Steel' },
  ],
  predictionPrompts: [
    { id: 'em-pred-1', question: 'Doubling the current through an electromagnet will:', type: 'multiple-choice', options: ['Double the magnetic field strength', 'Quadruple the field strength', 'Have no effect', 'Halve the field strength'], correctAnswer: 'Double the magnetic field strength', explanation: 'Magnetic field strength is directly proportional to current (B ∝ I). Doubling I doubles B.' },
    { id: 'em-pred-2', question: 'Which core material will produce the strongest electromagnet?', type: 'multiple-choice', options: ['Air core', 'Soft iron core', 'Steel core'], correctAnswer: 'Soft iron core', explanation: 'Soft iron is easily magnetised and demagnetised, concentrating the magnetic field lines. Steel retains magnetisation (becomes permanent), which is useful for magnets but not electromagnets.' },
  ],
  analysisPrompts: [
    { id: 'em-anal-1', question: 'Plot the number of paper clips picked up vs current. Is the relationship linear? What does this tell you about B ∝ I?', type: 'text', rubric: 'Should observe a roughly linear relationship, confirming B is proportional to I (for a solenoid).' },
    { id: 'em-anal-2', question: 'Electromagnets are used at Tema Harbour in scrap metal cranes. Explain why an electromagnet is preferred over a permanent magnet for this application.', type: 'text', rubric: 'Should explain that electromagnets can be switched on to pick up metal and off to release it, which permanent magnets cannot do. This makes loading and unloading efficient.' },
  ],
  defaultVariables: { 'current': 2, 'turns': 50, 'core-material': 1 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const RESISTIVITY_LAB: LabConfig = {
  id: 'resistivity-lab',
  title: 'Resistivity of a Wire Lab',
  subject: 'physics',
  topic: 'electromagnetism',
  difficulty: 'advanced',
  description: 'Measure the resistance of wires of different lengths, diameters, and materials to determine resistivity.',
  learningObjectives: [
    'Determine resistivity using R = ρL/A',
    'Investigate how resistance varies with wire length and cross-sectional area',
    'Compare resistivity of different metals (copper, nichrome, constantan)',
  ],
  variables: [
    { id: 'wire-length', name: 'Wire Length', unit: 'cm', min: 10, max: 200, default: 100, step: 10, description: 'Length of the wire sample' },
    { id: 'wire-diameter', name: 'Wire Diameter', unit: 'mm', min: 0.1, max: 1.0, default: 0.3, step: 0.1, description: 'Diameter (SWG) of the wire' },
    { id: 'wire-material', name: 'Wire Material', unit: '', min: 0, max: 2, default: 1, step: 1, description: '0=Copper, 1=Nichrome, 2=Constantan' },
  ],
  predictionPrompts: [
    { id: 'res-pred-1', question: 'Doubling the length of a wire will:', type: 'multiple-choice', options: ['Double the resistance', 'Halve the resistance', 'Quadruple the resistance', 'Not change resistance'], correctAnswer: 'Double the resistance', explanation: 'R = ρL/A. Resistance is directly proportional to length. Double L = double R.' },
    { id: 'res-pred-2', question: 'Nichrome wire is used in heater elements because it has:', type: 'multiple-choice', options: ['Low resistivity and low melting point', 'High resistivity and high melting point', 'Low resistivity and high melting point', 'High resistivity and low melting point'], correctAnswer: 'High resistivity and high melting point', explanation: 'High resistivity means nichrome converts more electrical energy to heat per unit length. High melting point means it can glow red-hot without melting.' },
  ],
  analysisPrompts: [
    { id: 'res-anal-1', question: 'Plot R vs L for your wire. Use the gradient and wire cross-sectional area to calculate resistivity ρ = gradient × A.', type: 'text', rubric: 'Should show: gradient = ρ/A, so ρ = gradient × A. A = π(d/2)². Copper ≈ 1.7×10⁻⁸, Nichrome ≈ 1.1×10⁻⁶ Ωm.' },
    { id: 'res-anal-2', question: 'Ghana uses aluminium overhead power lines instead of copper despite aluminium having higher resistivity. Explain why this is economically and practically sensible.', type: 'text', rubric: 'Should explain aluminium is lighter (easier to support on pylons), cheaper, and can carry the same current with a slightly thicker wire. The weight-to-conductivity ratio favours aluminium for overhead lines.' },
  ],
  defaultVariables: { 'wire-length': 100, 'wire-diameter': 0.3, 'wire-material': 1 },
  trialLimit: 4,
  timeEstimate: 20,
};

// ─── New Chemistry Labs ──────────────────────────────────────────────────────

export const FLAME_TEST_LAB: LabConfig = {
  id: 'flame-test-lab',
  title: 'Flame Test Lab',
  subject: 'chemistry',
  topic: 'atomic-periodic',
  difficulty: 'high-school',
  description: 'Dip wire loops into metal salt solutions and observe the characteristic flame colours to identify unknown ions.',
  learningObjectives: [
    'Identify metal ions by their characteristic flame colours',
    'Understand that flame colours result from electron transitions',
    'Use flame tests alongside other analytical techniques',
  ],
  variables: [
    { id: 'metal-ion', name: 'Metal Ion', unit: '', min: 0, max: 6, default: 0, step: 1, description: '0=Lithium, 1=Sodium, 2=Potassium, 3=Calcium, 4=Copper, 5=Barium, 6=Unknown' },
    { id: 'concentration', name: 'Salt Concentration', unit: 'M', min: 0.1, max: 2.0, default: 1.0, step: 0.1, description: 'Molar concentration of the salt solution' },
  ],
  predictionPrompts: [
    { id: 'ft-pred-1', question: 'What colour flame does copper(II) compounds produce?', type: 'multiple-choice', options: ['Red', 'Yellow', 'Green-blue', 'Lilac'], correctAnswer: 'Green-blue', explanation: 'Copper compounds produce a characteristic blue-green flame due to electron transitions in Cu²⁺ ions.' },
    { id: 'ft-pred-2', question: 'Why must the wire loop be cleaned in hydrochloric acid between tests?', type: 'multiple-choice', options: ['To make the wire hotter', 'To remove contamination from the previous test', 'To make colours brighter', 'To neutralise the flame'], correctAnswer: 'To remove contamination from the previous test', explanation: 'Residual ions on the wire would produce their own flame colour, giving a false result. HCl dissolves and removes any leftover metal salts.' },
  ],
  analysisPrompts: [
    { id: 'ft-anal-1', question: 'Explain, in terms of electron energy levels, why different metals produce different flame colours.', type: 'text', rubric: 'Should describe: heat excites electrons to higher energy levels; when they fall back, they emit photons with wavelengths characteristic of the energy gap. Different elements have different energy gaps, hence different colours.' },
    { id: 'ft-anal-2', question: 'At Ghana Geological Survey laboratories, flame tests help identify minerals. Explain why a flame test alone is insufficient for definitive identification and what other tests are needed.', type: 'text', rubric: 'Should explain that flame tests cannot distinguish between ions with similar colours (e.g. calcium red vs lithium red), and some ions are not detectable by flame. Should mention confirmatory tests: precipitation reactions, spectroscopy, or chromatography.' },
  ],
  defaultVariables: { 'metal-ion': 0, 'concentration': 1.0 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const ELECTROLYSIS_LAB: LabConfig = {
  id: 'electrolysis-lab',
  title: 'Electrolysis Lab',
  subject: 'chemistry',
  topic: 'atomic-periodic',
  difficulty: 'high-school',
  description: 'Set up an electrolysis cell with different electrolytes, observe products at each electrode, and verify Faraday\'s laws.',
  learningObjectives: [
    'Predict the products at the anode and cathode for different electrolytes',
    'Understand the rules for preferential discharge of ions',
    'Apply Faraday\'s First Law to calculate expected product mass',
  ],
  variables: [
    { id: 'electrolyte', name: 'Electrolyte', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Copper(II) sulfate, 1=Sodium chloride, 2=Sulfuric acid, 3=Copper(II) chloride' },
    { id: 'current', name: 'Current', unit: 'A', min: 0.1, max: 2.0, default: 0.5, step: 0.1, description: 'Current through the electrolyte' },
    { id: 'time', name: 'Time', unit: 'min', min: 5, max: 30, default: 10, step: 5, description: 'Duration of electrolysis' },
  ],
  predictionPrompts: [
    { id: 'elec-pred-1', question: 'In the electrolysis of copper(II) sulfate with copper electrodes, what forms at the cathode?', type: 'multiple-choice', options: ['Oxygen gas', 'Copper metal', 'Hydrogen gas', 'Chlorine gas'], correctAnswer: 'Copper metal', explanation: 'Cu²⁺ ions are lower in the reactivity series than H⁺, so Cu²⁺ is preferentially discharged at the cathode as copper metal.' },
    { id: 'elec-pred-2', question: 'During electrolysis of concentrated NaCl (brine), the product at the anode is:', type: 'multiple-choice', options: ['Sodium metal', 'Hydrogen gas', 'Chlorine gas', 'Oxygen gas'], correctAnswer: 'Chlorine gas', explanation: 'In concentrated NaCl, Cl⁻ ions are preferentially discharged at the anode over OH⁻, producing chlorine gas. This is the basis of the chlor-alkali industry.' },
  ],
  analysisPrompts: [
    { id: 'elec-anal-1', question: 'Use Faraday\'s First Law (m = Q × M / (z × F)) to calculate the expected mass of copper deposited when 0.5 A flows for 10 minutes. (Cu²⁺: M = 63.5, z = 2, F = 96500 C/mol)', type: 'text', rubric: 'Q = 0.5 × 600 = 300 C. m = 300 × 63.5 / (2 × 96500) = 0.0987 g ≈ 0.1 g copper.' },
    { id: 'elec-anal-2', question: 'Electroplating is used in Ghana\'s jewellery industry in Kumasi. Explain how electroplating a ring with gold works, naming the anode, cathode, and electrolyte.', type: 'text', rubric: 'Cathode = the ring (object to be plated), Anode = gold electrode, Electrolyte = gold salt solution (e.g. AuCN). Gold dissolves at anode and deposits on cathode.' },
  ],
  defaultVariables: { 'electrolyte': 0, 'current': 0.5, 'time': 10 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const CRYSTAL_LAB: LabConfig = {
  id: 'crystal-lab',
  title: 'Crystal Growing and Solubility Lab',
  subject: 'chemistry',
  topic: 'quantitative-chemistry',
  difficulty: 'high-school',
  description: 'Investigate how temperature affects solubility by growing copper sulfate crystals and plotting a solubility curve.',
  learningObjectives: [
    'Understand the relationship between temperature and solubility',
    'Plot a solubility curve from experimental data',
    'Distinguish between saturated, unsaturated, and supersaturated solutions',
  ],
  variables: [
    { id: 'solute', name: 'Solute', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Copper sulfate, 1=Potassium nitrate, 2=Sodium chloride' },
    { id: 'temperature', name: 'Temperature', unit: '°C', min: 10, max: 80, default: 25, step: 5, description: 'Temperature of the solution' },
    { id: 'water-volume', name: 'Water Volume', unit: 'mL', min: 10, max: 100, default: 50, step: 10, description: 'Volume of solvent (water)' },
  ],
  predictionPrompts: [
    { id: 'cryst-pred-1', question: 'Which solute\'s solubility increases the most with temperature?', type: 'multiple-choice', options: ['Sodium chloride (nearly flat curve)', 'Potassium nitrate (steep curve)', 'Copper sulfate (moderate curve)', 'All increase equally'], correctAnswer: 'Potassium nitrate (steep curve)', explanation: 'KNO₃ has a steep solubility curve — it dissolves much more at higher temperatures. NaCl\'s curve is nearly flat, meaning temperature barely affects its solubility.' },
    { id: 'cryst-pred-2', question: 'To grow a large single crystal, you should:', type: 'multiple-choice', options: ['Cool the solution very quickly', 'Allow very slow cooling over days', 'Heat the solution continuously', 'Stir vigorously'], correctAnswer: 'Allow very slow cooling over days', explanation: 'Slow cooling allows molecules to arrange into a regular lattice, forming large, well-shaped crystals. Rapid cooling produces many small crystals.' },
  ],
  analysisPrompts: [
    { id: 'cryst-anal-1', question: 'Plot solubility (g/100g water) vs temperature for your solute. Describe the shape of the curve and what it means practically.', type: 'text', rubric: 'Should describe the curve shape (steep for KNO₃, flat for NaCl) and explain that steeper curves mean crystallisation is easier by cooling — important for purification by recrystallisation.' },
    { id: 'cryst-anal-2', question: 'Ghana\'s salt industry at Ada produces salt by evaporating seawater. Explain how solubility principles and the flat NaCl solubility curve make this process feasible.', type: 'text', rubric: 'Should explain that NaCl\'s nearly flat solubility curve means evaporation (not cooling) is the best way to crystallise it. As water evaporates in the hot sun, the solution exceeds saturation and NaCl crystallises out.' },
  ],
  defaultVariables: { 'solute': 0, 'temperature': 25, 'water-volume': 50 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const NEUTRALIZATION_LAB: LabConfig = {
  id: 'neutralization-lab',
  title: 'Neutralization and Enthalpy Lab',
  subject: 'chemistry',
  topic: 'thermodynamics',
  difficulty: 'high-school',
  description: 'Mix acids and bases of different concentrations, measure the temperature change, and calculate the enthalpy of neutralization.',
  learningObjectives: [
    'Measure temperature change during neutralization reactions',
    'Calculate enthalpy change using Q = mcΔT',
    'Explain why the enthalpy of neutralization is approximately -57 kJ/mol for strong acid-base reactions',
  ],
  variables: [
    { id: 'acid-type', name: 'Acid Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=HCl (strong), 1=CH₃COOH (weak), 2=H₂SO₄ (strong, diprotic)' },
    { id: 'concentration', name: 'Concentration', unit: 'M', min: 0.5, max: 2.0, default: 1.0, step: 0.25, description: 'Molar concentration of both acid and base' },
    { id: 'volume', name: 'Volume', unit: 'mL', min: 25, max: 100, default: 50, step: 25, description: 'Volume of each reactant' },
  ],
  predictionPrompts: [
    { id: 'neut-pred-1', question: 'Which neutralization reaction will produce the highest temperature rise?', type: 'multiple-choice', options: ['HCl + NaOH (both strong)', 'CH₃COOH + NaOH (weak acid + strong base)', 'H₂SO₄ + NaOH (strong diprotic acid)', 'All the same'], correctAnswer: 'HCl + NaOH (both strong)', explanation: 'Strong acid + strong base gives the most exothermic value per mole of water formed. Weak acids partially dissociate, absorbing energy to ionise, giving a less exothermic result.' },
    { id: 'neut-pred-2', question: 'The enthalpy of neutralization for HCl + NaOH is approximately -57 kJ/mol. This value represents:', type: 'multiple-choice', options: ['Heat absorbed per mole of acid', 'Heat released per mole of water formed', 'Heat released per mole of NaOH', 'The bond energy of O-H bonds'], correctAnswer: 'Heat released per mole of water formed', explanation: 'The standard enthalpy of neutralization is the heat released when one mole of water is formed from H⁺ + OH⁻ → H₂O.' },
  ],
  analysisPrompts: [
    { id: 'neut-anal-1', question: 'Calculate ΔH using Q = mcΔT / n, where n is moles of water formed. Compare your value to the theoretical -57 kJ/mol and explain any difference.', type: 'text', rubric: 'Should show: Q = (total volume × 4.18 × ΔT), then ΔH = -Q/n. Expect -57 kJ/mol for strong acid+base. Weak acid gives less exothermic due to partial dissociation energy cost.' },
    { id: 'neut-anal-2', question: 'Farmers in Ghana\'s Ashanti region treat acidic soil with lime (CaO). Explain this as a neutralization reaction and why it improves crop yields.', type: 'text', rubric: 'Should explain: CaO + 2H⁺ → Ca²⁺ + H₂O. The basic lime neutralises soil acidity, raising pH to levels where nutrients like phosphorus become more available to plant roots.' },
  ],
  defaultVariables: { 'acid-type': 0, 'concentration': 1.0, 'volume': 50 },
  trialLimit: 4,
  timeEstimate: 20,
};

export const GAS_LAWS_LAB: LabConfig = {
  id: 'gas-laws-lab',
  title: 'Gas Laws Lab',
  subject: 'chemistry',
  topic: 'thermodynamics',
  difficulty: 'high-school',
  description: 'Investigate Boyle\'s Law (pressure vs volume at constant temperature) and Charles\' Law (volume vs temperature at constant pressure).',
  learningObjectives: [
    'Verify Boyle\'s Law: PV = constant at constant temperature',
    'Verify Charles\' Law: V/T = constant at constant pressure',
    'Understand the ideal gas equation PV = nRT',
  ],
  variables: [
    { id: 'gas-law', name: 'Gas Law', unit: '', min: 0, max: 1, default: 0, step: 1, description: '0=Boyle\'s Law (P vs V), 1=Charles\' Law (V vs T)' },
    { id: 'temperature', name: 'Temperature', unit: 'K', min: 273, max: 400, default: 300, step: 5, description: 'Gas temperature (for Boyle\'s Law, keep constant)' },
    { id: 'pressure', name: 'Pressure', unit: 'kPa', min: 50, max: 300, default: 101, step: 10, description: 'Gas pressure (for Charles\' Law, keep constant)' },
  ],
  predictionPrompts: [
    { id: 'gl-pred-1', question: 'According to Boyle\'s Law, if the pressure on a gas is doubled (at constant temperature), the volume will:', type: 'multiple-choice', options: ['Double', 'Halve', 'Stay the same', 'Quadruple'], correctAnswer: 'Halve', explanation: 'Boyle\'s Law: P₁V₁ = P₂V₂. If P doubles, V halves to keep PV constant.' },
    { id: 'gl-pred-2', question: 'If a gas occupies 300 mL at 300 K, what volume will it occupy at 400 K at constant pressure? (Charles\'s Law)', type: 'multiple-choice', options: ['225 mL', '300 mL', '400 mL', '600 mL'], correctAnswer: '400 mL', explanation: 'V₁/T₁ = V₂/T₂ → 300/300 = V₂/400 → V₂ = 400 mL.' },
  ],
  analysisPrompts: [
    { id: 'gl-anal-1', question: 'Plot P vs V and P vs 1/V for your Boyle\'s Law data. Which graph gives a straight line and why?', type: 'text', rubric: 'P vs V gives a hyperbola (inverse relationship). P vs 1/V gives a straight line through the origin, confirming PV = constant.' },
    { id: 'gl-anal-2', question: 'At Tema Harbour, gas cylinders are stored in cool areas for safety. Explain using Boyle\'s Law and Charles\'s Law why heating a sealed gas cylinder is dangerous.', type: 'text', rubric: 'Should explain: in a sealed cylinder, volume is fixed. Heating increases gas pressure (Gay-Lussac\'s Law: P ∝ T at constant V). If pressure exceeds the cylinder\'s rating, it can rupture explosively.' },
  ],
  defaultVariables: { 'gas-law': 0, 'temperature': 300, 'pressure': 101 },
  trialLimit: 4,
  timeEstimate: 20,
};

// ─── New Math Labs ────────────────────────────────────────────────────────────

export const LINEAR_REGRESSION_LAB: LabConfig = {
  id: 'linear-regression-lab',
  title: 'Linear Regression Lab',
  subject: 'math',
  topic: 'linear-equations',
  difficulty: 'high-school',
  description: 'Collect data pairs, plot scatter graphs, and draw lines of best fit to find the linear relationship y = mx + c.',
  learningObjectives: [
    'Plot a scatter diagram from experimental data',
    'Draw a line of best fit by eye and determine its equation',
    'Use the line of best fit for interpolation and extrapolation',
  ],
  variables: [
    { id: 'data-set', name: 'Data Set', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Height vs Arm Span, 1=Temperature vs Ice Cream Sales, 2=Study Hours vs Exam Score, 3=Custom' },
    { id: 'points-count', name: 'Number of Points', unit: '', min: 5, max: 20, default: 10, step: 1, description: 'How many data points to generate' },
  ],
  predictionPrompts: [
    { id: 'lr-pred-1', question: 'If height and arm span have a positive linear correlation, the gradient of the line of best fit will be:', type: 'multiple-choice', options: ['Positive', 'Negative', 'Zero', 'Cannot determine'], correctAnswer: 'Positive', explanation: 'A positive correlation means both variables increase together, giving a positive gradient on the line of best fit.' },
    { id: 'lr-pred-2', question: 'Extrapolation (predicting beyond the data range) is risky because:', type: 'multiple-choice', options: ['The calculation is harder', 'The relationship may not continue outside the measured range', 'There are not enough decimal places', 'The gradient changes to zero'], correctAnswer: 'The relationship may not continue outside the measured range', explanation: 'The linear trend observed in the data range may not hold for values far outside that range. Real-world relationships often have limits (e.g. ice cream sales cannot increase forever). WAEC warns against extrapolation.' },
  ],
  analysisPrompts: [
    { id: 'lr-anal-1', question: 'Determine the equation of your line of best fit in the form y = mx + c. Show how you found m and c from your graph.', type: 'text', rubric: 'Should calculate gradient m = rise/run using two points on the line. Then find c from the y-intercept or substitute a point into y = mx + c.' },
    { id: 'lr-anal-2', question: 'At Kejetia Market in Kumasi, a trader records daily temperature and cold drink sales. Explain how a line of best fit could help them decide how many cold drinks to stock on a 35°C day.', type: 'text', rubric: 'Should explain: plot temperature vs sales, draw line of best fit, then interpolate at 35°C to predict sales. Caution that this is an estimate and other factors (weekend, competition) matter.' },
  ],
  defaultVariables: { 'data-set': 0, 'points-count': 10 },
  trialLimit: 3,
  timeEstimate: 15,
};

export const INEQUALITIES_LAB: LabConfig = {
  id: 'inequalities-lab',
  title: 'Inequalities and Regions Lab',
  subject: 'math',
  topic: 'linear-equations',
  difficulty: 'high-school',
  description: 'Plot linear inequalities on a coordinate plane, shade solution regions, and find the feasible region for systems of inequalities.',
  learningObjectives: [
    'Represent linear inequalities on a graph',
    'Identify the region satisfying multiple inequalities (feasible region)',
    'Find the maximum and minimum values of an objective function in the feasible region',
  ],
  variables: [
    { id: 'num-inequalities', name: 'Number of Inequalities', unit: '', min: 2, max: 5, default: 3, step: 1, description: 'How many inequality constraints to graph' },
    { id: 'problem-type', name: 'Problem Type', unit: '', min: 0, max: 2, default: 0, step: 1, description: '0=Resource allocation, 1=Diet optimization, 2=Production planning' },
  ],
  predictionPrompts: [
    { id: 'ineq-pred-1', question: 'The inequality y > 2x + 1 is represented by:', type: 'multiple-choice', options: ['A solid line with shading below', 'A dashed line with shading above', 'A solid line with shading above', 'A dashed line with shading below'], correctAnswer: 'A dashed line with shading above', explanation: 'The strict inequality (>) means a dashed line (points ON the line are excluded). The > sign means we shade the region above the line.' },
    { id: 'ineq-pred-2', question: 'The feasible region for a system of inequalities is always:', type: 'multiple-choice', options: ['Empty (no solution)', 'The overlap of all individual solution regions', 'The entire graph', 'Only on the axes'], correctAnswer: 'The overlap of all individual solution regions', explanation: 'The feasible region is where ALL inequalities are satisfied simultaneously — the intersection of all shaded regions.' },
  ],
  analysisPrompts: [
    { id: 'ineq-anal-1', question: 'Find the vertices of the feasible region for your system. Which vertex gives the maximum value of the objective function P = 3x + 2y?', type: 'text', rubric: 'Should identify vertices by solving pairs of simultaneous equations, then evaluate P at each vertex. The maximum occurs at a vertex (corner point principle).' },
    { id: 'ineq-anal-2', question: 'A Ghana cocoa farmer has 10 hectares and can plant cocoa (3 ha/ton) or coffee (2 ha/ton). Cocoa earns $2000/ton and coffee $1500/ton. Set up inequalities and find the optimal mix for maximum revenue.', type: 'text', rubric: 'Should set up: 3x + 2y ≤ 10, x ≥ 0, y ≥ 0. Maximise P = 2000x + 1500y. At vertices: (0,5)=$7500, (10/3,0)=$6667, optimal likely at (0,5).' },
  ],
  defaultVariables: { 'num-inequalities': 3, 'problem-type': 0 },
  trialLimit: 3,
  timeEstimate: 20,
};

export const DIFFERENTIATION_LAB: LabConfig = {
  id: 'differentiation-lab',
  title: 'Differentiation Lab: From Curves to Gradients',
  subject: 'math',
  topic: 'calculus',
  difficulty: 'advanced',
  description: 'Explore the derivative as the gradient of a tangent. Investigate how the derivative function relates to the original function.',
  learningObjectives: [
    'Understand the derivative as the limit of (Δy/Δx) as Δx → 0',
    'Sketch the derivative function from the graph of f(x)',
    'Find stationary points by setting f\'(x) = 0',
  ],
  variables: [
    { id: 'function-type', name: 'Function Type', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=Polynomial, 1=Trigonometric, 2=Exponential, 3=Custom' },
    { id: 'coeff-a', name: 'Coefficient a', unit: '', min: -5, max: 5, default: 1, step: 0.5, description: 'Leading coefficient of the function' },
  ],
  predictionPrompts: [
    { id: 'diff-pred-1', question: 'At a stationary point (turning point) of a graph, the derivative f\'(x) equals:', type: 'multiple-choice', options: ['1', '0', 'Undefined', 'The same as f(x)'], correctAnswer: '0', explanation: 'At a stationary point, the tangent is horizontal, so the gradient (derivative) is zero. Setting f\'(x) = 0 finds the x-coordinate of turning points.' },
    { id: 'diff-pred-2', question: 'If f(x) = x³, then f\'(x) = 3x². At x = 2, the gradient of the tangent is:', type: 'multiple-choice', options: ['6', '8', '12', '3'], correctAnswer: '12', explanation: 'f\'(2) = 3(2)² = 3 × 4 = 12. The gradient of the tangent to y = x³ at x = 2 is 12.' },
  ],
  analysisPrompts: [
    { id: 'diff-anal-1', question: 'Sketch the derivative function for your chosen f(x). Explain how the shape of f\'(x) relates to the shape of f(x).', type: 'text', rubric: 'Should describe: where f is increasing, f\' is positive; where f is decreasing, f\' is negative; at turning points f\' = 0; where f curves upward, f\' is increasing.' },
    { id: 'diff-anal-2', question: 'At Akosombo Dam, the water level h(t) changes over the year. Explain how dh/dt gives useful information and what it means when dh/dt = 0.', type: 'text', rubric: 'dh/dt is the rate of change of water level. Positive = rising (rainy season), negative = falling (dry season). dh/dt = 0 means the water level has reached a peak or trough.' },
  ],
  defaultVariables: { 'function-type': 0, 'coeff-a': 1 },
  trialLimit: 3,
  timeEstimate: 15,
};

export const INTEGRATION_LAB: LabConfig = {
  id: 'integration-lab',
  title: 'Integration Lab: Area Under the Curve',
  subject: 'math',
  topic: 'calculus',
  difficulty: 'advanced',
  description: 'Approximate the area under curves using rectangles (trapezium rule), then compare with exact integration.',
  learningObjectives: [
    'Approximate area using the trapezium rule',
    'Calculate exact area using definite integration',
    'Understand the Fundamental Theorem of Calculus',
  ],
  variables: [
    { id: 'function', name: 'Function', unit: '', min: 0, max: 3, default: 0, step: 1, description: '0=x², 1=sin(x), 2=eˣ, 3=√x' },
    { id: 'num-strips', name: 'Number of Strips', unit: '', min: 2, max: 20, default: 5, step: 1, description: 'More strips = more accurate trapezium rule' },
    { id: 'upper-limit', name: 'Upper Limit (b)', unit: '', min: 1, max: 10, default: 4, step: 1, description: 'Upper bound of integration' },
  ],
  predictionPrompts: [
    { id: 'int-pred-1', question: 'Increasing the number of strips in the trapezium rule will:', type: 'multiple-choice', options: ['Make the approximation less accurate', 'Make the approximation more accurate', 'Not change the result', 'Always give the exact answer'], correctAnswer: 'Make the approximation more accurate', explanation: 'More strips means narrower trapezia that follow the curve more closely, reducing error. In the limit (infinite strips), the trapezium rule gives the exact integral.' },
    { id: 'int-pred-2', question: 'The exact area under y = x² from x = 0 to x = 4 is:', type: 'multiple-choice', options: ['16', '64/3 ≈ 21.33', '8', '4'], correctAnswer: '64/3 ≈ 21.33', explanation: '∫₀⁴ x² dx = [x³/3]₀⁴ = 64/3 - 0 = 64/3 ≈ 21.33' },
  ],
  analysisPrompts: [
    { id: 'int-anal-1', question: 'Compare your trapezium rule estimate with the exact integral value. Calculate the percentage error and explain why it decreases with more strips.', type: 'text', rubric: 'Should calculate both values and find % error = |estimate - exact| / exact × 100%. Error decreases because more strips better approximate the curve between the trapezia and the actual function.' },
    { id: 'int-anal-2', question: 'Engineers at Akosombo Dam use integration to calculate the total volume of water in the reservoir from depth-area data. Explain how ∫A(h)dh gives the volume, where A(h) is the cross-sectional area at depth h.', type: 'text', rubric: 'Should explain: volume = ∫A(h)dh from h=0 to h=max depth. Each thin horizontal slice has area A(h) and thickness dh, so its volume is A(h)×dh. Adding all slices (integrating) gives total volume.' },
  ],
  defaultVariables: { 'function': 0, 'num-strips': 5, 'upper-limit': 4 },
  trialLimit: 4,
  timeEstimate: 15,
};

export const SEQUENCE_SERIES_LAB: LabConfig = {
  id: 'sequence-series-lab',
  title: 'Sequences and Series Lab',
  subject: 'math',
  topic: 'quadratics',
  difficulty: 'high-school',
  description: 'Explore arithmetic and geometric sequences, find the nth term, and calculate the sum of series.',
  learningObjectives: [
    'Find the nth term of arithmetic and geometric sequences',
    'Calculate the sum of arithmetic and geometric series',
    'Understand the sum to infinity of a convergent geometric series',
  ],
  variables: [
    { id: 'sequence-type', name: 'Sequence Type', unit: '', min: 0, max: 1, default: 0, step: 1, description: '0=Arithmetic, 1=Geometric' },
    { id: 'first-term', name: 'First Term (a)', unit: '', min: 1, max: 20, default: 3, step: 1, description: 'The first term of the sequence' },
    { id: 'common-diff-ratio', name: 'Common Difference/Ratio', unit: '', min: -5, max: 5, default: 2, step: 0.5, description: 'Common difference (arithmetic) or common ratio (geometric)' },
  ],
  predictionPrompts: [
    { id: 'seq-pred-1', question: 'The 10th term of the arithmetic sequence 3, 7, 11, 15, ... is:', type: 'multiple-choice', options: ['39', '43', '35', '41'], correctAnswer: '39', explanation: 'a = 3, d = 4. T₁₀ = a + 9d = 3 + 9(4) = 3 + 36 = 39.' },
    { id: 'seq-pred-2', question: 'A geometric series converges (has a finite sum to infinity) only when the common ratio r satisfies:', type: 'multiple-choice', options: ['r > 1', 'r = 1', '|r| < 1', 'r < 0'], correctAnswer: '|r| < 1', explanation: 'A geometric series only converges when the absolute value of the common ratio is less than 1. Then S∞ = a/(1-r).' },
  ],
  analysisPrompts: [
    { id: 'seq-anal-1', question: 'Find the sum of the first 20 terms of your arithmetic sequence using S = n/2(2a + (n-1)d). Show your working.', type: 'text', rubric: 'Should substitute into formula. E.g. with a=3, d=2: S₂₀ = 20/2(2(3) + 19(2)) = 10(6 + 38) = 10(44) = 440.' },
    { id: 'seq-anal-2', question: 'In Ghana, a microfinance loan of GHC 1000 at 5% monthly compound interest creates a geometric sequence of debt. After 12 months, how much is owed? Should the government cap interest rates? Give a mathematical argument.', type: 'text', rubric: 'Should calculate: 1000 × 1.05¹² = GHC 1795.85. Should argue that exponential growth of debt through geometric series is unsustainable for borrowers and discuss rate caps mathematically.' },
  ],
  defaultVariables: { 'sequence-type': 0, 'first-term': 3, 'common-diff-ratio': 2 },
  trialLimit: 3,
  timeEstimate: 15,
};

// ─── Updated Lab Arrays ─────────────────────────────────────────────────────

export const BIOLOGY_LABS = [OSMOSIS_LAB, PHOTOSYNTHESIS_LAB, ENZYME_LAB, PROTEIN_SYNTHESIS_LAB, FOOD_TESTS_LAB, TRANSPIRATION_LAB, MITOSIS_LAB, DNA_EXTRACTION_LAB, HEART_RATE_LAB, ECOSYSTEM_ENERGY_LAB, BIODIVERSITY_LAB, PHOTOSYNTHESIS_RATE_LAB];
export const PHYSICS_LABS = [PROJECTILE_LAB, WAVE_LAB, SIMPLE_PENDULUM_LAB, HOOKES_LAW_LAB, CIRCUIT_LAB, CONVEX_LENS_LAB, SPECIFIC_HEAT_LAB, FREEFALL_LAB, ELECTROMAGNET_LAB, RESISTIVITY_LAB];
export const CHEMISTRY_LABS = [REACTION_LAB, STOICHIOMETRY_LAB, ACID_BASE_TITRATION_LAB, RATE_OF_REACTION_LAB, FLAME_TEST_LAB, ELECTROLYSIS_LAB, CRYSTAL_LAB, NEUTRALIZATION_LAB, GAS_LAWS_LAB];
export const MATH_LABS = [GRAPH_CHALLENGE_LAB, PARABOLA_LAB, LINEAR_REGRESSION_LAB, INEQUALITIES_LAB, DIFFERENTIATION_LAB, INTEGRATION_LAB, SEQUENCE_SERIES_LAB];
