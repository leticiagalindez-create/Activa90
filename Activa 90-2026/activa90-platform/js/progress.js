/* ============================================================
   ACTIVA 90 — Progress Tracking
   Reads/writes user_progress table in Supabase
   ============================================================ */

import { supabase } from './supabase-client.js';

/* ── Get all progress for a user ───────────────────────────── */
export async function getAllProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('getAllProgress error:', error);
    return [];
  }
  return data || [];
}

/* ── Get progress for a single module ──────────────────────── */
export async function getModuleProgress(userId, moduleId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('getModuleProgress error:', error);
  }
  return data || { module_id: moduleId, completed: false, tabs_visited: [] };
}

/* ── Mark a tab as visited ──────────────────────────────────── */
export async function markTabVisited(userId, moduleId, tabName) {
  // First get current progress
  const current = await getModuleProgress(userId, moduleId);
  const visited = new Set(current.tabs_visited || []);
  visited.add(tabName);

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id:         userId,
      module_id:       moduleId,
      tabs_visited:    Array.from(visited),
      last_visited_at: new Date().toISOString()
    }, {
      onConflict:      'user_id,module_id',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) console.error('markTabVisited error:', error);
  return data;
}

/* ── Mark module as complete ────────────────────────────────── */
export async function markModuleComplete(userId, moduleId) {
  const current = await getModuleProgress(userId, moduleId);
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id:         userId,
      module_id:       moduleId,
      completed:       true,
      completed_at:    new Date().toISOString(),
      tabs_visited:    current.tabs_visited || [],
      last_visited_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,module_id'
    })
    .select()
    .single();

  if (error) console.error('markModuleComplete error:', error);
  return data;
}

/* ── Calculate overall progress percentage ──────────────────── */
export function calculateProgress(progressRows) {
  if (!progressRows || progressRows.length === 0) return 0;
  const total     = MODULES.length;
  const completed = progressRows.filter(r => r.completed).length;
  return Math.round((completed / total) * 100);
}

/* ── Build a map: moduleId → progress row ───────────────────── */
export function buildProgressMap(progressRows) {
  const map = {};
  for (const row of (progressRows || [])) {
    map[row.module_id] = row;
  }
  return map;
}
