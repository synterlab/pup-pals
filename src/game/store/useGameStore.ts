import { create } from 'zustand'
import { loadSave, writeSave, SaveData } from '../systems/saveSystem'

export type Screen = 'start' | 'game' | 'shop' | 'tutorial' | 'minigame'
export type DogAnimation = 'idle' | 'happy' | 'eat' | 'sleep' | 'sit' | 'sad'

export interface FoodItem {
  id: string
  name: string
  emoji: string
  hungerRestore: number
  happinessRestore: number
  cost: number
  owned: number
}

export interface ToyItem {
  id: string
  name: string
  emoji: string
  happinessBoost: number
  cost: number
  owned: boolean
}

export interface Trick {
  id: string
  name: string
  emoji: string
  unlockLevel: number
  learned: boolean
}

const DEFAULT_FOOD: FoodItem[] = [
  { id: 'kibble', name: 'Kibble', emoji: '🦴', hungerRestore: 25, happinessRestore: 5, cost: 0, owned: 10 },
  { id: 'treat', name: 'Treat', emoji: '🍖', hungerRestore: 15, happinessRestore: 20, cost: 5, owned: 3 },
  { id: 'steak', name: 'Prime Steak', emoji: '🥩', hungerRestore: 50, happinessRestore: 30, cost: 20, owned: 0 },
  { id: 'cake', name: 'Pup Cake', emoji: '🎂', hungerRestore: 40, happinessRestore: 50, cost: 40, owned: 0 },
]

const DEFAULT_TRICKS: Trick[] = [
  { id: 'sit', name: 'Sit', emoji: '🪑', unlockLevel: 1, learned: false },
  { id: 'spin', name: 'Spin', emoji: '🌀', unlockLevel: 3, learned: false },
  { id: 'shake', name: 'Shake', emoji: '🤝', unlockLevel: 5, learned: false },
  { id: 'fetch', name: 'Fetch', emoji: '🎾', unlockLevel: 8, learned: false },
]

interface GameState {
  screen: Screen
  dogName: string
  hunger: number
  cleanliness: number
  energy: number
  happiness: number
  level: number
  xp: number
  xpToNext: number
  currency: number
  food: FoodItem[]
  tricks: Trick[]
  tutorialComplete: boolean
  tutorialStep: number
  currentAnimation: DogAnimation
  lastSeen: number
  streak: number
  lastStreakDate: string
  audioMuted: boolean
  particles: { id: number; x: number; y: number; type: 'heart' | 'coin' | 'star' }[]
  toast: { message: string; emoji: string } | null
  initialized: boolean
}

interface GameActions {
  initGame: () => void
  setScreen: (screen: Screen) => void
  setAnimation: (anim: DogAnimation) => void
  feedDog: (foodId: string) => void
  batheDog: () => void
  petDog: (x?: number, y?: number) => void
  trainDog: (success: boolean) => void
  sleepDog: () => void
  buyFood: (foodId: string) => void
  completeTutorialStep: () => void
  completeTutorial: () => void
  toggleMute: () => void
  tick: () => void
  learnTrick: (trickId: string) => void
  addParticle: (x: number, y: number, type: 'heart' | 'coin' | 'star') => void
  removeParticle: (id: number) => void
  showToast: (message: string, emoji: string) => void
  clearToast: () => void
}

type Store = GameState & GameActions

const XP_PER_LEVEL = (level: number) => 50 + level * 30

function applyOfflineDecay(save: SaveData): Partial<GameState> {
  const now = Date.now()
  const elapsed = Math.min((now - (save.lastSeen || now)) / 1000 / 60, 480)
  const hungerDecay = elapsed * 0.08
  const cleanDecay = elapsed * 0.04
  const energyDecay = elapsed * 0.05
  return {
    hunger: Math.max(0, (save.hunger ?? 80) - hungerDecay),
    cleanliness: Math.max(0, (save.cleanliness ?? 90) - cleanDecay),
    energy: Math.min(100, (save.energy ?? 80) + elapsed * 0.03 - energyDecay * 0.5),
    lastSeen: now,
  }
}

