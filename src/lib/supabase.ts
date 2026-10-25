import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksojkdlclxwvmefypxdt.supabase.co'
const supabaseKey = 'sb_publishable_Ocbd6qvzkkDpF8HM7DaJVw_cD3iIUNE'

export const supabase = createClient(supabaseUrl, supabaseKey)
