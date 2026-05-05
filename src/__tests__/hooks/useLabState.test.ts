import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLabState, saveLabSession, getStoredLabSessions } from '../../hooks/useLabState';
import type { LabConfig } from '../../data/labs/labTypes';

const MOCK_LAB_CONFIG: LabConfig = {
  id: 'test-lab',
  title: 'Test Lab',
  subject: 'physics',
  topic: 'test-topic',
  difficulty: 'high-school',
  description: 'A lab for testing',
  learningObjectives: ['Learn testing', 'Practice vitest'],
  variables: [
    {
      id: 'mass',
      name: 'Mass',
      unit: 'kg',
      min: 1,
      max: 100,
      default: 10,
      step: 1,
      description: 'Object mass',
    },
    {
      id: 'length',
      name: 'Length',
      unit: 'm',
      min: 0.1,
      max: 10,
      default: 1,
      step: 0.1,
      description: 'String length',
    },
  ],
  predictionPrompts: [
    {
      id: 'predict-1',
      question: 'What happens when mass increases?',
      type: 'multiple-choice',
      options: ['Period increases', 'Period decreases', 'No change'],
      correctAnswer: 'No change',
      explanation: 'Period depends on length, not mass.',
    },
  ],
  analysisPrompts: [
    {
      id: 'analysis-1',
      question: 'Explain the relationship you observed.',
      type: 'text',
      rubric: 'Should mention length-period relationship',
    },
  ],
  defaultVariables: { mass: 10, length: 1 },
  trialLimit: 3,
  timeEstimate: 15,
};

