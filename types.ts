
import React from 'react';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export interface FeatureProps {
    title: string;
    description: string;
    imageSrc?: string; // Updated for screenshot support
    icon?: React.ReactNode;
}

export interface TestimonialProps {
    name: string;
    role: string;
    quote: string;
    avatar: string;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id?: string; // Supabase UUID
    username: string;
    password?: string; // Only used internally in auth service
    role: UserRole;
    securityQuestion?: string;
    securityAnswer?: string;
    isApproved: boolean; // Teachers need approval
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

// --- Student Learning Data Models ---

export interface Topic {
    id: string;
    title: string;
    description: string;
    iconName: 'dna' | 'microscope' | 'leaf' | 'activity' | 'zap';
    totalLessons: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserTopicProgress {
    topicId: string;
    completedLessons: number; // Count of finished lessons
    quizScore?: number; // 0-100, undefined if quiz not taken
    lastAccessed: number; // Timestamp
    isCompleted: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    iconName: 'trophy' | 'star' | 'zap' | 'target';
    dateEarned: number;
}

export interface DashboardData {
    topics: Topic[];
    progress: Record<string, UserTopicProgress>; // Map topicId to progress
    achievements: Achievement[];
}

// --- Quiz Models ---

export interface Question {
    id: string;
    text: string; // Mapped from 'question' in bank
    type: 'multiple_choice' | 'true_false';
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    misconception?: string;
    standards?: string[];
    bloomsLevel?: string;
    timeEstimate?: number; // seconds
    imageUrl?: string;
}

export interface Quiz {
    id: string;
    topicId: string;
    topicTitle: string;
    questions: Question[];
}

export interface QuizAttempt {
    quizId: string;
    date: string;
    score: number;
    totalQuestions: number;
    missedQuestionIds: string[];
    userAnswers: Record<string, string>; // questionId -> answer
    timeSpent: number;
}

// --- Video Models ---

export interface LessonVideo {
    id: string;
    lessonId: string;
    slideId?: string; // Optional: link to specific organelle/slide
    youtubeUrl: string;
    title: string;
    addedBy: string;
    createdAt: number;
}

// --- Assignment Models ---

export interface AssignmentItem {
    id: string;
    type: 'lesson' | 'quiz';
    contentId: string; // e.g. 'cell_biology' or 'quiz_cell_biology'
    title: string;
    order: number;
}

export interface Assignment {
    id: string;
    teacherId: string;
    classIds: string[];
    title: string;
    instructions: string;
    dueDate: number; // timestamp
    allowLate: boolean;
    status: 'draft' | 'published';
    items: AssignmentItem[];
    createdAt: number;
    completionCount?: number; // Calculated field for dashboard
    totalStudents?: number; // Calculated field for dashboard
}

export interface StudentAssignmentProgress {
    assignmentId: string;
    studentId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'late' | 'overdue';
    completedItemIds: string[];
    lastUpdated: number;
}

// --- Teacher Dashboard Models ---

export interface StudentMetric {
    id: string;
    name: string;
    overallProgress: number; // 0-100
    averageScore: number; // 0-100
    lastActive: number; // Timestamp
    atRisk: boolean; // Flag for struggling students
    topicsCompleted: number;
}

export interface Classroom {
    id: string;
    name: string;
    subject: string;
    studentCount: number;
    averageProgress: number;
    averageScore: number;
    health: 'good' | 'average' | 'critical'; // Based on avg score
    students: StudentMetric[];
}

// --- Report Models ---

export interface TeacherNote {
    id: string;
    teacherId: string;
    studentId: string;
    text: string;
    createdAt: number;
}

export interface TopicMastery {
    topicId: string;
    topicName: string;
    averageScore: number;
    masteryLevel: 'mastered' | 'developing' | 'struggling';
    studentCount: number; // Number of students who have attempted
}

// --- Virtual Lab Models ---

export interface VirtualLab {
    id: string;
    title: string;
    topicId: string;
    description: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedTime: number; // minutes
    iconName: 'microscope' | 'beaker' | 'scale' | 'atom';
}

export interface LabNotebookEntry {
    id: string;
    timestamp: number;
    text: string;
    snapshotContext?: string; // e.g., "400x, Methylene Blue"
}

export interface LabAttempt {
    labId: string;
    studentId: string;
    startedAt: number;
    completedAt?: number;
    isCompleted: boolean;
    notebookEntries: LabNotebookEntry[];
    score?: number; // 0-100 if lab has quiz components
}

// --- Gamification Models ---

export type BadgeCategory = 'streak' | 'mastery' | 'lab' | 'quiz' | 'assignment';

export interface Badge {
    id: string;
    name: string;
    description: string;
    iconName: 'flame' | 'rocket' | 'medal' | 'flask' | 'brain' | 'clock' | 'target';
    category: BadgeCategory;
    xpValue: number;
    // Logic triggers (simplified for this app)
    conditionType: 'streak_days' | 'lesson_complete' | 'quiz_score_gt' | 'lab_complete';
    conditionValue: number | string; // e.g., 7 (days), 'cell_biology' (topicId)
    secondaryValue?: number; // e.g., 90 (score)
}

export interface UserBadge {
    badgeId: string;
    dateEarned: number;
}

export interface UserStreak {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string; // ISO Date string (YYYY-MM-DD)
    history: string[]; // Array of ISO Date strings for calendar view
}

// --- Admin Dashboard Models ---

export interface Tenant {
    id: string;
    name: string;
    type: 'School' | 'District' | 'University';
    status: 'Active' | 'Trial' | 'Expired' | 'Suspended';
    plan: 'Basic' | 'Pro' | 'Enterprise';
    joinedDate: number;
    trialEndsAt?: number;
    teacherCount: number;
    studentCount: number;
    activeUsersLast7Days: number;
    storageUsedGB: number;
}

export interface PlatformAnalytics {
    totalTenants: number;
    totalUsers: number;
    activeTenants: number;
    growthRate: number; // Percentage
    topTopics: { name: string; attempts: number }[];
    commonMisconceptions: { topic: string; errorRate: number }[];
}

export interface SystemLog {
    id: string;
    timestamp: number;
    level: 'INFO' | 'WARNING' | 'ERROR';
    tenantId: string;
    message: string;
}

export interface SystemHealth {
    apiStatus: 'Healthy' | 'Degraded' | 'Down';
    apiLatency: number; // ms
    storageTotal: number; // TB
    storageUsed: number; // TB
    recentLogs: SystemLog[];
}
