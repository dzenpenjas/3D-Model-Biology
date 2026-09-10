import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { OrganId } from '../types';

interface OrganProps {
  id: OrganId;
  name: string;
  latinName?: string;
  isActive: boolean;
  isSelected: boolean;
  baseColor: string;
  accentColor: string;
  onSelect: (id: OrganId) => void;
  hoveredOrgan: OrganId | null;
  setHoveredOrgan: (id: OrganId | null) => void;
  tooltipPos?: [number, number, number];
}

/* =========================================================================
   1. MOUTH & ORAL CAVITY (Cavum Oris)
   ========================================================================= */
export const MouthOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const meshRef = useRef<THREE.Group>(null);

  // Gentle chewing / mastication pulsing when active
  useFrame(({ clock }) => {
    if (meshRef.current && (isActive || isSelected)) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4.5) * 0.035;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const highlight = isActive || isSelected || isHovered;

  return (
    <group
      ref={meshRef}
      position={[0, 3.38, 0.18]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Oral Cavity Pouch / Pharynx */}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
          metalness={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Upper Lip / Arch */}
      <mesh position={[0, 0.08, 0.2]}>
        <torusGeometry args={[0.2, 0.055, 14, 24, Math.PI]} />
        <meshStandardMaterial
          color={highlight ? '#fb7185' : '#e11d48'}
          roughness={0.35}
        />
      </mesh>

      {/* Lower Jaw / Lip */}
      <mesh position={[0, -0.1, 0.18]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.18, 0.05, 14, 24, Math.PI]} />
        <meshStandardMaterial
          color={highlight ? '#fb7185' : '#be123c'}
          roughness={0.35}
        />
      </mesh>

      {/* Tongue (Lingua) */}
      <mesh position={[0, -0.08, 0.12]} scale={[1.2, 0.45, 1.35]} rotation={[0.18, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#f43f5e"
          roughness={0.3}
        />
      </mesh>

      {/* Salivary Glands (Kelenjar Ludah: Parotis & Submandibularis) */}
      <mesh position={[0.27, -0.12, -0.02]}>
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#d97706" emissiveIntensity={highlight ? 0.4 : 0.1} />
      </mesh>
      <mesh position={[-0.27, -0.12, -0.02]}>
        <sphereGeometry args={[0.085, 14, 14]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#d97706" emissiveIntensity={highlight ? 0.4 : 0.1} />
      </mesh>

      {/* 3D Label Badge when hovered or active */}
      {(isHovered || isSelected || isActive) && (
        <Html position={[0, 0.45, 0.1]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-950/60 backdrop-blur-sm transition-all duration-200">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   2. ESOPHAGUS (Kerongkongan) with Dynamic Peristaltic Wave Rings
   ========================================================================= */
export const EsophagusOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const ringsRef = useRef<THREE.Group>(null);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.0, -0.02),
      new THREE.Vector3(0, 2.5, -0.04),
      new THREE.Vector3(0.01, 2.0, -0.04),
      new THREE.Vector3(-0.02, 1.45, -0.02),
      new THREE.Vector3(-0.14, 0.72, 0.06),
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.1, 16, false);
  }, []);

  // Peristalsis animation: Wave traveling down the muscular rings
  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const t = clock.getElapsedTime() * 3.0;
      ringsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const offset = idx * 0.7;
        const wave = Math.sin(t - offset);
        const scale = isActive || isSelected ? 1 + wave * 0.18 : 1 + wave * 0.05;
        ring.scale.set(scale, scale, 1);
      });
    }
  });

  const ringPositions: [number, number, number][] = [
    [0, 2.65, -0.04],
    [0.01, 2.3, -0.04],
    [0.01, 1.95, -0.04],
    [-0.01, 1.6, -0.03],
    [-0.05, 1.25, -0.01],
    [-0.1, 0.95, 0.03],
  ];

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Main Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Muscular Peristaltic Rings with wave animation */}
      <group ref={ringsRef}>
        {ringPositions.map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.02, 10, 24]} />
            <meshStandardMaterial
              color={highlight ? '#fed7aa' : '#ea580c'}
              emissive={isActive ? '#fb923c' : '#000000'}
              emissiveIntensity={isActive ? 0.4 : 0}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.42, 1.85, 0]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-orange-300 border border-orange-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   3. STOMACH (Lambung / Ventrikulus) with Churning & Acid Glow
   ========================================================================= */
