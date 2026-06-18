import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'
import { clearStoredUser } from './LoginScreen'

function StatBar({ value, color, icon }: { value: number; color: string; icon: string }) {
  const pct = Math.max(0, Math.min(100, value))
  const isLow = pct < 25
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg leading-none">{icon}</span>
      <div className="flex-1">
        <div className="stat-bar">
          <motion.div
            className="stat-bar-fill"
            style={{ background: isLow ? '#FF4444' : color, width: `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <span className="font-body font-bold text-xs text-bark w-6 text-right">{Math.round(pct)}</span>
    </div>
  )
}

function FeedPanel({ onClose }: { onClose: () => void }) {
  const food = useGameStore(s => s.food)
  const feedDog = useGameStore(s => s.feedDog)
  const hunger = useGameStore(s => s.hunger)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="absolute bottom-full mb-3 left-0 right-0 panel p-4"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display text-bark text-lg">Feed Buddy</h3>
        <button onClick={onClose} className="text-bark-light text-xl leading-none">x</button>
      </div>
      {hunger >= 95 && (
        <p className="font-body text-xs text-sage text-center mb-2">Buddy is full! 😊</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {food.map(item => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => { feedDog(item.id); onClose() }}
            disabled={item.owned < 1 || hunger >= 95}
            className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
              item.owned < 1 || hunger >= 95
                ? 'border-gray-200 opacity-50 bg-gray-50'
                : 'border-blush bg-blush/40 active:bg-blush'
            }`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <div className="text-left">
              <div className="font-body font-bold text-xs text-bark">{item.name}</div>
              <div className="font-body text-xs text-bark-light">x{item.owned}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default function HUD() {
  const hunger = useGameStore(s => s.hunger)
  const cleanliness = useGameStore(s => s.cleanliness)
  const energy = useGameStore(s => s.energy)
  const happiness = useGameStore(s => s.happiness)
  const level = useGameStore(s => s.level)
  const xp = useGameStore(s => s.xp)
  const xpToNext = useGameStore(s => s.xpToNext)
  const currency = useGameStore(s => s.currency)
  const setScreen = useGameStore(s => s.setScreen)
  const batheDog = useGameStore(s => s.batheDog)
  const petDog = useGameStore(s => s.petDog)
  const sleepDog = useGameStore(s => s.sleepDog)
  const audioMuted = useGameStore(s => s.audioMuted)
  const toggleMute = useGameStore(s => s.toggleMute)
  const particles = useGameStore(s => s.particles)
  const toast = useGameStore(s => s.toast)
  const username = useGameStore(s => s.username)

  const [showFeed, setShowFeed] = useState(false)

  const canTrain = energy >= 20
  const canPlay = energy >= 10

  const handleLogout = () => {
    clearStoredUser()
    setScreen('login')
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col">
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="heart-particle"
          style={{ left: p.x, top: p.y }}
        >
          {p.type === 'heart' ? '❤️' : p.type === 'coin' ? '🍪' : '⭐'}
        </div>
      ))}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-bark text-white px-4 py-2 rounded-2xl font-body font-bold text-sm flex items-center gap-2 shadow-lg z-50"
          >
            <span>{toast.emoji}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD */}
      <div className="pointer-events-auto px-3 pt-3">
        <div className="panel p-3">
          {/* Username + logout row */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👤</span>
              <span className="font-body font-bold text-xs text-bark">{username || 'Guest'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-bark-light">Lv.{level}</span>
              <div className="w-16 h-2 bg-blush rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-honey transition-all duration-500"
                  style={{ width: `${(xp / xpToNext) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm">🍪</span>
                <span className="font-display text-bark text-sm">{currency}</span>
              </div>
              <button onClick={toggleMute} className="text-base">
                {audioMuted ? '🔇' : '🔊'}
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-body text-bark-light bg-blush px-2 py-0.5 rounded-full"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Stat bars */}
          <div className="space-y-1.5">
            <StatBar value={hunger} color="#FF8B6A" icon="🦴" />
            <StatBar value={cleanliness} color="#87CEEB" icon="💧" />
            <StatBar value={energy} color="#FFD166" icon="⚡" />
            <StatBar value={happiness} color="#FF9FBF" icon="❤️" />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom action bar */}
      <div className="pointer-events-auto px-3 pb-4">
        <div className="relative">
          <AnimatePresence>
            {showFeed && <FeedPanel onClose={() => setShowFeed(false)} />}
          </AnimatePresence>

          <div className="panel p-3">
            <div className="grid grid-cols-5 gap-2">
              <motion.button
                className="action-btn bg-coral/15 text-coral"
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowFeed(!showFeed)}
              >
                <span className="text-2xl">🦴</span>
                <span className="font-body font-bold text-bark-light text-xs">Feed</span>
              </motion.button>

              <motion.button
                className="action-btn bg-sky-100 text-sky-500"
                whileTap={{ scale: 0.88 }}
                onClick={() => { batheDog(); setShowFeed(false) }}
              >
                <span className="text-2xl">🛁</span>
                <span className="font-body font-bold text-bark-light text-xs">Bath</span>
              </motion.button>

              <motion.button
                className={`action-btn ${canPlay ? 'bg-pink-100 text-pink-500' : 'bg-gray-100 text-gray-400'}`}
                whileTap={canPlay ? { scale: 0.88 } : {}}
                onClick={() => { if (canPlay) { petDog(200, 300); setShowFeed(false) } }}
              >
                <span className="text-2xl">{canPlay ? '🤗' : '😴'}</span>
                <span className="font-body font-bold text-bark-light text-xs">Pet</span>
              </motion.button>

              <motion.button
                className={`action-btn ${canTrain ? 'bg-honey/25 text-amber-600' : 'bg-gray-100 text-gray-400'}`}
                whileTap={canTrain ? { scale: 0.88 } : {}}
                onClick={() => { if (canTrain) { setScreen('minigame'); setShowFeed(false) } }}
              >
                <span className="text-2xl">{canTrain ? '🎯' : '⚡'}</span>
                <span className="font-body font-bold text-bark-light text-xs">Train</span>
              </motion.button>

              <motion.button
                className="action-btn bg-sage/20 text-sage-dark"
                whileTap={{ scale: 0.88 }}
                onClick={() => { sleepDog(); setShowFeed(false) }}
              >
                <span className="text-2xl">💤</span>
                <span className="font-body font-bold text-bark-light text-xs">Sleep</span>
              </motion.button>
            </div>

            <motion.button
              className="mt-2 w-full bg-honey/30 text-amber-700 rounded-2xl py-2 font-display text-base flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
              onClick={() => { setScreen('shop'); setShowFeed(false) }}
            >
              <span>🏪</span> Shop
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
