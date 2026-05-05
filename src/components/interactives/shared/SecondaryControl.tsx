interface SecondaryControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose';
  onChange: (value: number) => void;
}

const toneClasses = {
  cyan: 'accent-cyan-400 text-cyan-300',
  emerald: 'accent-emerald-400 text-emerald-300',
  amber: 'accent-amber-400 text-amber-300',
  rose: 'accent-rose-400 text-rose-300',
};

export default function SecondaryControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  hint,
  tone = 'cyan',
  onChange,
}: SecondaryControlProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
      <div className="mb-2 flex items-start justify-between gap-3 text-xs text-slate-400">
        <div>
          <span className="font-bold uppercase tracking-widest">{label}</span>
          {hint && <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{hint}</p>}
        </div>
        <span className={`shrink-0 font-mono font-bold ${toneClasses[tone].split(' ')[1]}`}>
          {value}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${toneClasses[tone].split(' ')[0]}`}
        style={{ background: `linear-gradient(to right, rgba(34,211,238,0.55) ${percent}%, rgba(51,65,85,0.9) ${percent}%)` }}
      />
    </div>
  );
}
