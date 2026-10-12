import React from 'react';
import {
  ElectromagnetismState,
  CalculatedElectromagnetism,
  ELECTROMAGNETISM_PRESETS,
  ElectromagnetismPreset,
  format3SF,
} from './physics';
import { Sliders, RotateCcw, Hand } from 'lucide-react';

interface ElectromagnetismControlsProps {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
  onChangeCurrentA: (val: number) => void;
  onChangeBFieldT: (val: number) => void;
  onChangeLengthM: (val: number) => void;
  onApplyPreset: (preset: ElectromagnetismPreset) => void;
  onReset: () => void;
}

interface SliderRowProps {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  isBipolar?: boolean; // shows a centre-zero marker
  accent?: string;
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  isBipolar,
  accent = 'accent-amber-400',
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-slate-300">
        <span className="text-amber-400 font-bold">{symbol}</span> — {label}
      </span>
      <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
        {format3SF(value)} {unit}
      </span>
    </div>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 rounded-full cursor-pointer ${accent} bg-[#1A2030]`}
        style={{ appearance: 'auto' }}
      />
      {isBipolar && (
        <div
          className="absolute top-0 h-full flex items-center pointer-events-none"
          style={{ left: `${((0 - min) / (max - min)) * 100}%` }}
        >
          <div className="w-0.5 h-3 bg-slate-500 rounded-full -mt-0.5" />
        </div>
      )}
    </div>
    {isBipolar && (
      <div className="flex justify-between text-[9px] font-mono text-slate-600">
        <span>{min} A (↓)</span>
        <span>0 A</span>
        <span>+{max} A (↑)</span>
      </div>
    )}
  </div>
);

export const ElectromagnetismControls: React.FC<ElectromagnetismControlsProps> = ({
  state,
  calculated,
  onChangeCurrentA,
  onChangeBFieldT,
  onChangeLengthM,
  onApplyPreset,
  onReset,
}) => {
  return (
    <div className="bg-[#141722] border border-[#232938] rounded-xl p-3 flex flex-col gap-3">
      {/* Panel header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#1F2432]">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Controls
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0E1017] border border-[#1F2432] text-slate-400 hover:text-amber-400 hover:border-amber-500/40 text-[10px] font-mono transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-3.5">
        <SliderRow
          label="Current"
          symbol="I"
          value={state.currentA}
          min={-10}
          max={10}
          step={0.1}
          unit="A"
          onChange={onChangeCurrentA}
          isBipolar={true}
        />
        <SliderRow
          label="Magnetic Flux Density"
          symbol="B"
          value={state.bFieldT}
          min={0.01}
          max={0.20}
          step={0.01}
          unit="T"
          onChange={onChangeBFieldT}
        />
        <SliderRow
          label="Wire Length in Field"
          symbol="L"
          value={state.lengthM}
          min={0.10}
          max={2.00}
          step={0.05}
          unit="m"
          onChange={onChangeLengthM}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          Real-World Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ELECTROMAGNETISM_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E1017] border border-[#1A2030] text-[10px] font-mono text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fleming's Left-Hand Rule hint */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#0E1017] border border-[#1A2030]">
        <div className="flex items-center gap-1.5">
          <Hand className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
            Fleming's Left-Hand Rule
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-0.5">
          <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-[#141722] border border-[#1F2432]">
            <span className="text-[11px]" style={{ color: '#60A5FA' }}>☞</span>
            <span className="text-[9px] font-mono text-blue-400">Index → B</span>
            <span className="text-[9px] font-mono text-slate-500">(field)</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-[#141722] border border-[#1F2432]">
            <span className="text-[11px]" style={{ color: '#34D399' }}>☞</span>
            <span className="text-[9px] font-mono text-green-400">Middle → I</span>
            <span className="text-[9px] font-mono text-slate-500">(current)</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-[#141722] border border-amber-500/20">
            <span className="text-[11px]" style={{ color: '#FBBF24' }}>☞</span>
            <span className="text-[9px] font-mono text-amber-400">Thumb → F</span>
            <span className="text-[9px] font-mono text-slate-500">(force)</span>
          </div>
        </div>
        <p className="text-[9px] font-mono text-slate-600 leading-relaxed mt-0.5">
          Left hand only — motor effect. Right hand → generator effect.
        </p>
      </div>
    </div>
  );
};
