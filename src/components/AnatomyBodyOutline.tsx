import React, { useMemo } from 'react';
import * as THREE from 'three';

// Procedural semi-transparent anatomical human torso outline
export const AnatomyBodyOutline: React.FC = () => {
  const points = useMemo(() => {
    // Smooth anatomical silhouette points
    const pts: [number, number, number][] = [
      // Top of head
      [0, 4.35, 0],
      [0.65, 3.9, 0],
      [0.62, 3.25, 0],
      [0.34, 2.75, 0],  // Neck
      // Shoulders & Chest
      [1.45, 2.35, -0.1],
      [1.35, 1.35, -0.1], // Thorax / Ribcage
      [1.12, 0.15, 0],    // Waist / Epigastrium
      [1.28, -1.2, 0],   // Iliac crest / Hips
      [1.05, -2.45, 0],  // Pelvic bowl
      [0.45, -3.35, 0],  // Perineum / Groin
      [0, -3.45, 0],
      // Left side symmetry
      [-0.45, -3.35, 0],
      [-1.05, -2.45, 0],
      [-1.28, -1.2, 0],
      [-1.12, 0.15, 0],
      [-1.35, 1.35, -0.1],
      [-1.45, 2.35, -0.1],
      [-0.34, 2.75, 0],
      [-0.62, 3.25, 0],
      [-0.65, 3.9, 0],
      [0, 4.35, 0],
    ];
    return pts.map((p) => new THREE.Vector3(...p));
  }, []);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
  }, [points]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 120, 0.022, 8, true);
  }, [curve]);

  return (
    <group position={[0, 0, -0.18]}>
      {/* Torso Silhouette Wireframe Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </mesh>

      {/* Subtle Anatomical Rib Arches Reference */}
      {[0.4, 0.9, 1.4, 1.9].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.92 - idx * 0.05, 0.012, 6, 28, Math.PI * 0.88]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.06} />
          </mesh>
        </group>
      ))}

      {/* Pelvic Basin Arch Hint */}
      <group position={[0, -2.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.014, 6, 28, Math.PI * 0.85]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.07} />
        </mesh>
      </group>

      {/* Head Silhouette Sphere Cage */}
      <mesh position={[0, 3.65, 0]}>
        <sphereGeometry args={[0.68, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.035}
        />
      </mesh>
    </group>
  );
};
