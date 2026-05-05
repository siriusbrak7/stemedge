import { describe, it, expect } from 'vitest';
import { ALL_BIOLOGY_MISCONCEPTIONS } from '../../data/misconceptions/biology';
import { ALL_MATH_MISCONCEPTIONS } from '../../data/misconceptions/math';
import { ALL_PHYSICS_MISCONCEPTIONS } from '../../data/misconceptions/physics';
import { ALL_CHEMISTRY_MISCONCEPTIONS } from '../../data/misconceptions/chemistry';
import type { Misconception } from '../../components/shared/MisconceptionAlert';

function validateMisconceptionArray(items: Misconception[], subject: string) {
  describe(`${subject} misconceptions`, () => {
    it('has at least 10 items', () => {
      expect(items.length, `${subject} should have at least 10 misconceptions`).toBeGreaterThanOrEqual(10);
    });

    it('all items have unique ids', () => {
      const ids = items.map(m => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all items have required fields', () => {
      items.forEach(m => {
        expect(m.id, `missing id`).toBeTruthy();
        expect(m.title, `missing title for ${m.id}`).toBeTruthy();
        expect(m.misconception, `missing misconception for ${m.id}`).toBeTruthy();
        expect(m.correction, `missing correction for ${m.id}`).toBeTruthy();
        expect(m.explanation, `missing explanation for ${m.id}`).toBeTruthy();
        expect(['common', 'moderate', 'rare']).toContain(m.difficulty);
      });
    });

    it('all items have a relatedTopic', () => {
      items.forEach(m => {
        expect(m.relatedTopic, `${m.id} missing relatedTopic`).toBeTruthy();
      });
    });

    it('misconception and correction are different', () => {
      items.forEach(m => {
        expect(m.misconception).not.toBe(m.correction);
      });
    });
  });
}

validateMisconceptionArray(ALL_BIOLOGY_MISCONCEPTIONS, 'Biology');
validateMisconceptionArray(ALL_MATH_MISCONCEPTIONS, 'Math');
validateMisconceptionArray(ALL_PHYSICS_MISCONCEPTIONS, 'Physics');
validateMisconceptionArray(ALL_CHEMISTRY_MISCONCEPTIONS, 'Chemistry');
