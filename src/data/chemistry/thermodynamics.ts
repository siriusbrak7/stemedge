import type { Topic } from '../types';

export const THERMODYNAMICS_TOPIC: Topic = {
id: 'thermodynamics',
title: 'Thermodynamics',
subtopics: [

{
id: 'energy-bonds',
title: 'Energy and Chemical Bonds',
lesson: { sections: [
{
title: 'Breaking Bonds Requires Energy',
content: 'Chemical bonds hold atoms together in molecules. To break a bond, you must supply energy — this is why bond breaking is endothermic (absorbs energy from the surroundings). When new bonds form, energy is released — bond making is exothermic. The overall enthalpy change for a reaction depends on the balance between energy absorbed to break bonds and energy released to form new bonds: ΔH = energy absorbed (breaking) − energy released (making). A common misconception is that bonds "store" energy — in fact, WEAK bonds have higher potential energy because less energy is needed to break them, and the resulting fragments are at a higher energy level. Strong bonds are lower in energy and more stable.',
interactive: {
type: 'reveal',
label: 'Common misconception explained',
hiddenContent: 'People say "bonds store energy" as if breaking a bond releases energy. Actually, BREAKING a bond always requires energy input. It is FORMING new, stronger bonds that releases energy. In combustion, the new bonds (C=O and H−O) are stronger than the old bonds (C−H and O=O), so more energy is released than absorbed — the reaction is exothermic overall.'
}
},
{
title: 'Bond Energy Calculations',
content: 'Bond energy (also called bond enthalpy) is the energy required to break one mole of a particular bond in the gas phase. To calculate ΔH for a reaction using bond energies: ΔH = Σ(bonds broken) − Σ(bonds formed). Bonds broken require energy (positive contribution). Bonds formed release energy (negative contribution, but we subtract them). Worked example: combustion of methane. CH₄ + 2O₂ → CO₂ + 2H₂O. Bond energies: C−H = 436 kJ/mol, O=O = 498 kJ/mol, C=O = 805 kJ/mol, H−O = 464 kJ/mol.',
interactive: {
type: 'reveal',
label: 'Step-by-step calculation',
hiddenContent: 'Bonds broken: 4 × C−H = 4 × 436 = 1744 kJ/mol. 2 × O=O = 2 × 498 = 996 kJ/mol. Total broken = 1744 + 996 = 2740 kJ/mol. Bonds formed: 2 × C=O = 2 × 805 = 1610 kJ/mol. 4 × H−O = 4 × 464 = 1856 kJ/mol. Total formed = 1610 + 1856 = 3466 kJ/mol. ΔH = 2740 − 3466 = −726 kJ/mol. The negative sign confirms the reaction is exothermic.'
}
},
{
title: 'WAEC Context: Fuels in Ghana',
content: 'In Ghana, common fuels include propane (LPG — liquefied petroleum gas, used for cooking), charcoal (carbon, used for outdoor cooking and grilling), and firewood (cellulose-based, used in rural areas). Comparing energy per gram: propane releases about 50.4 kJ/g, charcoal about 29.6 kJ/g, and firewood about 16 kJ/g. LPG is preferred for indoor cooking because it has a much higher energy density (more energy per gram), burns cleanly with minimal smoke, and does not produce dangerous levels of carbon monoxide when ventilation is adequate. Charcoal and firewood produce significant smoke and particulate matter, contributing to indoor air pollution — a major health concern in Ghanaian households that rely on traditional cookstoves.',
interactive: {
type: 'expand',
label: 'Why Ghana promotes LPG over charcoal',
hiddenContent: 'Ghana\'s National LPG Promotion Policy aims to shift at least 50% of households from wood fuels to LPG by 2030. The reasons: (1) LPG is 3× more energy-dense than firewood, (2) it produces almost no smoke or particulate matter, (3) it reduces deforestation — Ghana loses about 135,000 hectares of forest per year, partly due to charcoal production, (4) indoor air pollution from wood smoke causes respiratory diseases, especially affecting women and children who spend more time near cookstoves.'
}
}
] },
flashcards: [
{ id: 'eb-f1', question: 'Is bond breaking endothermic or exothermic?', answer: 'Endothermic (absorbs energy)' },
{ id: 'eb-f2', question: 'Is bond making endothermic or exothermic?', answer: 'Exothermic (releases energy)' },
{ id: 'eb-f3', question: 'What is the formula for ΔH using bond energies?', answer: 'ΔH = Σ(bonds broken) − Σ(bonds formed)' },
{ id: 'eb-f4', question: 'Do weak bonds or strong bonds have higher potential energy?', answer: 'Weak bonds have higher potential energy' },
{ id: 'eb-f5', question: 'Which Ghanaian cooking fuel has the highest energy per gram: LPG, charcoal, or firewood?', answer: 'LPG (propane, ~50.4 kJ/g)' }
],
checkpointAssessment: [
{
id: 'eb-q1',
type: 'mcq',
prompt: 'Which process is exothermic?',
options: [
{ id: 'a', text: 'Breaking a C−H bond' },
{ id: 'b', text: 'Breaking an O=O bond' },
{ id: 'c', text: 'Forming a C=O bond' },
{ id: 'd', text: 'Vaporising water' }
],
correctAnswer: 'c',
explanation: 'Bond formation always releases energy, so forming a C=O bond is exothermic. Bond breaking always requires energy (endothermic).'
},
{
id: 'eb-q2',
type: 'one-word',
prompt: 'In the bond energy formula ΔH = Σ(bonds broken) − Σ(bonds formed), if ΔH is negative the reaction is?',
correctAnswer: 'Exothermic',
hint: 'More energy released than absorbed'
},
{
id: 'eb-q3',
type: 'matching',
prompt: 'Match the fuel to its approximate energy per gram:',
pairs: [
{ left: 'LPG (propane)', right: '~50.4 kJ/g' },
{ left: 'Charcoal', right: '~29.6 kJ/g' },
{ left: 'Firewood', right: '~16 kJ/g' }
]
},
{
id: 'eb-q4',
type: 'mcq',
prompt: 'Why does LPG produce less indoor air pollution than charcoal?',
options: [
{ id: 'a', text: 'LPG burns at a lower temperature' },
{ id: 'b', text: 'LPG is a liquid so it cannot produce smoke' },
{ id: 'c', text: 'LPG burns more completely, producing mostly CO₂ and H₂O' },
{ id: 'd', text: 'LPG contains fewer carbon atoms than charcoal' }
],
correctAnswer: 'c',
explanation: 'LPG (propane) is a hydrocarbon that burns cleanly with sufficient oxygen, producing mainly CO₂ and H₂O. Charcoal often burns incompletely, producing CO, smoke, and particulate matter.'
}
]
},

{
id: 'hess-law',
title: "Hess's Law and Enthalpy Cycles",
lesson: { sections: [
{
title: 'The Law of Constant Heat Summation',
content: "Hess's Law states that the total enthalpy change for a reaction is the same regardless of the route taken, provided the initial and final conditions are the same. If you cannot measure ΔH directly for a reaction, you can use an indirect route via known reactions whose ΔH values are known. This is a direct consequence of enthalpy being a state function — it depends only on the starting and ending states, not on the path taken. Just as the altitude difference between Accra and Kumasi is the same whether you drive through Cape Coast or through Nkawkaw, the enthalpy change is the same by any route.",
interactive: {
type: 'reveal',
label: 'Why is enthalpy a state function?',
hiddenContent: 'Enthalpy (H) depends only on the current state of the system — its temperature, pressure, and composition. It does not depend on how the system reached that state. This is why ΔH is independent of the pathway. If enthalpy were path-dependent, Hess\'s Law would not hold and we could not calculate unknown ΔH values from known ones.'
}
},
{
title: 'Hess Cycle Construction',
content: "To construct a Hess cycle, draw the direct route (reactants → products) and an indirect route (reactants → elements → products). The indirect route uses standard enthalpies of formation (ΔHf⦰): ΔH(reaction) = Σ ΔHf⦰(products) − Σ ΔHf⦰(reactants). Remember: the ΔHf⦰ of any element in its standard state is zero. For a Hess cycle, write the target reaction at the top, and the constituent elements at the bottom. Arrows pointing down from elements to compounds represent formation (use ΔHf⦰ values). Arrows pointing up from compounds to elements represent the reverse of formation (use −ΔHf⦰ values).",
interactive: {
type: 'expand',
label: 'Worked WAEC example',
hiddenContent: 'Calculate ΔH for the reaction: CH₄ + 2O₂ → CO₂ + 2H₂O. Given ΔHf⦰ values: CH₄ = −74.8 kJ/mol, O₂ = 0 kJ/mol (element), CO₂ = −393.5 kJ/mol, H₂O = −285.8 kJ/mol. ΔH = [ΔHf⦰(CO₂) + 2 × ΔHf⦰(H₂O)] − [ΔHf⦰(CH₄) + 2 × ΔHf⦰(O₂)] = [(−393.5) + 2(−285.8)] − [(−74.8) + 2(0)] = (−393.5 − 571.6) − (−74.8) = −965.1 + 74.8 = −890.3 kJ/mol. The reaction is strongly exothermic — this is why methane (natural gas) is an excellent fuel.'
}
},
{
title: 'Practical Applications',
content: "Hess's Law is most useful when a reaction's ΔH cannot be measured directly — for example, because the reaction is too dangerous, too slow, or simply does not proceed cleanly to the desired product. A classic example: finding ΔH of formation of CO from C + ½O₂ → CO. You cannot measure this directly because burning carbon in limited oxygen produces a mixture of CO and CO₂ — you cannot stop the reaction at CO. However, you can measure two related reactions: (1) C + O₂ → CO₂, ΔH = −393.5 kJ/mol; (2) CO + ½O₂ → CO₂, ΔH = −283.0 kJ/mol. Using Hess's Law: ΔH(CO) = ΔH(1) − ΔH(2) = −393.5 − (−283.0) = −110.5 kJ/mol.",
interactive: {
type: 'reveal',
label: 'How to set up the cycle',
hiddenContent: 'Target: C + ½O₂ → CO (unknown ΔH). Route 1 (direct): C + ½O₂ → CO, ΔH = ?. Route 2 (indirect via CO₂): C + ½O₂ → CO₂ (but this uses 1 O₂, so we must adjust). Actually: Route 2a: C + O₂ → CO₂, ΔH = −393.5. Route 2b: CO₂ → CO + ½O₂, ΔH = +283.0 (reverse of reaction 2). Combine: C + O₂ + CO₂ → CO₂ + CO + ½O₂. Simplify: C + ½O₂ → CO. ΔH = −393.5 + 283.0 = −110.5 kJ/mol.'
}
}
] },
flashcards: [
{ id: 'hl-f1', question: 'State Hess\'s Law.', answer: 'The total enthalpy change for a reaction is the same regardless of the route taken' },
{ id: 'hl-f2', question: 'Why is enthalpy a state function?', answer: 'Because H depends only on the current state (T, P, composition), not on how the system reached that state' },
{ id: 'hl-f3', question: 'What is the ΔHf⦰ of an element in its standard state?', answer: '0 kJ/mol' },
{ id: 'hl-f4', question: 'Formula for ΔH using formation enthalpies?', answer: 'ΔH = Σ ΔHf⦰(products) − Σ ΔHf⦰(reactants)' },
{ id: 'hl-f5', question: 'Why can\'t we measure ΔHf⦰ of CO directly from C + ½O₂?', answer: 'Burning carbon produces a mixture of CO and CO₂; the reaction cannot be stopped at CO' }
],
checkpointAssessment: [
{
id: 'hl-q1',
type: 'mcq',
prompt: 'Hess\'s Law is a consequence of which property of enthalpy?',
options: [
{ id: 'a', text: 'Enthalpy is always negative' },
{ id: 'b', text: 'Enthalpy is a state function' },
{ id: 'c', text: 'Enthalpy depends on the reaction pathway' },
{ id: 'd', text: 'Enthalpy equals internal energy plus PV' }
],
correctAnswer: 'b',
explanation: 'Because enthalpy is a state function, ΔH depends only on the initial and final states, not the pathway. This means all routes give the same total ΔH, which is Hess\'s Law.'
},
{
id: 'hl-q2',
type: 'one-word',
prompt: 'The standard enthalpy of formation of an element in its standard state is?',
correctAnswer: '0',
hint: 'It is defined as the reference point'
},
{
id: 'hl-q3',
type: 'matching',
prompt: 'Match the quantity to its description:',
pairs: [
{ left: 'ΔHf⦰', right: 'Formation from elements' },
{ left: 'ΔHc⦰', right: 'Complete combustion' },
{ left: 'Hess\'s Law', right: 'ΔH is route-independent' }
]
},
{
id: 'hl-q4',
type: 'mcq',
prompt: 'Using ΔHf⦰ values: CH₄ = −74.8, CO₂ = −393.5, H₂O = −285.8 kJ/mol. What is ΔH for CH₄ + 2O₂ → CO₂ + 2H₂O?',
options: [
{ id: 'a', text: '+890.3 kJ/mol' },
{ id: 'b', text: '−890.3 kJ/mol' },
{ id: 'c', text: '−74.8 kJ/mol' },
{ id: 'd', text: '−679.3 kJ/mol' }
],
correctAnswer: 'b',
explanation: 'ΔH = [(−393.5) + 2(−285.8)] − [(−74.8) + 2(0)] = −965.1 + 74.8 = −890.3 kJ/mol.'
}
]
},

{
id: 'entropy-spontaneity',
title: 'Entropy and Spontaneous Change',
lesson: { sections: [
{
title: 'What is Entropy?',
content: 'Entropy (S) is a measure of the disorder or randomness of a system. Solids have low entropy because their particles are arranged in an ordered, fixed lattice. Liquids have medium entropy — particles can move past each other but are still close together. Gases have high entropy because particles move freely and randomly in all directions. Changes that increase entropy include: dissolving a solid (particles spread out), heating a substance (particles move faster and more randomly), and producing gas in a reaction (more disordered products). ΔS > 0 means entropy increases (more disorder); ΔS < 0 means entropy decreases (more order).',
interactive: {
type: 'expand',
label: 'Everyday examples of entropy increase',
hiddenContent: 'When you dissolve sugar in your Ghanaian tea, the ordered sugar crystal breaks apart and the molecules spread randomly through the liquid — entropy increases. When water evaporates from Lake Volta, molecules go from a relatively ordered liquid to a disordered gas — entropy increases. When you drop a glass and it shatters, the ordered structure becomes disordered pieces — entropy increases. Notice: the reverse of all these processes does not happen spontaneously — that is the arrow of entropy.'
}
},
{
title: 'Spontaneity: Gibbs Free Energy',
content: 'Whether a reaction happens spontaneously depends on both enthalpy (ΔH) and entropy (ΔS), combined in the Gibbs free energy equation: ΔG = ΔH − TΔS. A reaction is spontaneous when ΔG < 0. Three scenarios: (1) Exothermic (ΔH < 0) and entropy increase (ΔS > 0) → ΔG is always negative → always spontaneous. (2) Endothermic (ΔH > 0) and entropy increase (ΔS > 0) → spontaneous only at high temperatures where TΔS outweighs ΔH. (3) Exothermic (ΔH < 0) and entropy decrease (ΔS < 0) → spontaneous only at low temperatures where |ΔH| outweighs TΔS.',
interactive: {
type: 'reveal',
label: 'Why does ice melt at room temperature?',
hiddenContent: 'Ice melting: H₂O(s) → H₂O(l). ΔH = +6.01 kJ/mol (endothermic — absorbs heat). ΔS = +22.0 J/(mol·K) (entropy increases — liquid is more disordered than solid). At room temperature (298 K): TΔS = 298 × 0.0220 = 6.56 kJ/mol. ΔG = 6.01 − 6.56 = −0.55 kJ/mol. Since ΔG < 0, melting is spontaneous at room temperature. The entropy gain at 298 K is large enough to overcome the endothermic enthalpy change.'
}
},
{
title: 'WAEC Focus: Predicting Feasibility',
content: 'WAEC may ask: "Is this reaction feasible at 298 K?" To answer, calculate ΔG = ΔH − TΔS using the given ΔH and ΔS values. If ΔG < 0, the reaction is feasible (spontaneous); if ΔG > 0, it is not. Common pitfall: forgetting to convert ΔS from J/(mol·K) to kJ/(mol·K) before substituting into the Gibbs equation. Since ΔH is in kJ/mol, ΔS must also be in kJ/(mol·K) — divide the J/(mol·K) value by 1000. Example: Given ΔH = −92 kJ/mol and ΔS = −199 J/(mol·K) for N₂ + 3H₂ → 2NH₃. Convert ΔS: −199/1000 = −0.199 kJ/(mol·K). At 298 K: ΔG = −92 − 298(−0.199) = −92 + 59.3 = −32.7 kJ/mol. ΔG < 0, so the reaction is feasible at 298 K — this is the Haber process used in fertiliser production, critical for Ghana\'s agricultural sector.',
interactive: {
type: 'expand',
label: 'What happens at higher temperatures?',
hiddenContent: 'For the Haber process at 700 K: ΔG = −92 − 700(−0.199) = −92 + 139.3 = +47.3 kJ/mol. ΔG > 0, so the reaction is NOT spontaneous at 700 K. This explains a key industrial dilemma: the Haber process runs at ~700 K for faster kinetics (speed), even though thermodynamics favours lower temperatures. Engineers use the compromise of moderate temperature + high pressure + an iron catalyst. Ghana\'s fertiliser imports depend on this reaction being viable worldwide.'
}
}
] },
flashcards: [
{ id: 'es-f1', question: 'What is entropy?', answer: 'A measure of disorder or randomness in a system' },
{ id: 'es-f2', question: 'Which state of matter has the highest entropy?', answer: 'Gas (most disordered)' },
{ id: 'es-f3', question: 'State the Gibbs free energy equation.', answer: 'ΔG = ΔH − TΔS' },
{ id: 'es-f4', question: 'What condition makes a reaction spontaneous?', answer: 'ΔG < 0' },
{ id: 'es-f5', question: 'What is a common pitfall when calculating ΔG?', answer: 'Forgetting to convert ΔS from J/(mol·K) to kJ/(mol·K)' }
],
checkpointAssessment: [
{
id: 'es-q1',
type: 'mcq',
prompt: 'Which change produces the largest increase in entropy?',
options: [
{ id: 'a', text: 'Water freezing into ice' },
{ id: 'b', text: 'A gas condensing into a liquid' },
{ id: 'c', text: 'A solid dissolving to form a solution' },
{ id: 'd', text: 'Steam condensing into water' }
],
correctAnswer: 'c',
explanation: 'Dissolving a solid increases disorder as the ordered solid lattice breaks apart and particles spread through the solvent. Freezing, condensing, and condensing steam all decrease entropy.'
},
{
id: 'es-q2',
type: 'one-word',
prompt: 'A reaction with ΔG < 0 is described as?',
correctAnswer: 'Spontaneous',
hint: 'It happens without continuous external input'
},
{
id: 'es-q3',
type: 'matching',
prompt: 'Match the sign of ΔG to the scenario:',
pairs: [
{ left: 'ΔG < 0', right: 'Reaction is spontaneous' },
{ left: 'ΔG > 0', right: 'Reaction is not spontaneous' },
{ left: 'ΔG = 0', right: 'System at equilibrium' }
]
},
{
id: 'es-q4',
type: 'mcq',
prompt: 'For a reaction with ΔH = −50 kJ/mol and ΔS = +100 J/(mol·K) at 298 K, what is ΔG?',
options: [
{ id: 'a', text: '+79.8 kJ/mol' },
{ id: 'b', text: '−79.8 kJ/mol' },
{ id: 'c', text: '−20.2 kJ/mol' },
{ id: 'd', text: '+29.8 kJ/mol' }
],
correctAnswer: 'b',
explanation: 'Convert ΔS: 100/1000 = 0.100 kJ/(mol·K). ΔG = −50 − 298(0.100) = −50 − 29.8 = −79.8 kJ/mol. Spontaneous because ΔG < 0.'
}
]
}
        ,
      {
        id: 'chemical-equilibrium-sub',
      title: 'Chemical Equilibrium and Le Chatelier',
      lesson: { sections: [{ title: 'Dynamic Equilibrium', content: "At equilibrium, forward and reverse reactions continue at equal rates — concentrations stay constant but reactions never stop. Equilibrium is only reached in closed systems." }, { title: 'Le Chatelier Principle', content: "If conditions change, the equilibrium shifts to oppose the change. Increasing concentration of reactants shifts right (more products). Increasing temperature favors the endothermic direction. Pressure changes affect gaseous equilibria." }, { title: 'Equilibrium Constants', content: "Kc expresses the ratio of product to reactant concentrations at equilibrium. A large Kc means products are favored. Kc only changes with temperature — catalysts and concentration changes do not alter Kc." }] },
      flashcards: [{ id: 'eq-f1', question: 'At dynamic equilibrium, rates are?', answer: 'Equal (forward = reverse)' }, { id: 'eq-f2', question: 'What principle predicts equilibrium shifts?', answer: 'Le Chatelier' }, { id: 'eq-f3', question: 'A catalyst changes Kc?', answer: 'No — only temperature changes Kc' }, { id: 'eq-f4', question: 'Increasing pressure favors the side with?', answer: 'Fewer moles of gas' }, { id: 'eq-f5', question: 'Cooling an exothermic reaction shifts equilibrium?', answer: 'Toward products (right)' }],
      checkpointAssessment: [{ id: 'eq-q1', type: 'mcq' as const, prompt: 'For exothermic forward reaction, cooling favors:', options: [{ id: 'a', text: 'Reactants' }, { id: 'b', text: 'Products' }, { id: 'c', text: 'No reaction' }, { id: 'd', text: 'Catalyst removal' }], correctAnswer: 'b' }, { id: 'eq-q2', type: 'one-word' as const, prompt: 'A catalyst changes equilibrium position?', correctAnswer: 'No' }]
    }
        ],
        finalAssessment: [
{
id: 'th-final-1',
type: 'mcq',
prompt: 'In the combustion of methane, ΔH = −890 kJ/mol. What does the negative sign indicate?',
options: [
{ id: 'a', text: 'The reaction absorbs energy from the surroundings' },
{ id: 'b', text: 'The reaction releases energy to the surroundings' },
{ id: 'c', text: 'The reaction has a high activation energy' },
{ id: 'd', text: 'The reaction is not spontaneous' }
],
correctAnswer: 'b',
explanation: 'A negative ΔH means the reaction is exothermic — it releases energy to the surroundings. Combustion of methane releases 890 kJ per mole.'
},
{
id: 'th-final-2',
type: 'one-word',
prompt: 'Hess\'s Law works because enthalpy is a what kind of function?',
correctAnswer: 'State function',
hint: 'It depends only on initial and final states, not the pathway'
},
{
id: 'th-final-3',
type: 'matching',
prompt: 'Match the thermodynamic concept to its definition:',
pairs: [
{ left: 'Bond energy', right: 'Energy to break one mole of a bond' },
{ left: 'Hess\'s Law', right: 'ΔH is independent of route' },
{ left: 'Gibbs free energy', right: 'ΔG = ΔH − TΔS' }
]
}
]
};
