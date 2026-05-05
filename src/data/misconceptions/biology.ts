import { Misconception } from '../../components/shared/MisconceptionAlert';

export type { Misconception };

export const CELL_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'cell-wall-animal',
    title: 'Animal Cells Have Cell Walls',
    misconception: 'Animal cells have cell walls like plant cells do.',
    correction: 'Animal cells do NOT have cell walls. They only have a cell membrane.',
    explanation: 'Plant cells have a rigid cell wall made of cellulose that provides structural support. Animal cells lack this structure, which is why they can change shape more easily. This is why animal cells burst in hypotonic solutions while plant cells become turgid but do not burst.',
    examples: [
      'A red blood cell in distilled water will burst because it lacks a cell wall to prevent excessive water uptake.',
      'Plant cells can maintain their shape due to the cell wall, even when the cell membrane shrinks during plasmolysis.',
    ],
    relatedTopic: 'cell-membrane-transport',
    difficulty: 'common',
  },
  {
    id: 'vacuole-animal',
    title: 'Animal Cells Have Large Vacuoles',
    misconception: 'Animal cells have large central vacuoles like plant cells.',
    correction: 'Animal cells have small, temporary vacuoles (vesicles), not large permanent central vacuoles.',
    explanation: 'Plant cells have a large central vacuole that can occupy up to 90% of the cell volume, storing water and maintaining turgor pressure. Animal cells have small, temporary vesicles for storage and transport, not a permanent large vacuole.',
    examples: [
      'The large vacuole in plant cells pushes other organelles to the edges.',
      'Animal cells use vesicles to transport materials within the cell.',
    ],
    relatedTopic: 'cell-structure',
    difficulty: 'common',
  },
  {
    id: 'chloroplast-animal',
    title: 'Animal Cells Can Photosynthesize',
    misconception: 'Animal cells can perform photosynthesis if they have enough sunlight.',
    correction: 'Animal cells cannot perform photosynthesis because they lack chloroplasts.',
    explanation: 'Photosynthesis requires chloroplasts, organelles found only in plant cells and some protists. Animal cells cannot create their own food and must obtain energy by consuming other organisms.',
    examples: [
      'Humans cannot survive on sunlight alone - we need to eat food for energy.',
      'Only plant cells and some bacteria can perform photosynthesis.',
    ],
    relatedTopic: 'photosynthesis',
    difficulty: 'moderate',
  },
  {
    id: 'nucleus-brain',
    title: 'The Nucleus Controls Everything',
    misconception: 'The nucleus controls all cell activities directly, like a brain.',
    correction: 'The nucleus contains DNA and controls protein synthesis, but cell activities are regulated by many organelles working together.',
    explanation: 'While the nucleus contains genetic instructions, it does not directly control moment-to-moment cell activities. The cell membrane controls what enters and leaves, mitochondria produce energy, ribosomes build proteins, and many signaling pathways regulate cell function.',
    examples: [
      'Cells without nuclei (like red blood cells) can still function for a limited time.',
      'Mitochondria have their own DNA and some independence.',
    ],
    relatedTopic: 'cell-structure',
    difficulty: 'moderate',
  },
  {
    id: 'osmosis-diffusion',
    title: 'Osmosis and Diffusion Are the Same',
    misconception: 'Osmosis and diffusion are different words for the same process.',
    correction: 'Diffusion is the movement of any particles from high to low concentration. Osmosis is specifically the movement of WATER across a semi-permeable membrane.',
    explanation: 'Diffusion applies to all types of particles (solutes and solvents). Osmosis is a specific type of diffusion that only involves water moving across a semi-permeable membrane. This distinction matters because water can pass through membranes differently than other molecules.',
    examples: [
      'Perfume spreading through air is diffusion, not osmosis.',
      'Water entering a plant cell root is osmosis.',
    ],
    relatedTopic: 'cell-membrane-transport',
    difficulty: 'common',
  },
  {
    id: 'hypotonic-hypertonic',
    title: 'Hypotonic and Hypertonic Confusion',
    misconception: 'A hypotonic solution has more solute than the cell.',
    correction: 'A hypotonic solution has LESS solute (more water) than the cell. Hyper means MORE solute.',
    explanation: 'Think of it from the cell\'s perspective: HYPOtonic = LOW solute outside (water enters). HYPERtonic = HIGH solute outside (water leaves). A helpful mnemonic: "A hippo (hypo) likes to soak in water" - water goes INTO the cell in hypotonic solutions.',
    examples: [
      'Pure water is hypotonic - water enters cells, potentially causing them to burst.',
      'Seawater is hypertonic - water leaves cells, causing them to shrink.',
    ],
    relatedTopic: 'cell-membrane-transport',
    difficulty: 'common',
  },
  {
    id: 'mitochondria-only-energy',
    title: 'Mitochondria Only Produce Energy',
    misconception: 'Mitochondria only function is to make ATP.',
    correction: 'Mitochondria have multiple functions including ATP production, calcium storage, heat generation, and regulating cell death (apoptosis).',
    explanation: 'While ATP production is the main function, mitochondria also play crucial roles in cellular signaling, heat production in brown fat, calcium homeostasis, and initiating programmed cell death. They are essential for more than just energy.',
    examples: [
      'Brown adipose tissue mitochondria specialize in heat production.',
      'Mitochondria release cytochrome c to trigger apoptosis.',
    ],
    relatedTopic: 'cell-respiration',
    difficulty: 'rare',
  },
  {
    id: 'all-cells-same',
    title: 'All Cells Look the Same',
    misconception: 'All animal cells look like the diagram in the textbook.',
    correction: 'Cells have highly varied shapes and sizes depending on their function.',
    explanation: 'Textbook diagrams show "typical" cells, but real cells vary enormously. Red blood cells are biconcave discs, nerve cells have long extensions, muscle cells are elongated fibers, and white blood cells can change shape to engulf pathogens.',
    examples: [
      'A nerve cell can be over 1 meter long.',
      'An ostrich egg is a single cell visible without a microscope.',
    ],
    relatedTopic: 'cell-specialization',
    difficulty: 'moderate',
  },
];

