import React from 'react';
import {
  CircuitEvaluation,
  PlacedComponent,
  format3SF,
} from './physics';
import {
  Activity,
  Zap,
  Gauge,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

interface CircuitReadoutsProps {
  evaluation: CircuitEvaluation;
  components: PlacedComponent[];
}

export const CircuitReadouts: React.FC<CircuitReadoutsProps> = ({
  evaluation,
  components,
}) => {
  const resistors = components.filter(
    (c) => c.type === 'resistor_10' || c.type === 'resistor_20'
  );

  // Status badge styling based on 5 topology states
  const getTopologyBadge = () => {
    switch (evaluation.topology) {
      case 'Series (Closed)':
        return {
          bg: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400',
          dot: 'bg-emerald-400',
          text: 'Series (Closed)',
        };
      case 'Parallel (Closed)':
        return {
          bg: 'bg-cyan-950/70 border-cyan-500/50 text-cyan-400',
          dot: 'bg-cyan-400',
          text: 'Parallel (Closed)',
        };
      case 'Mixed (Closed)':
        return {
          bg: 'bg-indigo-950/70 border-indigo-500/50 text-indigo-400',
          dot: 'bg-indigo-400',
          text: 'Mixed (Closed)',
        };
      case 'Ambiguous — see hints':
        return {
          bg: 'bg-amber-950/70 border-amber-500/50 text-amber-400',
          dot: 'bg-amber-400',
          text: 'Ambiguous — see hints',
        };
      case 'Invalid (Short Circuit / Open Loop)':
      default:
        return {
          bg: 'bg-rose-950/70 border-rose-500/50 text-rose-400',
          dot: 'bg-rose-400',
          text: 'Incomplete / Open Circuit',
        };
    }
  };

  const badge = getTopologyBadge();

  return (
    <div id="circuits-telemetry-matrix" className="flex flex-col gap-3">
      {/* 6-Card Telemetry Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* 1. Cell e.m.f. */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Cell e.m.f. (E)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-mono font-bold text-amber-400 tabular-nums">
              {format3SF(evaluation.cellEmf)}
            </span>
            <span className="text-xs font-mono text-slate-400">V</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Ideal source (0 Ω)</span>
        </div>

        {/* 2. Total Current */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Total Current (I_tot)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-mono font-bold text-slate-100 tabular-nums">
              {format3SF(evaluation.totalCurrent)}
            </span>
            <span className="text-xs font-mono text-slate-400">A</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Leaving cell (+)</span>
        </div>

        {/* 3. Total Resistance */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Total Resistance (R_tot)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-mono font-bold text-slate-100 tabular-nums">
              {evaluation.totalResistance === Infinity
                ? '∞'
                : format3SF(evaluation.totalResistance)}
            </span>
            <span className="text-xs font-mono text-slate-400">Ω</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Equivalent circuit load</span>
        </div>

        {/* 4. Ammeter Reading */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Ammeter Reading</span>
            <span className="text-[9px] text-emerald-400 font-bold">Series</span>
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400 tabular-nums">
              {evaluation.ammeterReading !== null
                ? format3SF(evaluation.ammeterReading)
                : '—'}
            </span>
            <span className="text-xs font-mono text-slate-400">A</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Ideal 0 Ω inline</span>
        </div>

        {/* 5. Voltmeter Reading */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938]">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Voltmeter Reading</span>
            <span className="text-[9px] text-sky-400 font-bold">Parallel</span>
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-mono font-bold text-sky-400 tabular-nums">
              {evaluation.voltmeterReading !== null
                ? format3SF(evaluation.voltmeterReading)
                : '—'}
            </span>
            <span className="text-xs font-mono text-slate-400">V</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Potential difference</span>
        </div>

        {/* 6. Circuit Topology State */}
        <div className="flex flex-col p-2.5 rounded-xl bg-[#141722] border border-[#232938] justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Circuit State
          </span>
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-semibold mt-1 ${badge.bg}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dot}`} />
            <span className="truncate">{badge.text}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Live topological check</span>
        </div>
      </div>

      {/* Component Breakdown Table (Ohm's Law V = IR) */}
      <div className="p-3 rounded-xl bg-[#141722] border border-[#232938]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Component Breakdown (Ohm's Law V = I × R)</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">Values to 3 s.f.</span>
        </div>

        {resistors.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No resistors placed on the workbench yet. Drag a 10 Ω or 20 Ω resistor from the tray.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#232938] text-[10px] font-mono uppercase text-slate-400">
                  <th className="py-1 px-1.5">Component</th>
                  <th className="py-1 px-1.5">Resistance (R)</th>
                  <th className="py-1 px-1.5">Current (I)</th>
                  <th className="py-1 px-1.5">p.d. (V = IR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2333]">
                {resistors.map((r, idx) => {
                  const data = evaluation.resistorCurrents[r.id];
                  const iVal = data ? data.current : 0;
                  const vVal = data ? data.voltage : 0;

                  return (
                    <tr key={r.id} className="text-slate-200">
                      <td className="py-1.5 px-1.5 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-xs bg-cyan-400" />
                        <span>{r.label || `Resistor R${idx + 1}`}</span>
                      </td>
                      <td className="py-1.5 px-1.5 font-mono text-cyan-300">
                        {format3SF(r.value)} Ω
                      </td>
                      <td className="py-1.5 px-1.5 font-mono text-slate-100">
                        {format3SF(iVal)} A
                      </td>
                      <td className="py-1.5 px-1.5 font-mono text-amber-300 font-semibold">
                        {format3SF(vVal)} V
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cambridge IGCSE 0625 Exam Rules Callout */}
      <div className="p-3 rounded-xl bg-[#101420] border border-[#1E2538] text-xs text-slate-300 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px] uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          <span>Cambridge Exam Rules (Paper 4)</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
          <li>
            <strong className="text-slate-200">Ammeter:</strong> Connected strictly in{' '}
            <span className="text-emerald-400 font-semibold">series</span>. Ideal resistance is 0 Ω.
          </li>
          <li>
            <strong className="text-slate-200">Voltmeter:</strong> Connected strictly in{' '}
            <span className="text-sky-400 font-semibold">parallel</span>. Ideal resistance is infinite.
          </li>
          <li>
            <strong className="text-slate-200">Series:</strong> Current is identical at every point:{' '}
            <span className="font-mono text-slate-300">I_tot = I₁ = I₂</span>.
          </li>
          <li>
            <strong className="text-slate-200">Parallel:</strong> Potential difference is identical across each branch:{' '}
            <span className="font-mono text-slate-300">V_tot = V₁ = V₂ = 6.0 V</span>.
          </li>
        </ul>
      </div>
    </div>
  );
};
