'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'

export function ProgressScreen() {
  const { level, xp, xpToNext, streak, totalWorkouts, playerHp, playerMaxHp, bossHp, bossMaxHp } = useStore()
  const [weightInput, setWeightInput] = useState('')

  const [weightList, setWeightList] = useState<{date:string,kg:number}[]>(() => {
    try { return JSON.parse(localStorage.getItem('omnifit_weights') || '[]') } catch { return [] }
  })

  const firstW = weightList[0]?.kg
  const lastW = weightList[weightList.length-1]?.kg
  const gained = firstW && lastW ? (lastW - firstW).toFixed(1) : null

  function logWeight() {
    const val = parseFloat(weightInput)
    if (!val || val < 30 || val > 200) return
    const today = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})
    const newList = [...weightList, { date: today, kg: val }]
    setWeightList(newList)
    localStorage.setItem('omnifit_weights', JSON.stringify(newList))
    setWeightInput('')
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-5">
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-widest text-primary">Stats</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Progress</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label:'Level', val: level },
          { label:'Total Workouts', val: totalWorkouts },
          { label:'Streak 🔥', val: `${streak} days` },
          { label:'Weight Gained', val: gained ? `+${gained}kg` : '—' },
          { label:'Player HP', val: `${playerHp}/${playerMaxHp}` },
          { label:'Boss HP Left', val: `${bossHp}/${bossMaxHp}` },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-mono text-2xl font-bold text-primary">{s.val}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex justify-between mb-2">
          <span className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground">XP Progress</span>
          <span className="font-mono text-xs text-primary">{xp}/{xpToNext}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width:`${Math.round((xp/xpToNext)*100)}%` }}/>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="font-pixel text-[9px] uppercase tracking-widest text-muted-foreground mb-3">Weight Log</p>
        <div className="flex gap-2 mb-3">
          <input value={weightInput} onChange={e => setWeightInput(e.target.value)}
            type="number" step="0.1" placeholder="e.g. 47.5 kg" inputMode="decimal"
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"/>
          <button onClick={logWeight}
            className="bg-primary text-primary-foreground font-bold text-sm px-5 rounded-xl active:scale-95 transition-transform">LOG</button>
        </div>
        {weightList.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No entries yet — log your weight after each session.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {weightList.slice(-7).reverse().map((w,i) => (
              <div key={i} className="flex justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{w.date}</span>
                <span className="font-mono text-sm font-semibold text-primary">{w.kg} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
