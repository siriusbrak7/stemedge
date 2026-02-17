
import React from 'react';

interface Props {
    highlightedPart: string | null;
    onPartClick: (id: string) => void;
}

const LeafCrossSection: React.FC<Props> = ({ highlightedPart, onPartClick }) => {
    
    const getStyle = (id: string) => ({
        opacity: !highlightedPart || highlightedPart === id ? 1 : 0.4,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    });

    const getStroke = (id: string) => highlightedPart === id ? "#fff" : "none";

    return (
        <div className="relative w-full h-full min-h-[400px] bg-sky-900/30 overflow-hidden rounded-2xl border border-slate-800 flex items-center justify-center">
            <svg viewBox="0 0 500 400" className="w-full h-full max-w-[500px]">
                <defs>
                    <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#86efac" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <pattern id="palisadePattern" width="30" height="80" patternUnits="userSpaceOnUse">
                        <rect width="25" height="75" rx="5" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
                        <circle cx="12" cy="20" r="3" fill="#14532d" />
                        <circle cx="12" cy="40" r="3" fill="#14532d" />
                        <circle cx="12" cy="60" r="3" fill="#14532d" />
                    </pattern>
                </defs>

                {/* --- 1. WAXY CUTICLE (Top) --- */}
                <g onClick={() => onPartClick('cuticle')} style={getStyle('cuticle')}>
                    <path d="M 50,20 Q 250,10 450,20 L 450,30 Q 250,20 50,30 Z" fill="#fef08a" stroke={getStroke('cuticle')} strokeWidth="2" />
                    <text x="250" y="28" textAnchor="middle" fontSize="10" fill="#a16207" fontWeight="bold">WAXY CUTICLE</text>
                </g>

                {/* --- 2. UPPER EPIDERMIS --- */}
                <g onClick={() => onPartClick('epidermis')} style={getStyle('epidermis')}>
                    <rect x="50" y="30" width="400" height="30" fill="#bfdbfe" opacity="0.8" stroke="#1e40af" strokeWidth="1" />
                    {Array.from({length: 8}).map((_, i) => (
                        <rect key={i} x={50 + i*50} y="30" width="50" height="30" fill="none" stroke="#1e40af" strokeWidth="1" />
                    ))}
                </g>

                {/* --- 3. PALISADE MESOPHYLL --- */}
                <g onClick={() => onPartClick('palisade')} style={getStyle('palisade')}>
                    <rect x="50" y="60" width="400" height="100" fill="url(#palisadePattern)" stroke={getStroke('palisade')} strokeWidth="2" />
                </g>

                {/* --- 4. SPONGY MESOPHYLL --- */}
                <g onClick={() => onPartClick('spongy')} style={getStyle('spongy')}>
                    <path d="M 50,160 L 450,160 L 450,320 L 50,320 Z" fill="#dcfce7" stroke={getStroke('spongy')} strokeWidth="2" />
                    {/* Random spongy cells */}
                    <circle cx="80" cy="190" r="20" fill="#86efac" stroke="#166534" />
                    <circle cx="140" cy="220" r="25" fill="#86efac" stroke="#166534" />
                    <circle cx="100" cy="280" r="20" fill="#86efac" stroke="#166534" />
                    <circle cx="380" cy="200" r="22" fill="#86efac" stroke="#166534" />
                    <circle cx="420" cy="260" r="18" fill="#86efac" stroke="#166534" />
                    <circle cx="320" cy="300" r="20" fill="#86efac" stroke="#166534" />
                    <path d="M 50,160 Q 250,160 450,160" fill="none" stroke="none" />
                </g>

                {/* --- 5. VASCULAR BUNDLE (Middle) --- */}
                <g onClick={() => onPartClick('vascular')} style={getStyle('vascular')} transform="translate(200, 200)">
                    <circle r="50" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
                    <text x="0" y="-10" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#be185d">XYLEM</text>
                    <text x="0" y="10" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#15803d">PHLOEM</text>
                    <circle r="50" fill="none" stroke={getStroke('vascular')} strokeWidth="3" />
                </g>

                {/* --- 6. LOWER EPIDERMIS & STOMATA --- */}
                <g onClick={() => onPartClick('stomata')} style={getStyle('stomata')}>
                    <rect x="50" y="320" width="150" height="30" fill="#bfdbfe" opacity="0.8" stroke="#1e40af" strokeWidth="1" />
                    <rect x="300" y="320" width="150" height="30" fill="#bfdbfe" opacity="0.8" stroke="#1e40af" strokeWidth="1" />
                    
                    {/* Guard Cells / Stomata in the gap */}
                    <path d="M 200,320 Q 210,335 200,350 Q 190,335 200,320 Z" fill="#22c55e" stroke="#14532d" />
                    <path d="M 300,320 Q 290,335 300,350 Q 310,335 300,320 Z" fill="#22c55e" stroke="#14532d" />
                    
                    <text x="250" y="340" textAnchor="middle" fontSize="10" fill="#1e3a8a">STOMATA</text>
                    
                    {/* Arrows for gas exchange */}
                    {highlightedPart === 'stomata' && (
                        <>
                            <path d="M 250,380 L 250,330" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,2" markerEnd="url(#arrow)" />
                            <text x="260" y="370" fontSize="12" fill="#fff">CO2</text>
                        </>
                    )}
                </g>

            </svg>
            <div className="absolute bottom-2 left-4 text-xs text-slate-400">
                Leaf Cross-Section
            </div>
        </div>
    );
};

export default LeafCrossSection;
