'use client'

import { useEffect } from 'react'
import { StoreProvider, useStore } from '@/lib/store'
import { BottomNav } from '@/components/bottom-nav'
import { LoginScreen } from '@/components/screens/login-screen'
import { HomeScreen } from '@/components/screens/home-screen'
import { RoutineScreen } from '@/components/screens/routine-screen'
import { BattleScreen } from '@/components/screens/battle-screen'
import { ProgressScreen } from '@/components/screens/progress-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'

function App() {
  const { userName, screen, checkSkippedDay } = useStore()

  useEffect(() => {
    checkSkippedDay()
  }, [])

  if (!userName) return <LoginScreen />

  return (
    <div className="relative flex h-screen w-full max-w-[390px] flex-col overflow-hidden bg-background sm:h-[844px] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-2xl">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {screen === 'home'     && <HomeScreen />}
        {screen === 'routine'  && <RoutineScreen />}
        {screen === 'battle'   && <BattleScreen />}
        {screen === 'progress' && <ProgressScreen />}
        {screen === 'profile'  && <ProfileScreen />}
      </div>
      <BottomNav />
    </div>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <main className="flex min-h-screen items-stretch justify-center bg-[#050505] sm:items-center sm:py-8">
        <App />
      </main>
    </StoreProvider>
  )
}
