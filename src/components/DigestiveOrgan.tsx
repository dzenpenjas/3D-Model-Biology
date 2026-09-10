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
  progress?: number; // 0 to 1 global animation progress
}

/* =========================================================================
   1. MOUTH & PHARYNX (Cavum Oris & Faring)
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
  const highlight = isActive || isSelected || isHovered;
  const groupRef = useRef<THREE.Group>(null);

  // Gentle chewing / mastication motion when active
  useFrame(({ clock }) => {
    if (groupRef.current && (isActive || isSelected)) {
      const t = clock.getElapsedTime();
      const chew = Math.sin(t * 5.0) * 0.03;
      groupRef.current.position.y = 3.38 + chew * 0.4;
      groupRef.current.scale.set(1 + chew * 0.5, 1 - chew * 0.4, 1 + chew * 0.3);
    } else if (groupRef.current) {
      groupRef.current.position.set(0, 3.38, 0.18);
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  // Pharynx funnel tube geometry transitioning into esophagus
  const pharynxGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.05, -0.05),
      new THREE.Vector3(0, -0.18, -0.16),
      new THREE.Vector3(0, -0.42, -0.22),
    ]);
    return new THREE.TubeGeometry(curve, 18, 0.11, 14, false);
  }, []);

  return (
    <group
      ref={groupRef}
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
      {/* Horizontal Oval Oral Cavity (Rongga Mulut) */}
      <mesh position={[0, 0.02, 0.02]} scale={[1.4, 0.95, 1.25]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
          metalness={0.06}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* Upper Jaw / Maxillary Dental Arch */}
      <mesh position={[0, 0.1, 0.14]} rotation={[-0.15, 0, 0]}>
        <torusGeometry args={[0.18, 0.045, 12, 24, Math.PI * 0.9]} />
        <meshStandardMaterial color={highlight ? '#fda4af' : '#e11d48'} roughness={0.3} />
      </mesh>

      {/* Lower Jaw / Mandibular Arch */}
      <mesh position={[0, -0.08, 0.13]} rotation={[0.15, 0, Math.PI]}>
        <torusGeometry args={[0.17, 0.042, 12, 24, Math.PI * 0.9]} />
        <meshStandardMaterial color={highlight ? '#fda4af' : '#be123c'} roughness={0.3} />
      </mesh>

      {/* Tongue (Lidah) resting at the floor of the cavity */}
      <mesh position={[0, -0.06, 0.08]} scale={[1.3, 0.42, 1.45]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.28} />
      </mesh>

      {/* Pharynx (Faring - Funnel pathway into esophagus) */}
      <mesh geometry={pharynxGeom}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          roughness={0.35}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
        />
      </mesh>

      {/* Subtle Salivary Glands (Kelenjar Parotis & Submandibularis) */}
      <mesh position={[0.28, -0.08, -0.05]} scale={[1.2, 0.8, 0.9]}>
        <sphereGeometry args={[0.065, 14, 14]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.35} emissive="#d97706" emissiveIntensity={highlight ? 0.4 : 0.1} />
      </mesh>
      <mesh position={[-0.28, -0.08, -0.05]} scale={[1.2, 0.8, 0.9]}>
        <sphereGeometry args={[0.065, 14, 14]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.35} emissive="#d97706" emissiveIntensity={highlight ? 0.4 : 0.1} />
      </mesh>

      {/* 3D Label Badge - only when hovered, selected, or active */}
      {(isHovered || isSelected || isActive) && (
        <Html position={[0, 0.42, 0.12]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-950/60 backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   2. ESOPHAGUS (Kerongkongan) with Bolus-Synchronized Peristaltic Waves
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
  progress = 0,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const ringsRef = useRef<THREE.Group>(null);

  // Natural anatomical curve from neck/pharynx down to stomach cardia
  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.96, -0.04),
      new THREE.Vector3(0, 2.65, -0.05),
      new THREE.Vector3(0.01, 2.18, -0.05),
      new THREE.Vector3(0.0, 1.7, -0.04),
      new THREE.Vector3(-0.04, 1.2, -0.02),
      new THREE.Vector3(-0.14, 0.72, 0.05), // Connects directly to stomach cardia
    ]);
    return new THREE.TubeGeometry(curve, 42, 0.085, 16, false);
  }, []);

  const ringData = useMemo(() => [
    { pos: [0, 2.7, -0.05] as [number, number, number], rangeT: 0.14 },
    { pos: [0.01, 2.35, -0.05] as [number, number, number], rangeT: 0.17 },
    { pos: [0.01, 2.0, -0.04] as [number, number, number], rangeT: 0.20 },
    { pos: [-0.01, 1.65, -0.03] as [number, number, number], rangeT: 0.23 },
    { pos: [-0.05, 1.3, -0.01] as [number, number, number], rangeT: 0.25 },
    { pos: [-0.1, 0.95, 0.03] as [number, number, number], rangeT: 0.27 },
  ], []);

  // Peristalsis: Muscle rings contract slightly BEHIND the bolus position!
  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const isInEsophagus = progress >= 0.12 && progress <= 0.28;

      ringsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const data = ringData[idx];

        if (isInEsophagus) {
          // Distance between bolus progress and this ring's position
          const diff = progress - data.rangeT;
          // If bolus is slightly ahead (diff is between 0 and 0.03), this ring is squeezing behind it!
          if (diff >= -0.01 && diff <= 0.035) {
            const squeeze = 0.72 + (diff / 0.035) * 0.35;
            ring.scale.set(squeeze, squeeze, 1);
          } else {
            // Ambient soft muscle tone
            ring.scale.set(1.0, 1.0, 1.0);
          }
        } else {
          // Idle gentle wave
          const t = clock.getElapsedTime() * 2.0;
          const wave = Math.sin(t - idx * 0.8) * 0.06;
          ring.scale.set(1 + wave, 1 + wave, 1);
        }
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
      {/* Esophagus Lumen Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Muscular Peristaltic Squeezing Rings */}
      <group ref={ringsRef}>
        {ringData.map((ring, idx) => (
          <mesh key={idx} position={ring.pos} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.095, 0.018, 10, 24]} />
            <meshStandardMaterial
              color={highlight ? '#fed7aa' : '#ea580c'}
              emissive={isActive ? '#fb923c' : '#000000'}
              emissiveIntensity={isActive ? 0.45 : 0}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.38, 1.85, 0]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-orange-300 border border-orange-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   3. STOMACH (Lambung / Ventrikulus) - Anatomical J-Shape with Localized Churning
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

  const fundusRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const antrumRef = useRef<THREE.Mesh>(null);
  const acidAuraRef = useRef<THREE.Mesh>(null);

  // Localized mechanical churning: Different stomach zones contract with phase shift
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (isActive || isSelected) {
      if (fundusRef.current) {
        const fScale = 1 + Math.sin(t * 2.8) * 0.035;
        fundusRef.current.scale.set(1.05 * fScale, 0.95 * fScale, 0.92);
      }
      if (bodyRef.current) {
        const bScaleX = 1 + Math.sin(t * 3.2 + 1.2) * 0.04;
        const bScaleY = 1 + Math.cos(t * 2.6 + 0.8) * 0.035;
        bodyRef.current.scale.set(1.3 * bScaleX, 1.4 * bScaleY, 1.05);
      }
      if (antrumRef.current) {
        const aScale = 1 + Math.sin(t * 3.6 + 2.4) * 0.05;
        antrumRef.current.scale.set(1.25 * aScale, 0.75 * aScale, 0.85);
      }
      if (acidAuraRef.current) {
        const acidPulse = 0.4 + Math.sin(t * 4.5) * 0.15;
        acidAuraRef.current.scale.setScalar(1 + acidPulse * 0.06);
      }
    } else {
      if (fundusRef.current) fundusRef.current.scale.set(1.05, 0.95, 0.92);
      if (bodyRef.current) bodyRef.current.scale.set(1.3, 1.4, 1.05);
      if (antrumRef.current) antrumRef.current.scale.set(1.25, 0.75, 0.85);
    }
  });

  return (
    <group
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
      {/* 1. Cardia Collar (Top entrance connecting from esophagus) */}
      <mesh position={[0.16, 0.58, -0.06]} rotation={[0.35, 0, -0.3]}>
        <cylinderGeometry args={[0.085, 0.12, 0.18, 16]} />
        <meshStandardMaterial color={highlight ? accentColor : baseColor} roughness={0.35} />
      </mesh>

      {/* 2. Fundus (Rounded upper dome on the anatomical left) */}
      <mesh ref={fundusRef} position={[-0.14, 0.38, 0.0]} scale={[1.05, 0.95, 0.92]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* 3. Stomach Body (Corpus - Central J-curve descending) */}
      <mesh ref={bodyRef} position={[-0.22, 0.06, 0.04]} scale={[1.3, 1.4, 1.05]}>
        <sphereGeometry args={[0.31, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* 4. Greater Curvature Muscular Rim (Outer sweeping contour) */}
      <mesh position={[-0.28, 0.08, 0.06]} rotation={[0, 0, 0.22]}>
        <torusGeometry args={[0.34, 0.042, 14, 24, Math.PI * 0.92]} />
        <meshStandardMaterial color={highlight ? '#f43f5e' : '#be123c'} roughness={0.4} />
      </mesh>

      {/* 5. Antrum & Pyloric Canal (Sweeping right-upwards to duodenum) */}
      <mesh
        ref={antrumRef}
        position={[0.08, -0.28, 0.0]}
        scale={[1.25, 0.75, 0.85]}
        rotation={[0, 0, -0.42]}
      >
        <sphereGeometry args={[0.23, 22, 22]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* 6. Pyloric Sphincter (Narrow constriction entering duodenum) */}
      <mesh position={[0.26, -0.4, -0.02]} rotation={[0.2, 0.4, -0.6]}>
        <torusGeometry args={[0.075, 0.022, 12, 20]} />
        <meshStandardMaterial color={highlight ? '#fda4af' : '#e11d48'} roughness={0.3} />
      </mesh>

      {/* Active Churning / Gastric Juice Glowing Field */}
      {isActive && (
        <mesh ref={acidAuraRef} position={[-0.14, 0.06, 0.04]}>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.2} />
        </mesh>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[-0.56, 0.28, 0.2]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-rose-300 border border-rose-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   4. LIVER (Hati / Hepar - Accessory) - Anatomical Lobed Wedge
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
      {/* Right Dominant Liver Lobe (Large wedge under right diaphragm) */}
      <mesh position={[0.1, 0.0, 0.0]} scale={[1.4, 0.98, 0.85]} rotation={[0.12, -0.22, -0.15]}>
        <sphereGeometry args={[0.39, 24, 24]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Left Tapering Liver Lobe (Extending across epigastrium) */}
      <mesh position={[-0.32, -0.06, 0.04]} scale={[1.2, 0.74, 0.58]} rotation={[0, 0, 0.22]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Falciform Ligament Line (Divider between lobes) */}
      <mesh position={[-0.06, 0.08, 0.16]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.012, 0.012, 0.46, 8]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.46, 0.42, 0.1]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-red-300 border border-red-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   5. GALLBLADDER (Kantong Empedu - Accessory) - Pear-Shaped Sac & Bile Duct
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
      {/* Pear-shaped Gallbladder Sac */}
      <mesh scale={[0.82, 1.28, 0.82]} rotation={[-0.28, 0.2, 0.4]}>
        <sphereGeometry args={[0.118, 18, 18]} />
        <meshStandardMaterial
          color={highlight ? '#34d399' : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : '#10b981') : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.7 : 0.4) : 0}
          roughness={0.3}
        />
      </mesh>

      {/* Common Bile Duct (Duktus Koledokus) leading to Duodenum */}
      <mesh position={[-0.12, -0.16, -0.06]} rotation={[0, 0, 0.65]}>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.28, 0.1, 0.1]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-emerald-300 border border-emerald-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   6. PANCREAS (Pankreas - Accessory) - Elongated Transverse Gland in Duodenum
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
      {/* Pancreatic Head resting snugly in the C-loop of Duodenum */}
      <mesh position={[0.21, -0.03, 0.05]} scale={[1.15, 1.2, 0.72]}>
        <sphereGeometry args={[0.155, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.3) : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Pancreatic Body & Tail extending horizontally to the left behind stomach */}
      <mesh position={[-0.19, 0.05, 0.02]} scale={[2.2, 0.74, 0.58]} rotation={[0, 0, 0.16]}>
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
        <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0, -0.28, 0.1]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-amber-300 border border-amber-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   7. SMALL INTESTINE (Usus Halus) - Duodenum C-Loop + Coiled Jejunum/Ileum
      + Absorption Visualizer (Ke Darah & Ke Limfa)
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

  // Distinct Duodenum C-Loop Geometry
  const duodenumGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.04, -0.32, 0.1), // Pylorus exit
      new THREE.Vector3(0.15, -0.34, 0.12),
      new THREE.Vector3(0.32, -0.48, 0.14),
      new THREE.Vector3(0.22, -0.66, 0.16),
      new THREE.Vector3(-0.06, -0.7, 0.18), // Duodenojejunal junction
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.088, 14, false);
  }, []);

  // Jejunum & Ileum rich anatomical coils
  const coilsGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, -0.7, 0.18),
      new THREE.Vector3(-0.32, -0.84, 0.22),
      new THREE.Vector3(-0.12, -1.02, 0.25),
      new THREE.Vector3(0.22, -0.96, 0.25),
      new THREE.Vector3(0.34, -1.18, 0.22),
      new THREE.Vector3(0.06, -1.35, 0.24),
      new THREE.Vector3(-0.24, -1.45, 0.22),
      new THREE.Vector3(0.1, -1.6, 0.2),
      new THREE.Vector3(0.52, -1.72, 0.16), // Connects into cecum
    ]);
    return new THREE.TubeGeometry(curve, 68, 0.078, 14, false);
  }, []);

  // Nutrient Absorption animation (Glucose/Amino Acids to Blood & Chylomicrons to Lymph)
  const bloodParticlesRef = useRef<THREE.Group>(null);
  const lymphParticlesRef = useRef<THREE.Group>(null);
  const secretionStreamsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (bloodParticlesRef.current && (isActive || isSelected)) {
      bloodParticlesRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const speed = 1.6 + i * 0.2;
        const progress = ((t * speed + i * 0.25) % 1);
        p.position.x = -0.15 - progress * 0.45;
        p.position.y = -1.1 - (i % 3) * 0.22 + Math.sin(t * 3 + i) * 0.04;
        p.position.z = 0.26 + progress * 0.1;
        p.scale.setScalar(0.022 * (1 - progress * 0.4));
      });
    }

    if (lymphParticlesRef.current && (isActive || isSelected)) {
      lymphParticlesRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const speed = 1.4 + i * 0.2;
        const progress = ((t * speed + i * 0.3) % 1);
        p.position.x = 0.15 + progress * 0.45;
        p.position.y = -1.15 - (i % 3) * 0.22 + Math.cos(t * 3 + i) * 0.04;
        p.position.z = 0.26 + progress * 0.1;
        p.scale.setScalar(0.025 * (1 - progress * 0.3));
      });
    }

    // Accessory secretions streaming into duodenum when active
    if (secretionStreamsRef.current && (isActive || isSelected)) {
      secretionStreamsRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const prog = ((t * 2.5 + i * 0.2) % 1);
        if (i < 4) {
          // Bile stream from gallbladder [0.38, 0.1, 0.28] -> Duodenum [0.32, -0.48, 0.14]
          p.position.x = 0.38 + (0.32 - 0.38) * prog;
          p.position.y = 0.1 + (-0.48 - 0.1) * prog;
          p.position.z = 0.28 + (0.14 - 0.28) * prog;
        } else {
          // Pancreatic juice stream from pancreas [-0.05, -0.25, 0.02] -> Duodenum [0.22, -0.66, 0.16]
          p.position.x = -0.05 + (0.22 - (-0.05)) * prog;
          p.position.y = -0.25 + (-0.66 - (-0.25)) * prog;
          p.position.z = 0.02 + (0.16 - 0.02) * prog;
        }
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
      {/* 1. Duodenum C-Loop */}
      <mesh geometry={duodenumGeom}>
        <meshStandardMaterial
          color={highlight ? '#fde047' : '#eab308'}
          emissive={highlight ? (isActive ? '#06b6d4' : '#facc15') : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.35) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* 2. Jejunum & Ileum Coils */}
      <mesh geometry={coilsGeom}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Organic Soft Abdominal Intestinal Mass Padding behind tube */}
      <mesh position={[0.02, -1.2, 0.16]} scale={[1.1, 0.9, 0.58]}>
        <sphereGeometry args={[0.46, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          roughness={0.45}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Secretion Influx Particles (Empedu & Enzim Pankreas menuju Duodenum) */}
      {(isActive || isSelected) && (
        <group ref={secretionStreamsRef}>
          {/* Bile droplets (Green) */}
          {[...Array(4)].map((_, idx) => (
            <mesh key={`bile-${idx}`} scale={0.022}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          ))}
          {/* Pancreatic juice droplets (Amber/Yellow) */}
          {[...Array(4)].map((_, idx) => (
            <mesh key={`panc-${idx}`} scale={0.022}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
          ))}
        </group>
      )}

      {/* Nutrient Absorption Streams & Badges */}
      {(isActive || isSelected) && (
        <>
          {/* Glucose & Amino Acids -> Capillaries (Ke Darah) */}
          <group ref={bloodParticlesRef}>
            {[...Array(6)].map((_, idx) => (
              <mesh key={`blood-${idx}`} scale={0.02}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.9} />
              </mesh>
            ))}
          </group>
          <Html position={[-0.72, -1.15, 0.28]} center distanceFactor={7.5}>
            <div className="pointer-events-none px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/90 text-red-300 border border-red-500/50 shadow-md backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              Ke Darah <span className="text-[9px] text-slate-300 font-normal">(Glukosa/Asam Amino)</span>
            </div>
          </Html>

          {/* Chylomicrons / Lipids -> Lacteal Lymph (Ke Limfa) */}
          <group ref={lymphParticlesRef}>
            {[...Array(6)].map((_, idx) => (
              <mesh key={`lymph-${idx}`} scale={0.02}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
              </mesh>
            ))}
          </group>
          <Html position={[0.72, -1.2, 0.28]} center distanceFactor={7.5}>
            <div className="pointer-events-none px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950/90 text-sky-300 border border-sky-500/50 shadow-md backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              Ke Limfa <span className="text-[9px] text-slate-300 font-normal">(Kilomikron Lemak)</span>
            </div>
          </Html>
        </>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[0, -1.18, 0.34]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-amber-300 border border-amber-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   8. LARGE INTESTINE (Usus Besar / Kolon) - Anatomical Frame + Haustra Segments
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
      // Cecum (Right lower quadrant)
      new THREE.Vector3(0.7, -1.78, 0.14),
      // Ascending Colon
      new THREE.Vector3(0.75, -1.4, 0.11),
      new THREE.Vector3(0.77, -0.95, 0.08),
      // Right Hepatic Flexure
      new THREE.Vector3(0.72, -0.55, 0.08),
      // Transverse Colon
      new THREE.Vector3(0.36, -0.5, 0.12),
      new THREE.Vector3(0.0, -0.55, 0.14),
      new THREE.Vector3(-0.38, -0.5, 0.12),
      // Left Splenic Flexure
      new THREE.Vector3(-0.72, -0.55, 0.08),
      // Descending Colon
      new THREE.Vector3(-0.75, -0.95, 0.08),
      new THREE.Vector3(-0.72, -1.4, 0.1),
      // Sigmoid Colon S-curve
      new THREE.Vector3(-0.62, -1.75, 0.11),
      new THREE.Vector3(-0.36, -1.96, 0.07),
      new THREE.Vector3(-0.12, -2.08, 0.04),
      new THREE.Vector3(0.0, -2.25, 0.02),
    ]);
  }, []);

  const colonGeometry = useMemo(() => {
    return new THREE.TubeGeometry(colonCurve, 84, 0.12, 16, false);
  }, [colonCurve]);

  // Water absorption visualizer animation (Condensing micro-droplets)
  useFrame(({ clock }) => {
    if (waterRef.current && (isActive || isSelected)) {
      const t = clock.getElapsedTime() * 2.8;
      waterRef.current.children.forEach((child, i) => {
        const p = child as THREE.Mesh;
        const pulse = Math.sin(t + i);
        p.scale.setScalar(0.02 + pulse * 0.007);
      });
    }
  });

  const haustraPositions: [number, number, number][] = [
    [0.75, -1.42, 0.11],
    [0.77, -0.95, 0.08],
    [0.36, -0.5, 0.12],
    [0.0, -0.55, 0.14],
    [-0.38, -0.5, 0.12],
    [-0.75, -0.95, 0.08],
    [-0.72, -1.4, 0.1],
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
      {/* Colon Thick Lumen Tube */}
      <mesh geometry={colonGeometry}>
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.65 : 0.3) : 0}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Vermiform Appendix (Umbai Cacing) at bottom of Cecum */}
      <mesh position={[0.73, -1.98, 0.14]} rotation={[0.4, 0, 0.85]}>
        <cylinderGeometry args={[0.02, 0.016, 0.18, 8]} />
        <meshStandardMaterial color="#84cc16" roughness={0.4} />
      </mesh>

      {/* Haustra Segment Bulges along Colon perimeter */}
      {haustraPositions.map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]} scale={[1.18, 1.18, 1.18]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={highlight ? accentColor : baseColor} roughness={0.4} />
        </mesh>
      ))}

      {/* Water Reabsorption Droplet Particles */}
      {(isActive || isSelected) && (
        <group ref={waterRef}>
          {[
            [0.74, -1.18, 0.14],
            [0.2, -0.52, 0.15],
            [-0.2, -0.52, 0.15],
            [-0.74, -1.18, 0.12],
            [-0.38, -1.95, 0.09],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
            </mesh>
          ))}
        </group>
      )}

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.92, -0.7, 0.1]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-lime-300 border border-lime-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/* =========================================================================
   9. RECTUM & ANUS (Rektum & Kanalis Analis) - Straight Terminal Channel
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
      new THREE.Vector3(0.0, -2.25, 0.02),
      new THREE.Vector3(0.0, -2.52, -0.01),
      new THREE.Vector3(0.0, -2.82, -0.02),
      new THREE.Vector3(0.0, -3.08, 0.0),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.11, 16, false);
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

      {/* Rectal Ampulla (Ampula Rektum - Reservoir Chamber) */}
      <mesh position={[0, -2.72, -0.02]} scale={[1.22, 1.35, 1.1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={highlight ? accentColor : baseColor}
          emissive={highlight ? (isActive ? '#06b6d4' : accentColor) : '#000000'}
          emissiveIntensity={highlight ? (isActive ? 0.6 : 0.25) : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Anal Sphincter Muscular Ring (Sfingter Ani) */}
      <mesh position={[0, -3.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 12, 24]} />
        <meshStandardMaterial color={highlight ? '#38bdf8' : '#0891b2'} roughness={0.3} />
      </mesh>

      {(isHovered || isSelected || isActive) && (
        <Html position={[0.42, -2.72, 0]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-cyan-300 border border-cyan-500/60 shadow-lg backdrop-blur-sm">
            {name} <span className="text-slate-400 font-normal text-[11px]">({latinName})</span>
          </div>
        </Html>
      )}
    </group>
  );
};
