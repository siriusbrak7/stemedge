import { Misconception } from '../../components/shared/MisconceptionAlert';

export type { Misconception };

export const ATOMIC_PERIODIC_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'atom-looks-like',
    title: 'Atoms Look Like Miniature Solar Systems',
    misconception: 'Electrons orbit the nucleus in circular paths, like planets orbit the Sun.',
    correction: 'Electrons exist in probability clouds (orbitals) around the nucleus, not in fixed circular orbits. The Bohr model is a simplified picture, not reality.',
    explanation: 'The Bohr model (1913) showed electrons in circular orbits, and it is still drawn in textbooks for simplicity. Quantum mechanics shows that electrons occupy 3D regions of space called orbitals, where there is a high probability of finding the electron. We cannot know both an electron\'s exact position and velocity simultaneously (Heisenberg Uncertainty Principle).',
    examples: [
      'An s-orbital is spherical, a p-orbital is dumbbell-shaped — not circular orbits.',
      'The electron cloud model replaces the idea of a definite path around the nucleus.',
    ],
    relatedTopic: 'atomic-periodic',
    difficulty: 'common',
  },
  {
    id: 'period-trends-memorize',
    title: 'Periodic Trends Are Arbitrary Rules to Memorize',
    misconception: 'Electronegativity, ionisation energy, and atomic radius trends are just facts to memorize — they have no underlying reason.',
    correction: 'All periodic trends follow from two fundamental factors: nuclear charge (protons) and electron shielding (inner electrons). Understanding WHY makes memorisation unnecessary.',
    explanation: 'Going across a period, nuclear charge increases but shielding stays roughly the same, so electrons are pulled tighter (smaller radius, higher ionisation energy, higher electronegativity). Going down a group, additional electron shells increase shielding, so the outer electrons are farther and easier to remove. If you understand these two factors, you can derive every trend.',
    examples: [
      'Fluorine has the highest electronegativity because it has high nuclear charge with only 2 shells (low shielding).',
      'Francium has the lowest ionisation energy because its outer electron is far from the nucleus and heavily shielded.',
    ],
    relatedTopic: 'atomic-periodic',
    difficulty: 'moderate',
  },
  {
    id: 'noble-gas-no-reactions',
    title: 'Noble Gases Never React',
    misconception: 'Noble gases are completely inert and can never form compounds.',
    correction: 'Noble gases are very unreactive, but the heavier ones (Xe, Kr) can form compounds with highly electronegative elements like fluorine and oxygen.',
    explanation: 'Noble gases have full outer electron shells, making them very stable. However, the larger noble gases (Xe, Kr, Rn) have outer electrons that are far enough from the nucleus to be pulled away by extremely electronegative elements. Xenon forms XeF₂, XeF₄, XeF₆, and XeO₃. This was first demonstrated by Neil Bartlett in 1962, overturning the "inert gas" belief.',
    examples: [
      'XeF₂ is used as a fluorinating agent in organic chemistry.',
      'Radon would form even more compounds than xenon, but it is radioactive and scarce.',
    ],
    relatedTopic: 'atomic-periodic',
    difficulty: 'rare',
  },
];

export const QUANT_CHEM_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'mole-just-number',
    title: 'A Mole Is Just a Large Number',
    misconception: 'A mole is simply 6.02 × 10²³ — it has nothing to do with mass or volume.',
    correction: 'A mole IS 6.02 × 10²³ particles, but it also bridges to mass (molar mass in g/mol) and gas volume (22.4 L at STP). It is a chemical counting unit that connects the microscopic and macroscopic worlds.',
    explanation: 'The mole is like a "dozen" — but for atoms. One mole of carbon-12 atoms has exactly 12 grams of mass. This means the molar mass (in g/mol) equals the atomic/molecular mass (in amu). For gases at STP, one mole occupies 22.4 L. This three-way bridge (particles ↔ mass ↔ volume) makes the mole the central concept of quantitative chemistry.',
    examples: [
      '1 mole of H₂O = 6.02 × 10²³ molecules = 18 g = 22.4 L of vapour at STP.',
      'At Tema Harbour, industrial chemistry uses molar calculations daily to produce fertiliser (NH₃ from the Haber process).',
    ],
    relatedTopic: 'quantitative-chemistry',
    difficulty: 'common',
  },
  {
    id: 'limiting-reactant-same-amount',
    title: 'The Reactant Present in the Smaller Mass Is Limiting',
    misconception: 'Whichever reactant has the smaller mass is the limiting reactant.',
    correction: 'The limiting reactant is the one that produces the least product — you must compare mole ratios, not masses.',
    explanation: 'Mass alone tells you nothing about limiting reagent because different substances have different molar masses. 2 g of H₂ (1 mol) is far more particles than 2 g of O₂ (0.0625 mol). Always convert to moles, compare with the balanced equation\'s mole ratio, and determine which runs out first based on the stoichiometry.',
    examples: [
      'For 2H₂ + O₂ → 2H₂O: 4 g H₂ (2 mol) and 32 g O₂ (1 mol) are in the correct 2:1 ratio — neither is limiting.',
      'For the same reaction: 2 g H₂ (1 mol) and 32 g O₂ (1 mol) — H₂ is limiting because you need 2 mol H₂ per 1 mol O₂.',
    ],
    relatedTopic: 'quantitative-chemistry',
    difficulty: 'common',
  },
  {
    id: 'concentration-more-solute',
    title: 'Adding More Solute Always Increases Concentration',
    misconception: 'Keep adding solute and the concentration keeps increasing — there is no limit.',
    correction: 'A solution can only dissolve a certain amount of solute (saturation). Beyond this, excess solute remains undissolved and concentration stops increasing.',
    explanation: 'Every solvent at a given temperature has a maximum capacity to dissolve a solute (solubility). At the saturation point, the rate of dissolving equals the rate of crystallisation, and adding more solute does not increase concentration. For example, at 20°C, about 36 g of NaCl dissolves in 100 g of water. Adding more than 36 g just leaves solid at the bottom.',
    examples: [
      'At Korle Bu Hospital, IV saline (0.9% NaCl) is carefully prepared — adding too much salt would create a saturated or supersaturated solution.',
      'Sugar dissolving in tea: eventually, no more dissolves and sugar sits at the bottom of the cup.',
    ],
    relatedTopic: 'quantitative-chemistry',
    difficulty: 'moderate',
  },
];

