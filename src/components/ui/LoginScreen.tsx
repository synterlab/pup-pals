import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'

const USER_KEY = 'nintendogs_user'

export function getStoredUser(): { username: string; password: string } | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeUser(username: string, password: string) {
  localStorage.setItem(USER_KEY, JSON.stringify({ username, password }))
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY)
}

export default function LoginScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const setUsername = useGameStore(s => s.setUsername)

  const existingUser = getStoredUser()
  const [mode, setMode] = useState<'login' | 'register'>(existingUser ? 'login' : 'register')

  const [username, setUsernameInput] = useState(existingUser?.username ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    const trimmed = username.trim()
    if (!trimmed) { setError('Enter your name'); return }
    if (!password) { setError('Enter a password'); return }

    if (mode === 'register') {
      storeUser(trimmed, password)
      setUsername(trimmed)
      setScreen('start')
    } else {
      const stored = getStoredUser()
      if (!stored) { setError('No account found. Register first.'); return }
      if (stored.username !== trimmed || stored.password !== password) {
        setError('Wrong username or password')
        return
      }
      setUsername(stored.username)
      setScreen('start')
    }
  }

  const handleGuestLogin = () => {
    setUsername('Guest')
    setScreen('start')
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream overflow-hidden px-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-coral opacity-10 select-none pointer-events-none text-3xl"
          style={{ left: `${10 + i * 15}%`, top: `${10 + (i % 3) * 28}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
        >
          🐾
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="w-full max-w-xs"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/nintendogs-logo.png"
            alt="Nintendogs"
            className="w-28 h-28 object-contain mb-1"
            draggable={false}
          />
          <h1 className="font-display text-4xl text-coral">Nintendogs</h1>
          <p className="font-body text-bark-light text-sm mt-1">Your Virtual Dog Companion</p>
        </div>

        <div className="panel p-5 w-full">
          <div className="flex rounded-2xl overflow-hidden mb-4 bg-blush">
            {(['register', 'login'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 font-display text-sm transition-all ${
                  mode === m ? 'bg-coral text-white' : 'text-bark-light'
                }`}
              >
                {m === 'register' ? 'New Player' : 'Sign In'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-body text-xs text-bark-light block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsernameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Your name..."
                maxLength={20}
                className="w-full bg-cream border border-blush rounded-xl px-3 py-2 font-body text-bark text-sm outline-none focus:border-coral transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-xs text-bark-light block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Password..."
                maxLength={32}
                className="w-full bg-cream border border-blush rounded-xl px-3 py-2 font-body text-bark text-sm outline-none focus:border-coral transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-xs text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              className="btn-primary w-full text-center mt-1"
              whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
            >
              {mode === 'register' ? 'Create Account' : 'Sign In'}
            </motion.button>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-blush" />
              <span className="font-body text-xs text-bark-light">or</span>
              <div className="flex-1 h-px bg-blush" />
            </div>

            <motion.button
              className="w-full py-2 rounded-2xl border-2 border-blush bg-white/60 font-display text-sm text-bark-light hover:border-coral hover:text-coral transition-all"
              whileTap={{ scale: 0.96 }}
              onClick={handleGuestLogin}
            >
              🐾 Continue as Guest
            </motion.button>
          </div>
        </div>

        <p className="font-body text-xs text-bark-light text-center mt-4 opacity-60">
          {mode === 'register'
            ? 'Already have an account?'
            : 'No account yet?'}{' '}
          <button
            className="underline"
            onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }}
          >
            {mode === 'register' ? 'Sign in' : 'Register'}
          </button>
        </p>

        <p className="font-body text-xs text-bark-light text-center mt-2 opacity-40">
          Guest progress won't be saved between sessions.
        </p>
      </motion.div>
    </div>
  )
}
