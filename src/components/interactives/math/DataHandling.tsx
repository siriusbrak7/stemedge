import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, Calculator, BookOpen, Trophy, CheckCircle2, XCircle, RotateCcw, ChevronDown, Plus, Trash2, Shuffle } from 'lucide-react';
import QuizMode, { type QuizQuestion } from '../../shared/QuizMode';

type Mode = 'histogram' | 'pie' | 'cumulative' | 'statistics' | 'applications' | 'quiz';

interface DataPoint { label: string; value: number; }

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'dh-q1', question: 'What is the mean of the data set: 4, 7, 9, 6, 5?', type: 'multiple-choice', options: ['6.2', '6.0', '5.8', '7.0'], correctAnswer: '6.2', explanation: 'Mean = (4+7+9+6+5)/5 = 31/5 = 6.2.' },
  { id: 'dh-q2', question: 'What is the median of: 3, 7, 1, 9, 5?', type: 'multiple-choice', options: ['5', '7', '3', '1'], correctAnswer: '5', explanation: 'Ordered: 1, 3, 5, 7, 9. Median (middle value) = 5.' },
  { id: 'dh-q3', question: 'What is the mode of: 2, 4, 4, 6, 8?', type: 'multiple-choice', options: ['4', '4.8', '6', '2'], correctAnswer: '4', explanation: 'Mode is the most frequent value. 4 appears twice.' },
  { id: 'dh-q4', question: 'The range of data 12, 8, 15, 6, 20 is:', type: 'multiple-choice', options: ['14', '12', '8', '20'], correctAnswer: '14', explanation: 'Range = max − min = 20 − 6 = 14.' },
  { id: 'dh-q5', question: 'In a grouped frequency table, the class interval 10–20 has a midpoint of:', type: 'multiple-choice', options: ['15', '10', '20', '30'], correctAnswer: '15', explanation: 'Midpoint = (lower + upper) / 2 = (10 + 20) / 2 = 15.' },
  { id: 'dh-q6', question: 'A WAEC question: Find the mean of 5, 8, 12, 15, 20.', type: 'multiple-choice', options: ['12', '10', '15', '13'], correctAnswer: '12', explanation: 'Mean = (5+8+12+15+20)/5 = 60/5 = 12.' },
  { id: 'dh-q7', question: 'Which measure of central tendency is most affected by outliers?', type: 'multiple-choice', options: ['Mean', 'Median', 'Mode', 'None'], correctAnswer: 'Mean', explanation: 'The mean uses all values, so extreme outliers shift it significantly. Median and mode are more resistant.' },
  { id: 'dh-q8', question: 'A cumulative frequency curve (ogive) is used to find:', type: 'multiple-choice', options: ['The median and quartiles', 'The mode', 'The range only', 'The standard deviation'], correctAnswer: 'The median and quartiles', explanation: 'The ogive shows cumulative totals, allowing you to read off median (50th percentile) and quartiles.' },
];

const APPS = [
  { title: 'WAEC Exam Scores Analysis', icon: '📝', desc: 'A WAEC class of 30 students scored: 5 got 40-50%, 8 got 50-60%, 10 got 60-70%, 5 got 70-80%, 2 got 80-90%. Calculate the mean and median class.', steps: ['1. Calculate midpoints: 45, 55, 65, 75, 85.', '2. Mean = Σ(f×x) / Σf = (5×45 + 8×55 + 10×65 + 5×75 + 2×85) / 30 = 1925 / 30 ≈ 64.2%.', '3. Median class: N/2 = 15th value → falls in 60-70% class (cumulative freq reaches 23).', '4. Median ≈ L + [(N/2 − cf)/f] × h = 60 + [(15−13)/10] × 10 = 62%.'] },
  { title: 'Rainfall Data in Tamale', icon: '🌧️', desc: 'Monthly rainfall (mm) in Tamale: Jan 5, Feb 10, Mar 40, Apr 80, May 120, Jun 140, Jul 180, Aug 200, Sep 160, Oct 80, Nov 20, Dec 5. Create a cumulative frequency chart.', steps: ['1. Sort data: 5, 5, 10, 20, 40, 80, 80, 120, 140, 160, 180, 200.', '2. Cumulative: 5, 10, 20, 40, 80, 160, 240, 360, 500, 660, 820, 1040 mm.', '3. The curve shows most rain falls June-September (major season).', '4. Total annual = 1040 mm. Mean monthly ≈ 86.7 mm.'] },
  { title: 'Market Price Survey', icon: '📊', desc: 'At Kejetia Market in Kumasi, 10 sellers price tomatoes per kg: 8, 10, 10, 12, 12, 12, 14, 15, 18, 20 GHS. Find mean, median, and mode.', steps: ['1. Mean = (8+10+10+12+12+12+14+15+18+20)/10 = 131/10 = 13.1 GHS.', '2. Median = average of 5th and 6th values = (12+12)/2 = 12 GHS.', '3. Mode = 12 GHS (appears 3 times).', '4. Mean is pulled up by 18 and 20 GHS sellers. Median (12) better represents the typical price.'] },
];

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'histogram', label: 'Histogram', icon: <BarChart3 size={14} /> },
  { id: 'pie', label: 'Pie Chart', icon: <PieChart size={14} /> },
  { id: 'cumulative', label: 'Ogive', icon: <TrendingUp size={14} /> },
  { id: 'statistics', label: 'Statistics', icon: <Calculator size={14} /> },
  { id: 'applications', label: 'Ghana Apps', icon: <BookOpen size={14} /> },
  { id: 'quiz', label: 'Quiz', icon: <Trophy size={14} /> },
];

