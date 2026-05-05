/**
 * aiService.ts
 * Central AI service for STEMEdge.
 *
 * Phase 1 routes AI requests through an optional backend proxy instead of
 * shipping provider keys in the client bundle.
 *
 * All public functions degrade gracefully: if the proxy is unavailable,
 * a deterministic local fallback is returned so the app never crashes.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GradingResult {
  is_correct: boolean;
  score: number;          // 0–1
  feedback: string;
  confidence: number;     // 0–1
  exam_tip?: string;      // WAEC / Cambridge / IB tip when relevant
}

export interface HintResult {
  hint: string;
  misconception?: string;
  next_step: string;
}

export interface EssayFeedback {
  marks_awarded: number;
  marks_available: number;
  criteria: { criterion: string; awarded: number; max: number; comment: string }[];
  overall_feedback: string;
  improvement_suggestion: string;
}

export interface SocraticResponse {
  response: string;
  follow_up_question: string;
  concept_addressed: string;
}

export interface AdaptiveQuestion {
  prompt: string;
  type: 'mcq' | 'one-word';
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easier' | 'same' | 'harder';
}

// ─── Proxy detection ─────────────────────────────────────────────────────────

const AI_PROXY_URL = import.meta.env?.VITE_AI_PROXY_URL?.trim().replace(/\/$/, '') ?? '';
const HAS_PROXY = AI_PROXY_URL.length > 0;

// ─── Low-level helpers ───────────────────────────────────────────────────────

async function callAI(task: string, systemPrompt: string, userMessage: string): Promise<unknown> {
  if (!HAS_PROXY) {
    throw new Error('No AI proxy configured. Set VITE_AI_PROXY_URL to enable remote AI features.');
  }

  const res = await fetch(`${AI_PROXY_URL}/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task,
      systemPrompt,
      userMessage,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI proxy ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Grade a short / one-word answer against a reference answer.
 * Used in QuizEngine for open-ended questions.
 */
export async function gradeOneWordAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  context?: string,
): Promise<GradingResult> {
  const systemPrompt = `You are an expert STEM examiner aligned with WAEC, Cambridge IGCSE/A-Level, IB, and NGSS curricula.
Grade short-answer responses fairly. Accept synonyms and minor spelling errors.
Return ONLY valid JSON matching this exact schema:
{
  "is_correct": boolean,
  "score": number (0 to 1),
  "feedback": string (1-2 sentences, encouraging, specific),
  "confidence": number (0 to 1),
  "exam_tip": string (optional — relevant WAEC/Cambridge/IB exam technique tip)
}`;

  const userMessage = `Question: ${question}
Reference answer: ${correctAnswer}
Student answer: ${userAnswer}
${context ? `Context: ${context}` : ''}`;

  try {
    const result = await callAI('grade-one-word', systemPrompt, userMessage) as GradingResult;
    return result;
  } catch (err) {
    // Deterministic local fallback
    const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const isCorrect = normalise(userAnswer) === normalise(correctAnswer);
    return {
      is_correct: isCorrect,
      score: isCorrect ? 1 : 0,
      feedback: isCorrect
        ? 'Correct! Well done.'
        : `Not quite — the expected answer is "${correctAnswer}".`,
      confidence: 1,
    };
  }
}

/**
 * Generate a personalised hint after a wrong answer.
 * Identifies the likely misconception and nudges the student.
 */
export async function generateHint(
  question: string,
  wrongAnswer: string,
  correctAnswer: string,
  subtopic: string,
): Promise<HintResult> {
  const systemPrompt = `You are a Socratic STEM tutor. A student got a question wrong.
Give a hint that guides WITHOUT giving away the answer. Identify any common misconception.
Return ONLY valid JSON:
{
  "hint": string (1-2 sentences, guiding question or analogy),
  "misconception": string (the likely wrong belief — optional),
  "next_step": string (what the student should think about next)
}`;

  const userMessage = `Subtopic: ${subtopic}
Question: ${question}
Student's wrong answer: ${wrongAnswer}
Correct answer (do NOT reveal): ${correctAnswer}`;

  try {
    return await callAI('generate-hint', systemPrompt, userMessage) as HintResult;
  } catch {
    return {
      hint: `Think carefully about the key concept in "${subtopic}". Re-read the question.`,
      next_step: 'Review your notes on this subtopic before trying again.',
    };
  }
}

/**
 * Socratic tutor chat — responds to student questions in-context.
 * Never gives direct answers; guides thinking.
 */
