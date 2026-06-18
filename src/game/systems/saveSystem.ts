const SAVE_KEY = 'puppals_save_v1'

export interface SaveData {
  dogName: string
  hunger: number
  cleanliness: number
  energy: number
  happiness: number
  level: number
  xp: number
  xpToNext: number
  currency: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  food: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tricks: any[]
  tutorialComplete: boolean
  tutorialStep: number
  lastSeen: number
  streak: number
  lastStreakDate: string
  audioMuted: boolean
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

export function writeSave(state: Partial<SaveData>): void {
  try {
    const data: SaveData = {
      dogName: (state as SaveData).dogName,
      hunger: (state as SaveData).hunger,
      cleanliness: (state as SaveData).cleanliness,
      energy: (state as SaveData).energy,
      happiness: (state as SaveData).happiness,
      level: (state as SaveData).level,
      xp: (state as SaveData).xp,
      xpToNext: (state as SaveData).xpToNext,
      currency: (state as SaveData).currency,
      food: (state as SaveData).food as unknown[],
      tricks: (state as SaveData).tricks as unknown[],
      tutorialComplete: (state as SaveData).tutorialComplete,
      tutorialStep: (state as SaveData).tutorialStep,
      lastSeen: Date.now(),
      streak: (state as SaveData).streak,
      lastStreakDate: (state as SaveData).lastStreakDate,
      audioMuted: (state as SaveData).audioMuted,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch {
    // Storage might be full or disabled
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null
  } catch {
    return false
  }
}
