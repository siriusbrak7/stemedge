import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, GraduationCap, ArrowRight, RotateCcw, Scale, CheckCircle2, XCircle, ChevronRight, Shuffle, Trophy, Zap, BookOpen } from 'lucide-react';
import { MisconceptionAlert } from '../../shared';
import { LINEAR_EQUATION_MISCONCEPTIONS } from '../../../data/misconceptions/math';

type ViewMode = 'explore' | 'solve' | 'learn';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Equation {
  id: string;
  display: string;
  a: number;
  b: number;
  c: number;
  d?: number; // for ax + b = cx + d format
  solution: number;
  steps: { action: string; result: string; operation: string }[];
  difficulty: Difficulty;
}

interface OperationChoice {
  label: string;
  operation: string;
  isCorrect: boolean;
}

const PRESET_EQUATIONS: Equation[] = [
  {
    id: 'eq1', display: '2x + 4 = 10', a: 2, b: 4, c: 10, solution: 3, difficulty: 'easy',
    steps: [
      { action: 'Subtract 4 from both sides', result: '2x = 6', operation: 'subtract-4' },
      { action: 'Divide both sides by 2', result: 'x = 3', operation: 'divide-2' },
    ],
  },
  {
    id: 'eq2', display: '3x - 5 = 16', a: 3, b: -5, c: 16, solution: 7, difficulty: 'easy',
    steps: [
      { action: 'Add 5 to both sides', result: '3x = 21', operation: 'add-5' },
      { action: 'Divide both sides by 3', result: 'x = 7', operation: 'divide-3' },
    ],
  },
  {
    id: 'eq3', display: '4x + 7 = 31', a: 4, b: 7, c: 31, solution: 6, difficulty: 'easy',
    steps: [
      { action: 'Subtract 7 from both sides', result: '4x = 24', operation: 'subtract-7' },
      { action: 'Divide both sides by 4', result: 'x = 6', operation: 'divide-4' },
    ],
  },
  {
    id: 'eq4', display: '5x - 8 = 22', a: 5, b: -8, c: 22, solution: 6, difficulty: 'medium',
    steps: [
      { action: 'Add 8 to both sides', result: '5x = 30', operation: 'add-8' },
      { action: 'Divide both sides by 5', result: 'x = 6', operation: 'divide-5' },
    ],
  },
  {
    id: 'eq5', display: '-2x + 14 = 6', a: -2, b: 14, c: 6, solution: 4, difficulty: 'medium',
    steps: [
      { action: 'Subtract 14 from both sides', result: '-2x = -8', operation: 'subtract-14' },
      { action: 'Divide both sides by -2', result: 'x = 4', operation: 'divide--2' },
    ],
  },
  {
    id: 'eq6', display: '6x + 3 = 3x + 15', a: 3, b: 3, c: 15, d: 15, solution: 4, difficulty: 'hard',
    steps: [
      { action: 'Subtract 3x from both sides', result: '3x + 3 = 15', operation: 'subtract-3x' },
      { action: 'Subtract 3 from both sides', result: '3x = 12', operation: 'subtract-3' },
      { action: 'Divide both sides by 3', result: 'x = 4', operation: 'divide-3' },
    ],
  },
  {
    id: 'eq7', display: '7x - 2 = 4x + 13', a: 3, b: -2, c: 13, d: 13, solution: 5, difficulty: 'hard',
    steps: [
      { action: 'Subtract 4x from both sides', result: '3x - 2 = 13', operation: 'subtract-4x' },
      { action: 'Add 2 to both sides', result: '3x = 15', operation: 'add-2' },
      { action: 'Divide both sides by 3', result: 'x = 5', operation: 'divide-3' },
    ],
  },
];

