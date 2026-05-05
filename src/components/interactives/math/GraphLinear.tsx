import { useState } from 'react';
import { Eye, GraduationCap, Target, Ruler } from 'lucide-react';

type ViewMode = 'explore' | 'challenge' | 'learn';

export default function GraphLinear() {
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [showRiseRun, setShowRiseRun] = useState(true);
  const [challengeMode, setChallengeMode] = useState(false);
  const [targetM, setTargetM] = useState(2);
  const [targetC, setTargetC] = useState(3);

  const width = 300;
  const height = 300;
  const center = width / 2;
  const scale = 15;

  const getLinePts = () => {
    const x1 = -10;
    const y1 = m * x1 + c;
    const svgX1 = center + x1 * scale;
    const svgY1 = center - y1 * scale;
    const x2 = 10;
    const y2 = m * x2 + c;
    const svgX2 = center + x2 * scale;
    const svgY2 = center - y2 * scale;
    return { x1: svgX1, y1: svgY1, x2: svgX2, y2: svgY2 };
  };

  const line = getLinePts();
  const yIntY = center - c * scale;

  const isChallengeComplete = m === targetM && c === targetC;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 gap-6">
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <button onClick={() => setViewMode('explore')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'explore' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Eye size={14} /> Explore
        </button>
        <button onClick={() => { setViewMode('challenge'); setChallengeMode(true); setTargetM(Math.floor(Math.random() * 5) - 2); setTargetC(Math.floor(Math.random() * 7) - 3); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'challenge' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <Target size={14} /> Challenge
        </button>
        <button onClick={() => setViewMode('learn')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'learn' ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
          <GraduationCap size={14} /> Learn
        </button>
      </div>

      <div className="w-full max-w-2xl bg-slate-900/50 p-6 rounded-2xl border border-brand-border flex gap-8 z-50 mt-8">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <span>Gradient (m)</span>
            <span className="text-cyan-400 text-sm font-mono">{m}</span>
          </div>
          <input type="range" min="-5" max="5" step="0.5" value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="w-full accent-cyan-500" />
        </div>
        <div className="w-px bg-slate-700"></div>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <span>y-intercept (c)</span>
            <span className="text-pink-400 text-sm font-mono">{c > 0 ? `+${c}` : c}</span>
          </div>
          <input type="range" min="-8" max="8" step="1" value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full accent-pink-500" />
        </div>
      </div>

      {challengeMode && (
        <div className="w-full max-w-2xl bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
          <span className="text-orange-400 text-sm font-bold">
            Match: y = <span className="text-cyan-400">{targetM === 1 ? '' : targetM === -1 ? '-' : targetM}x</span>
            <span className="text-pink-400"> {targetC === 0 ? '' : targetC > 0 ? `+ ${targetC}` : `- ${Math.abs(targetC)}`}</span>
          </span>
          {isChallengeComplete && (
            <span className="ml-4 text-green-400 font-bold">✓ Matched!</span>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Equation</h3>
          <div className="text-4xl md:text-5xl font-mono font-black text-white bg-black/50 p-6 rounded-2xl border border-brand-border shadow-xl">
            y = <span className="text-cyan-400">{m === 1 ? '' : m === -1 ? '-' : m}x</span>
            <span className="text-pink-400"> {c === 0 ? '' : c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`}</span>
          </div>

          {viewMode !== 'challenge' && (
            <button
              onClick={() => setShowRiseRun(!showRiseRun)}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${showRiseRun ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-slate-800 text-slate-400'}`}
            >
              <Ruler size={14} />
              Rise/Run Triangle
            </button>
          )}
        </div>

        <div className="relative bg-slate-900 border-2 border-brand-border rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <svg width={width} height={height} className="bg-black rounded-lg">
            <defs>
              <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line x1="0" y1={center} x2={width} y2={center} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1={center} y1="0" x2={center} y2={height} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#22d3ee" strokeWidth="3" style={{ transition: 'all 0.1s ease-out' }} />

            <circle cx={center} cy={yIntY} r="5" fill="#ec4899" style={{ transition: 'all 0.1s ease-out' }} />

            {showRiseRun && m !== 0 && (
              <path d={`M ${center} ${yIntY} L ${center + scale} ${yIntY} L ${center + scale} ${yIntY - m * scale}`} fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4" style={{ transition: 'all 0.1s ease-out' }} />
            )}

            {showRiseRun && m !== 0 && (
              <>
                <text x={center + scale / 2} y={yIntY + 15} fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace">1</text>
                <text x={center + scale + 15} y={yIntY - (m * scale) / 2} fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace">{m}</text>
              </>
            )}
          </svg>
          <span className="absolute top-2 left-1/2 ml-2 text-[10px] text-slate-500 font-bold">y</span>
          <span className="absolute top-1/2 right-2 mt-2 text-[10px] text-slate-500 font-bold">x</span>
        </div>
      </div>

      {viewMode === 'learn' && (
        <div className="mt-4 max-w-lg space-y-3">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Gradient (m)</h4>
            <p className="text-slate-300 text-sm">The gradient (slope) tells you how steep the line is. m = rise/run = change in y / change in x. Positive m slopes upward, negative m slopes downward.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Y-intercept (c)</h4>
            <p className="text-slate-300 text-sm">The y-intercept is where the line crosses the y-axis (when x = 0). It represents the starting value in real-world contexts.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Rise/Run Triangle</h4>
            <p className="text-slate-300 text-sm">The orange dashed triangle shows rise (vertical change) and run (horizontal change). Gradient = rise / run. Toggle it above the graph!</p>
          </div>
        </div>
      )}
    </div>
  );
}
