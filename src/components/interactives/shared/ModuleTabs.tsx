import { motion, AnimatePresence } from 'motion/react';

interface Tab<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

interface ModuleTabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Tailwind color token used for active glow, e.g. 'cyan', 'orange', 'green' */
  accentColor?: string;
}

const ACCENT_STYLES: Record<string, { active: string; glow: string }> = {
  cyan:   { active: 'bg-cyan-400 text-black',    glow: 'shadow-[0_0_18px_rgba(34,211,238,0.5)]' },
  orange: { active: 'bg-orange-400 text-black',  glow: 'shadow-[0_0_18px_rgba(251,146,60,0.5)]' },
  green:  { active: 'bg-green-400 text-black',   glow: 'shadow-[0_0_18px_rgba(74,222,128,0.5)]' },
  pink:   { active: 'bg-pink-400 text-black',    glow: 'shadow-[0_0_18px_rgba(244,114,182,0.5)]' },
  purple: { active: 'bg-violet-400 text-black',  glow: 'shadow-[0_0_18px_rgba(167,139,250,0.5)]' },
  yellow: { active: 'bg-yellow-400 text-black',  glow: 'shadow-[0_0_18px_rgba(250,204,21,0.5)]' },
  amber:  { active: 'bg-amber-400 text-black',   glow: 'shadow-[0_0_18px_rgba(251,191,36,0.5)]' },
  white:  { active: 'bg-white text-black',       glow: 'shadow-[0_0_18px_rgba(255,255,255,0.2)]' },
};

export default function ModuleTabs<T extends string>({
  tabs,
  active,
  onChange,
  accentColor = 'cyan',
}: ModuleTabsProps<T>) {
  const styles = ACCENT_STYLES[accentColor] ?? ACCENT_STYLES.cyan;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
              isActive
                ? `${styles.active} ${styles.glow}`
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-active-bg"
                className="absolute inset-0 rounded-xl"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