export const REACTION_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'exothermic-bad',
    title: 'Exothermic Reactions Are Dangerous and Endothermic Are Safe',
    misconception: 'Exothermic means dangerous/explosive, and endothermic means safe.',
    correction: 'Exothermic means heat is released; endothermic means heat is absorbed. Neither inherently means dangerous or safe.',
    explanation: 'Many essential processes are exothermic: respiration, combustion for cooking, cement setting, hand warmers. Some endothermic processes can be dangerous: thermal decomposition in explosions often begins with endothermic bond breaking. The terms describe energy flow direction, not hazard level. The key safety factor is the RATE of energy release.',
    examples: [
      'Respiration (exothermic) is essential for life, not dangerous.',
      'Decomposition of TNT begins endothermically (bond breaking) before the exothermic product formation.',
    ],
    relatedTopic: 'thermodynamics',
    difficulty: 'moderate',
  },
  {
    id: 'catalyst-used-up',
    title: 'Catalysts Get Used Up in the Reaction',
    misconception: 'A catalyst is a reactant that gets consumed — it just makes the reaction start.',
    correction: 'A catalyst is NOT consumed. It participates in the reaction mechanism but is regenerated at the end, so the same catalyst molecule can be used repeatedly.',
    explanation: 'Catalysts work by providing an alternative reaction pathway with lower activation energy. They may temporarily bond to reactants (forming intermediates) but are always released in later steps. This is why industrial catalysts (like iron in the Haber process) last for years. At Ghana\'s fertiliser plants, iron catalysts are reused thousands of times.',
    examples: [
      'Enzymes in your body are biological catalysts — a single amylase molecule can break down thousands of starch molecules.',
      'Manganese(IV) oxide catalyses the decomposition of hydrogen peroxide and is unchanged afterwards.',
    ],
    relatedTopic: 'thermodynamics',
    difficulty: 'common',
  },
  {
    id: 'equilibrium-stopped',
    title: 'Equilibrium Means the Reaction Has Stopped',
    misconception: 'At equilibrium, all reactions have stopped — nothing is happening anymore.',
    correction: 'At equilibrium, the forward and reverse reactions continue at equal rates. It is a DYNAMIC balance, not a static one.',
    explanation: 'Chemical equilibrium is dynamic: reactants continue forming products AND products continue forming reactants, but at the same rate. The concentrations stay constant because the two processes cancel each other out. Le Chatelier\'s Principle shows that if you disturb the equilibrium, the system responds by shifting to counteract the change — proving the reactions are still happening.',
    examples: [
      'In a sealed bottle of soda, CO₂ dissolves and comes out of solution at equal rates at equilibrium.',
      'Haber process (N₂ + 3H₂ ⇌ 2NH₃): at equilibrium, NH₃ forms and decomposes at the same rate.',
    ],
    relatedTopic: 'thermodynamics',
    difficulty: 'common',
  },
  {
    id: 'strong-acid-dangerous',
    title: 'Strong Acid Means Dangerous or Concentrated',
    misconception: 'A strong acid is the same as a concentrated acid — it means a lot of acid dissolved.',
    correction: 'Strong means fully dissociated in water (all H⁺ ions released). Concentrated means a large amount of acid per unit volume. These are independent properties.',
    explanation: 'Strength refers to the degree of ionisation: a strong acid (HCl, H₂SO₄, HNO₃) fully dissociates in water; a weak acid (CH₃COOH, H₂CO₃) only partially dissociates. Concentration refers to moles per litre. A dilute solution of a strong acid can be less hazardous than a concentrated solution of a weak acid. For example, 0.01 M HCl has pH 2, while 10 M acetic acid is more corrosive despite being "weak."',
    examples: [
      'Ethanoic acid in vinegar is a weak acid but is safe at household concentration (≈ 0.8 M).',
      'Hydrochloric acid in the stomach is a strong acid at low concentration (≈ 0.01 M) — essential for digestion.',
    ],
    relatedTopic: 'quantitative-chemistry',
    difficulty: 'common',
  },
];

export const ALL_CHEMISTRY_MISCONCEPTIONS = [
  ...ATOMIC_PERIODIC_MISCONCEPTIONS,
  ...QUANT_CHEM_MISCONCEPTIONS,
  ...REACTION_MISCONCEPTIONS,
];
