import { supabase } from '../lib/supabase';
import { Classroom } from '../types';

export const teacherDataService = {
    fetchClassesAsync: async (teacherId: string): Promise<Classroom[]> => {
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('teacher_id', teacherId);
            if (error) {
                console.warn('Error fetching classes:', error.message);
                return [];
            }
            return data || [];
        } catch (e) {
            console.warn('Exception fetching classes:', e);
            return [];
        }
    },

    getClasses: async (teacherId: string): Promise<Classroom[]> => {
        return teacherDataService.fetchClassesAsync(teacherId);
    },

    getClassById: async (classId: string): Promise<Classroom | null> => {
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('id', classId)
                .single();
            if (error) throw error;
            return data;
        } catch {
            return null;
        }
    }
};
