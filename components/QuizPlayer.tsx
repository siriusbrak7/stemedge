
import React, { useEffect } from 'react';
import { Quiz } from '../types';
import { useQuiz } from '../hooks/useQuiz';
import { quizService } from '../services/quizData';
import QuizResults from './QuizResults';
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, XCircle, Star, Clock, Tag } from 'lucide-react';

interface Props {
    quizId?: string;
    customQuiz?: Quiz; // Allow passing a quiz object directly
    onClose: () => void;
}

const QuizPlayer: React.FC<Props> = ({ quizId, customQuiz, onClose }) => {
    // Determine the quiz to use
    let quiz = customQuiz;
    
    if (!quiz && quizId) {
        const fetched = quizService.getQuiz(quizId);
        if (fetched) quiz = fetched;
    }
    
    // Need to handle null quiz if ID doesn't exist and no custom quiz passed
    if (!quiz) {
         return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-2xl border border-slate-800 p-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-white font-bold text-lg">Quiz Not Available</h3>
                <p className="text-slate-400 text-center mb-4">This module is currently being prepared.</p>
                <button onClick={onClose} className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold">Back</button>
            </div>
        );
    }
    
    const {
        currentQuestionIndex,
        currentQuestion,
        answers,
        isFinished,
        hasAnsweredCurrent,
        isLastQuestion,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        restartQuiz,
        calculateResults
    } = useQuiz(quiz);

    // Save attempt when finished
    useEffect(() => {
        if (isFinished) {
            const results = calculateResults();
            quizService.saveAttempt({
                quizId: quiz.id,
                date: new Date().toISOString(),
                ...calculateResults(),
                userAnswers: answers,
                totalQuestions: quiz.questions.length
            });
        }
    }, [isFinished]);

    if (isFinished) {
        return (
            <QuizResults 
                quiz={quiz} 
                attempt={{
                    quizId: quiz.id,
                    date: new Date().toISOString(),
                    ...calculateResults(),
                    userAnswers: answers,
                    totalQuestions: quiz.questions.length
                }} 
                onRestart={restartQuiz}
                onExit={onClose}
            />
        );
    }

    const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    
    // Render difficulty stars
    const renderStars = (difficulty: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star 
                        key={i} 
                        className={`w-3 h-3 ${i <= difficulty ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            
            {/* Header / Progress */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-slate-400">
                    <span>{quiz.topicTitle}</span>
                    <span>Question {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
                
                {/* Metadata Bar */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2" title="Difficulty">
                             {renderStars(currentQuestion.difficulty)}
                        </div>
                        {currentQuestion.timeEstimate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                                <Clock className="w-3 h-3" /> {currentQuestion.timeEstimate}s
                            </div>
                        )}
                    </div>
                    {currentQuestion.standards && (
                        <div className="flex gap-2">
                            {currentQuestion.standards.map((std, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                    <Tag className="w-2.5 h-2.5" /> {std}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-6">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-3 mb-8">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = answers[currentQuestion.id] === option;
                            const isCorrectAnswer = option === currentQuestion.correctAnswer;
                            const isAnswered = hasAnsweredCurrent;

                            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 relative ";
                            
                            if (isAnswered) {
                                if (isCorrectAnswer) {
                                    // Correct answer (Green)
                                    buttonClass += "bg-emerald-50 border-emerald-500 text-white shadow-md";
                                } else if (isSelected && !isCorrectAnswer) {
                                    // Selected wrong answer (Red)
                                    buttonClass += "bg-red-500 border-red-500 text-white shadow-md";
                                } else {
                                    // Unselected options (Fade out)
                                    buttonClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60 cursor-default";
                                }
                            } else {
                                // Default State
                                buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-[0.99]";
                            }

                            return (
                                <button 
                                    key={idx}
                                    onClick={() => selectAnswer(option)}
                                    disabled={isAnswered}
                                    className={buttonClass}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{option}</span>
                                        {isAnswered && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-white" />}
                                        {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-white" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback Section */}
                    {hasAnsweredCurrent && (
                        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
                            <p className="text-blue-900 font-medium mb-1">Explanation:</p>
                            <p className="text-blue-800 text-sm leading-relaxed mb-2">{currentQuestion.explanation}</p>
                            {currentQuestion.misconception && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Common Misconception
                                    </p>
                                    <p className="text-amber-800 text-xs italic">"{currentQuestion.misconception}"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        {currentQuestionIndex > 0 ? (
                            <button 
                                onClick={prevQuestion}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>
                        ) : (
                            <div></div> /* Spacer */
                        )}

                        <button 
                            onClick={nextQuestion}
                            disabled={!hasAnsweredCurrent}
                            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${
                                hasAnsweredCurrent 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white translate-y-0 opacity-100' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isLastQuestion ? 'See Results' : 'Next Question'} 
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;
