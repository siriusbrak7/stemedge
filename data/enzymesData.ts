
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface EnzymeConcept {
    id: string;
    title: string;
    description: Record<DepthLevel, string>;
    analogy: string;
}

export interface Slide {
    id: number;
    title: string;
    content: string;
    focusConcept?: string;
    interactive?: boolean;
    simType?: 'lock_key' | 'temperature' | 'ph_graph' | 'matching' | 'concept';
}

export const ENZYME_CONCEPTS: Record<string, EnzymeConcept> = {
    active_site: {
        id: 'active_site',
        title: 'The Active Site',
        description: {
            foundation: "A special shape on the enzyme where the reaction happens. Only the right key fits.",
            medium: "The region on the enzyme's surface with a specific 3D shape complementary to the substrate.",
            advanced: "A cleft or pocket formed by the folding of the polypeptide chain. Contains catalytic residues that lower activation energy."
        },
        analogy: "Like the keyhole in a door lock."
    },
    specificity: {
        id: 'specificity',
        title: 'Specificity',
        description: {
            foundation: "Each enzyme only works on one type of food or molecule.",
            medium: "Enzymes are specific because their active site shape matches only one substrate.",
            advanced: "Specificity is determined by the tertiary structure of the protein. The 'Induced Fit' model suggests the active site molds around the substrate."
        },
        analogy: "A key that opens your front door won't start your car."
    },
    denaturation: {
        id: 'denaturation',
        title: 'Denaturation',
        description: {
            foundation: "When an enzyme gets too hot, it breaks and changes shape. It stops working forever.",
            medium: "High temperatures or extreme pH break bonds holding the enzyme together. The active site loses its shape.",
            advanced: "Thermal energy disrupts hydrogen and ionic bonds/disulfide bridges in the tertiary structure. The substrate can no longer bind (ES complexes cannot form)."
        },
        analogy: "Like boiling an egg—you can't turn it back into a raw liquid egg."
    },
    collision: {
        id: 'collision',
        title: 'Collision Theory',
        description: {
            foundation: "Enzymes and food need to bump into each other to react.",
            medium: "More heat means particles move faster, leading to more frequent collisions.",
            advanced: "Rate of reaction depends on the frequency of effective collisions between enzyme and substrate with sufficient activation energy."
        },
        analogy: "Like a busy dance floor—more people moving fast means more bumps."
    }
};

export const ENZYME_SLIDES: Slide[] = [
    { id: 0, title: "Biological Catalysts", content: "Enzymes are proteins that speed up chemical reactions in living things. Without them, life would be too slow to exist!", simType: 'concept', focusConcept: 'active_site' },
    { id: 1, title: "Lock and Key Model", content: "Enzymes have a specific shape. The molecule they work on (substrate) fits perfectly into the 'Active Site'.", simType: 'lock_key', interactive: true },
    { id: 2, title: "Induced Fit", content: "In reality, the active site squeezes the substrate slightly—like a handshake—to help the reaction happen.", simType: 'lock_key', focusConcept: 'specificity' },
    { id: 3, title: "Effect of Temperature", content: "Heat gives molecules energy. They move faster and collide more often. But what happens if it gets TOO hot?", simType: 'temperature', interactive: true },
    { id: 4, title: "Denaturation", content: "At high temperatures, the enzyme vibrates so much it loses its shape. The 'key' no longer fits. This is permanent.", simType: 'temperature', focusConcept: 'denaturation' },
    { id: 5, title: "Effect of pH", content: "Enzymes prefer a specific pH. Stomach enzymes like acidic conditions; mouth enzymes like neutral ones.", simType: 'ph_graph', interactive: true },
    { id: 6, title: "Substrate Concentration", content: "More substrate means faster reactions, up to a point. Eventually, all enzyme active sites are busy (saturation).", simType: 'concept', focusConcept: 'collision' },
    { id: 7, title: "Real World Enzymes", content: "We use enzymes in biological washing powders to eat stains, and in baby food to pre-digest proteins.", simType: 'concept' },
    { id: 8, title: "Experimental Design", content: "To measure enzyme rate, we can measure how fast a product appears (like Oxygen bubbles) or how fast a substrate disappears (like Starch).", simType: 'temperature' },
    { id: 9, title: "Mastery Check", content: "Match the enzyme to its substrate and predict the outcome of these scenarios.", simType: 'matching', interactive: true }
];
