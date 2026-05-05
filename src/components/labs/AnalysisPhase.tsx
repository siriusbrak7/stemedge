import { motion } from 'motion/react';
import { BarChart3, Send, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { AnalysisPrompt, DataPoint } from '../../data/labs/labTypes';

interface AnalysisPhaseProps {
  prompts: AnalysisPrompt[];
  predictions: Record<string, string | number>;
  observations: DataPoint[];
  analysis: Record<string, string>;
  onAnalysis: (promptId: string, answer: string) => void;
  onComplete: () => void;
  isLastTrial: boolean;
}

export default function AnalysisPhase({
  prompts,
  predictions,
  observations,
  analysis,
  onAnalysis,
  onComplete,
  isLastTrial,
}: AnalysisPhaseProps) {
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrompt = prompts[currentPromptIdx];
  const allAnswered = prompts.every(p => analysis[p.id] && analysis[p.id].length > 0);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete();
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Data Summary */}
      <div className="space-y-4">
        <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-brand-accent" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Your Data Summary
            </h4>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-black/40 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                Predictions Made
              </div>
              <div className="text-lg font-mono font-bold text-yellow-400">
                {Object.keys(predictions).length}
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                Data Points Collected
              </div>
              <div className="text-lg font-mono font-bold text-cyan-400">
                {observations.length}
              </div>
            </div>

            {observations.length > 0 && (
              <div className="p-3 bg-black/40 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  Average Result
                </div>
                <div className="text-lg font-mono font-bold text-white">
                  {(() => {
                    const numericResults = observations
                      .filter(o => typeof o.result === 'number')
                      .map(o => o.result as number);
                    if (numericResults.length === 0) return 'N/A';
                    const avg = numericResults.reduce((a, b) => a + b, 0) / numericResults.length;
                    return avg.toFixed(3);
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Predictions vs Observations */}
        {Object.keys(predictions).length > 0 && (
          <div className="p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/20">
            <h4 className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-3">
              Your Predictions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {Object.entries(predictions).map(([key, value]) => (
                <li key={key} className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                  <span className="truncate">{String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right: Analysis Questions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-green-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Analyze Your Results
          </h3>
        </div>

        <div className="p-6 bg-green-400/5 rounded-2xl border border-green-400/20">
          <p className="text-sm text-green-400/80 italic mb-6">
            Reflect on your predictions and observations. Explain what you learned.
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mb-6">
            {prompts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPromptIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPromptIdx 
                    ? 'bg-green-400 w-6' 
                    : analysis[prompts[idx]?.id]
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {currentPrompt && (
            <motion.div
              key={currentPrompt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-medium text-white">
                {currentPrompt.question}
              </h4>

              {currentPrompt.type === 'text' && (
                <textarea
                  value={analysis[currentPrompt.id] || ''}
                  onChange={(e) => onAnalysis(currentPrompt.id, e.target.value)}
                  placeholder="Write your analysis here..."
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-green-400 focus:outline-none resize-none h-40"
                />
              )}

              {currentPrompt.type === 'multiple-choice' && currentPrompt.correctAnswer && (
                <div className="space-y-2">
                  {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option) => (
                    <button
                      key={option}
                      onClick={() => onAnalysis(currentPrompt.id, option)}
                      className={`w-full p-4 rounded-xl text-left transition-all border ${
                        analysis[currentPrompt.id] === option
                          ? 'bg-green-400/20 border-green-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentPrompt.type === 'data-analysis' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Based on your {observations.length} data points, analyze the pattern.
                  </p>
                  <textarea
                    value={analysis[currentPrompt.id] || ''}
                    onChange={(e) => onAnalysis(currentPrompt.id, e.target.value)}
                    placeholder="Describe the relationship between variables and results..."
                    className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-green-400 focus:outline-none resize-none h-32"
                  />
                </div>
              )}

              {currentPrompt.rubric && (
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    Rubric
                  </div>
                  <p className="text-xs text-slate-400">{currentPrompt.rubric}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setCurrentPromptIdx(Math.max(0, currentPromptIdx - 1))}
              disabled={currentPromptIdx === 0}
              className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            {currentPromptIdx < prompts.length - 1 ? (
              <button
                onClick={() => setCurrentPromptIdx(currentPromptIdx + 1)}
                disabled={!analysis[currentPrompt?.id]}
                className="flex items-center gap-2 px-6 py-3 bg-green-400 text-black rounded-xl font-bold hover:bg-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : isLastTrial ? (
                  <>
                    Complete Lab <CheckCircle2 size={18} />
                  </>
                ) : (
                  <>
                    Next Trial <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
