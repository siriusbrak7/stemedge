import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { studentDataService } from '../services/studentDataService';
import { gamificationService } from '../services/gamificationService';
import LessonCheckpoint from './LessonCheckpoint';
import { BookOpen, ChevronRight, ChevronLeft, Award } from 'lucide-react';

// Hardcoded checkpoints for each topic
const CHECKPOINTS = {
    cell_biology: [
        {
            id: 'cb1',
            question: 'What is the primary function of the cell membrane?',
            type: 'mcq' as const,
            options: ['Protein synthesis', 'Energy production', 'Control substance movement', 'Cell division'],
            correctAnswer: 'Control substance movement'
        },
        {
            id: 'cb2',
            question: 'True or False: Plant cells contain chloroplasts while animal cells do not.',
            type: 'truefalse' as const,
            correctAnswer: 'True'
        },
        {
            id: 'cb3',
            question: 'What organelle is known as the "powerhouse" of the cell?',
            type: 'short' as const,
            correctAnswer: 'mitochondria'
        },
        {
            id: 'cb4',
            question: 'Which structure controls the passage of substances into and out of a typical animal cell?',
            type: 'mcq' as const,
            options: ['Cell wall', 'Cell membrane', 'Nuclear membrane', 'Cytoplasm'],
            correctAnswer: 'Cell membrane'
        },
        {
            id: 'cb5',
            question: 'Name the process by which plants make their own food using sunlight.',
            type: 'short' as const,
            correctAnswer: 'photosynthesis'
        }
    ],
    plant_nutrition: [
        {
            id: 'pn1',
            question: 'What is the correct chemical equation for photosynthesis?',
            type: 'mcq' as const,
            options: [
                '6CO2 + 6H2O → C6H12O6 + 6O2',
                'C6H12O6 + 6O2 → 6CO2 + 6H2O',
                'CO2 + H2O → CH2O + O2',
                '6O2 + 6H2O → C6H12O6 + 6CO2'
            ],
            correctAnswer: '6CO2 + 6H2O → C6H12O6 + 6O2'
        },
        {
            id: 'pn2',
            question: 'True or False: Chlorophyll is responsible for absorbing light energy during photosynthesis.',
            type: 'truefalse' as const,
            correctAnswer: 'True'
        },
        {
            id: 'pn3',
            question: 'What gas do plants absorb from the atmosphere for photosynthesis?',
            type: 'short' as const,
            correctAnswer: 'carbon dioxide'
        },
        {
            id: 'pn4',
            question: 'Magnesium is required in plants for the formation of:',
            type: 'mcq' as const,
            options: ['Cell walls', 'Chlorophyll', 'Amino acids', 'Starch'],
            correctAnswer: 'Chlorophyll'
        },
        {
            id: 'pn5',
            question: 'What is the primary product of photosynthesis that plants use for energy?',
            type: 'short' as const,
            correctAnswer: 'glucose'
        }
    ],
    enzymes: [
        {
            id: 'enz1',
            question: 'Enzymes function as biological:',
            type: 'mcq' as const,
            options: ['Substrates', 'Products', 'Catalysts', 'Hormones'],
            correctAnswer: 'Catalysts'
        },
        {
            id: 'enz2',
            question: 'True or False: Enzymes are used up during chemical reactions.',
            type: 'truefalse' as const,
            correctAnswer: 'False'
        },
        {
            id: 'enz3',
            question: 'What happens to an enzyme at high temperatures?',
            type: 'short' as const,
            correctAnswer: 'denatures'
        },
        {
            id: 'enz4',
            question: 'A student investigates the effect of temperature on an enzyme-controlled reaction. At 60°C, no product forms. What is the most likely explanation?',
            type: 'mcq' as const,
            options: [
                'The enzyme has been used up',
                'The substrate has denatured',
                'The enzyme has denatured',
                'The reaction has reached equilibrium'
            ],
            correctAnswer: 'The enzyme has denatured'
        },
        {
            id: 'enz5',
            question: 'What is the name for the specific molecule that an enzyme acts upon?',
            type: 'short' as const,
            correctAnswer: 'substrate'
        }
    ],
    inheritance: [
        {
            id: 'inh1',
            question: 'In pea plants, tall stem (T) is dominant over short stem (t). A cross between two heterozygous tall plants (Tt × Tt) produces 400 offspring. Approximately how many would be expected to be short?',
            type: 'mcq' as const,
            options: ['0', '100', '200', '300'],
            correctAnswer: '100'
        },
        {
            id: 'inh2',
            question: 'True or False: A homozygous dominant genotype has two different alleles for a gene.',
            type: 'truefalse' as const,
            correctAnswer: 'False'
        },
        {
            id: 'inh3',
            question: 'What is the term for the physical expression of a genetic trait?',
            type: 'short' as const,
            correctAnswer: 'phenotype'
        },
        {
            id: 'inh4',
            question: 'Which term describes an organism with two identical alleles for a particular gene?',
            type: 'mcq' as const,
            options: ['Heterozygous', 'Homozygous', 'Dominant', 'Recessive'],
            correctAnswer: 'Homozygous'
        },
        {
            id: 'inh5',
            question: 'DNA is composed of four nitrogenous bases. Name any two.',
            type: 'short' as const,
            correctAnswer: 'adenine guanine'
        }
    ],
    ecology: [
        {
            id: 'eco1',
            question: 'In a food chain, what is the role of the organism at the first trophic level?',
            type: 'mcq' as const,
            options: ['Primary consumer', 'Secondary consumer', 'Producer', 'Decomposer'],
            correctAnswer: 'Producer'
        },
        {
            id: 'eco2',
            question: 'True or False: Energy is recycled in an ecosystem.',
            type: 'truefalse' as const,
            correctAnswer: 'False'
        },
        {
            id: 'eco3',
            question: 'What percentage of energy is typically transferred from one trophic level to the next?',
            type: 'short' as const,
            correctAnswer: '10'
        },
        {
            id: 'eco4',
            question: 'Why is energy lost between trophic levels?',
            type: 'mcq' as const,
            options: ['Photosynthesis', 'Respiration and heat loss', 'Reproduction', 'Growth'],
            correctAnswer: 'Respiration and heat loss'
        },
        {
            id: 'eco5',
            question: 'What term describes the role and position a species has in its environment?',
            type: 'short' as const,
            correctAnswer: 'niche'
        }
    ]
};

