import { motion } from 'motion/react';
import { ChevronRight, Lightbulb, Sliders } from 'lucide-react';
import { useState } from 'react';
import { PredictionPrompt, LabVariable } from '../../data/labs/labTypes';

interface PredictionPhaseProps {
  prompts: PredictionPrompt[];
  variables: Record<string, number>;
  variableConfig: LabVariable[];
  onVariablesChange: (vars: Record<string, number>) => void;
  predictions: Record<string, string | number>;
  onPrediction: (promptId: string, answer: string | number) => void;
  onComplete: () => void;
}

export default function PredictionPhase({
  prompts,
  variables,
  variableConfig,
  onVariablesChange,
  predictions,
  onPrediction,
  onComplete,
}: PredictionPhaseProps) {
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const allPredictionsMade = prompts.every(p => predictions[p.id] !== undefined);

  const currentPrompt = prompts[currentPromptIdx];

  const handleSliderChange = (varId: string, value: number) => {
    onVariablesChange({ ...variables, [varId]: value });
  };

  const handlePredictionSelect = (promptId: string, answer: string | number) => {
    onPrediction(promptId, answer);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Variable Controls */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders size={16} className="text-brand-accent" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Adjust Variables
          </h3>
        </div>

        <div className="space-y-6 p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
          {variableConfig.map(variable => (
            <div key={variable.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-300">
                  {variable.name}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-brand-accent">
                    {variables[variable.id].toFixed(variable.step < 1 ? 1 : 0)}
                  </span>
                  <span className="text-xs text-slate-500">{variable.unit}</span>
                </div>
              </div>
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={variable.step}
                value={variables[variable.id]}
                onChange={(e) => handleSliderChange(variable.id, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
              <p className="text-[10px] text-slate-500">{variable.description}</p>
            </div>
          ))}
        </div>

        {/* Current Setup Display */}
        <div className="p-4 bg-black/40 rounded-xl border border-brand-accent/20">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Current Setup
          </div>
          <div className="flex flex-wrap gap-2">
            {variableConfig.map(v => (
              <span 
                key={v.id}
                className="px-3 py-1.5 bg-slate-900 rounded-lg text-xs font-mono text-brand-accent border border-slate-700"
              >
                {v.name}: {variables[v.id]}{v.unit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Prediction Prompts */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-yellow-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Make Your Predictions
          </h3>
        </div>

        <div className="p-6 bg-yellow-400/5 rounded-2xl border border-yellow-400/20">
          <p className="text-sm text-yellow-400/80 italic mb-4">
            Before running the simulation, predict what will happen based on your variables.
          </p>

          {/* Progress indicator — pill track */}
          <div className="flex items-center gap-2 mb-5">
            {prompts.map((_, idx) => {
              const done = predictions[prompts[idx]?.id] !== undefined;
              const active = idx === currentPromptIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPromptIdx(idx)}
                  className={`rounded-full transition-all duration-200 ${
                    active
                      ? 'w-8 h-3 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                      : done
                        ? 'w-3 h-3 bg-green-500'
                        : 'w-3 h-3 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
            <span className="ml-2 text-[10px] text-slate-500 font-mono">
              {currentPromptIdx + 1} / {prompts.length}
            </span>
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

              {currentPrompt.type === 'multiple-choice' && currentPrompt.options && (
                <div className="space-y-2">
                  {currentPrompt.options.map((option, idx) => {
                    const selected = predictions[currentPrompt.id] === option;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handlePredictionSelect(currentPrompt.id, option)}
                        whileTap={{ scale: 0.97 }}
                        animate={selected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full p-4 rounded-xl text-left transition-all border ${
                          selected
                            ? 'bg-yellow-400/15 border-yellow-400 text-white shadow-[0_0_14px_rgba(250,204,21,0.25)]'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-yellow-400/40 hover:bg-yellow-400/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            selected ? 'border-yellow-400 bg-yellow-400' : 'border-slate-600'
                          }`}>
                            {selected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {currentPrompt.type === 'slider' && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={(predictions[currentPrompt.id] as number) || 50}
                    onChange={(e) => handlePredictionSelect(currentPrompt.id, parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                  <div className="text-center">
                    <span className="text-3xl font-mono font-bold text-yellow-400">
                      {predictions[currentPrompt.id] || 50}
                    </span>
                  </div>
                </div>
              )}

              {currentPrompt.type === 'text' && (
                <textarea
                  value={(predictions[currentPrompt.id] as string) || ''}
                  onChange={(e) => handlePredictionSelect(currentPrompt.id, e.target.value)}
                  placeholder="Type your prediction..."
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-yellow-400 focus:outline-none resize-none h-32"
                />
              )}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
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
                disabled={predictions[currentPrompt.id] === undefined}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={onComplete}
                disabled={!allPredictionsMade}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Start Observation <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
