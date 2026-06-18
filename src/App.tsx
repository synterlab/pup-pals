import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './game/store/useGameStore'
import { useStatDecay } from './game/systems/statDecay'
import LoginScreen from './components/ui/LoginScreen'
import StartScreen from './components/ui/StartScreen'
import HUD from './components/ui/HUD'
import Shop from './components/ui/Shop'
import Tutorial from './components/ui/Tutorial'
import TrickTrainer from './components/minigames/TrickTrainer'
import Dog3D from './components/scene/Dog3D'
import Environment from './components/scene/Environment'
import Lighting from './components/scene/Lighting'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center gap-4">
      <div className="text-5xl paw-loader">🐾</div>
      <div className="font-display text-coral text-2xl">Loading...</div>
      <div className="w-32 h-2 bg-blush rounded-full overflow-hidden">
        <div className="h-full bg-coral rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  )
}

function GameScene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(180deg, #FFE8D4 0%, #FFF8F0 100%)' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Environment />
          <Dog3D />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0, 0]}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function TimeOfDayBadge() {
  const hour = new Date().getHours()
  const emoji = hour >= 6 && hour < 9 ? '🌅' : hour >= 9 && hour < 17 ? '☀️' : hour >= 17 && hour < 20 ? '🌇' : '🌙'
  const label = hour >= 6 && hour < 9 ? 'Morning' : hour >= 9 && hour < 17 ? 'Daytime' : hour >= 17 && hour < 20 ? 'Evening' : 'Night'
  return (
    <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
      <span className="text-xs">{emoji}</span>
      <span className="font-body text-bark-light text-xs">{label}</span>
    </div>
  )
}

export default function App() {
  const screen = useGameStore(s => s.screen)
  const initGame = useGameStore(s => s.initGame)
  const initialized = useGameStore(s => s.initialized)

  useEffect(() => {
    initGame()
  }, [initGame])

  useStatDecay()

  if (!initialized) return <LoadingScreen />

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginScreen />
          </motion.div>
        )}

        {screen === 'start' && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StartScreen />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0">
            <GameScene />
            <TimeOfDayBadge />
            <HUD />
          </motion.div>
        )}

        {screen === 'shop' && (
          <motion.div key="shop" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <Shop />
          </motion.div>
        )}

        {screen === 'tutorial' && (
          <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Tutorial />
          </motion.div>
        )}

        {screen === 'minigame' && (
          <motion.div key="minigame" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <TrickTrainer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
