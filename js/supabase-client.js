/* ============================================================
   ACTIVA 90 — Supabase Client
   Auth helpers shared across all pages
   ============================================================ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ── Sign Up ────────────────────────────────────────────────── */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: 'https://www.activa90.com/dashboard.html'
    }
  });
  return { data, error };
}

/* ── Sign In ────────────────────────────────────────────────── */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

/* ── Sign Out ───────────────────────────────────────────────── */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/* ── Get Current Session + User ─────────────────────────────── */
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
}

/* ── Get Profile ────────────────────────────────────────────── */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

/* ── Update Profile ─────────────────────────────────────────── */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

/* ── Reset Password (send email) ────────────────────────────── */
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://www.activa90.com/profile.html'
  });
  return { error };
}

/* ── Update Password (after clicking reset link) ────────────── */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
}

/* ── Exchange Code for Session (email confirmation / recovery) ─ */
export async function exchangeCode(code) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  return { data, error };
}

/* ── Auth State Listener ────────────────────────────────────── */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
