
import React, { useState } from 'react';
import { RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

type BeakType = 'crushing' | 'probing' | 'grasping';
type FoodType = 'seeds' | 'cactus' | 'insects';

const BEAK_INFO = {
    crushing: { name: 'Thick/Crushing', desc: 'Good for hard seeds', icon: '🔧' },
    probing: { name: 'Long/Probing', desc: 'Good for cactus flowers', icon: '🥢' },
    grasping: { name: 'Fine/Grasping', desc: 'Good for insects', icon: '🤏' }
};

const FOOD_INFO = {
    seeds: { name: 'Hard Seeds', icon: '🌰' },
    cactus: { name: 'Cactus Fruit', icon: '🌵' },
    insects: { name: 'Tiny Insects', icon: '🪰' }
};

const FinchBeakSim: React.FC = () => {
    const [beak, setBeak] = useState<BeakType>('crushing');
    const [food, setFood] = useState<FoodType>('seeds');
    const [result, setResult] = useState<{success: boolean, energy: number} | null>(null);

    const testFeeding = () => {
        let success = false;
        let energy = 0;

        // Logic table
        if (beak === 'crushing' && food === 'seeds') { success = true; energy = 100; }
        else if (beak === 'probing' && food === 'cactus') { success = true; energy = 90; }
        else if (beak === 'grasping' && food === 'insects') { success = true; energy = 95; }
        // Partial success scenarios
        else if (beak === 'crushing' && food === 'insects') { success = true; energy = 20; } // Too clumsy
        else if (beak === 'probing' && food === 'insects') { success = true; energy = 40; } 
        else { success = false; energy = 0; } // Total fail (e.g. grasping vs hard seed)

        setResult({ success, energy });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Darwin's Beak Adapter</h3>

            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Beak Selector */}
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Select Beak Adaptation</p>
                    <div className="space-y-2">
                        {(Object.keys(BEAK_INFO) as BeakType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => { setBeak(type); setResult(null); }}
                                className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                    beak === type 
                                        ? 'bg-purple-900/30 border-purple-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-2xl">{BEAK_INFO[type].icon}</span>
                                <div className="text-left">
                                    <div className="font-bold text-sm">{BEAK_INFO[type].name}</div>
                                    <div className="text-[10px] opacity-70">{BEAK_INFO[type].desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Food Selector */}
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Select Available Food</p>
                    <div className="grid grid-cols-1 gap-2">
                        {(Object.keys(FOOD_INFO) as FoodType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => { setFood(type); setResult(null); }}
                                className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                    food === type 
                                        ? 'bg-amber-900/30 border-amber-500 text-white' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                <span className="text-2xl">{FOOD_INFO[type].icon}</span>
                                <div className="font-bold text-sm">{FOOD_INFO[type].name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
                {!result ? (
                    <button 
                        onClick={testFeeding}
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        Attempt Feeding
                    </button>
                ) : (
                    <div className="text-center animate-fade-in-up">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            result.success && result.energy > 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                            {result.success && result.energy > 50 ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1">
                            {result.energy > 80 ? 'Thriving!' : result.energy > 0 ? 'Struggling...' : 'Starvation'}
                        </h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Energy Gained: {result.energy}%
                        </p>
                        <button 
                            onClick={() => setResult(null)}
                            className="text-sm text-slate-500 hover:text-white flex items-center gap-1 mx-auto"
                        >
                            <RefreshCcw className="w-3 h-3" /> Try Another Combination
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinchBeakSim;
