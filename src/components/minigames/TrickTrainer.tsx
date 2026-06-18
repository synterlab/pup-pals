import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'

const TRICKS = [
  { id: 'sit', name: 'Sit', emoji: '🪑', command: 'Sit!' },
  { id: 'spin', name: 'Spin', emoji: '🌀', command: 'Spin!' },
  { id: 'shake', name: 'Shake', emoji: '🤝', command: 'Shake!' },
  { id: 'fetch', name: 'Fetch', emoji: '🎾', command: 'Fetch!' },
]

export default function TrickTrainer() {
  const setScreen = useGameStore(s => s.setScreen)
  const trainDog = useGameStore(s => s.trainDog)
  const level = useGameStore(s => s.level)
  const learnTrick = useGameStore(s => s.learnTrick)
  const tricks = useGameStore(s => s.tricks)

  const trick = TRICKS[Math.min(Math.floor((level - 1) / 3), TRICKS.length - 1)]
  const speed = Math.min(0.8, 0.3 + level * 0.05)
  const sweetSpotSize = Math.max(20, 40 - level * 2)

  const [ringPos, setRingPos] = useState(0)
  const [direction, setDirection] = useState(1)
  const [taps, setTaps] = useState(0)
  const [misses, setMisses] = useState(0)
  const [phase, setPhase] = useState<'playing' | 'success' | 'fail'>('playing')
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const animRef = useRef<number>()
  const posRef = useRef(0)
  const dirRef = useRef(1)
  const lastTime = useRef<number>()

  const TARGET_TAPS = 4
  const MAX_MISSES = 3

  const animate = useCallback((ts: number) => {
    if (!lastTime.current) lastTime.current = ts
    const dt = (ts - lastTime.current) / 16
    lastTime.current = ts

    posRef.current += dirRef.current * speed * dt
    if (posRef.current >= 100) { posRef.current = 100; dirRef.current = -1 }
    if (posRef.current <= 0) { posRef.current = 0; dirRef.current = 1 }

    setRingPos(posRef.current)
    setDirection(dirRef.current)

    animRef.current = requestAnimationFrame(animate)
  }, [speed])

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [animate])

  const sweetSpotStart = 40
  const sweetSpotEnd = sweetSpotStart + sweetSpotSize

  const handleTap = () => {
    if (phase !== 'playing') return
    const inZone = posRef.current >= sweetSpotStart && posRef.current <= sweetSpotEnd
    if (inZone) {
      const newTaps = taps + 1
      setTaps(newTaps)
      setFeedbackMsg(['Perfect!', 'Nice!', 'Great!', 'Wow!'][Math.floor(Math.random() * 4)])
      if (newTaps >= TARGET_TAPS) {
        setPhase('success')
        trainDog(true)
        const trickData = tricks.find(t => t.id === trick.id)
        if (trickData && !trickData.learned) learnTrick(trick.id)
        if (animRef.current) cancelAnimationFrame(animRef.current)
      }
    } else {
      const newMisses = misses + 1
      setMisses(newMisses)
      setFeedbackMsg(['Almost!', 'Try again!', 'Close!'][Math.floor(Math.random() * 3)])
      if (newMisses >= MAX_MISSES) {
        setPhase('fail')
        trainDog(false)
        if (animRef.current) cancelAnimationFrame(animRef.current)
      }
    }
    setTimeout(() => setFeedbackMsg(''), 600)
  }

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-between p-4 pt-safe">
      {/* Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={() => { setScreen('game'); if (animRef.current) cancelAnimationFrame(animRef.current) }}
          className="font-body text-bark-light text-sm bg-blush px-3 py-1 rounded-full"
        >
          ← Back
        </button>
        <h2 className="font-display text-bark text-xl">Trick Training</h2>
        <div className="font-body text-xs text-bark-light bg-honey/30 px-3 py-1 rounded-full">
          Lv.{level}
        </div>
      </div>

      {/* Trick to learn */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-2"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {trick.emoji}
        </motion.div>
        <p className="font-display text-bark text-2xl">{trick.command}</p>
        <p className="font-body text-bark-light text-sm mt-1">Tap when the ring hits the zone!</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-3">
        {[...Array(TARGET_TAPS)].map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
              i < taps ? 'bg-sage border-sage' : 'bg-transparent border-sage/40'
            }`}
          />
        ))}
      </div>

      {/* Feedback message */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute top-1/3 font-display text-2xl text-coral"
          >
            {feedbackMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timing bar */}
      <div className="w-full max-w-xs">
        <div className="relative w-full h-12 bg-blush rounded-full overflow-hidden border-2 border-coral/30">
          {/* Sweet spot zone */}
          <div
            className="absolute top-0 bottom-0 bg-sage/50 border-l-2 border-r-2 border-sage"
            style={{ left: `${sweetSpotStart}%`, width: `${sweetSpotSize}%` }}
          />
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center text-white text-xs font-display"
            style={{ left: `${sweetSpotStart}%`, width: `${sweetSpotSize}%` }}
          >
            TAP!
          </div>

          {/* Moving ring */}
          <motion.div
            className="absolute top-1 bottom-1 w-10 rounded-full bg-coral shadow-lg flex items-center justify-center"
            style={{ left: `calc(${ringPos}% - 20px)` }}
          >
            <span className="text-white text-xs font-display">●</span>
          </motion.div>
        </div>

        {/* Miss indicator */}
        <div className="flex justify-center gap-2 mt-2">
          {[...Array(MAX_MISSES)].map((_, i) => (
            <span key={i} className={`text-base ${i < misses ? '🔴' : '⚪'}`}>
              {i < misses ? '🔴' : '⚪'}
            </span>
          ))}
        </div>

        {/* Tap button */}
        <motion.button
          className="mt-4 w-full btn-primary text-center py-5 text-2xl font-display"
          whileTap={{ scale: 0.9 }}
          onPointerDown={handleTap}
        >
          🐾 TAP!
        </motion.button>
      </div>

      {/* Result overlays */}
      <AnimatePresence>
        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="panel p-8 mx-6 text-center"
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="font-display text-coral text-3xl mb-1">Amazing!</h2>
              <p className="font-body text-bark-light mb-2">Buddy learned {trick.name}!</p>
              <p className="font-body text-bark text-sm mb-4">+20 XP, +10 🍪</p>
              <motion.button
                className="btn-primary"
                whileTap={{ scale: 0.95 }}
                onClick={() => setScreen('game')}
              >
                Keep Playing!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        {phase === 'fail' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="panel p-8 mx-6 text-center"
            >
              <div className="text-5xl mb-3">🐶</div>
              <h2 className="font-display text-bark text-2xl mb-1">Almost there!</h2>
              <p className="font-body text-bark-light mb-4">Buddy's still learning — try again!</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  className="btn-secondary"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setTaps(0); setMisses(0); setPhase('playing')
                    animRef.current = requestAnimationFrame(animate)
                  }}
                >
                  Try Again
                </motion.button>
                <motion.button
                  className="btn-primary"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScreen('game')}
                >
                  Back
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
