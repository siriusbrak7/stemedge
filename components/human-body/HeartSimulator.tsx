
import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause } from 'lucide-react';

const HeartSimulator: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [phase, setPhase] = useState<'diastole' | 'systole_atria' | 'systole_ventricles'>('diastole');
    const [bpm, setBpm] = useState(60);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            const beatDuration = 60000 / bpm;
            // Simplified cycle: 
            // 0-30%: Atrial Systole
            // 30-60%: Ventricular Systole
            // 60-100%: Diastole
            
            const runCycle = () => {
                setPhase('systole_atria');
                setTimeout(() => setPhase('systole_ventricles'), beatDuration * 0.3);
                setTimeout(() => setPhase('diastole'), beatDuration * 0.6);
            };

            runCycle();
            interval = setInterval(runCycle, beatDuration);
        } else {
            setPhase('diastole');
        }
        return () => clearInterval(interval);
    }, [isPlaying, bpm]);

    // Scale factors for animation
    const atriaScale = phase === 'systole_atria' ? 0.9 : 1;
    const ventScale = phase === 'systole_ventricles' ? 0.9 : 1;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" /> Heart Monitor
            </h3>

            <div className="flex-1 flex items-center justify-center relative">
                <svg viewBox="0 0 200 240" className="h-64 drop-shadow-2xl">
                    <defs>
                        <radialGradient id="gradRed" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#991b1b" />
                        </radialGradient>
                        <radialGradient id="gradBlue" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </radialGradient>
                    </defs>

                    {/* Vena Cava (In to RA) */}
                    <path d="M 60,10 L 60,60" stroke="#3b82f6" strokeWidth="8" fill="none" />
                    
                    {/* Pulmonary Artery (Out from RV) */}
                    <path d="M 80,80 L 40,20" stroke="#3b82f6" strokeWidth="8" fill="none" />

                    {/* Pulmonary Vein (In to LA) */}
                    <path d="M 140,20 L 140,60" stroke="#ef4444" strokeWidth="8" fill="none" />

                    {/* Aorta (Out from LV) */}
                    <path d="M 120,80 L 160,10" stroke="#ef4444" strokeWidth="10" fill="none" />

                    {/* Right Atrium (Blue) */}
                    <circle 
                        cx="70" cy="80" r="25" fill="url(#gradBlue)" 
                        style={{ transform: `scale(${atriaScale})`, transformOrigin: '70px 80px', transition: 'transform 0.2s' }} 
                    />
                    
                    {/* Left Atrium (Red) */}
                    <circle 
                        cx="130" cy="80" r="25" fill="url(#gradRed)" 
                        style={{ transform: `scale(${atriaScale})`, transformOrigin: '130px 80px', transition: 'transform 0.2s' }} 
                    />

                    {/* Right Ventricle (Blue) */}
                    <path 
                        d="M 50,110 Q 70,180 95,160 Q 95,110 50,110" fill="url(#gradBlue)"
                        style={{ transform: `scale(${ventScale})`, transformOrigin: '75px 140px', transition: 'transform 0.2s' }} 
                    />

                    {/* Left Ventricle (Red - Thicker) */}
                    <path 
                        d="M 150,110 Q 130,200 105,160 Q 105,110 150,110" fill="url(#gradRed)"
                        style={{ transform: `scale(${ventScale})`, transformOrigin: '125px 140px', transition: 'transform 0.2s' }} 
                    />

                    {/* Labels */}
                    <text x="50" y="85" fontSize="8" fill="white" opacity="0.8">RA</text>
                    <text x="140" y="85" fontSize="8" fill="white" opacity="0.8">LA</text>
                    <text x="65" y="140" fontSize="8" fill="white" opacity="0.8">RV</text>
                    <text x="125" y="140" fontSize="8" fill="white" opacity="0.8">LV</text>

                    {/* Blood Flow Particles */}
                    {isPlaying && (
                        <>
                            {/* Blue Path */}
                            <circle r="3" fill="cyan" className="animate-ping" style={{ animationDuration: `${60/bpm}s` }}>
                                <animateMotion path="M 60,10 L 60,80 L 70,130 L 40,20" dur={`${60/bpm}s`} repeatCount="indefinite" />
                            </circle>
                            {/* Red Path */}
                            <circle r="3" fill="pink" className="animate-ping" style={{ animationDuration: `${60/bpm}s`, animationDelay: '0.5s' }}>
                                <animateMotion path="M 140,20 L 140,80 L 130,130 L 160,10" dur={`${60/bpm}s`} repeatCount="indefinite" />
                            </circle>
                        </>
                    )}
                </svg>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 text-sm">Status</span>
                    <span className={`font-mono font-bold ${isPlaying ? 'text-green-400' : 'text-slate-500'}`}>
                        {isPlaying ? `${bpm} BPM` : 'PAUSED'}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Slow</span>
                        <span>Fast</span>
                    </div>
                    <input 
                        type="range" min="40" max="120" 
                        value={bpm} 
                        onChange={(e) => setBpm(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    {isPlaying ? <><Pause className="w-4 h-4"/> Pause Sim</> : <><Play className="w-4 h-4"/> Start Pump</>}
                </button>
            </div>
        </div>
    );
};

export default HeartSimulator;
