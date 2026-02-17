
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Menu, Activity, X } from 'lucide-react';
import CellDiagram from './CellDiagram';
import OrganellePanel from './OrganellePanel';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { ORGANELLES, DepthLevel, LESSON_SLIDES } from '../data/cellBiologyData';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';
import { quizService } from '../services/quizData';
import { videoService } from '../services/videoService';
import { Quiz, LessonVideo } from '../types';

interface Props {
    onBack: () => void;
}

const CellBiologyLesson: React.FC<Props> = ({ onBack }) => {
    const { 
        currentSlide, 
        currentSlideIndex, 
        totalSlides, 
        nextSlide, 
        prevSlide, 
        goToSlide,
        completedSlides, 
        saveNote 
    } = useLessonProgress('cell_biology', LESSON_SLIDES);

    const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);
    const [depth, setDepth] = useState<DepthLevel>('medium');
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    
    // Modal States
    const [activeVideo, setActiveVideo] = useState<LessonVideo | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

    // Auto-focus organelle if slide dictates it
    useEffect(() => {
        if (currentSlide.focusOrganelle) {
            setSelectedOrganelleId(currentSlide.focusOrganelle);
        }
    }, [currentSlide]);

    const handleOrganelleClick = (id: string) => {
        setSelectedOrganelleId(id);
    };

    const handleWatchVideo = async (organelleId: string, title: string) => {
        const videos = await videoService.getVideos('cell_biology', organelleId);
        if (videos.length > 0) {
            setActiveVideo(videos[0]); // Play the first one
        } else {
            // Check for general lesson video if specific not found
            const general = await videoService.getVideos('cell_biology');
            if (general.length > 0) {
                setActiveVideo(general[0]);
            } else {
                alert("No videos available for this topic yet.");
            }
        }
    };

    const handleQuizMe = (organelleId: string, title: string) => {
        const miniQuiz = quizService.generateMiniQuiz('cell_biology', title);
        if (miniQuiz && miniQuiz.questions.length > 0) {
            setActiveQuiz(miniQuiz);
        } else {
            alert("No quiz questions found for this specific organelle.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            Cell Biology <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Module 1</span>
                        </h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm font-mono text-cyan-400">
                        <Zap className="w-4 h-4 fill-cyan-400" />
                        {currentSlideIndex + 1}/{totalSlides}
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-slate-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-12 gap-8">
                
                {/* Left Col: Slides & Diagram (8 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    
                    {/* Slide Context */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                         <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold text-white">{currentSlide.title}</h2>
                            {currentSlide.interactive && (
                                <span className="animate-pulse text-xs font-bold text-cyan-400 uppercase tracking-wide px-2 py-1 bg-cyan-900/20 rounded border border-cyan-500/30">
                                    Interactive
                                </span>
                            )}
                         </div>
                         <p className="text-slate-400 text-lg leading-relaxed">{currentSlide.content}</p>
                    </div>

                    {/* Interactive Diagram */}
                    <div className="flex-1 min-h-[400px]">
                        <CellDiagram 
                            highlightedOrganelle={selectedOrganelleId} 
                            onOrganelleClick={handleOrganelleClick} 
                        />
                    </div>

                    {/* Navigation Controls (Desktop) */}
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
                                            ? 'bg-cyan-500 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                                            : completedSlides.includes(idx) 
                                                ? 'bg-green-500/50' 
                                                : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={nextSlide}
                            disabled={currentSlideIndex === totalSlides - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-cyan-900/20"
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Col: Deep Dive Panel (4 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                    <OrganellePanel 
                        organelle={selectedOrganelleId ? ORGANELLES[selectedOrganelleId] : null}
                        depth={depth}
                        onDepthChange={setDepth}
                        onSaveNote={saveNote}
                        onWatchVideo={handleWatchVideo}
                        onQuizMe={handleQuizMe}
                    />
                </div>

            </div>

            {/* Mobile Navigation Footer (Sticky) */}
            <div className="md:hidden sticky bottom-0 bg-slate-950 border-t border-slate-800 p-4 flex justify-between items-center z-30">
                 <button 
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-3 bg-slate-800 rounded-full text-white disabled:opacity-50"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Lesson Progress</span>
                    <div className="flex gap-1 mt-1">
                         {Array.from({ length: Math.min(5, totalSlides) }).map((_, i) => (
                             // Simplified dots for mobile
                             <div key={i} className={`w-2 h-2 rounded-full ${i <= currentSlideIndex ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                         ))}
                    </div>
                </div>

                <button 
                    onClick={nextSlide}
                    disabled={currentSlideIndex === totalSlides - 1}
                    className="p-3 bg-cyan-600 rounded-full text-white disabled:opacity-50 shadow-lg"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Modals */}
            {activeVideo && (
                <VideoPlayer 
                    url={activeVideo.youtubeUrl} 
                    title={activeVideo.title} 
                    onClose={() => setActiveVideo(null)} 
                />
            )}

            {activeQuiz && (
                <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={() => setActiveQuiz(null)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <QuizPlayer 
                            customQuiz={activeQuiz} 
                            onClose={() => setActiveQuiz(null)} 
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default CellBiologyLesson;
