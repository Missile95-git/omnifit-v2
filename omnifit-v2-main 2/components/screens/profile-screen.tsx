'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'

export function ProfileScreen() {
  const { userName, level, streak, totalWorkouts, logout, setUsername } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(userName ?? '')

  function saveUsername() {
    setUsername(draft.trim() || null)
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-safe">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      {/* Character card */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.png" alt="Your character" width={90} height={110} className="pixelated" style={{ imageRendering:'pixelated' }}/>
        <div className="text-center w-full">
          {editing ? (
            <div className="flex flex-col items-center gap-2">
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Player"
                autoFocus
                className="w-full max-w-[220px] text-center bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2">
                <button onClick={saveUsername}
                  className="text-xs font-semibold text-primary-foreground bg-primary rounded-lg px-3 py-1.5 active:scale-95 transition-transform">
                  Save
                </button>
                <button onClick={() => { setDraft(userName ?? ''); setEditing(false) }}
                  className="text-xs font-semibold text-muted-foreground border border-border rounded-lg px-3 py-1.5 active:scale-95 transition-transform">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="group">
              <p className="text-xl font-bold group-active:opacity-70 transition-opacity">
                {userName || 'Player'} <span className="text-xs font-normal text-muted-foreground underline underline-offset-2">edit</span>
              </p>
            </button>
          )}
          <p className="text-sm text-muted-foreground mt-1">Level {level} · {totalWorkouts} workouts · {streak} day streak</p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {[
          { label:'Goal', val:'Gain muscle / bulk' },
          { label:'Program', val:'PPL 6-day split' },
          { label:'Left knee', val:'Modified exercises' },
          { label:'Dumbbells', val:'2.5 · 5 · 7.5 · 10 · 12.5 kg' },
        ].map(r => (
          <div key={r.label} className="flex justify-between items-center px-4 py-3.5 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{r.label}</span>
            <span className="text-sm font-medium">{r.val}</span>
          </div>
        ))}
      </div>

      <button onClick={logout}
        className="w-full border border-border bg-card text-muted-foreground font-medium text-sm rounded-xl py-3.5 active:scale-95 transition-transform">
        Log Out
      </button>
    </div>
  )
}
