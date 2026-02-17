export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface OrganelleInfo {
    id: string;
    name: string;
    description: Record<DepthLevel, string>;
    funFact: string;
    type: 'animal' | 'plant' | 'both';
    videoUrl?: string; // Placeholder
}

export interface Slide {
    id: number;
    title: string;
    content: string;
    focusOrganelle?: string; // ID of organelle to highlight
    interactive?: boolean; // If true, encourages clicking diagram
}

export const ORGANELLES: Record<string, OrganelleInfo> = {
    nucleus: {
        id: 'nucleus',
        name: 'Nucleus',
        description: {
            foundation: "The control center of the cell. It acts like the brain.",
            medium: "Contains the cell's genetic material (DNA) and controls the cell's activities like growth and reproduction.",
            advanced: "Double-membrane bound organelle containing chromatin. It is the site of DNA replication and transcription (RNA synthesis)."
        },
        funFact: "Red blood cells expel their nucleus to make more room for oxygen!",
        type: 'both'
    },
    mitochondria: {
        id: 'mitochondria',
        name: 'Mitochondria',
        description: {
            foundation: "The powerhouse of the cell. It makes energy.",
            medium: "Performs cellular respiration to convert nutrients into energy (ATP) that the cell can use.",
            advanced: "Double-membrane structure with inner folds called cristae. Site of the Krebs cycle and electron transport chain."
        },
        funFact: "Mitochondria have their own separate DNA, inherited only from your mother.",
        type: 'both'
    },
    ribosomes: {
        id: 'ribosomes',
        name: 'Ribosomes',
        description: {
            foundation: "Tiny factories that make proteins.",
            medium: "Small structures that synthesize proteins by linking amino acids together.",
            advanced: "Complexes of RNA and protein found in the cytoplasm or attached to the Rough ER. They perform translation of mRNA."
        },
        funFact: "A single cell can contain up to 10 million ribosomes.",
        type: 'both'
    },
    chloroplast: {
        id: 'chloroplast',
        name: 'Chloroplast',
        description: {
            foundation: "Green parts in plants that make food from sunlight.",
            medium: "The site of photosynthesis. Converts light energy into sugars (glucose) for the plant.",
            advanced: "Contains thylakoids stacked into grana. The pigment chlorophyll captures light energy to drive the fixation of CO2."
        },
        funFact: "Chloroplasts can move around inside the cell to get the best sunlight exposure.",
        type: 'plant'
    },
    cell_membrane: {
        id: 'cell_membrane',
        name: 'Cell Membrane',
        description: {
            foundation: "The skin of the cell. Controls what goes in and out.",
            medium: "A flexible barrier that separates the cell from its surroundings and regulates transport.",
            advanced: "A phospholipid bilayer with embedded proteins (fluid mosaic model). selectively permeable via channels, pumps, and receptors."
        },
        funFact: "The membrane is fluid, having the consistency of olive oil.",
        type: 'both'
    },
    cell_wall: {
        id: 'cell_wall',
        name: 'Cell Wall',
        description: {
            foundation: "A hard outer layer found only in plants.",
            medium: "Provides structural support and protection for plant cells, located outside the membrane.",
            advanced: "Composed mainly of cellulose in plants (chitin in fungi). Provides rigidity and prevents lysis due to osmotic pressure."
        },
        funFact: "Wood is mostly made of the cell walls of dead tree cells.",
        type: 'plant'
    },
    vacuole: {
        id: 'vacuole',
        name: 'Large Vacuole',
        description: {
            foundation: "A storage bag for water and waste.",
            medium: "Large central sac in plants that stores water, nutrients, and waste products.",
            advanced: "Maintains turgor pressure against the cell wall. Enclosed by a membrane called the tonoplast."
        },
        funFact: "In a plant cell, the vacuole can take up 90% of the cell's volume.",
        type: 'plant'
    },
    cytoplasm: {
        id: 'cytoplasm',
        name: 'Cytoplasm',
        description: {
            foundation: "The jelly that fills the cell.",
            medium: "The gel-like substance where organelles float and chemical reactions occur.",
            advanced: "Consists of cytosol (fluid) and the cytoskeleton. Facilitates intracellular transport and metabolic pathways like glycolysis."
        },
        funFact: "It's always moving! This flow is called cytoplasmic streaming.",
        type: 'both'
    }
};

export const LESSON_SLIDES: Slide[] = [
    { id: 0, title: "What is a Cell?", content: "Cells are the basic building blocks of all living things. Just like bricks make a wall, cells make up tissues, organs, and you!", interactive: false },
    { id: 1, title: "Plant vs. Animal", content: "Not all cells are the same. Plant cells have extra structures like a hard wall and green chloroplasts. Animal cells are more flexible.", interactive: true },
    { id: 2, title: "The Command Center", content: "The Nucleus is the boss. It holds the DNA instructions for building and operating the cell.", focusOrganelle: "nucleus" },
    { id: 3, title: "Powering Up", content: "Mitochondria take food and turn it into energy (ATP). Active cells like muscles have thousands of them.", focusOrganelle: "mitochondria" },
    { id: 4, title: "Protein Factories", content: "Ribosomes build proteins, which do most of the work in the cell. They can float free or stick to the ER.", focusOrganelle: "ribosomes" },
    { id: 5, title: "The Gatekeeper", content: "The Cell Membrane controls what enters (like food) and what leaves (like waste).", focusOrganelle: "cell_membrane" },
    { id: 6, title: "Plant Exclusives", content: "Plants need to stand tall and make food. The Cell Wall provides armor, and Chloroplasts make solar power.", focusOrganelle: "chloroplast" },
    { id: 7, title: "Storage Space", content: "The Large Vacuole in plants stores water. When it's full, the plant stands upright. When empty, the plant wilts.", focusOrganelle: "vacuole" },
    { id: 8, title: "The Jelly Inside", content: "Cytoplasm fills the space. It's not just water—it's a busy chemical soup where life happens.", focusOrganelle: "cytoplasm" },
    { id: 9, title: "Knowledge Check", content: "Explore the diagram freely. Can you identify the differences between the plant and animal structures?", interactive: true }
];