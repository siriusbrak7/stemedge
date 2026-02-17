
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { VirtualLab, LabAttempt, LabNotebookEntry } from '../types';

const LABS_DATA: VirtualLab[] = [
    {
        id: 'lab-cell-staining',
        title: 'Cell Staining Lab',
        topicId: 'cell_biology',
        description: 'Identify animal, plant, and bacterial cells using methylene blue and iodine stains.',
        difficulty: 2,
        estimatedTime: 20,
        iconName: 'microscope'
    },
    {
        id: 'lab-enzyme-temp',
        title: 'Enzyme Temperature',
        topicId: 'enzymes',
        description: 'Observe how catalase reaction rates change with temperature.',
        difficulty: 3,
        estimatedTime: 15,
        iconName: 'beaker'
    },
    {
        id: 'lab-osmosis',
        title: 'Osmosis & Diffusion',
        topicId: 'movement',
        description: 'Simulate red onion cells in hypertonic and hypotonic solutions.',
        difficulty: 3,
        estimatedTime: 25,
        iconName: 'atom'
    },
    {
        id: 'lab-photosynthesis',
        title: 'Photosynthesis Rate',
        topicId: 'plant_nutrition',
        description: 'Measure oxygen production in Elodea plants under different light intensities.',
        difficulty: 4,
        estimatedTime: 30,
        iconName: 'scale'
    }
];

const ATTEMPTS_KEY = 'stemedge_lab_attempts';

export const labService = {
    getAllLabs: (): VirtualLab[] => {
        return LABS_DATA;
    },

    getLabById: (id: string): VirtualLab | undefined => {
        return LABS_DATA.find(l => l.id === id);
    },

    getStudentAttempts: (studentId: string): LabAttempt[] => {
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        if (!stored) return [];
        const attempts: LabAttempt[] = JSON.parse(stored);
        // If IDs match (for local) OR we are in a session where studentId matches
        return attempts.filter(a => a.studentId === studentId || studentId.startsWith('local-')); 
    },

    fetchAttemptsAsync: async (studentId: string): Promise<LabAttempt[]> => {
        if (isSupabaseConfigured() && supabase && !studentId.startsWith('demo-') && !studentId.startsWith('local-')) {
            const { data } = await supabase
                .from('lab_attempts')
                .select('*')
                .eq('student_id', studentId);
            
            if (data) {
                const mapped = data.map((d: any) => ({
                    labId: d.lab_id,
                    studentId: d.student_id,
                    startedAt: new Date(d.started_at).getTime(),
                    completedAt: d.completed_at ? new Date(d.completed_at).getTime() : undefined,
                    isCompleted: d.is_completed,
                    notebookEntries: d.notebook_entries || [],
                    score: d.score
                }));
                // Update cache
                const currentCache = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '[]');
                // Simple merge strategy: replace
                localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(mapped));
                return mapped;
            }
        }
        return labService.getStudentAttempts(studentId);
    },

    initializeAttempt: (studentId: string, labId: string): LabAttempt => {
        const attempt: LabAttempt = {
            labId,
            studentId,
            startedAt: Date.now(),
            isCompleted: false,
            notebookEntries: []
        };

        // Save Local
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        const allAttempts: LabAttempt[] = stored ? JSON.parse(stored) : [];
        
        // Check for existing unfinished attempt locally
        let existing = allAttempts.find(a => a.studentId === studentId && a.labId === labId && !a.isCompleted);
        if (existing) return existing;

        allAttempts.push(attempt);
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(allAttempts));

        // Save Supabase
        if (isSupabaseConfigured() && supabase && !studentId.startsWith('demo-') && !studentId.startsWith('local-')) {
            supabase.from('lab_attempts').insert({
                student_id: studentId,
                lab_id: labId,
                is_completed: false,
                notebook_entries: [],
                started_at: new Date().toISOString()
            }).then(({ error }) => {
                if (error) console.error('Lab Init Error', error);
            });
        }
        
        return attempt;
    },

    completeAttempt: (studentId: string, labId: string, score: number) => {
        // Local Update
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        if (stored) {
            const allAttempts: LabAttempt[] = JSON.parse(stored);
            const index = allAttempts.findIndex(a => a.studentId === studentId && a.labId === labId && !a.isCompleted);
            if (index !== -1) {
                allAttempts[index].isCompleted = true;
                allAttempts[index].completedAt = Date.now();
                allAttempts[index].score = score;
                localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(allAttempts));
            }
        }

        // Supabase Update
        if (isSupabaseConfigured() && supabase && !studentId.startsWith('demo-') && !studentId.startsWith('local-')) {
            supabase.from('lab_attempts')
                .update({ 
                    is_completed: true, 
                    score, 
                    completed_at: new Date().toISOString() 
                })
                .eq('student_id', studentId)
                .eq('lab_id', labId)
                .is('completed_at', null)
                .then(({ error }) => {
                    if (error) console.error('Lab Complete Error', error);
                });
        }
    },

    saveNotebookEntry: (studentId: string, labId: string, entry: LabNotebookEntry) => {
        // Local Update
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        let currentEntries: LabNotebookEntry[] = [];
        if (stored) {
            const allAttempts: LabAttempt[] = JSON.parse(stored);
            const index = allAttempts.findIndex(a => a.studentId === studentId && a.labId === labId && !a.isCompleted);
            if (index !== -1) {
                allAttempts[index].notebookEntries.push(entry);
                currentEntries = allAttempts[index].notebookEntries;
                localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(allAttempts));
            }
        }

        // Supabase Update
        if (isSupabaseConfigured() && supabase && !studentId.startsWith('demo-') && !studentId.startsWith('local-')) {
            // Fetch current entries first to append, or optimize with jsonb_insert in raw sql if possible
            // For simplicity, we push the full array we tracked locally
            if (currentEntries.length > 0) {
                supabase.from('lab_attempts')
                    .update({ notebook_entries: currentEntries })
                    .eq('student_id', studentId)
                    .eq('lab_id', labId)
                    .is('completed_at', null)
                    .then(({ error }) => {
                        if (error) console.error('Notebook Save Error', error);
                    });
            }
        }
    }
};
