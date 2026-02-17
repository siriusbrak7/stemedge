
import React, { useState, useEffect } from 'react';
import { Dna, RefreshCcw, Check } from 'lucide-react';

const BASES = ['A', 'T', 'C', 'G'];
const PAIRS: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
const COLORS: Record<string, string> = { 
    'A': 'bg-red-500', 
    'T': 'bg-blue-500', 
    'C': 'bg-green-500', 
    'G': 'bg-yellow-500' 
};

const DNABuilder: React.FC = () => {
    const [templateStrand, setTemplateStrand] = useState<string[]>([]);
    const [userStrand, setUserStrand] = useState<(string | null)[]>([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        // Generate random sequence of 10 bases
        const newStrand = Array.from({ length: 8 }, () => BASES[Math.floor(Math.random() * BASES.length)]);
        setTemplateStrand(newStrand);
        setUserStrand(new Array(8).fill(null));
        setCompleted(false);
    };

    const handleBaseClick = (base: string) => {
        if (completed) return;
        
        const nextIndex = userStrand.findIndex(b => b === null);
        if (nextIndex === -1) return;

        // Check if correct pairing
        const correctBase = PAIRS[templateStrand[nextIndex]];
        
        if (base === correctBase) {
            const newUserStrand = [...userStrand];
            newUserStrand[nextIndex] = base;
            setUserStrand(newUserStrand);

            if (nextIndex === templateStrand.length - 1) {
                setCompleted(true);
            }
        } else {
            // Shake effect could go here
            const btn = document.getElementById(`btn-${base}`);
            if (btn) {
                btn.classList.add('animate-shake');
                setTimeout(() => btn.classList.remove('animate-shake'), 500);
            }
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-cyan-400" /> DNA Replication
                </h3>
                <button onClick={reset} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                    <RefreshCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-950 rounded-xl overflow-hidden mb-6 p-4">
                {/* Visualization of the helix strips */}
                <div className="flex gap-2 h-full items-center">
                    {/* Left Strand (Template) */}
                    <div className="flex flex-col gap-2">
                        {templateStrand.map((base, i) => (
                            <div key={`t-${i}`} className={`w-12 h-12 ${COLORS[base]} rounded-l-lg flex items-center justify-center text-white font-bold border-r-2 border-black/20 shadow-lg relative`}>
                                {base}
                                <div className="absolute right-0 top-1/2 w-4 h-0.5 bg-white/50 -mr-4"></div>
                            </div>
                        ))}
                    </div>

                    {/* Connection Animation Area */}
                    <div className="w-8"></div>

                    {/* Right Strand (User Input) */}
                    <div className="flex flex-col gap-2">
                        {userStrand.map((base, i) => (
                            <div 
                                key={`u-${i}`} 
                                className={`w-12 h-12 rounded-r-lg flex items-center justify-center text-white font-bold border-l-2 border-black/20 shadow-lg transition-all duration-300 ${base ? COLORS[base] : 'bg-slate-800 border-dashed border-slate-600'}`}
                            >
                                {base || '?'}
                            </div>
                        ))}
                    </div>
                </div>
                
                {completed && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm animate-fade-in">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-green-500/50 text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Sequence Complete!</h4>
                            <p className="text-slate-400 text-sm mb-4">Double helix formed successfully.</p>
                            <button onClick={reset} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold">
                                Build Another
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4">
                {BASES.map(base => (
                    <button
                        key={base}
                        id={`btn-${base}`}
                        onClick={() => handleBaseClick(base)}
                        className={`py-4 rounded-xl font-bold text-2xl text-white shadow-lg transition-transform active:scale-95 hover:-translate-y-1 ${COLORS[base]}`}
                    >
                        {base}
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">Match the base pairs: A ↔ T, C ↔ G</p>
        </div>
    );
};

export default DNABuilder;
