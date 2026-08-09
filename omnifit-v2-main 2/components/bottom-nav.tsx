'use client'

import { Home, Dumbbell, Swords, BarChart2, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export type Screen = 'home' | 'routine' | 'battle' | 'progress' | 'profile'

const NAV = [
  { id:'home' as Screen,     icon: Home,     label:'Home' },
  { id:'routine' as Screen,  icon: Dumbbell, label:'Routine' },
  { id:'battle' as Screen,   icon: Swords,   label:'Battle' },
  { id:'progress' as Screen, icon: BarChart2, label:'Progress' },
  { id:'profile' as Screen,  icon: User,     label:'Profile' },
]

export function BottomNav() {
  const { screen, setScreen } = useStore()
  return (
    <nav className="flex bg-card/95 backdrop-blur border-t border-border px-1 py-2 pb-safe">
      {NAV.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setScreen(id)}
          className={cn('flex flex-1 flex-col items-center gap-1 py-1.5 rounded-xl transition-colors',
            screen === id ? 'text-primary' : 'text-muted-foreground')}>
          <Icon className="h-5 w-5" strokeWidth={screen===id ? 2.5 : 2}/>
          <span className={cn('text-[8px] font-pixel uppercase tracking-[0.05em]', screen===id ? 'text-primary' : 'text-muted-foreground')}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
