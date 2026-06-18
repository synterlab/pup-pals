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
          className="font-body text-xs text-bark-light opacity-50 mt-4"
        >
          Tap your dog to play!
        </motion.p>

        {/* Footer: EasyA Kickstart + X Account */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-5 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-3">
            <a
              href="https://easya.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
              title="EasyA Kickstart"
            >
              <img
                src="/easya-logo.png"
                alt="EasyA Kickstart"
                className="h-5 w-auto object-contain"
                draggable={false}
              />
              <span className="font-body text-xs text-bark-light">EasyA Kickstart</span>
            </a>
            <div className="w-px h-3.5 bg-blush opacity-60" />
            <a
              href="https://x.com/Greeky22"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
              title="@Greeky22 on X"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-bark-light" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-body text-xs text-bark-light">@Greeky22</span>
            </a>
          </div>
        </motion.div>
      </div>
    )
  }
  