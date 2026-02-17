
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LessonVideo } from '../types';

const VIDEO_KEY = 'stemedge_lesson_videos';

// Default Educational Videos (Seed Data)
const DEFAULT_VIDEOS: LessonVideo[] = [
    {
        id: 'vid-1',
        lessonId: 'cell_biology',
        slideId: 'nucleus',
        youtubeUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M', // Placeholder educational URL
        title: 'The Nucleus: Control Center',
        addedBy: 'system',
        createdAt: Date.now()
    },
    {
        id: 'vid-2',
        lessonId: 'cell_biology',
        slideId: 'mitochondria',
        youtubeUrl: 'https://www.youtube.com/watch?v=rrS5h69G3F8',
        title: 'Mitochondria: Powerhouse',
        addedBy: 'system',
        createdAt: Date.now()
    },
    {
        id: 'vid-3',
        lessonId: 'cell_biology',
        slideId: 'chloroplast',
        youtubeUrl: 'https://www.youtube.com/watch?v=KfvYQgT2M-k',
        title: 'Photosynthesis in Chloroplasts',
        addedBy: 'system',
        createdAt: Date.now()
    }
];

export const videoService = {
    getVideos: async (lessonId: string, slideId?: string): Promise<LessonVideo[]> => {
        // 1. Try Supabase
        if (isSupabaseConfigured() && supabase) {
            try {
                let query = supabase.from('lesson_videos').select('*').eq('lesson_id', lessonId);
                if (slideId) {
                    query = query.eq('slide_id', slideId);
                }
                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    return data.map((v: any) => ({
                        id: v.id,
                        lessonId: v.lesson_id,
                        slideId: v.slide_id,
                        youtubeUrl: v.youtube_url,
                        title: v.title,
                        addedBy: v.added_by,
                        createdAt: new Date(v.created_at).getTime()
                    }));
                }
            } catch (e) {
                console.warn("Video fetch failed, falling back to local");
            }
        }

        // 2. Local/Mock
        const stored = localStorage.getItem(VIDEO_KEY);
        const locals: LessonVideo[] = stored ? JSON.parse(stored) : [];
        const allVideos = [...DEFAULT_VIDEOS, ...locals];

        return allVideos.filter(v => 
            v.lessonId === lessonId && (!slideId || v.slideId === slideId)
        );
    },

    saveVideo: async (video: Omit<LessonVideo, 'id' | 'createdAt'>) => {
        // 1. Try Supabase
        if (isSupabaseConfigured() && supabase) {
            const { data: session } = await supabase.auth.getSession();
            if (session.session) {
                await supabase.from('lesson_videos').insert({
                    lesson_id: video.lessonId,
                    slide_id: video.slideId,
                    youtube_url: video.youtubeUrl,
                    title: video.title,
                    added_by: session.session.user.id
                });
                return;
            }
        }

        // 2. Local Mock
        const stored = localStorage.getItem(VIDEO_KEY);
        const locals: LessonVideo[] = stored ? JSON.parse(stored) : [];
        
        locals.push({
            ...video,
            id: `vid-${Date.now()}`,
            createdAt: Date.now()
        });
        
        localStorage.setItem(VIDEO_KEY, JSON.stringify(locals));
    },

    deleteVideo: async (id: string) => {
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('lesson_videos').delete().eq('id', id);
        }
        
        const stored = localStorage.getItem(VIDEO_KEY);
        if (stored) {
            const locals: LessonVideo[] = JSON.parse(stored);
            const filtered = locals.filter(v => v.id !== id);
            localStorage.setItem(VIDEO_KEY, JSON.stringify(filtered));
        }
    }
};
