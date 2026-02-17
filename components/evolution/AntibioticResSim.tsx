
import React, { useState, useEffect } from 'react';
import { Pill, Skull, RefreshCcw } from 'lucide-react';

type Bacteria = { id: number, type: 'normal' | 'resistant', alive: boolean };

const AntibioticResSim: React.FC = () => {
    const [grid, setGrid] = useState<Bacteria[]>([]);
    const [isDosing, setIsDosing] = useState(false);
    const [round, setRound] = useState(0);

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        // Initial: mostly normal, 1 or 2 resistant mutations
        const newGrid: Bacteria[] = [];
        for (let i = 0; i < 25; i++) {
            newGrid.push({ 
                id: i, 
                type: Math.random() > 0.9 ? 'resistant' : 'normal', 
                alive: true 
            });
        }
        setGrid(newGrid);
        setRound(0);
    };

    const applyAntibiotic = () => {
        setIsDosing(true);
        setTimeout(() => {
            setGrid(prev => prev.map(b => {
                if (!b.alive) return b;
                // Normal bacteria die (90% chance), Resistant survive (90% chance)
                if (b.type === 'normal') return { ...b, alive: Math.random() > 0.9 };
                return b; 
            }));
            setIsDosing(false);
            setRound(r => r + 1);
        }, 1000);
    };

    const reproduce = () => {
        // Survivors fill dead spots
        const survivors = grid.filter(b => b.alive);
        if (survivors.length === 0) return; // Extinction

        setGrid(prev => prev.map(b => {
            if (b.alive) return b;
            // Dead spot gets filled by a random survivor copy
            const parent = survivors[Math.floor(Math.random() * survivors.length)];
            return { ...b, type: parent.type, alive: true };
        }));
    };

    const normalCount = grid.filter(b => b.alive && b.type === 'normal').length;
    const resistantCount = grid.filter(b => b.alive && b.type === 'resistant').length;

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Skull className="w-5 h-5 text-red-400" /> Bacterial Growth
                </h3>
                <div className="flex gap-4 text-xs font-bold">
                    <span className="text-green-400">Normal: {normalCount}</span>
                    <span className="text-red-400">Resistant: {resistantCount}</span>
                </div>
            </div>

            {/* Petri Dish Grid */}
            <div className="flex-1 flex items-center justify-center mb-6">
                <div className="grid grid-cols-5 gap-3 p-4 bg-slate-950 rounded-full border-4 border-slate-800 aspect-square max-h-[300px]">
                    {grid.map(b => (
                        <div 
                            key={b.id}
                            className={`w-10 h-10 rounded-full transition-all duration-500 ${
                                !b.alive ? 'bg-slate-900 border border-slate-800 scale-50' : 
                                b.type === 'resistant' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] border-2 border-white' : 
                                'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)]'
                            } ${isDosing && b.type === 'normal' && b.alive ? 'animate-pulse' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={applyAntibiotic}
                    disabled={isDosing || normalCount + resistantCount === 0}
                    className="py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Pill className="w-4 h-4" /> Add Antibiotic
                </button>
                <button 
                    onClick={reproduce}
                    disabled={isDosing || normalCount + resistantCount === 25 || normalCount + resistantCount === 0}
                    className="py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    Reproduce (24h)
                </button>
            </div>
            
            <button onClick={reset} className="mt-4 w-full text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1">
                <RefreshCcw className="w-3 h-3" /> Reset Experiment
            </button>
        </div>
    );
};

export default AntibioticResSim;
