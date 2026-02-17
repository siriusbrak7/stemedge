
import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Cloud } from 'lucide-react';

const LimitingFactorSim: React.FC = () => {
    const [light, setLight] = useState(50);
    const [co2, setCo2] = useState(50);
    const [temp, setTemp] = useState(25);
    const [rate, setRate] = useState(0);

    // Calculate photosynthesis rate based on factors
    useEffect(() => {
        // Simple simulation logic
        // 1. Light and CO2 act as limiting factors (Monod kinetics-ish)
        const lightFactor = Math.min(light * 2, 100);
        const co2Factor = Math.min(co2 * 2, 100);
        
        // 2. Temperature is a bell curve (Optimum ~25-30, Denatures >45)
        // Standard gaussian-ish shape
        const optimalTemp = 30;
        let tempFactor = 100 - Math.pow(temp - optimalTemp, 2) * 0.4;
        if (tempFactor < 0) tempFactor = 0;

        // Rate is limited by the lowest factor (Liebig's Law of the Minimum roughly)
        const rawRate = Math.min(lightFactor, co2Factor, tempFactor);
        setRate(Math.max(0, Math.round(rawRate)));
    }, [light, co2, temp]);

    const getBarColor = (val: number) => {
        if (val < 30) return 'bg-red-500';
        if (val < 70) return 'bg-amber-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Rate Simulator</h3>
            
            <div className="flex-1 flex items-end justify-center gap-8 mb-8 relative border-b border-l border-slate-700 p-4 min-h-[200px]">
                {/* Graph Bars */}
                <div className="w-16 bg-slate-800 rounded-t-lg relative group transition-all duration-500" style={{ height: `${rate}%` }}>
                    <div className={`absolute inset-0 opacity-50 ${getBarColor(rate)} rounded-t-lg`}></div>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold">{rate}%</span>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-300 -rotate-90 origin-center whitespace-nowrap">Photo. Rate</span>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-400" /> Light Intensity</span>
                        <span>{light}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={light} onChange={(e) => setLight(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                </div>

                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-2"><Cloud className="w-4 h-4 text-slate-400" /> CO2 Level</span>
                        <span>{co2}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={co2} onChange={(e) => setCo2(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400" />
                </div>

                <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-red-400" /> Temperature</span>
                        <span>{temp}°C</span>
                    </div>
                    <input type="range" min="0" max="50" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-400" />
                </div>
            </div>
            
            <div className="mt-6 p-3 bg-slate-800 rounded-lg text-xs text-slate-400">
                <p><strong>Tip:</strong> Try maximizing Light and CO2, then see what happens if Temperature goes above 40°C.</p>
            </div>
        </div>
    );
};

export default LimitingFactorSim;
