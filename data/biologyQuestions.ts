import { Question } from '../types';

export interface TopicSection {
    id: string;
    name: string;
    grade_level: string;
    standards: string[];
    questions: Question[];
}

export const BIOLOGY_QUESTION_BANK: TopicSection[] = [
    {
        id: "cell_biology",
        name: "Cell Biology",
        grade_level: "9-10",
        standards: ["NGSS: LS1.A", "CAIE: 1.1", "IB: 2.1"],
        questions: [
            {
                id: "cell_001",
                text: "Which structure controls the passage of substances into and out of a typical animal cell?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Cell wall", "Cell membrane", "Nuclear membrane", "Cytoplasm"],
                correctAnswer: "Cell membrane",
                explanation: "The cell membrane is partially permeable and controls what enters and leaves the cell. Cell wall is found in plant cells only.",
                misconception: "Students often confuse cell membrane with cell wall.",
                standards: ["NGSS: LS1.A", "CAIE: 1.1.1"],
                bloomsLevel: "remembering",
                timeEstimate: 45
            },
            {
                id: "cell_002",
                text: "What is the primary function of ribosomes?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Photosynthesis", "Protein synthesis", "Respiration", "Digestion"],
                correctAnswer: "Protein synthesis",
                explanation: "Ribosomes are the site of protein synthesis in the cell.",
                misconception: "Confusing ribosomes with mitochondria (respiration).",
                standards: ["CAIE: 1.1.2"],
                bloomsLevel: "remembering",
                timeEstimate: 30
            },
            {
                id: "cell_003",
                text: "Which feature is found in plant cells but NOT in animal cells?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Mitochondria", "Nucleus", "Large central vacuole", "Cell membrane"],
                correctAnswer: "Large central vacuole",
                explanation: "Plant cells typically have a large central vacuole, cell wall, and chloroplasts, which animal cells lack.",
                misconception: "Thinking animal cells have cell walls.",
                standards: ["CAIE: 1.1.3"],
                bloomsLevel: "understanding",
                timeEstimate: 45
            },
            {
                id: "cell_004",
                text: "Calculate the magnification if an image size is 10mm and the actual size is 0.1mm.",
                type: "multiple_choice",
                difficulty: 3,
                options: ["×10", "×100", "×1000", "×0.01"],
                correctAnswer: "×100",
                explanation: "Magnification = Image Size / Actual Size. 10mm / 0.1mm = 100.",
                misconception: "Dividing actual by image size.",
                standards: ["CAIE: 1.2.1"],
                bloomsLevel: "applying",
                timeEstimate: 60
            },
             {
                id: "cell_005",
                text: "Which cell is adapted for transmitting nerve impulses?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Red blood cell", "Ciliated cell", "Neuron", "Root hair cell"],
                correctAnswer: "Neuron",
                explanation: "Neurons are elongated and branched to transmit electrical impulses rapidly.",
                misconception: "Confusing with other specialized cells.",
                standards: ["CAIE: 1.3.1"],
                bloomsLevel: "understanding",
                timeEstimate: 30
            }
        ]
    },
    {
        id: "movement",
        name: "Movement In/Out of Cells",
        grade_level: "9-10",
        standards: ["CAIE: 2.1", "IB: 1.4"],
        questions: [
            {
                id: "move_001",
                text: "Define diffusion.",
                type: "multiple_choice",
                difficulty: 2,
                options: [
                    "Movement of water from high to low potential",
                    "Net movement of particles from high to low concentration",
                    "Movement of particles against concentration gradient",
                    "Movement requiring ATP"
                ],
                correctAnswer: "Net movement of particles from high to low concentration",
                explanation: "Diffusion is the passive net movement of particles down a concentration gradient.",
                misconception: "Confusing diffusion with osmosis (water only) or active transport.",
                standards: ["CAIE: 2.1.1"],
                bloomsLevel: "remembering",
                timeEstimate: 45
            },
            {
                id: "move_002",
                text: "What happens to a plant cell in a hypertonic solution (concentrated sugar solution)?",
                type: "multiple_choice",
                difficulty: 4,
                options: ["It bursts", "It becomes turgid", "It undergoes plasmolysis", "It swells"],
                correctAnswer: "It undergoes plasmolysis",
                explanation: "Water leaves the cell by osmosis, causing the cytoplasm to pull away from the cell wall (plasmolysis).",
                misconception: "Thinking the cell bursts (only animal cells burst in hypotonic solutions).",
                standards: ["CAIE: 2.1.3"],
                bloomsLevel: "analyzing",
                timeEstimate: 60
            },
            {
                id: "move_003",
                text: "Which process requires energy from respiration?",
                type: "multiple_choice",
                difficulty: 3,
                options: ["Diffusion", "Osmosis", "Active transport", "Evaporation"],
                correctAnswer: "Active transport",
                explanation: "Active transport moves substances against a concentration gradient using energy from ATP.",
                misconception: "Thinking osmosis requires energy.",
                standards: ["CAIE: 2.1.4"],
                bloomsLevel: "understanding",
                timeEstimate: 45
            }
        ]
    },
    {
        id: "enzymes",
        name: "Enzymes",
        grade_level: "9-10",
        standards: ["CAIE: 5.1", "NGSS: LS1.A"],
        questions: [
            {
                id: "enzyme_001",
                text: "A student investigates the effect of temperature on an enzyme-controlled reaction. At 60°C, no product forms. What is the most likely explanation?",
                type: "multiple_choice",
                difficulty: 3,
                options: [
                    "The enzyme has been used up",
                    "The substrate has denatured",
                    "The enzyme has denatured",
                    "The reaction has reached equilibrium"
                ],
                correctAnswer: "The enzyme has denatured",
                explanation: "Enzymes are proteins that denature at high temperatures. The active site changes shape.",
                misconception: "Enzymes are 'used up' or substrate denatures.",
                standards: ["NGSS: LS1.A", "CAIE: 5.1.2"],
                bloomsLevel: "applying",
                timeEstimate: 60
            },
            {
                id: "enzyme_002",
                text: "Enzymes function as biological:",
                type: "multiple_choice",
                difficulty: 1,
                options: ["Substrates", "Products", "Catalysts", "Hormones"],
                correctAnswer: "Catalysts",
                explanation: "Enzymes speed up metabolic reactions without being changed themselves.",
                misconception: "Enzymes are reactants.",
                standards: ["CAIE: 5.1.1"],
                bloomsLevel: "remembering",
                timeEstimate: 30
            }
        ]
    },
    {
        id: "plant_nutrition",
        name: "Plant Nutrition",
        grade_level: "9-10",
        standards: ["CAIE: 6.1", "NGSS: LS1.C"],
        questions: [
            {
                id: "plant_001",
                text: "What is the correct chemical equation for photosynthesis?",
                type: "multiple_choice",
                difficulty: 3,
                options: [
                    "6CO2 + 6H2O → C6H12O6 + 6O2",
                    "C6H12O6 + 6O2 → 6CO2 + 6H2O",
                    "CO2 + H2O → CH2O + O2",
                    "6O2 + 6H2O → C6H12O6 + 6CO2"
                ],
                correctAnswer: "6CO2 + 6H2O → C6H12O6 + 6O2",
                explanation: "Carbon dioxide and water produce glucose and oxygen using light energy.",
                misconception: "Confusing with respiration (the reverse).",
                standards: ["NGSS: LS1.C", "CAIE: 6.1.1"],
                bloomsLevel: "remembering",
                timeEstimate: 45
            },
            {
                id: "plant_002",
                text: "Magnesium is required in plants for the formation of:",
                type: "multiple_choice",
                difficulty: 3,
                options: ["Cell walls", "Chlorophyll", "Amino acids", "Starch"],
                correctAnswer: "Chlorophyll",
                explanation: "Magnesium ions are the central component of the chlorophyll molecule.",
                misconception: "Thinking magnesium is for cell walls (that's cellulose) or proteins (nitrates).",
                standards: ["CAIE: 6.1.2"],
                bloomsLevel: "remembering",
                timeEstimate: 45
            }
        ]
    },
    {
        id: "animal_nutrition",
        name: "Animal Nutrition",
        grade_level: "9-10",
        standards: ["CAIE: 7.1"],
        questions: [
            {
                id: "anim_001",
                text: "Where is bile produced?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Gallbladder", "Pancreas", "Liver", "Stomach"],
                correctAnswer: "Liver",
                explanation: "Bile is produced in the liver and stored in the gallbladder.",
                misconception: "Thinking bile is produced in the gallbladder.",
                standards: ["CAIE: 7.1.5"],
                bloomsLevel: "remembering",
                timeEstimate: 30
            },
            {
                id: "anim_002",
                text: "Which enzyme breaks down starch?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Protease", "Lipase", "Amylase", "Pepsin"],
                correctAnswer: "Amylase",
                explanation: "Amylase breaks down starch into simpler sugars.",
                misconception: "Confusing amylase with protease.",
                standards: ["CAIE: 7.1.6"],
                bloomsLevel: "remembering",
                timeEstimate: 30
            }
        ]
    },
    {
        id: "inheritance",
        name: "Inheritance",
        grade_level: "9-10",
        standards: ["NGSS: LS3.B", "CAIE: 17.1"],
        questions: [
            {
                id: "inheritance_001",
                text: "In pea plants, tall stem (T) is dominant over short stem (t). A cross between two heterozygous tall plants (Tt × Tt) produces 400 offspring. Approximately how many would be expected to be short?",
                type: "multiple_choice",
                difficulty: 4,
                options: ["0", "100", "200", "300"],
                correctAnswer: "100",
                explanation: "The phenotypic ratio is 3 Tall : 1 Short. 1/4 of 400 is 100.",
                misconception: "Calculating 50% or thinking all are tall.",
                standards: ["NGSS: LS3.B", "CAIE: 17.1.3"],
                bloomsLevel: "analyzing",
                timeEstimate: 90
            },
            {
                id: "inheritance_002",
                text: "Which term describes an organism with two identical alleles for a particular gene?",
                type: "multiple_choice",
                difficulty: 2,
                options: ["Heterozygous", "Homozygous", "Dominant", "Recessive"],
                correctAnswer: "Homozygous",
                explanation: "Homozygous means having identical alleles (e.g., TT or tt).",
                misconception: "Confusing homozygous with heterozygous.",
                standards: ["CAIE: 17.1.1"],
                bloomsLevel: "remembering",
                timeEstimate: 30
            }
        ]
    },
     {
        id: "ecology",
        name: "Ecology",
        grade_level: "9-10",
        standards: ["NGSS: LS2.A", "CAIE: 19.1"],
        questions: [
            {
                id: "ecology_001",
                text: "In a food chain, what is the role of the organism at the first trophic level?",
                type: "multiple_choice",
                difficulty: 1,
                options: ["Primary consumer", "Secondary consumer", "Producer", "Decomposer"],
                correctAnswer: "Producer",
                explanation: "Producers (plants/algae) start the food chain by synthesizing energy.",
                misconception: "Starting with consumers.",
                standards: ["NGSS: LS2.A", "CAIE: 19.1.1"],
                bloomsLevel: "understanding",
                timeEstimate: 30
            },
            {
                id: "ecology_002",
                text: "Why is energy lost between trophic levels?",
                type: "multiple_choice",
                difficulty: 3,
                options: ["Photosynthesis", "Respiration and heat loss", "Reproduction", "Growth"],
                correctAnswer: "Respiration and heat loss",
                explanation: "Only about 10% of energy is passed on; the rest is lost mainly as heat from respiration and undigested waste.",
                misconception: "Energy is lost through photosynthesis or just disappears.",
                standards: ["CAIE: 19.1.3"],
                bloomsLevel: "understanding",
                timeEstimate: 60
            }
        ]
    }
];
