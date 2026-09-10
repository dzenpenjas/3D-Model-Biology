import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { digestiveCurve } from '../data/digestiveSteps';
import { DigestiveStageId } from '../types';

interface FoodParticleProps {
  progress: number; // 0 to 1
  activeStageId: DigestiveStageId;
  isPlaying: boolean;
}

export const FoodPathwayTrack: React.FC = () => {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(digestiveCurve, 200, 0.018, 8, false);
  }, []);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.22}
        wireframe={false}
      />
    </mesh>
  );
};

export const FoodParticle: React.FC<FoodParticleProps> = ({
  progress,
  activeStageId,
  isPlaying,
}) => {
  const coreRef = useRef<THREE.Group>(null);
  const trailGroupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Group>(null);

  // Determine food appearance and physical state transformation along the tract
  const foodVisual = useMemo(() => {
    switch (activeStageId) {
      case 'mouth':
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.11,
          label: 'Makanan (Bahan Makanan Dikunyah)',
          emissive: '#d97706',
          roughness: 0.2,
          pulseSpeed: 5.0,
        };
      case 'esophagus':
        return {
          coreColor: '#fb923c',
          glowColor: '#fdba74',
          scale: 0.1,
          label: 'Bolus (Gumpalan Lembut Berlendir)',
          emissive: '#ea580c',
          roughness: 0.15,
          pulseSpeed: 4.0,
        };
      case 'stomach':
        return {
          coreColor: '#f43f5e',
          glowColor: '#fda4af',
          scale: 0.12,
          label: 'Kimus / Chyme (Asam & Enzimatis)',
          emissive: '#e11d48',
          roughness: 0.25,
          pulseSpeed: 6.5,
        };
      case 'smallIntestine':
        return {
          coreColor: '#38bdf8',
          glowColor: '#7dd3fc',
          scale: 0.09,
          label: 'Sari Makanan (Diserap Vili)',
          emissive: '#0284c7',
          roughness: 0.1,
          pulseSpeed: 5.5,
        };
      case 'largeIntestine':
        return {
          coreColor: '#a3e635',
          glowColor: '#bef264',
          scale: 0.105,
          label: 'Ampas Makanan (Reabsorpsi Air)',
          emissive: '#65a30d',
          roughness: 0.35,
          pulseSpeed: 3.5,
        };
      case 'rectum':
        return {
          coreColor: '#06b6d4',
          glowColor: '#67e8f9',
          scale: 0.115,
          label: 'Feses (Siap Dikeluarkan)',
          emissive: '#0891b2',
          roughness: 0.4,
          pulseSpeed: 3.0,
        };
      default:
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.1,
          label: 'Makanan',
          emissive: '#d97706',
          roughness: 0.2,
          pulseSpeed: 4.0,
        };
    }
  }, [activeStageId]);

  // Update particle position along curve
  useFrame(({ clock }) => {
    const t = Math.max(0, Math.min(1, progress));
    const point = digestiveCurve.getPointAt(t);

    if (coreRef.current) {
      coreRef.current.position.copy(point);

      // Biological organic pulsating rhythm
      const time = clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * foodVisual.pulseSpeed) * 0.14;
      coreRef.current.scale.set(
        foodVisual.scale * pulse,
        foodVisual.scale * pulse,
        foodVisual.scale * pulse
      );
      coreRef.current.rotation.y = time * 2.2;
      coreRef.current.rotation.x = time * 1.8;
    }

    // Trailing particles follow smoothly behind
    if (trailGroupRef.current) {
      const trailT1 = Math.max(0, t - 0.012);
      const trailT2 = Math.max(0, t - 0.024);
      const trailT3 = Math.max(0, t - 0.036);
      const p1 = digestiveCurve.getPointAt(trailT1);
      const p2 = digestiveCurve.getPointAt(trailT2);
      const p3 = digestiveCurve.getPointAt(trailT3);

      const c1 = trailGroupRef.current.children[0];
      const c2 = trailGroupRef.current.children[1];
      const c3 = trailGroupRef.current.children[2];
      if (c1) c1.position.copy(p1);
      if (c2) c2.position.copy(p2);
      if (c3) c3.position.copy(p3);
    }

    // Swirling sparkles around food particle
    if (sparklesRef.current) {
      const time = clock.getElapsedTime();
      sparklesRef.current.position.copy(point);
      sparklesRef.current.rotation.z = time * 3;
      sparklesRef.current.rotation.y = time * 2.5;
    }
  });

  return (
    <>
      {/* Main Food Particle */}
      <group ref={coreRef}>
        {/* Core sphere */}
        <mesh>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={foodVisual.coreColor}
            emissive={foodVisual.emissive}
            emissiveIntensity={0.85}
            roughness={foodVisual.roughness}
            metalness={0.1}
          />
        </mesh>

        {/* Outer glowing aura */}
        <mesh>
          <sphereGeometry args={[1.45, 16, 16]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Point Light illuminating surrounding organ lumen */}
        <pointLight
          color={foodVisual.glowColor}
          intensity={1.4}
          distance={1.6}
          decay={2}
        />
      </group>

      {/* Orbiting Sparkles */}
      <group ref={sparklesRef}>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(angle) * (foodVisual.scale * 1.6),
              Math.sin(angle) * (foodVisual.scale * 1.6),
              Math.sin(angle * 2) * (foodVisual.scale * 0.8),
            ]}
            scale={foodVisual.scale * 0.22}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={foodVisual.glowColor} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Trailing Comet Tail */}
      <group ref={trailGroupRef}>
        <mesh scale={foodVisual.scale * 0.65}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.45}
          />
        </mesh>
        <mesh scale={foodVisual.scale * 0.42}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh scale={foodVisual.scale * 0.25}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.18}
          />
        </mesh>
      </group>
    </>
  );
};