const COLORS = ['#22d3ee', '#f59e0b', '#a78bfa', '#f472b6', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#6366f1', '#84cc16'];

export default function DataHandling() {
  const [mode, setMode] = useState<Mode>('histogram');
  const [data, setData] = useState<DataPoint[]>([
    { label: 'A', value: 12 }, { label: 'B', value: 18 }, { label: 'C', value: 7 },
    { label: 'D', value: 25 }, { label: 'E', value: 15 }, { label: 'F', value: 10 },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const addPoint = () => {
    if (!newLabel || !newValue) return;
    setData(prev => [...prev, { label: newLabel, value: Number(newValue) }]);
    setNewLabel('');
    setNewValue('');
  };

  const removePoint = (idx: number) => {
    setData(prev => prev.filter((_, i) => i !== idx));
  };

  const randomData = () => {
    const n = 5 + Math.floor(Math.random() * 4);
    const labels = 'ABCDEFGHIJ'.split('');
    setData(Array.from({ length: n }, (_, i) => ({
      label: labels[i],
      value: Math.floor(Math.random() * 40) + 5,
    })));
  };

  const stats = useMemo(() => {
    if (data.length === 0) return { mean: 0, median: 0, mode: '—', range: 0, sum: 0, count: 0 };
    const vals = data.map(d => d.value).sort((a, b) => a - b);
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / vals.length;
    const mid = Math.floor(vals.length / 2);
    const median = vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];
    const freq: Record<number, number> = {};
    vals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modeVals = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([v]) => v);
    const mode = maxFreq === 1 ? 'No mode' : modeVals.join(', ');
    const range = vals[vals.length - 1] - vals[0];
    return { mean, median, mode: String(mode), range, sum, count: vals.length };
  }, [data]);

  return (
    <div className="flex min-h-[600px] w-full flex-col gap-4 rounded-[2rem] border border-slate-800 bg-[#06090f] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white">Data <span className="text-brand-accent font-medium">Handling</span></h2>
          <p className="text-xs text-slate-500 mt-1">Histograms, pie charts, ogives, and statistical measures</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === m.id ? 'bg-brand-accent text-black' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
            {m.icon}{m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'histogram' && <div key="hist"><HistogramMode data={data} /></div>}
        {mode === 'pie' && <div key="pie"><PieMode data={data} /></div>}
        {mode === 'cumulative' && <div key="cum"><CumulativeMode data={data} /></div>}
        {mode === 'statistics' && <div key="stats"><StatisticsMode data={data} stats={stats} /></div>}
        {mode === 'applications' && <div key="apps"><ApplicationsMode /></div>}
        {mode === 'quiz' && <div key="quiz"><QuizMode questions={QUIZ_QUESTIONS} title="Data Handling Quiz" /></div>}
      </AnimatePresence>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Data Editor</div>
          <button onClick={randomData} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
            <Shuffle size={12} /> Random
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
            className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono" />
          <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value"
            className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono" />
          <button onClick={addPoint} className="px-3 py-2 bg-brand-accent text-black rounded-xl font-bold text-xs hover:bg-white transition-all">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1 bg-black/30 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-white font-mono">{d.label}: {d.value}</span>
              <button onClick={() => removePoint(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-3 text-xs text-slate-400">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-[9px]">Exam Note · WAEC / Cambridge · </span>
        Mean = Σx / n. Median = middle value when ordered. Mode = most frequent. Range = max − min. For grouped data use midpoints. Ogive = cumulative frequency curve for finding median and quartiles.
      </div>
    </div>
  );
}

function HistogramMode({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 380;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const pad = 50;
    const barW = (W - pad * 2) / data.length;
    const chartH = H - pad * 2;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad + (chartH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal / 5) * i).toString(), pad - 6, y + 3);
    }

    data.forEach((d, i) => {
      const x = pad + i * barW;
      const barH = (d.value / maxVal) * chartH;
      const y = pad + chartH - barH;

      const grad = ctx.createLinearGradient(x, y, x, pad + chartH);
      grad.addColorStop(0, COLORS[i % COLORS.length] + 'cc');
      grad.addColorStop(1, COLORS[i % COLORS.length] + '44');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 4, y, barW - 8, barH);

      ctx.strokeStyle = COLORS[i % COLORS.length];
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y, barW - 8, barH);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(d.value), x + barW / 2, y - 8);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px sans-serif';
      ctx.fillText(d.label, x + barW / 2, pad + chartH + 18);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Histogram', W / 2, 24);
  }, [data, maxVal]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
      <canvas ref={canvasRef} width={500} height={380} className="w-full rounded-xl" />
    </div>
  );
}

