import React, { useMemo, useRef, useState } from 'react';
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

  // Gentle breathing / pulse when active
  useFrame(({ clock }) => {
    if (meshRef.current && (isActive || isSelected)) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.03;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const highlight = isActive || isSelected || isHovered;

  return (
    <group
      ref={meshRef}
      position={[0, 3.4, 0.2]}
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
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.35) : 0}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Upper Lip / Arch */}
      <mesh position={[0, 0.08, 0.2]}>
        <torusGeometry args={[0.22, 0.06, 12, 24, Math.PI]} />
        <meshStandardMaterial
          color={highlight ? '#fb7185' : '#e11d48'}
          roughness={0.4}
        />
      </mesh>

      {/* Lower Jaw / Lip */}
      <mesh position={[0, -0.12, 0.18]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.2, 0.055, 12, 24, Math.PI]} />
        <meshStandardMaterial
          color={highlight ? '#fb7185' : '#be123c'}
          roughness={0.4}
        />
      </mesh>

      {/* Tongue (Lingua) */}
      <mesh position={[0, -0.1, 0.12]} scale={[1.2, 0.4, 1.4]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#f43f5e"
          roughness={0.3}
        />
      </mesh>

      {/* Stylized Salivary Glands (Kelenjar Ludah) */}
      <mesh position={[0.28, -0.15, -0.02]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} />
      </mesh>
      <mesh position={[-0.28, -0.15, -0.02]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} />
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
   2. ESOPHAGUS (Kerongkongan)
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

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.1, 0.05),
      new THREE.Vector3(0, 2.5, -0.04),
      new THREE.Vector3(0.02, 1.9, -0.04),
      new THREE.Vector3(-0.02, 1.3, -0.02),
      new THREE.Vector3(-0.16, 0.7, 0.06),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.11, 16, false);
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
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Muscular Peristaltic Rings along tube */}
      {[2.7, 2.3, 1.9, 1.5, 1.1].map((y, idx) => (
        <mesh key={idx} position={[0, y, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.018, 8, 20]} />
          <meshStandardMaterial
            color={highlight ? '#fed7aa' : '#ea580c'}
            roughness={0.4}
          />
        </mesh>
      ))}

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.4, 1.9, 0]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-orange-300 border border-orange-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   3. STOMACH (Lambung / Ventrikulus)
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

  useFrame(({ clock }) => {
    if (groupRef.current && (isActive || isSelected)) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3.5) * 0.025;
      groupRef.current.scale.set(scale, scale, scale);
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[-0.35, 0.1, 0.15]}
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
      {/* Stomach Fundus & Main Body (Curved J-shaped organic mass) */}
      <mesh position={[-0.15, 0.3, 0]} scale={[1.1, 0.9, 0.9]}>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Main Stomach Body Curve */}
      <mesh position={[-0.22, 0.02, 0.05]} scale={[1.3, 1.4, 1.0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Pylorus / Antrum lower curve */}
      <mesh position={[0.1, -0.3, 0]} scale={[1.2, 0.7, 0.8]} rotation={[0, 0, -0.4]}>
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Greater Curvature Ridge */}
      <mesh position={[-0.32, 0.05, 0.08]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.35, 0.05, 12, 24, Math.PI * 0.9]} />
        <meshStandardMaterial
          color={highlight ? '#f43f5e' : '#be123c'}
          roughness={0.4}
        />
      </mesh>

      {/* Cardiac Sphincter Entry */}
      <mesh position={[0.15, 0.55, -0.08]} rotation={[0.4, 0, -0.3]}>
        <cylinderGeometry args={[0.11, 0.14, 0.2, 16]} />
        <meshStandardMaterial color={highlight ? accentColor : baseColor} />
      </mesh>

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
      position={[0.62, 0.42, 0.12]}
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
      <mesh position={[0.12, 0, 0]} scale={[1.4, 1.0, 0.8]} rotation={[0.1, -0.2, -0.15]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Left Smaller Lobe tapering across midline */}
      <mesh position={[-0.32, -0.05, 0.05]} scale={[1.2, 0.75, 0.6]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.5, 0.4, 0.1]} center distanceFactor={8}>
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
      position={[0.42, 0.08, 0.32]}
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
      <mesh scale={[0.8, 1.2, 0.8]} rotation={[-0.3, 0.2, 0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? '#34d399' : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : '#10b981') : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.7 : 0.4) : 0}
          roughness={0.3}
        />
      </mesh>

      {/* Bile Duct (Duktus Koledokus) leading to Duodenum */}
      <mesh position={[-0.1, -0.15, -0.08]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.3, 0.1, 0.1]} center distanceFactor={8}>
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
      position={[-0.05, -0.25, -0.05]}
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
      {/* Head of Pancreas in C-loop */}
      <mesh position={[0.2, -0.02, 0.06]} scale={[1.1, 1.2, 0.7]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Body & Tail of Pancreas extending left */}
      <mesh position={[-0.2, 0.05, 0.02]} scale={[2.2, 0.75, 0.6]} rotation={[0, 0, 0.15]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
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
   7. SMALL INTESTINE (Usus Halus / Intestinum Tenue)
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

  const smallIntestineGeom = useMemo(() => {
    // Dense anatomical looping tube for Duodenum, Jejunum, and Ileum
    const curve = new THREE.CatmullRomCurve3([
      // Duodenum C-loop
      new THREE.Vector3(-0.05, -0.35, 0.1),
      new THREE.Vector3(0.18, -0.38, 0.12),
      new THREE.Vector3(0.35, -0.55, 0.15),
      new THREE.Vector3(0.22, -0.75, 0.18),
      new THREE.Vector3(-0.1, -0.78, 0.2),

      // Jejunum folded coils
      new THREE.Vector3(-0.38, -0.92, 0.26),
      new THREE.Vector3(-0.15, -1.12, 0.28),
      new THREE.Vector3(0.26, -1.02, 0.28),
      new THREE.Vector3(0.4, -1.28, 0.25),

      // Ileum folded coils
      new THREE.Vector3(0.08, -1.42, 0.28),
      new THREE.Vector3(-0.3, -1.52, 0.25),
      new THREE.Vector3(0.1, -1.7, 0.24),
      new THREE.Vector3(0.55, -1.82, 0.2), // Connects to cecum
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.085, 12, false);
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
      <mesh geometry={smallIntestineGeom}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Intestinal coils volume padding mesh (gives organic depth) */}
      <mesh position={[0.02, -1.25, 0.18]} scale={[1.15, 0.95, 0.65]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          roughness={0.45}
          transparent
          opacity={0.35}
        />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0, -1.2, 0.35]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-amber-300 border border-amber-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   8. LARGE INTESTINE (Usus Besar / Kolon)
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

  const colonCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      // Cecum (Right lower abdomen)
      new THREE.Vector3(0.72, -1.88, 0.15),
      // Ascending Colon
      new THREE.Vector3(0.78, -1.45, 0.12),
      new THREE.Vector3(0.8, -0.95, 0.08),
      // Right Hepatic Flexure
      new THREE.Vector3(0.74, -0.55, 0.08),
      // Transverse Colon
      new THREE.Vector3(0.4, -0.52, 0.12),
      new THREE.Vector3(0.0, -0.58, 0.15),
      new THREE.Vector3(-0.45, -0.52, 0.12),
      // Left Splenic Flexure
      new THREE.Vector3(-0.76, -0.55, 0.08),
      // Descending Colon
      new THREE.Vector3(-0.8, -0.95, 0.08),
      new THREE.Vector3(-0.76, -1.45, 0.1),
      // Sigmoid Colon S-curve
      new THREE.Vector3(-0.65, -1.85, 0.12),
      new THREE.Vector3(-0.4, -2.05, 0.08),
      new THREE.Vector3(-0.15, -2.18, 0.05),
      new THREE.Vector3(0.0, -2.35, 0.02),
    ]);
  }, []);

  const colonGeometry = useMemo(() => {
    return new THREE.TubeGeometry(colonCurve, 80, 0.13, 16, false);
  }, [colonCurve]);

  // Appendix vermiformis (Umbai Cacing) at cecum base
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
      <mesh geometry={colonGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Appendix (Umbai Cacing) */}
      <mesh position={[0.76, -2.05, 0.14]} rotation={[0.4, 0, 0.8]}>
        <cylinderGeometry args={[0.025, 0.02, 0.18, 8]} />
        <meshStandardMaterial color="#84cc16" roughness={0.4} />
      </mesh>

      {/* Colon Haustra Segments / Rings */}
      {[
        [0.78, -1.5, 0.12],
        [0.8, -1.0, 0.08],
        [0.4, -0.52, 0.12],
        [0.0, -0.58, 0.15],
        [-0.45, -0.52, 0.12],
        [-0.8, -1.0, 0.08],
        [-0.75, -1.5, 0.1],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial
            color={highlight ? accentColor : baseColor}
            roughness={0.4}
          />
        </mesh>
      ))}

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
      new THREE.Vector3(0.0, -2.35, 0.02),
      new THREE.Vector3(0.0, -2.65, -0.01),
      new THREE.Vector3(0.0, -2.95, -0.02),
      new THREE.Vector3(0.0, -3.2, 0.0),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.12, 16, false);
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

      {/* Rectal Ampulla (Kantung Pelebaran Rektum) */}
      <mesh position={[0, -2.8, -0.02]} scale={[1.2, 1.4, 1.1]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.25) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Anal Sphincter Ring (Sfingter Anus) */}
      <mesh position={[0, -3.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.035, 10, 20]} />
        <meshStandardMaterial
          color={highlight ? '#38bdf8' : '#0891b2'}
          roughness={0.3}
        />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.45, -2.8, 0]} center distanceFactor={8}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-cyan-300 border border-cyan-500/50 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};
