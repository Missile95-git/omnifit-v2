'use client'

import {
  createContext, useContext, useMemo, useReducer,
  useEffect, type ReactNode,
} from 'react'

// ── TYPES ──────────────────────────────────────────────────────────────────────
export type SetLog = { pin: string; reps: string; done: boolean }

export type Exercise = {
  id: string
  name: string
  sets: number
  reps: string
  equip: string
  inputType: 'dumbbell' | 'pin' | 'bodyweight'
  dbOptions?: number[]
  knee: 'safe' | 'warn'
  note: string
  video: string
}

export type DayRoutine = {
  label: string
  subtitle: string
  color: string
  kneeDay?: boolean
  exercises: Exercise[]
}

export type BattleEvent = {
  id: number
  kind: 'hit-boss' | 'hit-player'
  amount: number
  label: string
}

export type CharacterOptions = {
  skinTone: string
  hairColor: string
  suitColor: string
}

type State = {
  // Auth
  userName: string | null
  character: CharacterOptions

  // Game
  level: number
  xp: number
  xpToNext: number
  streak: number
  totalWorkouts: number
  playerHp: number
  playerMaxHp: number
  bossHp: number
  bossMaxHp: number
  bossName: string
  lastEvent: BattleEvent | null
  log: string[]

  // Routine
  activeDay: 'push' | 'pull' | 'legs'
  sessionLogs: Record<string, Record<string, SetLog[]>>  // date -> exId -> sets
  weekActivity: boolean[]

  // Diet
  dietChecks: Record<string, Record<string, boolean>>  // date -> item -> bool

  // UI
  screen: 'login' | 'home' | 'routine' | 'battle' | 'progress' | 'profile'
}

type Action =
  | { type: 'LOGIN'; name: string; character: CharacterOptions }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; screen: State['screen'] }
  | { type: 'SET_DAY'; day: 'push' | 'pull' | 'legs' }
  | { type: 'UPDATE_SET'; date: string; exId: string; i: number; field: 'pin' | 'reps' | 'done'; value: string | boolean }
  | { type: 'COMPLETE_WORKOUT' }
  | { type: 'SKIP_DAY' }
  | { type: 'TOGGLE_DIET'; date: string; item: string }
  | { type: 'UPDATE_CHARACTER'; character: CharacterOptions }
  | { type: 'LOAD'; payload: Partial<State> }

// ── ROUTINE DATA ───────────────────────────────────────────────────────────────
export const DB_WEIGHTS = [2.5, 5, 7.5, 10, 12.5]

