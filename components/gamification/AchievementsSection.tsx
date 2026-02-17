import React, { useState } from 'react';
import { Badge, UserBadge } from '../../types';
import { Trophy, Lock, Rocket, Flame, Medal, FlaskConical, Brain, X } from 'lucide-react';

interface Props {
    badges: Badge[];
    userBadges: UserBadge[];
}

const AchievementsSection: React.FC<Props> = ({ badges, userBadges }) => {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Helper to map icon names to components
    const renderIcon = (name: Badge['iconName'], className: string) => {
        switch (name) {
            case 'rocket': return <Rocket className={className} />;
            case 'flame': return <Flame className={className} />;
            case 'medal': return <Medal className={className} />;
            case 'flask': return <FlaskConical className={className} />;
            case 'brain': return <Brain className={className} />;
            default: return <Trophy className={className} />;
        }
    };

    // Sort badges: Earned first, then by XP value
    const sortedBadges = [...badges].sort((a, b) => {
        const aEarned = userBadges.some(ub => ub.badgeId === a.id);
        const bEarned = userBadges.some(ub => ub.badgeId === b.id);
        if (aEarned && !bEarned) return -1;
        if (!aEarned && bEarned) return 1;
        return b.xpValue - a.xpValue;
    });

    return (
        <section className="mb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white tracking-wide">Achievements</h2>
                    <span className="ml-2 px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full font-mono">
                        {userBadges.length}/{badges.length} Unlocked
                    </span>
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                    {isCollapsed ? 'Show All' : 'Collapse'}
                </button>
            </div>

            {!isCollapsed && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {sortedBadges.map(badge => {
                        const earnedData = userBadges.find(ub => ub.badgeId === badge.id);
                        const isEarned = !!earnedData;

                        return (
                            <div 
                                key={badge.id}
                                onClick={() => setSelectedBadge(badge)}
                                className={`relative group p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all hover:-translate-y-1 ${
                                    isEarned 
                                        ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-yellow-500/50 shadow-lg' 
                                        : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    isEarned 
                                        ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                        : 'bg-slate-800 text-slate-600 border border-slate-700'
                                }`}>
                                    {isEarned ? renderIcon(badge.iconName, "w-6 h-6") : <Lock className="w-5 h-5" />}
                                </div>
                                
                                <div>
                                    <h4 className={`text-sm font-bold leading-tight ${isEarned ? 'text-white' : 'text-slate-500'}`}>
                                        {badge.name}
                                    </h4>
                                    {isEarned && (
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            {new Date(earnedData.dateEarned).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BADGE DETAIL MODAL */}
            {selectedBadge && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedBadge(null)} />
                    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up">
                        <button 
                            onClick={() => setSelectedBadge(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                            userBadges.some(ub => ub.badgeId === selectedBadge.id)
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
                                : 'bg-slate-800 border border-slate-700 text-slate-600'
                        }`}>
                            {renderIcon(selectedBadge.iconName, "w-10 h-10")}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h3>
                        <div className="inline-block px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 mb-4">
                            {selectedBadge.xpValue} XP
                        </div>
                        
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            {selectedBadge.description}
                        </p>

                        <div className="pt-6 border-t border-slate-800">
                            {userBadges.some(ub => ub.badgeId === selectedBadge.id) ? (
                                <p className="text-green-400 font-bold text-sm flex items-center justify-center gap-2">
                                    <Medal className="w-4 h-4" /> Earned on {new Date(userBadges.find(ub => ub.badgeId === selectedBadge.id)!.dateEarned).toLocaleDateString()}
                                </p>
                            ) : (
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Locked</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AchievementsSection;