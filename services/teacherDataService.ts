import { supabase } from '../lib/supabase';
import { Classroom, StudentMetric } from '../types';

const MOCK_CLASSES: Classroom[] = [
    {
        id: 'class-1',
        name: 'Biology 101',
        subject: 'Biology',
        studentCount: 24,
        averageProgress: 65,
        averageScore: 72,
        health: 'average',
        students: [
            { id: 's1', name: 'Alice', overallProgress: 80, averageScore: 85, lastActive: Date.now() - 86400000, atRisk: false, topicsCompleted: 5 },
            { id: 's2', name: 'Bob', overallProgress: 45, averageScore: 60, lastActive: Date.now() - 172800000, atRisk: true, topicsCompleted: 2 }
        ]
    },
    {
        id: 'class-2',
        name: 'Chemistry 101',
        subject: 'Chemistry',
        studentCount: 18,
        averageProgress: 80,
        averageScore: 85,
        health: 'good',
        students: [
            { id: 's3', name: 'Charlie', overallProgress: 90, averageScore: 92, lastActive: Date.now() - 43200000, atRisk: false, topicsCompleted: 8 }
        ]
    }
];

export const teacherDataService = {
    fetchClassesAsync: async (teacherId: string): Promise<Classroom[]> => {
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('teacher_id', teacherId);
            if (error) {
                console.warn('Classrooms table not available, using mock data');
                return MOCK_CLASSES;
            }
            return (data && data.length) ? data : MOCK_CLASSES;
        } catch {
            console.warn('Error fetching classes, using mock data');
            return MOCK_CLASSES;
        }
    },

    getClasses: async (teacherId: string): Promise<Classroom[]> => {
        return teacherDataService.fetchClassesAsync(teacherId);
    },

    getClassById: async (classId: string): Promise<Classroom | null> => {
        const mock = MOCK_CLASSES.find(c => c.id === classId);
        if (mock) return mock;
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('id', classId)
                .single();
            if (error) throw error;
            return data;
        } catch {
            return MOCK_CLASSES[0] || null;
        }
    }
};
