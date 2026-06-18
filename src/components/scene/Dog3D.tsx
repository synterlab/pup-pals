import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, DogAnimation } from '../../game/store/useGameStore'

const DOG_COLOR = '#D4A055'
const DARK_BROWN = '#6B4226'
const NOSE_COLOR = '#1a0a00'
const EYE_COLOR = '#1a0a00'

function DogMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const currentAnimation = useGameStore(s => s.currentAnimation)
  const animRef = useRef<DogAnimation>('idle')
  const timeRef = useRef(0)
  const petDog = useGameStore(s => s.petDog)

  useEffect(() => {
    animRef.current = currentAnimation
    timeRef.current = 0
  }, [currentAnimation])

  useFrame((_, delta) => {
    if (!groupRef.current || !tailRef.current || !headRef.current || !bodyRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    const anim = animRef.current

    // Tail wag always
    const tailWagSpeed = anim === 'happy' ? 12 : anim === 'eat' ? 8 : 4
    const tailWagAmt = anim === 'happy' ? 0.6 : 0.3
    tailRef.current.rotation.z = Math.sin(t * tailWagSpeed) * tailWagAmt

    if (anim === 'idle') {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.06
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.08
      bodyRef.current.rotation.z = Math.sin(t * 1.2) * 0.02
    } else if (anim === 'happy') {
      const bounce = Math.abs(Math.sin(t * 5))
      groupRef.current.position.y = bounce * 0.3
      groupRef.current.rotation.y = Math.sin(t * 4) * 0.2
      headRef.current.rotation.z = Math.sin(t * 6) * 0.15
    } else if (anim === 'eat') {
      headRef.current.rotation.x = Math.sin(t * 4) * 0.2 - 0.3
      groupRef.current.position.y = 0
    } else if (anim === 'sleep') {
      groupRef.current.position.y = -0.15
      groupRef.current.rotation.z = 0.3
      bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.03
      headRef.current.rotation.x = 0.4
    } else if (anim === 'sit') {
      groupRef.current.position.y = -0.15
    } else if (anim === 'sad') {
      headRef.current.rotation.x = 0.3
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.02 - 0.05
    }
  })

  const mat = (color: string) => (
    <meshLambertMaterial color={color} />
  )

  const handlePointerDown = () => {
    petDog()
  }

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} onClick={handlePointerDown}>
      {/* Body */}
      <group ref={bodyRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.65, 1.5]} />
          {mat(DOG_COLOR)}
        </mesh>
        {/* Belly lighter patch */}
        <mesh position={[0, -0.28, 0.1]}>
          <boxGeometry args={[0.6, 0.08, 0.9]} />
          <meshLambertMaterial color="#E8C070" />
        </mesh>
      </group>

      {/* Head group */}
      <group ref={headRef} position={[0, 0.55, 0.65]}>
        {/* Head */}
        <mesh>
          <boxGeometry args={[0.75, 0.7, 0.75]} />
          {mat(DOG_COLOR)}
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.1, 0.38]}>
          <boxGeometry args={[0.4, 0.28, 0.32]} />
          <meshLambertMaterial color="#C8903A" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.03, 0.55]}>
          <boxGeometry args={[0.18, 0.12, 0.06]} />
          {mat(NOSE_COLOR)}
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.38]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          {mat(EYE_COLOR)}
        </mesh>
        <mesh position={[0.2, 0.1, 0.38]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          {mat(EYE_COLOR)}
        </mesh>
        {/* Eye shine */}
        <mesh position={[-0.18, 0.13, 0.45]}>
          <sphereGeometry args={[0.025, 4, 4]} />
          <meshLambertMaterial color="white" />
        </mesh>
        <mesh position={[0.22, 0.13, 0.45]}>
          <sphereGeometry args={[0.025, 4, 4]} />
          <meshLambertMaterial color="white" />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.32, 0.35, 0.0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.22, 0.38, 0.15]} />
          {mat(DARK_BROWN)}
        </mesh>
        <mesh position={[0.32, 0.35, 0.0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.22, 0.38, 0.15]} />
          {mat(DARK_BROWN)}
        </mesh>
      </group>

      {/* Legs */}
      {[[-0.3, -0.45, 0.45], [0.3, -0.45, 0.45], [-0.3, -0.45, -0.45], [0.3, -0.45, -0.45]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.22, 0.55, 0.22]} />
          {mat(i < 2 ? '#C8903A' : DOG_COLOR)}
        </mesh>
      ))}

      {/* Paws */}
      {[[-0.3, -0.76, 0.48], [0.3, -0.76, 0.48], [-0.3, -0.76, -0.42], [0.3, -0.76, -0.42]].map(([x, y, z], i) => (
        <mesh key={`paw-${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.24, 0.1, 0.26]} />
          {mat(DARK_BROWN)}
        </mesh>
      ))}

      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.15, -0.8]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.04, 0.7, 5]} />
        {mat(DARK_BROWN)}
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.25, 0.58]}>
        <torusGeometry args={[0.27, 0.045, 5, 12]} />
        <meshLambertMaterial color="#FF6B6B" />
      </mesh>
      {/* Collar tag */}
      <mesh position={[0, 0.12, 0.82]}>
        <cylinderGeometry args={[0.06, 0.06, 0.025, 6]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

export default function Dog3D() {
  return <DogMesh />
}
