'use client'

import { useState } from 'react'
import { useStore, type CharacterOptions } from '@/lib/store'

const SKIN_TONES = ['#e9b48a','#d4956a','#c07a4a','#8d5524','#5c3317']
const HAIR_COLORS = ['#2b2b30','#4a3728','#c19a6b','#e8c84a','#e84a4a','#ffffff']
const SUIT_COLORS = ['#e8ff47','#47c8ff','#ff6b47','#c847ff','#47ff8a']

export function LoginScreen() {
  const { login } = useStore()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [char, setChar] = useState<CharacterOptions>({ skinTone:'#e9b48a', hairColor:'#2b2b30', suitColor:'#e8ff47' })
  const [error, setError] = useState('')

  function handleLogin() {
    if (!name.trim()) { setError('Enter your name'); return }
    if (pin.length < 4) { setError('PIN must be 4 digits'); return }
    login(name.trim(), char)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <div className="flex flex-col items-center justify-end px-6 pt-16 pb-8 bg-gradient-to-b from-[#0f0f0f] to-background border-b border-border">
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Omnifit Logo" width={80} height={80} className="rounded-2xl neon-glow"/>
        </div>
        <p className="font-pixel text-[10px] tracking-widest text-primary uppercase mb-2">Omnifit</p>
        <h1 className="text-4xl font-black tracking-tight uppercase text-center leading-none mb-2">
          TRAIN<br/><span className="text-primary">HARDER.</span><br/>BULK UP.
        </h1>
        <p className="text-sm text-muted-foreground text-center">Built for your gear. Built for your goals.</p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 px-6 py-6 flex-1">
        {/* Character preview */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-pixel text-[9px] uppercase tracking-widest text-primary mb-3">Customise your fighter</p>
          <div className="flex gap-4 items-center">
            {/* Mini character preview */}
            <div className="w-16 h-16 rounded-xl border border-border bg-background flex items-center justify-center flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <rect x="14" y="2" width="12" height="10" rx="2" fill={char.hairColor}/>
                <rect x="12" y="8" width="16" height="12" rx="2" fill={char.skinTone}/>
                <rect x="15" y="12" width="3" height="3" fill="#0a0a0a"/>
                <rect x="22" y="12" width="3" height="3" fill="#0a0a0a"/>
                <rect x="10" y="20" width="20" height="14" rx="2" fill={char.suitColor}/>
                <rect x="4" y="20" width="7" height="12" rx="2" fill={char.suitColor}/>
                <rect x="29" y="20" width="7" height="12" rx="2" fill={char.suitColor}/>
                <rect x="12" y="34" width="7" height="6" rx="1" fill="#1a1a1a"/>
                <rect x="21" y="34" width="7" height="6" rx="1" fill="#1a1a1a"/>
              </svg>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wide">Skin</p>
                <div className="flex gap-2">
                  {SKIN_TONES.map(c => (
                    <button key={c} onClick={() => setChar(p => ({...p, skinTone: c}))}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: char.skinTone === c ? '#e8ff47' : 'transparent' }}/>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wide">Hair</p>
                <div className="flex gap-2">
                  {HAIR_COLORS.map(c => (
                    <button key={c} onClick={() => setChar(p => ({...p, hairColor: c}))}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: char.hairColor === c ? '#e8ff47' : 'transparent' }}/>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wide">Suit</p>
                <div className="flex gap-2">
                  {SUIT_COLORS.map(c => (
                    <button key={c} onClick={() => setChar(p => ({...p, suitColor: c}))}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: char.suitColor === c ? '#e8ff47' : 'transparent' }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Name + PIN */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground block mb-2">Name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="What do we call you?"
              className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground block mb-2">PIN</label>
            <input
              value={pin} onChange={e => setPin(e.target.value.replace(/\D/,'').slice(0,4))}
              placeholder="4-digit PIN" type="password" inputMode="numeric" maxLength={4}
              className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <button onClick={handleLogin}
          className="w-full bg-primary text-primary-foreground font-bold text-sm rounded-xl py-4 neon-glow active:scale-95 transition-transform uppercase tracking-wide">
          LET'S GO →
        </button>
      </div>
    </div>
  )
}
