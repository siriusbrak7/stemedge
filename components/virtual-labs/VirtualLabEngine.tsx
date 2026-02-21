/**
 * VirtualLabEngine.tsx
 * 
 * Shared wrapper for ALL virtual labs in StemEdge.
 * Handles: header, timer, notebook, step progress, completion flow, badge trigger.
 * Each lab passes its own "scene" as children + a config object.
 * 
 * Usage:
 *   <VirtualLabEngine config={LAB_CONFIG} lab={lab} studentId={studentId} onExit={onExit}>
 *     {({ step, setStep, addNote, completelab }) => <YourLabScene ... />}
 *   </VirtualLabEngine>
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle, X, ChevronRight, Trophy } from 'lucide-react';
import { VirtualLab, LabAttempt, LabNotebookEntry } from '../../types';
import { labService } from '../../services/labService';
import { gamificationService } from '../../services/gamificationService';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LabStepConfig {
    id: string;
    label: string;
    description: string;
}

export interface LabEngineConfig {
    steps: LabStepConfig[];
    passingScore: number; // 0-100
    showTimer: boolean;
}

export interface LabEngineChildProps<T extends string = string> {
    step: T;
    setStep: (step: T) => void;
    stepIndex: number;
    addNote: (text: string, context?: string) => void;
    completeLab: (score: number) => void;
    attempt: LabAttempt | null;
}

interface Props<T extends string = string> {
    config: LabEngineConfig;
    lab: VirtualLab;
    studentId: string;
    onExit: () => void;
    children: (props: LabEngineChildProps<T>) => React.ReactNode;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const LabNotebookPanel: React.FC<{
    entries: LabNotebookEntry[];
    onAdd: (text: string) => void;
    context: string;
    isOpen: boolean;
    onClose: () => void;
}> = ({ entries, onAdd, context, isOpen, onClose }) => {
    const [draft, setDraft] = useState('');

    const handleSubmit = () => {
        if (!draft.trim()) return;
        onAdd(draft.trim());
        setDraft('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-white">Lab Notebook</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{entries.length} entries</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Entries */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {entries.length === 0 && (
                        <p className="text-slate-600 text-sm text-center py-8">No observations recorded yet. Add your first note below.</p>
                    )}
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                            <p className="text-slate-300 text-sm leading-relaxed">{entry.text}</p>
                            <div className="flex items-center justify-between mt-2">
                                {entry.snapshotContext && (
                                    <span className="text-xs text-cyan-600 font-mono">{entry.snapshotContext}</span>
                                )}
                                <span className="text-xs text-slate-600 ml-auto">
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-800">
                    <p className="text-xs text-slate-600 mb-2 font-mono">Context: {context}</p>
                    <div className="flex gap-2">
                        <textarea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                            placeholder="Record your observation..."
                            rows={2}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!draft.trim()}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm self-end transition-colors"
                        >
                            Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Completion Modal ───────────────────────────────────────────────────────────

