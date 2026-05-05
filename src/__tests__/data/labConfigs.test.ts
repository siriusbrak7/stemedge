import { describe, it, expect } from 'vitest';
import {
  PHYSICS_LABS,
  CHEMISTRY_LABS,
  MATH_LABS,
  BIOLOGY_LABS,
} from '../../data/labs/labConfigs';
import type { LabConfig } from '../../data/labs/labTypes';

const ALL_CONFIGS = [...PHYSICS_LABS, ...CHEMISTRY_LABS, ...MATH_LABS, ...BIOLOGY_LABS];

describe('LabConfigs integrity', () => {
  it('has 38 total lab configs', () => {
    expect(ALL_CONFIGS.length).toBe(38);
  });

  it('physics has 10 labs', () => {
    expect(PHYSICS_LABS.length).toBe(10);
  });

  it('chemistry has 9 labs', () => {
    expect(CHEMISTRY_LABS.length).toBe(9);
  });

  it('math has 7 labs', () => {
    expect(MATH_LABS.length).toBe(7);
  });

  it('biology has 12 labs', () => {
    expect(BIOLOGY_LABS.length).toBe(12);
  });

  it('all configs have unique ids', () => {
    const ids = ALL_CONFIGS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all configs have required fields', () => {
    ALL_CONFIGS.forEach(config => {
      expect(config.id, 'missing id').toBeTruthy();
      expect(config.title, `missing title for ${config.id}`).toBeTruthy();
      expect(config.subject, `missing subject for ${config.id}`).toBeTruthy();
      expect(config.description, `missing description for ${config.id}`).toBeTruthy();
      expect(config.learningObjectives.length, `no objectives for ${config.id}`).toBeGreaterThan(0);
      expect(config.variables.length, `no variables for ${config.id}`).toBeGreaterThan(0);
      expect(config.predictionPrompts.length, `no prediction prompts for ${config.id}`).toBeGreaterThan(0);
      expect(config.analysisPrompts.length, `no analysis prompts for ${config.id}`).toBeGreaterThan(0);
      expect(config.defaultVariables, `no defaultVariables for ${config.id}`).toBeDefined();
      expect(config.trialLimit, `no trialLimit for ${config.id}`).toBeGreaterThan(0);
      expect(config.timeEstimate, `no timeEstimate for ${config.id}`).toBeGreaterThan(0);
    });
  });

  it('all variable ids are unique within a config', () => {
    ALL_CONFIGS.forEach(config => {
      const varIds = config.variables.map(v => v.id);
      expect(new Set(varIds).size, `${config.id} has duplicate variable ids`).toBe(varIds.length);
    });
  });

  it('all defaultVariables keys match variable ids', () => {
    ALL_CONFIGS.forEach(config => {
      const varIds = new Set(config.variables.map(v => v.id));
      Object.keys(config.defaultVariables).forEach(key => {
        expect(varIds.has(key), `${config.id} defaultVariables has unknown key: ${key}`).toBe(true);
      });

      config.variables.forEach(v => {
        expect(config.defaultVariables[v.id], `${config.id} variable ${v.id} missing from defaultVariables`).toBeDefined();
      });
    });
  });

  it('all variable defaults are within min/max range', () => {
    ALL_CONFIGS.forEach(config => {
      config.variables.forEach(v => {
        const def = config.defaultVariables[v.id];
        expect(def, `${config.id}/${v.id} default not in defaultVariables`).toBeDefined();
        expect(def, `${config.id}/${v.id} default ${def} < min ${v.min}`).toBeGreaterThanOrEqual(v.min);
        expect(def, `${config.id}/${v.id} default ${def} > max ${v.max}`).toBeLessThanOrEqual(v.max);
      });
    });
  });

  it('all prediction prompt ids are unique within a config', () => {
    ALL_CONFIGS.forEach(config => {
      const ids = config.predictionPrompts.map(p => p.id);
      expect(new Set(ids).size, `${config.id} has duplicate prediction prompt ids`).toBe(ids.length);
    });
  });

  it('all analysis prompt ids are unique within a config', () => {
    ALL_CONFIGS.forEach(config => {
      const ids = config.analysisPrompts.map(p => p.id);
      expect(new Set(ids).size, `${config.id} has duplicate analysis prompt ids`).toBe(ids.length);
    });
  });

  it('subject field matches the export array', () => {
    PHYSICS_LABS.forEach(c => expect(c.subject).toBe('physics'));
    CHEMISTRY_LABS.forEach(c => expect(c.subject).toBe('chemistry'));
    MATH_LABS.forEach(c => expect(c.subject).toBe('math'));
    BIOLOGY_LABS.forEach(c => expect(c.subject).toBe('biology'));
  });

  it('difficulty is one of the valid values', () => {
    const valid = ['middle-school', 'high-school', 'advanced'];
    ALL_CONFIGS.forEach(config => {
      expect(valid, `${config.id} has invalid difficulty: ${config.difficulty}`).toContain(config.difficulty);
    });
  });

  it('all MCQ prediction prompts have options', () => {
    ALL_CONFIGS.forEach(config => {
      config.predictionPrompts.forEach(prompt => {
        if (prompt.type === 'multiple-choice') {
          expect(prompt.options?.length, `${config.id}/${prompt.id} MCQ has no options`).toBeGreaterThan(0);
        }
      });
    });
  });
});
