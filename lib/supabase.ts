import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ancycwboaabumchgenvm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_I0-KfXydlqVqNwoMDToB-g_1y_p2Vot'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)