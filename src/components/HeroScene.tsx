import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 900

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 2.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6
      arr[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 2
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.04
    pointsRef.current.rotation.x = Math.sin(t * 0.06) * 0.1
    const targetX = state.pointer.x * 0.3
    const targetY = state.pointer.y * 0.2
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#818CF8" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ParticleField />
    </Canvas>
  )
}
