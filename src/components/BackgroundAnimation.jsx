import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const Molecule = () => {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.2
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.5
  })

  return (
    <group ref={ref}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 1.5
        const z = Math.sin(angle) * 1.5
        return (
          <Sphere key={i} args={[0.15, 32, 32]}>
            <meshStandardMaterial color="#8B5E3C" />
            <mesh position={[x, 0, z]} />
          </Sphere>
        )
      })}
    </group>
  )
}

const PulseRing = () => {
  const ringRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 2) * 0.2
    ringRef.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 1.6, 64]} />
      <meshBasicMaterial color="white" transparent opacity={0.4} />
    </mesh>
  )
}

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 10]} intensity={1} color="#FFFFFF" />
        <Molecule />
        <PulseRing />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

export default BackgroundAnimation
