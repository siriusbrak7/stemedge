import { SUBJECTS as BASE_SUBJECTS } from './mockData';
import {
  BIOLOGY_EXPANSION_TOPICS,
  CHEMISTRY_EXPANSION_TOPICS,
  MATHEMATICS_EXPANSION_TOPICS,
  PHYSICS_EXPANSION_TOPICS,
} from './expansionTopics';

const expansionMap: Record<string, typeof BIOLOGY_EXPANSION_TOPICS> = {
  biology: BIOLOGY_EXPANSION_TOPICS,
  physics: PHYSICS_EXPANSION_TOPICS,
  chemistry: CHEMISTRY_EXPANSION_TOPICS,
  math: MATHEMATICS_EXPANSION_TOPICS,
};

export const SUBJECTS = BASE_SUBJECTS.map((subject) => ({
  ...subject,
  topics: [...subject.topics, ...(expansionMap[subject.id] ?? [])],
}));
