
export type DepthLevel = 'foundation' | 'medium' | 'advanced';

export interface GeneticsConcept {
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
    simType?: 'dna_builder' | 'punnett' | 'mutation' | 'extraction' | 'concept';
}

export const GENETICS_CONCEPTS: Record<string, GeneticsConcept> = {
    dna_structure: {
        id: 'dna_structure',
        title: 'DNA Structure',
        description: {
            foundation: "DNA looks like a twisted ladder (double helix). The rungs are made of letters: A pairs with T, and C pairs with G.",
            medium: "A polymer of nucleotides. Each nucleotide has a phosphate, a sugar, and a nitrogenous base. The two strands are antiparallel.",
            advanced: "The double helix is held together by hydrogen bonds between complementary base pairs (2 for A-T, 3 for C-G). Sugar-phosphate backbone provides structure."
        },
        analogy: "Like a blueprint for building a house, but for building you."
    },
    gene_chromosome: {
        id: 'gene_chromosome',
        title: 'Genes & Chromosomes',
        description: {
            foundation: "DNA is wrapped up into tight bundles called chromosomes. A gene is a small section of DNA that codes for a trait.",
            medium: "Humans have 46 chromosomes (23 pairs). A gene is a sequence of DNA that codes for a specific protein.",
            advanced: "Chromatin condenses into chromosomes during division. Loci are specific positions of genes on chromosomes. Histones help pack DNA."
        },
        analogy: "If DNA is a thread, a chromosome is the spool, and a gene is a specific patch of color on the thread."
    },
    alleles: {
        id: 'alleles',
        title: 'Alleles',
        description: {
            foundation: "Different versions of the same gene. For example, a gene for eye color might have a 'brown' version and a 'blue' version.",
            medium: "Alternative forms of a gene arising by mutation and are found at the same place on a chromosome.",
            advanced: "Alleles can be dominant, recessive, or codominant. An organism inherits two alleles for each trait (one from each parent)."
        },
        analogy: "Like flavors of ice cream - it's all ice cream, but you can have vanilla or chocolate."
    },
    inheritance: {
        id: 'inheritance',
        title: 'Inheritance Patterns',
        description: {
            foundation: "Traits are passed from parents to children. Dominant traits hide recessive ones.",
            medium: "Dominant alleles (uppercase) are expressed even if only one is present. Recessive alleles (lowercase) need two copies.",
            advanced: "Mendelian inheritance follows law of segregation. Non-Mendelian includes incomplete dominance and codominance."
        },
        analogy: "Like mixing paint vs. stacking colored glass. Dominant is opaque paint; recessive is clear glass."
    },
    mutation: {
        id: 'mutation',
        title: 'Mutation',
        description: {
            foundation: "A change in the DNA letters. It can change the instruction for building the body.",
            medium: "A change in the base sequence of DNA. Can occur spontaneously or due to radiation/chemicals.",
            advanced: "Types include substitution, insertion, deletion. Can lead to frameshifts, changing the entire amino acid sequence downstream."
        },
        analogy: "A typo in a recipe book that might make the cake taste weird (or amazing)."
    }
};

export const GENETICS_SLIDES: Slide[] = [
    { id: 0, title: "The Blueprint of Life", content: "DNA holds the instructions for every living thing. Let's explore how this twisted ladder builds who you are.", simType: 'dna_builder', interactive: true, focusConcept: 'dna_structure' },
    { id: 1, title: "DNA Structure", content: "DNA is made of four bases: Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). They pair up strictly: A with T, C with G.", simType: 'dna_builder', interactive: true },
    { id: 2, title: "From DNA to Chromosomes", content: "There is 2 meters of DNA in every cell! To fit, it coils tightly into X-shaped structures called Chromosomes.", simType: 'concept', focusConcept: 'gene_chromosome' },
    { id: 3, title: "Genes and Alleles", content: "A section of DNA is a gene. Different versions of a gene are called Alleles (e.g., Tall vs Short).", simType: 'concept', focusConcept: 'alleles' },
    { id: 4, title: "Inheritance Basics", content: "You get one allele from Mom and one from Dad. The combination determines your traits (Phenotype).", simType: 'punnett', interactive: true, focusConcept: 'inheritance' },
    { id: 5, title: "Punnett Squares", content: "We can predict the probability of traits using a grid. Dominant alleles (capital letters) win over recessive ones.", simType: 'punnett', interactive: true },
    { id: 6, title: "Genotype vs Phenotype", content: "Genotype is the genetic code (Tt). Phenotype is the physical look (Tall plant).", simType: 'punnett', interactive: true },
    { id: 7, title: "Genetic Disorders", content: "Some diseases like Cystic Fibrosis are caused by recessive alleles. You need two copies to be affected.", simType: 'punnett', interactive: true },
    { id: 8, title: "DNA Extraction", content: "Scientists can extract DNA from cells using soap (breaks membranes) and alcohol (precipitates DNA).", simType: 'extraction', interactive: true },
    { id: 9, title: "Variation", content: "Differences between individuals. Continuous (height) vs Discontinuous (blood type).", simType: 'concept' },
    { id: 10, title: "Mutation", content: "Sometimes DNA is copied wrong. A change in a base is a mutation. Some are harmless, some cause change.", simType: 'mutation', interactive: true, focusConcept: 'mutation' },
    { id: 11, title: "Check Understanding", content: "Use the tools to solve these genetic mysteries.", simType: 'punnett', interactive: true }
];
