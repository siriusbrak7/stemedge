import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import QuizMode, { QuizQuestion } from '../../shared/QuizMode';
import ModuleTabs from '../shared/ModuleTabs';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

type ViewMode = 'challenge' | 'junction' | 'energy' | 'quiz';

const TABS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'challenge', label: 'Challenge', icon: '⚡' },
  { id: 'junction', label: 'NMJ', icon: '🔌' },
  { id: 'energy', label: 'Energy', icon: '📊' },
  { id: 'quiz', label: 'Quiz', icon: '🧠' },
];

const QUIZ: QuizQuestion[] = [
  { id: 'mc1', question: 'Which ion exposes binding sites on actin?', type: 'multiple-choice', options: ['Na+', 'K+', 'Ca2+', 'Cl-'], correctAnswer: 'Ca2+', explanation: 'Ca2+ binds to troponin, shifting tropomyosin away from the myosin-binding sites on actin.' },
  { id: 'mc2', question: 'Energy for the power stroke comes from:', type: 'multiple-choice', options: ['Glucose', 'ATP', 'GTP', 'NADH'], correctAnswer: 'ATP', explanation: 'ATP hydrolysis cocks the myosin head. ADP release triggers the power stroke.' },
  { id: 'mc3', question: 'During contraction, which bands shorten?', type: 'multiple-choice', options: ['A-band only', 'I-band and H-zone', 'Z-lines only', 'All bands'], correctAnswer: 'I-band and H-zone', explanation: 'The A-band stays constant (myosin length unchanged). The I-band and H-zone shrink as filaments overlap more.' },
];

interface ChallengeStep {
  id: string;
  instruction: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  availableActions: string[];
  requiredAction: string;
}

const CROSS_BRIDGE_CHALLENGES: ChallengeStep[] = [
  {
    id: 'step1',
    instruction: 'The muscle is relaxed. What needs to happen FIRST to expose the myosin binding sites?',
    question: 'Which ion must be released into the sarcoplasm?',
    options: ['Sodium (Na+)', 'Calcium (Ca2+)', 'Potassium (K+)', 'Chloride (Cl-)'],
    correctIndex: 1,
    explanation: 'Calcium ions (Ca2+) are released from the sarcoplasmic reticulum. They bind to troponin, causing tropomyosin to shift and expose the myosin-binding sites on actin.',
    availableActions: ['Add Ca²⁺'],
    requiredAction: 'Add Ca²⁺',
  },
  {
    id: 'step2',
    instruction: 'Calcium has exposed the binding sites. Now what must happen for the myosin head to attach?',
    question: 'What molecule must be bound to the myosin head BEFORE it can attach to actin?',
    options: ['Glucose', 'ADP + Pi', 'ATP (fresh)', 'Nothing - it attaches directly'],
    correctIndex: 1,
    explanation: 'The myosin head must be "cocked" with ADP and inorganic phosphate (Pi) already bound. This high-energy state comes from the previous ATP hydrolysis. When the head attaches to actin, it forms a cross-bridge.',
    availableActions: ['Attach Myosin'],
    requiredAction: 'Attach Myosin',
  },
  {
    id: 'step3',
    instruction: 'The cross-bridge is formed. What triggers the POWER STROKE?',
    question: 'What event causes the myosin head to pivot and pull the actin filament?',
    options: ['ATP binding to myosin', 'ADP release from myosin', 'Calcium entering the cell', 'Troponin changing shape'],
    correctIndex: 1,
    explanation: 'ADP release triggers the power stroke. The myosin head pivots, pulling the actin filament toward the M-line. This is the force-generating step that shortens the sarcomere.',
    availableActions: ['Release ADP'],
    requiredAction: 'Release ADP',
  },
  {
    id: 'step4',
    instruction: 'The power stroke is complete. The myosin head is now in a low-energy state. How does it detach?',
    question: 'What molecule must bind to the myosin head to break the cross-bridge?',
    options: ['ADP', 'Calcium', 'A new ATP molecule', 'Tropomyosin'],
    correctIndex: 2,
    explanation: 'A fresh ATP molecule binds to the myosin head, causing it to detach from actin. The ATP is then hydrolyzed to ADP + Pi, re-cocking the head for the next cycle. This is why ATP is needed for both contraction AND relaxation.',
    availableActions: ['Bind New ATP'],
    requiredAction: 'Bind New ATP',
  },
  {
    id: 'step5',
    instruction: 'Voilà! You have completed one full cross-bridge cycle. The myosin head is re-cocked and ready for another power stroke.',
    question: 'Which of these correctly describes the sequence of a cross-bridge cycle?',
    options: [
      'Power stroke → attach → detach → re-cock',
      'Attach → power stroke → detach → re-cock',
      'Re-cock → detach → attach → power stroke',
      'Detach → re-cock → power stroke → attach'
    ],
    correctIndex: 1,
    explanation: 'The correct sequence is: ① Myosin head (cocked with ADP+Pi) attaches to actin, ② ADP is released causing the power stroke, ③ Fresh ATP binds causing detachment, ④ ATP hydrolysis re-cocks the head. This cycle repeats as long as Ca2+ is present and ATP is available.',
    availableActions: [],
    requiredAction: '',
  },
];

