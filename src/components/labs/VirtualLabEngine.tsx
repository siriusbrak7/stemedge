import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Target, 
  BarChart3, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useState, ReactNode } from 'react';
import { LabConfig, LabSession, LabPhase } from '../../data/labs/labTypes';
import { useLabState, saveLabSession } from '../../hooks/useLabState';
import PredictionPhase from './PredictionPhase';
import ObservationPhase from './ObservationPhase';
import AnalysisPhase from './AnalysisPhase';

interface VirtualLabEngineProps {
  config: LabConfig;
  renderSimulation: (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => ReactNode;
  onComplete?: (session: LabSession) => void;
}

const PHASE_CONFIG = {
  predict: {
    icon: Lightbulb,
    title: 'Predict',
    description: 'Make a hypothesis before observing',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
  },
  observe: {
    icon: Play,
    title: 'Observe',
    description: 'Run the simulation and collect data',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/30',
  },
  analyze: {
    icon: BarChart3,
    title: 'Analyze',
    description: 'Reflect on your observations',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
  },
};

export default function VirtualLabEngine({ 
  config, 
  renderSimulation,
  onComplete 
}: VirtualLabEngineProps) {
  const {
    session,
    currentTrialData,
    setPhase,
    setVariables,
    recordPrediction,
    recordObservation,
    recordAnalysis,
    nextTrial,
    completeLab,
    resetLab,
  } = useLabState(config);

  const [phaseComplete, setPhaseComplete] = useState<Record<LabPhase, boolean>>({
    predict: false,
    observe: false,
    analyze: false,
  });

  const handlePhaseComplete = (phase: LabPhase) => {
    setPhaseComplete(prev => ({ ...prev, [phase]: true }));
    
    if (phase === 'predict') {
      setPhase('observe');
    } else if (phase === 'observe') {
      setPhase('analyze');
    } else if (phase === 'analyze') {
      if (session.currentTrial < config.trialLimit) {
        nextTrial();
        setPhaseComplete({ predict: false, observe: false, analyze: false });
      } else {
        const finalSession = completeLab();
        saveLabSession(finalSession);
        onComplete?.(finalSession);
      }
    }
  };

  const handleReset = () => {
    resetLab();
    setPhaseComplete({ predict: false, observe: false, analyze: false });
  };

  const handleRecordData = (result: number | Record<string, number | string>) => {
    const point = {
      trial: session.currentTrial,
      variables: { ...session.variables },
      result,
      timestamp: Date.now(),
    };
    recordObservation(point);
  };

  const currentPhaseConfig = PHASE_CONFIG[session.currentPhase];

  return (
    <div className="w-full flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${currentPhaseConfig.bgColor} ${currentPhaseConfig.color} border ${currentPhaseConfig.borderColor}`}>
              {config.subject.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Trial {session.currentTrial} of {config.trialLimit}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {config.title}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{config.description}</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm"
        >
          <RotateCcw size={16} />
          Reset Lab
        </button>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-2 mb-8 p-3 bg-slate-900/50 rounded-2xl border border-slate-800">
        {(['predict', 'observe', 'analyze'] as LabPhase[]).map((phase, idx) => {
          const cfg = PHASE_CONFIG[phase];
          const isActive = session.currentPhase === phase;
          const isComplete = phaseComplete[phase];

          return (
            <div key={phase} className="flex items-center flex-1 min-w-0">
              <motion.div
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all w-full ${
                  isActive
                    ? `${cfg.bgColor} border ${cfg.borderColor}`
                    : isComplete
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-slate-900 border border-slate-700'
                }`}
                animate={isActive ? { scale: 1.03, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                style={isActive ? {
                  boxShadow: `0 0 20px ${cfg.color.includes('yellow') ? 'rgba(250,204,21,0.2)' : cfg.color.includes('cyan') ? 'rgba(34,211,238,0.2)' : 'rgba(34,197,94,0.2)'}`
                } : {}}
              >
                {/* Step circle */}
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? `${cfg.bgColor} ${cfg.color} border ${cfg.borderColor}`
                        : 'bg-slate-800 text-slate-600'
                  }`}
                  animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                >
                  {isComplete ? <CheckCircle2 size={17} /> : <cfg.icon size={17} />}
                </motion.div>

                <div className="min-w-0">
                  <div className={`text-xs font-bold uppercase tracking-wider truncate ${
                    isActive ? cfg.color : isComplete ? 'text-green-400' : 'text-slate-500'
                  }`}>
                    {cfg.title}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block truncate">
                    {cfg.description}
                  </div>
                </div>
              </motion.div>

              {idx < 2 && (
                <div className="relative mx-1.5 hidden h-0.5 flex-1 bg-slate-800 sm:block shrink-0 min-w-[20px]">
                  {/* Static fill */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-accent to-green-400 rounded-full"
                    animate={{ width: phaseComplete[phase] ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Flowing dash when active */}
                  {isActive && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-full process-flow-line" style={{ stroke: 'currentColor' }} />
                    </div>
                  )}
                  <ChevronRight size={18} className="absolute -right-2 -top-2 text-slate-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {session.currentPhase === 'predict' && (
            <motion.div
              key="predict"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="flex-1"
            >
              <PredictionPhase
                prompts={config.predictionPrompts}
                variables={session.variables}
                variableConfig={config.variables}
                onVariablesChange={setVariables}
                predictions={currentTrialData.predictions}
                onPrediction={recordPrediction}
                onComplete={() => handlePhaseComplete('predict')}
              />
            </motion.div>
          )}

          {session.currentPhase === 'observe' && (
            <motion.div
              key="observe"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="flex-1"
            >
              <ObservationPhase
                variables={session.variables}
                variableConfig={config.variables}
                onVariablesChange={setVariables}
                observations={currentTrialData.observations}
                onRecordData={handleRecordData}
                renderSimulation={renderSimulation}
                onComplete={() => handlePhaseComplete('observe')}
              />
            </motion.div>
          )}

          {session.currentPhase === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="flex-1"
            >
              <AnalysisPhase
                prompts={config.analysisPrompts}
                predictions={currentTrialData.predictions}
                observations={currentTrialData.observations}
                analysis={currentTrialData.analysis}
                onAnalysis={recordAnalysis}
                onComplete={() => handlePhaseComplete('analyze')}
                isLastTrial={session.currentTrial === config.trialLimit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning Objectives */}
      <div className="mt-6 p-4 bg-slate-900/30 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-brand-accent" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Learning Objectives
          </span>
        </div>
        <ul className="space-y-2">
          {config.learningObjectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
              {obj}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
