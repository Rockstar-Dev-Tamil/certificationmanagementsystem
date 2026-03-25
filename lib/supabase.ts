import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mock-client';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

let client: any;

if (USE_MOCK) {
    console.log('🧪 MOCK MODE: Using local JSON database instead of Supabase.');
    client = mockSupabase;
} else {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('⚠️ Supabase credentials missing. Database operations will fail.');
    }

    client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export const supabase = client;