export default function MuscleContraction() {
  const [viewMode, setViewMode] = useState<ViewMode>('challenge');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const challenge = CROSS_BRIDGE_CHALLENGES[currentStep];
  const isLastStep = currentStep === CROSS_BRIDGE_CHALLENGES.length - 1;

  const [contracted, setContracted] = useState(false);
  const [showCalcium, setShowCalcium] = useState(false);
  const [myosinAttached, setMyosinAttached] = useState(false);
  const [powerStrokeDone, setPowerStrokeDone] = useState(false);

  const offset = contracted ? 28 : 0;
  const springOffset = useSpring(offset, { stiffness: 200, damping: 22 });

  useEffect(() => {
    springOffset.set(offset);
  }, [offset, springOffset]);

  const handleAction = (action: string) => {
    if (completedActions.includes(action)) return;

    if (action === 'Add Ca²⁺') {
      setShowCalcium(true);
      setCompletedActions(prev => [...prev, action]);
    } else if (action === 'Attach Myosin') {
      if (!showCalcium) return;
      setMyosinAttached(true);
      setCompletedActions(prev => [...prev, action]);
    } else if (action === 'Release ADP') {
      if (!myosinAttached) return;
      setPowerStrokeDone(true);
      setContracted(true);
      setCompletedActions(prev => [...prev, action]);
    } else if (action === 'Bind New ATP') {
      if (!powerStrokeDone) return;
      setContracted(false);
      setMyosinAttached(false);
      setPowerStrokeDone(false);
      setCompletedActions(prev => [...prev, action]);
    }
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === challenge.correctIndex) {
      setScore(s => s + 3);
    }
  };

  const advanceStep = () => {
    if (isLastStep) {
      setChallengeComplete(true);
      setScore(s => s + 5);
      return;
    }
    setCurrentStep(s => s + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCompletedActions([]);
    setShowCalcium(false);
    setMyosinAttached(false);
    setPowerStrokeDone(false);
    setContracted(false);
  };

  const resetChallenge = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCompletedActions([]);
    setShowCalcium(false);
    setMyosinAttached(false);
    setPowerStrokeDone(false);
    setContracted(false);
    setScore(0);
    setChallengeComplete(false);
  };

  return (
    <div className="flex flex-col items-start w-full min-h-[600px] p-6 relative bg-[#06090f] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between w-full mb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">💪 Muscle Contraction</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sliding Filament Theory — Build the Cross-Bridge Cycle</p>
        </div>
        <div className="flex items-center gap-4">
          {!challengeComplete && (
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <span className="text-yellow-400 font-mono text-xs font-bold">{score} pts</span>
            </div>
          )}
          <ModuleTabs tabs={TABS} active={viewMode} onChange={setViewMode} accentColor="pink" />
        </div>
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            {viewMode === 'challenge' && (
              <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-start">
                <div className="flex-1 flex flex-col items-center gap-5">
                  <svg viewBox="0 0 500 310" className="w-full max-w-[500px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                    <rect width="500" height="310" fill="#06090f" rx="18" />

                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f1825" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="500" height="310" fill="url(#grid)" rx="18" />

                    {contracted && (
                      <motion.ellipse
                        cx={250} cy={150}
                        rx={180} ry={70}
                        fill="rgba(244,114,182,0.06)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5] }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.line
                      x1={80} y1="55" x2={80} y2="250" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round"
                      animate={{ x1: 80 + offset, x2: 80 + offset }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    />
                    <motion.line
                      x1={420} y1="55" x2={420} y2="250" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round"
                      animate={{ x1: 420 - offset, x2: 420 - offset }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    />

                    <motion.text x={80 + offset} y="48" fill="#a855f7" fontSize="8.5" textAnchor="middle" fontWeight="bold"
                      animate={{ x: 80 + offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                      Z-line
                    </motion.text>
                    <motion.text x={420 - offset} y="48" fill="#a855f7" fontSize="8.5" textAnchor="middle" fontWeight="bold"
                      animate={{ x: 420 - offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                      Z-line
                    </motion.text>

                    <motion.g animate={{ x: offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                      {[0,1,2,3,4,5,6,7,8,9].map(i => (
                        <g key={`at${i}`}>
                          <circle cx={86 + i * 17} cy={108} r="7.5" fill="#3b82f6" opacity={0.75} />
                          {i > 0 && (
                            <line x1={86 + (i-1)*17 + 7} y1="108" x2={86 + i*17 - 7} y2="108"
                              stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                          )}
                        </g>
                      ))}
                    </motion.g>

                    <motion.g animate={{ x: -offset }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                      {[0,1,2,3,4,5,6,7,8,9].map(i => (
                        <g key={`ab${i}`}>
                          <circle cx={414 - i * 17} cy={192} r="7.5" fill="#3b82f6" opacity={0.75} />
                          {i > 0 && (
                            <line x1={414 - (i-1)*17 - 7} y1="192" x2={414 - i*17 + 7} y2="192"
                              stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                          )}
                        </g>
                      ))}
                    </motion.g>

                    <rect x="148" y="126" width="204" height="48" fill="#7f1d1d" opacity="0.5" rx="8" />
                    <rect x="148" y="126" width="204" height="48" fill="none" stroke="#ef4444" strokeWidth="1.5" rx="8" />
                    <text x="250" y="154" fill="#fca5a5" fontSize="9" textAnchor="middle" fontWeight="bold">Myosin (thick)</text>

                    {[172, 210, 250, 290, 328].map((cx, i) => {
                      const shouldAttach = myosinAttached;
                      const shouldPivot = powerStrokeDone;
                      const rotation = shouldPivot ? -48 : shouldAttach ? -20 : 0;
                      return (
                        <motion.g key={`mh-top-${i}`}
                          animate={{ rotate: rotation }}
                          style={{ transformOrigin: `${cx}px 126px` }}
                          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.03 }}
                        >
                          <line x1={cx} y1={126} x2={cx} y2={108} stroke="#f87171" strokeWidth="2.5" />
                          <circle cx={cx} cy={105} r="5.5" fill="#ef4444" />
                          <circle cx={cx} cy={105} r="2.5" fill={myosinAttached ? '#22c55e' : '#fca5a5'} opacity={myosinAttached ? 1 : 0.4} />
                        </motion.g>
                      );
                    })}

                    {[172, 210, 250, 290, 328].map((cx, i) => {
                      const shouldAttach = myosinAttached;
                      const shouldPivot = powerStrokeDone;
                      const rotation = shouldPivot ? 48 : shouldAttach ? 20 : 0;
                      return (
                        <motion.g key={`mh-bot-${i}`}
                          animate={{ rotate: rotation }}
                          style={{ transformOrigin: `${cx}px 174px` }}
                          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.03 }}
                        >
                          <line x1={cx} y1={174} x2={cx} y2={192} stroke="#f87171" strokeWidth="2.5" />
                          <circle cx={cx} cy={195} r="5.5" fill="#ef4444" />
                          <circle cx={cx} cy={195} r="2.5" fill={myosinAttached ? '#22c55e' : '#fca5a5'} opacity={myosinAttached ? 1 : 0.4} />
                        </motion.g>
                      );
                    })}

                    <AnimatePresence>
                      {showCalcium && [115, 185, 250, 315, 385].map((cx, i) => (
                        <motion.text key={cx} x={cx} y={75} fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold"
                          initial={{ opacity: 0, y: 82 }}
                          animate={{ opacity: [0, 1, 1, 0], y: [82, 70, 62, 50] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
                        >
                          Ca²⁺
                        </motion.text>
                      ))}
                    </AnimatePresence>

                    {completedActions.includes('Bind New ATP') && powerStrokeDone && Array.from({ length: 8 }).map((_, i) => (
                      <motion.text
                        key={`atp-${i}`}
                        x={140 + i * 30}
                        y={280}
                        fill="#facc15"
                        fontSize="9"
                        fontWeight="bold"
                        initial={{ opacity: 0, y: 280 }}
                        animate={{ opacity: [0, 1, 0], y: [280, 240, 220] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        ATP
                      </motion.text>
                    ))}

                    <motion.line
                      x1={80 + offset} y1="260" x2="148" y2="260" stroke="#3b82f6" strokeWidth="1.5"
                      animate={{ x1: 80 + offset }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    />
                    <motion.text
                      x={(80 + offset + 148) / 2} y="273" fill="#60a5fa" fontSize="8" textAnchor="middle"
                      animate={{ x: (80 + offset + 148) / 2 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    >
                      I-band
                    </motion.text>

                    <line x1="148" y1="260" x2="352" y2="260" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="250" y="273" fill="#ef4444" fontSize="8" textAnchor="middle">A-band</text>

                    <motion.line
                      x1="352" y1="260" x2={420 - offset} y2="260" stroke="#3b82f6" strokeWidth="1.5"
                      animate={{ x2: 420 - offset }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    />

                    <motion.line
                      x1={contracted ? 238 : 222} y1="285" x2={contracted ? 262 : 278} y2="285"
                      stroke="#eab308" strokeWidth="2"
                      animate={{ x1: contracted ? 238 : 222, x2: contracted ? 262 : 278 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                    />
                    <text x="250" y="298" fill="#eab308" fontSize="7.5" textAnchor="middle">H-zone</text>
                  </svg>
                </div>

                <div className="lg:w-[340px] space-y-4">
                  {challengeComplete ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center"
                    >
                      <div className="text-4xl mb-3">🏆</div>
                      <h3 className="text-lg font-bold text-green-400 mb-2">Cross-Bridge Cycle Complete!</h3>
                      <p className="text-slate-300 text-sm mb-2">You scored {score} points</p>
                      <p className="text-slate-400 text-xs mb-4">You now understand how calcium, ATP, and the cross-bridge cycle work together to produce muscle contraction.</p>
                      <button
                        onClick={resetChallenge}
                        className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw size={14} /> Try Again
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                        <div className="text-brand-accent font-bold text-sm uppercase tracking-widest mb-3">
                          Step {currentStep + 1} of {CROSS_BRIDGE_CHALLENGES.length}
                        </div>
                        <p className="text-white text-sm mb-4">{challenge.instruction}</p>

                        {challenge.availableActions.length > 0 && (
                          <div className="mb-4">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Available Actions</div>
                            <div className="flex flex-wrap gap-2">
                              {challenge.availableActions.map(action => {
                                const isDone = completedActions.includes(action);
                                const isAvailable = action === 'Add Ca²⁺' || 
                                  (action === 'Attach Myosin' && completedActions.includes('Add Ca²⁺')) ||
                                  (action === 'Release ADP' && completedActions.includes('Attach Myosin')) ||
                                  (action === 'Bind New ATP' && completedActions.includes('Release ADP'));
                                
                                let buttonStyle = 'bg-slate-800 border-slate-700 text-slate-500';
                                if (isDone) buttonStyle = 'bg-green-500/20 border-green-500 text-green-400';
                                else if (isAvailable) buttonStyle = 'bg-brand-accent/20 border-brand-accent/50 text-brand-accent hover:bg-brand-accent/30 cursor-pointer';
                                
                                return (
                                  <button
                                    key={action}
                                    onClick={() => isAvailable && !isDone && handleAction(action)}
                                    disabled={!isAvailable || isDone}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${buttonStyle}`}
                                  >
                                    {isDone && <CheckCircle2 size={12} className="inline mr-1" />}
                                    {action}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-900/80 border border-orange-500/20 rounded-2xl p-5">
                        <h3 className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-3">🤔 {challenge.question}</h3>
                        <div className="space-y-2">
                          {challenge.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(idx)}
                              disabled={showExplanation}
                              className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${
                                selectedAnswer === idx
                                  ? idx === challenge.correctIndex
                                    ? 'bg-green-500/20 border-green-500 text-green-400'
                                    : 'bg-red-500/20 border-red-500 text-red-400'
                                  : showExplanation && idx === challenge.correctIndex
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-orange-500/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{opt}</span>
                                {selectedAnswer === idx && (
                                  idx === challenge.correctIndex
                                    ? <CheckCircle2 size={16} className="text-green-400" />
                                    : <XCircle size={16} className="text-red-400" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
                          >
                            <p className="text-cyan-300 text-xs leading-relaxed">{challenge.explanation}</p>
                            <button
                              onClick={advanceStep}
                              className="mt-3 px-4 py-2 bg-brand-accent text-black rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2"
                            >
                              {isLastStep ? 'Complete Challenge' : 'Next Step'} <ArrowRight size={14} />
                            </button>
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Colour Legend</div>
                        <div className="space-y-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /><span>Z-lines</span></div>
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /><span>Actin (thin)</span></div>
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /><span>Myosin (thick)</span></div>
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /><span>Myosin binding site (active)</span></div>
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" /><span>H-zone</span></div>
                          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#facc15]" /><span>ATP</span></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'junction' && <NeuromuscularJunction />}
            {viewMode === 'energy' && <EnergyFatigue />}
            {viewMode === 'quiz' && (
              <div className="max-w-xl mx-auto">
                <QuizMode questions={QUIZ} title="Muscle Contraction Quiz" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NeuromuscularJunction() {
  const [stimulus, setStimulus] = useState(65);
  const vesicles = Math.max(3, Math.round(stimulus / 12));
  const caRelease = Math.round(stimulus * 0.9);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.25fr,0.75fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 overflow-hidden">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-3">Motor End Plate Cascade</div>
        <svg viewBox="0 0 560 360" className="w-full rounded-2xl bg-[#07101a]">
          <defs>
            <linearGradient id="axonGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path d="M 25 90 C 160 45 280 55 380 92 C 455 120 505 111 540 90" fill="none" stroke="url(#axonGrad)" strokeWidth="44" strokeLinecap="round" />
          <path d="M 38 91 C 172 51 286 63 380 96 C 455 121 502 112 528 93" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="280" y="46" fill="#7dd3fc" fontSize="13" textAnchor="middle" fontWeight="bold">Motor neuron terminal</text>

          {Array.from({ length: vesicles }).map((_, i) => (
            <g key={`vesicle-${i}`}>
              <circle cx={175 + (i % 5) * 38} cy={84 + Math.floor(i / 5) * 28} r="12" fill="#f59e0b" opacity="0.25" stroke="#fbbf24" />
              <text x={175 + (i % 5) * 38} y={88 + Math.floor(i / 5) * 28} fill="#fde68a" fontSize="8" textAnchor="middle">ACh</text>
            </g>
          ))}

          <path d="M 55 91 C 150 64 260 70 360 96" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="12 22" />
          <text x="82" y="63" fill="#facc15" fontSize="10" fontWeight="bold">Action potential</text>

          <rect x="35" y="255" width="490" height="58" rx="28" fill="#451a1a" opacity="0.55" stroke="#f87171" />
          <text x="280" y="333" fill="#fca5a5" fontSize="12" textAnchor="middle" fontWeight="bold">Muscle fibre membrane</text>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={`rec-${i}`} x={95 + i * 45} y="239" width="22" height="35" rx="8" fill={stimulus > 35 ? '#22c55e' : '#1e293b'} stroke="#22c55e" opacity={stimulus > 35 ? 0.9 : 0.5} />
          ))}

          {Array.from({ length: vesicles * 3 }).map((_, i) => (
            <circle key={`ach-${i}`} cx={145 + (i % 12) * 26} cy="132" r="4" fill="#facc15" />
          ))}

          <text x="292" y="212" fill="#86efac" fontSize="11" textAnchor="middle">End-plate potential opens channels</text>

          <g transform="translate(380 145)">
            <rect x="0" y="0" width="125" height="52" rx="16" fill="#172554" stroke="#60a5fa" />
            <text x="62" y="21" fill="#bfdbfe" fontSize="10" textAnchor="middle" fontWeight="bold">SR Ca2+ Release</text>
            <text x="62" y="39" fill="#60a5fa" fontSize="16" textAnchor="middle" fontWeight="bold">{caRelease}%</text>
          </g>
        </svg>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>Nerve impulse strength</span>
            <span className="font-mono text-white">{stimulus}%</span>
          </div>
          <input type="range" min={0} max={100} value={stimulus} onChange={e => setStimulus(Number(e.target.value))} className="w-full accent-pink-400" />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-black/30 p-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">ACh vesicles</p>
              <p className="text-xl font-mono font-bold text-yellow-300">{vesicles}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black/30 p-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Ca2+ release</p>
              <p className="text-xl font-mono font-bold text-cyan-300">{caRelease}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-pink-300 font-bold text-sm uppercase tracking-widest mb-3">Inquiry Focus</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Increase the impulse and watch the chain: action potential reaches the terminal, calcium enters the neuron, acetylcholine diffuses across the cleft, receptors open, and the muscle fibre releases Ca2+ for contraction.
          </p>
        </div>
      </div>
    </div>
  );
}

function EnergyFatigue() {
  const [intensity, setIntensity] = useState(55);
  const atp = Math.max(8, 100 - intensity * 0.72);
  const creatine = Math.max(5, 95 - intensity * 0.95);
  const glycolysis = Math.min(100, 20 + intensity * 0.9);
  const lactate = Math.max(0, (intensity - 35) * 1.45);
  const fatigue = Math.min(100, lactate * 0.65 + (100 - atp) * 0.28);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Metabolic Systems During Exercise</div>
        <svg viewBox="0 0 520 330" className="w-full rounded-2xl bg-[#08111b]">
          <line x1="62" y1="270" x2="485" y2="270" stroke="#334155" />
          <line x1="62" y1="45" x2="62" y2="270" stroke="#334155" />
          <text x="270" y="306" fill="#64748b" fontSize="11" textAnchor="middle">Exercise intensity</text>
          <text x="24" y="156" fill="#64748b" fontSize="11" transform="rotate(-90 24 156)" textAnchor="middle">Relative contribution</text>
          {[
            { label: 'ATP stores', value: atp, color: '#facc15', x: 95 },
            { label: 'Creatine phosphate', value: creatine, color: '#38bdf8', x: 190 },
            { label: 'Anaerobic glycolysis', value: glycolysis, color: '#fb7185', x: 310 },
            { label: 'Lactic acid', value: lactate, color: '#f97316', x: 420 },
          ].map((bar) => (
            <g key={bar.label}>
              <motion.rect x={bar.x} y={270 - bar.value * 2.05} width="54" height={bar.value * 2.05} rx="8" fill={bar.color} opacity="0.78"
                animate={{ y: 270 - bar.value * 2.05, height: bar.value * 2.05 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
              <text x={bar.x + 27} y="288" fill="#94a3b8" fontSize="8" textAnchor="middle">{bar.label}</text>
              <text x={bar.x + 27} y={258 - bar.value * 2.05} fill={bar.color} fontSize="12" textAnchor="middle" fontWeight="bold">{Math.round(bar.value)}%</text>
            </g>
          ))}
          <motion.path d={`M 65 ${270 - fatigue * 1.7} C 165 ${255 - fatigue} 270 ${245 - fatigue * 1.15} 485 ${270 - fatigue * 1.7}`} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <text x="438" y={252 - fatigue * 1.7} fill="#fca5a5" fontSize="10" fontWeight="bold">fatigue pressure</text>
        </svg>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 space-y-5">
          <div className="mb-2 flex justify-between text-xs text-slate-400">
            <span>Exercise intensity</span>
            <span className="font-mono text-white">{intensity}%</span>
          </div>
          <input type="range" min={0} max={100} value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-orange-400" />
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" animate={{ width: `${fatigue}%` }} />
          </div>
          <p className="text-xs text-slate-500">Fatigue index: <span className="text-red-300 font-bold">{Math.round(fatigue)}%</span></p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-orange-300 font-bold text-sm uppercase tracking-widest mb-3">What Changes?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Low intensity can rely on stored ATP and aerobic recovery. As intensity rises, phosphocreatine is consumed quickly, glycolysis takes over, and lactate accumulation reduces pH, slowing cross-bridge cycling.
          </p>
        </div>
      </div>
    </div>
  );
}