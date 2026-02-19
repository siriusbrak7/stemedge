import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Assignment, StudentAssignmentProgress } from '../types';

// Queue for offline updates
interface PendingUpdate {
    id: string;
    studentId: string;
    assignmentId: string;
    itemId: string;
    isComplete: boolean;
    timestamp: number;
    retryCount: number;
}

const PENDING_QUEUE_KEY = 'assignment_pending_queue';

// Fallback Mock Data
const MOCK_ASSIGNMENTS: Assignment[] = [
    {
        id: 'asg-101',
        teacherId: 'brak',
        classIds: ['c-bio-101'],
        title: 'Cell Structure Basics',
        instructions: 'Complete the Cell Biology interactive module and the quiz.',
        dueDate: Date.now() + 86400000 * 3,
        allowLate: true,
        status: 'published',
        items: [
            { id: 'item-1', type: 'lesson', contentId: 'cell_biology', title: 'Cell Biology Lesson', order: 1 },
            { id: 'item-2', type: 'quiz', contentId: 'quiz_cell_biology', title: 'Cell Structure Quiz', order: 2 }
        ],
        createdAt: Date.now() - 86400000,
        completionCount: 15,
        totalStudents: 24
    }
];

export const assignmentService = {
    
    // --- OFFLINE QUEUE MANAGEMENT (NEW) ---
    getPendingQueue: (): PendingUpdate[] => {
        const queue = localStorage.getItem(PENDING_QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    },
    
    addToQueue: (update: Omit<PendingUpdate, 'id' | 'timestamp' | 'retryCount'>) => {
        const queue = assignmentService.getPendingQueue();
        const newUpdate: PendingUpdate = {
            ...update,
            id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            retryCount: 0
        };
        queue.push(newUpdate);
        localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
        
        // Attempt to process queue if online
        if (navigator.onLine) {
            assignmentService.processPendingQueue();
        }
    },
    
    processPendingQueue: async () => {
        if (!navigator.onLine || !isSupabaseConfigured() || !supabase) return;
        
        const queue = assignmentService.getPendingQueue();
        if (queue.length === 0) return;
        
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;
        
        const remainingQueue: PendingUpdate[] = [];
        
        for (const update of queue) {
            try {
                // Attempt the update
                const { data: current } = await supabase
                    .from('assignment_submissions')
                    .select('completed_items')
                    .eq('assignment_id', update.assignmentId)
                    .eq('student_id', session.session.user.id)
                    .single();
                
                let items = current?.completed_items || [];
                if (update.isComplete && !items.includes(update.itemId)) {
                    items.push(update.itemId);
                }
                
                const { error } = await supabase
                    .from('assignment_submissions')
                    .upsert({
                        assignment_id: update.assignmentId,
                        student_id: session.session.user.id,
                        completed_items: items,
                        status: 'in_progress',
                        last_updated: new Date().toISOString()
                    }, { onConflict: 'assignment_id, student_id' as any });
                
                if (error) throw error;
                
                // Update local cache after successful sync
                const cacheKey = `assignments_${update.studentId}`;
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const data = JSON.parse(cached);
                    // Update the cached progress
                    const target = data.find((d: any) => d.assignment.id === update.assignmentId);
                    if (target && !target.progress.completedItemIds.includes(update.itemId)) {
                        target.progress.completedItemIds.push(update.itemId);
                        target.progress.lastUpdated = Date.now();
                        localStorage.setItem(cacheKey, JSON.stringify(data));
                    }
                }
                
            } catch (error) {
                console.warn('Queue item failed, will retry:', update.id, error);
                update.retryCount++;
                // Only keep items with less than 3 retries
                if (update.retryCount < 3) {
                    remainingQueue.push(update);
                }
            }
        }
        
        localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(remainingQueue));
    },
    
    // --- STUDENT ---
    getStudentAssignments: async (studentId: string): Promise<{ assignment: Assignment, progress: StudentAssignmentProgress }[]> => {
        // Process any pending updates first
        if (navigator.onLine) {
            await assignmentService.processPendingQueue();
        }
        
        // 1. Offline / Mock Mode
        if (!isSupabaseConfigured() || !supabase) {
            return MOCK_ASSIGNMENTS.map(asg => ({
                assignment: asg,
                progress: {
                    assignmentId: asg.id,
                    studentId: studentId,
                    status: 'in_progress', 
                    completedItemIds: [],
                    lastUpdated: Date.now()
                }
            }));
        }

        if (!navigator.onLine) {
            const cached = localStorage.getItem(`assignments_${studentId}`);
            return cached ? JSON.parse(cached) : [];
        }

        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session.session) return [];

            const { data: assignmentsData } = await supabase
                .from('assignments')
                .select('*')
                .eq('status', 'published');

            if (!assignmentsData || assignmentsData.length === 0) return [];

            const { data: submissionsData } = await supabase
                .from('assignment_submissions')
                .select('*')
                .eq('student_id', session.session.user.id);

            const result = assignmentsData.map((asg: any) => {
                const sub = submissionsData?.find((s: any) => s.assignment_id === asg.id);
                const progress: StudentAssignmentProgress = sub ? {
                    assignmentId: asg.id,
                    studentId: studentId,
                    status: sub.status,
                    completedItemIds: Array.isArray(sub.completed_items) ? sub.completed_items : [],
                    lastUpdated: new Date(sub.last_updated).getTime()
                } : {
                    assignmentId: asg.id,
                    studentId: studentId,
                    status: 'pending',
                    completedItemIds: [],
                    lastUpdated: Date.now()
                };

                let validItems = [];
                if (Array.isArray(asg.content)) {
                    validItems = asg.content.filter((i: any) => i && i.id && i.type);
                }

                return {
                    assignment: {
                        ...asg,
                        dueDate: new Date(asg.due_date).getTime(),
                        createdAt: new Date(asg.created_at).getTime(),
                        items: validItems
                    },
                    progress
                };
            });

            localStorage.setItem(`assignments_${studentId}`, JSON.stringify(result));
            return result;
        } catch (e) {
            console.error("Error fetching assignments:", e);
            return [];
        }
    },

    updateStudentProgress: async (studentId: string, assignmentId: string, itemId: string, isComplete: boolean) => {
        // Update local cache immediately (optimistic UI)
        const cacheKey = `assignments_${studentId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            const target = data.find((d: any) => d.assignment.id === assignmentId);
            if (target && !target.progress.completedItemIds.includes(itemId)) {
                target.progress.completedItemIds.push(itemId);
                target.progress.lastUpdated = Date.now();
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
        }
        
        // Mock Mode
        if (!isSupabaseConfigured() || !supabase) {
            return;
        }

        // If offline, queue for later
        if (!navigator.onLine) {
            assignmentService.addToQueue({
                studentId,
                assignmentId,
                itemId,
                isComplete
            });
            return;
        }

        // Real Backend - Online
        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session.session) return;

            const { data: current } = await supabase
                .from('assignment_submissions')
                .select('completed_items')
                .eq('assignment_id', assignmentId)
                .eq('student_id', session.session.user.id)
                .single();

            let items = current?.completed_items || [];
            if (isComplete && !items.includes(itemId)) {
                items.push(itemId);
            }

            const { error } = await supabase
                .from('assignment_submissions')
                .upsert({
                    assignment_id: assignmentId,
                    student_id: session.session.user.id,
                    completed_items: items,
                    status: 'in_progress', 
                    last_updated: new Date().toISOString()
                }, { onConflict: 'assignment_id, student_id' as any });

            if (error) {
                console.error("Submission error", error);
                // Queue failed online attempt for retry
                assignmentService.addToQueue({
                    studentId,
                    assignmentId,
                    itemId,
                    isComplete
                });
            }
        } catch (e) {
            console.error("Update progress failed", e);
            // Queue failed online attempt for retry
            assignmentService.addToQueue({
                studentId,
                assignmentId,
                itemId,
                isComplete
            });
        }
    },

    // --- TEACHER ---
    getAssignmentsForTeacher: async (teacherId: string): Promise<Assignment[]> => {
        if (!isSupabaseConfigured() || !supabase) {
            if (teacherId.toLowerCase() === 'brak') return MOCK_ASSIGNMENTS;
            return [];
        }

        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session.session) return [];

            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('teacher_id', session.session.user.id);

            if (error || !data) return [];

            return data.map((a: any) => ({
                ...a,
                dueDate: new Date(a.due_date).getTime(),
                createdAt: new Date(a.created_at).getTime(),
                items: Array.isArray(a.content) ? a.content : []
            }));
        } catch (e) {
            console.error("Teacher fetch error", e);
            return [];
        }
    },

    saveAssignment: async (assignment: Assignment) => {
        if (!isSupabaseConfigured() || !supabase) {
            console.log("Mock: Assignment saved", assignment);
            return;
        }

        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session.session) return;

            const { error } = await supabase.from('assignments').upsert({
                id: assignment.id.includes('asg-') ? undefined : assignment.id, 
                teacher_id: session.session.user.id,
                title: assignment.title,
                instructions: assignment.instructions,
                due_date: new Date(assignment.dueDate).toISOString(),
                status: assignment.status,
                content: assignment.items
            });

            if (error) {
                console.error("Save assignment error", error);
                alert("Failed to save assignment. Check network/permissions.");
            }
        } catch (e) {
            console.error("Save failed", e);
        }
    }
};

// Listen for online events to process queue
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        assignmentService.processPendingQueue();
    });
}