
import React, { useState } from 'react';
import { RefreshCcw, User } from 'lucide-react';

const PunnettSquareSim: React.FC = () => {
    // State for parents: 'T' or 't'
    const [p1a1, setP1a1] = useState('T');
    const [p1a2, setP1a2] = useState('t');
    const [p2a1, setP2a1] = useState('t');
    const [p2a2, setP2a2] = useState('t');

    // Helper to calculate phenotype
    const getPhenotype = (g: string) => {
        if (g.includes('T')) return { text: 'Tall', color: 'bg-green-500', height: 'h-16' };
        return { text: 'Short', color: 'bg-green-300', height: 'h-8' };
    };

    // Calculate offspring genotypes
    const offspring = [
        p1a1 + p2a1,
        p1a1 + p2a2,
        p1a2 + p2a1,
        p1a2 + p2a2
    ].map(g => {
        // Normalize 'tT' to 'Tt'
        return g.charAt(0) === 't' && g.charAt(1) === 'T' ? 'Tt' : g;
    });

    const tallCount = offspring.filter(g => g.includes('T')).length;
    const shortCount = 4 - tallCount;

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Punnett Square Calculator</h3>

            {/* Controls */}
            <div className="flex justify-between mb-8 px-4">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 mb-2 uppercase font-bold">Parent 1 (Top)</span>
                    <div className="flex gap-2">
                        <button onClick={() => setP1a1(p1a1 === 'T' ? 't' : 'T')} className="w-10 h-10 rounded bg-slate-800 border border-slate-600 text-white font-mono font-bold text-xl">{p1a1}</button>
                        <button onClick={() => setP1a2(p1a2 === 'T' ? 't' : 'T')} className="w-10 h-10 rounded bg-slate-800 border border-slate-600 text-white font-mono font-bold text-xl">{p1a2}</button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 mb-2 uppercase font-bold">Parent 2 (Side)</span>
                    <div className="flex gap-2">
                        <button onClick={() => setP2a1(p2a1 === 'T' ? 't' : 'T')} className="w-10 h-10 rounded bg-slate-800 border border-slate-600 text-white font-mono font-bold text-xl">{p2a1}</button>
                        <button onClick={() => setP2a2(p2a2 === 'T' ? 't' : 'T')} className="w-10 h-10 rounded bg-slate-800 border border-slate-600 text-white font-mono font-bold text-xl">{p2a2}</button>
                    </div>
                </div>
            </div>

            {/* The Square */}
            <div className="flex-1 flex items-center justify-center mb-6">
                <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
                    {/* Header Row */}
                    <div></div>
                    <div className="text-center font-bold text-purple-400 text-xl bg-slate-800 rounded p-2">{p1a1}</div>
                    <div className="text-center font-bold text-purple-400 text-xl bg-slate-800 rounded p-2">{p1a2}</div>

                    {/* Row 1 */}
                    <div className="flex items-center justify-center font-bold text-cyan-400 text-xl bg-slate-800 rounded px-3">{p2a1}</div>
                    <div className="w-24 h-24 bg-slate-950 border border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 relative group">
                        <span className="text-lg font-mono font-bold text-white mb-1">{offspring[0]}</span>
                        <div className={`w-2 ${getPhenotype(offspring[0]).height} ${getPhenotype(offspring[0]).color} rounded-full`}></div>
                        <span className="text-[10px] text-slate-500 mt-1">{getPhenotype(offspring[0]).text}</span>
                    </div>
                    <div className="w-24 h-24 bg-slate-950 border border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 relative">
                        <span className="text-lg font-mono font-bold text-white mb-1">{offspring[1]}</span>
                        <div className={`w-2 ${getPhenotype(offspring[1]).height} ${getPhenotype(offspring[1]).color} rounded-full`}></div>
                        <span className="text-[10px] text-slate-500 mt-1">{getPhenotype(offspring[1]).text}</span>
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-center justify-center font-bold text-cyan-400 text-xl bg-slate-800 rounded px-3">{p2a2}</div>
                    <div className="w-24 h-24 bg-slate-950 border border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 relative">
                        <span className="text-lg font-mono font-bold text-white mb-1">{offspring[2]}</span>
                        <div className={`w-2 ${getPhenotype(offspring[2]).height} ${getPhenotype(offspring[2]).color} rounded-full`}></div>
                        <span className="text-[10px] text-slate-500 mt-1">{getPhenotype(offspring[2]).text}</span>
                    </div>
                    <div className="w-24 h-24 bg-slate-950 border border-slate-700 rounded-lg flex flex-col items-center justify-center p-2 relative">
                        <span className="text-lg font-mono font-bold text-white mb-1">{offspring[3]}</span>
                        <div className={`w-2 ${getPhenotype(offspring[3]).height} ${getPhenotype(offspring[3]).color} rounded-full`}></div>
                        <span className="text-[10px] text-slate-500 mt-1">{getPhenotype(offspring[3]).text}</span>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="bg-slate-800/50 rounded-xl p-4">
                <h4 className="text-xs text-slate-400 uppercase font-bold mb-3">Probability Results</h4>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-slate-300 mb-1">
                            <span>Tall (T_)</span>
                            <span>{tallCount * 25}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${tallCount * 25}%` }}></div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-slate-300 mb-1">
                            <span>Short (tt)</span>
                            <span>{shortCount * 25}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-300" style={{ width: `${shortCount * 25}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PunnettSquareSim;
