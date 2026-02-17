import React from 'react';

interface Props {
    type: 'animal' | 'plant' | 'bacteria' | null;
    magnification: 40 | 100 | 400;
    focus: number; // 0-100, 50 is perfect
    light: number; // 0-100
    stain: 'none' | 'methylene_blue' | 'iodine';
}

const MicroscopeView: React.FC<Props> = ({ type, magnification, focus, light, stain }) => {
    
    // 1. Calculate visual effects
    const blurAmount = Math.abs(50 - focus) * 0.2; // 0px at 50, up to 10px at extremes
    const brightness = 0.2 + (light / 100); // 0.2 to 1.2
    
    // Zoom scaling based on mag
    // 40x = 1.0 scale (base), 100x = 2.5 scale, 400x = 10.0 scale
    // We adjust the SVG pattern density instead of CSS transform for better quality simulation
    const patternScale = magnification === 40 ? 1 : magnification === 100 ? 2.5 : 5;

    // Stain Colors
    let overlayColor = 'transparent';
    if (stain === 'methylene_blue') overlayColor = 'rgba(0, 100, 255, 0.3)'; // Blue tint
    if (stain === 'iodine') overlayColor = 'rgba(255, 165, 0, 0.3)'; // Orange/Amber tint

    // Render Logic for different cell types using SVG patterns
    const renderCells = () => {
        if (!type) return null;

        const cellCount = type === 'bacteria' ? 30 : type === 'plant' ? 12 : 8;
        const cells = Array.from({ length: cellCount });

        return (
            <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                <defs>
                    {/* Animal Cell Gradient */}
                    <radialGradient id="animalGrad">
                        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
                    </radialGradient>
                    
                    {/* Plant Cell Pattern */}
                    <pattern id="plantPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="48" height="48" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                        <circle cx="24" cy="24" r="5" fill="#16a34a" opacity="0.5" />
                    </pattern>
                </defs>

                <g transform={`scale(${patternScale})`} transform-origin="center">
                    {type === 'animal' && cells.map((_, i) => (
                        <g key={i} transform={`translate(${Math.random() * 350}, ${Math.random() * 350}) rotate(${Math.random() * 360})`}>
                            <ellipse cx="0" cy="0" rx="25" ry="20" fill="url(#animalGrad)" stroke="#94a3b8" strokeWidth="1" />
                            <circle cx="5" cy="2" r="6" fill="#475569" opacity="0.6" /> {/* Nucleus */}
                        </g>
                    ))}

                    {type === 'plant' && (
                        // Grid of bricks
                        <g>
                            {Array.from({ length: 10 }).map((_, r) => 
                                Array.from({ length: 10 }).map((_, c) => (
                                    <g key={`${r}-${c}`} transform={`translate(${c * 50}, ${r * 50})`}>
                                        <rect width="48" height="48" fill={stain === 'iodine' ? '#fef3c7' : '#dcfce7'} stroke={stain === 'iodine' ? '#b45309' : '#166534'} strokeWidth="3" />
                                        <circle cx="10" cy="10" r="4" fill={stain === 'iodine' ? '#78350f' : '#15803d'} /> {/* Chloroplast/Starch */}
                                        <circle cx="40" cy="35" r="4" fill={stain === 'iodine' ? '#78350f' : '#15803d'} />
                                        <circle cx="24" cy="24" r="8" fill="rgba(0,0,0,0.1)" /> {/* Vacuole hint */}
                                    </g>
                                ))
                            )}
                        </g>
                    )}

                    {type === 'bacteria' && cells.map((_, i) => (
                        <g key={i} transform={`translate(${Math.random() * 400}, ${Math.random() * 400}) rotate(${Math.random() * 360})`}>
                            <rect x="0" y="0" width="15" height="5" rx="2.5" fill="#f1f5f9" stroke="#64748b" />
                        </g>
                    ))}
                </g>
            </svg>
        );
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden rounded-full border-8 border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            
            {/* Viewport Content */}
            <div 
                className="w-full h-full transition-all duration-300"
                style={{
                    filter: `blur(${blurAmount}px) brightness(${brightness}) contrast(1.2)`,
                }}
            >
                {/* Background Light */}
                <div className="absolute inset-0 bg-white opacity-90" />
                
                {/* Cells Layer */}
                <div className="absolute inset-0">
                    {type ? renderCells() : (
                        <div className="flex items-center justify-center h-full text-slate-300 opacity-20 text-sm font-mono">
                            No Slide Loaded
                        </div>
                    )}
                </div>

                {/* Stain Overlay */}
                <div 
                    className="absolute inset-0 mix-blend-multiply pointer-events-none transition-colors duration-500"
                    style={{ backgroundColor: overlayColor }}
                />
            </div>

            {/* Vignette / Scope Mask */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,1)] pointer-events-none border-[20px] border-black/10" />
            
            {/* Crosshair (Optional for 'scientific' feel) */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10 pointer-events-none" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black/10 pointer-events-none" />
        </div>
    );
};

export default MicroscopeView;