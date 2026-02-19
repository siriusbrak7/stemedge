import { BIOLOGY_QUESTION_BANK } from '../data/biologyQuestions';
import { Question } from '../types';

export const quizPracticeService = {
    getQuestionsByFilter: (topicId: string, limit: number | 'All', difficulty?: string): Question[] => {
        // Find the topic section
        const topicSection = BIOLOGY_QUESTION_BANK.find(section => section.id === topicId);
        if (!topicSection) return [];

        let questions = topicSection.questions;

        // Filter by difficulty if specified
        if (difficulty) {
            const difficultyMap: Record<string, number> = {
                'Beginner': 1,
                'Intermediate': 3,
                'Advanced': 5
            };
            const maxDifficulty = difficultyMap[difficulty] || 5;
            questions = questions.filter(q => q.difficulty <= maxDifficulty);
        }

        // Randomize questions
        const shuffled = [...questions].sort(() => 0.5 - Math.random());

        // Apply limit
        if (limit !== 'All') {
            return shuffled.slice(0, Math.min(limit, shuffled.length));
        }
        return shuffled;
    },

    getAvailableTopics: () => {
        return BIOLOGY_QUESTION_BANK.map(section => ({
            id: section.id,
            name: section.name,
            questionCount: section.questions.length
        }));
    },

    gradeShortAnswer: (userAnswer: string, correctAnswer: string): boolean => {
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    },

    gradeTrueFalse: (userAnswer: string, correctAnswer: string): boolean => {
        return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    },

    gradeMCQ: (userAnswer: string, correctAnswer: string): boolean => {
        return userAnswer === correctAnswer;
    }
};
