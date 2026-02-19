import { TeacherNote, StudentMetric, TopicMastery, Assignment } from '../types';
import { teacherDataService } from './teacherDataService';
import { assignmentService } from './assignmentService';
import { mobileService } from './mobileService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const NOTES_KEY = 'stemedge_teacher_notes';

export const reportService = {
    // --- CSV EXPORT ---
    downloadCSV: async (data: any[], filename: string) => {
        if (data.length === 0) return;

        // Extract headers
        const headers = Object.keys(data[0]);
        
        // Build CSV string
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header] === null || row[header] === undefined ? '' : row[header];
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(','))
        ].join('\n');

        // NATIVE MOBILE HANDLING
        if (mobileService.isNative) {
            await mobileService.saveReport(filename, csvContent);
            return;
        }

        // WEB FALLBACK
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // --- DATA AGGREGATION ---

    getTopicMastery: (classId: string): TopicMastery[] => {
        const topics = [
            { id: 'cell_biology', name: 'Cell Biology' },
            { id: 'inheritance', name: 'Genetics' },
            { id: 'ecology', name: 'Ecology' },
            { id: 'animal_nutrition', name: 'Physiology' }
        ];

        return topics.map(t => {
            // In a full app, this would aggregate real data from Supabase 'progress' table
            const rand = Math.random();
            const averageScore = Math.floor(65 + (rand * 30)); 
            
            let masteryLevel: TopicMastery['masteryLevel'] = 'struggling';
            if (averageScore >= 85) masteryLevel = 'mastered';
            else if (averageScore >= 70) masteryLevel = 'developing';

            return {
                topicId: t.id,
                topicName: t.name,
                averageScore,
                masteryLevel,
                studentCount: Math.floor(10 + Math.random() * 5)
            };
        });
    },

    getAssignmentMatrix: async (classId: string, assignmentId: string) => {
        const cls = await teacherDataService.getClassById(classId);
        if (!cls) return [];
        
        const teacherId = 'brak'; // Mock context fallback
        const assignments = await assignmentService.getAssignmentsForTeacher(teacherId); 
        const assignment = assignments.find(a => a.id === assignmentId);

        if (!assignment) return [];

        return cls.students.map(student => {
            const row: any = { Student: student.name };
            
            assignment.items.forEach((item, index) => {
                let status = 'Not Started';
                if (student.overallProgress > (index * 20)) {
                    status = item.type === 'quiz' 
                        ? `${Math.floor(student.averageScore - 10 + Math.random() * 20)}%` 
                        : 'Completed';
                }
                row[item.title] = status;
            });

            return row;
        });
    },

    // --- TEACHER NOTES ---

    fetchNotesAsync: async (studentId: string): Promise<TeacherNote[]> => {
        if (isSupabaseConfigured() && supabase) {
            const { data } = await supabase
                .from('teacher_notes')
                .select('*')
                .eq('student_id', studentId)
                .order('created_at', { ascending: false });
            
            if (data) {
                const notes = data.map((n: any) => ({
                    id: n.id,
                    teacherId: n.teacher_id,
                    studentId: n.student_id,
                    text: n.text,
                    createdAt: new Date(n.created_at).getTime()
                }));
                // Update Cache
                const stored = localStorage.getItem(NOTES_KEY);
                const existing = stored ? JSON.parse(stored) : [];
                // naive merge
                localStorage.setItem(NOTES_KEY, JSON.stringify([...existing, ...notes]));
                return notes;
            }
        }
        return reportService.getNotes(studentId);
    },

    getNotes: (studentId: string): TeacherNote[] => {
        const stored = localStorage.getItem(NOTES_KEY);
        if (!stored) return [];
        const notes: TeacherNote[] = JSON.parse(stored);
        return notes.filter(n => n.studentId === studentId).sort((a, b) => b.createdAt - a.createdAt);
    },

    addNote: (teacherId: string, studentId: string, text: string) => {
        const newNote: TeacherNote = {
            id: `note-${Date.now()}`,
            teacherId,
            studentId,
            text,
            createdAt: Date.now()
        };

        // Save Local
        const stored = localStorage.getItem(NOTES_KEY);
        const notes: TeacherNote[] = stored ? JSON.parse(stored) : [];
        notes.push(newNote);
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

        // Save Supabase
        if (isSupabaseConfigured() && supabase && !teacherId.startsWith('demo-')) {
            supabase.from('teacher_notes').insert({
                teacher_id: teacherId,
                student_id: studentId,
                text,
                created_at: new Date().toISOString()
            }).then(({ error }) => {
                if (error) console.error("Note Save Error", error);
            });
        }

        return newNote;
    },

    deleteNote: (noteId: string) => {
        // Delete Local
        const stored = localStorage.getItem(NOTES_KEY);
        if (stored) {
            const notes: TeacherNote[] = JSON.parse(stored);
            const filtered = notes.filter(n => n.id !== noteId);
            localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
        }

        // Delete Supabase
        if (isSupabaseConfigured() && supabase) {
            supabase.from('teacher_notes').delete().eq('id', noteId);
        }
    }
};