function PieMode({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 380;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const cx = 220, cy = H / 2, R = 140;
    let startAngle = -Math.PI / 2;

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length] + 'cc';
      ctx.fill();
      ctx.strokeStyle = '#06090f';
      ctx.lineWidth = 2;
      ctx.stroke();

      const midAngle = startAngle + sliceAngle / 2;
      const labelR = R * 0.65;
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);
      const pct = ((d.value / total) * 100).toFixed(1);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      if (sliceAngle > 0.3) {
        ctx.fillText(`${pct}%`, lx, ly + 4);
      }

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.fillStyle = '#06090f';
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Total', cx, cy - 4);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(String(total), cx, cy + 12);

    let ly = 40;
    data.forEach((d, i) => {
      const pct = ((d.value / total) * 100).toFixed(1);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(400, ly, 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${d.label}: ${d.value} (${pct}%)`, 418, ly + 10);
      ly += 22;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Pie Chart', cx, 24);
  }, [data, total]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
      <canvas ref={canvasRef} width={500} height={380} className="w-full rounded-xl" />
    </div>
  );
}

function CumulativeMode({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const cumulative = sorted.reduce<number[]>((acc, d, i) => {
    acc.push((acc[i - 1] || 0) + d.value);
    return acc;
  }, []);
  const maxCum = cumulative[cumulative.length - 1] || 1;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 500, H = 380;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    const pad = 50;
    const chartW = W - pad * 2;
    const chartH = H - pad * 2;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad + (chartH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxCum - (maxCum / 5) * i).toString(), pad - 6, y + 3);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();

    if (cumulative.length > 0) {
      ctx.beginPath();
      ctx.moveTo(pad, H - pad);
      cumulative.forEach((val, i) => {
        const x = pad + (i / Math.max(1, cumulative.length - 1)) * chartW;
        const y = pad + chartH - (val / maxCum) * chartH;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(pad + chartW, H - pad);
      ctx.closePath();
      ctx.fillStyle = 'rgba(167,139,250,0.1)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pad, H - pad);
      cumulative.forEach((val, i) => {
        const x = pad + (i / Math.max(1, cumulative.length - 1)) * chartW;
        const y = pad + chartH - (val / maxCum) * chartH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      cumulative.forEach((val, i) => {
        const x = pad + (i / Math.max(1, cumulative.length - 1)) * chartW;
        const y = pad + chartH - (val / maxCum) * chartH;
        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sorted[i].label, x, H - pad + 18);
      });

      const medianY = pad + chartH - (maxCum / 2 / maxCum) * chartH;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad, medianY);
      ctx.lineTo(W - pad, medianY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#22c55e';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Median (50th %ile)', pad + 4, medianY - 6);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Cumulative Frequency (Ogive)', W / 2, 24);
  }, [sorted, cumulative, maxCum]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-[#07111c] p-4">
      <canvas ref={canvasRef} width={500} height={380} className="w-full rounded-xl" />
    </div>
  );
}

function StatisticsMode({ data, stats }: { data: DataPoint[]; stats: { mean: number; median: number; mode: string; range: number; sum: number; count: number } }) {
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [score, setScore] = useState(0);
  const [challengeType, setChallengeType] = useState<'mean' | 'median' | 'range'>('mean');

  const correctAnswer = challengeType === 'mean' ? stats.mean : challengeType === 'median' ? stats.median : stats.range;

  const check = () => {
    const num = parseFloat(challengeAnswer);
    if (isNaN(num)) return;
    const diff = Math.abs(num - correctAnswer);
    if (diff < 0.5) {
      setFeedback({ correct: true, msg: `Correct! ${challengeType} = ${correctAnswer.toFixed(2)}` });
      setScore(s => s + 1);
    } else {
      setFeedback({ correct: false, msg: `Not quite. ${challengeType} = ${correctAnswer.toFixed(2)}` });
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-6 space-y-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-2">Summary Statistics</div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Count (n)" value={String(stats.count)} color="text-cyan-400" />
          <StatCard label="Sum (Σx)" value={String(stats.sum)} color="text-blue-400" />
          <StatCard label="Mean (x̄)" value={stats.mean.toFixed(2)} color="text-yellow-400" />
          <StatCard label="Median" value={stats.median.toFixed(2)} color="text-purple-400" />
          <StatCard label="Mode" value={stats.mode} color="text-pink-400" />
          <StatCard label="Range" value={String(stats.range)} color="text-green-400" />
        </div>

        <div className="bg-black/30 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1 font-mono">
          <p><strong className="text-white">Sorted values:</strong> {[...data].sort((a, b) => a.value - b.value).map(d => d.value).join(', ')}</p>
          <p><strong className="text-yellow-400">Mean formula:</strong> x̄ = Σx / n = {stats.sum} / {stats.count} = {stats.mean.toFixed(2)}</p>
          <p><strong className="text-purple-400">Median:</strong> Middle value of sorted data = {stats.median.toFixed(2)}</p>
          <p><strong className="text-green-400">Range:</strong> max − min = {Math.max(...data.map(d => d.value))} − {Math.min(...data.map(d => d.value))} = {stats.range}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-3">Challenge</div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              {(['mean', 'median', 'range'] as const).map(t => (
                <button key={t} onClick={() => { setChallengeType(t); setFeedback(null); setChallengeAnswer(''); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${challengeType === t ? 'bg-brand-accent text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <Trophy size={14} className="text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm font-bold">{score}</span>
            </div>
          </div>
          <p className="text-sm text-white mb-3">Calculate the <strong>{challengeType}</strong> of the current dataset.</p>
          <div className="flex gap-2">
            <input type="number" step="0.01" value={challengeAnswer} onChange={e => setChallengeAnswer(e.target.value)}
              disabled={!!feedback} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm disabled:opacity-50" />
            <button onClick={check} disabled={!!feedback || !challengeAnswer}
              className="px-4 py-2 bg-brand-accent text-black rounded-xl font-bold text-xs disabled:opacity-30">Check</button>
          </div>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-xl border p-3 text-xs ${feedback.correct ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {feedback.correct ? <CheckCircle2 size={14} className="inline mr-1" /> : <XCircle size={14} className="inline mr-1" />}
              {feedback.msg}
            </motion.div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400">
          <strong className="text-white">Key Formulas:</strong><br />
          Mean = Σx / n<br />
          Median = middle value (or avg of two middle values)<br />
          Mode = most frequent value<br />
          Range = maximum − minimum
        </div>
      </div>
    </div>
  );
}

function ApplicationsMode() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white">Data Handling in Ghana</h3>
        <p className="text-xs text-slate-500">Real statistical analysis from West African contexts</p>
      </div>
      {APPS.map((app, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 overflow-hidden">
          <button onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full p-5 text-left flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              <div>
                <div className="text-sm font-bold text-white">{app.title}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">{app.desc}</div>
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${expanded === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-800">
                <div className="p-5 space-y-2">
                  <p className="text-sm text-slate-300">{app.desc}</p>
                  {app.steps.map((step, si) => (
                    <motion.div key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.12 }}
                      className="text-sm text-slate-400 bg-black/30 rounded-xl p-3 font-mono">
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
