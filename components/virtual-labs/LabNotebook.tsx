import React, { useState, useEffect, useRef } from 'react';
import { Book, X, Camera, Save, Trash2, Clock } from 'lucide-react';
import { LabNotebookEntry } from '../../types';

interface Props {
    entries: LabNotebookEntry[];
    onAddEntry: (text: string, snapshotContext?: string) => void;
    currentContext?: string; // Description of current view (e.g., "400x, Stained")
}

const LabNotebook: React.FC<Props> = ({ entries, onAddEntry, currentContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const listEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of notes when opened or added
    useEffect(() => {
        if (isOpen) {
            listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, entries.length]);

    const handleSave = () => {
        if (!noteText.trim()) return;
        onAddEntry(noteText);
        setNoteText('');
    };

    const handleSnapshot = () => {
        if (!currentContext) return;
        onAddEntry(`Observed: ${currentContext}`, currentContext);
        setIsOpen(true); // Open notebook to show it happened
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
                <button 
                    onClick={handleSnapshot}
                    className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 hover:text-white hover:bg-slate-700 shadow-lg transition-all"
                    title="Capture Observation"
                >
                    <Camera className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-900/50 transition-all hover:scale-105"
                    title="Open Notebook"
                >
                    <Book className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed top-20 right-4 bottom-4 w-full max-w-sm bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl z-40 flex flex-col animate-fade-in-left">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white">Lab Notebook</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Entries List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {entries.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 italic text-sm">
                        No observations recorded yet.<br/>Use the camera button or type a note.
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                </span>
                                {entry.snapshotContext && (
                                    <span className="text-[10px] uppercase font-bold bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-900/50">
                                        Snapshot
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-200 whitespace-pre-wrap">{entry.text}</p>
                            {entry.snapshotContext && (
                                <div className="mt-2 text-xs text-slate-400 italic bg-slate-900/50 p-1.5 rounded">
                                    Context: {entry.snapshotContext}
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={listEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
                <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Record observation..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 mb-2 min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                    <button 
                        onClick={handleSnapshot}
                        className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <Camera className="w-4 h-4" /> Capture
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!noteText.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LabNotebook;