import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ModuleTab {
  id: string;
  label: string;
}

interface MetricCard {
  label: string;
  value: string;
  tone?: 'accent' | 'success' | 'warn';
}

interface InteractiveModuleShellProps {
  title: string;
  subtitle: string;
  accent?: string;
  tabs?: ModuleTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  metrics?: MetricCard[];
  controls?: ReactNode;
  insights?: ReactNode;
  guide?: ReactNode;
  children: ReactNode;
}

const toneClasses = {
  accent: 'text-cyan-300 border-cyan-400/20 bg-cyan-400/5',
  success: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/5',
  warn: 'text-amber-300 border-amber-400/20 bg-amber-400/5',
};

export default function InteractiveModuleShell({
  title,
  subtitle,
  accent = 'cyan',
  tabs,
  activeTab,
  onTabChange,
  metrics,
  controls,
  insights,
  guide,
  children,
}: InteractiveModuleShellProps) {
  const accentClasses =
    accent === 'amber'
      ? 'from-amber-400/20 via-orange-400/10 to-transparent border-amber-400/20 text-amber-300'
      : accent === 'emerald'
        ? 'from-emerald-400/20 via-green-400/10 to-transparent border-emerald-400/20 text-emerald-300'
        : accent === 'rose'
          ? 'from-rose-400/20 via-pink-400/10 to-transparent border-rose-400/20 text-rose-300'
          : 'from-cyan-400/20 via-sky-400/10 to-transparent border-cyan-400/20 text-cyan-300';

  return (
    <div className="w-full h-full min-h-[560px] p-6">
      <div className={`rounded-[2rem] border bg-gradient-to-br ${accentClasses} p-6`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              Interactive Studio
            </div>
            <h2 className="text-3xl font-light tracking-tight text-white">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{subtitle}</p>
            {guide && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-relaxed text-slate-300">
                {guide}
              </div>
            )}
          </div>

          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 xl:min-w-[320px]">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  layout
                  className={`rounded-2xl border p-4 ${toneClasses[metric.tone ?? 'accent']}`}
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{metric.label}</div>
                  <div className="mt-2 text-xl font-semibold text-white">{metric.value}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {tabs && tabs.length > 0 && activeTab && onTabChange && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'border border-white/10 bg-black/20 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(240px,280px),1fr,minmax(240px,280px)]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Inputs</div>
          <div className="space-y-5">{controls}</div>
        </div>

        <motion.div
          key={activeTab ?? title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
        >
          {children}
        </motion.div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Explain Result</div>
          <div className="space-y-4">{insights}</div>
        </div>
      </div>
    </div>
  );
}
