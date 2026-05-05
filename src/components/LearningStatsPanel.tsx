import { Activity, Clock, Flame } from 'lucide-react';
import type { Topic } from '../data/mockData';
import { calculateTopicAccuracy, formatDuration, type ProgressRecord } from '../utils/learningMetrics';

interface LearningStatsPanelProps {
  selectedTopic: Topic;
  progress: Record<string, ProgressRecord>;
  streakDays: number;
  sessionDurationMs: number;
}

export default function LearningStatsPanel({
  selectedTopic,
  progress,
  streakDays,
  sessionDurationMs,
}: LearningStatsPanelProps) {
  const topicAccuracy = Math.round(calculateTopicAccuracy(selectedTopic, progress) * 100);

  return (
    <>
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-brand-border">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-brand-accent" />
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Stats</h4>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-500 font-medium">Topic Accuracy</span>
            <span className="text-2xl font-mono text-white font-bold">{topicAccuracy}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent transition-all duration-700" style={{ width: `${topicAccuracy}%` }}></div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 border border-brand-border flex flex-col">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Learning Pulse</h4>
        <div className="space-y-4">
          <div className="p-4 bg-black/40 rounded-xl border border-brand-border flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Current Streak</span>
              <span className="text-xl font-mono text-orange-400 font-bold">{streakDays} day{streakDays === 1 ? '' : 's'}</span>
            </div>
            <Flame className="w-8 h-8 text-orange-500/30" />
          </div>
          <div className="p-4 bg-black/40 rounded-xl border border-brand-border flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Session Time</span>
              <span className="text-xl font-mono text-brand-accent font-bold">{formatDuration(sessionDurationMs)}</span>
            </div>
            <Clock className="w-8 h-8 text-brand-accent/30" />
          </div>
        </div>
      </div>
    </>
  );
}
