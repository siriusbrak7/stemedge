
import React from 'react';

interface Props {
    state: 'idle' | 'listening' | 'thinking' | 'speaking';
    size?: 'sm' | 'md' | 'lg';
}

const SiriusStar: React.FC<Props> = ({ state, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-24 h-24'
    };

    const pulseClass = state === 'listening' ? 'animate-pulse-glow' : '';
    const spinClass = state === 'thinking' ? 'animate-spin-slow' : '';
    const glowColor = state === 'speaking' ? 'bg-purple-500' : 'bg-cyan-500';

    return (
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
            {/* Outer Glow */}
            <div className={`absolute inset-0 ${glowColor} rounded-full blur-xl opacity-40 ${pulseClass}`}></div>
            
            {/* The Star */}
            <svg viewBox="0 0 100 100" className={`w-full h-full relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] ${spinClass} transition-all duration-500`}>
                <defs>
                    <radialGradient id="starGradient">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#cffafe" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </radialGradient>
                </defs>
                {/* 8-Pointed Star Shape */}
                <path
                    d="M50 0 L61 35 L98 35 L68 57 L79 92 L50 72 L21 92 L32 57 L2 35 L39 35 Z"
                    fill="url(#starGradient)"
                />
                <circle cx="50" cy="50" r="10" fill="white" className="animate-pulse" />
            </svg>

            {/* Orbiting Particles (Thinking State) */}
            {state === 'thinking' && (
                <div className="absolute inset-0 animate-spin">
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                </div>
            )}

            {/* Speaking Waves */}
            {state === 'speaking' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full border border-purple-400 rounded-full animate-ping opacity-50"></div>
                </div>
            )}
        </div>
    );
};

export default SiriusStar;
