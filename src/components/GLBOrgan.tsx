import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { OrganId } from '../types';
import { SHOW_MODEL_BOUNDS, calculateNormalizedScale } from '../data/organModelConfig';

export interface GLBOrganProps {
  id: OrganId;
  name: string;
  latinName?: string;
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  targetSize?: number;
  isActive: boolean;
  isSelected: boolean;
  hoveredOrgan: OrganId | null;
  onSelect: (id: OrganId) => void;
  setHoveredOrgan: (id: OrganId | null) => void;
  accentColor: string;
  baseColor?: string;
  fallback: React.ReactNode;
  enableChurning?: boolean;
}

// Material state cache entry to prevent memory leaks and ensure safe restoration
interface MaterialCacheEntry {
  mesh: THREE.Mesh;
  originalMaterial: THREE.Material | THREE.Material[];
  clonedMaterial: THREE.Material | THREE.Material[];
  originalEmissive?: THREE.Color;
  originalEmissiveIntensity?: number;
}

/**
 * Inner component that actually loads and renders the GLB model.
 * Throws on failure, which is caught by GLBErrorBoundary to activate procedural fallback.
 */
const GLBOrganRenderer: React.FC<Omit<GLBOrganProps, 'fallback'>> = ({
  id,
  name,
  latinName,
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  targetSize,
  isActive,
  isSelected,
  hoveredOrgan,
  onSelect,
  setHoveredOrgan,
  accentColor,
  enableChurning = false,
}) => {
  const isHovered = hoveredOrgan === id;
  const highlight = isActive || isSelected || isHovered;
  const groupRef = useRef<THREE.Group>(null);

  // Load GLTF model via drei
  const gltf = useGLTF(modelPath);

  // Validate GLB structure
  if (!gltf || !gltf.scene) {
    throw new Error(`[GLBOrgan] Invalid GLB file at: ${modelPath}`);
  }

  // Clone scene so multiple instances or material edits do not mutate the shared cache
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Verify presence of valid meshes
    let meshCount = 0;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (meshCount === 0) {
      throw new Error(`[GLBOrgan] Model ${modelPath} contains no renderable meshes.`);
    }

    return clone;
  }, [gltf.scene, modelPath]);

  // Compute normalized bounding scale if targetSize is provided
  const normalizedScaleFactor = useMemo(() => {
    if (targetSize && targetSize > 0) {
      return calculateNormalizedScale(clonedScene, targetSize);
    }
    return 1;
  }, [clonedScene, targetSize]);

  // Combined scale vector
  const finalScale = useMemo<[number, number, number]>(() => {
    const baseScale: [number, number, number] = Array.isArray(scale)
      ? scale
      : [scale, scale, scale];

    return [
      baseScale[0] * normalizedScaleFactor,
      baseScale[1] * normalizedScaleFactor,
      baseScale[2] * normalizedScaleFactor,
    ];
  }, [scale, normalizedScaleFactor]);

  // Safe Material Isolation: Clone materials once on scene setup
  const materialEntries = useMemo<MaterialCacheEntry[]>(() => {
    const entries: MaterialCacheEntry[] = [];

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const origMat = mesh.material;

        if (Array.isArray(origMat)) {
          const clonedMats = origMat.map((m) => m.clone());
          mesh.material = clonedMats;
          entries.push({
            mesh,
            originalMaterial: origMat,
            clonedMaterial: clonedMats,
          });
        } else if (origMat) {
          const clonedMat = origMat.clone();
          mesh.material = clonedMat;

          // Record original emissive properties if standard/physical material
          const hasEmissive = 'emissive' in clonedMat;
          const origEmissive = hasEmissive
            ? (clonedMat as THREE.MeshStandardMaterial).emissive.clone()
            : undefined;
          const origIntensity = hasEmissive
            ? (clonedMat as THREE.MeshStandardMaterial).emissiveIntensity
            : undefined;

          entries.push({
            mesh,
            originalMaterial: origMat,
            clonedMaterial: clonedMat,
            originalEmissive: origEmissive,
            originalEmissiveIntensity: origIntensity,
          });
        }
      }
    });

    return entries;
  }, [clonedScene]);

  // Update highlight state without allocating memory per frame
  useEffect(() => {
    const accentCol = new THREE.Color(accentColor);

    materialEntries.forEach((entry) => {
      const mats = Array.isArray(entry.clonedMaterial)
        ? entry.clonedMaterial
        : [entry.clonedMaterial];

      mats.forEach((mat) => {
        if ('emissive' in mat && 'emissiveIntensity' in mat) {
          const stdMat = mat as THREE.MeshStandardMaterial;

          if (isActive) {
            // Active stage: slight bright emissive with stage accent
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.38;
          } else if (isSelected) {
            // Selected: distinct but natural highlight
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.26;
          } else if (isHovered) {
            // Hovered: subtle highlight
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.16;
          } else {
            // Normal: restore original material settings
            if (entry.originalEmissive) {
              stdMat.emissive.copy(entry.originalEmissive);
            } else {
              stdMat.emissive.setRGB(0, 0, 0);
            }
            stdMat.emissiveIntensity = entry.originalEmissiveIntensity ?? 0;
          }
        }
      });
    });
  }, [materialEntries, isActive, isSelected, isHovered, accentColor]);

  // Subtle natural mechanical motion (e.g. stomach churning) without mesh deformation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (enableChurning && (isActive || isSelected)) {
      const t = clock.getElapsedTime();
      const churn = Math.sin(t * 3.2) * 0.025;
      groupRef.current.scale.set(
        finalScale[0] * (1 + churn),
        finalScale[1] * (1 - churn * 0.6),
        finalScale[2] * (1 + churn * 0.5)
      );
      groupRef.current.rotation.z = rotation[2] + Math.sin(t * 2.5) * 0.015;
    } else {
      groupRef.current.scale.set(finalScale[0], finalScale[1], finalScale[2]);
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={finalScale}
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
      <primitive object={clonedScene} />

      {/* Debug mode: bounding box & axes */}
      {SHOW_MODEL_BOUNDS && (
        <>
          <axesHelper args={[0.35]} />
          <mesh>
            <boxGeometry args={[targetSize || 0.8, targetSize || 0.8, targetSize || 0.8]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* 3D Floating Tag Label */}
      {(isHovered || isSelected || isActive) && (
        <Html position={[0, (targetSize || 0.8) * 0.55, 0.08]} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-slate-100 border border-cyan-500/60 shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span>{name}</span>
            {latinName && (
              <span className="text-slate-400 font-normal text-[11px]">
                ({latinName})
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Robust Error Boundary to catch any GLTF fetch/parse errors
 * and immediately fallback to procedural rendering without crashing React Three Fiber.
 */
interface GLBErrorBoundaryProps {
  fallback: React.ReactNode;
  organId: string;
  children?: React.ReactNode;
}

interface GLBErrorBoundaryState {
  hasError: boolean;
}

class GLBErrorBoundary extends React.Component<
  GLBErrorBoundaryProps,
  GLBErrorBoundaryState
> {
  constructor(props: GLBErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Gracefully inform about procedural fallback activation
    console.info(
      `[GLBOrgan] Model for "${this.props.organId}" not available. Using procedural 3D organ representation.`
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Main GLBOrgan Export:
 * Wraps GLB loading in both ErrorBoundary and Suspense.
 * If model is available, displays realistic GLB model.
 * If missing or loading, seamlessly displays the existing procedural model.
 */
export const GLBOrgan: React.FC<GLBOrganProps> = (props) => {
  const { fallback, id, ...rendererProps } = props;

  return (
    <GLBErrorBoundary fallback={fallback} organId={id}>
      <React.Suspense fallback={fallback}>
        <GLBOrganRenderer id={id} {...rendererProps} />
      </React.Suspense>
    </GLBErrorBoundary>
  );
};
