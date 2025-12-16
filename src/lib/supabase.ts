import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abkczipdypfocgdxmajc.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFia2N6aXBkeXBmb2NnZHhtYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzQ1NDUsImV4cCI6MjA4MDk1MDU0NX0.w6i-6DWqiecqkchXWwHMoeX_e8O1iisY_7e6Q0aSOBw'

export const supabase = createClient(supabaseUrl, supabaseKey)
