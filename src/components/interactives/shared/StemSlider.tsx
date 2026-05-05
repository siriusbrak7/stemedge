import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StemSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color?: 'cyan' | 'orange' | 'pink' | 'green' | 'purple' | 'yellow' | 'red' | 'amber';
  onChange: (v: number) => void;
  disabled?: boolean;
  /** If true shows a formula badge instead of plain unit */
  formulaLabel?: string;
}

const colorMap: Record<string, string> = {
  cyan:   '#22D3EE',
  orange: '#f59e0b',
  pink:   '#fb7185',
  green:  '#22c55e',
  purple: '#a78bfa',
  yellow: '#facc15',
  red:    '#ef4444',
  amber:  '#f59e0b',
};

const sliderClass: Record<string, string> = {
  cyan:   'stem-slider stem-slider-cyan',
  orange: 'stem-slider stem-slider-orange',
  pink:   'stem-slider stem-slider-pink',
  green:  'stem-slider stem-slider-green',
  purple: 'stem-slider stem-slider-purple',
  yellow: 'stem-slider stem-slider-yellow',
  red:    'stem-slider stem-slider-orange',
  amber:  'stem-slider stem-slider-orange',
};

export default function StemSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  color = 'cyan',
  onChange,
  disabled = false,
  formulaLabel,
}: StemSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const c = colorMap[color];
  const prevValue = useRef(value);
  const changed = prevValue.current !== value;
  useEffect(() => { prevValue.current = value; });

  return (
    <div className={`space-y-2 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={changed ? { scale: 0.7, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="text-sm font-mono font-bold"
            style={{ color: c }}
          >
            {typeof value === 'number' && !Number.isInteger(value)
              ? value.toFixed(step < 1 ? 1 : 0)
              : value}
            {unit && <span className="text-xs text-slate-500 ml-1">{unit}</span>}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={sliderClass[color]}
          style={{ '--slider-pct': `${pct}%`, '--slider-color': c } as React.CSSProperties}
        />
      </div>

      {formulaLabel && (
        <div className="text-[10px] text-slate-600 font-mono">{formulaLabel}</div>
      )}
    </div>
  );
}