export const MEMBRANE_TRANSPORT_MISCONCEPTIONS: Misconception[] = [
  {
    id: 'passive-energy',
    title: 'Passive Transport Requires No Conditions',
    misconception: 'Passive transport always happens regardless of conditions.',
    correction: 'Passive transport only occurs when there is a concentration gradient (higher concentration on one side).',
    explanation: 'Passive transport moves particles from high to low concentration without energy, but it requires a gradient. Once equilibrium is reached, net movement stops. At equilibrium, particles still move but there is no net change.',
    examples: [
      'Oxygen enters cells because there is higher O2 concentration outside.',
      'At equilibrium, particles still move but equal numbers move each direction.',
    ],
    relatedTopic: 'cell-membrane-transport',
    difficulty: 'common',
  },
  {
    id: 'membrane-solid',
    title: 'The Cell Membrane Is Solid',
    misconception: 'The cell membrane is a solid, rigid structure.',
    correction: 'The cell membrane is a fluid, dynamic structure described by the fluid mosaic model.',
    explanation: 'The cell membrane is flexible and constantly moving. Phospholipids move laterally within the membrane, and proteins can drift like icebergs in a sea of lipids. This fluidity is essential for membrane function.',
    examples: [
      'Cells can change shape because the membrane is fluid.',
      'Cholesterol in animal cell membranes helps maintain proper fluidity.',
    ],
    relatedTopic: 'cell-membrane',
    difficulty: 'moderate',
  },
];

export const ALL_BIOLOGY_MISCONCEPTIONS = [
  ...CELL_MISCONCEPTIONS,
  ...MEMBRANE_TRANSPORT_MISCONCEPTIONS,
];
