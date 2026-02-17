
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface OrganInfo {
    id: string;
    name: string;
    system: 'digestive' | 'respiratory' | 'circulatory';
    description: Record<DepthLevel, string>;
    funFact: string;
}

export interface Slide {
    id: number;
    title: string;
    content: string;
    focusPart?: string; // ID of organ to highlight
    interactive?: boolean;
    simType?: 'explorer' | 'digestive_journey' | 'heart_sim' | 'villus' | 'matching';
}

export const ORGANS: Record<string, OrganInfo> = {
    mouth: {
        id: 'mouth',
        name: 'Mouth & Salivary Glands',
        system: 'digestive',
        description: {
            foundation: "Where digestion begins. Teeth chew food and saliva makes it soft.",
            medium: "Mechanical digestion by teeth increases surface area. Saliva contains amylase to start breaking down starch.",
            advanced: "Mastication forms a bolus. Salivary amylase hydrolyzes starch into maltose. The epiglottis prevents food entering the trachea."
        },
        funFact: "You produce about 1 to 2 liters of saliva every day!"
    },
    esophagus: {
        id: 'esophagus',
        name: 'Esophagus',
        system: 'digestive',
        description: {
            foundation: "The tube that carries food from your mouth to your stomach.",
            medium: "A muscular tube that pushes food down using wave-like movements called peristalsis.",
            advanced: "Peristalsis involves contraction of circular muscles behind the bolus and relaxation of longitudinal muscles ahead of it."
        },
        funFact: "Peristalsis is so strong you can swallow food even while hanging upside down."
    },
    stomach: {
        id: 'stomach',
        name: 'Stomach',
        system: 'digestive',
        description: {
            foundation: "A bag that churns food and mixes it with acid.",
            medium: "Muscular walls churn food. Hydrochloric acid kills bacteria and protease enzymes start breaking down proteins.",
            advanced: "Gastric juice contains HCl (pH 2) and pepsin. The acidic environment activates pepsinogen and kills pathogens. Food becomes 'chyme'."
        },
        funFact: "The stomach lining replaces itself every few days to avoid digesting itself."
    },
    small_intestine: {
        id: 'small_intestine',
        name: 'Small Intestine',
        system: 'digestive',
        description: {
            foundation: "Where food is absorbed into the blood.",
            medium: "Digestion is completed here with help from the pancreas and bile. Nutrients are absorbed through the walls.",
            advanced: "Consists of duodenum, jejunum, and ileum. Villi and microvilli maximize surface area for absorption of glucose, amino acids, and fatty acids."
        },
        funFact: "If flattened out, your small intestine would cover a tennis court."
    },
    large_intestine: {
        id: 'large_intestine',
        name: 'Large Intestine',
        system: 'digestive',
        description: {
            foundation: "Absorbs water and gets rid of waste.",
            medium: "Absorbs excess water from undigested food, leaving solid waste (feces) to be stored in the rectum.",
            advanced: "Colon absorbs water and vitamins produced by gut bacteria. Rectum stores feces until egestion through the anus."
        },
        funFact: "Your large intestine is home to trillions of helpful bacteria."
    },
    trachea: {
        id: 'trachea',
        name: 'Trachea (Windpipe)',
        system: 'respiratory',
        description: {
            foundation: "The tube that carries air to your lungs.",
            medium: "Kept open by rings of cartilage. Lined with sticky mucus to trap dust and germs.",
            advanced: "C-shaped cartilage rings prevent collapse. Ciliated epithelium moves mucus (containing trapped pathogens) up to the throat to be swallowed."
        },
        funFact: "The cartilage rings are C-shaped to allow the esophagus behind it to expand when swallowing."
    },
    lungs: {
        id: 'lungs',
        name: 'Lungs',
        system: 'respiratory',
        description: {
            foundation: "Two large sponges that fill with air when you breathe.",
            medium: "The main organs of the respiratory system. They contain bronchi, bronchioles, and millions of alveoli.",
            advanced: "Right lung has 3 lobes, left has 2 (to fit the heart). Site of gas exchange powered by the diaphragm and intercostal muscles."
        },
        funFact: "The left lung is slightly smaller to make room for your heart."
    },
    alveoli: {
        id: 'alveoli',
        name: 'Alveoli',
        system: 'respiratory',
        description: {
            foundation: "Tiny air sacs where oxygen gets into the blood.",
            medium: "Millions of tiny sacs at the end of bronchioles. Oxygen moves into blood, Carbon Dioxide moves out.",
            advanced: "One cell thick to minimize diffusion distance. Surrounded by a dense capillary network to maintain a steep concentration gradient."
        },
        funFact: "You have about 600 million alveoli in your lungs."
    },
    heart: {
        id: 'heart',
        name: 'Heart',
        system: 'circulatory',
        description: {
            foundation: "A muscle pump that pushes blood around your body.",
            medium: "A double pump: the right side pumps to the lungs, the left side pumps to the rest of the body.",
            advanced: "Myogenic muscle. Right atrium/ventricle handle deoxygenated blood; Left atrium/ventricle handle oxygenated blood. Separated by the septum."
        },
        funFact: "Your heart beats about 100,000 times every single day."
    },
    arteries: {
        id: 'arteries',
        name: 'Arteries',
        system: 'circulatory',
        description: {
            foundation: "Tubes carrying blood away from the heart.",
            medium: "Thick, elastic walls to withstand high pressure as blood is pumped out of the heart.",
            advanced: "Thick tunica media (muscle/elastic) to recoil and maintain pulse pressure. Carry oxygenated blood (except pulmonary artery)."
        },
        funFact: "The aorta is your biggest artery, almost the width of a garden hose."
    },
    veins: {
        id: 'veins',
        name: 'Veins',
        system: 'circulatory',
        description: {
            foundation: "Tubes carrying blood back to the heart.",
            medium: "Thinner walls than arteries. They have valves to stop blood flowing backwards.",
            advanced: "Wide lumen to reduce resistance. Skeletal muscles help squeeze blood back to the heart against gravity."
        },
        funFact: "Veins look blue through skin due to light scattering, not because blood is blue!"
    }
};

