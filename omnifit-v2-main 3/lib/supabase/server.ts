import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Used inside server components and route handlers (e.g. the OAuth
// callback). Reads/writes the session via cookies so auth persists
// across requests without you managing tokens manually.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
            // if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
