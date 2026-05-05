import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Trash2, BarChart2, Clock } from 'lucide-react';

export interface DataRecord {
  id: string;
  timestamp: number;
  values: Record<string, number | string>;
}

interface DataRecorderProps {
  data: DataRecord[];
  onRecord: (values: Record<string, number | string>) => void;
  onClear: () => void;
  columns: { key: string; label: string; unit?: string }[];
  title?: string;
  maxRecords?: number;
}

export default function DataRecorder({
  data,
  onRecord,
  onClear,
  columns,
  title = 'Data Table',
  maxRecords = 20,
}: DataRecorderProps) {
  const [showTable, setShowTable] = useState(true);

  const handleExport = () => {
    if (data.length === 0) return;

    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(record => 
      columns.map(col => record.values[col.key]).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = columns.reduce((acc, col) => {
    const values = data
      .map(d => d.values[col.key])
      .filter((v): v is number => typeof v === 'number');
    
    if (values.length === 0) return acc;

    acc[col.key] = {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    };
    return acc;
  }, {} as Record<string, { min: number; max: number; avg: number; count: number }>);

  return (
    <div className="bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <BarChart2 size={18} className="text-brand-accent" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">
            {title}
          </span>
          <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
            {data.length} / {maxRecords}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            disabled={data.length === 0}
            className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleExport}
            disabled={data.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setShowTable(!showTable)}
            className="text-xs text-brand-accent hover:text-white transition-colors"
          >
            {showTable ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-x-auto"
          >
            {data.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="py-3 px-4 text-left text-slate-500 font-medium">
                      <Clock size={14} className="inline mr-1" />
                      Time
                    </th>
                    {columns.map(col => (
                      <th key={col.key} className="py-3 px-4 text-left text-slate-500 font-medium">
                        {col.label}
                        {col.unit && <span className="text-slate-600 ml-1">({col.unit})</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-10).reverse().map((record, idx) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-slate-800/50"
                    >
                      <td className="py-2 px-4 font-mono text-xs text-slate-500">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </td>
                      {columns.map(col => (
                        <td key={col.key} className="py-2 px-4 font-mono text-slate-300">
                          {typeof record.values[col.key] === 'number'
                            ? (record.values[col.key] as number).toFixed(2)
                            : record.values[col.key]}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No data recorded yet</p>
                <p className="text-xs text-slate-600 mt-1">Run the simulation to collect data</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {data.length > 0 && showTable && (
        <div className="p-4 border-t border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {columns.map(col => {
              const stat = stats[col.key];
              if (!stat) return null;

              return (
                <div key={col.key} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                    {col.label}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Min:</span>
                      <span className="text-slate-300 ml-1">{stat.min.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Max:</span>
                      <span className="text-slate-300 ml-1">{stat.max.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Avg:</span>
                      <span className="text-brand-accent ml-1">{stat.avg.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
