'use client'

import { useEffect, useState } from 'react'
import { Swords, SkipForward, Skull, Flame } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function BattleScreen() {
  const { playerHp, playerMaxHp, bossHp, bossMaxHp, bossName,
    level, streak, lastEvent, log, completeWorkout, skipDay, character } = useStore()

  const [bossHit, setBossHit] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  const [popup, setPopup] = useState<{ id:number; text:string; kind:string } | null>(null)

  // Boss scale increases with level — 1.0 at level 1, up to 1.6 at level 10+
  const bossScale = Math.min(1 + (level - 1) * 0.06, 1.6)

  useEffect(() => {
    if (!lastEvent) return
    setPopup({ id: lastEvent.id, text: lastEvent.label, kind: lastEvent.kind })
    if (lastEvent.kind === 'hit-boss') {
      setBossHit(true)
      const t = setTimeout(() => setBossHit(false), 450)
      return () => clearTimeout(t)
    } else {
      setPlayerHit(true)
      const t = setTimeout(() => setPlayerHit(false), 450)
      return () => clearTimeout(t)
    }
  }, [lastEvent])

  useEffect(() => {
    if (!popup) return
    const t = setTimeout(() => setPopup(null), 900)
    return () => clearTimeout(t)
  }, [popup])

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">Boss Battle</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Arena</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
          <Flame className="h-4 w-4 text-primary"/>
          <span className="font-mono text-sm font-semibold">{streak}d</span>
        </div>
      </header>

      {/* Arena */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#15171f] to-[#0a0a0a]">
        <div className="scanlines absolute inset-0" aria-hidden="true"/>

        {/* HP Bars */}
        <div className="relative flex items-start justify-between gap-3 p-4">
          <div className="w-[44%]">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="font-pixel text-[8px] uppercase text-foreground">You</span>
              <span className="font-mono text-[10px] text-muted-foreground">Lv.{level}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background/60 border border-border">
              <div className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width:`${Math.round((playerHp/playerMaxHp)*100)}%` }}/>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-1">{playerHp}/{playerMaxHp} HP</p>
          </div>
          <div className="w-[44%]">
            <div className="mb-1 flex items-center justify-end gap-1.5">
              <span className="font-pixel text-[8px] uppercase text-[var(--hp-boss)]">{bossName}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background/60 border border-border">
              <div className="h-full rounded-full bg-[var(--hp-boss)] transition-all duration-500"
                style={{ width:`${Math.round((bossHp/bossMaxHp)*100)}%` }}/>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-1 text-right">{bossHp}/{bossMaxHp} HP</p>
          </div>
        </div>

        {/* Stage */}
        <div className="relative flex min-h-[220px] items-end justify-between px-6 pb-10 pt-2">
          <div className="absolute inset-x-4 bottom-8 h-px bg-primary/20" aria-hidden="true"/>

          {/* Player character - SVG */}
          <div className="relative flex flex-col items-center">
            {popup?.kind === 'hit-player' && (
              <span className="pointer-events-none absolute -top-6 z-10 font-pixel text-[10px] font-bold text-primary animate-bob">
                {popup.text}
              </span>
            )}
            <div className={cn('animate-bob', playerHit && 'animate-flash animate-hit')}>
              <svg width="48" height="64" viewBox="0 0 40 54" className="pixelated">
                <rect x="14" y="0" width="12" height="10" rx="2" fill={character.hairColor}/>
                <rect x="12" y="6" width="16" height="14" rx="2" fill={character.skinTone}/>
                <rect x="15" y="10" width="3" height="3" fill="#0a0a0a"/>
                <rect x="22" y="10" width="3" height="3" fill="#0a0a0a"/>
                <rect x="15" y="16" width="10" height="2" fill="#0a0a0a"/>
                <rect x="10" y="20" width="20" height="18" rx="2" fill={character.suitColor}/>
                <rect x="3" y="20" width="8" height="14" rx="2" fill={character.suitColor}/>
                <rect x="29" y="20" width="8" height="14" rx="2" fill={character.suitColor}/>
                <rect x="12" y="38" width="7" height="10" rx="1" fill="#1a1a1a"/>
                <rect x="21" y="38" width="7" height="10" rx="1" fill="#1a1a1a"/>
                <rect x="3" y="34" width="8" height="4" rx="1" fill="#e8ff47" opacity="0.6"/>
              </svg>
            </div>
          </div>

          <span className="font-pixel text-[10px] text-muted-foreground/60 self-center" aria-hidden="true">VS</span>

          {/* Boss - actual image, scaled by level */}
          <div className="relative flex flex-col items-center">
            {popup?.kind === 'hit-boss' && (
              <span className="pointer-events-none absolute -top-6 z-10 font-pixel text-[10px] font-bold text-[var(--hp-boss)] animate-bob">
                {popup.text}
              </span>
            )}
            <div className="animate-bob" style={{ animationDelay:'0.6s' }}>
              <div className={cn(bossHit && 'animate-flash animate-hit')}
                style={{ transform: `scale(${bossScale})`, transformOrigin:'bottom center', transition:'transform 0.5s ease' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/boss.jpg" alt="Boss" width={80} height={80}
                  className="pixelated rounded-sm" style={{ imageRendering:'pixelated' }}/>
              </div>
            </div>
            <p className="font-pixel text-[8px] text-[var(--hp-boss)] mt-2 uppercase">Lv.{level}</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={completeWorkout}
          className="flex flex-col items-center gap-1.5 rounded-xl bg-primary px-4 py-4 text-primary-foreground transition-transform active:scale-95 neon-glow">
          <Swords className="h-5 w-5" strokeWidth={2.5}/>
          <span className="text-sm font-bold">Complete Workout</span>
          <span className="text-[11px] opacity-80">-{22} boss HP</span>
        </button>
        <button onClick={skipDay}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--hp-boss)]/40 bg-card px-4 py-4 text-foreground transition-transform active:scale-95">
          <SkipForward className="h-5 w-5 text-[var(--hp-boss)]" strokeWidth={2.5}/>
          <span className="text-sm font-bold">Skip Day</span>
          <span className="text-[11px] text-muted-foreground">-18 your HP</span>
        </button>
      </div>

      {/* Battle log */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Skull className="h-4 w-4 text-muted-foreground"/>
          <h2 className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground">Battle Log</h2>
        </div>
        <ul className="flex flex-col gap-1.5">
          {log.map((entry, i) => (
            <li key={i} className={cn('font-mono text-xs leading-relaxed', i===0 ? 'text-foreground' : 'text-muted-foreground')}>
              <span className="text-primary">{'>'}</span> {entry}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
