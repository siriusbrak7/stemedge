import { useState, useCallback } from 'react';
import { 
  LabSession, 
  LabTrial, 
  LabConfig, 
  DataPoint,
  LabPhase 
} from '../data/labs/labTypes';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useLabState(config: LabConfig) {
  const [session, setSession] = useState<LabSession>(() => ({
    id: generateId(),
    labId: config.id,
    currentPhase: 'predict' as LabPhase,
    currentTrial: 1,
    trials: [],
    variables: { ...config.defaultVariables },
    startedAt: Date.now(),
  }));

  const [currentTrialData, setCurrentTrialData] = useState<LabTrial>(() => ({
    id: generateId(),
    trialNumber: 1,
    predictions: {},
    observations: [],
    analysis: {},
    startedAt: Date.now(),
  }));

  const setPhase = useCallback((phase: LabPhase) => {
    setSession(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const setVariables = useCallback((vars: Record<string, number>) => {
    setSession(prev => ({ ...prev, variables: vars }));
  }, []);

  const recordPrediction = useCallback((promptId: string, answer: string | number) => {
    setCurrentTrialData(prev => ({
      ...prev,
      predictions: { ...prev.predictions, [promptId]: answer }
    }));
  }, []);

  const recordObservation = useCallback((point: DataPoint) => {
    setCurrentTrialData(prev => ({
      ...prev,
      observations: [...prev.observations, point]
    }));
  }, []);

  const recordAnalysis = useCallback((promptId: string, answer: string) => {
    setCurrentTrialData(prev => ({
      ...prev,
      analysis: { ...prev.analysis, [promptId]: answer }
    }));
  }, []);

  const nextTrial = useCallback(() => {
    const newTrialNumber = session.currentTrial + 1;
    if (newTrialNumber > config.trialLimit) return false;

    const completedTrial: LabTrial = {
      ...currentTrialData,
      completedAt: Date.now(),
    };

    setSession(prev => ({
      ...prev,
      currentTrial: newTrialNumber,
      trials: [...prev.trials, completedTrial],
      currentPhase: 'predict',
    }));

    setCurrentTrialData({
      id: generateId(),
      trialNumber: newTrialNumber,
      predictions: {},
      observations: [],
      analysis: {},
      startedAt: Date.now(),
    });

    return true;
  }, [session.currentTrial, config.trialLimit, currentTrialData]);

  const completeLab = useCallback(() => {
    const completedTrial: LabTrial = {
      ...currentTrialData,
      completedAt: Date.now(),
    };

    const finalSession: LabSession = {
      ...session,
      trials: [...session.trials, completedTrial],
      completedAt: Date.now(),
      score: calculateScore([...session.trials, completedTrial], config),
    };

    setSession(finalSession);
    return finalSession;
  }, [session, currentTrialData, config]);

  const resetLab = useCallback(() => {
    const newSession: LabSession = {
      id: generateId(),
      labId: config.id,
      currentPhase: 'predict',
      currentTrial: 1,
      trials: [],
      variables: { ...config.defaultVariables },
      startedAt: Date.now(),
    };

    setSession(newSession);
    setCurrentTrialData({
      id: generateId(),
      trialNumber: 1,
      predictions: {},
      observations: [],
      analysis: {},
      startedAt: Date.now(),
    });
  }, [config]);

  return {
    session,
    currentTrialData,
    setPhase,
    setVariables,
    recordPrediction,
    recordObservation,
    recordAnalysis,
    nextTrial,
    completeLab,
    resetLab,
  };
}

function calculateScore(trials: LabTrial[], config: LabConfig): number {
  if (trials.length === 0) return 0;

  let predictionScore = 0;
  let analysisScore = 0;
  let totalPredictions = 0;
  let totalAnalysis = 0;

  trials.forEach(trial => {
    config.predictionPrompts.forEach(prompt => {
      if (trial.predictions[prompt.id] !== undefined) {
        totalPredictions++;
        if (prompt.correctAnswer !== undefined) {
          if (trial.predictions[prompt.id] === prompt.correctAnswer) {
            predictionScore++;
          }
        }
      }
    });

    config.analysisPrompts.forEach(prompt => {
      const answer = trial.analysis[prompt.id];
      if (!answer?.trim()) return;

      totalAnalysis++;
      if (prompt.correctAnswer) {
        if (normaliseText(answer) === normaliseText(prompt.correctAnswer)) {
          analysisScore++;
        }
        return;
      }

      analysisScore++;
    });
  });

  const predictionPercent = totalPredictions > 0 
    ? (predictionScore / totalPredictions) * 50 
    : 0;
  const analysisPercent = totalAnalysis > 0 
    ? (analysisScore / totalAnalysis) * 50 
    : 0;

  return Math.round(predictionPercent + analysisPercent);
}

function normaliseText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

export function saveLabSession(session: LabSession) {
  const key = `stemedge_lab_${session.labId}`;
  const sessions = getStoredLabSessions(session.labId);
  sessions.push(session);
  localStorage.setItem(key, JSON.stringify(sessions));
}

export function getStoredLabSessions(labId: string): LabSession[] {
  const key = `stemedge_lab_${labId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function getLatestLabSession(labId: string): LabSession | null {
  const sessions = getStoredLabSessions(labId);
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}