const LessonView: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { user } = useUser();
    const [showCheckpoint, setShowCheckpoint] = useState(false);
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);

    const topicCheckpoints = topicId ? CHECKPOINTS[topicId as keyof typeof CHECKPOINTS] : [];

    const handleCheckpointComplete = async () => {
        // Mark lesson as complete
        if (topicId && user?.id) {
            await studentDataService.updateProgress(user.id, topicId, 1);
            const newBadges = await gamificationService.triggerBadgeCheck(user.id!);`n            if (newBadges.length > 0) {`n                console.log(`"Earned badges:`", newBadges);`n            }
            setLessonCompleted(true);
        }
        setShowCheckpoint(false);
    };

    const sections = [
        { title: 'Introduction', content: 'Welcome to this lesson...' },
        { title: 'Key Concepts', content: 'Learn the core ideas...' },
        { title: 'Examples', content: 'See real-world applications...' },
        { title: 'Checkpoint', content: 'Test your understanding...' }
    ];

    const handleNext = () => {
        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
            // Show checkpoint at the last section
            if (currentSection === sections.length - 2) {
                setShowCheckpoint(true);
            }
        }
    };

    if (!topicId || !topicCheckpoints) {
        return <div className="text-white p-8">Lesson not found</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {showCheckpoint && (
                <LessonCheckpoint
                    checkpoints={topicCheckpoints}
                    onComplete={handleCheckpointComplete}
                    onClose={() => setShowCheckpoint(false)}
                />
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                    <h1 className="text-2xl font-bold text-white capitalize">{topicId.replace('_', ' ')}</h1>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Lesson Progress</span>
                        <span>{currentSection + 1}/{sections.length}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500"
                            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Section content */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">{sections[currentSection].title}</h2>
                    <p className="text-slate-300 leading-relaxed">
                        {sections[currentSection].content}
                        {currentSection === 2 && (
                            <span className="block mt-4 p-4 bg-slate-800/50 rounded-lg">
                                Example content for {topicId} will be loaded from your lesson database.
                            </span>
                        )}
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                    <button
                        onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                        disabled={currentSection === 0}
                        className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {currentSection < sections.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate(`/quiz/${topicId}`)}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            Take Quiz <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {lessonCompleted && (
                    <div className="mt-6 p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
                        <Award className="w-5 h-5" />
                        <span>Lesson completed! You earned a badge.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonView;
