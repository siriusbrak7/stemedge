
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCcw, Activity } from 'lucide-react';

const EcosystemSim: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [rabbits, setRabbits] = useState(40);
    const [foxes, setFoxes] = useState(10);
    const [history, setHistory] = useState<{t: number, r: number, f: number}[]>([{t: 0, r: 40, f: 10}]);

    useEffect(() => {
        let interval: any;
        if (playing) {
            interval = setInterval(() => {
                setHistory(prev => {
                    const last = prev[prev.length - 1];
                    
                    // Lotka-Volterra simplified
                    // dr/dt = alpha*r - beta*r*f
                    // df/dt = delta*r*f - gamma*f
                    
                    const alpha = 0.1; // Rabbit growth rate
                    const beta = 0.005; // Rabbit predation rate
                    const delta = 0.002; // Fox reproduction rate per rabbit eaten
                    const gamma = 0.08; // Fox death rate

                    const dr = (alpha * last.r) - (beta * last.r * last.f);
                    const df = (delta * last.r * last.f) - (gamma * last.f);

                    const newR = Math.max(0, last.r + dr);
                    const newF = Math.max(0, last.f + df);

                    // Add some noise/cap
                    const cappedR = Math.min(newR, 200);
                    
                    if (prev.length > 50) prev.shift(); // Keep window moving
                    return [...prev, { t: last.t + 1, r: cappedR, f: newF }];
                });
                setTime(t => t + 1);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [playing]);

    const reset = () => {
        setPlaying(false);
        setTime(0);
        setRabbits(40);
        setFoxes(10);
        setHistory([{t: 0, r: 40, f: 10}]);
    };

    // Calculate chart points
    const maxVal = 200;
    const width = 100; // %

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" /> Population Dynamics
            </h3>

            {/* Graph Area */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden mb-6 p-4">
                <div className="absolute inset-0 flex items-end px-4 pb-4 gap-1">
                    {history.map((pt, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full gap-0.5 relative">
                            {/* Rabbit Bar (Green) */}
                            <div 
                                className="w-full bg-green-500/50 rounded-t-sm absolute bottom-0"
                                style={{ height: `${(pt.r / maxVal) * 100}%` }}
                            />
                            {/* Fox Bar (Orange) - overlaid with opacity */}
                            <div 
                                className="w-full bg-orange-500/50 rounded-t-sm absolute bottom-0"
                                style={{ height: `${(pt.f / maxVal) * 100}%` }}
                            />
                        </div>
                    ))}
                </div>
                {/* Legend */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-slate-900/80 p-2 rounded-lg backdrop-blur text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                        <span className="text-slate-300">Prey (Rabbits): {Math.round(history[history.length-1].r)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                        <span className="text-slate-300">Predator (Foxes): {Math.round(history[history.length-1].f)}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center">
                <button 
                    onClick={() => setPlaying(!playing)}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                        playing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                >
                    {playing ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Simulate</>}
                </button>
                <button 
                    onClick={reset}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
                Observe how the predator population lags behind the prey population.
            </p>
        </div>
    );
};

export default EcosystemSim;
