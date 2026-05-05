const fs = require('fs');

function insertBeforeFinalAssessment(filePath, newContent) {
  let code = fs.readFileSync(filePath, 'utf8');
  // Find the LAST occurrence of "finalAssessment: ["
  const idx = code.lastIndexOf('finalAssessment: [');
  if (idx === -1) throw new Error('No finalAssessment found in ' + filePath);
  // Find the "]," or "]" right before it
  const before = code.substring(0, idx);
  const lastBracket = before.lastIndexOf('],');
  if (lastBracket === -1) throw new Error('No closing ] before finalAssessment in ' + filePath);
  // Insert after "],"
  const insertPoint = lastBracket + 2;
  code = code.substring(0, insertPoint) + '\n' + newContent + '\n' + code.substring(insertPoint);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('✅ ' + filePath + ' updated');
}

// Helper to make a subtopic string
function sub(id, title, sections, flashcards, questions) {
  return `    {
      id: '${id}',
      title: '${title}',
      lesson: { sections: [${sections.map(s => `{ title: '${s.t}', content: "${s.c}" }`).join(', ')}] },
      flashcards: [${flashcards.map(f => `{ id: '${f.i}', question: '${f.q}', answer: '${f.a}' }`).join(', ')}],
      checkpointAssessment: [${questions.map(q => {
        if (q.type === 'mcq') return `{ id: '${q.i}', type: 'mcq' as const, prompt: '${q.p}', options: [${q.o.map((o,idx) => `{ id: '${String.fromCharCode(97+idx)}', text: '${o}' }`).join(', ')}], correctAnswer: '${q.a}' }`;
        if (q.type === 'ow') return `{ id: '${q.i}', type: 'one-word' as const, prompt: '${q.p}', correctAnswer: '${q.a}' }`;
        return `{ id: '${q.i}', type: 'matching' as const, prompt: '${q.p}', pairs: [${q.pairs.map(p => `{ left: '${p[0]}', right: '${p[1]}' }`).join(', ')}] }`;
      }).join(', ')}]
    },`;
}

// ========== 1. BIOLOGY: Nutrition & Transport → Human Physiology ==========
const nutritionSub = sub('nutrition-digestion-sub', 'Nutrition and the Digestive System',
  [
    { t: 'Mechanical and Chemical Digestion', c: "Food is processed physically by chewing and churning, then chemically by enzymes. Amylase breaks starch into maltose, pepsin breaks proteins into peptides, and lipase breaks fats into fatty acids and glycerol." },
    { t: 'The Alimentary Canal', c: "The mouth, oesophagus, stomach, small intestine, and large intestine each play different roles. The stomach produces HCl and pepsin. The pancreas secretes enzymes into the duodenum. Bile from the liver emulsifies fats." },
    { t: 'Absorption in the Small Intestine', c: "Villi and microvilli massively increase surface area. Each villus has a thin epithelium, a dense capillary network, and a lacteal for fat absorption. Glucose and amino acids are absorbed by active transport and diffusion." }
  ],
  [
    { i: 'nd-f1', q: 'Which enzyme starts starch digestion in the mouth?', a: 'Amylase' },
    { i: 'nd-f2', q: 'Where does most absorption occur?', a: 'Small intestine' },
    { i: 'nd-f3', q: 'What does bile do?', a: 'Emulsifies fats' },
    { i: 'nd-f4', q: 'What structures increase surface area in the small intestine?', a: 'Villi and microvilli' },
    { i: 'nd-f5', q: 'Which organ produces bile?', a: 'Liver' }
  ],
  [
    { type: 'mcq', i: 'nd-q1', p: 'Which organ mainly produces hydrochloric acid?', o: ['Mouth', 'Stomach', 'Pancreas', 'Large intestine'], a: 'b' },
    { type: 'ow', i: 'nd-q2', p: 'Proteins are digested into which monomers?', a: 'Amino acids' }
  ]
);

