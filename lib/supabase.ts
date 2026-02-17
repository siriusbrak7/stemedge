// lib/supabase.ts
import { supabase, isSupabaseConfigured } from './supabaseClient';

export { supabase, isSupabaseConfigured };

// ────────────────────────────────────────────────
// Optional: Dev-only admin creation helper
// ────────────────────────────────────────────────

export async function createDevAdmin() {
  if (import.meta.env.DEV !== true) {
    console.log('createDevAdmin should only run in development');
    return;
  }

  const email = 'admin@local.dev';

  // Check if already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', email)
    .maybeSingle();

  if (existing) {
    console.log('Dev admin already exists');
    return;
  }

  const password = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'SuperSecret123!';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('Failed to create dev admin:', error.message);
    return;
  }

  console.log('Dev admin created:', data.user?.email);

  // Insert profile row
  const { error: insertError } = await supabase.from('users').insert({
    id: data.user?.id,
    username: email,
    role: 'admin',
    isApproved: true,
    securityQuestion: 'Your favorite color?',
    securityAnswer: 'Blue',
  });

  if (insertError) {
    console.error('Failed to insert admin profile:', insertError.message);
  }
}

createDevAdmin();