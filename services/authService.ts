import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';
import bcrypt from 'bcryptjs';

const SESSION_KEY = 'stemedge_current_session';

const saveSession = (user: User, token: string) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
};

export const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What is your mother's maiden name?",
  "In what city were you born?",
  "What was your favorite food as a child?",
  "What is the name of your elementary school?",
  "What was your first car make and model?",
  "What is your favorite book?",
] as const;

export const authService = {
  initialize: async (): Promise<{ user: User | null }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { user: null };

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) return { user: null };

    saveSession(profile, session.access_token);
    return { user: profile };
  },

  signUp: async (payload: {
    username: string;
    password: string;
    role: UserRole;
    securityQuestion: string;
    securityAnswer: string;
    isApproved?: boolean;
  }): Promise<{ error?: { message: string }; data?: { user: User } }> => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: payload.username,
        password: payload.password,
      });

      if (signUpError) return { error: signUpError };
      if (!authData.user) return { error: { message: 'Signup failed - no user returned' } };

      const hashedAnswer = await bcrypt.hash(payload.securityAnswer.toLowerCase().trim(), 10);

      // Around line 54, update the insert to include email:
    const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        username: payload.username,
        email: payload.username, // Add this line - email same as username
        role: payload.role,
        isApproved: payload.isApproved ?? false,
        securityQuestion: payload.securityQuestion,
        securityAnswer: hashedAnswer,
    });

      if (insertError) return { error: insertError };

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        return { error: { message: 'Failed to fetch user profile after signup' } };
      }

      return { data: { user: profile } };
    } catch (err: any) {
      return { error: { message: err.message || 'Unexpected error during signup' } };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      if (!data.user || !data.session) return { error: { message: 'Login failed' } };

      const { data: userRow, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !userRow) {
        return { error: { message: profileError?.message || 'User profile not found' } };
      }

      saveSession(userRow, data.session.access_token);
      return { data: { user: userRow } };
    } catch (err: any) {
      return { error: { message: err.message || 'Unexpected login error' } };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
  },

  getSecurityQuestion: async (username: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('securityQuestion')
      .eq('username', username.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return data.securityQuestion || null;
  },

  resetPassword: async (username: string, answer: string, newPassword: string) => {
    try {
      const { data: userRow, error: fetchError } = await supabase
        .from('users')
        .select('id, securityAnswer')
        .eq('username', username.trim().toLowerCase())
        .single();

      if (fetchError || !userRow) return { error: { message: 'User not found' } };

      const isValid = await bcrypt.compare(answer.toLowerCase().trim(), userRow.securityAnswer);
      if (!isValid) return { error: { message: 'Incorrect security answer' } };

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) return { error: { message: updateError.message } };

      return { data: { message: 'Password reset successfully' } };
    } catch (err: any) {
      return { error: { message: err.message || 'Reset failed' } };
    }
  },
};