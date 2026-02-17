
import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, RotateCcw } from 'lucide-react';

const TemperatureSim: React.FC = () => {
    const [temp, setTemp] = useState(20);
    const [isDenatured, setIsDenatured] = useState(false);
    const [graphPoints, setGraphPoints] = useState<{x: number, y: number}[]>([]);
    
    // Calculate rate based on biological curve
    const calculateRate = (t: number) => {
        if (t > 55) return 0; // Denatured
        // Gaussian-ish curve peaking at 37
        const peak = 37;
        const rate = 100 * Math.exp(-Math.pow(t - peak, 2) / (2 * Math.pow(15, 2)));
        return Math.max(0, rate);
    };

    const currentRate = calculateRate(temp);

    useEffect(() => {
        if (temp > 55) setIsDenatured(true);
        else if (temp < 50 && isDenatured) setIsDenatured(true); // Once denatured, stays denatured!
        else setIsDenatured(false);

        // Update graph points
        setGraphPoints(prev => {
            // Avoid duplicates
            if (prev.find(p => p.x === temp)) return prev;
            const newPoints = [...prev, { x: temp, y: calculateRate(temp) }];
            return newPoints.sort((a, b) => a.x - b.x);
        });
    }, [temp]);

    const handleReset = () => {
        setTemp(20);
        setIsDenatured(false);
        setGraphPoints([]);
    };

    // --- VISUALIZERS ---
    
    const getEnzymeStyle = () => {
        if (isDenatured) {
            return { transform: 'scale(1.1) skew(20deg)', filter: 'grayscale(100%) opacity(0.5)' };
        }
        // Vibration based on temp
        return { animation: `vibrate ${Math.max(0.1, 1 - (temp/100))}s infinite linear` };
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-400" /> Temperature Effect
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                
                {/* 1. Experiment View */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-4">
                    <style>{`
                        @keyframes vibrate {
                            0% { transform: translate(0,0) rotate(0deg); }
                            25% { transform: translate(1px,1px) rotate(1deg); }
                            50% { transform: translate(0,0) rotate(0deg); }
                            75% { transform: translate(-1px,-1px) rotate(-1deg); }
                            100% { transform: translate(0,0) rotate(0deg); }
                        }
                        @keyframes bubble {
                            0% { transform: translateY(0); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateY(-100px); opacity: 0; }
                        }
                    `}</style>

                    {/* Enzyme Visual */}
                    <div className="w-24 h-24 mb-4 transition-all duration-500" style={getEnzymeStyle()}>
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <path d="M 50,50 L 80,30 A 40,40 0 1,0 80,70 Z" fill={isDenatured ? "#94a3b8" : "#3b82f6"} />
                        </svg>
                    </div>

                    {/* Bubbles (Activity) */}
                    {!isDenatured && (
                        <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: Math.floor(currentRate / 5) }).map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute w-2 h-2 bg-white/50 rounded-full"
                                    style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        bottom: '20%',
                                        animation: `bubble ${1 + Math.random()}s infinite linear`,
                                        animationDelay: `${Math.random()}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="text-center z-10">
                        <p className={`text-2xl font-bold ${isDenatured ? 'text-red-500' : 'text-white'}`}>
                            {isDenatured ? 'DENATURED' : `${temp}°C`}
                        </p>
                        <p className="text-xs text-slate-400 uppercase">
                            {isDenatured ? 'Active Site Destroyed' : 'System Status'}
                        </p>
                    </div>
                </div>

                {/* 2. Live Graph */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 relative">
                    <div className="absolute top-2 left-2 text-xs text-slate-500 font-bold">RATE OF REACTION</div>
                    <div className="h-full w-full flex items-end relative pt-6 pl-6 pb-6">
                        {/* Axes */}
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-700"></div>
                        <div className="absolute left-6 right-2 bottom-6 h-0.5 bg-slate-700"></div>
                        
                        {/* Bars */}
                        {graphPoints.map((pt, i) => (
                            <div 
                                key={i}
                                className="absolute bottom-6 w-2 bg-cyan-500/50 rounded-t-sm transition-all hover:bg-cyan-400"
                                style={{
                                    left: `${(pt.x / 65) * 100}%`,
                                    height: `${(pt.y / 100) * 80}%`,
                                    marginLeft: '24px' // Offset for axis
                                }}
                                title={`Temp: ${pt.x}°C, Rate: ${Math.round(pt.y)}`}
                            />
                        ))}

                        {/* Current Marker */}
                        <div 
                            className="absolute bottom-6 w-1 h-full border-l border-dashed border-white/30 pointer-events-none transition-all duration-200"
                            style={{ left: `${(temp / 65) * 100}%`, marginLeft: '24px' }}
                        ></div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-bold">TEMP (°C)</div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
                <span className="text-sm font-bold text-slate-400 uppercase">Adjust Heat</span>
                <input 
                    type="range" 
                    min="0" 
                    max="65" 
                    value={temp} 
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <button 
                    onClick={handleReset}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    title="Reset Experiment"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TemperatureSim;
