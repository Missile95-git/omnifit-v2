'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function LoginScreen() {
  const { login } = useStore()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  // On mount: check if we already have a Google session (e.g. just
  // got redirected back from the OAuth callback).
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setCheckingSession(false)
    })
  }, [supabase])

  async function handleGoogleLogin() {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
  }

  function handleUsernameSubmit() {
    // Username is optional — trimmed value or null, either is fine.
    // TODO: once the `profiles` table exists, this should upsert
    // { id: user.id, username } into Supabase instead of only
    // writing to local store. Local login() call kept for now so
    // the rest of the app (which reads userName from the store)
    // keeps working while we build the accounts schema.
    login(username.trim() || null)
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <div className="flex flex-col items-center justify-end px-6 pt-16 pb-8 bg-gradient-to-b from-[#0f0f0f] to-background border-b border-border">
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Omnifit Logo" width={80} height={80} className="rounded-2xl neon-glow" />
        </div>
        <p className="font-pixel text-[10px] tracking-widest text-primary uppercase mb-2">Omnifit</p>
        <h1 className="text-4xl font-black tracking-tight uppercase text-center leading-none mb-2">
          TRAIN<br /><span className="text-primary">HARDER.</span><br />BULK UP.
        </h1>
        <p className="text-sm text-muted-foreground text-center">Built for your gear. Built for your goals.</p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 px-6 py-6 flex-1">
        {!user ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-card border border-border text-foreground font-bold text-sm rounded-xl py-4 active:scale-95 transition-transform uppercase tracking-wide"
          >
            {/* Minimal Google 'G' mark, no external asset needed */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.93A9 9 0 0 0 0 9c0 1.45.35 2.83.93 4.05l3.04-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .93 4.95l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
            <div>
              <label className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground block mb-2">
                Pick a username <span className="normal-case tracking-normal text-muted-foreground/70">(optional — change it anytime later)</span>
              </label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="What do we call you?"
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={handleUsernameSubmit}
              className="w-full bg-primary text-primary-foreground font-bold text-sm rounded-xl py-4 neon-glow active:scale-95 transition-transform uppercase tracking-wide"
            >
              LET'S GO →
            </button>
            <button
              onClick={() => login(null)}
              className="w-full text-center text-xs text-muted-foreground underline underline-offset-2"
            >
              Skip for now
            </button>
          </div>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  )
}