export const useGameStore = create<Store>((set, get) => ({
  screen: 'start',
  dogName: 'Buddy',
  hunger: 80,
  cleanliness: 90,
  energy: 80,
  happiness: 75,
  level: 1,
  xp: 0,
  xpToNext: 80,
  currency: 20,
  food: DEFAULT_FOOD,
  tricks: DEFAULT_TRICKS,
  tutorialComplete: false,
  tutorialStep: 0,
  currentAnimation: 'idle',
  lastSeen: Date.now(),
  streak: 1,
  lastStreakDate: new Date().toDateString(),
  audioMuted: false,
  particles: [],
  toast: null,
  initialized: false,

  initGame: () => {
    const save = loadSave()
    if (save) {
      const offlineChanges = applyOfflineDecay(save)
      const today = new Date().toDateString()
      const streakContinued = save.lastStreakDate === new Date(Date.now() - 86400000).toDateString()
      set({
        ...save,
        ...offlineChanges,
        streak: streakContinued ? (save.streak || 1) + 1 : save.lastStreakDate === today ? (save.streak || 1) : 1,
        lastStreakDate: today,
        screen: 'start',
        currentAnimation: 'idle',
        particles: [],
        toast: null,
        initialized: true,
      })
    } else {
      set({ initialized: true })
    }
  },

  setScreen: (screen) => {
    set({ screen })
    const state = get()
    writeSave(state)
  },

  setAnimation: (anim) => set({ currentAnimation: anim }),

  feedDog: (foodId) => {
    const state = get()
    const food = state.food.find(f => f.id === foodId)
    if (!food || food.owned < 1) return
    const newFood = state.food.map(f =>
      f.id === foodId ? { ...f, owned: f.owned - 1 } : f
    )
    const newHunger = Math.min(100, state.hunger + food.hungerRestore)
    const newHappiness = Math.min(100, state.happiness + food.happinessRestore)
    const newXp = state.xp + 5
    let newLevel = state.level
    let newXpToNext = state.xpToNext
    if (newXp >= state.xpToNext) {
      newLevel = state.level + 1
      newXpToNext = XP_PER_LEVEL(newLevel)
      setTimeout(() => get().showToast(`Level Up! Now level ${newLevel}!`, '⭐'), 200)
    }
    set({
      hunger: newHunger,
      happiness: newHappiness,
      food: newFood,
      xp: newXp >= state.xpToNext ? newXp - state.xpToNext : newXp,
      level: newLevel,
      xpToNext: newXpToNext,
      currentAnimation: 'eat',
    })
    setTimeout(() => get().setAnimation('idle'), 2000)
    writeSave(get())
  },

  batheDog: () => {
    const state = get()
    const newCleanliness = Math.min(100, state.cleanliness + 40)
    const newHappiness = Math.min(100, state.happiness + 10)
    const newXp = state.xp + 8
    let newLevel = state.level
    let newXpToNext = state.xpToNext
    if (newXp >= state.xpToNext) {
      newLevel++
      newXpToNext = XP_PER_LEVEL(newLevel)
    }
    set({
      cleanliness: newCleanliness,
      happiness: newHappiness,
      xp: newXp >= state.xpToNext ? newXp - state.xpToNext : newXp,
      level: newLevel,
      xpToNext: newXpToNext,
      currentAnimation: 'happy',
    })
    get().showToast('So fresh and clean!', '🛁')
    setTimeout(() => get().setAnimation('idle'), 2500)
    writeSave(get())
  },

  petDog: (x = 200, y = 300) => {
    const state = get()
    if (state.energy < 10) {
      get().showToast('Too tired to play...', '😴')
      return
    }
    const newHappiness = Math.min(100, state.happiness + 12)
    const newEnergy = Math.max(0, state.energy - 3)
    const newXp = state.xp + 3
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        get().addParticle(x + (Math.random() - 0.5) * 60, y - Math.random() * 40, 'heart')
      }, i * 150)
    }
    set({
      happiness: newHappiness,
      energy: newEnergy,
      xp: Math.min(newXp, state.xpToNext - 1),
      currentAnimation: 'happy',
    })
    setTimeout(() => get().setAnimation('idle'), 1500)
    writeSave(get())
  },

  trainDog: (success) => {
    const state = get()
    if (state.energy < 20) {
      get().showToast('Too tired to train!', '😴')
      return
    }
    if (success) {
      const earnedXp = 20
      const earnedCoin = 10
      const newXp = state.xp + earnedXp
      const newCurrency = state.currency + earnedCoin
      let newLevel = state.level
      let newXpToNext = state.xpToNext
      let levelUp = false
      let xpCarry = newXp
      if (newXp >= state.xpToNext) {
        newLevel++
        newXpToNext = XP_PER_LEVEL(newLevel)
        xpCarry = newXp - state.xpToNext
        levelUp = true
      }
      set({
        xp: xpCarry,
        level: newLevel,
        xpToNext: newXpToNext,
        currency: newCurrency,
        energy: Math.max(0, state.energy - 15),
        happiness: Math.min(100, state.happiness + 15),
        currentAnimation: 'happy',
      })
      get().addParticle(200, 300, 'coin')
      get().addParticle(200, 300, 'star')
      if (levelUp) get().showToast(`Level Up! Now level ${newLevel}! 🎉`, '⭐')
      else get().showToast(`Great job! +${earnedXp} XP, +${earnedCoin} treats!`, '🏆')
    } else {
      set({ energy: Math.max(0, state.energy - 8) })
    }
    setTimeout(() => get().setAnimation('idle'), 2000)
    writeSave(get())
  },

  sleepDog: () => {
    const state = get()
    const restoreEnergy = Math.min(100, state.energy + 50)
    set({ energy: restoreEnergy, currentAnimation: 'sleep' })
    get().showToast('Sweet dreams, pup!', '💤')
    setTimeout(() => {
      set({ currentAnimation: 'idle' })
      get().showToast('Refreshed and ready!', '⚡')
    }, 4000)
    writeSave(get())
  },

  buyFood: (foodId) => {
    const state = get()
    const item = state.food.find(f => f.id === foodId)
    if (!item || state.currency < item.cost) {
      get().showToast('Not enough treats!', '😅')
      return
    }
    set({
      currency: state.currency - item.cost,
      food: state.food.map(f => f.id === foodId ? { ...f, owned: f.owned + 3 } : f),
    })
    get().addParticle(200, 300, 'coin')
    get().showToast(`Got 3x ${item.name}!`, item.emoji)
    writeSave(get())
  },

  learnTrick: (trickId) => {
    set(state => ({
      tricks: state.tricks.map(t => t.id === trickId ? { ...t, learned: true } : t),
    }))
    writeSave(get())
  },

  completeTutorialStep: () => {
    const { tutorialStep } = get()
    set({ tutorialStep: tutorialStep + 1 })
  },

  completeTutorial: () => {
    set({ tutorialComplete: true, screen: 'game', currency: get().currency + 20 })
    get().showToast('Tutorial complete! +20 treats!', '🎉')
    writeSave(get())
  },

  toggleMute: () => {
    const muted = !get().audioMuted
    set({ audioMuted: muted })
    writeSave(get())
  },

  tick: () => {
    const state = get()
    if (state.screen !== 'game') return
    const hunger = Math.max(0, state.hunger - 0.01)
    const cleanliness = Math.max(0, state.cleanliness - 0.005)
    const energy = Math.max(0, state.energy - 0.008)
    const avgStats = (hunger + cleanliness + energy) / 3
    const happiness = hunger < 20 || energy < 20
      ? Math.max(0, state.happiness - 0.03)
      : Math.min(100, avgStats * 0.8 + state.happiness * 0.2)
    set({ hunger, cleanliness, energy, happiness, lastSeen: Date.now() })
  },

  addParticle: (x, y, type) => {
    const id = Date.now() + Math.random()
    set(state => ({ particles: [...state.particles, { id, x, y, type }] }))
    setTimeout(() => get().removeParticle(id), 1500)
  },

  removeParticle: (id) => {
    set(state => ({ particles: state.particles.filter(p => p.id !== id) }))
  },

  showToast: (message, emoji) => {
    set({ toast: { message, emoji } })
    setTimeout(() => get().clearToast(), 3000)
  },

  clearToast: () => set({ toast: null }),
}))
