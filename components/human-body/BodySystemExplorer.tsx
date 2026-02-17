
import React, { useState } from 'react';
import { Activity, Wind, Utensils } from 'lucide-react';

interface Props {
    highlightedPart: string | null;
    onPartClick: (id: string) => void;
}

const BodySystemExplorer: React.FC<Props> = ({ highlightedPart, onPartClick }) => {
    const [showDigestive, setShowDigestive] = useState(true);
    const [showRespiratory, setShowRespiratory] = useState(false);
    const [showCirculatory, setShowCirculatory] = useState(false);

    // Auto-switch tabs based on highlighted part for guided lessons
    React.useEffect(() => {
        if (highlightedPart) {
            if (['mouth', 'esophagus', 'stomach', 'small_intestine', 'large_intestine'].includes(highlightedPart)) {
                setShowDigestive(true);
            } else if (['trachea', 'lungs', 'alveoli'].includes(highlightedPart)) {
                setShowRespiratory(true);
                setShowDigestive(false);
            } else if (['heart', 'arteries', 'veins'].includes(highlightedPart)) {
                setShowCirculatory(true);
                setShowDigestive(false);
            }
        }
    }, [highlightedPart]);

    const getOpacity = (id: string) => (!highlightedPart || highlightedPart === id ? 1 : 0.3);
    const getStroke = (id: string) => (highlightedPart === id ? "white" : "none");
    const getFilter = (id: string) => (highlightedPart === id ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))" : "");

    return (
        <div className="relative w-full h-full min-h-[500px] bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 flex flex-col">
            
            {/* Controls */}
            <div className="flex justify-center gap-2 p-4 bg-slate-950/50 z-10">
                <button 
                    onClick={() => setShowDigestive(!showDigestive)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${showDigestive ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    <Utensils className="w-4 h-4" /> Digestive
                </button>
                <button 
                    onClick={() => setShowRespiratory(!showRespiratory)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${showRespiratory ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    <Wind className="w-4 h-4" /> Respiratory
                </button>
                <button 
                    onClick={() => setShowCirculatory(!showCirculatory)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${showCirculatory ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    <Activity className="w-4 h-4" /> Circulatory
                </button>
            </div>

            {/* Diagram */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                <svg viewBox="0 0 300 600" className="h-full max-w-[300px]">
                    <defs>
                        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#334155" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#475569" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#334155" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    {/* Body Silhouette */}
                    <path d="M 150,20 C 130,20 115,35 115,55 C 115,75 125,85 130,90 C 110,100 90,120 90,160 L 90,300 L 100,450 L 110,580 L 140,580 L 145,450 L 155,450 L 160,580 L 190,580 L 200,450 L 210,300 L 210,160 C 210,120 190,100 170,90 C 175,85 185,75 185,55 C 185,35 170,20 150,20 Z" fill="url(#bodyGrad)" stroke="#475569" strokeWidth="2" />

                    {/* --- DIGESTIVE SYSTEM --- */}
                    <g style={{ display: showDigestive ? 'block' : 'none' }}>
                        {/* Esophagus */}
                        <path 
                            d="M 150,90 L 150,180" 
                            stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round"
                            style={{ opacity: getOpacity('esophagus'), filter: getFilter('esophagus'), cursor: 'pointer' }}
                            onClick={() => onPartClick('esophagus')}
                        />
                        {/* Stomach */}
                        <path 
                            d="M 150,180 Q 170,180 180,200 Q 185,220 160,230 Q 130,220 150,180 Z" 
                            fill="#d97706" stroke={getStroke('stomach')} strokeWidth="2"
                            style={{ opacity: getOpacity('stomach'), filter: getFilter('stomach'), cursor: 'pointer' }}
                            onClick={() => onPartClick('stomach')}
                        />
                        {/* Small Intestine */}
                        <path 
                            d="M 160,230 Q 140,240 150,250 Q 170,260 150,270 Q 130,260 150,280" 
                            stroke="#fcd34d" strokeWidth="10" fill="none" strokeLinecap="round"
                            style={{ opacity: getOpacity('small_intestine'), filter: getFilter('small_intestine'), cursor: 'pointer' }}
                            onClick={() => onPartClick('small_intestine')}
                        />
                        {/* Large Intestine */}
                        <path 
                            d="M 130,280 L 130,220 L 190,220 L 190,290 L 150,290" 
                            stroke="#b45309" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"
                            style={{ opacity: getOpacity('large_intestine'), filter: getFilter('large_intestine'), cursor: 'pointer' }}
                            onClick={() => onPartClick('large_intestine')}
                        />
                    </g>

                    {/* --- RESPIRATORY SYSTEM --- */}
                    <g style={{ display: showRespiratory ? 'block' : 'none' }}>
                        {/* Trachea */}
                        <path 
                            d="M 150,85 L 150,140" 
                            stroke="#22d3ee" strokeWidth="8" fill="none"
                            style={{ opacity: getOpacity('trachea'), filter: getFilter('trachea'), cursor: 'pointer' }}
                            onClick={() => onPartClick('trachea')}
                        />
                        {/* Lungs */}
                        <path 
                            d="M 150,140 Q 110,140 110,180 Q 110,220 150,210 Z" 
                            fill="#06b6d4" fillOpacity="0.7" stroke={getStroke('lungs')}
                            style={{ opacity: getOpacity('lungs'), filter: getFilter('lungs'), cursor: 'pointer' }}
                            onClick={() => onPartClick('lungs')}
                        />
                        <path 
                            d="M 150,140 Q 190,140 190,180 Q 190,210 150,210 Z" 
                            fill="#06b6d4" fillOpacity="0.7" stroke={getStroke('lungs')}
                            style={{ opacity: getOpacity('lungs'), filter: getFilter('lungs'), cursor: 'pointer' }}
                            onClick={() => onPartClick('lungs')}
                        />
                        {/* Alveoli Dots (symbolic) */}
                        <g style={{ display: highlightedPart === 'alveoli' || highlightedPart === 'lungs' ? 'block' : 'none' }}>
                            <circle cx="125" cy="180" r="2" fill="white" className="animate-pulse" onClick={() => onPartClick('alveoli')} style={{ cursor: 'pointer' }}/>
                            <circle cx="135" cy="190" r="2" fill="white" className="animate-pulse delay-100" onClick={() => onPartClick('alveoli')} style={{ cursor: 'pointer' }}/>
                            <circle cx="170" cy="170" r="2" fill="white" className="animate-pulse delay-200" onClick={() => onPartClick('alveoli')} style={{ cursor: 'pointer' }}/>
                        </g>
                    </g>

                    {/* --- CIRCULATORY SYSTEM --- */}
                    <g style={{ display: showCirculatory ? 'block' : 'none' }}>
                        {/* Heart */}
                        <path 
                            d="M 150,160 Q 175,150 180,170 Q 185,190 160,200 Q 140,190 150,160 Z" 
                            fill="#ef4444" stroke={getStroke('heart')}
                            style={{ opacity: getOpacity('heart'), filter: getFilter('heart'), cursor: 'pointer' }}
                            onClick={() => onPartClick('heart')}
                            className="animate-pulse"
                        />
                        {/* Arteries (Red) */}
                        <g 
                            stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.6"
                            style={{ opacity: getOpacity('arteries'), filter: getFilter('arteries'), cursor: 'pointer' }}
                            onClick={() => onPartClick('arteries')}
                        >
                            <path d="M 160,160 L 150,140 L 150,100" /> {/* Neck */}
                            <path d="M 160,200 L 150,300 L 140,450" /> {/* Leg */}
                            <path d="M 160,170 L 200,200 L 240,220" /> {/* Arm */}
                        </g>
                        {/* Veins (Blue) */}
                        <g 
                            stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.6"
                            style={{ opacity: getOpacity('veins'), filter: getFilter('veins'), cursor: 'pointer' }}
                            onClick={() => onPartClick('veins')}
                        >
                            <path d="M 140,160 L 140,100" />
                            <path d="M 150,200 L 160,300 L 170,450" />
                            <path d="M 140,170 L 100,200" />
                        </g>
                    </g>

                </svg>
            </div>
            
            <div className="absolute bottom-2 left-0 w-full text-center text-xs text-slate-500 pointer-events-none">
                Toggle systems to explore layers
            </div>
        </div>
    );
};

export default BodySystemExplorer;
