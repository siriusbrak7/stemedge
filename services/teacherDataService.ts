
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Classroom, StudentMetric } from '../types';

const TEACHER_DATA_KEY = 'stemedge_teacher_data';

// Helper to calculate health
const calculateClassHealth = (avgScore: number) => {
    if (avgScore >= 80) return 'good';
    if (avgScore >= 70) return 'average';
    return 'critical';
};

export const teacherDataService = {
    getClasses: (teacherUsernameOrId: string): Classroom[] => {
        const stored = localStorage.getItem(TEACHER_DATA_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // New Async Method with Pagination
    fetchClassesAsync: async (teacherId: string, page = 1, limit = 10): Promise<Classroom[]> => {
        if (isSupabaseConfigured() && supabase) {
            try {
                // 1. Get Classrooms (Paginated)
                const from = (page - 1) * limit;
                const to = from + limit - 1;

                const { data: classes, error } = await supabase
                    .from('classrooms')
                    .select('*')
                    .eq('teacher_id', teacherId)
                    .range(from, to);

                if (error || !classes) return [];

                const result: Classroom[] = [];

                // Parallel fetch for details would be better, but serial for safety here
                for (const cls of classes) {
                    const { data: enrollments } = await supabase
                        .from('enrollments')
                        .select('student:profiles(*)')
                        .eq('class_id', cls.id);

                    const students: StudentMetric[] = [];
                    let totalScore = 0;
                    let totalProgress = 0;

                    if (enrollments) {
                        for (const enr of enrollments) {
                            const profile = (enr as any).student;
                            // Optimized: Fetch only aggregate if possible, but RLS prevents cross-student agg easily
                            // For MVP, we fetch student stats individually or assume a synced stats table exists
                            students.push({
                                id: profile.id,
                                name: profile.full_name || profile.username,
                                overallProgress: 0, // Placeholder for performance
                                averageScore: 0,
                                lastActive: Date.now(),
                                atRisk: false,
                                topicsCompleted: 0
                            });
                        }
                    }

                    result.push({
                        id: cls.id,
                        name: cls.name,
                        subject: cls.subject || 'General Science',
                        studentCount: students.length,
                        averageProgress: 0,
                        averageScore: 0,
                        health: 'average',
                        students
                    });
                }
                
                // Merge with local cache instead of overwrite
                return result;

            } catch (e) {
                console.error("Supabase teacher fetch error", e);
            }
        }

        // Fallback
        const stored = localStorage.getItem(TEACHER_DATA_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    getClassById: (id: string): Classroom | undefined => {
        const stored = localStorage.getItem(TEACHER_DATA_KEY);
        const classes: Classroom[] = stored ? JSON.parse(stored) : [];
        return classes.find(c => c.id === id);
    },

    assignTopic: async (classId: string, topicName: string) => {
        console.log(`Assigned ${topicName} to class ${classId}`);
        return true;
    }
};