const transportSub = sub('transport-systems-sub', 'Transport in Humans and Plants',
  [
    { t: 'The Human Circulatory System', c: "A double circulatory system pumps blood through the lungs (pulmonary circuit) and body (systemic circuit). The left ventricle has the thickest wall because it pumps blood to the whole body at high pressure." },
    { t: 'Blood Vessels and Blood', c: "Arteries carry blood away from the heart with thick elastic walls. Veins return blood with valves preventing backflow. Capillaries are one cell thick for efficient exchange. Red blood cells carry oxygen via haemoglobin." },
    { t: 'Transport in Plants', c: "Xylem carries water and minerals upward by transpiration pull — evaporation from leaves creates a continuous column of water. Phloem transports dissolved sugars from source to sink by translocation, an active process requiring ATP." }
  ],
  [
    { i: 'ts-f1', q: 'Which vessel carries blood away from the heart?', a: 'Artery' },
    { i: 'ts-f2', q: 'Which tissue transports sugars in plants?', a: 'Phloem' },
    { i: 'ts-f3', q: 'Which tissue transports water upward?', a: 'Xylem' },
    { i: 'ts-f4', q: 'Why is the left ventricle wall thickest?', a: 'It pumps blood to the whole body' },
    { i: 'ts-f5', q: 'What prevents backflow in veins?', a: 'Valves' }
  ],
  [
    { type: 'mcq', i: 'ts-q1', p: 'Which chamber pumps blood to the body?', o: ['Left atrium', 'Right atrium', 'Left ventricle', 'Right ventricle'], a: 'c' },
    { type: 'ow', i: 'ts-q2', p: 'Transpiration pull is linked to which tissue?', a: 'Xylem' }
  ]
);

insertBeforeFinalAssessment('src/data/biology/human-physiology.ts', nutritionSub + '\n' + transportSub);

// ========== 2. BIOLOGY: Biochemistry → Genetics & Molecular ==========
const biochemSub = sub('biochemistry-systems-sub', 'Biochemistry: Macromolecules and Enzyme Kinetics',
  [
    { t: 'Biological Macromolecules', c: "Carbohydrates (monosaccharides to polysaccharides), proteins (amino acids linked by peptide bonds), lipids (fatty acids and glycerol), and nucleic acids (nucleotides) are the four major classes. Each has distinct structure-function relationships." },
    { t: 'Enzyme Kinetics', c: "Enzymes are biological catalysts with active sites complementary to substrates. Michaelis-Menten kinetics describe how reaction rate depends on substrate concentration. Vmax is the maximum rate; Km is the substrate concentration at half Vmax." },
    { t: 'Metabolic Integration', c: "Respiration, photosynthesis, and biosynthesis are interconnected metabolic pathways. ATP acts as the universal energy currency. NAD+ and FAD are electron carriers linking catabolic and anabolic reactions." }
  ],
  [
    { i: 'bioch-f1', q: 'What does Vmax represent?', a: 'Maximum reaction rate at substrate saturation' },
    { i: 'bioch-f2', q: 'What drives ATP synthesis in oxidative phosphorylation?', a: 'A proton gradient' },
    { i: 'bioch-f3', q: 'What is the primary carbon-fixing enzyme?', a: 'RuBisCO' },
    { i: 'bioch-f4', q: 'What bond links amino acids?', a: 'Peptide bond' },
    { i: 'bioch-f5', q: 'What type of molecule is an enzyme?', a: 'Protein' }
  ],
  [
    { type: 'mcq', i: 'bioch-q1', p: 'Competitive inhibition primarily changes which parameter?', o: ['Vmax only', 'Km only', 'ATP yield', 'DNA sequence'], a: 'b' },
    { type: 'ow', i: 'bioch-q2', p: 'The universal energy currency of cells is?', a: 'ATP' }
  ]
);

insertBeforeFinalAssessment('src/data/biology/genetics-molecular.ts', biochemSub);

