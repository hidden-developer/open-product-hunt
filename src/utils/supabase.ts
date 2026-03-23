import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Get or create a viewer ID for anonymous page view tracking
export function getViewerId(userId?: string): string {
  if (userId) return userId;
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('dalink_viewer_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('dalink_viewer_id', id);
  }
  return id;
}
