import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question } from '../types';

interface QuizState {
    currentQuestionIndex: number;
    answers: Record<string, string>; // map questionId -> selectedOption
    isFinished: boolean;
    startTime: number;
}

export const useQuiz = (quiz: Quiz) => {
    const [state, setState] = useState<QuizState>({
        currentQuestionIndex: 0,
        answers: {},
        isFinished: false,
        startTime: Date.now()
    });

    // 1. Load from Session Storage on Mount (Handle Refresh)
    useEffect(() => {
        const savedState = sessionStorage.getItem(`quiz_state_${quiz.id}`);
        if (savedState) {
            setState(JSON.parse(savedState));
        }
    }, [quiz.id]);

    // 2. Save to Session Storage on Change
    useEffect(() => {
        if (state.isFinished) {
            sessionStorage.removeItem(`quiz_state_${quiz.id}`);
        } else {
            sessionStorage.setItem(`quiz_state_${quiz.id}`, JSON.stringify(state));
        }
    }, [state, quiz.id]);

    // 3. Prevent Navigation Warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!state.isFinished && Object.keys(state.answers).length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [state.isFinished, state.answers]);

    const currentQuestion = quiz.questions[state.currentQuestionIndex];
    const isLastQuestion = state.currentQuestionIndex === quiz.questions.length - 1;
    const hasAnsweredCurrent = !!state.answers[currentQuestion?.id];

    const selectAnswer = useCallback((option: string) => {
        if (state.isFinished || hasAnsweredCurrent) return;
        
        setState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentQuestion.id]: option
            }
        }));
    }, [state.isFinished, hasAnsweredCurrent, currentQuestion]);

    const nextQuestion = useCallback(() => {
        if (isLastQuestion) {
            finishQuiz();
        } else {
            setState(prev => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1
            }));
        }
    }, [isLastQuestion]);

    const prevQuestion = useCallback(() => {
        if (state.currentQuestionIndex > 0) {
            setState(prev => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1
            }));
        }
    }, [state.currentQuestionIndex]);

    const finishQuiz = useCallback(() => {
        setState(prev => ({
            ...prev,
            isFinished: true
        }));
    }, []);

    const restartQuiz = useCallback(() => {
        setState({
            currentQuestionIndex: 0,
            answers: {},
            isFinished: false,
            startTime: Date.now()
        });
        sessionStorage.removeItem(`quiz_state_${quiz.id}`);
    }, [quiz.id]);

    // Calculate Score
    const calculateResults = () => {
        let correctCount = 0;
        const missedQuestionIds: string[] = [];

        quiz.questions.forEach(q => {
            if (state.answers[q.id] === q.correctAnswer) {
                correctCount++;
            } else {
                missedQuestionIds.push(q.id);
            }
        });

        return {
            score: correctCount,
            percentage: Math.round((correctCount / quiz.questions.length) * 100),
            missedQuestionIds,
            timeSpent: Math.floor((Date.now() - state.startTime) / 1000)
        };
    };

    return {
        currentQuestionIndex: state.currentQuestionIndex,
        currentQuestion,
        answers: state.answers,
        isFinished: state.isFinished,
        hasAnsweredCurrent,
        isLastQuestion,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        restartQuiz,
        calculateResults
    };
};