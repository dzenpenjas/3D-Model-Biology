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
    return new THREE.TubeGeometry(digestiveCurve, 180, 0.02, 8, false);
  }, []);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.25}
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

  // Determine food appearance based on digestive state
  const foodVisual = useMemo(() => {
    switch (activeStageId) {
      case 'mouth':
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.11,
          label: 'Makanan (Bahan Makanan)',
          emissive: '#d97706',
        };
      case 'esophagus':
        return {
          coreColor: '#fb923c',
          glowColor: '#fdba74',
          scale: 0.1,
          label: 'Bolus (Gumpalan Lembut)',
          emissive: '#ea580c',
        };
      case 'stomach':
        return {
          coreColor: '#f43f5e',
          glowColor: '#fda4af',
          scale: 0.12,
          label: 'Kimus / Chyme (Asam)',
          emissive: '#e11d48',
        };
      case 'smallIntestine':
        return {
          coreColor: '#38bdf8',
          glowColor: '#7dd3fc',
          scale: 0.09,
          label: 'Nutrisi Terlarut (Diserap)',
          emissive: '#0284c7',
        };
      case 'largeIntestine':
        return {
          coreColor: '#a3e635',
          glowColor: '#bef264',
          scale: 0.11,
          label: 'Sisa Makanan (Penyerapan Air)',
          emissive: '#65a30d',
        };
      case 'rectum':
        return {
          coreColor: '#06b6d4',
          glowColor: '#67e8f9',
          scale: 0.12,
          label: 'Feses',
          emissive: '#0891b2',
        };
      default:
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.1,
          label: 'Makanan',
          emissive: '#d97706',
        };
    }
  }, [activeStageId]);

  // Update particle position along curve
  useFrame(({ clock }) => {
    const t = Math.max(0, Math.min(1, progress));
    const point = digestiveCurve.getPointAt(t);

    if (coreRef.current) {
      coreRef.current.position.copy(point);

      // Subtle pulse and rotation
      const time = clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * 6) * 0.12;
      coreRef.current.scale.set(
        foodVisual.scale * pulse,
        foodVisual.scale * pulse,
        foodVisual.scale * pulse
      );
      coreRef.current.rotation.y = time * 2;
      coreRef.current.rotation.x = time * 1.5;
    }

    // Trailing particles follow slightly behind
    if (trailGroupRef.current) {
      const trailT1 = Math.max(0, t - 0.015);
      const trailT2 = Math.max(0, t - 0.03);
      const p1 = digestiveCurve.getPointAt(trailT1);
      const p2 = digestiveCurve.getPointAt(trailT2);

      const c1 = trailGroupRef.current.children[0];
      const c2 = trailGroupRef.current.children[1];
      if (c1) c1.position.copy(p1);
      if (c2) c2.position.copy(p2);
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
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Outer glowing aura */}
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Dynamic Light emitted by food particle to illuminate surrounding organs */}
        <pointLight
          color={foodVisual.glowColor}
          intensity={1.2}
          distance={1.5}
          decay={2}
        />
      </group>

      {/* Trailing Sparkles */}
      <group ref={trailGroupRef}>
        <mesh scale={foodVisual.scale * 0.6}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.4}
          />
        </mesh>
        <mesh scale={foodVisual.scale * 0.35}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
    </>
  );
};
