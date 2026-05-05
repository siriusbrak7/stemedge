import { motion } from 'motion/react';
import type { Subject } from '../../data/mockData';
import { buildDashboardProgress, type ProgressRecord } from '../../utils/learningMetrics';

interface StudentDashboardProps {
  subjects: Subject[];
  progress: Record<string, ProgressRecord>;
}

export default function StudentDashboard({ subjects, progress }: StudentDashboardProps) {
  const subjectProgress = buildDashboardProgress(subjects, progress);

  return (
    <motion.div
      key="student-dashboard"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8 max-w-4xl mx-auto pt-8"
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="w-12 h-px bg-brand-accent/50"></span>
        <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">Student Dashboard</span>
      </div>
      <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Your Progress</h2>
      <p className="text-slate-500 text-sm mb-10 max-w-lg">
        Track your mastery across all scientific disciplines.
      </p>

      <div className="space-y-12 pb-20">
        {subjectProgress.map((subject) => (
          <div key={subject.subjectId}>
            <h3 className="text-2xl font-light text-white mb-6 border-b border-slate-800 pb-4 flex items-center justify-between gap-3">
              <span>{subject.subjectName}</span>
              <span className="text-xs font-mono text-brand-accent">
                {Math.round(subject.averageScore * 100)}% average
              </span>
            </h3>
            <div className="space-y-6">
              {subject.topics.map((topic) => (
                <div key={topic.topicId} className="bg-slate-900/40 border border-brand-border rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-slate-300">{topic.title}</h4>
                    <span className="text-xs font-mono text-brand-accent">
                      {topic.completedCount}/{topic.totalCount} Complete · {Math.round(topic.averageScore * 100)}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    {topic.subtopics.map((subtopic) => {
                      const pct = Math.round(subtopic.score * 100);
                      return (
                        <div key={subtopic.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-slate-800">
                          <span className="text-sm text-slate-400">{subtopic.title}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono font-bold w-10 text-right">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {subjectProgress.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 border border-slate-800 rounded-3xl">
            <p className="text-slate-500 font-medium">No progress recorded yet. Start learning to see your stats here!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
