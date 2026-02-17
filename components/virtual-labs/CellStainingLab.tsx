import React, { useState, useEffect } from 'react';
import { VirtualLab, LabAttempt } from '../../types';
import { labService } from '../../services/labService';
import MicroscopeView from './MicroscopeView';
import LabNotebook from './LabNotebook';
import { ArrowLeft, CheckCircle, HelpCircle, FlaskConical, Microscope, Sliders } from 'lucide-react';

interface Props {
    lab: VirtualLab;
    studentId: string;
    onExit: () => void;
}

type Step = 'setup' | 'focus' | 'identify' | 'conclude';
type Stain = 'none' | 'methylene_blue' | 'iodine';
type SampleType = 'animal' | 'plant' | 'bacteria';

const CellStainingLab: React.FC<Props> = ({ lab, studentId, onExit }) => {
    const [attempt, setAttempt] = useState<LabAttempt | null>(null);
    const [step, setStep] = useState<Step>('setup');
    
    // Microscope State
    const [slidePlaced, setSlidePlaced] = useState(false);
    const [stain, setStain] = useState<Stain>('none');
    const [magnification, setMagnification] = useState<40 | 100 | 400>(40);
    const [focus, setFocus] = useState(20); // Start out of focus
    const [light, setLight] = useState(50);
    const [currentSample, setCurrentSample] = useState<SampleType>('animal'); // Default sample

    // Quiz State
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [identifiedCount, setIdentifiedCount] = useState(0);

    useEffect(() => {
        const att = labService.initializeAttempt(studentId, lab.id);
        setAttempt(att);
    }, [studentId, lab.id]);

    const handleAddNote = (text: string, context?: string) => {
        if (!attempt) return;
        const entry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            text,
            snapshotContext: context
        };
        labService.saveNotebookEntry(studentId, lab.id, entry);
        // Refresh local state
        setAttempt(prev => prev ? { ...prev, notebookEntries: [...prev.notebookEntries, entry] } : null);
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        
        let isCorrect = false;
        if (currentSample === 'animal' && selectedAnswer === 'Animal Cell') isCorrect = true;
        if (currentSample === 'plant' && selectedAnswer === 'Plant Cell') isCorrect = true;
        if (currentSample === 'bacteria' && selectedAnswer === 'Bacterial Cell') isCorrect = true;

        if (isCorrect) {
            setFeedback("Correct! Analysis logged.");
            if (identifiedCount < 3) setIdentifiedCount(prev => prev + 1);
        } else {
            setFeedback("Incorrect. Observe the structures carefully. Is there a cell wall? A nucleus?");
        }
    };

    const handleNextSample = () => {
        // Cycle samples
        setFeedback(null);
        setSelectedAnswer(null);
        setFocus(20); // Reset focus for realism
        if (currentSample === 'animal') setCurrentSample('plant');
        else if (currentSample === 'plant') setCurrentSample('bacteria');
        else setStep('conclude');
    };

    // --- RENDER STEPS ---

    const renderControls = () => (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-6">
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <Microscope className="w-4 h-4" /> Magnification
                </h4>
                <div className="flex bg-slate-800 p-1 rounded-lg">
                    {[40, 100, 400].map(mag => (
                        <button
                            key={mag}
                            onClick={() => setMagnification(mag as any)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                magnification === mag ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {mag}x
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" /> Stain
                </h4>
                <select 
                    value={stain}
                    onChange={(e) => setStain(e.target.value as Stain)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 focus:outline-none focus:border-cyan-500"
                >
                    <option value="none">No Stain</option>
                    <option value="methylene_blue">Methylene Blue (General)</option>
                    <option value="iodine">Iodine (Plant/Starch)</option>
                </select>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Coarse/Fine Focus</span>
                        <span>{Math.abs(50 - focus) < 5 ? 'Focused' : 'Blurred'}</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={focus} 
                        onChange={(e) => setFocus(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Light Source</span>
                        <span>{light}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={light} 
                        onChange={(e) => setLight(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onExit} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white">{lab.title}</h1>
                        <p className="text-xs text-slate-500">Step: {step.toUpperCase()}</p>
                    </div>
                </div>
                {step === 'identify' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full">
                        <span className="text-xs text-purple-300 font-bold">Progress: {identifiedCount}/3</span>
                    </div>
                )}
            </div>

            {/* Main Workspace */}
            <div className="flex-1 p-4 lg:p-8 grid lg:grid-cols-3 gap-8">
                
                {/* Left: Visualizer */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="aspect-square md:aspect-video w-full relative">
                        <MicroscopeView 
                            type={slidePlaced ? currentSample : null} 
                            magnification={magnification} 
                            focus={focus} 
                            light={light} 
                            stain={stain} 
                        />
                        {!slidePlaced && step === 'setup' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full m-[20px]">
                                <button 
                                    onClick={() => { setSlidePlaced(true); setStep('focus'); }}
                                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg animate-bounce"
                                >
                                    Place Sample Slide
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-center text-sm text-slate-500 italic">
                        Current View: {magnification}x • {stain.replace('_', ' ')} • {slidePlaced ? 'Sample Loaded' : 'Empty Stage'}
                    </div>
                </div>

                {/* Right: Controls & Tasks */}
                <div className="space-y-6">
                    
                    {/* Context Sensitive Instructions */}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-cyan-400" /> 
                            {step === 'setup' && "Lab Prep"}
                            {step === 'focus' && "Adjust Optics"}
                            {step === 'identify' && "Observation"}
                            {step === 'conclude' && "Conclusion"}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {step === 'setup' && "First, verify your equipment. Place a prepared slide on the stage to begin."}
                            {step === 'focus' && "The image is blurry. Use the Coarse Focus slider to bring the cells into view. Adjust light if needed."}
                            {step === 'identify' && "Observe the structures. Apply stains to see nuclei or cell walls better. Identify the cell type below."}
                            {step === 'conclude' && "Great work! You have analyzed all samples. Complete your lab report to finish."}
                        </p>
                        {step === 'focus' && Math.abs(50 - focus) < 10 && (
                            <button 
                                onClick={() => setStep('identify')}
                                className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors"
                            >
                                Image Clear - Begin Identification
                            </button>
                        )}
                    </div>

                    {step !== 'conclude' && renderControls()}

                    {/* Identification Panel */}
                    {step === 'identify' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-fade-in-up">
                            <h4 className="text-sm font-bold text-white mb-3">Identify Sample</h4>
                            <div className="space-y-2 mb-4">
                                {['Animal Cell', 'Plant Cell', 'Bacterial Cell', 'Fungal Cell'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setSelectedAnswer(opt)}
                                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                                            selectedAnswer === opt 
                                                ? 'bg-purple-900/30 border-purple-500 text-purple-300' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            
                            {feedback ? (
                                <div className={`p-3 rounded-lg text-sm mb-3 ${feedback.includes('Correct') ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                    {feedback}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleCheckAnswer}
                                    disabled={!selectedAnswer}
                                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-bold text-sm"
                                >
                                    Check Answer
                                </button>
                            )}

                            {feedback && feedback.includes('Correct') && (
                                <button 
                                    onClick={handleNextSample}
                                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    Next Sample <Sliders className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'conclude' && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Lab Complete!</h3>
                            <p className="text-slate-400 mb-6">You have successfully identified all samples and recorded your observations.</p>
                            <button 
                                onClick={() => {
                                    labService.completeAttempt(studentId, lab.id, 100);
                                    onExit();
                                }}
                                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:scale-105 transition-transform"
                            >
                                Submit Report & Exit
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Notebook Integration */}
            {attempt && (
                <LabNotebook 
                    entries={attempt.notebookEntries} 
                    onAddEntry={(text) => handleAddNote(text, `${magnification}x, ${stain}, ${currentSample}`)}
                    currentContext={`${magnification}x, ${stain}, ${currentSample} sample`}
                />
            )}

        </div>
    );
};

export default CellStainingLab;