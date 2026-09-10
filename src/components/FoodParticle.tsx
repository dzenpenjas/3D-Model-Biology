import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { digestiveCurve } from '../data/digestiveSteps';
import { DigestiveStageId } from '../types';

interface FoodParticleProps {
  progress: number; // 0 to 1
  activeStageId: DigestiveStageId;
  isPlaying: boolean;
}

export const FoodPathwayTrack: React.FC = () => {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(digestiveCurve, 220, 0.016, 8, false);
  }, []);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.16}
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
  const subParticlesRef = useRef<THREE.Group>(null);
  const trailGroupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Group>(null);

  // Distinct biological states and styling of food along the digestive tract
  const foodVisual = useMemo(() => {
    switch (activeStageId) {
      case 'mouth':
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.11,
          label: 'Bolus',
          subLabel: 'Makanan dikunyah & bercampur saliva',
          emissive: '#d97706',
          roughness: 0.25,
          pulseSpeed: 5.0,
          isMulti: false,
        };
      case 'esophagus':
        return {
          coreColor: '#fb923c',
          glowColor: '#fdba74',
          scale: 0.095,
          label: 'Bolus',
          subLabel: 'Massa licin didorong peristaltik',
          emissive: '#ea580c',
          roughness: 0.2,
          pulseSpeed: 4.0,
          isMulti: false,
        };
      case 'stomach':
        return {
          coreColor: '#f43f5e',
          glowColor: '#fda4af',
          scale: 0.08,
          label: 'Kimus / Chyme',
          subLabel: 'Diaduk asam lambung & pepsin',
          emissive: '#e11d48',
          roughness: 0.35,
          pulseSpeed: 6.5,
          isMulti: true, // Multiple churning droplets
        };
      case 'smallIntestine':
        return {
          coreColor: '#38bdf8',
          glowColor: '#7dd3fc',
          scale: 0.065,
          label: 'Sari Makanan',
          subLabel: 'Nutrisi terlarut siap diserap vili',
          emissive: '#0284c7',
          roughness: 0.15,
          pulseSpeed: 5.5,
          isMulti: true,
        };
      case 'largeIntestine':
        return {
          coreColor: '#a3e635',
          glowColor: '#bef264',
          scale: 0.09,
          label: 'Sisa Pencernaan',
          subLabel: 'Reabsorpsi air & fermentasi serat',
          emissive: '#65a30d',
          roughness: 0.45,
          pulseSpeed: 3.5,
          isMulti: false,
        };
      case 'rectum':
        return {
          coreColor: '#06b6d4',
          glowColor: '#67e8f9',
          scale: 0.1,
          label: 'Feses',
          subLabel: 'Massa padat siap dikeluarkan',
          emissive: '#0891b2',
          roughness: 0.5,
          pulseSpeed: 3.0,
          isMulti: false,
        };
      default:
        return {
          coreColor: '#f59e0b',
          glowColor: '#fbbf24',
          scale: 0.1,
          label: 'Bolus',
          subLabel: 'Makanan',
          emissive: '#d97706',
          roughness: 0.25,
          pulseSpeed: 4.0,
          isMulti: false,
        };
    }
  }, [activeStageId]);

  // Update particle position along curve
  useFrame(({ clock }) => {
    const t = Math.max(0, Math.min(1, progress));
    const point = digestiveCurve.getPointAt(t);

    if (coreRef.current) {
      coreRef.current.position.copy(point);

      const time = clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * foodVisual.pulseSpeed) * 0.12;
      coreRef.current.scale.set(
        foodVisual.scale * pulse,
        foodVisual.scale * pulse,
        foodVisual.scale * pulse
      );
      coreRef.current.rotation.y = time * 2.2;
      coreRef.current.rotation.x = time * 1.6;
    }

    // Secondary sub-particles for semi-liquid kimus and nutrient dispersion
    if (subParticlesRef.current) {
      const time = clock.getElapsedTime();
      subParticlesRef.current.position.copy(point);
      subParticlesRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const angle = time * 3 + i * 1.57;
        const radius = foodVisual.isMulti ? 0.05 + Math.sin(time * 4 + i) * 0.02 : 0;
        p.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(time * 2 + i) * 0.02);
      });
    }

    // Trailing particles follow smoothly behind
    if (trailGroupRef.current) {
      const trailT1 = Math.max(0, t - 0.01);
      const trailT2 = Math.max(0, t - 0.02);
      const trailT3 = Math.max(0, t - 0.03);
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

    // Swirling micro-sparkles
    if (sparklesRef.current) {
      const time = clock.getElapsedTime();
      sparklesRef.current.position.copy(point);
      sparklesRef.current.rotation.z = time * 2.5;
      sparklesRef.current.rotation.y = time * 2.0;
    }
  });

  return (
    <>
      {/* Main Core Food Particle */}
      <group ref={coreRef}>
        <mesh>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={foodVisual.coreColor}
            emissive={foodVisual.emissive}
            emissiveIntensity={0.9}
            roughness={foodVisual.roughness}
            metalness={0.08}
          />
        </mesh>

        {/* Outer glowing aura */}
        <mesh>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshBasicMaterial
            color={foodVisual.glowColor}
            transparent
            opacity={0.32}
          />
        </mesh>

        {/* Point Light illuminating surrounding lumen */}
        <pointLight
          color={foodVisual.glowColor}
          intensity={1.5}
          distance={1.5}
          decay={2}
        />

        {/* Dynamic 3D Tag Floating Above Food Particle */}
        <Html position={[0, 0.28, 0]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/90 text-amber-300 border border-amber-500/60 shadow-md backdrop-blur-sm whitespace-nowrap flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{foodVisual.label}</span>
          </div>
        </Html>
      </group>

      {/* Orbiting / Dispersed Sub-particles (Kimus & Sari Makanan) */}
      <group ref={subParticlesRef}>
        {[...Array(4)].map((_, idx) => (
          <mesh key={idx} scale={foodVisual.scale * 0.45} visible={foodVisual.isMulti}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial
              color={foodVisual.glowColor}
              emissive={foodVisual.emissive}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Sparkles Group */}
      <group ref={sparklesRef}>
        {[0, 1.57, 3.14, 4.71].map((angle, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(angle) * (foodVisual.scale * 1.5),
              Math.sin(angle) * (foodVisual.scale * 1.5),
              0,
            ]}
            scale={foodVisual.scale * 0.2}
          >
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={foodVisual.glowColor} transparent opacity={0.65} />
          </mesh>
        ))}
      </group>

      {/* Trailing Comet Tail */}
      <group ref={trailGroupRef}>
        <mesh scale={foodVisual.scale * 0.6}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color={foodVisual.glowColor} transparent opacity={0.4} />
        </mesh>
        <mesh scale={foodVisual.scale * 0.38}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={foodVisual.glowColor} transparent opacity={0.25} />
        </mesh>
        <mesh scale={foodVisual.scale * 0.2}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color={foodVisual.glowColor} transparent opacity={0.12} />
        </mesh>
      </group>
    </>
  );
};
