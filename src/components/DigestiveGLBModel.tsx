import React, { useMemo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGLTF, Html } from '@react-three/drei';
import { OrganId, DigestiveStageId } from '../types';
import {
  DIGESTIVE_MODEL_CONFIG,
  SHOW_ORGAN_BOUNDS,
  DEBUG_PRINT_GLB_HIERARCHY,
} from '../data/digestiveModelConfig';
import { GLB_ORGAN_MAPPING } from '../data/glbOrganMapping';
import { DIGESTIVE_STEPS, ACCESSORY_ORGANS } from '../data/digestiveSteps';
import {
  printGLBHierarchy,
  printOrganAuditReport,
  resolveOrganFromMesh,
  resolveOrganFromPoint,
  calculateModelNormalization,
  computeOrganBoundingBoxes,
  getAnatomicalSpatialBounds,
} from '../utils/glbUtils';

export interface DigestiveGLBModelProps {
  activeStageId: DigestiveStageId;
  selectedOrganId: OrganId;
  hoveredOrgan: OrganId | null;
  onSelectOrgan: (id: OrganId) => void;
  setHoveredOrgan: (id: OrganId | null) => void;
  onOrganBoundsReady?: (
    organBounds: Map<OrganId, THREE.Box3>,
    fullModelBounds: THREE.Box3
  ) => void;
}

// Material cache entry to prevent memory leaks and ensure safe non-destructive highlights
interface GLBMaterialCache {
  mesh: THREE.Mesh;
  organId: OrganId | null;
  clonedMaterial: THREE.Material | THREE.Material[];
  originalEmissive?: THREE.Color;
  originalEmissiveIntensity?: number;
  originalRoughness?: number;
}

/**
 * Inner loader and renderer for the unified digestive system GLB model.
 */
