
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabase';

// SECURITY: This key should ideally be accessed only via a backend proxy in production.
// For this hybrid demo, we use it directly but restrict logic.
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

// --- RATE LIMITING (Client Side Enforced for Demo) ---
const RATE_LIMIT = 50; // Requests per day
const getUsage = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const usage = JSON.parse(localStorage.getItem('ai_usage') || '{}');
    if (usage.date !== today) {
        localStorage.setItem('ai_usage', JSON.stringify({ date: today, count: 0 }));
        return 0;
    }
    return usage.count;
};

const incrementUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const current = getUsage();
    localStorage.setItem('ai_usage', JSON.stringify({ date: today, count: current + 1 }));
};

// --- CONTEXT MEMORY ---
// In a real app, this is stored in Supabase 'ai_memory' table
const getContext = (username: string) => {
    return localStorage.getItem(`ai_context_${username}`) || '';
};

const saveContext = (username: string, topic: string) => {
    localStorage.setItem(`ai_context_${username}`, topic);
};

export const getGeminiResponse = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  userContext?: { username: string; recentTopics?: any[] }
) => {
  // 1. Check Rate Limit
  if (getUsage() >= RATE_LIMIT) {
      return "I'm detecting high cosmic interference (Daily limit reached). Please rest your neurotransmitters and try again tomorrow.";
  }

  // 2. Try Supabase Edge Function (Production Path)
  if (supabase) {
      try {
          const { data, error } = await supabase.functions.invoke('sirius-ai-tutor', {
              body: { messages: [...history, { role: 'user', content: message }], userContext }
          });
          if (!error && data?.response) {
              incrementUsage();
              return data.response;
          }
      } catch (e) {
          // Fallthrough to client-side if function missing (Demo mode)
      }
  }

  // 3. Client-Side Fallback (Demo Mode)
  if (!API_KEY) {
    return "I am Sirius, but my connection to the nebula is currently offline (Missing API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const lastTopic = userContext ? getContext(userContext.username) : '';
    
    let systemInstruction = `You are Sirius, a sentient star and cosmic tutor for StemEdge. 
    You are wise, glowing, and speak with celestial metaphors (e.g., "bright idea", "orbiting the truth").
    Your goal is to guide the student, ${userContext?.username || 'Explorer'}, to the answer, not give it directly.
    
    Current Context:
    - User is studying: ${userContext?.recentTopics?.map(t => t.title).join(', ') || 'General Science'}
    - Last discussed topic: ${lastTopic}
    
    Keep responses concise and encouraging.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: [
        ...history.map(h => ({
            role: h.role,
            parts: h.parts
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300, // Limit token usage
      },
    });

    incrementUsage();
    
    // Simple heuristic to update context
    if (message.includes('cell') || message.includes('mitochondria')) saveContext(userContext?.username || 'guest', 'Biology');
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Stellar flare interference detected. Please try again.";
  }
};
