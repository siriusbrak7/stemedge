
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Badge, UserBadge, UserStreak } from '../types';
import { studentDataService } from './studentDataService';
import { labService } from './labService';

const BADGES_KEY = 'stemedge_user_badges';
const STREAK_KEY = 'stemedge_user_streaks';

const BADGE_DEFINITIONS: Badge[] = [
    // STREAK BADGES
    { id: 'streak_3', name: 'Ignition', description: 'Log in for 3 days in a row.', iconName: 'flame', category: 'streak', xpValue: 50, conditionType: 'streak_days', conditionValue: 3 },
    { id: 'streak_7', name: 'Momentum', description: 'Log in for 7 days in a row.', iconName: 'rocket', category: 'streak', xpValue: 100, conditionType: 'streak_days', conditionValue: 7 },
    { id: 'streak_14', name: 'Orbit', description: 'Log in for 14 days in a row.', iconName: 'rocket', category: 'streak', xpValue: 250, conditionType: 'streak_days', conditionValue: 14 },

    // MASTERY BADGES
    { id: 'mastery_cell_novice', name: 'Cell Novice', description: 'Complete the Cellular Biology lesson.', iconName: 'brain', category: 'mastery', xpValue: 50, conditionType: 'lesson_complete', conditionValue: 'cell_biology' },
    { id: 'mastery_cell_expert', name: 'Cell Master', description: 'Score 90% or higher on the Cell Biology quiz.', iconName: 'medal', category: 'mastery', xpValue: 150, conditionType: 'quiz_score_gt', conditionValue: 'cell_biology', secondaryValue: 90 },
    { id: 'mastery_enzyme_novice', name: 'Enzyme Explorer', description: 'Complete the Enzymes lesson.', iconName: 'brain', category: 'mastery', xpValue: 50, conditionType: 'lesson_complete', conditionValue: 'enzymes' },
    { id: 'mastery_enzyme_expert', name: 'Enzyme Expert', description: 'Score 90% or higher on the Enzymes quiz.', iconName: 'medal', category: 'mastery', xpValue: 150, conditionType: 'quiz_score_gt', conditionValue: 'enzymes', secondaryValue: 90 },

    // LAB BADGES
    { id: 'lab_assistant', name: 'Lab Assistant', description: 'Complete your first Virtual Lab.', iconName: 'flask', category: 'lab', xpValue: 75, conditionType: 'lab_complete', conditionValue: 1 },
];

export const gamificationService = {
    
    getAllBadges: () => BADGE_DEFINITIONS,

    getUserBadges: (usernameOrId: string): UserBadge[] => {
        const stored = localStorage.getItem(BADGES_KEY);
        const allBadges = stored ? JSON.parse(stored) : {};
        return allBadges[usernameOrId] || [];
    },

    fetchBadgesAsync: async (userId: string): Promise<UserBadge[]> => {
        if (isSupabaseConfigured() && supabase) {
            const { data } = await supabase.from('user_badges').select('*').eq('user_id', userId);
            if (data) {
                const badges: UserBadge[] = data.map((b: any) => ({
                    badgeId: b.badge_id,
                    dateEarned: new Date(b.date_earned).getTime()
                }));
                const stored = localStorage.getItem(BADGES_KEY);
                const allBadges = stored ? JSON.parse(stored) : {};
                allBadges[userId] = badges;
                localStorage.setItem(BADGES_KEY, JSON.stringify(allBadges));
                return badges;
            }
        }
        return gamificationService.getUserBadges(userId);
    },

    getUserStreak: (usernameOrId: string): UserStreak => {
        const stored = localStorage.getItem(STREAK_KEY);
        const allStreaks = stored ? JSON.parse(stored) : {};
        return allStreaks[usernameOrId] || { currentStreak: 0, longestStreak: 0, lastActivityDate: '', history: [] };
    },

    updateStreak: (userId: string): UserStreak => {
        // Local Calculation
        const stored = localStorage.getItem(STREAK_KEY);
        const allStreaks = stored ? JSON.parse(stored) : {};
        
        let streak: UserStreak = allStreaks[userId] || { 
            currentStreak: 0, 
            longestStreak: 0, 
            lastActivityDate: '',
            history: []
        };

        const today = new Date().toISOString().split('T')[0];
        
        if (!streak.lastActivityDate) {
            streak.currentStreak = 1;
            streak.longestStreak = 1;
            streak.lastActivityDate = today;
            streak.history = [today];
        } else if (streak.lastActivityDate !== today) {
            const lastDate = new Date(streak.lastActivityDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak.currentStreak += 1;
                if (streak.currentStreak > streak.longestStreak) streak.longestStreak = streak.currentStreak;
            } else if (diffDays > 1) {
                streak.currentStreak = 1;
            }
            streak.lastActivityDate = today;
            if (!streak.history.includes(today)) {
                streak.history.push(today);
            }
        }

        allStreaks[userId] = streak;
        localStorage.setItem(STREAK_KEY, JSON.stringify(allStreaks));

        // Supabase Sync
        if (isSupabaseConfigured() && supabase && !userId.startsWith('demo-') && !userId.startsWith('local-')) {
            supabase.from('user_streaks').upsert({
                user_id: userId,
                current_streak: streak.currentStreak,
                longest_streak: streak.longestStreak,
                last_activity_date: today,
                history: streak.history
            }).then(({ error }) => {
                if(error) console.error("Streak Sync Error", error);
            });
        }

        return streak;
    },

    checkForNewBadges: async (userId: string): Promise<Badge[]> => {
        const existingBadges = gamificationService.getUserBadges(userId);
        const streak = gamificationService.getUserStreak(userId);
        const dashboardData = await studentDataService.getDashboardData(userId);
        const labs = labService.getStudentAttempts(userId); 
        const completedLabsCount = new Set(labs.filter(l => l.isCompleted).map(l => l.labId)).size;

        const newBadges: Badge[] = [];

        BADGE_DEFINITIONS.forEach(def => {
            if (existingBadges.find(ub => ub.badgeId === def.id)) return;

            let earned = false;
            switch (def.conditionType) {
                case 'streak_days':
                    if (streak.currentStreak >= (def.conditionValue as number)) earned = true;
                    break;
                case 'lesson_complete':
                    const topicProgress = dashboardData.progress[def.conditionValue as string];
                    if (topicProgress && topicProgress.isCompleted) earned = true;
                    break;
                case 'quiz_score_gt':
                    const quizTopicProgress = dashboardData.progress[def.conditionValue as string];
                    if (quizTopicProgress && quizTopicProgress.quizScore !== undefined && quizTopicProgress.quizScore >= (def.secondaryValue || 0)) earned = true;
                    break;
                case 'lab_complete':
                    if (completedLabsCount >= (def.conditionValue as number)) earned = true;
                    break;
            }

            if (earned) {
                newBadges.push(def);
                const badgeRecord = { badgeId: def.id, dateEarned: Date.now() };
                existingBadges.push(badgeRecord);

                // Supabase Insert
                if (isSupabaseConfigured() && supabase && !userId.startsWith('demo-') && !userId.startsWith('local-')) {
                    supabase.from('user_badges').insert({
                        user_id: userId,
                        badge_id: def.id,
                        date_earned: new Date().toISOString()
                    }).then(({ error }) => {
                        if(error) console.error("Badge Earn Error", error);
                    });
                }
            }
        });

        if (newBadges.length > 0) {
            const stored = localStorage.getItem(BADGES_KEY);
            const allBadges = stored ? JSON.parse(stored) : {};
            allBadges[userId] = existingBadges;
            localStorage.setItem(BADGES_KEY, JSON.stringify(allBadges));
        }

        return newBadges;
    }
};