// ========== 3. PHYSICS: Properties of Matter + Energy Transfer → Forces & Motion ==========
const matterSub = sub('properties-matter-sub', 'Density, Buoyancy and Fluid Pressure',
  [
    { t: 'Density', c: "Density = mass / volume. Objects denser than a fluid sink; less dense objects float. Density explains why ice floats on water and why hot air rises — heating a gas reduces its density." },
    { t: 'Fluid Pressure', c: "Pressure in a fluid increases with depth: P = ρgh. Pressure acts equally in all directions at a given depth. This explains why dams are thicker at the base and why deep-sea creatures need special adaptations." },
    { t: 'Archimedes Principle', c: "An object immersed in a fluid experiences an upthrust (buoyant force) equal to the weight of fluid displaced. If upthrust equals weight, the object floats. This principle underlies ship design, hydrometers, and submarine ballast systems." }
  ],
  [
    { i: 'pm-f1', q: 'Density equals?', a: 'Mass divided by volume' },
    { i: 'pm-f2', q: 'Fluid pressure increases with?', a: 'Depth' },
    { i: 'pm-f3', q: 'Archimedes principle links upthrust to?', a: 'Weight of displaced fluid' },
    { i: 'pm-f4', q: 'Units of density?', a: 'kg/m³' },
    { i: 'pm-f5', q: 'Pressure formula for fluids?', a: 'P = ρgh' }
  ],
  [
    { type: 'mcq', i: 'pm-q1', p: 'An object floats when its average density is:', o: ['Greater than the fluid', 'Less than the fluid', 'Always 1', 'Unrelated'], a: 'b' },
    { type: 'ow', i: 'pm-q2', p: 'Pressure is force divided by?', a: 'Area' }
  ]
);

const energySub = sub('energy-transfer-sub', 'Energy Transfer, Efficiency and Sankey Diagrams',
  [
    { t: 'Conservation of Energy', c: "Energy cannot be created or destroyed, only transferred between stores. The main energy stores are kinetic, gravitational potential, elastic, thermal, chemical, nuclear, magnetic, and electrostatic." },
    { t: 'Efficiency and Waste', c: "Efficiency = useful output energy / total input energy × 100%. No device is 100% efficient — energy is always dissipated to thermal stores in surroundings. Reducing friction and improving insulation increase efficiency." },
    { t: 'Sankey Diagrams', c: "Sankey diagrams show energy flow with arrow widths proportional to energy amounts. The input arrow splits into useful output and wasted pathways. They allow quick visual comparison of efficiency between devices." }
  ],
  [
    { i: 'ets-f1', q: 'What does a wider Sankey arrow mean?', a: 'A larger amount of energy' },
    { i: 'ets-f2', q: 'Efficiency formula?', a: 'Useful output / total input × 100%' },
    { i: 'ets-f3', q: 'Can energy be destroyed?', a: 'No — only transferred or dissipated' },
    { i: 'ets-f4', q: 'Wasted energy usually ends up as?', a: 'Thermal energy in surroundings' },
    { i: 'ets-f5', q: 'Name 3 energy stores', a: 'Kinetic, gravitational potential, thermal' }
  ],
  [
    { type: 'mcq', i: 'ets-q1', p: 'A 100J lamp gives 25J of light. Efficiency is:', o: ['25%', '50%', '75%', '100%'], a: 'a' },
    { type: 'ow', i: 'ets-q2', p: 'Wasted energy is usually transferred to thermal?', a: 'Surroundings' }
  ]
);

insertBeforeFinalAssessment('src/data/physics/forces-motion.ts', matterSub + '\n' + energySub);

// ========== 4. PHYSICS: Quantum → Waves & EM Spectrum ==========
const quantumSub = sub('quantum-physics-sub', 'Quantum Physics: Photons and Wave-Particle Duality',
  [
    { t: 'Quantized Energy', c: "Energy is exchanged in discrete packets called quanta. A photon carries energy E = hf, where h is Planck constant and f is frequency. Higher frequency light carries more energy per photon." },
    { t: 'The Photoelectric Effect', c: "Light below a threshold frequency cannot eject electrons regardless of intensity. Above threshold, increasing intensity ejects more electrons. This proves light behaves as particles (photons), not just waves." },
    { t: 'Wave-Particle Duality', c: "Electrons show diffraction patterns (wave behavior) and photons show particle behavior. De Broglie wavelength λ = h/mv links particle momentum to wavelength. This duality is fundamental to quantum mechanics." }
  ],
  [
    { i: 'qp-f1', q: 'Photon energy equation?', a: 'E = hf' },
    { i: 'qp-f2', q: 'What is the threshold frequency?', a: 'Minimum frequency to eject electrons' },
    { i: 'qp-f3', q: 'De Broglie wavelength formula?', a: 'λ = h/mv' },
    { i: 'qp-f4', q: 'What experiment shows electron wave behavior?', a: 'Electron diffraction' },
    { i: 'qp-f5', q: 'Increasing intensity above threshold does what?', a: 'Ejects more electrons (not faster ones)' }
  ],
  [
    { type: 'mcq', i: 'qp-q1', p: 'Increasing light intensity below threshold frequency will:', o: ['Eject more electrons', 'Eject faster electrons', 'Cause no photoemission', 'Increase wavelength'], a: 'c' },
    { type: 'ow', i: 'qp-q2', p: 'Higher frequency photons carry more?', a: 'Energy' }
  ]
);

insertBeforeFinalAssessment('src/data/physics/waves-optics.ts', quantumSub);

// ========== 5. CHEMISTRY: States+Gas Laws + VSEPR → Atomic Structure ==========
const statesSub = sub('states-matter-gas-sub', 'States of Matter and Gas Laws',
  [
    { t: 'Particle Model', c: "Solids have particles in fixed positions vibrating. Liquids have particles close but moving past each other. Gases have particles far apart moving randomly at high speed. Heating increases particle kinetic energy." },
    { t: 'Gas Laws', c: "Boyle law: at constant temperature, pressure is inversely proportional to volume (PV = constant). Charles law: at constant pressure, volume is directly proportional to absolute temperature. Combined gas law: PV/T = constant." },
    { t: 'Kinetic Theory', c: "Gas pressure results from particle collisions with container walls. Higher temperature means faster particles and more forceful collisions. Reducing volume increases collision frequency and therefore pressure." }
  ],
  [
    { i: 'gas-f1', q: 'Boyle law links pressure and?', a: 'Volume (inversely)' },
    { i: 'gas-f2', q: 'Charles law links volume and?', a: 'Temperature (directly)' },
    { i: 'gas-f3', q: 'What causes gas pressure?', a: 'Particle collisions with walls' },
    { i: 'gas-f4', q: 'What happens to volume when gas is heated at constant pressure?', a: 'It increases' },
    { i: 'gas-f5', q: 'Absolute zero is?', a: '0 Kelvin or -273°C' }
  ],
  [
    { type: 'mcq', i: 'gas-q1', p: 'At constant temperature, reducing gas volume:', o: ['Reduces pressure', 'Increases pressure', 'Freezes the gas', 'Removes particles'], a: 'b' },
    { type: 'ow', i: 'gas-q2', p: 'PV = constant describes which law?', a: 'Boyle' }
  ]
);

const vsepSub = sub('molecular-geometry-sub', 'Molecular Geometry and VSEPR',
  [
    { t: 'Electron Domain Geometry', c: "VSEPR theory: electron pairs around a central atom arrange to minimize repulsion. Lone pairs repel more strongly than bonding pairs, compressing bond angles below ideal values." },
    { t: 'Common Molecular Shapes', c: "2 domains → linear (180°). 3 domains → trigonal planar (120°). 4 domains → tetrahedral (109.5°). 5 domains → trigonal bipyramidal. 6 domains → octahedral. Lone pairs modify these ideal geometries." },
    { t: 'Polarity from Shape', c: "A molecule is polar if it has polar bonds AND an asymmetric shape. CO2 is linear and nonpolar despite polar bonds. Water is bent and polar. Symmetry cancels dipoles; asymmetry creates a net dipole." }
  ],
  [
    { i: 'vs-f1', q: 'Shape of methane CH4?', a: 'Tetrahedral' },
    { i: 'vs-f2', q: 'Tetrahedral bond angle?', a: '109.5°' },
    { i: 'vs-f3', q: 'Shape of water H2O?', a: 'Bent (V-shaped)' },
    { i: 'vs-f4', q: 'Lone pairs repel more or less than bonding pairs?', a: 'More' },
    { i: 'vs-f5', q: 'VSEPR stands for?', a: 'Valence Shell Electron Pair Repulsion' }
  ],
  [
    { type: 'mcq', i: 'vs-q1', p: '2 bonds and 2 lone pairs gives which shape?', o: ['Linear', 'Bent', 'Tetrahedral', 'Trigonal planar'], a: 'b' },
    { type: 'ow', i: 'vs-q2', p: 'CO2 is linear and therefore?', a: 'Nonpolar' }
  ]
);

