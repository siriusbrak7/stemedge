import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface PredictionPromptProps {
  question: string;
  options?: string[];
  onPredict: (prediction: string) => void;
  onSkip?: () => void;
  showFeedback?: boolean;
  correctAnswer?: string;
  explanation?: string;
}

export default function PredictionPrompt({
  question,
  options,
  onPredict,
  onSkip,
  showFeedback = false,
  correctAnswer,
  explanation,
}: PredictionPromptProps) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (answer: string) => {
    setPrediction(answer);
    setSubmitted(true);
    if (showFeedback) {
      setShowResult(true);
    } else {
      onPredict(answer);
    }
  };

  const handleConfirm = () => {
    if (prediction) {
      onPredict(prediction);
    }
  };

  const isCorrect = prediction === correctAnswer;

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.div
          key="prediction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-yellow-500/5 rounded-2xl border border-yellow-500/20 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
              Make a Prediction
            </span>
          </div>

          <h3 className="text-xl text-white mb-6">{question}</h3>

          {options ? (
            <div className="space-y-3">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(option)}
                  className="w-full p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-left text-slate-300 hover:border-yellow-500/50 hover:text-white transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your prediction..."
                className="flex-1 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-yellow-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleSubmit(e.currentTarget.value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  if (input?.value) handleSubmit(input.value);
                }}
                className="px-6 py-4 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 transition-all"
              >
                Submit
              </button>
            </div>
          )}

          {onSkip && (
            <button
              onClick={onSkip}
              className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip prediction and observe directly →
            </button>
          )}
        </motion.div>
      ) : showResult ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`rounded-2xl border p-6 ${
            isCorrect 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-orange-500/10 border-orange-500/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            {isCorrect ? (
              <CheckCircle2 size={24} className="text-green-400" />
            ) : (
              <XCircle size={24} className="text-orange-400" />
            )}
            <span className={`font-bold ${
              isCorrect ? 'text-green-400' : 'text-orange-400'
            }`}>
              {isCorrect ? 'Your prediction was correct!' : 'Your prediction was incorrect'}
            </span>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-1">Your prediction:</div>
            <div className="text-white font-medium">{prediction}</div>
          </div>

          {!isCorrect && correctAnswer && (
            <div className="mb-4">
              <div className="text-sm text-slate-400 mb-1">Correct answer:</div>
              <div className="text-green-400 font-medium">{correctAnswer}</div>
            </div>
          )}

          {explanation && (
            <p className="text-slate-300 text-sm">{explanation}</p>
          )}

          <button
            onClick={handleConfirm}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Continue to Observation
            <ArrowRight size={18} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="submitted"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb size={20} className="text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
              Your Prediction
            </span>
          </div>

          <p className="text-2xl text-white font-medium mb-2">"{prediction}"</p>
          <p className="text-slate-400 text-sm mb-6">
            Now let's observe what actually happens!
          </p>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
          >
            Start Observation
            <ArrowRight size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
