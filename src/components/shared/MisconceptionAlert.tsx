import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { AlertTriangle, X, BookOpen, Lightbulb } from 'lucide-react';

export interface Misconception {
  id: string;
  title: string;
  misconception: string;
  correction: string;
  explanation: string;
  examples?: string[];
  relatedTopic?: string;
  difficulty: 'common' | 'moderate' | 'rare';
}

interface MisconceptionAlertProps {
  misconception: Misconception;
  onClose?: () => void;
  onLearnMore?: () => void;
  position?: 'center' | 'bottom';
}

export default function MisconceptionAlert({
  misconception,
  onClose,
  onLearnMore,
  position = 'center',
}: MisconceptionAlertProps) {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    common: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'Common Misconception' },
    moderate: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: 'Misconception' },
    rare: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Uncommon Misconception' },
  };

  const colors = difficultyColors[misconception.difficulty];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`${colors.bg} ${colors.border} rounded-2xl border p-6 relative ${
          position === 'center' ? 'max-w-lg mx-auto' : 'max-w-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
            <AlertTriangle size={24} className={colors.text} />
          </div>

          <div className="flex-1">
            <div className={`text-[10px] font-bold uppercase tracking-widest ${colors.text} mb-2`}>
              {colors.label}
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {misconception.title}
            </h3>

            <div className="bg-red-500/10 rounded-lg p-4 mb-4">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                ❌ Incorrect Understanding
              </div>
              <p className="text-slate-300 italic">"{misconception.misconception}"</p>
            </div>

            <div className="bg-green-500/10 rounded-lg p-4 mb-4">
              <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
                ✓ Correct Understanding
              </div>
              <p className="text-white font-medium">{misconception.correction}</p>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <BookOpen size={12} className="inline mr-1" />
                      Explanation
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {misconception.explanation}
                    </p>
                  </div>

                  {misconception.examples && misconception.examples.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <Lightbulb size={12} className="inline mr-1" />
                        Examples
                      </div>
                      <ul className="space-y-2">
                        {misconception.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-brand-accent">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-brand-accent hover:text-white transition-colors"
              >
                {expanded ? 'Show less' : 'Learn why →'}
              </button>

              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="text-sm text-slate-500 hover:text-white transition-colors"
                >
                  Review topic
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function MisconceptionDetector({
  userAnswer,
  misconceptions,
  onDetected,
}: {
  userAnswer: string;
  misconceptions: Misconception[];
  onDetected: (misconception: Misconception) => void;
}) {
  const detected = misconceptions.find(m => 
    userAnswer.toLowerCase().includes(m.misconception.toLowerCase()) ||
    m.misconception.toLowerCase().includes(userAnswer.toLowerCase())
  );

  if (detected) {
    onDetected(detected);
  }

  return null;
}
