import { API_URL, DATABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';

export const supabase = createClient<Database>(API_URL, SUPABASE_ANON_KEY);
