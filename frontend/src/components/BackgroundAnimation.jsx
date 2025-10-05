import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';

const NUM_MOLECULES = 400; // Molecular particles
const NUM_DNA_POINTS = 60; // DNA helix points

// 2D plus geometry (hospital cross style)
const createPlusGeometry = (scale = 1) => {
  const length = 1 * scale;
  const radius = 0.12 * scale; // Thicker for visibility

  const barY = new THREE.CapsuleGeometry(radius, length, 8, 32); // Vertical
  const barX = new THREE.CapsuleGeometry(radius, length, 8, 32);
  barX.rotateZ(Math.PI / 2); // Horizontal

  const merged = mergeGeometries([barX, barY], false);
  return merged;
};

const MedicalParticles = () => {
  const moleculeRef = useRef();
  const dnaRef = useRef();
  const moleculeGlowRef = useRef(); // Neon glow for molecules
  const dnaGlowRef = useRef(); // Neon glow for DNA
  const { size, camera, mouse } = useThree();

  const plusGeometry = useMemo(() => createPlusGeometry(1), []);

  // Particle data: 0 = Molecule, 1 = DNA point
  const particles = useMemo(() => {
    const arr = [];
    // Molecules
    for (let i = 0; i < NUM_MOLECULES; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 40
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        targetPosition: new THREE.Vector3(),
        type: 0,
      });
    }
    // DNA helix
    for (let i = 0; i < NUM_DNA_POINTS; i++) {
      const theta = (i / NUM_DNA_POINTS) * Math.PI * 8;
      arr.push({
        position: new THREE.Vector3(
          Math.cos(theta) * 3.5,
          (i / NUM_DNA_POINTS - 0.5) * 15,
          Math.sin(theta) * 3.5
        ),
        velocity: new THREE.Vector3(0, 0.015, 0),
        targetPosition: new THREE.Vector3(),
        type: 1,
      });
    }
    return arr;
  }, []);

  const dummy = new THREE.Object3D();

  // Anime.js for scaling and opacity
  const scales = useMemo(() => particles.map(() => ({ value: 1, opacity: 0.85 })), [particles]);
  const glowScales = useMemo(() => particles.map(() => ({ value: 1, opacity: 0.4 })), [particles]);

  useEffect(() => {
    particles.forEach((p, i) => {
      // Core particle animation (unchanged, no heartbeat)
      anime({
        targets: scales[i],
        value: [0.7, 1.3],
        opacity: [0.7, 0.95],
        duration: 1800 + Math.random() * 1200,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
      // Neon glow heartbeat pulse (80bpm, lighter and smaller)
      anime({
        targets: glowScales[i],
        value: [0.9, 1.2], // Smaller scale for subtle glow
        opacity: [0.2, 0.6], // Lighter neon pulse
        duration: 750, // 80bpm
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
    });
  }, [particles, scales, glowScales]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    particles.forEach((p, i) => {
      // Base velocity update
      p.position.add(p.velocity.clone().multiplyScalar(0.95)); // Damping

      // Cursor interaction (only for molecules, core only)
      if (p.type === 0) {
        const mouse3D = new THREE.Vector3(mouse.x * 20, mouse.y * 12, 0);
        const dist = mouse3D.distanceTo(p.position);
        const attraction = Math.max(0, 1 - dist / 12) * 0.6;

        if (dist < 12) {
          const offset = new THREE.Vector3().subVectors(mouse3D, p.position).normalize().multiplyScalar(2);
          p.targetPosition.copy(mouse3D).add(offset);
          p.position.lerp(p.targetPosition, 0.05); // Smooth lerp
          anime({
            targets: scales[i],
            value: 2.2,
            opacity: 1,
            duration: 600,
            easing: 'easeOutExpo',
          });
        } else {
          anime({
            targets: scales[i],
            value: 1,
            opacity: 0.85,
            duration: 800,
            easing: 'easeOutExpo',
          });
        }
      }

      // Bounds wrapping
      ['x', 'y', 'z'].forEach((axis) => {
        if (p.position[axis] > 20) p.position[axis] = -20;
        if (p.position[axis] < -20) p.position[axis] = 20;
      });

      dummy.position.copy(p.position);
      dummy.rotation.x = time * (p.type === 1 ? 0.5 : 0.3) + i * 0.1;
      dummy.rotation.y = time * (p.type === 1 ? 0.4 : 0.2) + i * 0.1;

      const baseScale = p.type === 0 ? 0.2 : 0.15; // Adjusted for plus size
      dummy.scale.setScalar(baseScale * scales[i].value);
      dummy.updateMatrix();

      const glowScale = baseScale * 1.5 * glowScales[i].value; // Larger glow
      const glowDummy = new THREE.Object3D();
      glowDummy.position.copy(p.position);
      glowDummy.rotation.copy(dummy.rotation);
      glowDummy.scale.setScalar(glowScale);
      glowDummy.updateMatrix();

      if (p.type === 0) {
        moleculeRef.current.setMatrixAt(i, dummy.matrix);
        moleculeGlowRef.current.setMatrixAt(i, glowDummy.matrix);
      } else {
        dnaRef.current.setMatrixAt(i - NUM_MOLECULES, dummy.matrix);
        dnaGlowRef.current.setMatrixAt(i - NUM_MOLECULES, glowDummy.matrix);
      }
    });

    if (moleculeRef.current) moleculeRef.current.instanceMatrix.needsUpdate = true;
    if (dnaRef.current) dnaRef.current.instanceMatrix.needsUpdate = true;
    if (moleculeGlowRef.current) moleculeGlowRef.current.instanceMatrix.needsUpdate = true;
    if (dnaGlowRef.current) dnaGlowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Core molecule particles */}
      <instancedMesh ref={moleculeRef} args={[plusGeometry, null, NUM_MOLECULES]}>
        <meshStandardMaterial
          color="#01579B" // Darker blue
          emissive="#01579B"
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </instancedMesh>
      {/* Neon glow for molecules */}
      <instancedMesh ref={moleculeGlowRef} args={[plusGeometry, null, NUM_MOLECULES]}>
        <meshBasicMaterial
          color="#40C4FF" // Brighter blue for neon
          transparent
          opacity={0.4}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      {/* Core DNA particles */}
      <instancedMesh ref={dnaRef} args={[plusGeometry, null, NUM_DNA_POINTS]}>
        <meshStandardMaterial
          color="#2E7D32" // Darker green
          emissive="#2E7D32"
          emissiveIntensity={1.3}
          roughness={0.3}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </instancedMesh>
      {/* Neon glow for DNA */}
      <instancedMesh ref={dnaGlowRef} args={[plusGeometry, null, NUM_DNA_POINTS]}>
        <meshBasicMaterial
          color="#66BB6A" // Brighter green for neon
          transparent
          opacity={0.4}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  );
};

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#0288D1" />
        <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#F8F8F9" />
        <MedicalParticles />
      </Canvas>
    </div>
  );
};

export default BackgroundAnimation;