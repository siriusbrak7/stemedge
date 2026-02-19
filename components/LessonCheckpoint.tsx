import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Checkpoint {
    id: string;
    question: string;
    type: 'mcq' | 'truefalse' | 'short';
    options?: string[];
    correctAnswer: string;
}

interface Props {
    checkpoints: Checkpoint[];
    onComplete: () => void;
    onClose: () => void;
}

const LessonCheckpoint: React.FC<Props> = ({ checkpoints, onComplete, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

    const current = checkpoints[currentIndex];
    const isAnswered = answers[current?.id] !== undefined;

    const handleAnswer = (answer: string) => {
        setAnswers({ ...answers, [current.id]: answer });
        
        // Auto-check correctness
        const isCorrect = answer.toLowerCase().trim() === current.correctAnswer.toLowerCase().trim();
        setFeedback({
            correct: isCorrect,
            message: isCorrect ? '✅ Correct!' : `❌ Incorrect. The correct answer is: ${current.correctAnswer}`
        });
    };

    const handleNext = () => {
        if (currentIndex < checkpoints.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFeedback(null);
        } else {
            setShowResult(true);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        checkpoints.forEach(cp => {
            if (answers[cp.id]?.toLowerCase().trim() === cp.correctAnswer.toLowerCase().trim()) {
                correct++;
            }
        });
        return {
            correct,
            total: checkpoints.length,
            percentage: Math.round((correct / checkpoints.length) * 100)
        };
    };

    if (showResult) {
        const score = calculateScore();
        const passed = score.percentage >= 70; // Pass threshold

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Checkpoint Complete</h3>
                    
                    <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-white mb-2">{score.percentage}%</div>
                        <p className="text-slate-400">You got {score.correct} out of {score.total} correct</p>
                    </div>

                    {passed ? (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                            <p className="text-green-400 font-medium">✨ Great job! You've mastered this section.</p>
                        </div>
                    ) : (
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
                            <p className="text-amber-400 font-medium">📚 Need 70% to continue. Review and try again.</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {passed ? (
                            <button
                                onClick={onComplete}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
                            >
                                Continue to Next Section
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setCurrentIndex(0);
                                    setAnswers({});
                                    setShowResult(false);
                                    setFeedback(null);
                                }}
                                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                            >
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        Checkpoint {currentIndex + 1}/{checkpoints.length}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                {/* Question */}
                <div className="mb-6">
                    <p className="text-white text-lg mb-4">{current.question}</p>

                    {/* Answer Input based on type */}
                    {current.type === 'mcq' && current.options && (
                        <div className="space-y-2">
                            {current.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                        answers[current.id] === opt
                                            ? 'bg-purple-600 border-purple-400 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    } ${isAnswered && answers[current.id] !== opt ? 'opacity-50' : ''}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {current.type === 'truefalse' && (
                        <div className="flex gap-4">
                            {['True', 'False'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                                        answers[current.id] === opt
                                            ? 'bg-purple-600 border-purple-400 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {current.type === 'short' && (
                        <input
                            type="text"
                            placeholder="Type your answer..."
                            value={answers[current.id] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            disabled={isAnswered}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    )}
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`mb-4 p-3 rounded-lg ${
                        feedback.correct ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end">
                    {isAnswered && (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            {currentIndex < checkpoints.length - 1 ? 'Next' : 'Finish'} <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonCheckpoint;
