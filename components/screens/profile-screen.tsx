'use client'

import { useState } from 'react'
import { useStore, type CharacterOptions } from '@/lib/store'

const SKIN_TONES = ['#e9b48a','#d4956a','#c07a4a','#8d5524','#5c3317']
const HAIR_COLORS = ['#2b2b30','#4a3728','#c19a6b','#e8c84a','#e84a4a','#ffffff']
const SUIT_COLORS = ['#e8ff47','#47c8ff','#ff6b47','#c847ff','#47ff8a']

export function ProfileScreen() {
  const { userName, character, level, streak, totalWorkouts, logout, updateCharacter } = useStore()


  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      {/* Character card */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.png" alt="Your character" width={90} height={110} className="pixelated" style={{ imageRendering:'pixelated' }}/>
        <div className="text-center">
          <p className="text-xl font-bold">{userName}</p>
          <p className="text-sm text-muted-foreground">Level {level} · {totalWorkouts} workouts · {streak} day streak</p>
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
