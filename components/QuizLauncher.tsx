import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, Play } from 'lucide-react';

interface Props {
    onStartQuiz: (topicId: string, questionCount: number, difficulty?: string) => void;
}

const TOPICS = [
    { id: 'cell_biology', name: 'Cell Biology', difficulty: ['Beginner', 'Intermediate', 'Advanced'] },
    { id: 'plant_nutrition', name: 'Plant Nutrition', difficulty: ['Beginner', 'Intermediate'] },
    { id: 'enzymes', name: 'Enzymes', difficulty: ['Intermediate', 'Advanced'] },
    { id: 'inheritance', name: 'Genetics', difficulty: ['Advanced'] },
    { id: 'ecology', name: 'Ecology', difficulty: ['Beginner', 'Intermediate'] }
];

const QUESTION_COUNTS = [5, 10, 15, 20, 'All'];

const QuizLauncher: React.FC<Props> = ({ onStartQuiz }) => {
    const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].id);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const [selectedCount, setSelectedCount] = useState<number | 'All'>(10);
    const [showFilters, setShowFilters] = useState(false);

    const availableDifficulties = TOPICS.find(t => t.id === selectedTopic)?.difficulty || [];

    const handleStart = () => {
        onStartQuiz(selectedTopic, selectedCount === 'All' ? 999 : selectedCount, selectedDifficulty || undefined);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Practice Quiz</h3>
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                    {showFilters ? 'Hide Filters' : 'Customize Quiz'}
                </button>
            </div>

            {showFilters ? (
                <div className="space-y-4">
                    {/* Topic Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Topic</label>
                        <div className="relative">
                            <select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:border-purple-500"
                            >
                                {TOPICS.map(topic => (
                                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Difficulty Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Difficulty (Optional)</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedDifficulty('')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    selectedDifficulty === '' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                Any
                            </button>
                            {availableDifficulties.map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                        selectedDifficulty === diff 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Count */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Questions</label>
                        <div className="flex gap-2 flex-wrap">
                            {QUESTION_COUNTS.map(count => (
                                <button
                                    key={count}
                                    onClick={() => setSelectedCount(count as number | "All")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                        selectedCount === count 
                                            ? 'bg-cyan-600 text-white' 
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        <Play className="w-4 h-4" /> Start Practice Quiz
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm">Quick quiz: 10 random questions</p>
                    <button
                        onClick={() => onStartQuiz(selectedTopic, 10, undefined)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                        Start <Play className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizLauncher;
