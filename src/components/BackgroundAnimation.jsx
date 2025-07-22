import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

const NUM_PARTICLES = 1000;

const BloodParticlesInstanced = () => {
  const meshRef = useRef();
  const { size, camera, mouse } = useThree();

  // Positions, types: 0 = RBC, 1 = Platelet, 2 = WBC
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 30
        ),
        type: Math.random() < 0.85 ? 0 : Math.random() < 0.5 ? 1 : 2 // Mostly RBC
      });
    }
    return arr;
  }, []);

  const dummy = new THREE.Object3D();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const offset = Math.sin(time + i) * 0.01;
      const dx = Math.sin(time * 0.3 + i) * 0.002;
      const dy = Math.cos(time * 0.2 + i) * 0.002;

      // Cursor ripple interaction
      const mouse3D = new THREE.Vector3(mouse.x * 10, mouse.y * 6, 0);
      const dist = mouse3D.distanceTo(p.position);
      const ripple = Math.max(0, 1 - dist / 5) * 0.5;

      dummy.position.copy(p.position);
      dummy.position.x += dx + ripple * (p.position.x - mouse3D.x) * 0.001;
      dummy.position.y += dy + ripple * (p.position.y - mouse3D.y) * 0.001;
      dummy.position.z += offset;

      dummy.rotation.x = time * 0.2 + i;
      dummy.rotation.y = time * 0.1 + i;

      const scale = p.type === 0 ? 0.03 : p.type === 1 ? 0.015 : 0.05;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Color per type
  const colorArray = useMemo(() => {
    const colors = [];
    particles.forEach((p) => {
      const color =
        p.type === 0
          ? new THREE.Color("#8B0000") // RBC
          : p.type === 1
          ? new THREE.Color("#FFD700") // Platelet
          : new THREE.Color("#FFFFFF"); // WBC
      colors.push(color.r, color.g, color.b);
    });
    return new Float32Array(colors);
  }, [particles]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, NUM_PARTICLES]}>
      <sphereGeometry args={[1, 8, 8]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </sphereGeometry>
      <meshStandardMaterial
        vertexColors
        emissive="#220000"
        emissiveIntensity={0.1}
        roughness={0.4}
      />
    </instancedMesh>
  );
};

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 10, 5]} intensity={1} color="#FF5555" />
        <BloodParticlesInstanced />
      </Canvas>
    </div>
  );
};

export default BackgroundAnimation;
