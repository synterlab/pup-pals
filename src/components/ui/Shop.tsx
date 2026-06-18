import { motion } from 'framer-motion'
import { useGameStore } from '../../game/store/useGameStore'

export default function Shop() {
  const setScreen = useGameStore(s => s.setScreen)
  const currency = useGameStore(s => s.currency)
  const food = useGameStore(s => s.food)
  const buyFood = useGameStore(s => s.buyFood)
  const level = useGameStore(s => s.level)
  const tricks = useGameStore(s => s.tricks)

  return (
    <div className="fixed inset-0 bg-cream flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('game')}
            className="font-body text-bark-light text-sm bg-blush px-3 py-1.5 rounded-full"
          >
            ← Back
          </button>
          <h1 className="font-display text-bark text-2xl">🏪 Shop</h1>
          <div className="flex items-center gap-1 bg-honey/30 px-3 py-1.5 rounded-full">
            <span className="text-sm">🍪</span>
            <span className="font-display text-bark-light">{currency}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Food section */}
        <div className="panel p-4">
          <h2 className="font-display text-bark text-xl mb-3">🍖 Food</h2>
          <div className="space-y-2">
            {food.map(item => {
              const canAfford = currency >= item.cost
              const isFree = item.cost === 0
              return (
                <motion.div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    canAfford ? 'border-blush bg-blush/30' : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="font-body font-700 text-bark text-sm">{item.name}</div>
                    <div className="flex gap-3 text-xs text-bark-light font-body">
                      <span>🦴 +{item.hungerRestore}</span>
                      <span>❤️ +{item.happinessRestore}</span>
                      <span>In stock: {item.owned}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isFree ? (
                      <span className="font-body text-xs text-sage font-700">Free</span>
                    ) : (
                      <span className="font-body text-xs text-bark-light">🍪 {item.cost}/pack</span>
                    )}
                    {!isFree && (
                      <motion.button
                        whileTap={canAfford ? { scale: 0.9 } : {}}
                        onClick={() => canAfford && buyFood(item.id)}
                        className={`px-3 py-1 rounded-xl font-display text-sm ${
                          canAfford
                            ? 'bg-coral text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Buy ×3
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Tricks section */}
        <div className="panel p-4">
          <h2 className="font-display text-bark text-xl mb-3">🎓 Tricks</h2>
          <p className="font-body text-bark-light text-xs mb-3">Train your pup to learn new tricks!</p>
          <div className="grid grid-cols-2 gap-2">
            {tricks.map(trick => {
              const unlocked = level >= trick.unlockLevel
              return (
                <div
                  key={trick.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    trick.learned
                      ? 'border-sage bg-sage/15'
                      : unlocked
                      ? 'border-honey bg-honey/15'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{trick.emoji}</span>
                  <div className="font-body font-700 text-xs text-bark">{trick.name}</div>
                  <div className="font-body text-xs mt-1">
                    {trick.learned ? (
                      <span className="text-sage">✓ Learned!</span>
                    ) : unlocked ? (
                      <span className="text-amber-600">Train to learn</span>
                    ) : (
                      <span className="text-bark-light">Lv.{trick.unlockLevel}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily bonus */}
        <div className="panel p-4 bg-honey/10 border-honey/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <h3 className="font-display text-bark text-base">Daily Bonus</h3>
              <p className="font-body text-bark-light text-xs">Come back every day for treats!</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="ml-auto bg-honey text-bark px-3 py-1.5 rounded-xl font-display text-sm"
              onClick={() => {}}
            >
              Claim
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
