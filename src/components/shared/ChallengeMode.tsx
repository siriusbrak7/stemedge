import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, Zap, RotateCcw, ChevronRight } from 'lucide-react';

interface Challenge {
  id: string;
  prompt: string;
  type: 'action' | 'quiz' | 'simulation';
  target: string;
  timeLimit?: number;
  points: number;
  hint?: string;
}

interface ChallengeModeProps {
  challenges: Challenge[];
  title: string;
  onComplete: (score: number, results: { id: string; completed: boolean; time: number }[]) => void;
  onStart?: () => void;
}

export default function ChallengeMode({
  challenges,
  title,
  onComplete,
  onStart,
}: ChallengeModeProps) {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [results, setResults] = useState<{ id: string; completed: boolean; time: number }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentChallenge = challenges[currentIdx];
  const totalTime = challenges.reduce((acc, c) => acc + (c.timeLimit || 30), 0);

  useEffect(() => {
    if (!started || timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && currentChallenge) {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleStart = () => {
    setStarted(true);
    setTimeLeft(currentChallenge?.timeLimit || 30);
    onStart?.();
  };

  const handleTimeout = () => {
    setResults(prev => [...prev, { id: currentChallenge.id, completed: false, time: 0 }]);
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(challenges[currentIdx + 1]?.timeLimit || 30);
      setShowHint(false);
    } else {
      finishChallenge();
    }
  };

  const handleComplete = useCallback(() => {
    const timeUsed = (currentChallenge.timeLimit || 30) - (timeLeft || 0);
    const timeBonus = Math.max(0, Math.floor((timeLeft || 0) / 5));
    const points = currentChallenge.points + timeBonus;

    setScore(prev => prev + points);
    setResults(prev => [...prev, { id: currentChallenge.id, completed: true, time: timeUsed }]);

    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(challenges[currentIdx + 1]?.timeLimit || 30);
      setShowHint(false);
    } else {
      finishChallenge();
    }
  }, [currentChallenge, currentIdx, timeLeft, challenges]);

  const finishChallenge = () => {
    setCompleted(true);
    onComplete(score, results);
  };

  const handleRetry = () => {
    setStarted(false);
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(null);
    setResults([]);
    setShowHint(false);
    setCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mb-6">
          <Zap size={40} className="text-brand-accent" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">
          {challenges.length} challenges • {formatTime(totalTime)} total time
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="text-2xl font-bold text-white">{challenges.length}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Challenges</div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="text-2xl font-bold text-brand-accent">{totalTime}s</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Time Limit</div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-brand-accent/20"
        >
          <Zap size={20} />
          Start Challenge
        </button>
      </motion.div>
    );
  }

  if (completed) {
    const passed = score >= challenges.reduce((acc, c) => acc + c.points, 0) * 0.7;
    const completedCount = results.filter(r => r.completed).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-green-500/20' : 'bg-orange-500/20'
        }`}>
          <Trophy size={48} className={passed ? 'text-green-400' : 'text-orange-400'} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {passed ? 'Challenge Complete!' : 'Good Effort!'}
        </h2>

        <p className="text-slate-400 mb-6">
          {completedCount} out of {challenges.length} completed
        </p>

        <div className="text-5xl font-mono font-black mb-8">
          <span className="text-brand-accent">{score}</span>
          <span className="text-slate-600 text-2xl ml-2">pts</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button
            onClick={() => onComplete(score, results)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white uppercase tracking-widest">
            {currentIdx + 1} / {challenges.length}
          </span>
          <div className="flex gap-1">
            {challenges.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentIdx
                    ? 'bg-green-500'
                    : idx === currentIdx
                    ? 'bg-brand-accent'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft !== null && timeLeft <= 5 
            ? 'bg-red-500/20 border border-red-500/30' 
            : 'bg-slate-900/50 border border-slate-800'
        }`}>
          <Timer size={16} className={timeLeft !== null && timeLeft <= 5 ? 'text-red-400' : 'text-slate-400'} />
          <span className={`font-mono font-bold ${
            timeLeft !== null && timeLeft <= 5 ? 'text-red-400' : 'text-white'
          }`}>
            {formatTime(timeLeft || 0)}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-brand-accent/20 text-brand-accent text-xs font-bold uppercase rounded">
              {currentChallenge.type}
            </span>
            <span className="text-xs text-slate-500">
              {currentChallenge.points} points
            </span>
          </div>

          <h3 className="text-xl text-white mb-6">{currentChallenge.prompt}</h3>

          {currentChallenge.hint && (
            <div className="mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-slate-500 hover:text-brand-accent transition-colors"
              >
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-400"
                >
                  💡 {currentChallenge.hint}
                </motion.div>
              )}
            </div>
          )}

          <button
            onClick={handleComplete}
            className="w-full py-4 bg-brand-accent text-black rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all"
          >
            I Did It!
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="font-mono font-bold text-white">{score} pts</span>
        </div>
        <div className="text-xs text-slate-500">
          Target: {currentChallenge.target}
        </div>
      </div>
    </div>
  );
}