insertBeforeFinalAssessment('src/data/chemistry/atomic-periodic.ts', statesSub + '\n' + vsepSub);

// ========== 6. CHEMISTRY: Acids/Bases + Separation + Redox → Quantitative Chemistry ==========
const acidsSub = sub('acids-bases-salts-sub', 'Acids, Bases and Salt Formation',
  [
    { t: 'pH and Indicators', c: "pH measures hydrogen ion concentration. pH 7 is neutral, below 7 is acidic, above 7 is alkaline. Universal indicator gives a spectrum of colors. Strong acids fully ionize; weak acids partially ionize." },
    { t: 'Neutralization Reactions', c: "Acid + base → salt + water. Acid + metal → salt + hydrogen. Acid + carbonate → salt + water + CO2. The type of salt depends on the acid used: HCl → chlorides, H2SO4 → sulfates, HNO3 → nitrates." },
    { t: 'Titration', c: "Titration determines unknown concentration by reacting with a solution of known concentration. An indicator marks the endpoint. Volume and concentration data allow calculation using moles = concentration × volume." }
  ],
  [
    { i: 'ab-f1', q: 'pH 7 is?', a: 'Neutral' },
    { i: 'ab-f2', q: 'Acid + base produces?', a: 'Salt and water' },
    { i: 'ab-f3', q: 'Strong acids do what completely?', a: 'Ionize (dissociate)' },
    { i: 'ab-f4', q: 'HCl produces which type of salts?', a: 'Chlorides' },
    { i: 'ab-f5', q: 'What marks the endpoint in a titration?', a: 'Indicator color change' }
  ],
  [
    { type: 'mcq', i: 'ab-q1', p: 'A strong alkali has pH close to:', o: ['2', '5', '7', '13'], a: 'd' },
    { type: 'ow', i: 'ab-q2', p: 'Acid + carbonate produces salt, water and?', a: 'Carbon dioxide' }
  ]
);

const sepSub = sub('separation-techniques-sub', 'Separation Techniques',
  [
    { t: 'Physical Separation Methods', c: "Filtration separates insoluble solids from liquids. Evaporation/crystallization recovers dissolved solids. Distillation separates liquids with different boiling points. Chromatography separates dissolved substances by their affinity for a stationary phase." },
    { t: 'Choosing the Right Method', c: "The choice depends on the physical properties of the mixture components: particle size (filtration vs sieving), solubility (crystallization), boiling point (distillation), and solvent affinity (chromatography). Pure substances have sharp melting/boiling points." },
    { t: 'Fractional Distillation', c: "Used for miscible liquids with different boiling points. The mixture is heated; the component with the lowest boiling point evaporates first, condenses in the fractionating column, and is collected. Crude oil refining is a major industrial application." }
  ],
  [
    { i: 'sp-f1', q: 'Which method separates insoluble solid from liquid?', a: 'Filtration' },
    { i: 'sp-f2', q: 'Which method separates miscible liquids?', a: 'Fractional distillation' },
    { i: 'sp-f3', q: 'Chromatography separates by differences in?', a: 'Solubility and affinity' },
    { i: 'sp-f4', q: 'Pure substances have sharp what?', a: 'Melting and boiling points' },
    { i: 'sp-f5', q: 'What is evaporation used to obtain?', a: 'Dissolved solid (crystals)' }
  ],
  [
    { type: 'mcq', i: 'sp-q1', p: 'Paper chromatography separates by differences in:', o: ['Magnetism', 'Color only', 'Solubility and affinity', 'Atomic number'], a: 'c' },
    { type: 'ow', i: 'sp-q2', p: 'To get pure water from sea water, use?', a: 'Distillation' }
  ]
);

