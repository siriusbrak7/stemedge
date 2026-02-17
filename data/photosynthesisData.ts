
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface StructureInfo {
    id: string;
    name: string;
    description: Record<DepthLevel, string>;
    funFact: string;
}

export interface Slide {
    id: number;
    title: string;
    content: string;
    focusPart?: string; // ID of structure to highlight
    interactive?: boolean; // If true, enables specific simulator
    simType?: 'diagram' | 'limiting' | 'pondweed' | 'equation';
}

export const LEAF_STRUCTURES: Record<string, StructureInfo> = {
    cuticle: {
        id: 'cuticle',
        name: 'Waxy Cuticle',
        description: {
            foundation: "A waterproof layer on top of the leaf.",
            medium: "A transparent, waxy layer that prevents water loss (transpiration) without blocking sunlight.",
            advanced: "Composed of cutin. It is thicker in plants living in dry environments (xerophytes) to conserve water."
        },
        funFact: "If you touch a shiny leaf, you are feeling the waxy cuticle!"
    },
    epidermis: {
        id: 'epidermis',
        name: 'Upper Epidermis',
        description: {
            foundation: "The skin of the leaf.",
            medium: "A single layer of transparent cells that lets light pass through to the palisade layer below.",
            advanced: "Does not contain chloroplasts. Acts as a protective barrier against mechanical injury and pathogens."
        },
        funFact: "It's like a clear window for the plant."
    },
    palisade: {
        id: 'palisade',
        name: 'Palisade Mesophyll',
        description: {
            foundation: "The main food factory of the leaf.",
            medium: "Cells packed with chloroplasts near the top of the leaf to absorb maximum light for photosynthesis.",
            advanced: "Column-shaped cells oriented vertically. Contains the highest density of chlorophyll per cell."
        },
        funFact: "These cells can move their chloroplasts around to catch the best light."
    },
    spongy: {
        id: 'spongy',
        name: 'Spongy Mesophyll',
        description: {
            foundation: "Cells with air spaces between them.",
            medium: "Loose tissue with air gaps to allow carbon dioxide to diffuse to the palisade cells.",
            advanced: "Large surface area for gas exchange. Also facilitates the movement of water vapor out of the leaf."
        },
        funFact: "The air spaces make leaves float on water."
    },
    stomata: {
        id: 'stomata',
        name: 'Stomata & Guard Cells',
        description: {
            foundation: "Tiny holes that let air in and out.",
            medium: "Pores on the bottom of the leaf controlled by guard cells. They let CO2 in and O2 out.",
            advanced: "Guard cells swell (turgid) to open stomata and shrink (flaccid) to close them, regulating gas exchange and water loss."
        },
        funFact: "A single leaf can have thousands of these tiny mouths."
    },
    vascular: {
        id: 'vascular',
        name: 'Vascular Bundle (Vein)',
        description: {
            foundation: "Tubes that carry water and food.",
            medium: "Contains Xylem (brings water) and Phloem (carries away sugar/food).",
            advanced: "Xylem vessels are dead, hollow tubes strengthened by lignin. Phloem consists of living sieve tubes that transport sucrose (translocation)."
        },
        funFact: "The veins you see on a leaf are actually these bundles."
    }
};

export const PHOTOSYNTHESIS_SLIDES: Slide[] = [
    { id: 0, title: "The Equation of Life", content: "Photosynthesis is how plants make their own food using sunlight. Water + Carbon Dioxide → Glucose + Oxygen.", simType: 'equation', interactive: true },
    { id: 1, title: "Inside the Leaf", content: "Leaves are designed like solar panels. Explore the cross-section to see the layers involved.", simType: 'diagram', focusPart: 'cuticle' },
    { id: 2, title: "The Solar Cells", content: "The Palisade Layer is packed with chloroplasts near the surface to catch light.", simType: 'diagram', focusPart: 'palisade' },
    { id: 3, title: "Gas Exchange System", content: "Plants need CO2. It enters through tiny holes called Stomata, usually on the underside.", simType: 'diagram', focusPart: 'stomata' },
    { id: 4, title: "Transport Network", content: "Water comes from roots via the Xylem. Sugars made here leave via the Phloem.", simType: 'diagram', focusPart: 'vascular' },
    { id: 5, title: "Limiting Factors: Light", content: "Light drives the reaction. As light increases, photosynthesis gets faster, until it maxes out.", simType: 'limiting', interactive: true },
    { id: 6, title: "Limiting Factors: CO2 & Temp", content: "CO2 is raw material. Temperature affects enzymes. Too hot, and the enzymes stop working!", simType: 'limiting', interactive: true },
    { id: 7, title: "Mineral Requirements", content: "Plants need Nitrogen for proteins (growth) and Magnesium to make green chlorophyll.", simType: 'diagram', interactive: false }, // Use diagram as backdrop
    { id: 8, title: "Practical: Pondweed", content: "We can measure photosynthesis speed by counting oxygen bubbles from an underwater plant.", simType: 'pondweed', interactive: true },
    { id: 9, title: "Knowledge Check", content: "Balance the limiting factors to reach maximum efficiency without overheating the plant.", simType: 'limiting', interactive: true }
];
