import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'

const STEPS = [
  {
    emoji: '🐶',
    title: 'Meet Buddy!',
    body: 'Your new virtual pup is here! Buddy needs your care, love, and attention.',
    cta: 'Say hi!',
    action: 'pet',
  },
  {
    emoji: '🦴',
    title: "Buddy's hungry!",
    body: 'Tap the bone icon to open the food menu and feed your pup.',
    cta: 'Feed Buddy',
    action: 'feed',
  },
  {
    emoji: '🎯',
    title: "Let's train!",
    body: 'Use the Train button to play a timing mini-game and teach Buddy new tricks!',
    cta: 'Got it!',
    action: 'train',
  },
  {
    emoji: '🏪',
    title: 'Visit the Shop!',
    body: 'Earn treats by training, then spend them on better food and toys in the shop.',
    cta: "Let's go!",
    action: 'shop',
  },
]

export default function Tutorial() {
  const tutorialStep = useGameStore(s => s.tutorialStep)
  const completeTutorialStep = useGameStore(s => s.completeTutorialStep)
  const completeTutorial = useGameStore(s => s.completeTutorial)
  const petDog = useGameStore(s => s.petDog)
  const feedDog = useGameStore(s => s.feedDog)

  const step = STEPS[tutorialStep]
  const isLastStep = tutorialStep >= STEPS.length - 1

  const handleCta = () => {
    if (step.action === 'pet') petDog()
    if (step.action === 'feed') feedDog('kibble')

    if (isLastStep) {
      completeTutorial()
    } else {
      completeTutorialStep()
    }
  }

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center p-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === tutorialStep ? 'w-6 bg-coral' : i < tutorialStep ? 'w-2 bg-coral/50' : 'w-2 bg-blush'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tutorialStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="flex flex-col items-center text-center max-w-xs w-full"
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {step.emoji}
          </motion.div>

          <h2 className="font-display text-bark text-3xl mb-3">{step.title}</h2>
          <p className="font-body text-bark-light text-base leading-relaxed mb-8">{step.body}</p>

          <motion.button
            className="btn-primary w-full text-center"
            whileTap={{ scale: 0.95 }}
            onClick={handleCta}
          >
            {isLastStep ? '🎉 Start Playing!' : `${step.cta} →`}
          </motion.button>

          {tutorialStep === 0 && (
            <button
              className="mt-4 font-body text-bark-light text-sm underline"
              onClick={completeTutorial}
            >
              Skip tutorial
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating paws */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-coral/10 pointer-events-none text-4xl select-none"
          style={{ left: `${15 + i * 22}%`, top: `${60 + (i % 2) * 20}%` }}
          animate={{ rotate: [0, 15, 0], y: [0, -8, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          🐾
        </motion.div>
      ))}
    </div>
  )
}
