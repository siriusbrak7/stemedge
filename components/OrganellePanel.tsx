
import React from 'react';
import { OrganelleInfo, DepthLevel } from '../data/cellBiologyData';
import { PlayCircle, HelpCircle, Save, Share2, Award } from 'lucide-react';

interface Props {
    organelle: OrganelleInfo | null;
    depth: DepthLevel;
    onDepthChange: (level: DepthLevel) => void;
    onSaveNote: (note: string) => void;
    onWatchVideo?: (organelleId: string, title: string) => void;
    onQuizMe?: (organelleId: string, title: string) => void;
}

const OrganellePanel: React.FC<Props> = ({ organelle, depth, onDepthChange, onSaveNote, onWatchVideo, onQuizMe }) => {
    
    const handleSave = () => {
        if (organelle) {
            onSaveNote(`${organelle.name}: ${organelle.description[depth]}`);
            alert("Note saved to your log!");
        }
    };

    if (!organelle) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-3xl">👆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select an Organelle</h3>
                <p className="text-slate-400">
                    Click on any part of the cell diagram to reveal its secrets.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in-right">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{organelle.name}</h2>
                    <div className="flex gap-2">
                         {organelle.type === 'plant' && <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-bold uppercase rounded border border-green-500/30">Plant Only</span>}
                         {organelle.type === 'both' && <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 text-xs font-bold uppercase rounded border border-cyan-500/30">Plant & Animal</span>}
                    </div>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" />
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
                        {organelle.description[depth]}
                    </p>
                </div>

                <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20 mb-4">
                    <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-purple-300 uppercase mb-1">Fun Fact</p>
                            <p className="text-sm text-purple-100 italic">"{organelle.funFact}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                    onClick={() => onWatchVideo && onWatchVideo(organelle.id, organelle.name)}
                    className="flex items-center justify-center gap-2 p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors"
                >
                    <PlayCircle className="w-4 h-4" /> Watch Video
                </button>
                <button 
                    onClick={() => onQuizMe && onQuizMe(organelle.id, organelle.name)}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-colors"
                >
                    <HelpCircle className="w-4 h-4 text-amber-400" /> Quiz Me
                </button>
                <button 
                    onClick={handleSave}
                    className="col-span-2 flex items-center justify-center gap-2 p-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl font-medium transition-colors text-sm"
                >
                    <Save className="w-4 h-4" /> Save to Notes
                </button>
            </div>
        </div>
    );
};

export default OrganellePanel;