export async function socraticTutor(
  studentMessage: string,
  subtopic: string,
  subject: string,
  conversationHistory: { role: 'student' | 'tutor'; content: string }[],
): Promise<SocraticResponse> {
  const historyText = conversationHistory
    .slice(-6) // keep last 3 exchanges for context window efficiency
    .map(m => `${m.role === 'student' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n');

  const systemPrompt = `You are an expert STEM tutor for students in Ghana, West Africa.
Curriculum: WAEC/GES, Cambridge IGCSE & A-Level, IB Diploma, NGSS.
Subject: ${subject} — Subtopic: ${subtopic}.
Use the Socratic method: never give direct answers, ask guiding questions.
Keep responses concise (2-4 sentences). Be encouraging and culturally respectful.
Return ONLY valid JSON:
{
  "response": string (your Socratic response),
  "follow_up_question": string (a question to deepen their thinking),
  "concept_addressed": string (the key concept this exchange touches on)
}`;

  const userMessage = `Conversation so far:\n${historyText}\n\nStudent now asks: ${studentMessage}`;

  try {
    return await callAI('socratic-tutor', systemPrompt, userMessage) as SocraticResponse;
  } catch {
    return {
      response: `That's a great question about ${subtopic}! Let's think through it step by step.`,
      follow_up_question: `What do you already know about this concept from your notes?`,
      concept_addressed: subtopic,
    };
  }
}

/**
 * Grade an extended-response / essay answer against a mark scheme.
 * For IB Paper 2 / A-Level / WASSCE 6-mark style questions.
 */
export async function gradeEssayAnswer(
  question: string,
  markScheme: string,
  studentAnswer: string,
  marksAvailable: number,
): Promise<EssayFeedback> {
  const systemPrompt = `You are an experienced WAEC/Cambridge/IB examiner.
Grade the student's extended response against the mark scheme provided.
Be fair but rigorous. Award partial marks where justified.
Return ONLY valid JSON:
{
  "marks_awarded": number,
  "marks_available": number,
  "criteria": [
    { "criterion": string, "awarded": number, "max": number, "comment": string }
  ],
  "overall_feedback": string (2-3 sentences),
  "improvement_suggestion": string (1-2 actionable suggestions)
}`;

  const userMessage = `Question: ${question}
Marks available: ${marksAvailable}
Mark scheme: ${markScheme}
Student answer: ${studentAnswer}`;

  try {
    return await callAI('grade-essay', systemPrompt, userMessage) as EssayFeedback;
  } catch {
    // Rough local estimate: keyword match
    const keywords = markScheme.toLowerCase().split(/[\s,;.]+/).filter(w => w.length > 4);
    const answerLower = studentAnswer.toLowerCase();
    const matched = keywords.filter(k => answerLower.includes(k)).length;
    const ratio = Math.min(1, matched / Math.max(1, keywords.length * 0.4));
    const awarded = Math.round(ratio * marksAvailable);
    return {
      marks_awarded: awarded,
      marks_available: marksAvailable,
      criteria: [{ criterion: 'Content coverage', awarded, max: marksAvailable, comment: 'Auto-graded (AI unavailable).' }],
      overall_feedback: `You earned approximately ${awarded}/${marksAvailable} marks based on keyword matching. AI grading is temporarily unavailable.`,
      improvement_suggestion: 'Ensure you address each bullet point in the mark scheme explicitly.',
    };
  }
}

/**
 * Generate an adaptive follow-up question based on student performance.
 * Called after a wrong answer to give a scaffolded re-attempt.
 */
export async function generateAdaptiveQuestion(
  originalQuestion: string,
  correctAnswer: string,
  subtopic: string,
  difficulty: 'easier' | 'harder',
): Promise<AdaptiveQuestion> {
  const systemPrompt = `You are a STEM curriculum designer aligned with WAEC, Cambridge, IB.
Generate a single ${difficulty} question on the same concept.
Return ONLY valid JSON:
{
  "prompt": string,
  "type": "mcq" | "one-word",
  "options": [{"id":"a","text":string},{"id":"b","text":string},{"id":"c","text":string},{"id":"d","text":string}] (only if mcq),
  "correctAnswer": string (option id for mcq, answer string for one-word),
  "explanation": string,
  "difficulty": "${difficulty}"
}`;

  const userMessage = `Original question: ${originalQuestion}
Correct answer: ${correctAnswer}
Subtopic: ${subtopic}
Generate a ${difficulty} version of this question.`;

  try {
    return await callAI('generate-adaptive-question', systemPrompt, userMessage) as AdaptiveQuestion;
  } catch {
    // Fallback: return original question rephrased minimally
    return {
      prompt: `Can you recall the answer to: ${originalQuestion}`,
      type: 'one-word',
      correctAnswer,
      explanation: `The correct answer is ${correctAnswer}.`,
      difficulty,
    };
  }
}
