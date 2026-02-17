
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Menu, Leaf } from 'lucide-react';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { ECOLOGY_SLIDES, DepthLevel } from '../data/ecologyData';
import FoodWebBuilder from './ecology/FoodWebBuilder';
import EcosystemSim from './ecology/EcosystemSim';
import CarbonCycleSim from './ecology/CarbonCycleSim';
import EcologyInfoPanel from './ecology/EcologyInfoPanel';

interface Props {
    onBack: () => void;
}

const EcologyLesson: React.FC<Props> = ({ onBack }) => {
    const { 
        currentSlide, 
        currentSlideIndex, 
        totalSlides, 
        nextSlide, 
        prevSlide, 
        goToSlide,
        completedSlides, 
        saveNote 
    } = useLessonProgress('ecology', ECOLOGY_SLIDES);

    const [depth, setDepth] = useState<DepthLevel>('medium');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderInteractiveArea = () => {
        switch (currentSlide.simType) {
            case 'web_builder':
                return <FoodWebBuilder />;
            case 'ecosystem_sim':
                return <EcosystemSim />;
            case 'carbon_cycle':
                return <CarbonCycleSim />;
            default:
                return (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-6 animate-pulse">
                            <Leaf className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{currentSlide.title}</h3>
                        <p className="text-slate-400 max-w-md">Explore the web of life using the interactive tools and information panel.</p>
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
                            Ecology & Ecosystems <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded border border-green-500/30">Module 7</span>
                        </h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm font-mono text-green-400">
                        <Zap className="w-4 h-4 fill-green-400" />
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
                                <span className="animate-pulse text-xs font-bold text-green-400 uppercase tracking-wide px-2 py-1 bg-green-900/20 rounded border border-green-500/30">
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
                                            ? 'bg-green-500 scale-125 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                                            : completedSlides.includes(idx) 
                                                ? 'bg-green-900/50' 
                                                : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={nextSlide}
                            disabled={currentSlideIndex === totalSlides - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-green-900/20"
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Col: Info Panel (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                    <EcologyInfoPanel 
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
                             <div key={i} className={`w-2 h-2 rounded-full ${i <= currentSlideIndex ? 'bg-green-500' : 'bg-slate-700'}`} />
                         ))}
                    </div>
                </div>
                <button onClick={nextSlide} disabled={currentSlideIndex === totalSlides - 1} className="p-3 bg-green-600 rounded-full text-white disabled:opacity-50 shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default EcologyLesson;
