import React from 'react';
import {
  CalculatedElectromagnetism,
  ElectromagnetismState,
  format3SF,
} from './physics';
import { Zap, Magnet, Activity, Ruler, ArrowUpDown } from 'lucide-react';

interface ElectromagnetismReadoutsProps {
  state: ElectromagnetismState;
  calculated: CalculatedElectromagnetism;
}

interface ReadoutCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
  accent?: string; // tailwind text colour class
}

const ReadoutCard: React.FC<ReadoutCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  highlight,
  accent = 'text-amber-300',
}) => (
  <div
    className={`flex items-center gap-3 rounded-xl p-3 border transition-colors ${
      highlight
        ? 'bg-amber-500/10 border-amber-500/30'
        : 'bg-[#0E1017] border-[#1F2432]'
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-[#141722] text-slate-400'
      }`}
    >
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider leading-none">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className={`text-lg font-mono font-bold leading-none ${accent}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-500 leading-none">{unit}</span>
        )}
      </div>
    </div>
  </div>
);

export const ElectromagnetismReadouts: React.FC<ElectromagnetismReadoutsProps> = ({
  state,
  calculated,
}) => {
  const { currentA, bFieldT, lengthM } = state;
  const { forceMagnitudeN, directionLabel, directionSign } = calculated;

  const noForce = Math.abs(currentA) < 0.001;

  return (
    <div className="bg-[#141722] border border-[#232938] rounded-xl p-3 flex flex-col gap-2.5">
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-1 border-b border-[#1F2432]">
        <Activity className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
          Live Readouts
        </span>
      </div>

      {/* Readout cards */}
      <div className="grid grid-cols-1 gap-2">
        {/* Force F */}
        <ReadoutCard
          icon={Zap}
          label="Force on Wire  F = BIL"
          value={noForce ? '0' : format3SF(forceMagnitudeN)}
          unit="N"
          highlight={!noForce}
          accent={
            noForce
              ? 'text-slate-500'
              : directionSign > 0
              ? 'text-amber-300'
              : 'text-blue-300'
          }
        />

        {/* Direction */}
        <ReadoutCard
          icon={ArrowUpDown}
          label="Force Direction"
          value={directionLabel}
          unit=""
          accent={
            noForce
              ? 'text-slate-500'
              : directionSign > 0
              ? 'text-amber-300'
              : 'text-blue-300'
          }
        />

        {/* B field */}
        <ReadoutCard
          icon={Magnet}
          label="Magnetic Flux Density  B"
          value={format3SF(bFieldT)}
          unit="T"
        />

        {/* Current */}
        <ReadoutCard
          icon={Zap}
          label="Current  I"
          value={format3SF(currentA)}
          unit="A"
          accent={currentA >= 0 ? 'text-amber-300' : 'text-blue-300'}
        />

        {/* Wire length */}
        <ReadoutCard
          icon={Ruler}
          label="Wire Length in Field  L"
          value={format3SF(lengthM)}
          unit="m"
        />
      </div>

      {/* Formula reminder */}
      <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-[#0E1017] border border-[#1A2030]">
        <span className="text-[10px] font-mono text-slate-500">
          F = B × I × L &nbsp;|&nbsp;{' '}
          {format3SF(bFieldT)} × {format3SF(currentA)} × {format3SF(lengthM)}{' '}
          = <span className={noForce ? 'text-slate-500' : 'text-amber-400'}>
            {format3SF(bFieldT * currentA * lengthM)} N
          </span>
        </span>
      </div>
    </div>
  );
};
