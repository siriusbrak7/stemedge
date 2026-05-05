import { motion } from 'motion/react';
import { Play, Pause, Save, Table2, LineChart, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { LabVariable, DataPoint } from '../../data/labs/labTypes';

interface ObservationPhaseProps {
  variables: Record<string, number>;
  variableConfig: LabVariable[];
  onVariablesChange: (vars: Record<string, number>) => void;
  observations: DataPoint[];
  onRecordData: (result: number | Record<string, number | string>) => void;
  renderSimulation: (props: {
    variables: Record<string, number>;
    isRunning: boolean;
    onRecordData: (result: number | Record<string, number | string>) => void;
  }) => React.ReactNode;
  onComplete: () => void;
}

export default function ObservationPhase({
  variables,
  variableConfig,
  onVariablesChange,
  observations,
  onRecordData,
  renderSimulation,
  onComplete,
}: ObservationPhaseProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showData, setShowData] = useState(false);
  const [manualResult, setManualResult] = useState('');

  const handleSliderChange = (varId: string, value: number) => {
    onVariablesChange({ ...variables, [varId]: value });
  };

  const handleRecordDataPoint = () => {
    const value = parseFloat(manualResult);
    if (!isNaN(value)) {
      onRecordData(value);
      setManualResult('');
    }
  };

  const hasEnoughData = observations.length >= 3;
  const handleSimulationRecord = (result: number | Record<string, number | string>) => {
    onRecordData(result);
    setIsRunning(false);
    setShowData(true);
  };

  const simulation = renderSimulation({
    variables,
    isRunning,
    onRecordData: handleSimulationRecord,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Controls */}
      <div className="space-y-6">
        <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
            Control Panel
          </h3>
          <div className="flex items-start gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-slate-400">
            <Info size={14} className="mt-0.5 shrink-0 text-cyan-300" />
            <span>Set variables, run once to auto-record a measurement, then change one variable and repeat until you have 3 data points.</span>
          </div>

          {variableConfig.map(variable => (
            <div key={variable.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-300">
                  {variable.name}
                </label>
                <span className="text-sm font-mono font-bold text-brand-accent">
                  {variables[variable.id].toFixed(variable.step < 1 ? 1 : 0)} {variable.unit}
                </span>
              </div>
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={variable.step}
                value={variables[variable.id]}
                onChange={(e) => handleSliderChange(variable.id, parseFloat(e.target.value))}
                disabled={isRunning}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-50"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-slate-700 space-y-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isRunning
                  ? 'bg-red-500/20 border border-red-500 text-red-400'
                  : 'bg-brand-accent text-black hover:bg-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={18} /> Pause Simulation
                </>
              ) : (
                <>
                  <Play size={18} /> {observations.length ? 'Run Next Measurement' : 'Run Simulation'}
                </>
            )}
            </button>
          </div>
        </div>

        {/* Manual Data Entry */}
        <div className="p-4 bg-cyan-400/5 rounded-xl border border-cyan-400/20">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            Record Result
          </h4>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              value={manualResult}
              onChange={(e) => setManualResult(e.target.value)}
              placeholder="Optional manual value..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none text-sm"
            />
            <button
              onClick={handleRecordDataPoint}
              disabled={!manualResult}
              className="px-4 py-2 bg-cyan-400 text-black rounded-lg font-bold hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Save size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Center: Simulation */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-4 bg-black/40 rounded-2xl border border-brand-accent/20 min-h-[350px] flex items-center justify-center">
          {simulation || (
            <div className="text-slate-500 text-center">
              <Play size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Simulation will appear here</p>
              <p className="text-xs text-slate-600 mt-2">Adjust variables and click Run</p>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Table2 size={16} className="text-brand-accent" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                Collected Data ({observations.length} points)
              </h4>
            </div>
            <button
              onClick={() => setShowData(!showData)}
              className="text-xs text-brand-accent hover:text-white transition-colors"
            >
              {showData ? 'Hide' : 'Show'} Table
            </button>
          </div>

          {showData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-x-auto"
            >
              {observations.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">#</th>
                      {variableConfig.map(v => (
                        <th key={v.id} className="text-left py-2 px-3 text-slate-400 font-medium">
                          {v.name} ({v.unit})
                        </th>
                      ))}
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observations.map((obs, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50">
                        <td className="py-2 px-3 text-brand-accent font-mono">{obs.trial}</td>
                        {variableConfig.map(v => (
                          <td key={v.id} className="py-2 px-3 text-slate-300 font-mono">
                            {typeof obs.variables[v.id] === 'number' 
                              ? obs.variables[v.id].toFixed(2) 
                              : obs.variables[v.id]}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-white font-mono font-bold">
                          {formatResult(obs.result)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-500 text-center py-4">No data recorded yet. Run the simulation!</p>
              )}
            </motion.div>
          )}

          {/* Quick Stats */}
          {observations.length > 0 && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700">
              <div className="flex-1 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                  Data Points
                </div>
                <div className="text-2xl font-mono font-bold text-brand-accent">
                  {observations.length}
                </div>
              </div>
              {observations.length >= 3 && (
                <>
                  <div className="flex-1 text-center">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                      Average
                    </div>
                  <div className="text-2xl font-mono font-bold text-white">
                      {formatAverage(observations)}
                  </div>
                </div>
                  <div className="flex-1 text-center">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                      Min / Max
                    </div>
                    <div className="text-lg font-mono font-bold text-slate-300">
                      {formatRange(observations)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Complete Button */}
        <button
          onClick={onComplete}
          disabled={!hasEnoughData}
          className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <LineChart size={18} />
          {hasEnoughData ? 'Proceed to Analysis' : `Record ${3 - observations.length} more data point${observations.length === 2 ? '' : 's'}`}
        </button>
        {hasEnoughData && (
          <div className="flex items-center justify-center gap-2 text-xs text-green-300">
            <CheckCircle2 size={14} />
            Data target met. You can continue collecting or proceed.
          </div>
        )}
      </div>
    </div>
  );
}

function formatResult(result: number | Record<string, number | string>) {
  if (typeof result === 'number') return result.toFixed(3);
  const priority = ['current', 'resistance', 'voltage', 'fallTime', 'clipsPickedUp', 'range', 'rate', 'temperature'];
  const entries = Object.entries(result);
  const leading = priority
    .map(key => entries.find(([entryKey]) => entryKey === key))
    .find(Boolean);
  const visible = leading ? [leading, ...entries.filter(([key]) => key !== leading[0]).slice(0, 2)] : entries.slice(0, 3);
  return visible.map(([key, value]) => `${key}: ${typeof value === 'number' ? Number(value).toFixed(3) : value}`).join(' · ');
}

function numericResultValue(result: number | Record<string, number | string>) {
  if (typeof result === 'number') return result;
  const preferred = ['current', 'resistance', 'fallTime', 'clipsPickedUp', 'range', 'rate', 'temperature'];
  for (const key of preferred) {
    const value = result[key];
    if (typeof value === 'number') return value;
  }
  const firstNumber = Object.values(result).find((value): value is number => typeof value === 'number');
  return firstNumber ?? null;
}

function formatAverage(observations: DataPoint[]) {
  const values = observations.map(o => numericResultValue(o.result)).filter((v): v is number => v !== null);
  if (!values.length) return 'N/A';
  return (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3);
}

function formatRange(observations: DataPoint[]) {
  const values = observations.map(o => numericResultValue(o.result)).filter((v): v is number => v !== null);
  if (!values.length) return 'N/A';
  return `${Math.min(...values).toFixed(2)} / ${Math.max(...values).toFixed(2)}`;
}
