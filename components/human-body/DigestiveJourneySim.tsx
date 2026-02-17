
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Utensils } from 'lucide-react';

const steps = [
    { id: 'mouth', label: 'Mouth', info: 'Teeth chew (mechanical). Amylase breaks starch (chemical).' },
    { id: 'esophagus', label: 'Esophagus', info: 'Peristalsis pushes food down.' },
    { id: 'stomach', label: 'Stomach', info: 'Acid kills bacteria. Pepsin digests protein.' },
    { id: 'small_int', label: 'Small Intestine', info: 'Nutrients absorbed into blood via Villi.' },
    { id: 'large_int', label: 'Large Intestine', info: 'Water absorbed. Waste solidifies.' }
];

const DigestiveJourneySim: React.FC = () => {
    const [progress, setProgress] = useState(0); // 0 to 100
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + 0.5;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        // Map progress to steps logic
        if (progress < 15) setActiveStep(0);
        else if (progress < 30) setActiveStep(1);
        else if (progress < 50) setActiveStep(2);
        else if (progress < 80) setActiveStep(3);
        else setActiveStep(4);
    }, [progress]);

    const reset = () => {
        setIsPlaying(false);
        setProgress(0);
        setActiveStep(0);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" /> Digestion Tracker
            </h3>

            {/* Visualizer */}
            <div className="flex-1 relative bg-slate-950 rounded-xl mb-6 overflow-hidden border border-slate-800">
                {/* SVG Path visual */}
                <svg viewBox="0 0 300 400" className="w-full h-full opacity-50">
                    <path 
                        id="digestivePath"
                        d="M 150,20 L 150,100 Q 150,150 130,160 Q 110,170 150,200 Q 190,220 150,250 Q 110,280 150,310 Q 190,340 150,380" 
                        fill="none" stroke="#475569" strokeWidth="20" strokeLinecap="round"
                    />
                </svg>

                {/* Animated Bolus */}
                <div 
                    className="absolute w-6 h-6 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-linear"
                    style={{
                        left: '50%', // Simplified positioning for demo - ideally would follow SVG path coordinates
                        top: `${progress}%` 
                    }}
                >
                    <span className="absolute -right-20 top-0 text-xs font-bold text-amber-400 bg-slate-900/80 px-2 py-1 rounded w-24">
                        {steps[activeStep].label}
                    </span>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4 mb-6 min-h-[80px] flex items-center">
                <div>
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-1 block">Current Action</span>
                    <p className="text-slate-200 text-sm leading-relaxed">{steps[activeStep].info}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isPlaying ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                    {isPlaying ? 'Pause' : progress >= 100 ? 'Replay' : 'Start Digestion'}
                </button>
                <button 
                    onClick={reset}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DigestiveJourneySim;
