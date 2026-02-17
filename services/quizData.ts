
import { Quiz, QuizAttempt, Question } from '../types';
import { BIOLOGY_QUESTION_BANK, TopicSection } from '../data/biologyQuestions';

// Convert bank format to Quiz format
const getQuizFromBank = (topicId: string): Quiz | null => {
    const section = BIOLOGY_QUESTION_BANK.find(t => t.id === topicId);
    
    // Fallback if topic not found in bank (e.g., bio-104 which isn't populated yet)
    // We return a generic quiz or the cell biology one as a fallback for the demo
    if (!section) {
        if (topicId.startsWith('bio-')) {
             const fallback = BIOLOGY_QUESTION_BANK[0];
             return {
                id: `quiz_${topicId}`,
                topicId: topicId,
                topicTitle: "Biology Practice",
                questions: fallback.questions
             };
        }
        return null;
    }

    return {
        id: `quiz_${section.id}`,
        topicId: section.id,
        topicTitle: section.name,
        questions: section.questions
    };
};

const ATTEMPTS_KEY = 'stemedge_quiz_attempts';

export const quizService = {
    getQuiz: (topicId: string): Quiz | null => {
        return getQuizFromBank(topicId);
    },

    // NEW: Generate a small quiz based on a specific sub-topic (e.g. "Nucleus")
    generateMiniQuiz: (topicId: string, keyword: string, title?: string): Quiz | null => {
        const fullQuiz = getQuizFromBank(topicId);
        if (!fullQuiz) return null;

        const kw = keyword.toLowerCase();
        
        // Filter questions related to the keyword
        let filteredQuestions = fullQuiz.questions.filter(q => 
            q.text.toLowerCase().includes(kw) || 
            q.explanation.toLowerCase().includes(kw) ||
            q.correctAnswer.toLowerCase().includes(kw)
        );

        // If not enough questions, fill with random ones from the same topic
        if (filteredQuestions.length < 3) {
            const otherQuestions = fullQuiz.questions.filter(q => !filteredQuestions.includes(q));
            // Shuffle and slice
            const filler = otherQuestions.sort(() => 0.5 - Math.random()).slice(0, 3 - filteredQuestions.length);
            filteredQuestions = [...filteredQuestions, ...filler];
        }

        return {
            id: `mini_${topicId}_${keyword}`,
            topicId: topicId,
            topicTitle: title || `${keyword} Quiz`,
            questions: filteredQuestions
        };
    },

    saveAttempt: (attempt: QuizAttempt) => {
        const existing = localStorage.getItem(ATTEMPTS_KEY);
        const attempts = existing ? JSON.parse(existing) : [];
        attempts.push(attempt);
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
        
        // Also simulate updating the user progress score in the main student service
        const progressKey = 'stemedge_student_progress';
        const allProgressJson = localStorage.getItem(progressKey);
        if (allProgressJson) {
            const allProgress = JSON.parse(allProgressJson);
            // Assuming 'student' user for this context in local mode
            // (In real app, we use userId from auth context, here we fallback to generic key update if auth not passed)
            // But we can iterate over users to find matching if needed. 
            // For demo robustness, we'll try to update 'Annabel' specifically or current user.
            
            // Just update the first matching user progress found for simplicity in demo
            Object.keys(allProgress).forEach(username => {
                 const userProgress = allProgress[username];
                 if (userProgress && userProgress[attempt.quizId.replace('quiz_', '')]) {
                     userProgress[attempt.quizId.replace('quiz_', '')].quizScore = Math.round((attempt.score / attempt.totalQuestions) * 100);
                 }
            });
            
            localStorage.setItem(progressKey, JSON.stringify(allProgress));
        }
    }
};