export const HUMAN_BODY_SLIDES: Slide[] = [
    { id: 0, title: "Organization of Life", content: "Your body is a machine made of trillions of cells. Cells form tissues, tissues form organs, and organs work together in systems.", simType: 'explorer', focusPart: 'heart' },
    { id: 1, title: "The Digestive System", content: "This system breaks down food into fuel. It starts at the mouth and ends... well, at the other end.", simType: 'explorer', focusPart: 'stomach', interactive: true },
    { id: 2, title: "A Journey Through Digestion", content: "Follow a particle of food. Mechanical digestion breaks it physically; chemical digestion uses enzymes to break bonds.", simType: 'digestive_journey', interactive: true },
    { id: 3, title: "Enzymes: Biological Scissors", content: "Proteins, carbs, and fats are too big to absorb. Enzymes like Amylase, Protease, and Lipase chop them into small pieces.", simType: 'explorer', focusPart: 'stomach' },
    { id: 4, title: "Absorption: The Small Intestine", content: "The walls of the intestine are folded into Villi. This huge surface area lets nutrients rush into the blood quickly.", simType: 'explorer', focusPart: 'small_intestine' },
    { id: 5, title: "The Respiratory System", content: "We need Oxygen to burn that fuel. Air travels down the trachea into the lungs.", simType: 'explorer', focusPart: 'lungs', interactive: true },
    { id: 6, title: "Gas Exchange", content: "Deep inside are millions of tiny sacs called Alveoli. Here, Oxygen swaps places with waste Carbon Dioxide.", simType: 'explorer', focusPart: 'alveoli' },
    { id: 7, title: "The Circulatory System", content: "The transport network. Blood carries oxygen, nutrients, and waste to every cell in the body.", simType: 'explorer', focusPart: 'heart', interactive: true },
    { id: 8, title: "The Heart: A Double Pump", content: "The right side sends blood to the lungs (to get oxygen). The left side pumps it to the body (to use oxygen).", simType: 'heart_sim', interactive: true },
    { id: 9, title: "Blood Vessels", content: "Arteries carry blood AWAY under pressure. Veins carry blood IN with valves. Capillaries connect them.", simType: 'explorer', focusPart: 'arteries' },
    { id: 10, title: "The Cardiac Cycle", content: "Watch how the heart valves open and close to ensure blood flows only one way.", simType: 'heart_sim', interactive: true },
    { id: 11, title: "Systems Working Together", content: "Digestive gets fuel. Respiratory gets oxygen. Circulatory delivers both. They are all connected!", simType: 'explorer' }
];
