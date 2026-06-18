import { motion } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'
import { hasSave } from '../../game/systems/saveSystem'

export default function StartScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const tutorialComplete = useGameStore(s => s.tutorialComplete)
  const level = useGameStore(s => s.level)
  const username = useGameStore(s => s.username)

  const handlePlay = () => {
    if (!tutorialComplete) {
      setScreen('tutorial')
    } else {
      setScreen('game')
    }
  }

  const savedGame = hasSave()

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-coral opacity-10 select-none pointer-events-none"
          style={{
            fontSize: `${Math.random() * 24 + 20}px`,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        >
          🐾
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-2"
      >
        <img
          src="/nintendogs-logo.png"
          alt="Nintendogs"
          className="w-32 h-32 object-contain"
          draggable={false}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-1"
      >
        <h1 className="font-display text-6xl text-coral drop-shadow-sm">Nintendogs</h1>
        {username && (
          <p className="font-body text-bark-light text-sm mt-1">
            Welcome back, <span className="font-bold text-bark">{username}</span>!
          </p>
        )}
      </motion.div>

      <motion.div
        className="text-7xl my-4 select-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        🐶
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3 w-full px-8 max-w-xs"
      >
        {savedGame && tutorialComplete && (
          <div className="text-center mb-1">
            <span className="font-body text-xs text-bark-light bg-blush px-3 py-1 rounded-full">
              Level {level} dog waiting for you! 🐾
            </span>
          </div>
        )}

        <motion.button
          className="btn-primary w-full text-center"
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
        >
          {savedGame ? 'Continue' : 'New Game'}
        </motion.button>

        {savedGame && !tutorialComplete && (
          <motion.button
            className="btn-secondary w-full text-center text-base"
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('tutorial')}
          >
            Tutorial
          </motion.button>
        )}

        <motion.button
          className="font-body text-xs text-bark-light underline mt-1"
          onClick={() => setScreen('login')}
        >
          Sign out
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 font-body text-xs text-bark-light opacity-50"
      >
        Tap your dog to play!
      </motion.p>
    </div>
  )
}