const generateEquation = (difficulty: Difficulty): Equation => {
  const id = `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (difficulty === 'easy') {
    const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const solution = Math.floor(Math.random() * 10) + 1;
    const bSign = Math.random() > 0.5 ? 1 : -1;
    const b = bSign * (Math.floor(Math.random() * 12) + 1);
    const c = a * solution + b;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const steps = b >= 0
      ? [
          { action: `Subtract ${b} from both sides`, result: `${a}x = ${c - b}`, operation: `subtract-${b}` },
          { action: `Divide both sides by ${a}`, result: `x = ${solution}`, operation: `divide-${a}` },
        ]
      : [
          { action: `Add ${Math.abs(b)} to both sides`, result: `${a}x = ${c - b}`, operation: `add-${Math.abs(b)}` },
          { action: `Divide both sides by ${a}`, result: `x = ${solution}`, operation: `divide-${a}` },
        ];
    return { id, display: `${a}x ${bStr} = ${c}`, a, b, c, solution, steps, difficulty };
  }

  if (difficulty === 'medium') {
    const aChoices = [-3, -2, 2, 3, 4, 5, 6];
    const a = aChoices[Math.floor(Math.random() * aChoices.length)];
    const solution = Math.floor(Math.random() * 15) - 5;
    const b = Math.floor(Math.random() * 20) - 10;
    const c = a * solution + b;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const steps: { action: string; result: string; operation: string }[] = [];
    if (b >= 0) {
      steps.push({ action: `Subtract ${b} from both sides`, result: `${a}x = ${c - b}`, operation: `subtract-${b}` });
    } else {
      steps.push({ action: `Add ${Math.abs(b)} to both sides`, result: `${a}x = ${c - b}`, operation: `add-${Math.abs(b)}` });
    }
    steps.push({ action: `Divide both sides by ${a}`, result: `x = ${solution}`, operation: `divide-${a}` });
    return { id, display: `${a}x ${bStr} = ${c}`, a, b, c, solution, steps, difficulty };
  }

  // Hard: ax + b = cx + d
  const a1 = Math.floor(Math.random() * 6) + 2;
  const a2 = Math.floor(Math.random() * (a1 - 1)) + 1;
  const solution = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 15) - 7;
  const d = (a1 - a2) * solution + b;
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
  const effectiveA = a1 - a2;
  const steps: { action: string; result: string; operation: string }[] = [
    { action: `Subtract ${a2}x from both sides`, result: `${effectiveA}x ${bStr} = ${d}`, operation: `subtract-${a2}x` },
  ];
  if (b >= 0) {
    steps.push({ action: `Subtract ${b} from both sides`, result: `${effectiveA}x = ${d - b}`, operation: `subtract-${b}` });
  } else {
    steps.push({ action: `Add ${Math.abs(b)} to both sides`, result: `${effectiveA}x = ${d - b}`, operation: `add-${Math.abs(b)}` });
  }
  steps.push({ action: `Divide both sides by ${effectiveA}`, result: `x = ${solution}`, operation: `divide-${effectiveA}` });
  return { id, display: `${a1}x ${bStr} = ${a2}x ${dStr}`, a: effectiveA, b, c: d, d, solution, steps, difficulty };
};

const MISTAKE_QUESTIONS: {
  question: string;
  options: string[];
  correct: string;
  misconceptionId: string;
}[] = [
  {
    question: 'To isolate x in 3x = 12, you should:',
    options: ['Subtract 3 from both sides', 'Divide both sides by 3', 'Divide both sides by 12', 'Subtract x from both sides'],
    correct: 'Divide both sides by 3',
    misconceptionId: 'divide-not-subtract',
  },
  {
    question: 'When solving 2x + 5 = 13, what must you do FIRST?',
    options: ['Divide both sides by 2', 'Subtract 5 from both sides', 'Subtract 2 from both sides', 'Multiply both sides by 5'],
    correct: 'Subtract 5 from both sides',
    misconceptionId: 'both-sides-operation',
  },
  {
    question: 'What is the solution to -x = 7?',
    options: ['x = 7', 'x = -7', 'x = -1', 'Cannot be solved'],
    correct: 'x = -7',
    misconceptionId: 'negative-variable',
  },
  {
    question: 'Why should you check your answer by substituting back?',
    options: [
      "It's optional and wastes time",
      'It catches arithmetic and sign errors',
      'It changes the solution',
      'It makes the equation harder',
    ],
    correct: 'It catches arithmetic and sign errors',
    misconceptionId: 'verify-solution',
  },
];

export default function SolveLinear() {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [equations, setEquations] = useState<Equation[]>(PRESET_EQUATIONS);
  const [eqIndex, setEqIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1);
  const [activeMisconception, setActiveMisconception] = useState<string | null>(null);

  // Interactive mode state
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState(-1);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [opFeedback, setOpFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [interactiveScore, setInteractiveScore] = useState({ correct: 0, total: 0 });

  const [userAnswer, setUserAnswer] = useState('');
  const [verifyResult, setVerifyResult] = useState<'correct' | 'wrong' | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  const [mistakeIndex, setMistakeIndex] = useState(0);
  const [mistakeAnswer, setMistakeAnswer] = useState<string | null>(null);
  const [mistakeFeedback, setMistakeFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mistakeScore, setMistakeScore] = useState(0);

  const [solvedCount, setSolvedCount] = useState(0);

  const currentEq = equations[eqIndex] || PRESET_EQUATIONS[0];
  const currentStep = stepIndex >= 0 && stepIndex < currentEq.steps.length ? currentEq.steps[stepIndex] : null;
  const isSolved = stepIndex >= currentEq.steps.length;

  const filteredEquations = useMemo(() => {
    return equations.filter(eq => eq.difficulty === difficulty);
  }, [equations, difficulty]);

  const getCurrentDisplay = useCallback(() => {
    if (stepIndex < 0) return currentEq.display;
    if (isSolved) return `x = ${currentEq.solution}`;
    return currentEq.steps[stepIndex].result;
  }, [stepIndex, currentEq, isSolved]);

  const getBalanceState = useCallback(() => {
    if (isSolved) return { rotation: 0, leftWeight: 1, rightWeight: 1 };
    if (stepIndex < 0) return { rotation: 0, leftWeight: 1, rightWeight: 1 };
    const progress = (stepIndex + 1) / currentEq.steps.length;
    return {
      rotation: Math.sin(progress * Math.PI) * -3,
      leftWeight: 1 - progress * 0.3,
      rightWeight: 1 - progress * 0.3,
    };
  }, [stepIndex, isSolved, currentEq]);

  const getOperationChoices = useCallback((): OperationChoice[] => {
    if (interactiveStep < 0 || interactiveStep >= currentEq.steps.length) return [];
    const correctStep = currentEq.steps[interactiveStep];
    const choices: OperationChoice[] = [
      { label: correctStep.action, operation: correctStep.operation, isCorrect: true },
    ];

    // Generate distractors
    const distractors: string[] = [];
    const absB = Math.abs(currentEq.b);
    const absA = Math.abs(currentEq.a);

    if (correctStep.operation.startsWith('subtract-') || correctStep.operation.startsWith('add-')) {
      distractors.push(`Multiply both sides by ${absB || 2}`);
      distractors.push(`Divide both sides by ${absA}`);
      if (correctStep.operation.startsWith('subtract-')) {
        distractors.push(`Add ${absB} to both sides`);
      } else {
        distractors.push(`Subtract ${absB} from both sides`);
      }
    } else if (correctStep.operation.startsWith('divide-')) {
      distractors.push(`Subtract ${absA} from both sides`);
      distractors.push(`Multiply both sides by ${absA}`);
      distractors.push(`Add ${absA} to both sides`);
    }

    // Pick 2 random distractors
    const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 2);
    shuffled.forEach(d => {
      choices.push({ label: d, operation: d, isCorrect: false });
    });

    // Shuffle choices
    return choices.sort(() => Math.random() - 0.5);
  }, [interactiveStep, currentEq]);

  const [cachedChoices, setCachedChoices] = useState<OperationChoice[]>([]);

  const nextStep = () => {
    if (stepIndex < currentEq.steps.length) {
      setStepIndex(prev => prev + 1);
    }
  };

  const loadEquation = (idx: number) => {
    setEqIndex(idx);
    setStepIndex(-1);
    setVerifyResult(null);
    setShowVerification(false);
    setUserAnswer('');
    setInteractiveStep(-1);
    setSelectedOp(null);
    setOpFeedback(null);
    setCachedChoices([]);
  };

  const resetEquation = () => {
    setStepIndex(-1);
    setVerifyResult(null);
    setShowVerification(false);
    setUserAnswer('');
    setInteractiveStep(-1);
    setSelectedOp(null);
    setOpFeedback(null);
    setCachedChoices([]);
  };

  const generateNew = () => {
    const newEq = generateEquation(difficulty);
    setEquations(prev => [...prev, newEq]);
    setEqIndex(equations.length);
    resetEquation();
  };

  const startInteractiveSolve = () => {
    setInteractiveMode(true);
    setInteractiveStep(0);
    setStepIndex(-1);
    setSelectedOp(null);
    setOpFeedback(null);
    // Pre-compute choices for first step
    setTimeout(() => {
      const choices = getOperationChoices();
      setCachedChoices(choices);
    }, 0);
  };

  const handleOperationChoice = (choice: OperationChoice) => {
    if (opFeedback) return;
    setSelectedOp(choice.operation);
    if (choice.isCorrect) {
      setOpFeedback('correct');
      setInteractiveScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setOpFeedback('wrong');
      setInteractiveScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const advanceInteractive = () => {
    const nextInteractiveStep = interactiveStep + 1;
    if (nextInteractiveStep >= currentEq.steps.length) {
      setStepIndex(currentEq.steps.length);
      setInteractiveStep(currentEq.steps.length);
      setSolvedCount(prev => prev + 1);
    } else {
      setInteractiveStep(nextInteractiveStep);
      setStepIndex(nextInteractiveStep - 1);
    }
    setSelectedOp(null);
    setOpFeedback(null);
    // Pre-compute choices for next step
    setTimeout(() => {
      if (nextInteractiveStep < currentEq.steps.length) {
        const step = currentEq.steps[nextInteractiveStep];
        const choices: OperationChoice[] = [
          { label: step.action, operation: step.operation, isCorrect: true },
        ];
        const absB = Math.abs(currentEq.b);
        const absA = Math.abs(currentEq.a);
        const distractors: string[] = [];
        if (step.operation.startsWith('subtract-') || step.operation.startsWith('add-')) {
          distractors.push(`Multiply both sides by ${absB || 2}`);
          distractors.push(`Divide both sides by ${absA}`);
          if (step.operation.startsWith('subtract-')) distractors.push(`Add ${absB} to both sides`);
          else distractors.push(`Subtract ${absB} from both sides`);
        } else {
          distractors.push(`Subtract ${absA} from both sides`);
          distractors.push(`Multiply both sides by ${absA}`);
          distractors.push(`Add ${absA} to both sides`);
        }
        const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 2);
        shuffled.forEach(d => choices.push({ label: d, operation: d, isCorrect: false }));
        setCachedChoices(choices.sort(() => Math.random() - 0.5));
      }
    }, 0);
  };

  const checkAnswer = () => {
    const num = parseFloat(userAnswer);
    if (isNaN(num)) return;
    if (Math.abs(num - currentEq.solution) < 0.01) {
      setVerifyResult('correct');
      setSolvedCount(prev => prev + 1);
    } else {
      setVerifyResult('wrong');
    }
    setShowVerification(true);
  };

  const getVerificationMath = () => {
    const x = currentEq.solution;
    const a = currentEq.a;
    const b = currentEq.b;
    const c = currentEq.c;
    const leftVal = a * x + b;
    return { leftVal, rightVal: c, matches: leftVal === c };
  };

  const handleMistakeAnswer = (answer: string) => {
    if (mistakeFeedback) return;
    setMistakeAnswer(answer);
    const q = MISTAKE_QUESTIONS[mistakeIndex];
    if (answer === q.correct) {
      setMistakeFeedback('correct');
      setMistakeScore(prev => prev + 1);
    } else {
      setMistakeFeedback('wrong');
      const mis = LINEAR_EQUATION_MISCONCEPTIONS.find(m => m.id === q.misconceptionId);
      if (mis) setActiveMisconception(mis.id);
    }
  };

  const nextMistake = () => {
    setMistakeIndex(prev => (prev + 1) % MISTAKE_QUESTIONS.length);
    setMistakeAnswer(null);
    setMistakeFeedback(null);
    setActiveMisconception(null);
  };

  const balanceState = getBalanceState();

  const renderExplore = () => (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto mt-8">
      {/* Difficulty Selector */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</span>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); const filtered = equations.filter(eq => eq.difficulty === d); if (filtered.length > 0) { setEqIndex(equations.indexOf(filtered[0])); resetEquation(); }}}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
              difficulty === d
                ? d === 'easy' ? 'bg-green-500 text-black' : d === 'medium' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={generateNew}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
        >
          <Shuffle size={12} /> Generate
        </button>
      </div>

      {/* Equation Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filteredEquations.map((eq) => (
          <button
            key={eq.id}
            onClick={() => loadEquation(equations.indexOf(eq))}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all ${
              eqIndex === equations.indexOf(eq)
                ? 'bg-brand-accent text-black'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {eq.display}
          </button>
        ))}
      </div>

      {/* Current equation display */}
      <div className="text-3xl md:text-5xl font-mono font-black text-white bg-slate-900/80 px-10 py-5 rounded-[2rem] border border-brand-border flex items-center gap-4 shadow-2xl">
        <span className="text-cyan-400">{getCurrentDisplay()}</span>
      </div>

      {/* Visual Balance Scale */}
      <div className="relative w-full max-w-lg h-48 flex flex-col items-center">
        {/* Fulcrum */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-slate-600" />
        <motion.div
          className="w-full h-3 bg-slate-700 rounded-full border border-slate-500 relative"
          style={{ transformOrigin: 'center' }}
          animate={{ rotate: balanceState.rotation }}
          transition={{ type: 'spring', damping: 12 }}
        >
          {/* Left pan */}
          <div
            className="absolute -bottom-20 left-8 w-24 h-20 border-b-3 border-l-2 border-r-2 border-slate-500 rounded-b-lg flex flex-col items-center justify-end pb-1"
            style={{ transform: `rotate(${-balanceState.rotation}deg)` }}
          >
            <div className="flex gap-1 mb-1 flex-wrap justify-center">
              {Array.from({ length: Math.max(1, Math.floor(3 * balanceState.leftWeight)) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-sm bg-cyan-500/60 border border-cyan-400/40"
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">LHS</span>
          </div>
          {/* Right pan */}
          <div
            className="absolute -bottom-20 right-8 w-24 h-20 border-b-3 border-l-2 border-r-2 border-slate-500 rounded-b-lg flex flex-col items-center justify-end pb-1"
            style={{ transform: `rotate(${-balanceState.rotation}deg)` }}
          >
            <div className="flex gap-1 mb-1 flex-wrap justify-center">
              {Array.from({ length: Math.max(1, Math.floor(3 * balanceState.rightWeight)) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-sm bg-orange-500/60 border border-orange-400/40"
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-orange-400 font-mono font-bold">RHS</span>
          </div>
          {/* Balance indicator */}
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
            >
              <span className="text-green-400 text-[10px] font-bold">BALANCED ✓</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Step display */}
      {currentStep && !interactiveMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 rounded-xl p-4 border border-brand-accent/30 max-w-md text-center"
        >
          <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">Step {stepIndex + 1}</span>
          <p className="text-white font-mono mt-1">{currentStep.action}</p>
        </motion.div>
      )}

      {/* Interactive operation choices */}
      {interactiveMode && interactiveStep >= 0 && interactiveStep < currentEq.steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/60 rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                Step {interactiveStep + 1} of {currentEq.steps.length} — Choose the correct operation
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {interactiveScore.correct}/{interactiveScore.total}
              </span>
            </div>

            {/* Current state */}
            <div className="bg-black/40 rounded-xl p-4 border border-slate-800 mb-4 text-center">
              <div className="text-2xl font-mono font-bold text-white">
                {interactiveStep === 0 ? currentEq.display : currentEq.steps[interactiveStep - 1].result}
              </div>
            </div>

            <div className="space-y-2">
              {cachedChoices.map((choice, i) => (
                <button
                  key={`${choice.operation}-${i}`}
                  onClick={() => handleOperationChoice(choice)}
                  disabled={opFeedback !== null}
                  className={`w-full p-3 rounded-xl text-left transition-all border text-sm font-mono ${
                    selectedOp === choice.operation
                      ? opFeedback === 'correct'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-red-500/20 border-red-500 text-red-400'
                      : opFeedback && choice.isCorrect
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{choice.label}</span>
                    {selectedOp === choice.operation && opFeedback && (
                      opFeedback === 'correct' ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />
                    )}
                    {opFeedback && choice.isCorrect && selectedOp !== choice.operation && (
                      <CheckCircle2 size={16} className="text-green-400/50" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {opFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-bold ${opFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                    {opFeedback === 'correct' ? 'Correct!' : 'Not quite — try to remember for next time'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mb-3">
                  Result: <span className="text-white">{currentEq.steps[interactiveStep].result}</span>
                </div>
                <button
                  onClick={advanceInteractive}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold hover:bg-purple-400 transition-all"
                >
                  {interactiveStep < currentEq.steps.length - 1 ? 'Next Step →' : 'Complete! →'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 z-20">
        {stepIndex < 0 && !interactiveMode && (
          <div className="text-sm text-slate-400 font-mono">Goal: Isolate x — step through the solution</div>
        )}
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center"
          >
            <span className="text-green-400 font-bold">Solved! x = {currentEq.solution}</span>
            {interactiveMode && (
              <div className="text-xs text-slate-400 mt-1">
                Score: {interactiveScore.correct}/{interactiveScore.total} operations correct
              </div>
            )}
          </motion.div>
        )}
        <div className="flex gap-3 flex-wrap justify-center">
          {!isSolved && !interactiveMode ? (
            <>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                {stepIndex < 0 ? 'Step Through' : `Step ${stepIndex + 2}`} <ArrowRight size={18} />
              </button>
              {stepIndex < 0 && (
                <button
                  onClick={startInteractiveSolve}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  <Zap size={18} /> Solve Interactively
                </button>
              )}
            </>
          ) : isSolved ? (
            <div className="flex gap-3">
              <button
                onClick={() => { resetEquation(); setInteractiveMode(false); }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-bold uppercase tracking-widest rounded-xl border border-slate-600 hover:text-white transition-colors"
              >
                <RotateCcw size={18} /> Restart
              </button>
              <button
                onClick={generateNew}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
              >
                <Shuffle size={18} /> Next Equation
              </button>
            </div>
          ) : null}
          {stepIndex >= 0 && !isSolved && !interactiveMode && (
            <button
              onClick={resetEquation}
              className="px-4 py-3 bg-slate-800/50 text-slate-500 rounded-xl border border-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>

        {/* Stats bar */}
        {solvedCount > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Equations Solved: <span className="text-yellow-400">{solvedCount}</span>
            </span>
          </div>
        )}
      </div>

      {/* Solution steps review */}
      {isSolved && !interactiveMode && (
        <div className="w-full max-w-lg bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Solution Steps</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-slate-600 w-6">{0}.</span>
              <span className="text-white">{currentEq.display}</span>
            </div>
            {currentEq.steps.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-3 text-xs text-slate-500 pl-6">
                  <ChevronRight size={12} /> {s.action}
                </div>
                <div className="flex items-center gap-3 text-sm font-mono">
                  <span className="text-slate-600 w-6">{i + 1}.</span>
                  <span className={i === currentEq.steps.length - 1 ? 'text-green-400 font-bold' : 'text-white'}>{s.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSolve = () => (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto mt-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Solve It Yourself</h3>
              <div className="flex gap-2">
                <select
                  value={eqIndex}
                  onChange={e => loadEquation(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white font-mono"
                >
                  {equations.map((eq, i) => (
                    <option key={eq.id} value={i}>{eq.display}</option>
                  ))}
                </select>
                <button
                  onClick={generateNew}
                  className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                  title="Generate random equation"
                >
                  <Shuffle size={14} />
                </button>
              </div>
            </div>

            <div className="bg-black/40 rounded-xl p-5 border border-slate-800 mb-4 text-center">
              <div className="text-3xl font-mono font-black text-white mb-2">{currentEq.display}</div>
              <div className="flex items-center gap-2 justify-center">
                <div className="text-xs text-slate-500">Find the value of x</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  currentEq.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : currentEq.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>{currentEq.difficulty}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                placeholder="x = ?"
                disabled={verifyResult !== null}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-lg focus:border-brand-accent focus:outline-none"
              />
              <button
                onClick={checkAnswer}
                disabled={verifyResult !== null || !userAnswer.trim()}
                className="px-6 py-3 bg-brand-accent text-black rounded-lg font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Check
              </button>
            </div>

            {verifyResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  verifyResult === 'correct'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {verifyResult === 'correct' ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                  <span className={`font-bold ${verifyResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                    {verifyResult === 'correct' ? 'Correct!' : `Not quite — x = ${currentEq.solution}`}
                  </span>
                </div>

                {showVerification && (() => {
                  const v = getVerificationMath();
                  return (
                    <div className="bg-black/30 rounded-lg p-3 mt-2 border border-slate-800">
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Verification</div>
                      <div className="font-mono text-sm text-slate-300 space-y-1">
                        <p>Substitute x = {currentEq.solution} into the original equation:</p>
                        <p className="text-white">{currentEq.a}({currentEq.solution}) + {currentEq.b >= 0 ? '' : '('}{currentEq.b}{currentEq.b >= 0 ? '' : ')'} = {currentEq.c}</p>
                        <p className="text-white">{v.leftVal} = {v.rightVal}</p>
                        <p className={v.matches ? 'text-green-400' : 'text-red-400'}>
                          {v.matches ? '✓ Both sides are equal — solution verified!' : '✗ Sides are not equal — check your work'}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <button
                  onClick={generateNew}
                  className="mt-3 text-sm text-brand-accent hover:text-white transition-colors"
                >
                  Try Next Equation →
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 rounded-2xl border border-orange-500/20 p-6">
            <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4">Common Mistakes Quiz</h3>
            <p className="text-slate-400 text-sm mb-4">Can you spot the right approach?</p>
            <div className="bg-black/40 rounded-xl p-4 border border-slate-800 mb-4">
              <p className="text-white text-sm">{MISTAKE_QUESTIONS[mistakeIndex].question}</p>
            </div>
            <div className="space-y-2">
              {MISTAKE_QUESTIONS[mistakeIndex].options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleMistakeAnswer(opt)}
                  disabled={mistakeFeedback !== null}
                  className={`w-full p-3 rounded-lg text-left transition-all border text-sm ${
                    mistakeAnswer === opt
                      ? mistakeFeedback === 'correct'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {mistakeAnswer === opt && mistakeFeedback && (
                      mistakeFeedback === 'correct' ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {mistakeFeedback && (
              <button onClick={nextMistake} className="mt-4 px-4 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold hover:bg-white transition-all">
                Next Question <ArrowRight size={14} className="inline" />
              </button>
            )}
            <div className="mt-3 text-xs text-slate-500">
              Score: {mistakeScore} / {MISTAKE_QUESTIONS.length}
            </div>
          </div>

          {activeMisconception && (() => {
            const mis = LINEAR_EQUATION_MISCONCEPTIONS.find(m => m.id === activeMisconception);
            if (!mis) return null;
            return (
              <MisconceptionAlert
                misconception={mis}
                onClose={() => setActiveMisconception(null)}
                onLearnMore={() => setViewMode('learn')}
                position="bottom"
              />
            );
          })()}
        </div>
      </div>
    </div>
  );

  const renderLearn = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto mt-8">
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3">The Balance Principle</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          An equation is a <strong className="text-white">balance</strong>. Whatever operation you perform on one side, you <strong className="text-white">must</strong> perform on the other. Think of it as a scale — remove weight from one side only, and it tips.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-3">Inverse Operations</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          To isolate a variable, use the <strong className="text-white">inverse</strong> (opposite) operation. Addition is undone by subtraction. Multiplication is undone by division. Always undo the operation <strong className="text-white">furthest from x</strong> first (work outward-in).
        </p>
        <div className="mt-3 space-y-1 text-sm font-mono">
          <div className="text-slate-400"><span className="text-green-400">2x + 4 = 10</span> → subtract 4 (undo addition)</div>
          <div className="text-slate-400"><span className="text-green-400">2x = 6</span> → divide by 2 (undo multiplication)</div>
          <div className="text-slate-400"><span className="text-brand-accent">x = 3</span> ✓</div>
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-3">Always Verify!</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Substitute your answer back into the <strong className="text-white">original</strong> equation. If both sides are equal, your solution is correct. This catches sign errors and arithmetic mistakes.
        </p>
        <div className="mt-3 bg-black/30 rounded-lg p-3 border border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Example: 2x + 4 = 10, x = 3</div>
          <div className="font-mono text-sm text-white">2(3) + 4 = 6 + 4 = 10 ✓</div>
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">Negative Coefficients</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          If you end up with <strong className="text-white">-x = k</strong>, remember that -x means -1x. Divide both sides by -1 to get x = -k. The variable itself is not negative — it is the <strong className="text-white">coefficient</strong> that is negative.
        </p>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">Variables on Both Sides</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          When x appears on both sides, <strong className="text-white">collect all x terms on one side</strong> and all constants on the other. Choose whichever side makes the coefficient of x positive for fewer sign errors.
        </p>
        <div className="mt-3 space-y-1 text-sm font-mono">
          <div className="text-slate-400"><span className="text-green-400">6x + 3 = 3x + 15</span></div>
          <div className="text-slate-400">-3x <span className="text-slate-600">(from both sides)</span> → <span className="text-green-400">3x + 3 = 15</span></div>
          <div className="text-slate-400">-3 <span className="text-slate-600">(from both sides)</span> → <span className="text-green-400">3x = 12</span></div>
          <div className="text-slate-400">÷3 → <span className="text-brand-accent">x = 4</span> ✓</div>
        </div>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 w-full">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Interactive Practice Tip</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Use the <strong className="text-purple-400">Solve Interactively</strong> button in Explore mode to practice choosing operations yourself. The app will give you choices — select the correct operation at each step. You can also <strong className="text-purple-400">Generate</strong> unlimited new equations at any difficulty level!
        </p>
      </div>
      <button
        onClick={() => setViewMode('solve')}
        className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
      >
        Practice Solving Equations →
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-6">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button onClick={() => setViewMode('explore')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Eye size={14} /> Explore
        </button>
        <button onClick={() => setViewMode('solve')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'solve' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Scale size={14} /> Solve
        </button>
        <button onClick={() => setViewMode('learn')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Learn
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          {viewMode === 'explore' && renderExplore()}
          {viewMode === 'solve' && renderSolve()}
          {viewMode === 'learn' && renderLearn()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
