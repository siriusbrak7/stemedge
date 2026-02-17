
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface EvolutionConcept {
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
    simType?: 'moth' | 'finch' | 'antibiotic' | 'fossil' | 'dna' | 'concept';
}

export const EVOLUTION_CONCEPTS: Record<string, EvolutionConcept> = {
    natural_selection: {
        id: 'natural_selection',
        title: 'Natural Selection',
        description: {
            foundation: "Nature chooses the best fit. Animals with helpful traits survive longer and have more babies.",
            medium: "The process where organisms better adapted to their environment tend to survive and produce more offspring.",
            advanced: "Differential survival and reproduction of individuals due to differences in phenotype. It is a key mechanism of evolution, leading to changes in allele frequencies."
        },
        analogy: "Like a sieve: only the particles (organisms) that fit the holes (environment) get through."
    },
    variation: {
        id: 'variation',
        title: 'Variation',
        description: {
            foundation: "Individuals in a group are not clones. They have differences, like size or color.",
            medium: "Differences between individuals of the same species. Caused by genetic mutations and sexual reproduction.",
            advanced: "Genetic variation is the substrate for selection. Sources include mutation, chromosomal crossover, and independent assortment during meiosis."
        },
        analogy: "Like a pack of cards - same deck, but every hand dealt is different."
    },
    adaptation: {
        id: 'adaptation',
        title: 'Adaptation',
        description: {
            foundation: "A body part or behavior that helps an animal survive.",
            medium: "A trait with a current functional role in the life history of an organism that is maintained and evolved by means of natural selection.",
            advanced: "Can be structural, physiological, or behavioral. Adaptations increase fitness (the ability to survive and reproduce)."
        },
        analogy: "Wearing a thick coat in winter is an adaptation to the cold."
    },
    speciation: {
        id: 'speciation',
        title: 'Speciation',
        description: {
            foundation: "How a new type of animal is formed. Usually happens when groups get separated.",
            medium: "The evolutionary process by which populations evolve to become distinct species.",
            advanced: "Often involves reproductive isolation (allopatric or sympatric). Over time, genetic drift and selection cause divergence until interbreeding is impossible."
        },
        analogy: "Like a language splitting into dialects, then entirely new languages over centuries."
    }
};

export const EVOLUTION_SLIDES: Slide[] = [
    { id: 0, title: "What is Evolution?", content: "Evolution is the process of change in all forms of life over generations. It explains the diversity we see on Earth today.", simType: 'concept', focusConcept: 'variation' },
    { id: 1, title: "Darwin & The Galapagos", content: "Charles Darwin noticed that finches on different islands had different beaks. Why? Because they ate different food.", simType: 'finch', interactive: true },
    { id: 2, title: "Natural Selection", content: "It's not just luck. Individuals with traits that give them an advantage are more likely to survive and reproduce.", simType: 'concept', focusConcept: 'natural_selection' },
    { id: 3, title: "Survival of the Fittest", content: "Let's test this. In a clean forest, light moths hide well. In a polluted forest, dark moths win. You be the predator.", simType: 'moth', interactive: true },
    { id: 4, title: "Evidence: Fossils", content: "Fossils show us snapshots of the past. Transition fossils show the 'missing links' between ancient and modern species.", simType: 'concept' },
    { id: 5, title: "Evidence: Anatomy", content: "Why do bat wings, whale fins, and human hands have the same bone structure? Because we share a common ancestor.", simType: 'concept' },
    { id: 6, title: "Evidence: DNA", content: "Our genetic code confirms what fossils tell us. Humans share about 98% of their DNA with chimpanzees.", simType: 'dna' },
    { id: 7, title: "Adaptation in Action", content: "Camouflage, sharp teeth, or the ability to digest milk are all adaptations selected for by the environment.", simType: 'concept', focusConcept: 'adaptation' },
    { id: 8, title: "Speciation", content: "When groups are separated (like by a mountain range), they evolve differently until they can no longer breed together.", simType: 'concept', focusConcept: 'speciation' },
    { id: 9, title: "Evolution Today", content: "Evolution isn't just history. Bacteria evolve resistance to our medicines very quickly. Finish your antibiotics!", simType: 'antibiotic', interactive: true }
];
