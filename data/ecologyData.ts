
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface EcologyConcept {
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
    simType?: 'web_builder' | 'ecosystem_sim' | 'carbon_cycle' | 'quadrat' | 'concept';
}

export const ECOLOGY_CONCEPTS: Record<string, EcologyConcept> = {
    ecosystem: {
        id: 'ecosystem',
        title: 'Ecosystems',
        description: {
            foundation: "A community of living things interacting with their non-living environment (like water and sun).",
            medium: "A biological community of interacting organisms and their physical environment (abiotic factors).",
            advanced: "An open system involving the flow of energy and cycling of nutrients between biotic and abiotic components."
        },
        analogy: "Like a city: people (biotic) interact with buildings and roads (abiotic) to function."
    },
    energy_flow: {
        id: 'energy_flow',
        title: 'Energy Flow',
        description: {
            foundation: "Sunlight feeds plants, plants feed animals. Energy moves up the chain.",
            medium: "Energy flows from producers to consumers. Only about 10% is passed to the next level.",
            advanced: "Energy transfer obeys thermodynamics. Most energy is lost as heat (respiration) or waste, limiting the number of trophic levels."
        },
        analogy: "Like a pyramid of glasses where champagne is poured at the top, but most spills before reaching the bottom."
    },
    nutrient_cycling: {
        id: 'nutrient_cycling',
        title: 'Nutrient Cycling',
        description: {
            foundation: "Nature recycles everything. Dead things turn back into soil for plants.",
            medium: "Nutrients like Carbon and Nitrogen move between living organisms and the atmosphere/soil.",
            advanced: "Biogeochemical cycles (Carbon, Nitrogen, Phosphorus) ensure essential elements are available. Decomposers are critical for mineralization."
        },
        analogy: "Recycling aluminum cans - the material is used over and over again."
    },
    population_dynamics: {
        id: 'population_dynamics',
        title: 'Population Dynamics',
        description: {
            foundation: "Populations grow until they run out of food or space.",
            medium: "Populations are limited by carrying capacity. Predators keep prey numbers in check.",
            advanced: "Growth can be exponential (J-curve) or logistic (S-curve). Density-dependent factors (disease, competition) regulate size near K (carrying capacity)."
        },
        analogy: "Like a party in a small room - eventually it gets too crowded for anyone else to enter."
    }
};

export const ECOLOGY_SLIDES: Slide[] = [
    { id: 0, title: "What is Ecology?", content: "Ecology is the study of how living things interact with each other and their home. It's the science of connections.", simType: 'concept', focusConcept: 'ecosystem' },
    { id: 1, title: "Ecosystems", content: "An ecosystem includes living (biotic) parts like plants and animals, and non-living (abiotic) parts like sun, water, and soil.", simType: 'concept', focusConcept: 'ecosystem' },
    { id: 2, title: "Food Chains", content: "Who eats whom? It always starts with a Producer (plant) using sunlight. Then Consumers eat the producers.", simType: 'web_builder', interactive: true },
    { id: 3, title: "Food Webs", content: "Real life is messy. Animals eat more than one thing. Interconnected food chains form a Food Web.", simType: 'web_builder', interactive: true },
    { id: 4, title: "Energy Pyramids", content: "Only 10% of energy moves up to the next level. The rest is used for movement or lost as heat. That's why there are fewer tigers than rabbits.", simType: 'concept', focusConcept: 'energy_flow' },
    { id: 5, title: "The Carbon Cycle", content: "Carbon acts as the building block of life. It moves from air to plants (photosynthesis) and back to air (breathing/burning).", simType: 'carbon_cycle', interactive: true },
    { id: 6, title: "The Water Cycle", content: "Water evaporates, forms clouds, rains down, and flows back to the sea. It's the ultimate recycling system.", simType: 'concept' },
    { id: 7, title: "Nitrogen Cycle", content: "Bacteria in the soil turn air nitrogen into fertilizer for plants. Without them, plants couldn't make proteins.", simType: 'concept', focusConcept: 'nutrient_cycling' },
    { id: 8, title: "Population Growth", content: "Populations grow fast at first, but slow down when food or space runs out. This limit is called Carrying Capacity.", simType: 'ecosystem_sim', interactive: true },
    { id: 9, title: "Predator & Prey", content: "Foxes eat rabbits. If rabbits die out, foxes starve. If foxes die, rabbits take over. It's a delicate balance.", simType: 'ecosystem_sim', interactive: true, focusConcept: 'population_dynamics' },
    { id: 10, title: "Human Impact", content: "We change ecosystems by burning fossil fuels (climate change) and cutting down forests (habitat loss).", simType: 'carbon_cycle', interactive: true },
    { id: 11, title: "Conservation", content: "Protecting biodiversity ensures ecosystems keep working. We need them for clean air, water, and food.", simType: 'concept' }
];
