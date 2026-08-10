import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Google redirects back here after you approve login.
// We swap the temporary `code` for a real Supabase session,
// then send the user back into the app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/`)
}