const redoxSub = sub('redox-equations-sub', 'Redox and Half-Equations',
  [
    { t: 'Oxidation and Reduction', c: "Oxidation Is Loss of electrons (OIL). Reduction Is Gain of electrons (RIG). In any redox reaction, one species is oxidized while another is reduced. The reducing agent donates electrons; the oxidizing agent accepts them." },
    { t: 'Half-Equations', c: "Half-equations show electron transfer explicitly. Oxidation half: species → ion + electrons (electrons on product side). Reduction half: ion + electrons → species (electrons on reactant side). Combining balanced half-equations gives the full ionic equation." },
    { t: 'Oxidation Numbers', c: "Oxidation number tracks electron ownership. Elements have 0. Ions equal their charge. In compounds, O is usually -2, H is +1. An increase in oxidation number means oxidation; a decrease means reduction." }
  ],
  [
    { i: 'rx-f1', q: 'OIL RIG stands for?', a: 'Oxidation Is Loss, Reduction Is Gain' },
    { i: 'rx-f2', q: 'In oxidation half-equations, electrons are on which side?', a: 'Product side' },
    { i: 'rx-f3', q: 'Oxidation number of oxygen is usually?', a: '-2' },
    { i: 'rx-f4', q: 'The reducing agent does what?', a: 'Donates electrons (gets oxidized)' },
    { i: 'rx-f5', q: 'Increase in oxidation number means?', a: 'Oxidation' }
  ],
  [
    { type: 'mcq', i: 'rx-q1', p: 'Cu2+ + 2e- → Cu is:', o: ['Oxidation', 'Reduction', 'Neutralization', 'Precipitation'], a: 'b' },
    { type: 'ow', i: 'rx-q2', p: 'Losing electrons increases oxidation?', a: 'Number' }
  ]
);

insertBeforeFinalAssessment('src/data/chemistry/quantitative-chemistry.ts', acidsSub + '\n' + sepSub + '\n' + redoxSub);

// ========== 7. CHEMISTRY: Equilibrium → Thermodynamics ==========
const eqSub = sub('chemical-equilibrium-sub', 'Chemical Equilibrium and Le Chatelier',
  [
    { t: 'Dynamic Equilibrium', c: "At equilibrium, forward and reverse reactions continue at equal rates — concentrations stay constant but reactions never stop. Equilibrium is only reached in closed systems." },
    { t: 'Le Chatelier Principle', c: "If conditions change, the equilibrium shifts to oppose the change. Increasing concentration of reactants shifts right (more products). Increasing temperature favors the endothermic direction. Pressure changes affect gaseous equilibria." },
    { t: 'Equilibrium Constants', c: "Kc expresses the ratio of product to reactant concentrations at equilibrium. A large Kc means products are favored. Kc only changes with temperature — catalysts and concentration changes do not alter Kc." }
  ],
  [
    { i: 'eq-f1', q: 'At dynamic equilibrium, rates are?', a: 'Equal (forward = reverse)' },
    { i: 'eq-f2', q: 'What principle predicts equilibrium shifts?', a: 'Le Chatelier' },
    { i: 'eq-f3', q: 'A catalyst changes Kc?', a: 'No — only temperature changes Kc' },
    { i: 'eq-f4', q: 'Increasing pressure favors the side with?', a: 'Fewer moles of gas' },
    { i: 'eq-f5', q: 'Cooling an exothermic reaction shifts equilibrium?', a: 'Toward products (right)' }
  ],
  [
    { type: 'mcq', i: 'eq-q1', p: 'For exothermic forward reaction, cooling favors:', o: ['Reactants', 'Products', 'No reaction', 'Catalyst removal'], a: 'b' },
    { type: 'ow', i: 'eq-q2', p: 'A catalyst changes equilibrium position?', a: 'No' }
  ]
);

insertBeforeFinalAssessment('src/data/chemistry/thermodynamics.ts', eqSub);

console.log('\n✅ All merges complete!');
