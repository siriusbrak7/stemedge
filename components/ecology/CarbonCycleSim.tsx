
import React, { useState } from 'react';
import { Cloud, Factory, Leaf, User } from 'lucide-react';

interface Reservoir {
    id: string;
    label: string;
    co2: number; // simplified units
    icon: React.ReactNode;
    x: number;
    y: number;
}

const CarbonCycleSim: React.FC = () => {
    const [reservoirs, setReservoirs] = useState<Reservoir[]>([
        { id: 'atmosphere', label: 'Atmosphere', co2: 100, icon: <Cloud className="w-6 h-6 text-white" />, x: 50, y: 10 },
        { id: 'plants', label: 'Plants', co2: 50, icon: <Leaf className="w-6 h-6 text-green-400" />, x: 20, y: 50 },
        { id: 'animals', label: 'Animals', co2: 20, icon: <User className="w-6 h-6 text-orange-400" />, x: 80, y: 50 },
        { id: 'fossils', label: 'Fossil Fuels', co2: 200, icon: <Factory className="w-6 h-6 text-slate-400" />, x: 80, y: 90 },
        { id: 'soil', label: 'Soil', co2: 80, icon: <div className="w-6 h-6 bg-amber-800 rounded-full"></div>, x: 20, y: 90 },
    ]);

    const [animatingAction, setAnimatingAction] = useState<string | null>(null);

    const transferCarbon = (fromId: string, toId: string, amount: number, actionName: string) => {
        if (animatingAction) return;
        setAnimatingAction(actionName);

        setReservoirs(prev => prev.map(r => {
            if (r.id === fromId) return { ...r, co2: r.co2 - amount };
            if (r.id === toId) return { ...r, co2: r.co2 + amount };
            return r;
        }));

        setTimeout(() => setAnimatingAction(null), 1000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">The Carbon Cycle</h3>
            <p className="text-slate-400 text-sm mb-6">Click buttons to move carbon atoms.</p>

            <div className="flex-1 relative bg-gradient-to-b from-sky-900/30 to-emerald-900/30 rounded-xl border border-slate-800 overflow-hidden">
                
                {/* Reservoirs Visuals */}
                {reservoirs.map(r => (
                    <div 
                        key={r.id}
                        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                        style={{ left: `${r.x}%`, top: `${r.y}%` }}
                    >
                        <div className={`p-3 rounded-full bg-slate-800 border-2 ${r.id === 'atmosphere' && r.co2 > 120 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-slate-600'}`}>
                            {r.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-300 mt-1">{r.label}</span>
                        <span className="text-xs font-mono text-cyan-400">{r.co2} Gt</span>
                    </div>
                ))}

                {/* Animation Overlay */}
                {animatingAction && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 px-4 py-2 rounded-lg text-white font-bold animate-fade-in-up">
                            {animatingAction}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                    onClick={() => transferCarbon('atmosphere', 'plants', 10, 'Photosynthesis')}
                    className="p-3 bg-green-900/30 border border-green-500/50 hover:bg-green-900/50 rounded-lg text-green-300 text-xs font-bold transition-colors"
                >
                    Photosynthesis (Air → Plant)
                </button>
                <button 
                    onClick={() => transferCarbon('plants', 'atmosphere', 5, 'Respiration')}
                    className="p-3 bg-slate-800 border border-slate-600 hover:bg-slate-700 rounded-lg text-slate-300 text-xs font-bold transition-colors"
                >
                    Respiration (Plant → Air)
                </button>
                <button 
                    onClick={() => transferCarbon('animals', 'atmosphere', 5, 'Respiration')}
                    className="p-3 bg-slate-800 border border-slate-600 hover:bg-slate-700 rounded-lg text-slate-300 text-xs font-bold transition-colors"
                >
                    Respiration (Animal → Air)
                </button>
                <button 
                    onClick={() => transferCarbon('fossils', 'atmosphere', 20, 'Combustion')}
                    className="p-3 bg-red-900/30 border border-red-500/50 hover:bg-red-900/50 rounded-lg text-red-300 text-xs font-bold transition-colors"
                >
                    Combustion (Burn Fuel → Air)
                </button>
            </div>
        </div>
    );
};

export default CarbonCycleSim;
