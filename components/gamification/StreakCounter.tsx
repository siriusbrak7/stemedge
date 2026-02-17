import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { UserStreak } from '../../types';

interface Props {
    streak: UserStreak | null;
}

const StreakCounter: React.FC<Props> = ({ streak }) => {
    const [showCalendar, setShowCalendar] = useState(false);

    if (!streak) return null;

    // Generate last 14 days for calendar view
    const getLast14Days = () => {
        const days = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const isActive = streak.history.includes(dateStr);
            const isToday = i === 0;
            days.push({ date: d, isActive, isToday });
        }
        return days;
    };

    const calendarDays = getLast14Days();

    return (
        <div className="relative">
            <button 
                onClick={() => setShowCalendar(!showCalendar)}
                onBlur={() => setTimeout(() => setShowCalendar(false), 200)}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-900/20 border border-orange-500/30 rounded-full hover:bg-orange-900/30 transition-colors group"
            >
                <Flame className={`w-4 h-4 ${streak.currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-500'}`} />
                <span className={`text-sm font-bold ${streak.currentStreak > 0 ? 'text-orange-400' : 'text-slate-400'}`}>
                    {streak.currentStreak} Day Streak
                </span>
            </button>

            {/* Dropdown Calendar */}
            {showCalendar && (
                <div className="absolute top-full right-0 mt-2 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-64 z-50 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">Activity Log</span>
                        <span className="text-xs text-orange-400 font-bold">{streak.longestStreak} Day Best</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                        day.isActive 
                                            ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_8px_rgba(249,115,22,0.4)]' 
                                            : day.isToday
                                                ? 'bg-slate-800 border-slate-600 text-slate-400 border-dashed'
                                                : 'bg-slate-800 border-slate-700 text-slate-600'
                                    }`}
                                >
                                    {day.date.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-[10px] text-slate-500">Keep it up! Learning every day boosts retention.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakCounter;