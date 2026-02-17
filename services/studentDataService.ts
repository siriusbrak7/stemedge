
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DashboardData, Topic, UserTopicProgress } from '../types';

// Static curriculum definition (could also be in DB)
const BIOLOGY_CURRICULUM: Topic[] = [
    { id: 'cell_biology', title: 'Cellular Biology', description: 'Understand the building blocks of life.', iconName: 'microscope', totalLessons: 12, difficulty: 'Beginner' },
    { id: 'plant_nutrition', title: 'Plant Nutrition', description: 'Photosynthesis and leaf structure.', iconName: 'leaf', totalLessons: 15, difficulty: 'Intermediate' },
    { id: 'human_body', title: 'Human Physiology', description: 'Digestive and Respiratory systems.', iconName: 'activity', totalLessons: 12, difficulty: 'Intermediate' },
    { id: 'enzymes', title: 'Enzymes & Metabolism', description: 'Biological catalysts in action.', iconName: 'zap', totalLessons: 10, difficulty: 'Intermediate' },
    { id: 'inheritance', title: 'Genetics & Heredity', description: 'DNA, inheritance, and evolution.', iconName: 'dna', totalLessons: 15, difficulty: 'Advanced' },
    { id: 'evolution', title: 'Evolution', description: 'Natural selection and adaptation.', iconName: 'dna', totalLessons: 10, difficulty: 'Advanced' },
    { id: 'ecology', title: 'Ecology', description: 'Ecosystems and food webs.', iconName: 'leaf', totalLessons: 12, difficulty: 'Beginner' }
];

export const studentDataService = {
    getDashboardData: async (userIdOrUsername: string): Promise<DashboardData> => {
        let progressMap: Record<string, UserTopicProgress> = {};

        // 1. Try Supabase Network
        if (navigator.onLine && isSupabaseConfigured() && supabase) {
            try {
                const { data: session } = await supabase.auth.getSession();
                if (session.session) {
                    const { data, error } = await supabase
                        .from('progress')
                        .select('*')
                        .eq('user_id', session.session.user.id);

                    if (!error && data) {
                        data.forEach((row: any) => {
                            progressMap[row.topic_id] = {
                                topicId: row.topic_id,
                                completedLessons: row.completed_lessons,
                                quizScore: row.quiz_score,
                                lastAccessed: new Date(row.last_accessed).getTime(),
                                isCompleted: row.is_completed
                            };
                        });
                        // Cache for offline
                        localStorage.setItem(`dashboard_${session.session.user.id}`, JSON.stringify(progressMap));
                        
                        return {
                            topics: BIOLOGY_CURRICULUM,
                            progress: progressMap,
                            achievements: [] 
                        };
                    }
                }
            } catch (e) {
                console.warn("Supabase fetch failed", e);
            }
        }

        // 2. Fallback Cache / Local Demo Data
        const cacheKey = `dashboard_${userIdOrUsername}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            progressMap = JSON.parse(cached);
        } else {
            // SEED DEMO DATA
            const lowerId = userIdOrUsername.toLowerCase();
            if (lowerId === 'annabel') {
                progressMap = {
                    'cell_biology': { topicId: 'cell_biology', completedLessons: 8, quizScore: 85, lastAccessed: Date.now() - 3600000, isCompleted: false },
                    'plant_nutrition': { topicId: 'plant_nutrition', completedLessons: 2, quizScore: undefined, lastAccessed: Date.now() - 86400000, isCompleted: false }
                };
            }
        }

        return {
            topics: BIOLOGY_CURRICULUM,
            progress: progressMap,
            achievements: [] 
        };
    },

    updateProgress: async (userIdOrUsername: string, topicId: string, lessonsCompleted: number, quizScore?: number) => {
        const topic = BIOLOGY_CURRICULUM.find(t => t.id === topicId);
        if (!topic) return;

        const updateData = {
            topic_id: topicId,
            completed_lessons: lessonsCompleted,
            quiz_score: quizScore,
            is_completed: lessonsCompleted >= topic.totalLessons,
            last_accessed: new Date().toISOString()
        };

        // 1. Network Write
        if (navigator.onLine && isSupabaseConfigured() && supabase) {
            const { data: session } = await supabase.auth.getSession();
            if (session.session) {
                const { error } = await supabase
                    .from('progress')
                    .upsert({ ...updateData, user_id: session.session.user.id }, { onConflict: 'user_id, topic_id' });
                
                if (error) console.error("Progress sync error:", error);
            }
        }

        // 2. Local Cache Update
        const cacheKey = `dashboard_${userIdOrUsername}`;
        const cached = localStorage.getItem(cacheKey);
        const map = cached ? JSON.parse(cached) : {};
        
        map[topicId] = {
            topicId,
            completedLessons: lessonsCompleted,
            quizScore: quizScore,
            lastAccessed: Date.now(),
            isCompleted: updateData.is_completed
        };
        localStorage.setItem(cacheKey, JSON.stringify(map));
    }
};