describe('useLabState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default values from config', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    expect(result.current.session.labId).toBe('test-lab');
    expect(result.current.session.currentPhase).toBe('predict');
    expect(result.current.session.currentTrial).toBe(1);
    expect(result.current.session.variables).toEqual({ mass: 10, length: 1 });
    expect(result.current.session.trials).toEqual([]);
    expect(result.current.currentTrialData.predictions).toEqual({});
    expect(result.current.currentTrialData.observations).toEqual([]);
    expect(result.current.currentTrialData.analysis).toEqual({});
  });

  it('setPhase updates the current phase', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.setPhase('observe');
    });

    expect(result.current.session.currentPhase).toBe('observe');

    act(() => {
      result.current.setPhase('analyze');
    });

    expect(result.current.session.currentPhase).toBe('analyze');
  });

  it('setVariables updates session variables', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.setVariables({ mass: 50, length: 2.5 });
    });

    expect(result.current.session.variables).toEqual({ mass: 50, length: 2.5 });
  });

  it('recordPrediction stores predictions for current trial', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'No change');
    });

    expect(result.current.currentTrialData.predictions).toEqual({
      'predict-1': 'No change',
    });
  });

  it('recordObservation appends data points', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    const dataPoint = {
      trial: 1,
      variables: { mass: 10, length: 1 },
      result: 2.01 as const,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.recordObservation(dataPoint);
    });

    expect(result.current.currentTrialData.observations).toHaveLength(1);
    expect(result.current.currentTrialData.observations[0].variables).toEqual({
      mass: 10,
      length: 1,
    });
  });

  it('recordAnalysis stores analysis answers', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordAnalysis('analysis-1', 'Period depends on length');
    });

    expect(result.current.currentTrialData.analysis).toEqual({
      'analysis-1': 'Period depends on length',
    });
  });

  it('nextTrial advances trial number and archives current trial', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'No change');
    });

    act(() => {
      result.current.nextTrial();
    });

    expect(result.current.session.currentTrial).toBe(2);
    expect(result.current.session.trials).toHaveLength(1);
    expect(result.current.session.trials[0].predictions).toEqual({
      'predict-1': 'No change',
    });
    expect(result.current.currentTrialData.predictions).toEqual({});
    expect(result.current.currentTrialData.observations).toEqual([]);
    expect(result.current.currentTrialData.analysis).toEqual({});
  });

  it('nextTrial returns false when trial limit is reached', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.nextTrial(); // 1 -> 2
    });

    expect(result.current.session.currentTrial).toBe(2);

    act(() => {
      result.current.nextTrial(); // 2 -> 3
    });

    expect(result.current.session.currentTrial).toBe(3);

    let succeeded: boolean;
    act(() => {
      succeeded = result.current.nextTrial(); // at limit, should return false
    });

    expect(succeeded!).toBe(false);
  });

  it('completeLab archives final trial, sets score and completedAt', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'No change');
      result.current.recordAnalysis('analysis-1', 'Period depends on length');
    });

    let session: ReturnType<typeof result.current.completeLab> extends () => infer R ? R : never;

    act(() => {
      session = result.current.completeLab();
    });

    expect(session!.completedAt).toBeDefined();
    expect(session!.score).toBeGreaterThanOrEqual(0);
    expect(session!.score).toBeLessThanOrEqual(100);
    expect(session!.trials).toHaveLength(1);
  });

  it('completeLab gives 50/50 for correct prediction + non-empty analysis', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'No change'); // correct
      result.current.recordAnalysis('analysis-1', 'Period depends on length');
    });

    let session: any;
    act(() => {
      session = result.current.completeLab();
    });

    expect(session.score).toBe(100);
  });

  it('completeLab gives 0/50 for wrong prediction + non-empty analysis', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'Period increases'); // wrong
      result.current.recordAnalysis('analysis-1', 'Something');
    });

    let session: any;
    act(() => {
      session = result.current.completeLab();
    });

    expect(session.score).toBe(50);
  });

  it('resetLab clears all state back to defaults', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordPrediction('predict-1', 'No change');
      result.current.setPhase('observe');
      result.current.nextTrial();
    });

    act(() => {
      result.current.resetLab();
    });

    expect(result.current.session.currentPhase).toBe('predict');
    expect(result.current.session.currentTrial).toBe(1);
    expect(result.current.session.trials).toEqual([]);
    expect(result.current.session.variables).toEqual({ mass: 10, length: 1 });
    expect(result.current.currentTrialData.predictions).toEqual({});
  });

  it('records multiple observations per trial', () => {
    const { result } = renderHook(() => useLabState(MOCK_LAB_CONFIG));

    act(() => {
      result.current.recordObservation({
        trial: 1,
        variables: { mass: 10, length: 1 },
        result: 2.01,
        timestamp: Date.now(),
      });
      result.current.recordObservation({
        trial: 1,
        variables: { mass: 20, length: 1 },
        result: 2.0,
        timestamp: Date.now(),
      });
      result.current.recordObservation({
        trial: 1,
        variables: { mass: 30, length: 1 },
        result: 1.99,
        timestamp: Date.now(),
      });
    });

    expect(result.current.currentTrialData.observations).toHaveLength(3);
  });
});

describe('saveLabSession / getStoredLabSessions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves lab sessions from localStorage', () => {
    const session = {
      id: 'abc123',
      labId: 'test-lab',
      currentPhase: 'analyze' as const,
      currentTrial: 1,
      trials: [],
      variables: { mass: 10 },
      startedAt: Date.now(),
      completedAt: Date.now(),
      score: 85,
    };

    saveLabSession(session);

    const stored = getStoredLabSessions('test-lab');
    expect(stored).toHaveLength(1);
    expect(stored[0].score).toBe(85);
  });

  it('returns empty array when no sessions stored', () => {
    const stored = getStoredLabSessions('nonexistent');
    expect(stored).toEqual([]);
  });

  it('appends multiple sessions', () => {
    const base = {
      id: 's1',
      labId: 'lab-1',
      currentPhase: 'analyze' as const,
      currentTrial: 1,
      trials: [],
      variables: {},
      startedAt: 1000,
    };

    saveLabSession({ ...base, id: 's1', score: 50 });
    saveLabSession({ ...base, id: 's2', score: 75 });
    saveLabSession({ ...base, id: 's3', score: 90 });

    const stored = getStoredLabSessions('lab-1');
    expect(stored).toHaveLength(3);
    expect(stored[2].score).toBe(90);
  });
});
