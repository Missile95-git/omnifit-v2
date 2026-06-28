'use client'

import { useState } from 'react'
import { RotateCcw, Swords, Play } from 'lucide-react'
import { useStore, ROUTINE, DB_WEIGHTS } from '@/lib/store'
import { cn } from '@/lib/utils'

export function RoutineScreen() {
  const { activeDay, setDay, sessionLogs, today, updateSet, getLastLog, completeWorkout, setScreen } = useStore()
  const [openCards, setOpenCards] = useState<Record<string,boolean>>({})
  const day = ROUTINE[activeDay]
  const todayLog = sessionLogs[today] || {}

  const totalSets = day.exercises.reduce((a,e) => a + e.sets, 0)
  const doneSets = day.exercises.reduce((a,e) => {
    const log = todayLog[e.id] || []
    return a + log.filter(s => s.done).length
  }, 0)
  const allDone = doneSets === totalSets
  const pct = totalSets ? Math.round((doneSets/totalSets)*100) : 0

  function getSetLog(exId: string, sets: number) {
    if (todayLog[exId]?.length) return todayLog[exId]
    const last = getLastLog(exId)
    if (last) return last.map(s => ({ ...s, done: false }))
    return Array.from({ length: sets }, () => ({ pin:'', reps:'', done: false }))
  }

  function handleFinish() {
    completeWorkout()
    setScreen('battle')
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">{day.label} Day</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{day.subtitle}</h1>
        </div>
        <button onClick={() => setOpenCards({})} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <RotateCcw className="h-4 w-4"/>
        </button>
      </header>

      {/* Day tabs */}
      <div className="flex gap-2">
        {(['push','pull','legs'] as const).map(d => (
          <button key={d} onClick={() => { setDay(d); setOpenCards({}) }}
            className={cn('flex-1 py-2 rounded-xl text-xs font-pixel uppercase tracking-wide border transition-all',
              activeDay===d ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border')}>
            {d}
          </button>
        ))}
      </div>

      {/* Knee warning */}
      {day.kneeDay && (
        <div className="rounded-xl border border-[var(--hp-boss)]/30 bg-[var(--hp-boss)]/8 p-3 flex gap-3 items-start">
          <span className="text-[var(--hp-boss)] mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-[var(--hp-boss)]">Left knee protocol active</p>
            <p className="text-xs text-muted-foreground mt-0.5">Watch notes on each exercise carefully.</p>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">{doneSets} of {totalSets} sets</span>
          <span className="font-mono text-sm text-primary font-bold">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width:`${pct}%` }}/>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="flex flex-col gap-3">
        {day.exercises.map((ex, idx) => {
          const log = getSetLog(ex.id, ex.sets)
          const done = log.filter(s => s.done).length
          const isOpen = openCards[ex.id]
          const lastLog = getLastLog(ex.id)

          return (
            <div key={ex.id} className={cn('rounded-2xl border bg-card overflow-hidden transition-all', done===ex.sets ? 'border-primary/40' : 'border-border')}>
              {/* Header */}
              <button onClick={() => setOpenCards(p => ({...p, [ex.id]: !p[ex.id]}))}
                className="w-full flex items-center gap-3 p-4 text-left active:bg-background/50 transition-colors">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all',
                  done===ex.sets ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground')}>
                  {done===ex.sets ? '✓' : idx+1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{ex.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{ex.sets} sets · {ex.reps} · {ex.equip}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ex.knee==='warn' && <span className="text-[10px] text-[var(--hp-boss)] bg-[var(--hp-boss)]/10 px-2 py-0.5 rounded-full">Knee ⚠</span>}
                  <span className={cn('transition-transform text-muted-foreground text-lg', isOpen && 'rotate-90')}>›</span>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  {/* Note */}
                  {ex.note && (
                    <div className={cn('mt-3 rounded-lg p-3 text-xs leading-relaxed',
                      ex.knee==='warn' ? 'bg-[var(--hp-boss)]/8 text-[var(--hp-boss)] border-l-2 border-[var(--hp-boss)]' : 'bg-background text-muted-foreground')}>
                      {ex.note}
                    </div>
                  )}

                  {/* Last session */}
                  {lastLog && (
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                      Last session: {lastLog.map((s,i) => `Set${i+1} ${s.pin||'—'}×${s.reps||'—'}`).join(' · ')}
                    </p>
                  )}

                  {/* Video */}
                  <a href={ex.video} target="_blank" rel="noopener"
                    className="mt-3 mb-2 inline-flex items-center gap-2 text-xs bg-red-950/40 border border-red-800/30 text-red-400 px-3 py-2 rounded-lg">
                    <Play className="h-3 w-3"/> Watch Tutorial
                  </a>

                  {/* Set rows */}
                  <div className="flex flex-col gap-2 mt-2">
                    {Array.from({ length: ex.sets }, (_,i) => {
                      const s = log[i] || { pin:'', reps:'', done:false }
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-mono w-10 flex-shrink-0">Set {i+1}</span>

                          {/* Pin or DB selector */}
                          {ex.inputType === 'dumbbell' ? (
                            <div className="flex gap-1 flex-wrap flex-1">
                              {(ex.dbOptions || DB_WEIGHTS).map(w => (
                                <button key={w}
                                  onClick={() => updateSet(ex.id, i, 'pin', `${w}kg`)}
                                  className={cn('px-2 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all',
                                    s.pin===`${w}kg` ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border')}>
                                  {w}
                                </button>
                              ))}
                            </div>
                          ) : ex.inputType === 'pin' ? (
                            <input value={s.pin} placeholder="Pin #"
                              onChange={e => updateSet(ex.id, i, 'pin', e.target.value)}
                              className="w-16 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:border-primary text-center"/>
                          ) : (
                            <span className="text-xs text-muted-foreground flex-1 font-mono">Bodyweight</span>
                          )}

                          {/* Reps */}
                          <input value={s.reps} placeholder={ex.reps}
                            onChange={e => updateSet(ex.id, i, 'reps', e.target.value)}
                            inputMode="numeric"
                            className="w-14 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-mono outline-none focus:border-primary text-center"/>

                          {/* Done check */}
                          <button onClick={() => updateSet(ex.id, i, 'done', !s.done)}
                            className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all',
                              s.done ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-transparent')}>
                            ✓
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Finish */}
      <button onClick={handleFinish} disabled={!allDone}
        className={cn('flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all active:scale-95',
          allDone ? 'bg-primary text-primary-foreground neon-glow' : 'cursor-not-allowed border border-border bg-card text-muted-foreground')}>
        <Swords className="h-5 w-5" strokeWidth={2.5}/>
        {allDone ? 'Finish & Attack Boss!' : `${doneSets}/${totalSets} sets done`}
      </button>
    </div>
  )
}
