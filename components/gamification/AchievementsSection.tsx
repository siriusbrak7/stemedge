import React from 'react';
import { Badge, UserBadge } from '../../types';
import { Award, Flame, Rocket, Medal, FlaskConical, Brain, Target, Clock } from 'lucide-react';

interface Props {
    badges: Badge[];
    userBadges: UserBadge[];
}

const AchievementsSection: React.FC<Props> = ({ badges, userBadges }) => {
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
    const earnedCount = earnedBadgeIds.size;

    const getIcon = (iconName: string) => {
        switch(iconName) {
            case 'flame': return <Flame className="w-5 h-5" />;
            case 'rocket': return <Rocket className="w-5 h-5" />;
            case 'medal': return <Medal className="w-5 h-5" />;
            case 'flask': return <FlaskConical className="w-5 h-5" />;
            case 'brain': return <Brain className="w-5 h-5" />;
            case 'target': return <Target className="w-5 h-5" />;
            case 'clock': return <Clock className="w-5 h-5" />;
            default: return <Award className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white">Achievements</h2>
                </div>
                <span className="text-sm text-slate-400">
                    {earnedCount}/{badges.length} Unlocked
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {badges.map(badge => {
                    const earned = earnedBadgeIds.has(badge.id);
                    const earnedDate = userBadges.find(ub => ub.badgeId === badge.id)?.dateEarned;

                    return (
                        <div
                            key={badge.id}
                            className={`
                                relative p-4 rounded-xl border transition-all group
                                ${earned 
                                    ? 'bg-gradient-to-br from-amber-900/20 to-purple-900/20 border-amber-500/50 hover:border-amber-400' 
                                    : 'bg-slate-800/50 border-slate-700 opacity-50 grayscale'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                                    ${earned ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-500'}
                                `}>
                                    {getIcon(badge.iconName)}
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{badge.name}</h3>
                                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{badge.description}</p>
                                <div className="text-xs font-mono">
                                    {earned ? (
                                        <span className="text-amber-400">
                                            +{badge.xpValue} XP
                                        </span>
                                    ) : (
                                        <span className="text-slate-600">
                                            {badge.xpValue} XP
                                        </span>
                                    )}
                                </div>
                                {earnedDate && (
                                    <div className="absolute top-1 right-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {/* Tooltip on hover */}
                            {!earned && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {badge.description}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Recent unlocks notification */}
            {userBadges.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500">
                        Latest: {badges.find(b => b.id === userBadges[userBadges.length - 1]?.badgeId)?.name}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AchievementsSection;
