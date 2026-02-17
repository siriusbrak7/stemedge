
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Menu } from 'lucide-react';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { ENZYME_SLIDES, DepthLevel } from '../data/enzymesData';
import LockAndKeySim from './enzymes/LockAndKeySim';
import TemperatureSim from './enzymes/TemperatureSim';
import EnzymeInfoPanel from './enzymes/EnzymeInfoPanel';

interface Props {
    onBack: () => void;
}

const EnzymesLesson: React.FC<Props> = ({ onBack }) => {
    const { 
        currentSlide, 
        currentSlideIndex, 
        totalSlides, 
        nextSlide, 
        prevSlide, 
        goToSlide,
        completedSlides, 
        saveNote 
    } = useLessonProgress('enzymes', ENZYME_SLIDES);

    const [depth, setDepth] = useState<DepthLevel>('medium');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderInteractiveArea = () => {
        switch (currentSlide.simType) {
            case 'lock_key':
                return <LockAndKeySim />;
            case 'temperature':
                return <TemperatureSim />;
            case 'ph_graph':
                // Reusing Temperature Sim logic visually for pH for now, or could implement PhSim later
                // For this request, we stick to the main requested features
                return (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🧪</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">pH Simulation</h3>
                        <p className="text-slate-400">Interactive graph showing optimum pH levels for Pepsin (pH 2) vs Amylase (pH 7).</p>
                    </div>
                ); 
            case 'matching':
                return (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full flex flex-col items-center justify-center">
                        <h3 className="text-xl font-bold text-white mb-6">Enzyme Challenge</h3>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <button className="p-4 bg-slate-800 hover:bg-cyan-900/30 border border-slate-700 rounded-xl text-white font-bold transition-all">Protease</button>
                            <button className="p-4 bg-slate-800 hover:bg-green-900/30 border border-slate-700 rounded-xl text-white font-bold transition-all">Starch</button>
                            <button className="p-4 bg-slate-800 hover:bg-cyan-900/30 border border-slate-700 rounded-xl text-white font-bold transition-all">Amylase</button>
                            <button className="p-4 bg-slate-800 hover:bg-green-900/30 border border-slate-700 rounded-xl text-white font-bold transition-all">Protein</button>
                        </div>
                        <p className="mt-6 text-sm text-slate-500">Tap pairs to match enzymes with their substrates.</p>
                    </div>
                );
            default:
                // Concept slide fallback
                return (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg mb-6 animate-pulse">
                            <Zap className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{currentSlide.title}</h3>
                        <p className="text-slate-400 max-w-md">Catalysts in action. Use the sidebar to explore the specific biological concepts.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            
            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            Enzymes & Metabolism <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">Module 4</span>
                        </h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm font-mono text-yellow-400">
                        <Zap className="w-4 h-4 fill-yellow-400" />
                        {currentSlideIndex + 1}/{totalSlides}
                    </div>
                    <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-12 gap-8">
                
                {/* Left Col: Slide & Interactive (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Text Card */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                         <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold text-white">{currentSlide.title}</h2>
                            {currentSlide.interactive && (
                                <span className="animate-pulse text-xs font-bold text-yellow-400 uppercase tracking-wide px-2 py-1 bg-yellow-900/20 rounded border border-yellow-500/30">
                                    Interactive
                                </span>
                            )}
                         </div>
                         <p className="text-slate-400 text-lg leading-relaxed">{currentSlide.content}</p>
                    </div>

                    {/* Interactive Area */}
                    <div className="flex-1 min-h-[500px]">
                        {renderInteractiveArea()}
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <button 
                            onClick={prevSlide}
                            disabled={currentSlideIndex === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" /> Prev
                        </button>

                        <div className="flex gap-1.5">
                            {Array.from({ length: totalSlides }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        idx === currentSlideIndex 
                                            ? 'bg-yellow-500 scale-125 shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                                            : completedSlides.includes(idx) 
                                                ? 'bg-yellow-900/50' 
                                                : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={nextSlide}
                            disabled={currentSlideIndex === totalSlides - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-yellow-900/20"
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Col: Info Panel (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                    <EnzymeInfoPanel 
                        conceptId={currentSlide.focusConcept || null}
                        depth={depth}
                        onDepthChange={setDepth}
                        onSaveNote={saveNote}
                    />
                </div>

            </div>

            {/* Mobile Nav */}
            <div className="md:hidden sticky bottom-0 bg-slate-950 border-t border-slate-800 p-4 flex justify-between items-center z-30">
                 <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="p-3 bg-slate-800 rounded-full text-white disabled:opacity-50">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lesson Progress</span>
                    <div className="flex gap-1 mt-1">
                         {Array.from({ length: Math.min(5, totalSlides) }).map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full ${i <= currentSlideIndex ? 'bg-yellow-500' : 'bg-slate-700'}`} />
                         ))}
                    </div>
                </div>
                <button onClick={nextSlide} disabled={currentSlideIndex === totalSlides - 1} className="p-3 bg-yellow-600 rounded-full text-white disabled:opacity-50 shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default EnzymesLesson;
