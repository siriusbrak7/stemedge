
import React, { useState, useEffect } from 'react';
import { Ruler, Clock, Play, Pause, RotateCcw } from 'lucide-react';

const PondweedSim: React.FC = () => {
    const [distance, setDistance] = useState(50); // cm
    const [bubbles, setBubbles] = useState<number[]>([]);
    const [count, setCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            // Physics: Rate is proportional to 1/distance^2 (Inverse Square Law)
            // Normalize for visual: 10cm = fast, 100cm = slow
            const rateFactor = 10000 / (distance * distance); // High number = fast
            const intervalMs = Math.max(100, 20000 / rateFactor); 

            interval = setInterval(() => {
                // Add bubble visual
                const id = Date.now();
                setBubbles(prev => [...prev, id]);
                setCount(prev => prev + 1);
                
                // Remove bubble after animation
                setTimeout(() => {
                    setBubbles(prev => prev.filter(b => b !== id));
                }, 2000);

                setTimer(t => t + (intervalMs/1000));
            }, intervalMs);
        }
        return () => clearInterval(interval);
    }, [isPlaying, distance]);

    const reset = () => {
        setIsPlaying(false);
        setCount(0);
        setTimer(0);
        setBubbles([]);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Virtual Pondweed Lab</h3>
            
            {/* Experiment Visual */}
            <div className="flex-1 bg-gradient-to-b from-sky-900/20 to-sky-900/50 rounded-xl relative overflow-hidden mb-6 border border-sky-500/20">
                {/* Water Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-sky-400/30"></div>
                
                {/* Beaker */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-48 border-l-2 border-r-2 border-b-2 border-white/20 rounded-b-xl bg-white/5 backdrop-blur-sm"></div>
                
                {/* Plant */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-32 flex flex-col items-center">
                    <div className="w-2 h-32 bg-green-700 rounded-full"></div>
                    <div className="absolute top-10 -left-6 w-8 h-4 bg-green-600 rounded-full -rotate-45"></div>
                    <div className="absolute top-20 -right-6 w-8 h-4 bg-green-600 rounded-full rotate-45"></div>
                </div>

                {/* Lamp */}
                <div 
                    className="absolute bottom-4 right-4 w-12 h-20 transition-all duration-500"
                    style={{ right: `${(distance / 100) * 80}%`, opacity: 1 - (distance/150) }}
                >
                    <div className="w-12 h-12 bg-yellow-200 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute top-2 left-2 w-8 h-16 bg-slate-400 rounded-t-full"></div>
                </div>

                {/* Bubbles */}
                {bubbles.map(id => (
                    <div 
                        key={id}
                        className="absolute w-3 h-3 bg-white/80 rounded-full left-1/2 animate-bubble"
                        style={{ bottom: '40px', marginLeft: (Math.random() * 20 - 10) + 'px' }}
                    />
                ))}
            </div>

            {/* Data Display */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-400 uppercase">Bubbles Counted</p>
                    <p className="text-2xl font-bold text-cyan-400 font-mono">{count}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-400 uppercase">Elapsed Time</p>
                    <p className="text-2xl font-bold text-white font-mono">{Math.floor(timer)}s</p>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-2"><Ruler className="w-4 h-4" /> Lamp Distance</span>
                        <span>{distance} cm</span>
                    </div>
                    <input 
                        type="range" min="10" max="100" 
                        value={distance} 
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isPlaying ? <><Pause className="w-4 h-4"/> Pause</> : <><Play className="w-4 h-4"/> Start</>}
                    </button>
                    <button 
                        onClick={reset}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PondweedSim;
