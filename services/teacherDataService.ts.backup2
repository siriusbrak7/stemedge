import { supabase } from '../lib/supabase';
import { Classroom } from '../types';

export const teacherDataService = {
    fetchClassesAsync: async (teacherId: string): Promise<Classroom[]> => {
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('teacher_id', teacherId);
            if (error) return [];
            return data || [];
        } catch {
            return [];
        }
    },
    // Add other functions as needed
};
