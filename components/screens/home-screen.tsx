'use client'

import { Flame, Swords, Dumbbell } from 'lucide-react'
import { useStore, ROUTINE, DIET_ITEMS } from '@/lib/store'

const DAY_LABELS = ['M','T','W','T','F','S','S']
const DAY_SCHEDULE: Record<string,string> = { push:'Mon & Thu', pull:'Tue & Fri', legs:'Wed & Sat' }

export function HomeScreen() {
  const { userName, character, level, xp, xpToNext, streak, totalWorkouts,
    playerHp, playerMaxHp, bossName, bossHp, bossMaxHp,
    activeDay, sessionLogs, today, dietChecks, toggleDiet, setScreen, setDay } = useStore()

  const xpPct = Math.round((xp / xpToNext) * 100)
  const dayData = ROUTINE[activeDay]
  const todayLog = sessionLogs[today] || {}
  const totalSets = dayData.exercises.reduce((a,e) => a + e.sets, 0)
  const doneSets = dayData.exercises.reduce((a,e) => {
    const log = todayLog[e.id] || []
    return a + log.filter(s => s.done).length
  }, 0)
  const pct = totalSets ? Math.round((doneSets/totalSets)*100) : 0
  const todayDiet = dietChecks[today] || {}
  const dietDone = DIET_ITEMS.filter(d => todayDiet[d.id]).length

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Omnifit" width={36} height={36} className="rounded-xl"/>
          <div>
            <p className="text-xs text-muted-foreground font-pixel uppercase tracking-widest">Welcome back</p>
            <h1 className="text-xl font-bold tracking-tight">{userName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
            <Flame className="h-4 w-4 text-primary"/>
            <span className="font-mono text-sm font-semibold">{streak}d</span>
          </div>
        </div>
      </header>

      {/* Character + XP card */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-4">
        <div className="scanlines absolute inset-0 opacity-60" aria-hidden="true"/>
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl border border-border bg-background p-3 flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" className="pixelated">
              <rect x="14" y="2" width="12" height="10" rx="2" fill={character.hairColor}/>
              <rect x="12" y="8" width="16" height="12" rx="2" fill={character.skinTone}/>
              <rect x="15" y="12" width="3" height="3" fill="#0a0a0a"/>
              <rect x="22" y="12" width="3" height="3" fill="#0a0a0a"/>
              <rect x="10" y="20" width="20" height="14" rx="2" fill={character.suitColor}/>
              <rect x="4" y="20" width="7" height="12" rx="2" fill={character.suitColor}/>
              <rect x="29" y="20" width="7" height="12" rx="2" fill={character.suitColor}/>
              <rect x="12" y="34" width="7" height="6" rx="1" fill="#1a1a1a"/>
              <rect x="21" y="34" width="7" height="6" rx="1" fill="#1a1a1a"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="font-pixel text-[10px] uppercase tracking-widest text-primary">Level {level}</span>
              <span className="font-mono text-xs text-muted-foreground">{xp}/{xpToNext} XP</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width:`${xpPct}%` }}/>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{xpToNext - xp} XP until level {level + 1}</p>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label:'Workouts', val: totalWorkouts },
          { label:'HP', val: `${playerHp}/${playerMaxHp}` },
          { label:'Diet', val: `${dietDone}/${DIET_ITEMS.length}` },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-3">
            <span className="font-mono text-lg font-bold text-primary">{s.val}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Boss CTA */}
      <button onClick={() => setScreen('battle')}
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--hp-boss)]/30 bg-card p-4 text-left active:scale-[0.98] transition-transform">
        <div className="scanlines absolute inset-0" aria-hidden="true"/>
        <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--hp-boss)]/15 flex-shrink-0">
          <Swords className="h-6 w-6 text-[var(--hp-boss)]"/>
        </span>
        <div className="relative flex-1">
          <p className="font-pixel text-[9px] uppercase tracking-widest text-[var(--hp-boss)]">Active Boss</p>
          <p className="mt-1 font-bold">{bossName}</p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-[var(--hp-boss)] transition-all"
              style={{ width:`${Math.round((bossHp/bossMaxHp)*100)}%` }}/>
          </div>
        </div>
      </button>

      {/* Today's workout */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-pixel text-[9px] uppercase tracking-widest text-primary">{DAY_SCHEDULE[activeDay]}</p>
            <h2 className="font-bold mt-0.5">{dayData.label} Day · {dayData.subtitle}</h2>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-bold text-primary">{pct}%</span>
            <p className="text-[10px] text-muted-foreground">done</p>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-background mb-3">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width:`${pct}%` }}/>
        </div>
        {/* Day selector */}
        <div className="flex gap-2 mb-3">
          {(['push','pull','legs'] as const).map(d => (
            <button key={d} onClick={() => setDay(d)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-pixel uppercase tracking-wide transition-all ${activeDay===d ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground border border-border'}`}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={() => setScreen('routine')}
          className="w-full bg-primary text-primary-foreground font-bold text-sm rounded-xl py-3.5 neon-glow active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Dumbbell className="h-4 w-4"/>
          Start Session →
        </button>
      </section>

      {/* Week activity */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <p className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground mb-3">This Week</p>
        <div className="flex gap-1.5">
          {DAY_LABELS.map((d,i) => {
            const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
            const dt = new Date(); dt.setDate(dt.getDate() - (new Date().getDay() === 0 ? 6 : new Date().getDay()-1) + i)
            const k = dt.toISOString().slice(0,10)
            const done = sessionLogs[k] && Object.values(sessionLogs[k]).some(s => s.some(x => x.done))
            return (
              <div key={i} className={`flex-1 aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all
                ${done ? 'bg-primary text-primary-foreground' : isToday ? 'border border-primary text-primary' : 'bg-background text-muted-foreground'}`}>
                {d}
              </div>
            )
          })}
        </div>
      </section>

      {/* Diet checklist */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <p className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground mb-3">Today's Nutrition — {dietDone}/{DIET_ITEMS.length}</p>
        <div className="flex flex-col gap-2">
          {DIET_ITEMS.map(item => {
            const checked = !!todayDiet[item.id]
            return (
              <button key={item.id} onClick={() => toggleDiet(item.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left active:scale-[0.99] transition-all ${checked ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'}`}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-border'}`}>
                  {checked && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm ${checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
