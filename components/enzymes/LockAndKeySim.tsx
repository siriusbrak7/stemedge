
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';

const LockAndKeySim: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [reactionCount, setReactionCount] = useState(0);
    const [substrates, setSubstrates] = useState<{id: number, type: 'correct' | 'wrong', x: number, y: number, status: 'moving' | 'bound' | 'product'}[]>([]);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                // 1. Spawn new substrates occasionally
                if (Math.random() > 0.9) {
                    setSubstrates(prev => [
                        ...prev, 
                        {
                            id: Date.now(), 
                            type: Math.random() > 0.3 ? 'correct' : 'wrong',
                            x: 0, 
                            y: 40 + Math.random() * 20, 
                            status: 'moving'
                        }
                    ]);
                }

                // 2. Move substrates
                setSubstrates(prev => prev.map(s => {
                    // If moving, go right
                    if (s.status === 'moving') {
                        const newX = s.x + 2;
                        
                        // Collision with Active Site (approx x=50%)
                        if (newX > 45 && newX < 55) {
                            if (s.type === 'correct') {
                                setReactionCount(c => c + 1);
                                return { ...s, x: newX, status: 'product' }; // Flash to product
                            } else {
                                // Bounce wrong ones
                                return { ...s, x: newX, y: s.y + (Math.random() > 0.5 ? 20 : -20), status: 'moving' }; // Deflect
                            }
                        }
                        
                        // Remove if off screen
                        if (newX > 100) return null; 
                        
                        return { ...s, x: newX };
                    }
                    
                    // Products move away faster
                    if (s.status === 'product') {
                        const newX = s.x + 4;
                        if (newX > 100) return null;
                        return { ...s, x: newX };
                    }

                    return s;
                }).filter(Boolean) as any);

            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Molecular View
            </h3>

            {/* Simulation Canvas */}
            <div className="flex-1 bg-slate-950 rounded-xl relative overflow-hidden mb-6 border border-slate-800">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* The Enzyme */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                        {/* Pacman shape enzyme */}
                        <path d="M 50,50 L 90,20 A 50,50 0 1,0 90,80 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                        <circle cx="35" cy="35" r="5" fill="rgba(255,255,255,0.2)" />
                        {/* Active Site Highlight */}
                        <path d="M 50,50 L 90,20 L 90,80 Z" fill="rgba(0,0,0,0.2)" />
                    </svg>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-400">ENZYME</div>
                </div>

                {/* Moving Substrates */}
                {substrates.map(s => (
                    <div 
                        key={s.id}
                        className="absolute w-8 h-8 transition-all duration-75"
                        style={{ 
                            left: `${s.x}%`, 
                            top: `${s.y}%`,
                            opacity: s.status === 'product' ? 0.6 : 1
                        }}
                    >
                        {s.status === 'product' ? (
                            // Split product
                            <div className="flex flex-col gap-1 animate-pulse">
                                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                            </div>
                        ) : s.type === 'correct' ? (
                            // Correct Triangle Shape
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-green-500 border-b-[10px] border-b-transparent"></div>
                        ) : (
                            // Wrong Square Shape
                            <div className="w-6 h-6 bg-red-500 rounded-sm rotate-45 border-2 border-red-700"></div>
                        )}
                    </div>
                ))}

                {/* Label Overlay */}
                <div className="absolute top-4 left-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-green-500 border-b-[6px] border-b-transparent"></div>
                            <span className="text-[10px] text-slate-400 uppercase">Substrate (Starch)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rotate-45"></div>
                            <span className="text-[10px] text-slate-400 uppercase">Wrong Molecule</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Controls */}
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl">
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Reactions</p>
                    <p className="text-2xl font-mono text-green-400">{reactionCount}</p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${isPlaying ? 'bg-amber-600 text-white' : 'bg-green-600 text-white hover:bg-green-500'}`}
                    >
                        {isPlaying ? 'Pause' : 'Start'} <Play className="w-4 h-4 fill-current" />
                    </button>
                    <button 
                        onClick={() => { setIsPlaying(false); setReactionCount(0); setSubstrates([]); }}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LockAndKeySim;