export const ROUTINE: Record<string, DayRoutine> = {
  push: {
    label: 'Push', subtitle: 'Chest · Shoulders · Triceps', color: '#e8ff47',
    exercises: [
      { id:'bp',  name:'DB Bench Press',          sets:4, reps:'8–10',  equip:'Flat bench + dumbbells',   inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 10–12.5kg DBs. Press both up together, lower slow.', video:'https://www.youtube.com/watch?v=VmB1G1K7v94' },
      { id:'ibp', name:'Incline DB Press',         sets:3, reps:'8–10',  equip:'Incline bench (45°) + DBs',inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Set bench to 45°. Use 7.5–10kg DBs. Targets upper chest.', video:'https://www.youtube.com/watch?v=8iPEnn-ltC8' },
      { id:'cp',  name:'Chest Press Station',      sets:3, reps:'10–12', equip:'Multi-station machine',    inputType:'pin',      knee:'safe', note:'Note your pin each week to track progress.', video:'https://www.youtube.com/watch?v=xUm0BiZCX_I' },
      { id:'pf',  name:'Pec Fly Station',          sets:3, reps:'12–15', equip:'Multi-station machine',    inputType:'pin',      knee:'safe', note:'Slow and controlled on the way back — feel the stretch.', video:'https://www.youtube.com/watch?v=Iwe6AmxVf7o' },
      { id:'ohp', name:'DB Shoulder Press',        sets:3, reps:'8–10',  equip:'Flat bench + dumbbells',   inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 7.5–10kg DBs. Sit on bench, press overhead. Core tight.', video:'https://www.youtube.com/watch?v=qEwKCR5JCog' },
      { id:'dlr', name:'DB Lateral Raise',         sets:3, reps:'12–15', equip:'Hex dumbbells',            inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 5kg DBs. Slow raise to shoulder height, slow lower.', video:'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
      { id:'tpu', name:'Tricep Pushdown',          sets:3, reps:'10–12', equip:'Multi-station low pulley', inputType:'pin',      knee:'safe', note:'Attach rope or straight bar. Elbows locked at sides.', video:'https://www.youtube.com/watch?v=2-LAMcpzODU' },
    ]
  },
  pull: {
    label: 'Pull', subtitle: 'Back · Biceps · Rear Delts', color: '#47c8ff',
    exercises: [
      { id:'pu',  name:'Pull-Ups',                 sets:4, reps:'Max',   equip:'Pull-up bar',              inputType:'bodyweight', knee:'safe', note:"Can't do full ones yet? Jump up and lower slowly — builds strength fast.", video:'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
      { id:'lpd', name:'Lat Pulldown',             sets:4, reps:'8–10',  equip:'Multi-station machine',    inputType:'pin',        knee:'safe', note:'Lean back slightly, pull bar to upper chest. Squeeze lats at bottom.', video:'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
      { id:'row', name:'Seated Row',               sets:4, reps:'8–10',  equip:'Multi-station low pulley', inputType:'pin',        knee:'safe', note:'Back straight, pull to belly button, squeeze shoulder blades.', video:'https://www.youtube.com/watch?v=GZbfZ033f74' },
      { id:'dbr', name:'DB Bent-Over Row',         sets:3, reps:'10–12', equip:'Flat bench + dumbbells',   inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 10–12.5kg. Support with one knee on bench, row with other arm.', video:'https://www.youtube.com/watch?v=pYcpY20QaE8' },
      { id:'cur', name:'DB Bicep Curl',            sets:3, reps:'10–12', equip:'Hex dumbbells',            inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 7.5–10kg. Alternate arms, full range, slow on the way down.', video:'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
      { id:'hc',  name:'Hammer Curl',              sets:2, reps:'12',    equip:'Hex dumbbells',            inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 7.5kg. Neutral grip (thumbs up). Builds forearm thickness.', video:'https://www.youtube.com/watch?v=zC3nLlEvin4' },
    ]
  },
  legs: {
    label: 'Legs', subtitle: 'Quads · Hamstrings · Calves', color: '#ff6b47',
    kneeDay: true,
    exercises: [
      { id:'lp',  name:'Leg Press Station',        sets:4, reps:'12',    equip:'Multi-station machine',    inputType:'pin',        knee:'warn', note:'⚠ LEFT KNEE: Stop at 90° — do not go below parallel. No pain, no grinding.', video:'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
      { id:'le',  name:'Leg Extension',            sets:3, reps:'12–15', equip:'Multi-station machine',    inputType:'pin',        knee:'warn', note:'⚠ LEFT KNEE: Light pin only. Full extension fine, slow controlled return.', video:'https://www.youtube.com/watch?v=YyvSfVjQeL0' },
      { id:'lc',  name:'Lying DB Leg Curl',        sets:3, reps:'12–15', equip:'One 5kg dumbbell',         inputType:'dumbbell', dbOptions:[5], knee:'safe', note:'Lie face down on bench. Hold 5kg DB between feet. Curl heels to glutes. Slow and controlled.', video:'https://www.youtube.com/watch?v=ELOCsoDSmrg' },
      { id:'rdl', name:'DB Romanian Deadlift',     sets:3, reps:'10',    equip:'Hex dumbbells',            inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Use 12.5kg DBs. Hinge at hip, soft bend in knee, lower DBs along legs.', video:'https://www.youtube.com/watch?v=7j-2todFRYg' },
      { id:'cr',  name:'Single Leg Calf Raise',    sets:4, reps:'15–20', equip:'Pull-up bar + 10kg DB',    inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'safe', note:'Hold pull-up bar for balance. Hold 10kg DB in one hand. Rise on toes fully, slow lower. One leg at a time.', video:'https://www.youtube.com/watch?v=jwCIBUMG1ZQ' },
      { id:'bss', name:'DB Bulgarian Split Squat', sets:3, reps:'10–12', equip:'Flat bench + dumbbells',   inputType:'dumbbell', dbOptions:DB_WEIGHTS, knee:'warn', note:'⚠ LEFT KNEE: Rear foot on bench, front foot forward. Use 5–7.5kg DBs. Shallow depth — no pain.', video:'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
    ]
  }
}

export const DIET_ITEMS = [
  { id:'eggs',    label:'3 eggs eaten 🥚' },
  { id:'banana',  label:'2 bananas eaten 🍌' },
  { id:'milk',    label:'Extra glass of milk 🥛' },
  { id:'lunch',   label:'Full lunch plate 🍚' },
  { id:'dinner',  label:'Big dinner before bed 🌙' },
  { id:'water',   label:'3 bottles of water 💧' },
]

const BOSS_NAMES = [
  'IRONCLAD','VOIDLIFTER','STONECRUSHER','DREADHORN',
  'SHADOWFIST','BONECAGE','RUINBRINGER','GRIMPLATE',
  'SOULFORGE','DARKMANTLE','WRAITHBANE','ABYSSWALKER',
]

const BOSS_DAMAGE = 22
const PLAYER_DAMAGE = 18
let eventId = 1

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

function getBossForLevel(level: number) {
  const name = BOSS_NAMES[(level - 1) % BOSS_NAMES.length]
  const maxHp = 100 + (level - 1) * 20
  return { bossName: name, bossMaxHp: maxHp, bossHp: maxHp, bossLevel: level }
}

function getDayForDate(): 'push' | 'pull' | 'legs' {
  const d = new Date().getDay()
  return (['push','push','pull','legs','push','pull','legs'] as const)[d]
}

const DEFAULT_CHARACTER: CharacterOptions = {
  skinTone: '#e9b48a',
  hairColor: '#2b2b30',
  suitColor: '#e8ff47',
}

const initialState: State = {
  userName: null,
  character: DEFAULT_CHARACTER,
  level: 1,
  xp: 0,
  xpToNext: 100,
  streak: 0,
  totalWorkouts: 0,
  playerHp: 100,
  playerMaxHp: 100,
  ...getBossForLevel(1),
  lastEvent: null,
  log: ['Boss IRONCLAD appeared. Complete workouts to deal damage!'],
  activeDay: getDayForDate(),
  sessionLogs: {},
  weekActivity: [false,false,false,false,false,false,false],
  dietChecks: {},
  screen: 'login',
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, userName: action.name, character: action.character, screen: 'home' }
    case 'LOGOUT':
      return { ...initialState }
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }
    case 'SET_DAY':
      return { ...state, activeDay: action.day }
    case 'UPDATE_SET': {
      const { date, exId, i, field, value } = action
      const dayLogs = state.sessionLogs[date] || {}
      const exLog = [...(dayLogs[exId] || [])]
      if (!exLog[i]) exLog[i] = { pin: '', reps: '', done: false }
      exLog[i] = { ...exLog[i], [field]: value }
      return {
        ...state,
        sessionLogs: {
          ...state.sessionLogs,
          [date]: { ...dayLogs, [exId]: exLog }
        }
      }
    }
    case 'COMPLETE_WORKOUT': {
      const newBossHp = clamp(state.bossHp - BOSS_DAMAGE, 0, state.bossMaxHp)
      const defeated = newBossHp <= 0
      const newLevel = defeated ? state.level + 1 : state.level
      const newXp = state.xp + 80
      const levelUp = newXp >= state.xpToNext
      const today = new Date().getDay()
      const newWeek = [...state.weekActivity]
      if (today > 0) newWeek[today - 1] = true
      const bossData = defeated ? getBossForLevel(newLevel) : {}
      return {
        ...state,
        ...bossData,
        bossHp: defeated ? (bossData as any).bossHp : newBossHp,
        level: levelUp ? state.level + 1 : state.level,
        xp: levelUp ? newXp - state.xpToNext : newXp,
        xpToNext: levelUp ? state.xpToNext + 50 : state.xpToNext,
        streak: state.streak + 1,
        totalWorkouts: state.totalWorkouts + 1,
        playerHp: clamp(state.playerHp + 6),
        weekActivity: newWeek,
        lastEvent: { id: eventId++, kind: 'hit-boss', amount: BOSS_DAMAGE, label: defeated ? 'BOSS DEFEATED!' : `-${BOSS_DAMAGE} HP` },
        log: [
          defeated ? `You defeated ${state.bossName}! Level ${newLevel} boss emerges!` : `Workout complete! Dealt ${BOSS_DAMAGE} damage to ${state.bossName}.`,
          ...state.log
        ].slice(0, 8),
      }
    }
    case 'SKIP_DAY': {
      const newHp = clamp(state.playerHp - PLAYER_DAMAGE)
      return {
        ...state,
        playerHp: newHp,
        streak: 0,
        lastEvent: { id: eventId++, kind: 'hit-player', amount: PLAYER_DAMAGE, label: `-${PLAYER_DAMAGE} HP` },
        log: [`Day skipped. You took ${PLAYER_DAMAGE} damage and lost your streak.`, ...state.log].slice(0, 8),
      }
    }
    case 'TOGGLE_DIET': {
      const { date, item } = action
      const dayChecks = state.dietChecks[date] || {}
      return { ...state, dietChecks: { ...state.dietChecks, [date]: { ...dayChecks, [item]: !dayChecks[item] } } }
    }
    case 'UPDATE_CHARACTER':
      return { ...state, character: action.character }
    case 'LOAD':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

type Store = State & {
  today: string
  toggleDiet: (item: string) => void
  updateSet: (exId: string, i: number, field: 'pin' | 'reps' | 'done', value: string | boolean) => void
  completeWorkout: () => void
  skipDay: () => void
  login: (name: string, character: CharacterOptions) => void
  logout: () => void
  setScreen: (screen: State['screen']) => void
  setDay: (day: 'push' | 'pull' | 'legs') => void
  updateCharacter: (c: CharacterOptions) => void
  getLastLog: (exId: string) => SetLog[] | null
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnifit_v2')
      if (saved) {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD', payload: parsed })
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!state.userName) return
    try {
      const { lastEvent, ...toSave } = state
      localStorage.setItem('omnifit_v2', JSON.stringify(toSave))
    } catch {}
  }, [state])

  const today = todayStr()

  const value = useMemo<Store>(() => ({
    ...state,
    today,
    login: (name, character) => dispatch({ type: 'LOGIN', name, character }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    setScreen: (screen) => dispatch({ type: 'SET_SCREEN', screen }),
    setDay: (day) => dispatch({ type: 'SET_DAY', day }),
    completeWorkout: () => dispatch({ type: 'COMPLETE_WORKOUT' }),
    skipDay: () => dispatch({ type: 'SKIP_DAY' }),
    toggleDiet: (item) => dispatch({ type: 'TOGGLE_DIET', date: today, item }),
    updateSet: (exId, i, field, value) => dispatch({ type: 'UPDATE_SET', date: today, exId, i, field, value }),
    updateCharacter: (character) => dispatch({ type: 'UPDATE_CHARACTER', character }),
    getLastLog: (exId) => {
      const dates = Object.keys(state.sessionLogs).sort().reverse()
      for (const d of dates) {
        if (d === today) continue
        if (state.sessionLogs[d]?.[exId]) return state.sessionLogs[d][exId]
      }
      return null
    },
  }), [state, today])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
