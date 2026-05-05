export type LabPhase = 'predict' | 'observe' | 'analyze';

export interface LabVariable {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
  description: string;
}

export interface PredictionPrompt {
  id: string;
  question: string;
  type: 'multiple-choice' | 'slider' | 'text';
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
}

export interface DataPoint {
  trial: number;
  variables: Record<string, number>;
  result: number | Record<string, number | string>;
  timestamp: number;
}

export interface AnalysisPrompt {
  id: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'data-analysis';
  correctAnswer?: string;
  rubric?: string;
  followUp?: string;
}

export interface LabConfig {
  id: string;
  title: string;
  subject: 'biology' | 'physics' | 'chemistry' | 'math';
  topic: string;
  difficulty: 'middle-school' | 'high-school' | 'advanced';
  description: string;
  learningObjectives: string[];
  variables: LabVariable[];
  predictionPrompts: PredictionPrompt[];
  analysisPrompts: AnalysisPrompt[];
  defaultVariables: Record<string, number>;
  trialLimit: number;
  timeEstimate: number;
  prerequisiteTopics?: string[];
}

export interface LabTrial {
  id: string;
  trialNumber: number;
  predictions: Record<string, string | number>;
  observations: DataPoint[];
  analysis: Record<string, string>;
  startedAt: number;
  completedAt?: number;
}

export interface LabSession {
  id: string;
  labId: string;
  userId?: string;
  currentPhase: LabPhase;
  currentTrial: number;
  trials: LabTrial[];
  variables: Record<string, number>;
  startedAt: number;
  completedAt?: number;
  score?: number;
}

export interface VirtualLabProps {
  config: LabConfig;
  onComplete?: (session: LabSession) => void;
  onProgress?: (session: LabSession) => void;
}

export interface SimulationRendererProps {
  variables: Record<string, number>;
  isRunning: boolean;
  dataPoints: DataPoint[];
  onRecordData: (point: DataPoint) => void;
}

export interface LabResult {
  labId: string;
  sessionId: string;
  completedAt: number;
  score: number;
  predictionsCorrect: number;
  analysisScore: number;
  trialsCompleted: number;
  timeSpent: number;
}
