import { GoogleGenerativeAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not set. AI tutor will be disabled.');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

export const aiTutorService = {
    async generateResponse(prompt: string, topic?: string) {
        if (!API_KEY) {
            return {
                text: "AI tutor is not configured. Please set up your Gemini API key.",
                error: "Missing API key"
            };
        }

        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: `You are Sirius, an enthusiastic STEM tutor for students aged 12-18. 
                Your tone is encouraging, patient, and clear. You explain concepts step-by-step without 
                being condescending. You encourage curiosity and critical thinking. You adapt your 
                explanations to the student's level. You NEVER provide answers directly without 
                guiding the student to discover it themselves. You use analogies from everyday life 
                to explain complex scientific concepts.`
            });

            const context = topic 
                ? `The student is currently studying ${topic}. ` 
                : '';

            const result = await model.generateContent(
                `${context}Student asks: ${prompt}\n\nRemember to be encouraging and age-appropriate.`
            );

            return {
                text: result.response.text(),
                error: null
            };
        } catch (error: any) {
            console.error('AI Tutor error:', error);
            return {
                text: null,
                error: error.message || 'Failed to generate response'
            };
        }
    },

    async generateHint(question: string, topic: string) {
        if (!API_KEY) return null;

        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: `You are Sirius, a helpful STEM tutor. Generate a SINGLE helpful hint 
                for the question without giving away the full answer. The hint should guide thinking.`
            });

            const result = await model.generateContent(
                `Topic: ${topic}\nQuestion: ${question}\n\nProvide a brief, encouraging hint:`
            );

            return result.response.text();
        } catch {
            return null;
        }
    }
};