const CompletionModal: React.FC<{
    score: number;
    passingScore: number;
    timeElapsed: number;
    notesCount: number;
    onExit: () => void;
}> = ({ score, passingScore, timeElapsed, notesCount, onExit }) => {
    const passed = score >= passingScore;
    const mins = Math.floor(timeElapsed / 60);
    const secs = timeElapsed % 60;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Score banner */}
                <div className={`p-6 text-center ${passed ? 'bg-gradient-to-b from-green-900/40 to-transparent' : 'bg-gradient-to-b from-amber-900/40 to-transparent'}`}>
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 border-4 ${passed ? 'border-green-500 bg-green-900/30' : 'border-amber-500 bg-amber-900/30'}`}>
                        {passed 
                            ? <Trophy className="w-10 h-10 text-green-400" />
                            : <CheckCircle className="w-10 h-10 text-amber-400" />
                        }
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Lab Complete!</h2>
                    <p className={`text-4xl font-bold mt-3 ${passed ? 'text-green-400' : 'text-amber-400'}`}>{score}%</p>
                    <p className="text-slate-500 text-sm mt-1">{passed ? 'Excellent work, scientist!' : 'Good effort — review and try again'}</p>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-2 gap-4 border-t border-slate-800">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{mins}:{secs.toString().padStart(2, '0')}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Time</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{notesCount}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Observations</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={onExit}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform"
                    >
                        Exit to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Engine ────────────────────────────────────────────────────────────────

function VirtualLabEngine<T extends string = string>({
    config,
    lab,
    studentId,
    onExit,
    children
}: Props<T>) {
    const [attempt, setAttempt] = useState<LabAttempt | null>(null);
    const [step, setStepState] = useState<T>(config.steps[0].id as T);
    const [notebookOpen, setNotebookOpen] = useState(false);
    const [notebookContext, setNotebookContext] = useState('');
    const [completed, setCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Init attempt
    useEffect(() => {
        const att = labService.initializeAttempt(studentId, lab.id);
        setAttempt(att);
    }, [studentId, lab.id]);

    // Timer
    useEffect(() => {
        if (config.showTimer && !completed) {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [config.showTimer, completed]);

    const stepIndex = config.steps.findIndex(s => s.id === step);
    const currentStepConfig = config.steps[stepIndex];

    const setStep = useCallback((newStep: T) => {
        setStepState(newStep);
    }, []);

    const addNote = useCallback((text: string, context?: string) => {
        const entry: LabNotebookEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            text,
            snapshotContext: context
        };
        labService.saveNotebookEntry(studentId, lab.id, entry);
        setAttempt(prev => prev
            ? { ...prev, notebookEntries: [...prev.notebookEntries, entry] }
            : null
        );
        if (context) setNotebookContext(context);
    }, [studentId, lab.id]);

    const completeLab = useCallback(async (score: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        labService.completeAttempt(studentId, lab.id, score);
        setFinalScore(score);
        setCompleted(true);
        // Trigger badge check
        try {
            await gamificationService.triggerBadgeCheck(studentId);
        } catch (e) {
            console.warn('Badge check failed', e);
        }
    }, [studentId, lab.id]);

    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">

            {/* ── Header ── */}
            <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onExit}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-base font-bold text-white leading-none">{lab.title}</h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {currentStepConfig?.label ?? ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Timer */}
                        {config.showTimer && (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-sm font-mono text-slate-300">
                                    {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
                                </span>
                            </div>
                        )}

                        {/* Notebook toggle */}
                        <button
                            onClick={() => setNotebookOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-slate-400 hover:text-cyan-400 transition-all text-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Notebook</span>
                            {(attempt?.notebookEntries.length ?? 0) > 0 && (
                                <span className="w-5 h-5 bg-cyan-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {attempt!.notebookEntries.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Step Progress Bar ── */}
            <div className="bg-slate-900/50 border-b border-slate-800/50 px-4 py-2">
                <div className="max-w-7xl mx-auto flex items-center gap-1">
                    {config.steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    i < stepIndex
                                        ? 'bg-green-600 text-white'
                                        : i === stepIndex
                                            ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                            : 'bg-slate-800 text-slate-600'
                                }`}>
                                    {i < stepIndex ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium hidden sm:block transition-colors ${
                                    i === stepIndex ? 'text-cyan-400' : i < stepIndex ? 'text-green-400' : 'text-slate-600'
                                }`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < config.steps.length - 1 && (
                                <div className={`flex-1 h-px mx-1 ${i < stepIndex ? 'bg-green-700' : 'bg-slate-800'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── Lab Scene (child) ── */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
                {children({
                    step,
                    setStep,
                    stepIndex,
                    addNote,
                    completeLab,
                    attempt
                })}
            </div>

            {/* ── Notebook Panel ── */}
            <LabNotebookPanel
                entries={attempt?.notebookEntries ?? []}
                onAdd={(text) => addNote(text, notebookContext)}
                context={notebookContext || 'General observation'}
                isOpen={notebookOpen}
                onClose={() => setNotebookOpen(false)}
            />

            {/* ── Completion Modal ── */}
            {completed && (
                <CompletionModal
                    score={finalScore}
                    passingScore={config.passingScore}
                    timeElapsed={elapsed}
                    notesCount={attempt?.notebookEntries.length ?? 0}
                    onExit={onExit}
                />
            )}
        </div>
    );
}

export default VirtualLabEngine;