import * as THREE from 'three'

export default function Environment() {
  return (
    <group>
      {/* Floor - warm wood planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshLambertMaterial color="#C4956A" />
      </mesh>

      {/* Floor boards effect */}
      {[-1.5, -0.5, 0.5, 1.5, 2.5].map((z, i) => (
        <mesh key={`board-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.849, z]}>
          <planeGeometry args={[12, 0.02]} />
          <meshLambertMaterial color="#A07050" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 1.5, -4]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshLambertMaterial color="#FFF0E0" />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4, 1.5, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshLambertMaterial color="#FFE8D4" />
      </mesh>

      {/* Dog bed */}
      <group position={[-1.8, -0.85, -1.5]}>
        {/* Bed base */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.12, 16]} />
          <meshLambertMaterial color="#8B5E3C" />
        </mesh>
        {/* Cushion */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.15, 16]} />
          <meshLambertMaterial color="#D4956A" />
        </mesh>
        {/* Rim */}
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.6, 0.12, 6, 16]} />
          <meshLambertMaterial color="#8B5E3C" />
        </mesh>
      </group>

      {/* Food bowl */}
      <group position={[1.8, -0.85, -1.2]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.22, 0.18, 12]} />
          <meshLambertMaterial color="#C0392B" />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
          <meshLambertMaterial color="#E8C87A" />
        </mesh>
      </group>

      {/* Water bowl */}
      <group position={[2.2, -0.85, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.17, 0.15, 12]} />
          <meshLambertMaterial color="#2980B9" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshLambertMaterial color="#5DADE2" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Ball toy */}
      <mesh position={[1.2, -0.76, 1.0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      <mesh position={[1.2, -0.76, 1.0]}>
        <sphereGeometry args={[0.145, 8, 8]} />
        <meshLambertMaterial color="#E74C3C" wireframe />
      </mesh>

      {/* Window on back wall */}
      <group position={[0, 2.2, -3.95]}>
        <mesh>
          <boxGeometry args={[1.6, 1.4, 0.08]} />
          <meshLambertMaterial color="#8B6914" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.3, 1.1, 0.04]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        {/* Window cross */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[1.3, 0.05, 0.02]} />
          <meshLambertMaterial color="#8B6914" />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.05, 1.1, 0.02]} />
          <meshLambertMaterial color="#8B6914" />
        </mesh>
      </group>

      {/* Bone on floor */}
      <group position={[-0.8, -0.82, 1.2]} rotation={[0, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshLambertMaterial color="#F0E0C0" />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshLambertMaterial color="#F0E0C0" />
        </mesh>
        <mesh position={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshLambertMaterial color="#F0E0C0" />
        </mesh>
      </group>

      {/* Shelf with items on left wall */}
      <mesh position={[-3.9, 1.5, -1]}>
        <boxGeometry args={[0.12, 0.08, 1.5]} />
        <meshLambertMaterial color="#8B5E3C" />
      </mesh>
      {/* Trophy on shelf */}
      <group position={[-3.8, 1.65, -0.8]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 6]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      </group>
    </group>
  )
}