const DigestiveGLBRenderer: React.FC<DigestiveGLBModelProps> = ({
  activeStageId,
  selectedOrganId,
  hoveredOrgan,
  onSelectOrgan,
  setHoveredOrgan,
  onOrganBoundsReady,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeLabelPos, setActiveLabelPos] = useState<THREE.Vector3 | null>(null);

  // Load GLTF binary asset
  const gltf = useGLTF(DIGESTIVE_MODEL_CONFIG.path);

  if (!gltf || !gltf.scene) {
    throw new Error(`Invalid GLB at ${DIGESTIVE_MODEL_CONFIG.path}`);
  }

  // 1. Deep clone the scene to preserve original cached asset
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    if (DEBUG_PRINT_GLB_HIERARCHY) {
      printGLBHierarchy(clone);
    }
    return clone;
  }, [gltf.scene]);

  // 2. Normalization & Placement Calculations
  const { normalizedScale, centerOffset, fullBounds } = useMemo(() => {
    const { scale, centerOffset, box } = calculateModelNormalization(
      clonedScene,
      DIGESTIVE_MODEL_CONFIG.targetHeight
    );
    const finalScale = scale * DIGESTIVE_MODEL_CONFIG.scale;
    return {
      normalizedScale: finalScale,
      centerOffset,
      fullBounds: box,
    };
  }, [clonedScene]);

  // 3. Mesh-to-Organ Mapping and Material Isolation
  const { meshOrganMap, materialCache, organBounds } = useMemo(() => {
    const map = new Map<THREE.Mesh, OrganId>();
    const cache: GLBMaterialCache[] = [];
    const foundMap = new Map<OrganId, string[]>();

    // Traverse and map meshes
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const resolvedOrgan = resolveOrganFromMesh(mesh, GLB_ORGAN_MAPPING);
        if (resolvedOrgan) {
          map.set(mesh, resolvedOrgan);
          const list = foundMap.get(resolvedOrgan) || [];
          list.push(mesh.name || 'unnamed');
          foundMap.set(resolvedOrgan, list);
        }

        // Clone material once to avoid shared global mutation
        const origMat = mesh.material;
        if (Array.isArray(origMat)) {
          const clonedMats = origMat.map((m) => m.clone());
          mesh.material = clonedMats;
          cache.push({
            mesh,
            organId: resolvedOrgan,
            clonedMaterial: clonedMats,
          });
        } else if (origMat) {
          const clonedMat = origMat.clone();
          mesh.material = clonedMat;

          const hasEmissive = 'emissive' in clonedMat;
          const origEmissive = hasEmissive
            ? (clonedMat as THREE.MeshStandardMaterial).emissive.clone()
            : undefined;
          const origIntensity = hasEmissive
            ? (clonedMat as THREE.MeshStandardMaterial).emissiveIntensity
            : undefined;
          const origRoughness = 'roughness' in clonedMat
            ? (clonedMat as THREE.MeshStandardMaterial).roughness
            : undefined;

          cache.push({
            mesh,
            organId: resolvedOrgan,
            clonedMaterial: clonedMat,
            originalEmissive: origEmissive,
            originalEmissiveIntensity: origIntensity,
            originalRoughness: origRoughness,
          });
        }
      }
    });

    // Compute bounding boxes for each resolved organ
    const bounds = computeOrganBoundingBoxes(map);

    // If certain organs are missing from individual mesh nodes (e.g. unified single-mesh model),
    // augment with calibrated spatial anatomical bounds so all organs have millimeter-accurate framing
    const spatialBounds = getAnatomicalSpatialBounds();
    spatialBounds.forEach((box, organId) => {
      if (!bounds.has(organId)) {
        bounds.set(organId, box);
      }
    });

    // Print development organ audit report
    printOrganAuditReport(foundMap);

    return {
      meshOrganMap: map,
      materialCache: cache,
      organBounds: bounds,
    };
  }, [clonedScene]);

  // Inform parent of calculated 3D bounds for precision camera navigation
  useEffect(() => {
    if (onOrganBoundsReady && organBounds.size > 0) {
      onOrganBoundsReady(organBounds, fullBounds);
    }
  }, [organBounds, fullBounds, onOrganBoundsReady]);

  // Update label position when selected or hovered organ changes
  useEffect(() => {
    const targetOrgan = hoveredOrgan || selectedOrganId;
    if (targetOrgan && organBounds.has(targetOrgan)) {
      const box = organBounds.get(targetOrgan)!;
      const center = new THREE.Vector3();
      box.getCenter(center);
      center.y += 0.22; // Float slightly above center
      setActiveLabelPos(center);
    } else {
      setActiveLabelPos(null);
    }
  }, [hoveredOrgan, selectedOrganId, organBounds]);

  // 4. Safe Non-Destructive Material Highlight Updates
  useEffect(() => {
    materialCache.forEach((entry) => {
      const { organId, clonedMaterial, originalEmissive, originalEmissiveIntensity } = entry;
      const mats = Array.isArray(clonedMaterial) ? clonedMaterial : [clonedMaterial];

      const isMeshActive = organId === activeStageId;
      const isMeshSelected = organId === selectedOrganId;
      const isMeshHovered = organId === hoveredOrgan;

      // Determine accent color from step or accessory organ definition
      let accentColor = '#38bdf8';
      const step = DIGESTIVE_STEPS.find((s) => s.id === organId);
      if (step) {
        accentColor = step.accentColor;
      } else {
        const acc = ACCESSORY_ORGANS.find((a) => a.id === organId);
        if (acc) accentColor = acc.color;
      }

      const accentCol = new THREE.Color(accentColor);

      mats.forEach((mat) => {
        if ('emissive' in mat && 'emissiveIntensity' in mat) {
          const stdMat = mat as THREE.MeshStandardMaterial;

          if (isMeshActive) {
            // Active stage: slight bright emissive with stage accent
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.36;
          } else if (isMeshSelected) {
            // Selected: distinct highlight
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.28;
          } else if (isMeshHovered) {
            // Hovered: very subtle highlight
            stdMat.emissive.copy(accentCol);
            stdMat.emissiveIntensity = 0.16;
          } else {
            // Normal: restore original material settings
            if (originalEmissive) {
              stdMat.emissive.copy(originalEmissive);
            } else {
              stdMat.emissive.setRGB(0, 0, 0);
            }
            stdMat.emissiveIntensity = originalEmissiveIntensity ?? 0;
          }
        }
      });
    });
  }, [materialCache, activeStageId, selectedOrganId, hoveredOrgan]);

  // Resolve organ from pointer intersection (handles both discrete meshes and continuous unified mesh)
  const getOrganFromEvent = (e: any): OrganId | null => {
    const hitObject = e.object as THREE.Mesh;
    const mapped = meshOrganMap.get(hitObject) || resolveOrganFromMesh(hitObject, GLB_ORGAN_MAPPING);
    if (mapped) return mapped;

    // Fallback: anatomical spatial region resolution from 3D intersection point
    if (e.point) {
      return resolveOrganFromPoint(e.point);
    }
    return null;
  };

  // Click handler: resolves clicked mesh or point to its corresponding organ
  const handleClick = (e: any) => {
    e.stopPropagation();
    const organ = getOrganFromEvent(e);
    if (organ) {
      onSelectOrgan(organ);
    }
  };

  // Pointer hover handlers
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const organ = getOrganFromEvent(e);
    if (organ) {
      setHoveredOrgan(organ);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    const organ = getOrganFromEvent(e);
    if (organ && organ !== hoveredOrgan) {
      setHoveredOrgan(organ);
    }
  };

  const handlePointerOut = () => {
    setHoveredOrgan(null);
    document.body.style.cursor = 'auto';
  };

  // Active or hovered organ metadata
  const currentOrganId = hoveredOrgan || selectedOrganId;
  const currentOrganMeta = useMemo(() => {
    if (!currentOrganId) return null;
    const step = DIGESTIVE_STEPS.find((s) => s.id === currentOrganId);
    if (step) return { name: step.name, latinName: step.latinName, color: step.accentColor };
    const acc = ACCESSORY_ORGANS.find((a) => a.id === currentOrganId);
    if (acc) return { name: acc.name, latinName: acc.latinName, color: acc.color };
    return null;
  }, [currentOrganId]);

  return (
    <group
      ref={groupRef}
      position={DIGESTIVE_MODEL_CONFIG.position}
      rotation={DIGESTIVE_MODEL_CONFIG.rotation}
      scale={[normalizedScale, normalizedScale, normalizedScale]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      {/* Offset to center model at origin */}
      <group position={[centerOffset.x, centerOffset.y, centerOffset.z]}>
        <primitive object={clonedScene} />

        {/* Debug: Organ bounding boxes */}
        {SHOW_ORGAN_BOUNDS &&
          Array.from(organBounds.entries()).map(([orgId, box]) => {
            const size = new THREE.Vector3();
            box.getSize(size);
            const center = new THREE.Vector3();
            box.getCenter(center);
            return (
              <group key={orgId} position={center}>
                <mesh>
                  <boxGeometry args={[size.x, size.y, size.z]} />
                  <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.4} />
                </mesh>
              </group>
            );
          })}
      </group>

      {/* Floating 3D Label Tag */}
      {currentOrganMeta && activeLabelPos && (
        <Html position={activeLabelPos} center distanceFactor={7.5}>
          <div className="pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap bg-slate-900/95 text-slate-100 border border-cyan-500/60 shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentOrganMeta.color }}
            />
            <span>{currentOrganMeta.name}</span>
            {currentOrganMeta.latinName && (
              <span className="text-slate-400 font-normal text-[11px]">
                ({currentOrganMeta.latinName})
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Robust Error Boundary to catch missing GLB or parser errors.
 * Immediately activates procedural fallback without crashing React or Three.js.
 */
interface GLBErrorBoundaryProps {
  fallback: React.ReactNode;
  children?: React.ReactNode;
}

interface GLBErrorBoundaryState {
  hasError: boolean;
}

class DigestiveGLBErrorBoundary extends React.Component<
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
    console.warn(
      'Digestive GLB model error. Reverting to procedural fallback.',
      error
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
 * Lightweight Loading Indicator displayed while GLB asset streams in.
 */
const ModelLoadingIndicator: React.FC = () => (
  <Html center distanceFactor={7.5}>
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 text-cyan-300 border border-cyan-500/40 text-xs shadow-lg backdrop-blur-md">
      <div className="w-2.5 h-2.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <span>Memuat model anatomi 3D...</span>
    </div>
  </Html>
);

/**
 * Exported Unified Digestive GLB Model Component.
 * Integrates ErrorBoundary and Suspense with seamless fallback to procedural model.
 */
export const DigestiveGLBModel: React.FC<
  DigestiveGLBModelProps & { fallback: React.ReactNode }
> = ({ fallback, ...props }) => {
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkModelAsset = async () => {
      try {
        const res = await fetch(DIGESTIVE_MODEL_CONFIG.path, { method: 'GET' });
        if (!res.ok) {
          if (isMounted) setModelAvailable(false);
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          if (isMounted) setModelAvailable(false);
          return;
        }

        // Read only the first chunk of stream to avoid duplicate full binary fetch
        const reader = res.body?.getReader();
        if (reader) {
          const { value } = await reader.read();
          await reader.cancel();

          if (!value || value.length < 4) {
            if (isMounted) setModelAvailable(false);
            return;
          }

          // Check if response is HTML error document
          const headerText = new TextDecoder().decode(value.slice(0, 32));
          if (
            headerText.startsWith('<') ||
            headerText.toLowerCase().includes('!doctype') ||
            headerText.toLowerCase().includes('html')
          ) {
            if (isMounted) setModelAvailable(false);
            return;
          }

          // Validate GLB magic ('glTF': 0x67, 0x6c, 0x54, 0x46) or glTF JSON start ('{')
          const isGLB =
            value[0] === 0x67 &&
            value[1] === 0x6c &&
            value[2] === 0x54 &&
            value[3] === 0x46;
          const isGLTF = headerText.trim().startsWith('{');

          if (isGLB || isGLTF) {
            if (isMounted) setModelAvailable(true);
          } else {
            if (isMounted) setModelAvailable(false);
          }
        } else {
          if (isMounted) setModelAvailable(true);
        }
      } catch {
        if (isMounted) setModelAvailable(false);
      }
    };

    checkModelAsset();

    return () => {
      isMounted = false;
    };
  }, []);

  if (modelAvailable === null || modelAvailable === false) {
    return <>{fallback}</>;
  }

  return (
    <DigestiveGLBErrorBoundary fallback={fallback}>
      <React.Suspense fallback={<ModelLoadingIndicator />}>
        <DigestiveGLBRenderer {...props} />
      </React.Suspense>
    </DigestiveGLBErrorBoundary>
  );
};
