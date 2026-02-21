import React, { useState } from 'react';
import Hero from './Hero';
import Features from './Features';
import AuthModal from './AuthModal';
import { Sparkles, ArrowRight } from 'lucide-react';

const Homepage: React.FC = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    
    return (
        <div className="flex flex-col w-full">
            <Hero 
                onOpenAuth={() => setIsAuthOpen(true)}
                onWatchDemo={() => {}}
            />
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
            
            <Features />
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-900/50 to-transparent" />

            <section id="tutor" className="py-24 relative overflow-hidden bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-slate-900 border border-purple-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-sm font-medium mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Sirius</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Meet Sirius, Your Learning Assistant
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    Sirius remembers your learning style, tracks your progress across modules, 
                                    and illuminates the path to mastery.
                                </p>
                                <button 
                                    onClick={() => setIsAuthOpen(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-purple-900/50"
                                >
                                    Access Sirius <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="relative flex justify-center">
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                                    <svg viewBox="0 0 100 100" className="w-48 h-48 animate-spin-slow">
                                        <path d="M50 0 L61 35 L98 35 L68 57 L79 92 L50 72 L21 92 L32 57 L2 35 L39 35 Z" fill="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                                        <circle cx="50" cy="50" r="5" fill="#a5f3fc" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />
        </div>
    );
};

export default Homepage;