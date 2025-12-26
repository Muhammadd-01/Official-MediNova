import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import anime from "animejs";

const NUM_MOLECULES = 400; // Molecular particles
const NUM_DNA_POINTS = 60; // DNA helix points

const MedicalParticles = () => {
    const moleculeRef = useRef();
    const dnaRef = useRef();
    const { size, camera, mouse } = useThree();

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

    useEffect(() => {
        particles.forEach((p, i) => {
            anime({
                targets: scales[i],
                value: [0.7, 1.3],
                opacity: [0.7, 0.95],
                duration: 1800 + Math.random() * 1200,
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: true,
            });
        });
    }, [particles, scales]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        particles.forEach((p, i) => {
            // Base velocity update
            p.position.add(p.velocity.clone().multiplyScalar(0.95)); // Damping

            // Cursor interaction (only for molecules)
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

            const baseScale = p.type === 0 ? 0.05 : 0.04;
            dummy.scale.setScalar(baseScale * scales[i].value);
            dummy.updateMatrix();

            if (p.type === 0) {
                moleculeRef.current.setMatrixAt(i, dummy.matrix);
            } else {
                dnaRef.current.setMatrixAt(i - NUM_MOLECULES, dummy.matrix);
            }
        });

        moleculeRef.current.instanceMatrix.needsUpdate = true;
        dnaRef.current.instanceMatrix.needsUpdate = true;
    });

    // Colors: Admin Theme might want distinct colors?
    // Let's stick to the frontend colors for consistency as requested ("exact same")
    const colorArray = useMemo(() => {
        const colors = [];
        particles.forEach((p) => {
            const color =
                p.type === 0
                    ? new THREE.Color('#0288D1') // Darker blue for molecules
                    : new THREE.Color('#4CAF50'); // Darker green for DNA
            colors.push(color.r, color.g, color.b);
        });
        return new Float32Array(colors);
    }, [particles]);

    return (
        <>
            <instancedMesh ref={moleculeRef} args={[null, null, NUM_MOLECULES]}>
                <sphereGeometry args={[1, 16, 16]}>
                    <instancedBufferAttribute
                        attach="attributes-color"
                        args={[colorArray.slice(0, NUM_MOLECULES * 3), 3]}
                    />
                </sphereGeometry>
                <meshStandardMaterial
                    vertexColors
                    emissive="#0288D1"
                    emissiveIntensity={1.4}
                    roughness={0.4}
                    metalness={0.2}
                    transparent
                    opacity={0.85}
                />
            </instancedMesh>
            <instancedMesh ref={dnaRef} args={[null, null, NUM_DNA_POINTS]}>
                <tetrahedronGeometry args={[0.4, 2]}>
                    <instancedBufferAttribute
                        attach="attributes-color"
                        args={[colorArray.slice(NUM_MOLECULES * 3), 3]}
                    />
                </tetrahedronGeometry>
                <meshStandardMaterial
                    vertexColors
                    emissive="#4CAF50"
                    emissiveIntensity={1.3}
                    roughness={0.3}
                    metalness={0.3}
                    transparent
                    opacity={0.9}
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
