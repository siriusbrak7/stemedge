export type { QuestionType, MCQOption, MatchingPair, Question, Flashcard, LessonSection, Subtopic, Topic, Subject } from './types';

import type { Subject } from './types';
import { CELL_BIOLOGY_TOPIC } from './biology/cell-biology';
import { GENETICS_MOLECULAR_TOPIC } from './biology/genetics-molecular';
import { HUMAN_PHYSIOLOGY_TOPIC } from './biology/human-physiology';
import { FORCES_MOTION_TOPIC } from './physics/forces-motion';
import { WAVES_OPTICS_TOPIC } from './physics/waves-optics';
import { ELECTROMAGNETISM_TOPIC } from './physics/electromagnetism';
import { ATOMIC_PERIODIC_TOPIC } from './chemistry/atomic-periodic';
import { QUANTITATIVE_CHEMISTRY_TOPIC } from './chemistry/quantitative-chemistry';
import { THERMODYNAMICS_TOPIC } from './chemistry/thermodynamics';
import { LINEAR_EQUATIONS_TOPIC } from './math/linear-equations';
import { QUADRATICS_TOPIC } from './math/quadratics';
import { CALCULUS_TOPIC } from './math/calculus';

export const SUBJECTS: Subject[] = [
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Microscope',
    topics: [
      CELL_BIOLOGY_TOPIC,
      GENETICS_MOLECULAR_TOPIC,
      HUMAN_PHYSIOLOGY_TOPIC,
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Zap',
    topics: [
      FORCES_MOTION_TOPIC,
      WAVES_OPTICS_TOPIC,
      ELECTROMAGNETISM_TOPIC,
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'Beaker',
    topics: [
      ATOMIC_PERIODIC_TOPIC,
      QUANTITATIVE_CHEMISTRY_TOPIC,
      THERMODYNAMICS_TOPIC,
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    topics: [
      LINEAR_EQUATIONS_TOPIC,
      QUADRATICS_TOPIC,
      CALCULUS_TOPIC,
    ],
  },
];
