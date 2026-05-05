import type { Topic } from '../types';

export const GENETICS_MOLECULAR_TOPIC: Topic = {
  id: 'genetics-molecular',
  title: 'Genetics and Molecular Biology',
  subtopics: [
    {
      id: 'central-dogma',
      title: 'From DNA to Protein: The Central Dogma',
      lesson: {
        sections: [
          {
            title: 'The Blueprint of Life',
            content: 'DNA stores genetic information as a sequence of four bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). Each three-base sequence (codon) on the mRNA ultimately codes for one amino acid. The sequence of DNA thus determines the sequence of amino acids in a protein — and therefore its shape and function.',
            interactive: {
              type: 'reveal' as const,
              label: 'How many codons are possible?',
              hiddenContent: '4 bases × 4 bases × 4 bases = 64 possible codons. These code for only 20 amino acids and 3 stop signals, so many amino acids have multiple codons (the code is degenerate/redundant).'
            }
          },
          {
            title: 'Step 1: Transcription',
            content: 'In the nucleus, RNA polymerase binds to the DNA and unwinds the double helix. It reads the template strand in the 3\'→5\' direction and synthesises a complementary mRNA strand in the 5\'→3\' direction. RNA uses Uracil (U) instead of Thymine (T): so A in DNA pairs with U in mRNA. The finished mRNA leaves the nucleus through nuclear pores.',
            interactive: {
              type: 'expand' as const,
              label: 'DNA → mRNA base pairing rules',
              hiddenContent: 'Template DNA → mRNA: A→U, T→A, G→C, C→G. Example: DNA template 3′-TAC GGA ATG-5′ produces mRNA 5′-AUG CCU UAC-3′. The mRNA codon AUG codes for Methionine (the start codon).'
            }
          },
          {
            title: 'Step 2: Translation',
            content: 'The mRNA travels to the ribosome in the cytoplasm. Transfer RNA (tRNA) molecules each carry a specific amino acid. Their three-base anticodon matches a complementary codon on the mRNA. The ribosome moves along the mRNA codon by codon, linking amino acids together via peptide bonds to form a polypeptide chain. Translation ends when the ribosome reaches a stop codon (UAA, UAG, or UGA).',
          },
          {
            title: 'Mutations',
            content: 'A mutation is a change in the DNA base sequence. A substitution changes one base for another — it may be silent (no AA change), missense (different AA), or nonsense (creates a stop codon). Insertions and deletions add or remove bases, causing frameshift mutations that change all downstream codons. Frameshift mutations are generally the most severe.',
            interactive: {
              type: 'reveal' as const,
              label: 'IB Example: Sickle Cell Disease',
              hiddenContent: 'A single base substitution in the HBB gene (GAG→GTG) changes glutamic acid to valine at position 6 of β-haemoglobin. This causes haemoglobin to crystallise under low O₂, deforming red blood cells into a sickle shape — a classic missense mutation with major physiological consequences.'
            }
          }
        ]
      },
      flashcards: [
        { id: 'cd-f1', question: 'What enzyme synthesises mRNA during transcription?', answer: 'RNA polymerase' },
        { id: 'cd-f2', question: 'Which base in RNA replaces Thymine?', answer: 'Uracil (U)' },
        { id: 'cd-f3', question: 'Where does translation occur?', answer: 'Ribosome (in the cytoplasm)' },
        { id: 'cd-f4', question: 'What is the name for a 3-base sequence on mRNA?', answer: 'Codon' },
        { id: 'cd-f5', question: 'What is the complementary anticodon for mRNA codon AUG?', answer: 'UAC' },
        { id: 'cd-f6', question: 'AUG codes for which amino acid and is also called?', answer: 'Methionine; Start codon' },
        { id: 'cd-f7', question: 'A mutation that changes one amino acid is called?', answer: 'Missense mutation' },
        { id: 'cd-f8', question: 'The three stop codons are?', answer: 'UAA, UAG, UGA' }
      ],
      checkpointAssessment: [
        {
          id: 'cd-q1',
          type: 'mcq' as const,
          prompt: 'RNA polymerase reads the DNA template strand in which direction?',
          options: [
            { id: 'a', text: "5'→3'" },
            { id: 'b', text: "3'→5'" },
            { id: 'c', text: 'Both directions simultaneously' },
            { id: 'd', text: 'Direction depends on the gene' }
          ],
          correctAnswer: 'b',
          explanation: "RNA polymerase always reads the template strand 3'→5' and builds mRNA in the 5'→3' direction."
        },
        {
          id: 'cd-q2',
          type: 'one-word' as const,
          prompt: 'What molecule carries amino acids to the ribosome during translation?',
          correctAnswer: 'tRNA',
          explanation: 'Transfer RNA (tRNA) has an anticodon that pairs with the mRNA codon, delivering the correct amino acid.'
        },
        {
          id: 'cd-q3',
          type: 'mcq' as const,
          prompt: 'A silent mutation changes a DNA base but NOT the amino acid — why?',
          options: [
            { id: 'a', text: 'The mutation is repaired automatically' },
            { id: 'b', text: 'The genetic code is degenerate (redundant)' },
            { id: 'c', text: 'The ribosome corrects the error' },
            { id: 'd', text: 'Stop codons block the change' }
          ],
          correctAnswer: 'b',
          explanation: 'Multiple codons code for the same amino acid (e.g., six codons for Leucine). A base change may produce a different codon that still codes for the same amino acid.'
        },
        {
          id: 'cd-q4',
          type: 'matching' as const,
          prompt: 'Match each process to its location:',
          pairs: [
            { left: 'Transcription', right: 'Nucleus' },
            { left: 'Translation', right: 'Ribosome' },
            { left: 'DNA Replication', right: 'S-phase (nucleus)' }
          ]
        },
        {
          id: 'cd-q5',
          type: 'one-word' as const,
          prompt: 'The specific sequence of 3 mRNA bases that codes for one amino acid is called a?',
          correctAnswer: 'Codon',
          hint: 'Co...'
        }
      ]
    },
{
  id: 'mendelian-inheritance',
  title: 'Mendelian Inheritance',
  lesson: {
    sections: [
      {
        title: 'Dominance & Recessiveness',
        content: 'Traits are controlled by alleles. Dominant alleles (uppercase, e.g. T) mask recessive alleles (lowercase, e.g. t) in the phenotype. A homozygous dominant (TT) and heterozygous (Tt) organism both show the dominant phenotype; only homozygous recessive (tt) shows the recessive trait.',
        interactive: {
          type: 'reveal' as const,
          label: 'Why does a heterozygous organism show the dominant trait?',
          hiddenContent: 'The dominant allele produces a functional protein, while the recessive allele often produces a non-functional or absent protein. One functional copy is usually enough for the dominant phenotype — this is called haplosufficiency.'
        }
      },
      {
        title: 'Mendel\'s Laws',
        content: 'The Law of Segregation states that allele pairs separate during gamete formation so each gamete carries only one allele. The Law of Independent Assortment states that alleles of different genes sort independently during gamete formation (only applies to genes on different chromosomes or far apart on the same chromosome).',
        interactive: {
          type: 'expand' as const,
          label: 'Punnett Square for Tt × Tt',
          hiddenContent: 'Offspring ratios: 1 TT : 2 Tt : 1 tt → Phenotype ratio 3 dominant : 1 recessive. In Ghana, sickle-cell anaemia (HbS allele) follows a similar pattern: AS carriers have sickle-cell trait, SS individuals have the disease.'
        }
      },
      {
        title: 'Incomplete Dominance & Co-dominance',
        content: 'Incomplete dominance produces a blended phenotype (e.g. red × white flowers → pink). Co-dominance shows both phenotypes simultaneously (e.g. blood group AB shows both A and B antigens). These are exceptions to simple Mendelian dominance.',
      }
    ]
  },
  flashcards: [
    { id: 'mi-f1', question: 'What is the phenotypic ratio of a Tt × Tt cross?', answer: '3 dominant : 1 recessive' },
    { id: 'mi-f2', question: 'State Mendel\'s Law of Segregation.', answer: 'Allele pairs separate during gamete formation; each gamete receives one allele.' },
    { id: 'mi-f3', question: 'What is incomplete dominance?', answer: 'When the heterozygous phenotype is a blend of both alleles (e.g. red + white → pink).' },
    { id: 'mi-f4', question: 'Give an example of co-dominance.', answer: 'Blood group AB — both A and B antigens are expressed on red blood cells.' },
    { id: 'mi-f5', question: 'In a cross between two heterozygotes (Aa × Aa), what fraction will be homozygous recessive?', answer: '1/4 (25%)' },
  ],
  checkpointAssessment: [
    {
      id: 'mi-q1',
      type: 'mcq' as const,
      prompt: 'In a cross between Tt and tt, what proportion of offspring will show the recessive phenotype?',
      options: [
        { id: 'a', text: '1/4' },
        { id: 'b', text: '1/2' },
        { id: 'c', text: '3/4' },
        { id: 'd', text: 'All' }
      ],
      correctAnswer: 'b',
      explanation: 'Tt × tt gives 1 Tt : 1 tt, so half show the recessive phenotype.'
    },
    {
      id: 'mi-q2',
      type: 'one-word' as const,
      prompt: 'What type of dominance produces an intermediate phenotype in heterozygotes?',
      correctAnswer: 'Incomplete',
      explanation: 'Incomplete dominance produces a blended intermediate phenotype.'
    },
    {
      id: 'mi-q3',
      type: 'mcq' as const,
      prompt: 'Sickle-cell anaemia is common in West Africa because carriers (AS) have resistance to what disease?',
      options: [
        { id: 'a', text: 'Tuberculosis' },
        { id: 'b', text: 'Malaria' },
        { id: 'c', text: 'Cholera' },
        { id: 'd', text: 'Yellow fever' }
      ],
      correctAnswer: 'b',
      explanation: 'The AS genotype provides some protection against malaria — a classic example of heterozygote advantage.'
    },
  ]
},
{
  id: 'dna-replication',
  title: 'DNA Replication',
  lesson: {
    sections: [
      {
        title: 'Semi-conservative Replication',
        content: 'DNA replication is semi-conservative: each new DNA molecule contains one original (parent) strand and one newly synthesised strand. This was proven by the Meselson-Stahl experiment using nitrogen-15 labelling.',
        interactive: {
          type: 'reveal' as const,
          label: 'Why is it called semi-conservative?',
          hiddenContent: 'Each daughter DNA molecule conserves one of the two original strands. The other strand is new. After one round of replication, both molecules contain one heavy (15N) and one light (14N) strand.'
        }
      },
      {
        title: 'Enzymes of Replication',
        content: 'Helicase unwinds the double helix at the replication fork. DNA polymerase III synthesises the new strand in the 5\'→3\' direction. The leading strand is synthesised continuously; the lagging strand is synthesised in short Okazaki fragments, later joined by DNA ligase. Primase makes a short RNA primer for DNA polymerase to extend.',
      },
      {
        title: 'Proofreading and Fidelity',
        content: 'DNA polymerase has 3\'→5\' exonuclease (proofreading) activity — it can remove a mismatched base and replace it. This reduces the error rate to approximately 1 in 10⁹ bases. Uncorrected errors become mutations, the raw material for evolution.',
      }
    ]
  },
  flashcards: [
    { id: 'dr-f1', question: 'What enzyme unwinds the DNA double helix?', answer: 'Helicase' },
    { id: 'dr-f2', question: 'Which strand is synthesised in Okazaki fragments?', answer: 'The lagging strand' },
    { id: 'dr-f3', question: 'What joins Okazaki fragments together?', answer: 'DNA ligase' },
    { id: 'dr-f4', question: 'DNA replication is described as what type?', answer: 'Semi-conservative' },
    { id: 'dr-f5', question: 'What makes the short RNA primer for DNA polymerase?', answer: 'Primase' },
  ],
  checkpointAssessment: [
    {
      id: 'dr-q1',
      type: 'mcq' as const,
      prompt: 'Which enzyme synthesises the new DNA strand?',
      options: [
        { id: 'a', text: 'Helicase' },
        { id: 'b', text: 'DNA polymerase III' },
        { id: 'c', text: 'Ligase' },
        { id: 'd', text: 'Primase' }
      ],
      correctAnswer: 'b',
      explanation: 'DNA polymerase III is the main replication enzyme that builds the new strand.'
    },
    {
      id: 'dr-q2',
      type: 'one-word' as const,
      prompt: 'What are the short fragments on the lagging strand called?',
      correctAnswer: 'Okazaki fragments',
      explanation: 'Okazaki fragments are short DNA segments on the lagging strand, later joined by DNA ligase.'
    },
    {
      id: 'dr-q3',
      type: 'mcq' as const,
      prompt: 'The Meselson-Stahl experiment proved that DNA replication is:',
      options: [
        { id: 'a', text: 'Conservative' },
        { id: 'b', text: 'Semi-conservative' },
        { id: 'c', text: 'Dispersive' },
        { id: 'd', text: 'Random' }
      ],
      correctAnswer: 'b',
      explanation: 'After one generation in light nitrogen, all DNA was intermediate density — proving semi-conservative replication.'
    },
  ]
},
{
  id: 'meiosis',
  title: 'Meiosis & Genetic Variation',
  lesson: {
    sections: [
      {
        title: 'Meiosis Overview',
        content: 'Meiosis is a reduction division that produces four genetically different haploid gametes from one diploid cell. It involves two divisions: Meiosis I separates homologous chromosomes; Meiosis II separates sister chromatids. The result is cells with half the chromosome number (n).',
        interactive: {
          type: 'reveal' as const,
          label: 'How many chromosomes do human gametes have?',
          hiddenContent: 'Human body cells are diploid (2n = 46). After meiosis, gametes are haploid (n = 23). When sperm and egg fuse at fertilisation, the diploid number is restored: 23 + 23 = 46.'
        }
      },
      {
        title: 'Crossing Over & Independent Assortment',
        content: 'Crossing over (prophase I) exchanges DNA between homologous chromosomes, creating new allele combinations. Independent assortment (metaphase I) randomly distributes maternal and paternal chromosomes to daughter cells. Together, these produce the enormous genetic variation seen in sexually reproducing organisms.',
      },
      {
        title: 'Meiosis vs Mitosis',
        content: 'Mitosis produces two identical diploid cells for growth and repair. Meiosis produces four genetically different haploid cells for reproduction. Key differences: meiosis has two divisions, involves crossing over, and separates homologous chromosomes first. Errors in meiosis (non-disjunction) cause conditions like Down syndrome (trisomy 21).',
      }
    ]
  },
  flashcards: [
    { id: 'me-f1', question: 'What is the product of meiosis?', answer: 'Four genetically different haploid gametes' },
    { id: 'me-f2', question: 'During which phase does crossing over occur?', answer: 'Prophase I of meiosis' },
    { id: 'me-f3', question: 'What is non-disjunction?', answer: 'Failure of chromosomes to separate properly during meiosis' },
    { id: 'me-f4', question: 'Down syndrome is caused by trisomy of which chromosome?', answer: 'Chromosome 21' },
    { id: 'me-f5', question: 'How many divisions occur in meiosis?', answer: 'Two (Meiosis I and Meiosis II)' },
  ],
  checkpointAssessment: [
    {
      id: 'me-q1',
      type: 'mcq' as const,
      prompt: 'Which process produces genetic variation by exchanging DNA between homologous chromosomes?',
      options: [
        { id: 'a', text: 'DNA replication' },
        { id: 'b', text: 'Crossing over' },
        { id: 'c', text: 'Cytokinesis' },
        { id: 'd', text: 'Transcription' }
      ],
      correctAnswer: 'b',
      explanation: 'Crossing over exchanges segments between homologous chromosomes, creating new allele combinations.'
    },
    {
      id: 'me-q2',
      type: 'one-word' as const,
      prompt: 'What is the chromosome number in human gametes?',
      correctAnswer: '23',
      explanation: 'Human gametes are haploid (n = 23), half the diploid number of 46.'
    },
    {
      id: 'me-q3',
      type: 'mcq' as const,
      prompt: 'Meiosis differs from mitosis because meiosis:',
      options: [
        { id: 'a', text: 'Produces identical daughter cells' },
        { id: 'b', text: 'Involves two divisions and produces haploid cells' },
        { id: 'c', text: 'Does not involve DNA replication' },
        { id: 'd', text: 'Occurs only in body cells' }
      ],
      correctAnswer: 'b',
      explanation: 'Meiosis involves two successive divisions and produces four genetically different haploid cells.'
    },
  ]
},
{
  id: 'lac-operon',
  title: 'Gene Regulation',
  lesson: {
    sections: [
      {
        title: 'The Lac Operon Model',
        content: 'The lac operon in E. coli controls the metabolism of lactose. It consists of structural genes (lacZ, lacY, lacA), a promoter, an operator, and a repressor gene (lacI). When lactose is absent, the repressor binds the operator, blocking transcription. When lactose is present, it binds the repressor, releasing the operator and allowing RNA polymerase to transcribe the genes.',
        interactive: {
          type: 'reveal' as const,
          label: 'What does each lac gene code for?',
          hiddenContent: 'lacZ codes for β-galactosidase (breaks down lactose into glucose + galactose). lacY codes for permease (transports lactose into the cell). lacA codes for transacetylase (function less clear, may help detoxify).'
        }
      },
      {
        title: 'Positive Regulation by CAP',
        content: 'Even with the repressor removed, the lac operon is only highly expressed when glucose is low. When glucose is scarce, cAMP levels rise; cAMP binds the CAP (catabolite activator protein), which then binds the promoter and enhances RNA polymerase binding. This dual control ensures lactose is only metabolised when both lactose is present AND glucose is absent.',
      },
      {
        title: 'Gene Regulation in Eukaryotes',
        content: 'Eukaryotic gene regulation is more complex than prokaryotic operons. It involves transcription factors, enhancers, silencers, epigenetic modifications (DNA methylation, histone acetylation), and post-transcriptional controls like alternative splicing and miRNA. In Ghana, research on gene regulation in sickle-cell disease at institutions like the Noguchi Memorial Institute helps develop therapies.',
      }
    ]
  },
  flashcards: [
    { id: 'lo-f1', question: 'What is the role of the lac repressor?', answer: 'It binds the operator to block transcription when lactose is absent' },
    { id: 'lo-f2', question: 'What induces the lac operon?', answer: 'Lactose (specifically allolactose, which binds the repressor)' },
    { id: 'lo-f3', question: 'What is the role of CAP in lac operon regulation?', answer: 'CAP-cAMP complex enhances transcription when glucose is low' },
    { id: 'lo-f4', question: 'What does lacZ code for?', answer: 'β-galactosidase (breaks down lactose into glucose + galactose)' },
    { id: 'lo-f5', question: 'Name one epigenetic mechanism of gene regulation.', answer: 'DNA methylation or histone acetylation' },
  ],
  checkpointAssessment: [
    {
      id: 'lo-q1',
      type: 'mcq' as const,
      prompt: 'When lactose is present and glucose is absent, the lac operon is:',
      options: [
        { id: 'a', text: 'Fully repressed' },
        { id: 'b', text: 'Transcribed at maximum rate' },
        { id: 'c', text: 'Partially active' },
        { id: 'd', text: 'Unaffected' }
      ],
      correctAnswer: 'b',
      explanation: 'Lactose removes the repressor; low glucose activates CAP. Both conditions together = maximum transcription.'
    },
    {
      id: 'lo-q2',
      type: 'one-word' as const,
      prompt: 'What molecule accumulates when glucose is low and activates CAP?',
      correctAnswer: 'cAMP',
      explanation: 'cAMP (cyclic AMP) binds to CAP, enabling it to enhance transcription of the lac operon.'
    },
    {
      id: 'lo-q3',
      type: 'mcq' as const,
      prompt: 'Which is an example of epigenetic gene regulation?',
      options: [
        { id: 'a', text: 'A mutation in the DNA sequence' },
        { id: 'b', text: 'DNA methylation of a promoter' },
        { id: 'c', text: 'An operon repressor binding' },
        { id: 'd', text: 'mRNA splicing' }
      ],
      correctAnswer: 'b',
      explanation: 'DNA methylation is an epigenetic modification that can silence gene expression without changing the DNA sequence.'
    },
  ]
},
{
  id: 'population-genetics-simulator',
  title: 'Population Genetics & Hardy-Weinberg',
  lesson: {
    sections: [
      {
        title: 'The Hardy-Weinberg Principle',
        content: 'In a large, randomly mating population with no mutation, selection, migration, or genetic drift, allele and genotype frequencies remain constant across generations. This equilibrium is described by p² + 2pq + q² = 1, where p = frequency of dominant allele A and q = frequency of recessive allele a.',
        interactive: {
          type: 'reveal' as const,
          label: 'If q = 0.3, what are p and genotype frequencies?',
          hiddenContent: 'p = 1 - 0.3 = 0.7. AA frequency = p² = 0.49. Aa frequency = 2pq = 0.42. aa frequency = q² = 0.09. Sum = 1.0. This means 9% of the population would show the recessive phenotype if all conditions are met.'
        }
      },
      {
        title: 'Factors Disrupting Equilibrium',
        content: 'Natural selection, mutation, genetic drift (chance events in small populations), gene flow (migration), and non-random mating all disturb Hardy-Weinberg equilibrium. In West Africa, the sickle-cell allele (HbS) is maintained at higher frequency than expected because heterozygous carriers (AS) have a survival advantage against malaria — this is heterozygote advantage, a form of balancing selection.',
      },
      {
        title: 'Genetic Drift & Evolution',
        content: 'In small populations, random events can dramatically change allele frequencies by chance — this is genetic drift. The bottleneck effect occurs when a population drops to a very small size (e.g., after a disease epidemic), reducing genetic diversity. The founder effect occurs when a small group colonises a new area. Both can fix rare alleles or eliminate common ones, even without selection.',
        interactive: {
          type: 'expand' as const,
          label: 'Sickle-cell in Ghana: a case study',
          hiddenContent: 'In malaria-endemic regions like Ghana, natural selection actively maintains the HbS allele. Heterozygotes (AS) have mild sickling in low-oxygen conditions but the HbS trait makes red blood cells inhospitable for Plasmodium falciparum. The Noguchi Memorial Institute for Medical Research in Accra conducts ongoing research into the genetics of sickle-cell disease and malaria resistance.'
        }
      }
    ]
  },
  flashcards: [
    { id: 'pop-f1', question: 'Hardy-Weinberg equation?', answer: 'p² + 2pq + q² = 1' },
    { id: 'pop-f2', question: 'What is genetic drift?', answer: 'Random change in allele frequency, especially in small populations' },
    { id: 'pop-f3', question: 'If q = 0.4, what is p?', answer: '0.6 (since p + q = 1)' },
    { id: 'pop-f4', question: 'What is heterozygote advantage?', answer: 'When Aa has higher fitness than both AA and aa — e.g., sickle-cell & malaria resistance' },
    { id: 'pop-f5', question: 'What causes the bottleneck effect?', answer: 'A sudden drastic reduction in population size, reducing genetic diversity' },
  ],
  checkpointAssessment: [
    {
      id: 'pop-q1',
      type: 'mcq' as const,
      prompt: 'If p = 0.6, q equals:',
      options: [
        { id: 'a', text: '0.2' },
        { id: 'b', text: '0.4' },
        { id: 'c', text: '0.6' },
        { id: 'd', text: '1.6' }
      ],
      correctAnswer: 'b',
      explanation: 'p + q = 1, so q = 1 - 0.6 = 0.4'
    },
    {
      id: 'pop-q2',
      type: 'one-word' as const,
      prompt: 'Selection can change allele ... in a population?',
      correctAnswer: 'Frequencies',
    },
    {
      id: 'pop-q3',
      type: 'matching' as const,
      prompt: 'Match each event to the Hardy-Weinberg factor it violates:',
      pairs: [
        { left: 'Natural selection', right: 'Selection pressure changes allele frequencies' },
        { left: 'Bottleneck event', right: 'Genetic drift in small population' },
        { left: 'Migration', right: 'Gene flow alters allele frequencies' }
      ]
    }
  ]
},
{
  id: 'respiration-energy-map',
  title: 'Cellular Respiration & Energy Release',
  lesson: {
    sections: [
      {
        title: 'Glycolysis',
        content: 'Glycolysis occurs in the cytoplasm of all living cells (no oxygen required). One glucose molecule (6 carbons) is split into two pyruvate molecules (3 carbons each). A net yield of 2 ATP and 2 NADH is produced. Glycolysis is the universal first stage of respiration — it occurs in both aerobic and anaerobic conditions.',
      },
      {
        title: 'Aerobic Respiration',
        content: 'In the presence of oxygen, pyruvate enters the mitochondrial matrix and is converted to Acetyl-CoA (link reaction). The Krebs cycle produces CO₂ and further NADH and FADH₂. These electron carriers feed into the electron transport chain on the inner mitochondrial membrane, where oxidative phosphorylation uses a proton gradient to synthesise up to 34 more ATP. Total aerobic yield: ~36-38 ATP per glucose.',
        interactive: {
          type: 'reveal' as const,
          label: 'Why does aerobic respiration produce so much more ATP?',
          hiddenContent: 'The electron transport chain uses NADH and FADH₂ as high-energy electron carriers. As electrons pass along the chain, protons are pumped across the inner membrane. ATP synthase harnesses this proton gradient to phosphorylate ADP to ATP — a process called chemiosmosis. This alone accounts for ~34 ATP per glucose.'
        }
      },
      {
        title: 'Anaerobic Respiration',
        content: 'When oxygen is unavailable, pyruvate is converted differently to regenerate NAD⁺ (needed for glycolysis to continue). In animal cells: pyruvate → lactate (lactic acid fermentation), releasing 2 ATP. In yeast/plant cells: pyruvate → ethanol + CO₂ (alcoholic fermentation), also releasing 2 ATP. Anaerobic respiration is much less efficient than aerobic, but it is rapid and allows survival when oxygen is limited.',
        interactive: {
          type: 'expand' as const,
          label: 'Why do muscles ache after intense exercise?',
          hiddenContent: 'During intense exercise, muscles cannot get enough oxygen for aerobic respiration. They switch to anaerobic respiration, producing lactic acid. Lactic acid lowers pH in the muscle, inhibiting enzymes and causing the characteristic burning sensation. After exercise, extra oxygen (the "oxygen debt") is used to convert lactic acid back to glucose in the liver.'
        }
      }
    ]
  },
  flashcards: [
    { id: 'resp-f1', question: 'Where does glycolysis occur?', answer: 'Cytoplasm' },
    { id: 'resp-f2', question: 'Final electron acceptor in aerobic respiration?', answer: 'Oxygen' },
    { id: 'resp-f3', question: 'Products of anaerobic respiration in muscle?', answer: 'Lactate (lactic acid) and 2 ATP' },
    { id: 'resp-f4', question: 'Approximately how many ATP does aerobic respiration produce?', answer: '36-38 ATP per glucose' },
    { id: 'resp-f5', question: 'What is the link reaction?', answer: 'Conversion of pyruvate to Acetyl-CoA in the mitochondrial matrix' },
  ],
  checkpointAssessment: [
    {
      id: 'resp-q1',
      type: 'mcq' as const,
      prompt: 'Low oxygen most directly limits which stage of aerobic respiration?',
      options: [
        { id: 'a', text: 'Glycolysis' },
        { id: 'b', text: 'Electron transport chain' },
        { id: 'c', text: 'Mitosis' },
        { id: 'd', text: 'Osmosis' }
      ],
      correctAnswer: 'b',
      explanation: 'The ETC requires oxygen as the final electron acceptor. Without it, NADH cannot be oxidised and the chain stops.'
    },
    {
      id: 'resp-q2',
      type: 'one-word' as const,
      prompt: 'Fermentation produces far less of which energy molecule?',
      correctAnswer: 'ATP',
    },
    {
      id: 'resp-q3',
      type: 'matching' as const,
      prompt: 'Match each stage to its location in the cell:',
      pairs: [
        { left: 'Glycolysis', right: 'Cytoplasm' },
        { left: 'Krebs cycle', right: 'Mitochondrial matrix' },
        { left: 'Electron transport chain', right: 'Inner mitochondrial membrane' }
      ]
    }
  ]
}
        ,
      {
        id: 'biochemistry-systems-sub',
      title: 'Biochemistry: Macromolecules and Enzyme Kinetics',
      lesson: { sections: [{ title: 'Biological Macromolecules', content: "Carbohydrates (monosaccharides to polysaccharides), proteins (amino acids linked by peptide bonds), lipids (fatty acids and glycerol), and nucleic acids (nucleotides) are the four major classes. Each has distinct structure-function relationships." }, { title: 'Enzyme Kinetics', content: "Enzymes are biological catalysts with active sites complementary to substrates. Michaelis-Menten kinetics describe how reaction rate depends on substrate concentration. Vmax is the maximum rate; Km is the substrate concentration at half Vmax." }, { title: 'Metabolic Integration', content: "Respiration, photosynthesis, and biosynthesis are interconnected metabolic pathways. ATP acts as the universal energy currency. NAD+ and FAD are electron carriers linking catabolic and anabolic reactions." }] },
      flashcards: [{ id: 'bioch-f1', question: 'What does Vmax represent?', answer: 'Maximum reaction rate at substrate saturation' }, { id: 'bioch-f2', question: 'What drives ATP synthesis in oxidative phosphorylation?', answer: 'A proton gradient' }, { id: 'bioch-f3', question: 'What is the primary carbon-fixing enzyme?', answer: 'RuBisCO' }, { id: 'bioch-f4', question: 'What bond links amino acids?', answer: 'Peptide bond' }, { id: 'bioch-f5', question: 'What type of molecule is an enzyme?', answer: 'Protein' }],
      checkpointAssessment: [{ id: 'bioch-q1', type: 'mcq' as const, prompt: 'Competitive inhibition primarily changes which parameter?', options: [{ id: 'a', text: 'Vmax only' }, { id: 'b', text: 'Km only' }, { id: 'c', text: 'ATP yield' }, { id: 'd', text: 'DNA sequence' }], correctAnswer: 'b' }, { id: 'bioch-q2', type: 'one-word' as const, prompt: 'The universal energy currency of cells is?', correctAnswer: 'ATP' }]
    }
        ],
        finalAssessment: [
    {
      id: 'gm-final-1',
      type: 'mcq' as const,
      prompt: 'A DNA template strand reads 3′-TAC-5′. What is the mRNA codon and which amino acid does it code for?',
      options: [
        { id: 'a', text: 'AUG — Methionine (Start)' },
        { id: 'b', text: 'TAC — Tyrosine' },
        { id: 'c', text: 'UAC — Tyrosine' },
        { id: 'd', text: 'ATG — Methionine' }
      ],
      correctAnswer: 'a',
      explanation: '3′-TAC-5′ → mRNA (5′→3′): AUG = Methionine (the universal start codon).'
    },
    {
      id: 'gm-final-2',
      type: 'one-word' as const,
      prompt: 'An insertion of one nucleotide that changes all subsequent codons is called a?',
      correctAnswer: 'Frameshift',
      explanation: 'Inserting or deleting a number of bases not divisible by 3 shifts the reading frame for all downstream codons.'
    },
    {
      id: 'gm-final-3',
      type: 'matching' as const,
      prompt: 'Match mutation type to description:',
      pairs: [
        { left: 'Silent mutation', right: 'No amino acid change' },
        { left: 'Nonsense mutation', right: 'Creates a stop codon' },
        { left: 'Frameshift', right: 'Insertion or deletion of bases' }
      ]
    }
  ]
};
