// services/dbService.ts
import { supabase } from '../lib/supabase';   // ← this is the correct path

import {
  User,
  QuizAttempt,
  UserTopicProgress,
  LabAttempt,
  Assignment,
  StudentAssignmentProgress,
  UserStreak,
} from '../types';

// ── USERS ────────────────────────────────────────────────────────────────

export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('getUserById error:', error);
    return null;
  }
  return data;
};

export const createUser = async (user: User) => {
  const { data, error } = await supabase.from('users').insert([user]);
  if (error) throw error;
  return data;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const { data: updated, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return updated;
};

// ── LESSONS ──────────────────────────────────────────────────────────────

export const getAllLessons = async () => {
  const { data, error } = await supabase.from('lessons').select('*');
  if (error) throw error;
  return data;
};

export const getLessonById = async (lessonId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  if (error) throw error;
  return data;
};

// ── QUIZZES ──────────────────────────────────────────────────────────────

export const getQuizzesByTopic = async (topicId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('topic_id', topicId);
  if (error) throw error;
  return data;
};

export const recordQuizAttempt = async (userId: string, attempt: QuizAttempt) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([{ user_id: userId, ...attempt }]);
  if (error) throw error;
  return data;
};

// ── VIRTUAL LABS ─────────────────────────────────────────────────────────

export const getLabsByTopic = async (topicId: string) => {
  const { data, error } = await supabase
    .from('virtual_labs')
    .select('*')
    .eq('topic_id', topicId);
  if (error) throw error;
  return data;
};

export const recordLabAttempt = async (userId: string, attempt: LabAttempt) => {
  const { data, error } = await supabase
    .from('lab_attempts')
    .insert([{ student_id: userId, ...attempt }]);
  if (error) throw error;
  return data;
};

// ── USER PROGRESS ────────────────────────────────────────────────────────

export const recordUserTopicProgress = async (
  userId: string,
  progress: UserTopicProgress
) => {
  const { data, error } = await supabase
    .from('user_topic_progress')
    .upsert([{ user_id: userId, ...progress }], {
      onConflict: 'user_id, topic_id',   // prevents duplicate key errors
    });
  if (error) throw error;
  return data;
};

// ── ASSIGNMENTS ──────────────────────────────────────────────────────────

export const getAssignmentsForTeacher = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('teacher_id', teacherId);
  if (error) throw error;
  return data;
};

export const getStudentAssignmentProgress = async (studentId: string) => {
  const { data, error } = await supabase
    .from('student_assignment_progress')
    .select('*')
    .eq('student_id', studentId);
  if (error) throw error;
  return data;
};

// ── GAMIFICATION ─────────────────────────────────────────────────────────

export const getUserBadges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const updateUserStreak = async (userId: string, streak: UserStreak) => {
  const { data, error } = await supabase
    .from('user_streaks')
    .upsert([{ user_id: userId, ...streak }], {
      onConflict: 'user_id',
    });
  if (error) throw error;
  return data;
};