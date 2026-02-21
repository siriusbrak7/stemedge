/**
 * labService.ts — Updated with all biology virtual labs registered.
 * New labs: lab-enzyme-temp (renamed from lab-enzyme-activity), lab-osmosis, lab-photosynthesis
 * Each follows the same localStorage + Supabase pattern as the original.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { VirtualLab, LabAttempt, LabNotebookEntry } from '../types';

const LABS_DATA: VirtualLab[] = [
    {
        id: 'lab-cell-staining',
        title: 'Cell Staining Lab',
        topicId: 'cell_biology',
        description: 'Identify animal, plant, and bacterial cells using methylene blue and iodine stains under a virtual microscope.',
        difficulty: 2,
        estimatedTime: 20,
        iconName: 'microscope'
    },
    {
        id: 'lab-osmosis',
        title: 'Osmosis & Diffusion',
        topicId: 'movement',
        description: 'Place red onion cells in hypotonic, isotonic, and hypertonic solutions. Observe and record changes in cell appearance.',
        difficulty: 3,
        estimatedTime: 25,
        iconName: 'atom'
    },
    {
        id: 'lab-enzyme-temp',
        title: 'Enzyme Activity Lab',
        topicId: 'enzymes',
        description: 'Investigate how temperature affects catalase activity in hydrogen peroxide. Run trials, plot activity, and identify the optimum temperature.',
        difficulty: 3,
        estimatedTime: 20,
        iconName: 'beaker'
    },
    {
        id: 'lab-photosynthesis',
        title: 'Photosynthesis Rate Lab',
        topicId: 'plant_nutrition',
        description: 'Count oxygen bubbles from Elodea at varying light distances. Plot a rate vs. light intensity graph and explain limiting factors.',
        difficulty: 4,
        estimatedTime: 30,
        iconName: 'scale'
    },
    {
        id: 'lab-mitosis',
        title: 'Mitosis Identification Lab',
        topicId: 'cell_biology',
        description: 'Examine onion root tip cells and identify the five stages of mitosis: Interphase, Prophase, Metaphase, Anaphase, and Telophase.',
        difficulty: 3,
        estimatedTime: 20,
        iconName: 'microscope'
    },
    {
        id: 'lab-food-tests',
        title: 'Food Tests Lab',
        topicId: 'nutrition',
        description: 'Use Benedict\'s, Iodine, Biuret, and Ethanol tests to identify reducing sugars, starch, proteins, and lipids in food samples.',
        difficulty: 2,
        estimatedTime: 25,
        iconName: 'beaker'
    },
    // ── Chemistry Labs ──────────────────────────────────────────────────────
    {
        id: 'lab-atomic-structure',
        title: 'Particle Architect',
        topicId: 'atomic_structure',
        description: 'Build atoms by placing protons, neutrons, and electrons. Earn points, unlock heavier elements, and master electron shell configurations.',
        difficulty: 2,
        estimatedTime: 20,
        iconName: 'atom'
    },
    {
        id: 'lab-chemical-bonding',
        title: 'Bond Forge',
        topicId: 'bonding',
        description: 'Forge ionic and covalent bonds by transferring or sharing electrons. Validate the octet rule and compare bond properties.',
        difficulty: 3,
        estimatedTime: 25,
        iconName: 'atom'
    },
    {
        id: 'lab-stoichiometry',
        title: 'Reaction Balancer',
        topicId: 'stoichiometry',
        description: 'Balance chemical equations using coefficients, solve mole calculations, and identify limiting reagents in a timed challenge.',
        difficulty: 3,
        estimatedTime: 25,
        iconName: 'scale'
    },
    {
        id: 'lab-acids-bases',
        title: 'pH Defender',
        topicId: 'acids_bases',
        description: 'Defend a neutral solution from incoming acid and base waves. Select the correct neutralising agent to maintain pH 7.',
        difficulty: 2,
        estimatedTime: 20,
        iconName: 'beaker'
    },
    {
        id: 'lab-electrochemistry',
        title: 'Voltage Architect',
        topicId: 'electrochemistry',
        description: 'Build galvanic cells, predict cell EMF using standard reduction potentials, and earn tokens to unlock exotic half-cells.',
        difficulty: 4,
        estimatedTime: 30,
        iconName: 'atom'
    },
];

const ATTEMPTS_KEY = 'stemedge_lab_attempts';

// ─── Helper ─────────────────────────────────────────────────────────────────────

const getAllAttempts = (): LabAttempt[] => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveAllAttempts = (attempts: LabAttempt[]) => {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
};

// ─── Service ────────────────────────────────────────────────────────────────────

export const labService = {
    getAllLabs: (): VirtualLab[] => LABS_DATA,

    getLabById: (id: string): VirtualLab | undefined =>
        LABS_DATA.find(l => l.id === id),

    getStudentAttempts: (studentId: string): LabAttempt[] => {
        return getAllAttempts().filter(
            a => a.studentId === studentId || studentId.startsWith('local-')
        );
    },

    fetchAttemptsAsync: async (studentId: string): Promise<LabAttempt[]> => {
        if (
            isSupabaseConfigured() &&
            supabase &&
            !studentId.startsWith('demo-') &&
            !studentId.startsWith('local-')
        ) {
            const { data } = await supabase
                .from('lab_attempts')
                .select('*')
                .eq('student_id', studentId);

            if (data) {
                const mapped: LabAttempt[] = data.map((d: any) => ({
                    labId: d.lab_id,
                    studentId: d.student_id,
                    startedAt: new Date(d.started_at).getTime(),
                    completedAt: d.completed_at ? new Date(d.completed_at).getTime() : undefined,
                    isCompleted: d.is_completed,
                    notebookEntries: d.notebook_entries || [],
                    score: d.score,
                }));
                saveAllAttempts(mapped);
                return mapped;
            }
        }
        return labService.getStudentAttempts(studentId);
    },

    initializeAttempt: (studentId: string, labId: string): LabAttempt => {
        const allAttempts = getAllAttempts();

        // Resume existing unfinished attempt
        const existing = allAttempts.find(
            a => a.studentId === studentId && a.labId === labId && !a.isCompleted
        );
        if (existing) return existing;

        const attempt: LabAttempt = {
            labId,
            studentId,
            startedAt: Date.now(),
            isCompleted: false,
            notebookEntries: [],
        };

        allAttempts.push(attempt);
        saveAllAttempts(allAttempts);

        // Supabase async write
        if (
            isSupabaseConfigured() &&
            supabase &&
            !studentId.startsWith('demo-') &&
            !studentId.startsWith('local-')
        ) {
            supabase
                .from('lab_attempts')
                .insert({
                    student_id: studentId,
                    lab_id: labId,
                    is_completed: false,
                    notebook_entries: [],
                    started_at: new Date().toISOString(),
                })
                .then(({ error }) => {
                    if (error) console.error('Lab Init Error', error);
                });
        }

        return attempt;
    },

    completeAttempt: (studentId: string, labId: string, score: number) => {
        const allAttempts = getAllAttempts();
        const index = allAttempts.findIndex(
            a => a.studentId === studentId && a.labId === labId && !a.isCompleted
        );

        if (index !== -1) {
            allAttempts[index].isCompleted = true;
            allAttempts[index].completedAt = Date.now();
            allAttempts[index].score = score;
            saveAllAttempts(allAttempts);
        }

        if (
            isSupabaseConfigured() &&
            supabase &&
            !studentId.startsWith('demo-') &&
            !studentId.startsWith('local-')
        ) {
            supabase
                .from('lab_attempts')
                .update({
                    is_completed: true,
                    score,
                    completed_at: new Date().toISOString(),
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
        const allAttempts = getAllAttempts();
        const index = allAttempts.findIndex(
            a => a.studentId === studentId && a.labId === labId && !a.isCompleted
        );

        let currentEntries: LabNotebookEntry[] = [];
        if (index !== -1) {
            allAttempts[index].notebookEntries.push(entry);
            currentEntries = allAttempts[index].notebookEntries;
            saveAllAttempts(allAttempts);
        }

        if (
            isSupabaseConfigured() &&
            supabase &&
            !studentId.startsWith('demo-') &&
            !studentId.startsWith('local-') &&
            currentEntries.length > 0
        ) {
            supabase
                .from('lab_attempts')
                .update({ notebook_entries: currentEntries })
                .eq('student_id', studentId)
                .eq('lab_id', labId)
                .is('completed_at', null)
                .then(({ error }) => {
                    if (error) console.error('Notebook Save Error', error);
                });
        }
    },
};