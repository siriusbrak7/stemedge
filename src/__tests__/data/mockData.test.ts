import { describe, it, expect } from 'vitest';
import { SUBJECTS } from '../../data/mockData';
import type { Subject, Topic, Subtopic } from '../../data/types';

describe('mockData integrity', () => {
  it('has 4 subjects', () => {
    expect(SUBJECTS).toHaveLength(4);
  });

  it('each subject has correct id and name', () => {
    const ids = SUBJECTS.map(s => s.id);
    expect(ids).toContain('biology');
    expect(ids).toContain('physics');
    expect(ids).toContain('chemistry');
    expect(ids).toContain('math');
  });

  it('every subject has topics', () => {
    SUBJECTS.forEach(subject => {
      expect(subject.topics.length).toBeGreaterThan(0);
    });
  });

  it('every topic has at least 3 subtopics', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        expect(
          topic.subtopics.length,
          `${subject.id}/${topic.id} should have at least 3 subtopics, got ${topic.subtopics.length}`
        ).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('no subtopic is nested inside another subtopic\'s checkpointAssessment', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          subtopic.checkpointAssessment.forEach(question => {
            expect(
              question.type,
              `${subject.id}/${topic.id}/${subtopic.id} has a question with type 'subtopic' (nested bug): ${question.id}`
            ).not.toBe('subtopic');
            expect(
              question.id,
              `${subject.id}/${topic.id}/${subtopic.id} checkpointAssessment has a question with subtopic-looking id: ${question.id}`
            ).not.toMatch(/^[a-z-]+$/);
          });
        });
      });
    });
  });

  it('every subtopic has non-empty lesson sections', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          expect(
            subtopic.lesson.sections.length,
            `${subject.id}/${topic.id}/${subtopic.id} has empty lesson`
          ).toBeGreaterThan(0);
        });
      });
    });
  });

  it('every subtopic has at least 1 flashcard', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          expect(
            subtopic.flashcards.length,
            `${subject.id}/${topic.id}/${subtopic.id} has no flashcards`
          ).toBeGreaterThan(0);
        });
      });
    });
  });

  it('every subtopic has at least 1 checkpoint assessment question', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          expect(
            subtopic.checkpointAssessment.length,
            `${subject.id}/${topic.id}/${subtopic.id} has no checkpointAssessment`
          ).toBeGreaterThan(0);
        });
      });
    });
  });

  it('every topic has a non-empty finalAssessment', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        expect(
          topic.finalAssessment.length,
          `${subject.id}/${topic.id} has empty finalAssessment`
        ).toBeGreaterThan(0);
      });
    });
  });

  it('all MCQ questions have options', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
          subtopic.checkpointAssessment.forEach((q, idx) => {
            if (q.type === 'mcq') {
              expect(
                q.options?.length,
                `${subject.id}/${topic.id}/${subtopic.id} question[${idx}] is MCQ but has no options`
              ).toBeGreaterThan(0);
            }
          });
        });
        topic.finalAssessment.forEach((q, idx) => {
          if (q.type === 'mcq') {
            expect(
              q.options?.length,
              `${subject.id}/${topic.id} finalAssessment[${idx}] is MCQ but has no options`
            ).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  it('all matching questions have pairs', () => {
    SUBJECTS.forEach(subject => {
      subject.topics.forEach(topic => {
        const allQuestions = [
          ...topic.subtopics.flatMap(s => s.checkpointAssessment),
          ...topic.finalAssessment,
        ];
        allQuestions.forEach((q, idx) => {
          if (q.type === 'matching') {
            expect(
              q.pairs?.length,
              `${subject.id}/${topic.id} matching question[${idx}] has no pairs`
            ).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  it('all topic and subtopic ids are unique within a subject', () => {
    SUBJECTS.forEach(subject => {
      const topicIds = subject.topics.map(t => t.id);
      expect(new Set(topicIds).size, `${subject.id} has duplicate topic ids`).toBe(topicIds.length);

      const subtopicIds = subject.topics.flatMap(t => t.subtopics.map(s => s.id));
      expect(new Set(subtopicIds).size, `${subject.id} has duplicate subtopic ids`).toBe(subtopicIds.length);
    });
  });
});
