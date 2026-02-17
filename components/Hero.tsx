
import React from 'react';
import { ChevronRight, PlayCircle, Users, Brain, Activity, Star } from 'lucide-react';

interface HeroProps {
    onOpenAuth: () => void;
    onWatchDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth, onWatchDemo }) => {
  return (
    <div id="mission" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden w-full z-10">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-300 text-xs font-semibold tracking-wide uppercase">AI-Powered Learning Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Explore the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            Universe of Knowledge
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
          StemEdge is your launchpad for mastering Science, Technology, Engineering, and Math. 
          Powered by AI, designed for the stars of tomorrow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button 
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2 hover:scale-105"
          >
            Start Learning
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onWatchDemo}
            className="px-8 py-4 rounded-full bg-slate-800/50 text-white font-medium text-lg border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2 backdrop-blur-sm group"
          >
            <PlayCircle className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            Watch Demo
          </button>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center hover:border-purple-500/30 transition-colors">
                <Users className="w-6 h-6 text-purple-400 mb-2" />
                <span className="text-2xl font-bold text-white">10k+</span>
                <span className="text-slate-500 text-xs uppercase tracking-wider">Active Learners</span>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center hover:border-cyan-500/30 transition-colors">
                <Brain className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="text-2xl font-bold text-white">500k+</span>
                <span className="text-slate-500 text-xs uppercase tracking-wider">Concepts Mastered</span>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center hover:border-pink-500/30 transition-colors">
                <Activity className="w-6 h-6 text-pink-400 mb-2" />
                <span className="text-2xl font-bold text-white">1M+</span>
                <span className="text-slate-500 text-xs uppercase tracking-wider">AI Interactions</span>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center hover:border-yellow-500/30 transition-colors">
                <Star className="w-6 h-6 text-yellow-400 mb-2 fill-yellow-400" />
                <span className="text-2xl font-bold text-white">4.9/5</span>
                <span className="text-slate-500 text-xs uppercase tracking-wider">User Rating</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

