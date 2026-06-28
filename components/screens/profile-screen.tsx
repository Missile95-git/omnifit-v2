'use client'

import { useState } from 'react'
import { useStore, type CharacterOptions } from '@/lib/store'

const SKIN_TONES = ['#e9b48a','#d4956a','#c07a4a','#8d5524','#5c3317']
const HAIR_COLORS = ['#2b2b30','#4a3728','#c19a6b','#e8c84a','#e84a4a','#ffffff']
const SUIT_COLORS = ['#e8ff47','#47c8ff','#ff6b47','#c847ff','#47ff8a']

export function ProfileScreen() {
  const { userName, character, level, streak, totalWorkouts, logout, updateCharacter } = useStore()
  const [char, setChar] = useState<CharacterOptions>(character)

  function save() { updateCharacter(char) }

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      {/* Character card */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-4">
        <svg width="72" height="90" viewBox="0 0 40 54" className="pixelated">
          <rect x="14" y="0" width="12" height="10" rx="2" fill={char.hairColor}/>
          <rect x="12" y="6" width="16" height="14" rx="2" fill={char.skinTone}/>
          <rect x="15" y="10" width="3" height="3" fill="#0a0a0a"/>
          <rect x="22" y="10" width="3" height="3" fill="#0a0a0a"/>
          <rect x="15" y="16" width="10" height="2" fill="#0a0a0a"/>
          <rect x="10" y="20" width="20" height="18" rx="2" fill={char.suitColor}/>
          <rect x="3" y="20" width="8" height="14" rx="2" fill={char.suitColor}/>
          <rect x="29" y="20" width="8" height="14" rx="2" fill={char.suitColor}/>
          <rect x="12" y="38" width="7" height="10" rx="1" fill="#1a1a1a"/>
          <rect x="21" y="38" width="7" height="10" rx="1" fill="#1a1a1a"/>
        </svg>
        <div className="text-center">
          <p className="text-xl font-bold">{userName}</p>
          <p className="text-sm text-muted-foreground">Level {level} · {totalWorkouts} workouts · {streak} day streak</p>
        </div>
      </div>

      {/* Character editor */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="font-pixel text-[9px] uppercase tracking-widest text-primary mb-4">Customise Fighter</p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Skin Tone</p>
            <div className="flex gap-3">
              {SKIN_TONES.map(c => (
                <button key={c} onClick={() => setChar(p => ({...p, skinTone:c}))}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{ backgroundColor:c, borderColor: char.skinTone===c ? '#e8ff47':'transparent' }}/>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Hair Color</p>
            <div className="flex gap-3">
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => setChar(p => ({...p, hairColor:c}))}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{ backgroundColor:c, borderColor: char.hairColor===c ? '#e8ff47':'transparent' }}/>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Suit Color</p>
            <div className="flex gap-3">
              {SUIT_COLORS.map(c => (
                <button key={c} onClick={() => setChar(p => ({...p, suitColor:c}))}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{ backgroundColor:c, borderColor: char.suitColor===c ? '#e8ff47':'transparent' }}/>
              ))}
            </div>
          </div>
          <button onClick={save}
            className="w-full bg-primary text-primary-foreground font-bold text-sm rounded-xl py-3 active:scale-95 transition-transform mt-1">
            Save Changes
          </button>
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
