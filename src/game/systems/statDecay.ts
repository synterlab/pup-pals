import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'

export function useStatDecay() {
  const tick = useGameStore(s => s.tick)
  const screen = useGameStore(s => s.screen)

  useEffect(() => {
    const interval = setInterval(() => {
      if (screen === 'game') tick()
    }, 5000)
    return () => clearInterval(interval)
  }, [tick, screen])
}
