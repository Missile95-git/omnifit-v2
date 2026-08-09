import { createBrowserClient } from '@supabase/ssr'

// Used inside 'use client' components (login screen, store, etc.)
// Reads the public URL + anon key — safe to expose in the browser.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
