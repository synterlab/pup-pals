import { useMemo } from 'react'

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

export default function Lighting() {
  const timeOfDay = useMemo(() => getTimeOfDay(), [])

  const config = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return { ambient: '#FFD4A8', ambientIntensity: 0.6, dir: '#FFA07A', dirIntensity: 1.0, dirPos: [-5, 3, 0] as [number, number, number] }
      case 'day':
        return { ambient: '#FFF8F0', ambientIntensity: 0.8, dir: '#FFFFFF', dirIntensity: 1.2, dirPos: [3, 6, 4] as [number, number, number] }
      case 'dusk':
        return { ambient: '#FFB347', ambientIntensity: 0.7, dir: '#FF7F50', dirIntensity: 0.9, dirPos: [5, 2, -1] as [number, number, number] }
      case 'night':
        return { ambient: '#8CB4FF', ambientIntensity: 0.3, dir: '#B8D0FF', dirIntensity: 0.4, dirPos: [-2, 5, 3] as [number, number, number] }
    }
  }, [timeOfDay])

  return (
    <>
      <ambientLight color={config.ambient} intensity={config.ambientIntensity} />
      <directionalLight
        color={config.dir}
        intensity={config.dirIntensity}
        position={config.dirPos}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      {/* Warm fill from below */}
      <pointLight position={[0, -0.5, 1]} color="#FFD180" intensity={0.3} />
      {/* Window light */}
      <pointLight position={[0, 2.5, -3]} color="#87CEEB" intensity={timeOfDay === 'night' ? 0.1 : 0.5} />
    </>
  )
}