export const StomachOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const groupRef = useRef<THREE.Group>(null);
  const acidAuraRef = useRef<THREE.Mesh>(null);

  // Stomach mechanical churning motion: Rhythmic contraction and deformation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current && (isActive || isSelected)) {
      const churnX = 1 + Math.sin(t * 3.2) * 0.04;
      const churnY = 1 + Math.cos(t * 2.8) * 0.035;
      const churnZ = 1 + Math.sin(t * 3.8) * 0.045;
      groupRef.current.scale.set(churnX, churnY, churnZ);
      groupRef.current.rotation.z = Math.sin(t * 2.0) * 0.025;
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
      groupRef.current.rotation.z = 0;
    }

    if (acidAuraRef.current && isActive) {
      const acidPulse = 0.4 + Math.sin(t * 5.0) * 0.2;
      acidAuraRef.current.scale.setScalar(1 + acidPulse * 0.08);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[-0.3, 0.08, 0.12]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Stomach Fundus (Upper Dome at left) */}
      <mesh position={[-0.12, 0.36, 0.0]} scale={[1.05, 0.95, 0.9]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Main Stomach Body (Corpus - Central J-Curve) */}
      <mesh position={[-0.2, 0.06, 0.04]} scale={[1.25, 1.35, 1.0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Pyloric Antrum & Canal (Lower right curve towards duodenum) */}
      <mesh position={[0.1, -0.28, 0.0]} scale={[1.2, 0.72, 0.8]} rotation={[0, 0, -0.45]}>
        <sphereGeometry args={[0.24, 22, 22]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Greater Curvature Ridge (Curved muscular outer border) */}
      <mesh position={[-0.28, 0.08, 0.06]} rotation={[0, 0, 0.25]}>
        <torusGeometry args={[0.34, 0.045, 14, 24, Math.PI * 0.92]} />
        <meshStandardMaterial
          color={highlight ? '#f43f5e' : '#be123c'}
          roughness={0.4}
        />
      </mesh>

      {/* Cardiac Orifice Collar (Top entrance from esophagus) */}
      <mesh position={[0.14, 0.58, -0.06]} rotation={[0.35, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 16]} />
        <meshStandardMaterial color={highlight ? accentColor : baseColor} />
      </mesh>

      {/* Gastric Acid / Chyme Churning Glow Sphere (Visible during active stage) */}
      {isActive && (
        <mesh ref={acidAuraRef} position={[-0.14, 0.08, 0.04]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial
            color="#fda4af"
            transparent
            opacity={0.22}
            wireframe={false}
          />
        </mesh>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[-0.55, 0.25, 0.2]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-rose-300 border border-rose-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   4. LIVER (Hati / Hepar - Accessory)
   ========================================================================= */
export const LiverOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;

  return (
    <group
      position={[0.55, 0.42, 0.15]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Right Main Large Lobe */}
      <mesh position={[0.1, 0.0, 0.0]} scale={[1.35, 0.95, 0.8]} rotation={[0.1, -0.2, -0.15]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Left Smaller Lobe extending across midline */}
      <mesh position={[-0.3, -0.05, 0.04]} scale={[1.15, 0.72, 0.58]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Falciform Ligament Divide Line */}
      <mesh position={[-0.05, 0.08, 0.16]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.45, 0.4, 0.1]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-red-300 border border-red-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   5. GALLBLADDER (Kantong Empedu - Accessory)
   ========================================================================= */
export const GallbladderOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;

  return (
    <group
      position={[0.38, 0.1, 0.28]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Pear-shaped Gallbladder sac */}
      <mesh scale={[0.8, 1.25, 0.8]} rotation={[-0.3, 0.2, 0.4]}>
        <sphereGeometry args={[0.115, 18, 18]} />
        <meshStandardMaterial
          color={highlight ? '#34d399' : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : '#10b981') : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.7 : 0.4) : 0}
          roughness={0.3}
        />
      </mesh>

      {/* Common Bile Duct (Duktus Koledokus) leading to Duodenum */}
      <mesh position={[-0.1, -0.15, -0.06]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.018, 0.018, 0.26, 8]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.28, 0.1, 0.1]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-emerald-300 border border-emerald-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   6. PANCREAS (Pankreas - Accessory)
   ========================================================================= */
export const PancreasOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;

  return (
    <group
      position={[-0.05, -0.25, 0.02]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Head of Pancreas resting in C-loop of Duodenum */}
      <mesh position={[0.2, -0.02, 0.05]} scale={[1.1, 1.15, 0.7]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Body & Tail of Pancreas extending horizontally to the left */}
      <mesh position={[-0.18, 0.05, 0.02]} scale={[2.1, 0.72, 0.58]} rotation={[0, 0, 0.15]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Main Pancreatic Duct (Duktus Pankreatikus) */}
      <mesh position={[-0.05, 0.03, 0.08]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0, -0.28, 0.1]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-amber-300 border border-amber-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   7. SMALL INTESTINE (Usus Halus / Intestinum Tenue) with Nutrient Absorption
   ========================================================================= */
export const SmallIntestineOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const absorptionGroupRef = useRef<THREE.Group>(null);

  // Dense anatomical looping tube for Duodenum, Jejunum, and Ileum
  const smallIntestineGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      // Duodenum C-loop
      new THREE.Vector3(-0.05, -0.35, 0.1),
      new THREE.Vector3(0.16, -0.37, 0.12),
      new THREE.Vector3(0.34, -0.52, 0.14),
      new THREE.Vector3(0.22, -0.72, 0.16),
      new THREE.Vector3(-0.1, -0.76, 0.18),

      // Jejunum coils
      new THREE.Vector3(-0.36, -0.92, 0.24),
      new THREE.Vector3(-0.14, -1.12, 0.26),
      new THREE.Vector3(0.24, -1.02, 0.26),
      new THREE.Vector3(0.38, -1.26, 0.23),

      // Ileum coils
      new THREE.Vector3(0.06, -1.42, 0.26),
      new THREE.Vector3(-0.26, -1.52, 0.23),
      new THREE.Vector3(0.1, -1.68, 0.22),
      new THREE.Vector3(0.54, -1.8, 0.18), // Connects to cecum
    ]);
    return new THREE.TubeGeometry(curve, 72, 0.082, 14, false);
  }, []);

  // Nutrient absorption effect animation: Micro particles radiating outward
  useFrame(({ clock }) => {
    if (absorptionGroupRef.current && (isActive || isSelected)) {
      const t = clock.getElapsedTime();
      absorptionGroupRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const angle = i * 0.8 + t * 2.0;
        const radius = 0.35 + Math.sin(t * 3.0 + i) * 0.15;
        p.position.x = Math.cos(angle) * radius;
        p.position.y = -1.2 + Math.sin(angle) * (radius * 0.7);
        p.position.z = 0.26 + Math.sin(t * 4.0 + i) * 0.08;
      });
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Small Intestine Coils Tube */}
      <mesh geometry={smallIntestineGeom}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Organic Intestinal Mass Padding behind tube */}
      <mesh position={[0.02, -1.22, 0.16]} scale={[1.12, 0.92, 0.6]}>
        <sphereGeometry args={[0.48, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          roughness={0.45}
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Nutrient Absorption Micro-particles (Villi Absorption Visualizer) */}
      {(isActive || isSelected) && (
        <group ref={absorptionGroupRef}>
          {[...Array(8)].map((_, idx) => (
            <mesh key={idx} scale={0.022}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
            </mesh>
          ))}
        </group>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[0, -1.18, 0.34]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-amber-300 border border-amber-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   8. LARGE INTESTINE (Usus Besar / Kolon) with Haustra & Water Absorption
   ========================================================================= */
export const LargeIntestineOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const waterRef = useRef<THREE.Group>(null);

  const colonCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      // Cecum (Right lower abdomen)
      new THREE.Vector3(0.72, -1.86, 0.14),
      // Ascending Colon
      new THREE.Vector3(0.78, -1.46, 0.11),
      new THREE.Vector3(0.8, -0.96, 0.08),
      // Right Hepatic Flexure
      new THREE.Vector3(0.74, -0.54, 0.08),
      // Transverse Colon
      new THREE.Vector3(0.38, -0.5, 0.12),
      new THREE.Vector3(0.0, -0.56, 0.14),
      new THREE.Vector3(-0.42, -0.5, 0.12),
      // Left Splenic Flexure
      new THREE.Vector3(-0.75, -0.54, 0.08),
      // Descending Colon
      new THREE.Vector3(-0.78, -0.96, 0.08),
      new THREE.Vector3(-0.74, -1.46, 0.1),
      // Sigmoid Colon S-curve
      new THREE.Vector3(-0.64, -1.82, 0.11),
      new THREE.Vector3(-0.38, -2.04, 0.07),
      new THREE.Vector3(-0.14, -2.16, 0.04),
      new THREE.Vector3(0.0, -2.32, 0.02),
    ]);
  }, []);

  const colonGeometry = useMemo(() => {
    return new THREE.TubeGeometry(colonCurve, 84, 0.125, 16, false);
  }, [colonCurve]);

  // Water absorption visualizer animation (Blue droplets condensing inwards)
  useFrame(({ clock }) => {
    if (waterRef.current && (isActive || isSelected)) {
      const t = clock.getElapsedTime() * 2.5;
      waterRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const pulse = Math.sin(t + i);
        p.scale.setScalar(0.02 + pulse * 0.008);
      });
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Colon Main Tube */}
      <mesh geometry={colonGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Appendix (Umbai Cacing / Apendiks Vermiformis) at Cecum base */}
      <mesh position={[0.75, -2.06, 0.14]} rotation={[0.4, 0, 0.8]}>
        <cylinderGeometry args={[0.022, 0.018, 0.18, 8]} />
        <meshStandardMaterial color="#84cc16" roughness={0.4} />
      </mesh>

      {/* Colon Haustra Segments / Bulges (Characteristic segmentations) */}
      {[
        [0.78, -1.48, 0.11],
        [0.8, -0.96, 0.08],
        [0.38, -0.5, 0.12],
        [0.0, -0.56, 0.14],
        [-0.42, -0.5, 0.12],
        [-0.78, -0.96, 0.08],
        [-0.74, -1.46, 0.1],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]} scale={[1.18, 1.18, 1.18]}>
          <sphereGeometry args={[0.125, 12, 12]} />
          <meshStandardMaterial
            color={highlight ? accentColor : baseColor}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Water Reabsorption Droplet Particles */}
      {(isActive || isSelected) && (
        <group ref={waterRef}>
          {[
            [0.76, -1.2, 0.14],
            [0.2, -0.54, 0.15],
            [-0.2, -0.54, 0.15],
            [-0.76, -1.2, 0.12],
            [-0.4, -2.0, 0.09],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.95, -0.7, 0.1]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-lime-300 border border-lime-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   9. RECTUM & ANUS (Rektum & Anus)
   ========================================================================= */
export const RectumOrgan: React.FC<OrganProps> = ({
  id,
  name,
  latinName,
  isActive,
  isSelected,
  baseColor,
  accentColor,
  onSelect,
  hoveredOrgan,
  setHoveredOrgan,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;

  const rectumGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -2.32, 0.02),
      new THREE.Vector3(0.0, -2.58, -0.01),
      new THREE.Vector3(0.0, -2.88, -0.02),
      new THREE.Vector3(0.0, -3.15, 0.0),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.115, 16, false);
  }, []);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredOrgan(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredOrgan(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh geometry={rectumGeom}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Rectal Ampulla (Kantung Pelebaran Penampung Feses) */}
      <mesh position={[0, -2.78, -0.02]} scale={[1.22, 1.35, 1.1]}>
        <sphereGeometry args={[0.155, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.25) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Anal Sphincter Muscle Ring (Sfingter Ani Internus & Eksternus) */}
      <mesh position={[0, -3.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.032, 12, 24]} />
        <meshStandardMaterial
          color={highlight ? '#38bdf8' : '#0891b2'}
          roughness={0.3}
        />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.45, -2.75, 0]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-cyan-300 border border-cyan-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};
