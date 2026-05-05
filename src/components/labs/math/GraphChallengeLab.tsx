import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Target, Shuffle, CheckCircle2, XCircle, Timer, FlaskConical } from 'lucide-react';
import VirtualLabEngine from '../VirtualLabEngine';
import { GRAPH_CHALLENGE_LAB } from '../../../data/labs/labConfigs';
import { LabSession } from '../../../data/labs/labTypes';

interface GraphPoint {
  x: number;
  y: number;
}

interface Challenge {
  id: string;
  type: 'identify-gradient' | 'find-intercept' | 'match-equation' | 'plot-point' | 'area-under';
  question: string;
  equation: { m: number; c: number };
  options: string[];
  correct: string;
  hint: string;
  points: number;
}

const generateChallenges = (difficulty: number, equationType: number): Challenge[] => {
  const challenges: Challenge[] = [];

  // Gradient identification
  const gradients = difficulty >= 4 ? [2, -1, 0.5, 3, -2, 1.5, -0.5] : [2, -1, 0.5, 3, -2];
  const m1 = gradients[Math.floor(Math.random() * gradients.length)];
  const c1 = Math.floor(Math.random() * 7) - 3;
  challenges.push({
    id: 'grad-1',
    type: 'identify-gradient',
    question: `What is the gradient of y = ${m1 === 1 ? '' : m1 === -1 ? '-' : m1}x ${c1 >= 0 ? `+ ${c1}` : `- ${Math.abs(c1)}`}?`,
    equation: { m: m1, c: c1 },
    options: [`${m1}`, `${c1}`, `${m1 + 1}`, `${-m1}`].sort(() => Math.random() - 0.5),
    correct: `${m1}`,
    hint: 'The gradient is the coefficient of x in y = mx + c',
    points: 2,
  });

  // Y-intercept
  const m2 = Math.floor(Math.random() * 5) - 2;
  const c2 = Math.floor(Math.random() * 10) - 5;
  challenges.push({
    id: 'intercept-1',
    type: 'find-intercept',
    question: `Where does y = ${m2}x ${c2 >= 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`} cross the y-axis?`,
    equation: { m: m2, c: c2 },
    options: [`(0, ${c2})`, `(${c2}, 0)`, `(0, ${m2})`, `(${m2}, ${c2})`].sort(() => Math.random() - 0.5),
    correct: `(0, ${c2})`,
    hint: 'The y-intercept occurs when x = 0, so y = c',
    points: 2,
  });

  // Match equation to description
  const m3 = [1, 2, -1, 3][Math.floor(Math.random() * 4)];
  const c3 = [0, 2, -3, 5][Math.floor(Math.random() * 4)];
  challenges.push({
    id: 'match-1',
    type: 'match-equation',
    question: `Which line passes through (0, ${c3}) with gradient ${m3}?`,
    equation: { m: m3, c: c3 },
    options: [
      `y = ${m3}x ${c3 >= 0 ? `+ ${c3}` : `- ${Math.abs(c3)}`}`,
      `y = ${c3}x ${m3 >= 0 ? `+ ${m3}` : `- ${Math.abs(m3)}`}`,
      `y = ${m3 + 1}x ${c3 >= 0 ? `+ ${c3}` : `- ${Math.abs(c3)}`}`,
      `y = ${m3}x ${c3 + 2 >= 0 ? `+ ${c3 + 2}` : `- ${Math.abs(c3 + 2)}`}`,
    ].sort(() => Math.random() - 0.5),
    correct: `y = ${m3}x ${c3 >= 0 ? `+ ${c3}` : `- ${Math.abs(c3)}`}`,
    hint: 'Use y = mx + c where m is the gradient and c is the y-intercept',
    points: 3,
  });

  // Find where line crosses x-axis
  const m4 = [1, 2, -1, 3, 4][Math.floor(Math.random() * 5)];
  const c4 = m4 * Math.floor(Math.random() * 5 + 1) * (Math.random() > 0.5 ? 1 : -1);
  const xIntercept = -c4 / m4;
  challenges.push({
    id: 'xint-1',
    type: 'plot-point',
    question: `Where does y = ${m4}x ${c4 >= 0 ? `+ ${c4}` : `- ${Math.abs(c4)}`} cross the x-axis?`,
    equation: { m: m4, c: c4 },
    options: [
      `(${xIntercept}, 0)`,
      `(0, ${c4})`,
      `(${-xIntercept}, 0)`,
      `(${xIntercept + 1}, 0)`,
    ].sort(() => Math.random() - 0.5),
    correct: `(${xIntercept}, 0)`,
    hint: 'Set y = 0 and solve for x: 0 = mx + c → x = -c/m',
    points: 3,
  });

  // Parallel lines
  const m5 = [2, 3, -1, 4][Math.floor(Math.random() * 4)];
  challenges.push({
    id: 'parallel-1',
    type: 'match-equation',
    question: `Which line is parallel to y = ${m5}x + 1?`,
    equation: { m: m5, c: 1 },
    options: [
      `y = ${m5}x + 5`,
      `y = ${m5 + 1}x + 1`,
      `y = ${-m5}x + 3`,
      `y = ${m5 * 2}x - 2`,
    ].sort(() => Math.random() - 0.5),
    correct: `y = ${m5}x + 5`,
    hint: 'Parallel lines have the same gradient (m) but different y-intercepts',
    points: 4,
  });

  return challenges;
};

// ─── Simulation sub-component ──────────────────────────────────────────────

interface GraphChallengeSimProps {
  variables: Record<string, number>;
  isRunning: boolean;
  onRecordData: (result: number | Record<string, number | string>) => void;
}

function GraphChallengeSimulation({ variables, isRunning, onRecordData }: GraphChallengeSimProps) {
  const difficulty = variables['difficulty'] ?? 3;
  const equationType = variables['equation-type'] ?? 0;

  const [challenges, setChallenges] = useState<Challenge[]>(() => generateChallenges(difficulty, equationType));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'complete'>('playing');

  const challenge = challenges[currentIdx];

  const handleAnswer = (answer: string) => {
    if (feedback) return;
    setSelectedAnswer(answer);
    setTotalAnswered(prev => prev + 1);

    if (answer === challenge.correct) {
      setFeedback('correct');
      const bonus = showHint ? 0 : 1;
      const earned = challenge.points + bonus;
      setScore(prev => prev + earned);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      onRecordData({
        score: earned,
        streak: streak + 1,
        bestStreak: Math.max(bestStreak, streak + 1),
        correct: 1,
        questionType: challenge.type,
      });
    } else {
      setFeedback('wrong');
      setStreak(0);
      onRecordData({
        score: 0,
        streak: 0,
        bestStreak,
        correct: 0,
        questionType: challenge.type,
      });
    }
  };

  const nextChallenge = () => {
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setShowHint(false);
    } else {
      setPhase('complete');
    }
  };

  const restart = () => {
    setChallenges(generateChallenges(difficulty, equationType));
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setScore(0);
    setTotalAnswered(0);
    setShowHint(false);
    setStreak(0);
    setPhase('playing');
  };

  // Mini graph renderer
  const renderGraph = (m: number, c: number) => {
    const W = 200, H = 200;
    const center = W / 2;
    const scale = 15;

    const x1 = -7, y1_val = m * x1 + c;
    const x2 = 7, y2_val = m * x2 + c;
    const sx1 = center + x1 * scale, sy1 = center - y1_val * scale;
    const sx2 = center + x2 * scale, sy2 = center - y2_val * scale;

    return (
      <svg width={W} height={H} className="bg-black/30 rounded-xl border border-slate-800">
        <defs>
          <pattern id="miniGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
            <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#miniGrid)" />
        <line x1="0" y1={center} x2={W} y2={center} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1={center} y1="0" x2={center} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#22d3ee" strokeWidth="2.5" />
        <circle cx={center} cy={center - c * scale} r="4" fill="#ec4899" />
        <text x={W - 10} y={center - 5} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">x</text>
        <text x={center + 5} y={12} fill="rgba(255,255,255,0.3)" fontSize="9">y</text>
      </svg>
    );
  };

  if (phase === 'complete') {
    const pct = Math.round((score / (challenges.reduce((s, c) => s + c.points + 1, 0))) * 100);
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📊'}</div>
          <h2 className="text-3xl font-light text-white mb-2">Challenge <span className="text-brand-accent font-medium">Complete!</span></h2>
          <div className="text-5xl font-mono text-brand-accent font-bold mb-2">{score} pts</div>
          <div className="text-slate-400 text-sm">Best Streak: {bestStreak} | Accuracy: {totalAnswered > 0 ? Math.round((score / (totalAnswered * 3)) * 100) : 0}%</div>
        </motion.div>
        <button onClick={restart}
          className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all"
        ><Shuffle size={18} /> New Challenge Set</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-2xl font-light text-white">Graph <span className="text-brand-accent font-medium">Challenge Lab</span></h2>
          <p className="text-slate-500 text-xs mt-1">Master linear equations through gamified challenges</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold text-sm">{score} pts</span>
          </div>
          {streak >= 2 && (
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-orange-400 text-xs font-bold">🔥 {streak} streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg flex gap-1">
        {challenges.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${
            i < currentIdx ? 'bg-brand-accent' : i === currentIdx ? 'bg-brand-accent/50' : 'bg-slate-800'
          }`} />
        ))}
      </div>

      <div className="w-full max-w-lg flex flex-col md:flex-row gap-6 items-start">
        {/* Graph */}
        {showGraph && (
          <div className="flex-shrink-0">
            {renderGraph(challenge.equation.m, challenge.equation.c)}
          </div>
        )}

        {/* Question */}
        <div className="flex-1 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-brand-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                Question {currentIdx + 1} of {challenges.length}
              </span>
              <span className="text-[10px] font-mono text-yellow-400">{challenge.points} pts</span>
            </div>

            <p className="text-white text-sm font-medium mb-4">{challenge.question}</p>

            <div className="space-y-2">
              {challenge.options.map((opt, i) => (
                <button key={`${opt}-${i}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className={`w-full p-3 rounded-xl text-left transition-all border text-sm font-mono ${
                    selectedAnswer === opt
                    ? feedback === 'correct'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : feedback && opt === challenge.correct
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-brand-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selectedAnswer === opt && feedback && (
                      feedback === 'correct' ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!feedback && !showHint && (
              <button onClick={() => setShowHint(true)}
                className="mt-3 text-xs text-slate-500 hover:text-yellow-400 transition-colors"
              >💡 Show Hint (no bonus point)</button>
            )}

            {showHint && !feedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-xs"
              >{challenge.hint}</motion.div>
            )}

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className={`text-sm font-bold mb-3 ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback === 'correct'
                    ? `✓ Correct! +${challenge.points + (showHint ? 0 : 1)} pts`
                    : `✗ The answer was: ${challenge.correct}`}
                </div>
                <button onClick={nextChallenge}
                  className="px-6 py-2 bg-brand-accent text-black rounded-lg text-sm font-bold hover:bg-white transition-all"
                >{currentIdx < challenges.length - 1 ? 'Next Challenge →' : 'See Results →'}</button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lab wrapper ────────────────────────────────────────────────────────────

export default function GraphChallengeLab() {
  const [completedSession, setCompletedSession] = useState<LabSession | null>(null);

  const renderSimulation = (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => <GraphChallengeSimulation {...props} />;

  const handleComplete = (session: LabSession) => setCompletedSession(session);

  if (completedSession) {
    const trials = completedSession.trials ?? [];
    const totalCorrect = trials.flatMap(t => t.observations).filter(o =>
      typeof o.result === 'object' && (o.result as Record<string, unknown>).correct === 1
    ).length;
    const totalQuestions = trials.flatMap(t => t.observations).length;
    const totalScore = trials.flatMap(t => t.observations).reduce((sum, o) => {
      if (typeof o.result === 'object') return sum + Number((o.result as Record<string, unknown>).score ?? 0);
      return sum;
    }, 0);
    const maxStreak = trials.flatMap(t => t.observations).reduce((max, o) => {
      if (typeof o.result === 'object') return Math.max(max, Number((o.result as Record<string, unknown>).bestStreak ?? 0));
      return max;
    }, 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
      >
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
          <FlaskConical size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lab Complete!</h2>
        <p className="text-slate-400 mb-2 max-w-md">
          You completed {trials.length} trial{trials.length !== 1 ? 's' : ''} with {totalQuestions} questions answered.
        </p>
        <div className="flex gap-6 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Score</div>
            <div className="text-2xl font-mono font-bold text-yellow-400">{totalScore}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
            <div className="text-2xl font-mono font-bold text-brand-accent">
              {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Best Streak</div>
            <div className="text-2xl font-mono font-bold text-orange-400">{maxStreak}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCompletedSession(null)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Back to Lesson
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <VirtualLabEngine
      config={GRAPH_CHALLENGE_LAB}
      renderSimulation={renderSimulation}
      onComplete={handleComplete}
    />
  );
}
