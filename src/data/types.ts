export type QuestionType = 'mcq' | 'one-word' | 'matching';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer?: string; // For MCQ (id) or one-word (exact match fallback/hint)
  options?: MCQOption[]; // For MCQ
  pairs?: MatchingPair[]; // For Matching
  hint?: string;
  explanation?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface LessonSection {
  title: string;
  content: string;
  interactive?: {
    type: 'reveal' | 'expand';
    label: string;
    hiddenContent: string;
  };
}

export interface Subtopic {
  id: string;
  title: string;
  lesson: {
    sections: LessonSection[];
  };
  flashcards: Flashcard[];
  checkpointAssessment: Question[];
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[]; // Exactly 3
  finalAssessment: Question[];
  levelBand?: 'secondary' | 'advanced';
  curriculumTags?: string[];
  summary?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
}
