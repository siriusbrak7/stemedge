import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
    highlightedOrganelle: string | null;
    onOrganelleClick: (id: string) => void;
}

const CellDiagram: React.FC<Props> = ({ highlightedOrganelle, onOrganelleClick }) => {
    const [zoom, setZoom] = React.useState(1);

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(0.8, prev + delta), 2.5));
    };

    const getOpacity = (id: string) => {
        if (!highlightedOrganelle) return 1;
        return highlightedOrganelle === id ? 1 : 0.3;
    };

    const getStroke = (id: string) => {
        return highlightedOrganelle === id ? "white" : "none";
    };

    const getFilter = (id: string) => {
        return highlightedOrganelle === id ? "url(#glow)" : "";
    };

    return (
        <div className="relative w-full h-full min-h-[400px] bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 flex items-center justify-center group">
            
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <button onClick={() => handleZoom(0.2)} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 shadow-lg"><ZoomIn className="w-5 h-5"/></button>
                <button onClick={() => handleZoom(-0.2)} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 shadow-lg"><ZoomOut className="w-5 h-5"/></button>
            </div>

            <div 
                className="transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoom})` }}
            >
                <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="cytoplasmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    {/* --- PLANT CELL (Left Half hint) --- */}
                    <g 
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => onOrganelleClick('cell_wall')}
                        style={{ opacity: getOpacity('cell_wall') }}
                    >
                         <path d="M 40,40 L 360,40 L 360,360 L 40,360 Z" fill="none" stroke="#22c55e" strokeWidth="6" rx="20" ry="20" strokeDasharray="10,5" />
                         {highlightedOrganelle === 'cell_wall' && <text x="200" y="30" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">CELL WALL</text>}
                    </g>

                    {/* --- CELL MEMBRANE (The main container) --- */}
                    <g 
                        className="cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                        onClick={() => onOrganelleClick('cell_membrane')}
                        style={{ opacity: getOpacity('cell_membrane') }}
                    >
                        <rect x="50" y="50" width="300" height="300" rx="30" fill="url(#cytoplasmGrad)" stroke="#38bdf8" strokeWidth="3" filter={getFilter('cell_membrane')} />
                    </g>

                    {/* --- CYTOPLASM (Clickable Area) --- */}
                    <g onClick={() => onOrganelleClick('cytoplasm')}>
                         <rect x="60" y="60" width="280" height="280" fill="transparent" />
                    </g>

                    {/* --- NUCLEUS (Center) --- */}
                    <g 
                        className="cursor-pointer hover:scale-105 transition-transform origin-center"
                        onClick={() => onOrganelleClick('nucleus')}
                        style={{ opacity: getOpacity('nucleus') }}
                    >
                        <circle cx="200" cy="200" r="45" fill="#9333ea" stroke={getStroke('nucleus')} strokeWidth="2" filter={getFilter('nucleus')} />
                        <circle cx="200" cy="200" r="15" fill="#a855f7" />
                    </g>

                    {/* --- LARGE VACUOLE (Top Right - Plant) --- */}
                    <g 
                        className="cursor-pointer hover:scale-105 transition-transform origin-center"
                        onClick={() => onOrganelleClick('vacuole')}
                        style={{ opacity: getOpacity('vacuole') }}
                    >
                        <path d="M 260,80 Q 320,80 320,140 Q 320,180 270,170 Q 240,160 260,80" fill="#0ea5e9" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" filter={getFilter('vacuole')} />
                    </g>

                    {/* --- MITOCHONDRIA (Bottom Left & Right) --- */}
                    <g 
                        className="cursor-pointer hover:scale-110 transition-transform origin-center"
                        onClick={() => onOrganelleClick('mitochondria')}
                        style={{ opacity: getOpacity('mitochondria') }}
                    >
                        {/* Mito 1 */}
                        <ellipse cx="100" cy="280" rx="25" ry="12" fill="#f59e0b" transform="rotate(-30 100 280)" stroke={getStroke('mitochondria')} strokeWidth="2" filter={getFilter('mitochondria')} />
                        <path d="M 85,280 Q 100,270 115,280" stroke="#78350f" strokeWidth="1.5" fill="none" transform="rotate(-30 100 280)" />
                        
                        {/* Mito 2 */}
                        <ellipse cx="280" cy="280" rx="25" ry="12" fill="#f59e0b" transform="rotate(20 280 280)" opacity="0.8" />
                    </g>

                    {/* --- CHLOROPLASTS (Left & Top - Plant) --- */}
                    <g 
                        className="cursor-pointer hover:scale-110 transition-transform origin-center"
                        onClick={() => onOrganelleClick('chloroplast')}
                        style={{ opacity: getOpacity('chloroplast') }}
                    >
                        <ellipse cx="90" cy="120" rx="20" ry="12" fill="#4ade80" stroke={getStroke('chloroplast')} strokeWidth="2" filter={getFilter('chloroplast')} />
                        <circle cx="85" cy="120" r="3" fill="#166534" />
                        <circle cx="95" cy="120" r="3" fill="#166534" />
                    </g>

                    {/* --- RIBOSOMES (Dots everywhere) --- */}
                    <g 
                        className="cursor-pointer"
                        onClick={() => onOrganelleClick('ribosomes')}
                        style={{ opacity: getOpacity('ribosomes') }}
                    >
                        <circle cx="150" cy="150" r="3" fill="#f472b6" />
                        <circle cx="160" cy="260" r="3" fill="#f472b6" />
                        <circle cx="240" cy="240" r="3" fill="#f472b6" />
                        <circle cx="220" cy="120" r="3" fill="#f472b6" />
                        <circle cx="120" cy="220" r="3" fill="#f472b6" />
                        {highlightedOrganelle === 'ribosomes' && <circle cx="150" cy="150" r="10" stroke="white" fill="none" className="animate-ping" />}
                    </g>

                </svg>
            </div>
            
            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
                 <p className="text-slate-500 text-xs">Interactive Cell Model v1.0</p>
            </div>
        </div>
    );
};

export default CellDiagram;