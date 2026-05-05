import type { Topic } from '../types';

export const QUANTITATIVE_CHEMISTRY_TOPIC: Topic = {
  id: 'quantitative-chemistry',
  title: 'Quantitative Chemistry',
  subtopics: [
    {
      id: 'mole-concept',
      title: 'The Mole Concept and Stoichiometry',
      lesson: {
        sections: [
          {
            title: "Why We Can't Count Atoms",
            content: "Atoms are too small to count individually — even a speck of dust contains billions of atoms. Chemists use the mole (mol) as a counting unit, similar to how we use 'dozen' for 12. One mole contains exactly 6.02 × 10²³ particles, known as Avogadro's constant (Nₐ). This number was chosen so that 1 mole of carbon-12 atoms has a mass of exactly 12 grams.",
            interactive: {
              type: 'reveal' as const,
              label: 'How large is Avogadro\'s number?',
              hiddenContent: '6.02 × 10²³ grains of rice would cover the entire surface of Ghana to a depth of 10,000 metres. If you counted one particle per second since the Big Bang, you would still have 99.99% left to count.'
            }
          },
          {
            title: 'Molar Mass',
            content: 'The molar mass of an element equals its relative atomic mass (Ar) in grams per mole — found on the periodic table. For compounds, add up the molar masses of all atoms. Example: H₂O = 2(1) + 16 = 18 g/mol. Molar mass has units g/mol and is represented by M.',
            interactive: {
              type: 'expand' as const,
              label: 'Calculate M for CaCO₃ (limestone)',
              hiddenContent: 'Ca = 40, C = 12, O₃ = 3 × 16 = 48. Total M = 40 + 12 + 48 = 100 g/mol. This is important in Ghanaian cement production — 100 g of CaCO₃ gives 44 g of CO₂ and 56 g of CaO.'
            }
          },
          {
            title: 'The Mole Triangle',
            content: 'The fundamental relationship is n = m/M, where n = moles (mol), m = mass (g), M = molar mass (g/mol). Cover the quantity you want to find: if you cover n, you get m/M; if you cover m, you get n×M; if you cover M, you get m/n. This "mole triangle" is the most-tested calculation in WAEC Chemistry.',
          },
          {
            title: 'Stoichiometry',
            content: 'A balanced chemical equation shows the molar ratios of reactants and products. Example: 2H₂ + O₂ → 2H₂O means 2 mol H₂ reacts with 1 mol O₂ to produce 2 mol H₂O. If you start with 4 mol H₂, you need 2 mol O₂ and will produce 4 mol H₂O. The limiting reagent is the reactant that runs out first.',
            interactive: {
              type: 'reveal' as const,
              label: 'Real Ghana example: Cement kiln',
              hiddenContent: 'In the Diamond Cement factory (Tema), CaCO₃ → CaO + CO₂. For every 100 g (1 mol) of limestone heated, exactly 1 mol (44 g) of CO₂ is released. Engineers use stoichiometry to calculate fuel requirements and CO₂ emissions per tonne of cement.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'mc-f1', question: "How many particles are in 1 mole?", answer: "6.02 × 10²³ (Avogadro's constant)" },
        { id: 'mc-f2', question: 'What is the molar mass of CO₂?', answer: '44 g/mol (C=12, O×2=32)' },
        { id: 'mc-f3', question: 'Formula: moles from mass and molar mass?', answer: 'n = m ÷ M' },
        { id: 'mc-f4', question: '1 mole of any gas at RTP occupies?', answer: '24 dm³ (24,000 cm³)' },
        { id: 'mc-f5', question: 'What does a balanced equation show about moles?', answer: 'The molar ratio of reactants and products' },
        { id: 'mc-f6', question: 'Define relative atomic mass (Ar).', answer: 'Mass of an atom relative to 1/12 the mass of carbon-12' },
        { id: 'mc-f7', question: 'Find moles in 8 g of NaOH (M=40).', answer: '0.2 mol' },
        { id: 'mc-f8', question: 'What is the limiting reagent?', answer: 'The reactant that is completely consumed first' }
      ],
      checkpointAssessment: [
        {
          id: 'mc-q1',
          type: 'mcq' as const,
          prompt: "What is Avogadro's constant?",
          options: [
            { id: 'a', text: '6.02 × 10²¹' },
            { id: 'b', text: '6.02 × 10²³' },
            { id: 'c', text: '6.02 × 10²⁵' },
            { id: 'd', text: '3.01 × 10²³' }
          ],
          correctAnswer: 'b',
          explanation: "Avogadro's constant Nₐ = 6.02 × 10²³ particles per mole."
        },
        {
          id: 'mc-q2',
          type: 'one-word' as const,
          prompt: 'The mass of one mole of a substance in grams is its?',
          correctAnswer: 'Molar mass',
          explanation: 'Molar mass (M) in g/mol equals the relative formula mass (Mr) numerically.'
        },
        {
          id: 'mc-q3',
          type: 'mcq' as const,
          prompt: '0.5 mol of CaCO₃ has mass = ? (M = 100 g/mol)',
          options: [
            { id: 'a', text: '50 g' },
            { id: 'b', text: '100 g' },
            { id: 'c', text: '25 g' },
            { id: 'd', text: '200 g' }
          ],
          correctAnswer: 'a',
          explanation: 'm = n × M = 0.5 × 100 = 50 g'
        },
        {
          id: 'mc-q4',
          type: 'matching' as const,
          prompt: 'Match formula to quantity:',
          pairs: [
      { left: 'n = m/M', right: 'Find moles' },
      { left: 'M = m/n', right: 'Find molar mass' },
      { left: 'm = n×M', right: 'Find mass' }
    ]
  },
  {
    id: 'mc-q5',
    type: 'one-word' as const,
    prompt: 'In 2H₂ + O₂ → 2H₂O, the ratio of H₂ to H₂O simplifies to?',
    correctAnswer: '1:1',
    hint: '2:2 simplified'
  }
]
},
{
    id: 'limiting-reactants',
    title: 'Limiting Reactants Simulator',
    lesson: {
      sections: [
        {
          title: 'What Is a Limiting Reactant?',
          content: 'In any chemical reaction, the reactants combine in fixed molar ratios shown by the balanced equation. The limiting reactant is the reactant that is completely consumed first — it determines the maximum amount of product that can form. Once the limiting reactant runs out, the reaction stops, no matter how much of the other reactants remain.',
          interactive: {
            type: 'reveal' as const,
            label: 'Think of it like cooking',
            hiddenContent: 'Imagine you have 10 slices of bread and only 2 eggs. Each sandwich needs 2 slices of bread and 1 egg. The eggs run out first — you can only make 2 sandwiches even though you have 6 slices of bread left over. The eggs are the limiting "reactant".'
          }
        },
        {
          title: 'Identifying the Limiting Reactant',
          content: 'To find the limiting reactant: (1) Calculate the moles of each reactant using n = m/M. (2) Divide each by its stoichiometric coefficient from the balanced equation. (3) The reactant with the smaller result is the limiting reactant. Alternatively, calculate how much product each reactant could form — the one producing less product is limiting.',
          interactive: {
            type: 'expand' as const,
            label: 'Step-by-step example',
            hiddenContent: 'For 2H₂ + O₂ → 2H₂O: if you have 4 g H₂ and 32 g O₂, moles of H₂ = 4/2 = 2 mol, moles of O₂ = 32/32 = 1 mol. Divide by coefficients: H₂ = 2/2 = 1, O₂ = 1/1 = 1. Both are equal — neither is in excess. But if you had only 2 g H₂ (1 mol), then H₂ = 1/2 = 0.5 < 1, so H₂ is limiting.'
          }
        },
        {
          title: 'Ghana Context: Cement Production at Tema',
          content: 'At the Diamond Cement factory in Tema, limestone (CaCO₃) is heated to produce quicklime (CaO) and CO₂: CaCO₃ → CaO + CO₂. Suppose a batch has 500 g of CaCO₃ and fuel that provides only enough energy for 100 g of reaction. Moles of CaCO₃ = 500/100 = 5 mol. But only 100 g worth (1 mol) of CaCO₃ can be processed with the available fuel. The fuel (energy) limits production — only 56 g of CaO and 44 g of CO₂ are produced instead of the theoretical 280 g and 220 g.',
          interactive: {
            type: 'reveal' as const,
            label: 'Why does this matter in industry?',
            hiddenContent: 'Cement factories in Ghana must carefully balance raw material delivery with fuel supply. If CaCO₃ arrives but fuel is scarce (as during Ghana\'s energy crises), limestone piles up unused — the fuel is the limiting reactant. Engineers use stoichiometry daily to avoid wasting expensive raw materials.'
          }
        },
        {
          title: 'Excess Reactant and Theoretical Yield',
          content: 'The excess reactant is the reactant that is left over after the reaction is complete. To find how much excess remains, subtract the amount consumed from the amount available. The theoretical yield is the maximum amount of product possible, calculated from the limiting reactant\'s moles using the balanced equation. Actual yield is often less due to incomplete reactions, side reactions, or product loss.',
          interactive: {
            type: 'expand' as const,
            label: 'Calculate excess and yield',
            hiddenContent: 'In CaCO₃ → CaO + CO₂ with 500 g CaCO₃ but fuel-limited to 1 mol: 5 mol − 1 mol = 4 mol CaCO₃ left as excess (400 g). Theoretical yield of CaO from 1 mol = 1 × 56 = 56 g. If the actual yield is 50 g, percentage yield = (50/56) × 100 = 89.3%.'
          }
        }
      ]
    },
    flashcards: [
      { id: 'lr-f1', question: 'What is a limiting reactant?', answer: 'The reactant that is completely consumed first, determining the maximum amount of product' },
      { id: 'lr-f2', question: 'How do you identify the limiting reactant?', answer: 'Calculate moles of each reactant, divide by stoichiometric coefficient; the smaller result is the limiting reactant' },
      { id: 'lr-f3', question: 'What is an excess reactant?', answer: 'The reactant that is left over after the reaction is complete' },
      { id: 'lr-f4', question: 'What is theoretical yield?', answer: 'The maximum amount of product calculated from the limiting reactant\'s moles' },
      { id: 'lr-f5', question: 'Formula for percentage yield?', answer: '% yield = (actual yield ÷ theoretical yield) × 100' },
      { id: 'lr-f6', question: 'In CaCO₃ → CaO + CO₂, if CaCO₃ is limiting, what determines max CaO?', answer: 'The moles of CaCO₃ available (1:1 ratio in equation)' }
    ],
    checkpointAssessment: [
      {
        id: 'lr-q1',
        type: 'mcq' as const,
        prompt: 'In a reaction, one reactant is completely consumed while another remains partly unused. The consumed reactant is the?',
        options: [
          { id: 'a', text: 'Excess reactant' },
          { id: 'b', text: 'Limiting reactant' },
          { id: 'c', text: 'Catalyst' },
          { id: 'd', text: 'Product' }
        ],
        correctAnswer: 'b',
        explanation: 'The limiting reactant is completely consumed first and limits the amount of product formed.'
      },
      {
        id: 'lr-q2',
        type: 'one-word' as const,
        prompt: 'The maximum amount of product that can be formed from the limiting reactant is called the?',
        correctAnswer: 'Theoretical yield',
        hint: 'Not the actual yield'
      },
      {
        id: 'lr-q3',
        type: 'mcq' as const,
        prompt: 'For 2H₂ + O₂ → 2H₂O, with 3 mol H₂ and 2 mol O₂, which is limiting?',
        options: [
          { id: 'a', text: 'H₂ (3/2 = 1.5 < 2/1 = 2)' },
          { id: 'b', text: 'O₂ (2/1 = 2 > 3/2 = 1.5)' },
          { id: 'c', text: 'Neither — they are in exact ratio' },
          { id: 'd', text: 'Both are limiting' }
        ],
        correctAnswer: 'a',
        explanation: 'Divide moles by coefficients: H₂ = 3/2 = 1.5, O₂ = 2/1 = 2. H₂ has the smaller ratio, so it is limiting.'
      },
      {
        id: 'lr-q4',
        type: 'matching' as const,
        prompt: 'Match the term to its definition:',
        pairs: [
          { left: 'Limiting reactant', right: 'Completely consumed first' },
          { left: 'Excess reactant', right: 'Left over after reaction' },
          { left: 'Theoretical yield', right: 'Maximum product from limiting reactant' },
          { left: 'Percentage yield', right: 'Actual ÷ theoretical × 100' }
        ]
      },
      {
        id: 'lr-q5',
        type: 'one-word' as const,
        prompt: 'If actual yield is 40 g and theoretical yield is 50 g, what is the percentage yield?',
        correctAnswer: '80%',
        hint: '(40 ÷ 50) × 100'
      }
    ]
},
{
    id: 'titration-curve',
    title: 'Titration Curve',
    lesson: {
      sections: [
        {
          title: 'What Is a Titration?',
          content: 'A titration is a technique where a solution of known concentration (the titrant) is added from a burette to a measured volume of a solution of unknown concentration (the analyte) until the reaction is just complete. The point at which the reaction is exactly complete is called the equivalence point. The volume of titrant used lets us calculate the unknown concentration.',
          interactive: {
            type: 'reveal' as const,
            label: 'WAEC practical tip',
            hiddenContent: 'Titration is the most common WAEC Chemistry practical question. You must record initial and final burette readings to 0.05 cm³ precision (e.g. 24.35 cm³, not 24.3 cm³). Always read the bottom of the meniscus at eye level. Concordant titres (within 0.10 cm³ of each other) are averaged for your final calculation.'
          }
        },
        {
          title: 'pH Curves in Acid-Base Titrations',
          content: 'A pH curve (titration curve) shows how pH changes as titrant is added. For a strong acid–strong base titration (e.g. HCl + NaOH), the pH starts low, rises slowly, then jumps steeply through pH 7 at the equivalence point, and levels off at high pH. The steep vertical section is where a single drop changes the pH by several units — this is the equivalence point.',
          interactive: {
            type: 'expand' as const,
            label: 'Different titration curves',
            hiddenContent: 'Strong acid + strong base: equivalence at pH 7, steep vertical jump. Strong acid + weak base: equivalence below pH 7 (acidic). Weak acid + strong base: equivalence above pH 7 (basic). The shape of the curve tells you what type of acid and base are involved.'
          }
        },
        {
          title: 'Choosing the Right Indicator',
          content: 'An indicator changes colour over a specific pH range. You must choose an indicator whose colour change overlaps the steep vertical section of the titration curve. Phenolphthalein changes colour at pH 8.2–10.0 — ideal for strong acid–strong base and weak acid–strong base. Methyl orange changes at pH 3.1–4.4 — ideal for strong acid–weak base. Using the wrong indicator gives a misleading end point.',
          interactive: {
            type: 'reveal' as const,
            label: 'WAEC common indicator questions',
            hiddenContent: 'WAEC often asks which indicator to use. Rule of thumb: strong acid + strong base → either phenolphthalein or methyl orange works. Strong acid + weak base → methyl orange. Weak acid + strong base → phenolphthalein. Never use an indicator for weak acid + weak base — use a pH meter instead.'
          }
        },
        {
          title: 'Calculating Concentration from Titration',
          content: 'Use the relationship: c₁V₁/n₁ = c₂V₂/n₂, where c = concentration (mol/dm³), V = volume (cm³), and n = stoichiometric coefficient from the balanced equation. For a 1:1 reaction like HCl + NaOH, this simplifies to c₁V₁ = c₂V₂. Always convert volumes to the same units and use the average concordant titre volume.',
          interactive: {
            type: 'expand' as const,
            label: 'Worked example',
            hiddenContent: '25.0 cm³ of NaOH solution was neutralised by 24.35 cm³ of 0.100 mol/dm³ HCl. HCl + NaOH → NaCl + H₂O (1:1 ratio). c(NaOH) = (c × V of HCl) ÷ V of NaOH = (0.100 × 24.35) ÷ 25.0 = 0.0974 mol/dm³.'
          }
        }
      ]
    },
    flashcards: [
      { id: 'tc-f1', question: 'What is a titration?', answer: 'Adding a solution of known concentration (titrant) from a burette to a solution of unknown concentration until the reaction is just complete' },
      { id: 'tc-f2', question: 'What is the equivalence point?', answer: 'The point at which the titrant and analyte have reacted in exactly the molar ratio shown by the balanced equation' },
      { id: 'tc-f3', question: 'What is the end point?', answer: 'The point at which the indicator changes colour during a titration' },
      { id: 'tc-f4', question: 'Which indicator for weak acid + strong base?', answer: 'Phenolphthalein (pH range 8.2–10.0)' },
      { id: 'tc-f5', question: 'Titration concentration formula for 1:1 reactions?', answer: 'c₁V₁ = c₂V₂ (or c₁V₁/n₁ = c₂V₂/n₂ for other ratios)' },
      { id: 'tc-f6', question: 'What precision must burette readings be recorded to in WAEC?', answer: '0.05 cm³' }
    ],
    checkpointAssessment: [
      {
        id: 'tc-q1',
        type: 'mcq' as const,
        prompt: 'In a strong acid–strong base titration, the equivalence point occurs at approximately which pH?',
        options: [
          { id: 'a', text: 'pH 3' },
          { id: 'b', text: 'pH 5' },
          { id: 'c', text: 'pH 7' },
          { id: 'd', text: 'pH 11' }
        ],
        correctAnswer: 'c',
        explanation: 'Strong acid + strong base produces a neutral solution at the equivalence point, pH 7.'
      },
      {
        id: 'tc-q2',
        type: 'one-word' as const,
        prompt: 'Which indicator is suitable for a strong acid–weak base titration?',
        correctAnswer: 'Methyl orange',
        hint: 'Its colour change (pH 3.1–4.4) overlaps the acidic equivalence point'
      },
      {
        id: 'tc-q3',
        type: 'matching' as const,
        prompt: 'Match the titration type to the equivalence point pH:',
        pairs: [
          { left: 'Strong acid + strong base', right: 'pH 7' },
          { left: 'Strong acid + weak base', right: 'Below pH 7' },
          { left: 'Weak acid + strong base', right: 'Above pH 7' }
        ]
      },
      {
        id: 'tc-q4',
        type: 'mcq' as const,
        prompt: '25.0 cm³ of NaOH is titrated with 0.100 mol/dm³ HCl. The average titre is 20.00 cm³. What is c(NaOH)? (1:1 ratio)',
        options: [
          { id: 'a', text: '0.080 mol/dm³' },
          { id: 'b', text: '0.100 mol/dm³' },
          { id: 'c', text: '0.125 mol/dm³' },
          { id: 'd', text: '0.200 mol/dm³' }
        ],
        correctAnswer: 'a',
        explanation: 'c(NaOH) = (0.100 × 20.00) ÷ 25.0 = 0.080 mol/dm³'
      },
      {
        id: 'tc-q5',
        type: 'one-word' as const,
        prompt: 'Burette readings in WAEC must be recorded to what precision?',
        correctAnswer: '0.05 cm³',
        hint: 'Half the smallest division on the burette scale'
      }
    ]

    }
        ,
      {
        id: 'acids-bases-salts-sub',
      title: 'Acids, Bases and Salt Formation',
      lesson: { sections: [{ title: 'pH and Indicators', content: "pH measures hydrogen ion concentration. pH 7 is neutral, below 7 is acidic, above 7 is alkaline. Universal indicator gives a spectrum of colors. Strong acids fully ionize; weak acids partially ionize." }, { title: 'Neutralization Reactions', content: "Acid + base → salt + water. Acid + metal → salt + hydrogen. Acid + carbonate → salt + water + CO2. The type of salt depends on the acid used: HCl → chlorides, H2SO4 → sulfates, HNO3 → nitrates." }, { title: 'Titration', content: "Titration determines unknown concentration by reacting with a solution of known concentration. An indicator marks the endpoint. Volume and concentration data allow calculation using moles = concentration × volume." }] },
      flashcards: [{ id: 'ab-f1', question: 'pH 7 is?', answer: 'Neutral' }, { id: 'ab-f2', question: 'Acid + base produces?', answer: 'Salt and water' }, { id: 'ab-f3', question: 'Strong acids do what completely?', answer: 'Ionize (dissociate)' }, { id: 'ab-f4', question: 'HCl produces which type of salts?', answer: 'Chlorides' }, { id: 'ab-f5', question: 'What marks the endpoint in a titration?', answer: 'Indicator color change' }],
      checkpointAssessment: [{ id: 'ab-q1', type: 'mcq' as const, prompt: 'A strong alkali has pH close to:', options: [{ id: 'a', text: '2' }, { id: 'b', text: '5' }, { id: 'c', text: '7' }, { id: 'd', text: '13' }], correctAnswer: 'd' }, { id: 'ab-q2', type: 'one-word' as const, prompt: 'Acid + carbonate produces salt, water and?', correctAnswer: 'Carbon dioxide' }]
    },
    {
      id: 'separation-techniques-sub',
      title: 'Separation Techniques',
      lesson: { sections: [{ title: 'Physical Separation Methods', content: "Filtration separates insoluble solids from liquids. Evaporation/crystallization recovers dissolved solids. Distillation separates liquids with different boiling points. Chromatography separates dissolved substances by their affinity for a stationary phase." }, { title: 'Choosing the Right Method', content: "The choice depends on the physical properties of the mixture components: particle size (filtration vs sieving), solubility (crystallization), boiling point (distillation), and solvent affinity (chromatography). Pure substances have sharp melting/boiling points." }, { title: 'Fractional Distillation', content: "Used for miscible liquids with different boiling points. The mixture is heated; the component with the lowest boiling point evaporates first, condenses in the fractionating column, and is collected. Crude oil refining is a major industrial application." }] },
      flashcards: [{ id: 'sp-f1', question: 'Which method separates insoluble solid from liquid?', answer: 'Filtration' }, { id: 'sp-f2', question: 'Which method separates miscible liquids?', answer: 'Fractional distillation' }, { id: 'sp-f3', question: 'Chromatography separates by differences in?', answer: 'Solubility and affinity' }, { id: 'sp-f4', question: 'Pure substances have sharp what?', answer: 'Melting and boiling points' }, { id: 'sp-f5', question: 'What is evaporation used to obtain?', answer: 'Dissolved solid (crystals)' }],
      checkpointAssessment: [{ id: 'sp-q1', type: 'mcq' as const, prompt: 'Paper chromatography separates by differences in:', options: [{ id: 'a', text: 'Magnetism' }, { id: 'b', text: 'Color only' }, { id: 'c', text: 'Solubility and affinity' }, { id: 'd', text: 'Atomic number' }], correctAnswer: 'c' }, { id: 'sp-q2', type: 'one-word' as const, prompt: 'To get pure water from sea water, use?', correctAnswer: 'Distillation' }]
    },
    {
      id: 'redox-equations-sub',
      title: 'Redox and Half-Equations',
      lesson: { sections: [{ title: 'Oxidation and Reduction', content: "Oxidation Is Loss of electrons (OIL). Reduction Is Gain of electrons (RIG). In any redox reaction, one species is oxidized while another is reduced. The reducing agent donates electrons; the oxidizing agent accepts them." }, { title: 'Half-Equations', content: "Half-equations show electron transfer explicitly. Oxidation half: species → ion + electrons (electrons on product side). Reduction half: ion + electrons → species (electrons on reactant side). Combining balanced half-equations gives the full ionic equation." }, { title: 'Oxidation Numbers', content: "Oxidation number tracks electron ownership. Elements have 0. Ions equal their charge. In compounds, O is usually -2, H is +1. An increase in oxidation number means oxidation; a decrease means reduction." }] },
      flashcards: [{ id: 'rx-f1', question: 'OIL RIG stands for?', answer: 'Oxidation Is Loss, Reduction Is Gain' }, { id: 'rx-f2', question: 'In oxidation half-equations, electrons are on which side?', answer: 'Product side' }, { id: 'rx-f3', question: 'Oxidation number of oxygen is usually?', answer: '-2' }, { id: 'rx-f4', question: 'The reducing agent does what?', answer: 'Donates electrons (gets oxidized)' }, { id: 'rx-f5', question: 'Increase in oxidation number means?', answer: 'Oxidation' }],
      checkpointAssessment: [{ id: 'rx-q1', type: 'mcq' as const, prompt: 'Cu2+ + 2e- → Cu is:', options: [{ id: 'a', text: 'Oxidation' }, { id: 'b', text: 'Reduction' }, { id: 'c', text: 'Neutralization' }, { id: 'd', text: 'Precipitation' }], correctAnswer: 'b' }, { id: 'rx-q2', type: 'one-word' as const, prompt: 'Losing electrons increases oxidation?', correctAnswer: 'Number' }]
    }
        ],
        finalAssessment: [
    {
      id: 'qc-final-1',
      type: 'mcq' as const,
      prompt: 'How many moles are in 22 g of CO₂? (M = 44 g/mol)',
      options: [
        { id: 'a', text: '0.25 mol' },
        { id: 'b', text: '0.5 mol' },
        { id: 'c', text: '1 mol' },
        { id: 'd', text: '2 mol' }
      ],
      correctAnswer: 'b',
      explanation: 'n = m/M = 22/44 = 0.5 mol'
    },
    {
      id: 'qc-final-2',
      type: 'one-word' as const,
      prompt: 'In a reaction, the reactant that is completely consumed first is the?',
      correctAnswer: 'Limiting reagent'
    },
    {
      id: 'qc-final-3',
      type: 'matching' as const,
      prompt: 'Match Ghana industry to reaction:',
      pairs: [
        { left: 'Cement (Tema)', right: 'CaCO₃ → CaO + CO₂' },
        { left: 'Soap (palm oil)', right: 'Fat + NaOH → Soap' },
        { left: 'Fertiliser', right: 'NH₃ + HNO₃ → NH₄NO₃' }
      ]
    }
  ]
};
