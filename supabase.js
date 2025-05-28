import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dfhbhtmxdjgyxxspwpnq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaGJodG14ZGpneXh4c3B3cG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjc1MjUsImV4cCI6MjA2NDAwMzUyNX0.TZ4v_A5084vwDxVpZOM1-vmk8ufTRJTAPxE3heBm030'

export const supabase = createClient(supabaseUrl, supabaseKey)
