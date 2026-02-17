
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Factory, Trees } from 'lucide-react';

interface Moth {
    id: number;
    type: 'light' | 'dark';
    x: number;
    y: number;
    alive: boolean;
}

const PepperedMothSim: React.FC = () => {
    const [pollution, setPollution] = useState(0); // 0 = clean, 100 = sooty
    const [moths, setMoths] = useState<Moth[]>([]);
    const [generation, setGeneration] = useState(1);
    const [history, setHistory] = useState<{gen: number, light: number, dark: number}[]>([]);
    const [gameActive, setGameActive] = useState(false);

    // Initialize moths
    useEffect(() => {
        spawnMoths(10, 10); // Equal start
    }, []);

    const spawnMoths = (lightCount: number, darkCount: number) => {
        const newMoths: Moth[] = [];
        let idCounter = Date.now();

        for (let i = 0; i < lightCount; i++) {
            newMoths.push({ id: idCounter++, type: 'light', x: Math.random() * 90, y: Math.random() * 80 + 10, alive: true });
        }
        for (let i = 0; i < darkCount; i++) {
            newMoths.push({ id: idCounter++, type: 'dark', x: Math.random() * 90, y: Math.random() * 80 + 10, alive: true });
        }
        setMoths(newMoths);
    };

    const handleEatMoth = (id: number) => {
        if (!gameActive) return;
        setMoths(prev => prev.map(m => m.id === id ? { ...m, alive: false } : m));
    };

    const nextGeneration = () => {
        const survivors = moths.filter(m => m.alive);
        const lightSurvivors = survivors.filter(m => m.type === 'light').length;
        const darkSurvivors = survivors.filter(m => m.type === 'dark').length;

        // Log history
        setHistory(prev => [...prev, { gen: generation, light: lightSurvivors, dark: darkSurvivors }]);

        // Reproduction: Each survivor has 2 offspring (simplified)
        // Population cap to prevent crash
        const nextLight = Math.min(lightSurvivors * 2, 20); 
        const nextDark = Math.min(darkSurvivors * 2, 20);

        // Mutate/Migrate: Ensure distinct populations don't hit 0 easily for demo
        const finalLight = nextLight === 0 && nextDark > 0 ? 1 : nextLight;
        const finalDark = nextDark === 0 && nextLight > 0 ? 1 : nextDark;

        spawnMoths(finalLight, finalDark);
        setGeneration(g => g + 1);
    };

    const reset = () => {
        setGeneration(1);
        setHistory([]);
        spawnMoths(10, 10);
        setGameActive(false);
    };

    // Calculate background color based on pollution
    // 0 = #d4d4d4 (light gray), 100 = #262626 (dark gray)
    const treeColor = `hsl(0, 0%, ${83 - (pollution * 0.6)}%)`; 

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Factory className={`w-5 h-5 ${pollution > 50 ? 'text-slate-400' : 'text-green-400'}`} />
                    Peppered Moth Sim
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    Gen: <span className="text-white font-mono font-bold text-lg">{generation}</span>
                </div>
            </div>

            {/* Simulation Area */}
            <div className="flex-1 relative rounded-xl overflow-hidden mb-6 border-4 border-slate-700 transition-colors duration-500"
                 style={{ backgroundColor: treeColor }}>
                
                {/* Tree Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}>
                </div>

                {!gameActive && moths.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                        <button 
                            onClick={() => setGameActive(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg animate-bounce"
                        >
                            Start Predation
                        </button>
                    </div>
                )}

                {moths.map(moth => (
                    <div
                        key={moth.id}
                        onClick={() => handleEatMoth(moth.id)}
                        className={`absolute w-8 h-8 cursor-pointer transition-transform duration-200 ${!moth.alive ? 'scale-0 opacity-0' : 'hover:scale-110'}`}
                        style={{ left: `${moth.x}%`, top: `${moth.y}%` }}
                    >
                        {/* Simple Moth SVG */}
                        <svg viewBox="0 0 100 100" className="drop-shadow-sm">
                            <path d="M 50,50 L 20,20 Q 10,50 20,80 Z" fill={moth.type === 'light' ? '#e5e5e5' : '#333'} />
                            <path d="M 50,50 L 80,20 Q 90,50 80,80 Z" fill={moth.type === 'light' ? '#e5e5e5' : '#333'} />
                            <ellipse cx="50" cy="50" rx="5" ry="30" fill="#222" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-2"><Trees className="w-4 h-4" /> Pollution Level</span>
                        <span>{pollution}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={pollution} 
                        onChange={(e) => setPollution(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                    />
                </div>

                {/* Graph (Simplified Bars) */}
                <div className="h-16 flex items-end gap-1 border-b border-l border-slate-700 pb-1 pl-1">
                    {history.slice(-10).map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                            <div style={{ height: `${h.dark * 2}%` }} className="bg-slate-500 w-full rounded-t-sm" title={`Dark: ${h.dark}`}></div>
                            <div style={{ height: `${h.light * 2}%` }} className="bg-slate-200 w-full rounded-t-sm" title={`Light: ${h.light}`}></div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={nextGeneration}
                        disabled={!gameActive}
                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-bold"
                    >
                        Next Generation
                    </button>
                    <button 
                        onClick={reset}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PepperedMothSim;
