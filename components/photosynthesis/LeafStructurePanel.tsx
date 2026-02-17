
import React from 'react';
import { LEAF_STRUCTURES, StructureInfo, DepthLevel } from '../../data/photosynthesisData';
import { Award, Save } from 'lucide-react';

interface Props {
    structureId: string | null;
    depth: DepthLevel;
    onDepthChange: (level: DepthLevel) => void;
    onSaveNote: (note: string) => void;
}

const LeafStructurePanel: React.FC<Props> = ({ structureId, depth, onDepthChange, onSaveNote }) => {
    const structure: StructureInfo | undefined = structureId ? LEAF_STRUCTURES[structureId] : undefined;

    const handleSave = () => {
        if (structure) {
            onSaveNote(`${structure.name}: ${structure.description[depth]}`);
            alert("Note saved!");
        }
    };

    if (!structure) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-3xl">🌿</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Explore the Leaf</h3>
                <p className="text-slate-400">
                    Click on layers in the diagram to reveal their function.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in-right">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{structure.name}</h2>
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
            </div>

            {/* Depth Slider */}
            <div className="bg-slate-950 p-1 rounded-lg flex mb-6 border border-slate-800">
                {(['foundation', 'medium', 'advanced'] as DepthLevel[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => onDepthChange(level)}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                            depth === level 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-2 mb-6">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 mb-4">
                    <p className="text-lg text-slate-200 leading-relaxed">
                        {structure.description[depth]}
                    </p>
                </div>

                <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20 mb-4">
                    <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-green-300 uppercase mb-1">Did You Know?</p>
                            <p className="text-sm text-green-100 italic">"{structure.funFact}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
                <button 
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-medium transition-colors"
                >
                    <Save className="w-4 h-4" /> Save to Notes
                </button>
            </div>
        </div>
    );
};

export default LeafStructurePanel;
