
import React from 'react';
import { Send, Search, Bot } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative bg-slate-950 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Tools for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Modern Explorer</span>
                </h2>
                <p className="text-slate-400 text-lg">
                    Everything you need to propel your education into hyperspace. 
                    Built with cutting-edge technology for the next generation.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* FEATURE 1: INTERACTIVE LESSONS */}
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col">
                    {/* Visual Mock Area */}
                    <div className="h-64 bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 to-slate-950 opacity-50"></div>
                        
                        {/* Mock Cell UI */}
                        <div className="relative w-full max-w-[280px] aspect-square bg-slate-900 rounded-xl border border-slate-700 shadow-2xl p-3 flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase">Cell Biology</span>
                                <div className="w-16 h-1 bg-slate-700 rounded-full"><div className="w-1/2 h-full bg-cyan-500 rounded-full"></div></div>
                            </div>
                            
                            {/* Diagram */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-lg animate-pulse-slow">
                                    <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                                    {/* Nucleus */}
                                    <circle cx="50" cy="50" r="12" fill="#9333ea" stroke="#a855f7" strokeWidth="1" />
                                    {/* Mitochondria */}
                                    <ellipse cx="75" cy="65" rx="8" ry="4" fill="#f59e0b" transform="rotate(45 75 65)" />
                                    <ellipse cx="25" cy="35" rx="8" ry="4" fill="#f59e0b" transform="rotate(-45 25 35)" />
                                </svg>
                                
                                {/* Info Panel Mock (Floating) */}
                                <div className="absolute bottom-0 right-0 bg-slate-800/90 backdrop-blur border border-slate-600 p-2 rounded-lg w-28 shadow-xl transform translate-y-2 translate-x-2">
                                    <div className="text-[10px] font-bold text-white mb-1">Nucleus</div>
                                    <div className="h-1 w-full bg-slate-700 rounded mb-1"></div>
                                    <div className="h-1 w-2/3 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-white mb-3">Interactive Lessons</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Dive deep into biological cells with our immersive, interactive modules that make learning stick. Visual, tactile, and unforgettable.
                        </p>
                    </div>
                </div>

                {/* FEATURE 2: AI PERSONAL TUTOR */}
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] flex flex-col">
                    {/* Visual Mock Area */}
                    <div className="h-64 bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-slate-950 opacity-50"></div>
                        
                        {/* Mock Chat UI */}
                        <div className="relative w-full max-w-[260px] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl flex flex-col h-[200px]">
                            {/* Chat Header */}
                            <div className="p-3 border-b border-slate-800 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Bot className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-bold text-white">Nova AI</span>
                            </div>
                            
                            {/* Chat Body */}
                            <div className="flex-1 p-3 space-y-3">
                                <div className="flex gap-2">
                                    <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-700 max-w-[80%]">
                                        <div className="h-1.5 w-24 bg-slate-600 rounded mb-1"></div>
                                        <div className="h-1.5 w-16 bg-slate-600 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-purple-600 p-2 rounded-lg rounded-tr-none text-[10px] text-white">
                                        How do mitochondria work?
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-700 max-w-[90%] text-[9px] text-slate-300 leading-tight">
                                        They act as the powerhouse of the cell...
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                                <div className="h-8 bg-slate-800 rounded-lg flex items-center px-2 justify-between">
                                    <div className="w-16 h-1.5 bg-slate-700 rounded"></div>
                                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Send className="w-2 h-2 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-white mb-3">AI Personal Tutor</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Nova AI is available 24/7 to answer questions, explain concepts, and quiz you on what you've just learned.
                        </p>
                    </div>
                </div>

                {/* FEATURE 3: VIRTUAL LABS */}
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] flex flex-col">
                    {/* Visual Mock Area */}
                    <div className="h-64 bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 to-slate-950 opacity-50"></div>
                        
                        {/* Mock Lab UI */}
                        <div className="relative w-full max-w-[280px] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl p-3 flex gap-3 h-[180px]">
                            {/* Viewport */}
                            <div className="flex-1 bg-black rounded-lg border border-slate-600 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-50 flex items-center justify-center">
                                    {/* Blurred Cells */}
                                    <div className="w-8 h-8 bg-green-500/40 rounded-full blur-sm absolute top-4 left-4"></div>
                                    <div className="w-10 h-10 bg-green-500/40 rounded-full blur-sm absolute bottom-6 right-6"></div>
                                    <div className="w-6 h-6 bg-green-500/40 rounded-full blur-sm absolute top-10 right-10"></div>
                                </div>
                                {/* Scope overlay */}
                                <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1)]"></div>
                            </div>

                            {/* Sidebar Controls */}
                            <div className="w-16 flex flex-col gap-3 justify-center">
                                <div className="space-y-1">
                                    <div className="text-[8px] text-slate-500 uppercase font-bold text-center">Focus</div>
                                    <div className="h-20 bg-slate-800 rounded-full relative mx-auto w-1.5">
                                        <div className="absolute top-8 w-3 h-3 bg-amber-500 rounded-full -left-[3px] shadow-lg"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[8px] text-slate-500 uppercase font-bold text-center">Stain</div>
                                    <div className="w-full aspect-square bg-blue-900/50 border border-blue-500 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-white mb-3">Virtual Labs</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Conduct experiments safely with our interactive lab simulations. Identify cells, mix chemicals, and observe reactions in real-time.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default Features;
