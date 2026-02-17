import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '../types';
import { CheckCircle, XCircle, RotateCcw, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    quiz: Quiz;
    attempt: QuizAttempt;
    onRestart: () => void;
    onExit: () => void;
}

const QuizResults: React.FC<Props> = ({ quiz, attempt, onRestart, onExit }) => {
    // Determine color based on percentage
    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
    const scoreColor = percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-red-400';
    
    // Filter questions that were wrong
    const missedQuestions = quiz.questions.filter(q => attempt.missedQuestionIds.includes(q.id));

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            
            {/* Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                
                <h2 className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-4">Quiz Complete</h2>
                <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>
                    {attempt.score}/{attempt.totalQuestions}
                </div>
                <p className="text-xl text-slate-300 mb-6">
                    {percentage >= 80 ? 'Stellar Performance! 🚀' : percentage >= 60 ? 'Good work, Cadet! 👍' : 'Needs more training. 🛠️'}
                </p>
                <div className="inline-block bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-slate-400 font-mono">Accuracy: </span>
                    <span className={`font-bold ${scoreColor}`}>{percentage}%</span>
                </div>
            </div>

            {/* Questions to Review */}
            {missedQuestions.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" /> Questions to Review
                    </h3>
                    
                    <div className="space-y-4">
                        {missedQuestions.map(q => (
                            <ReviewCard 
                                key={q.id} 
                                questionText={q.text} 
                                userAnswer={attempt.userAnswers[q.id]}
                                correctAnswer={q.correctAnswer}
                                explanation={q.explanation}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Perfect Score Message */}
            {missedQuestions.length === 0 && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 mb-8 flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <div>
                        <h3 className="text-white font-bold">Perfect Score!</h3>
                        <p className="text-slate-400 text-sm">You have mastered this topic. No review needed.</p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-slate-800 pt-8">
                <button 
                    onClick={onRestart}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                >
                    <RotateCcw className="w-4 h-4" /> Practice Again
                </button>
                <button 
                    onClick={onExit}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors"
                >
                    <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
                </button>
            </div>
        </div>
    );
};

interface ReviewCardProps {
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ questionText, userAnswer, correctAnswer, explanation }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Truncate text logic
    const shortText = questionText.split(' ').slice(0, 12).join(' ') + (questionText.split(' ').length > 12 ? '...' : '');

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-slate-900 mb-3">{shortText}</p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span className="font-medium">You: {userAnswer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span className="font-medium">Correct: {correctAnswer}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase flex justify-between items-center transition-colors"
            >
                {isOpen ? 'Hide Explanation' : 'View Explanation'}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-slate-50 text-slate-700 text-sm border-t border-slate-200 animate-fade-in">
                    {explanation}
                </div>
            )}
        </div>
    );
};

export default QuizResults;