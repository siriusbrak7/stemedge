
import React, { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRight, Check, AlertTriangle } from 'lucide-react';

interface Organism {
    id: string;
    name: string;
    type: 'producer' | 'herbivore' | 'carnivore' | 'decomposer';
    icon: string;
    x: number;
    y: number;
}

interface Connection {
    from: string;
    to: string;
}

const INITIAL_ORGANISMS: Organism[] = [
    { id: 'grass', name: 'Grass', type: 'producer', icon: '🌿', x: 50, y: 350 },
    { id: 'rabbit', name: 'Rabbit', type: 'herbivore', icon: '🐇', x: 200, y: 250 },
    { id: 'fox', name: 'Fox', type: 'carnivore', icon: '🦊', x: 350, y: 150 },
    { id: 'hawk', name: 'Hawk', type: 'carnivore', icon: '🦅', x: 150, y: 50 },
    { id: 'fungi', name: 'Fungi', type: 'decomposer', icon: '🍄', x: 300, y: 350 },
];

const FoodWebBuilder: React.FC = () => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleOrganismClick = (id: string) => {
        if (!selectedId) {
            setSelectedId(id);
            setMessage(`Select who eats the ${INITIAL_ORGANISMS.find(o => o.id === id)?.name}...`);
        } else {
            if (selectedId === id) {
                setSelectedId(null);
                setMessage(null);
                return;
            }

            // Check if connection already exists
            if (connections.some(c => c.from === selectedId && c.to === id)) {
                setMessage("Connection already exists.");
                setSelectedId(null);
                return;
            }

            // Validate Trophic Logic (Simplified)
            const predator = INITIAL_ORGANISMS.find(o => o.id === id);
            const prey = INITIAL_ORGANISMS.find(o => o.id === selectedId);

            let isValid = false;
            let warning = "";

            if (prey?.type === 'producer' && predator?.type === 'herbivore') isValid = true;
            else if (prey?.type === 'herbivore' && predator?.type === 'carnivore') isValid = true;
            else if (prey?.type === 'carnivore' && predator?.type === 'carnivore') isValid = true; // e.g. Hawk eats Fox
            else if (predator?.type === 'decomposer') isValid = true; // Everything goes to decomposers
            else {
                warning = `A ${predator?.name} generally doesn't eat ${prey?.name}.`;
            }

            if (isValid) {
                setConnections(prev => [...prev, { from: selectedId, to: id }]);
                setMessage("Correct! Energy flows up.");
            } else {
                setMessage(`Incorrect link. ${warning}`);
            }
            setSelectedId(null);
        }
    };

    const reset = () => {
        setConnections([]);
        setSelectedId(null);
        setMessage(null);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Food Web Builder</h3>
                <button onClick={reset} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                    <RefreshCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                {/* SVG Layer for Arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80" />
                        </marker>
                    </defs>
                    {connections.map((conn, idx) => {
                        const from = INITIAL_ORGANISMS.find(o => o.id === conn.from);
                        const to = INITIAL_ORGANISMS.find(o => o.id === conn.to);
                        if (!from || !to) return null;
                        return (
                            <line 
                                key={idx}
                                x1={from.x + 30} y1={from.y + 30}
                                x2={to.x + 30} y2={to.y + 30}
                                stroke="#4ade80" strokeWidth="2" markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                    {/* Connecting Line Preview */}
                    {selectedId && (
                       // Can't easily track mouse in SVG without more state, skipping for simplicity
                       null
                    )}
                </svg>

                {/* Organisms */}
                {INITIAL_ORGANISMS.map(org => (
                    <div
                        key={org.id}
                        onClick={() => handleOrganismClick(org.id)}
                        className={`absolute w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all z-10 border-2 ${
                            selectedId === org.id 
                                ? 'bg-cyan-900/50 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                                : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                        style={{ left: org.x, top: org.y }}
                    >
                        <span className="text-2xl">{org.icon}</span>
                        <span className="text-[10px] font-bold text-slate-300 mt-1">{org.name}</span>
                    </div>
                ))}

                {/* Instructions / Feedback Overlay */}
                <div className="absolute top-4 left-4 right-4 text-center pointer-events-none">
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${
                        message ? 'bg-slate-800/80 text-white' : 'bg-slate-900/50 text-slate-400'
                    }`}>
                        {message || "Click a prey, then click its predator to connect energy flow."}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Producer</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Consumer</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-700 rounded-full"></span> Decomposer</div>
            </div>
        </div>
    );
};

export default FoodWebBuilder;
