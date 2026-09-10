import React, { useMemo } from 'react';
import * as THREE from 'three';

// Procedural semi-transparent anatomical torso guide
export const AnatomyBodyOutline: React.FC = () => {
  const points = useMemo(() => {
    // Outer body profile points for a subtle translucent guide
    const pts: [number, number, number][] = [
      // Head & Neck
      [0, 4.2, 0],
      [0.6, 3.8, 0],
      [0.55, 3.2, 0],
      [0.35, 2.7, 0], // Neck
      // Shoulders & Chest
      [1.4, 2.3, -0.1],
      [1.3, 1.3, -0.1], // Ribcage
      [1.1, 0.2, 0],   // Waist
      [1.25, -1.2, 0],  // Hips
      [1.0, -2.5, 0],   // Pelvis / thigh start
      [0.4, -3.4, 0],   // Lower groin
      [0, -3.5, 0],
      // Left side mirror
      [-0.4, -3.4, 0],
      [-1.0, -2.5, 0],
      [-1.25, -1.2, 0],
      [-1.1, 0.2, 0],
      [-1.3, 1.3, -0.1],
      [-1.4, 2.3, -0.1],
      [-0.35, 2.7, 0],
      [-0.55, 3.2, 0],
      [-0.6, 3.8, 0],
      [0, 4.2, 0],
    ];
    return pts.map((p) => new THREE.Vector3(...p));
  }, []);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, true);
  }, [points]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.025, 8, true);
  }, [curve]);

  return (
    <group position={[0, 0, -0.15]}>
      {/* Torso Outline Wire */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          wireframe={false}
        />
      </mesh>

      {/* Subtle Ribcage Hint */}
      {[-0.2, 0.3, 0.8, 1.3, 1.8].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.95 - idx * 0.04, 0.015, 6, 32, Math.PI * 0.9]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.08} />
          </mesh>
        </group>
      ))}

      {/* Head wire ring */}
      <mesh position={[0, 3.6, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
};
