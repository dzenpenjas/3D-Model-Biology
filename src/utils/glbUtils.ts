import * as THREE from 'three';
import { OrganId } from '../types';

/**
 * Development helper: prints the complete GLTF node, mesh, and material hierarchy.
 * Helps developers inspect exact node names of imported GLB files.
 */
export function printGLBHierarchy(scene: THREE.Object3D): void {
  if (!import.meta.env.DEV) return;
  console.groupCollapsed('🔍 [GLB Hierarchy Inspector] Scanning scene tree...');

  let totalNodes = 0;
  let totalMeshes = 0;
  let totalTriangles = 0;

  scene.traverse((object) => {
    totalNodes++;
    if ((object as THREE.Mesh).isMesh) {
      totalMeshes++;
      const mesh = object as THREE.Mesh;
      const matNames = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.name || 'unnamed').join(', ')
        : mesh.material?.name || 'unnamed';

      const polyCount = mesh.geometry
        ? mesh.geometry.index
          ? mesh.geometry.index.count / 3
          : (mesh.geometry.attributes.position?.count || 0) / 3
        : 0;

      totalTriangles += polyCount;

      console.log({
        mesh: mesh.name || 'unnamed',
        parent: mesh.parent?.name || 'none',
        material: matNames,
        type: mesh.type,
        triangles: Math.round(polyCount),
      });
    } else {
      console.log({
        node: object.name || 'unnamed',
        parent: object.parent?.name || 'none',
        type: object.type,
      });
    }
  });

  console.log(
    `Total nodes: ${totalNodes}, Total meshes: ${totalMeshes}, Approx triangles: ${Math.round(totalTriangles)}`
  );
  console.groupEnd();
}

/**
 * Normalizes a string by stripping punctuation, underscores, dashes, spaces, and lowercase.
 */
function normalizeIdentifier(str: string): string {
  return str.toLowerCase().replace(/[-_\s]+/g, '');
}

/**
 * 5-Tier Matching Algorithm:
 * Resolves which OrganId an object belongs to:
 * 1. Exact mesh name
 * 2. Exact parent name
 * 3. Exact ancestor name
 * 4. Normalized name (no underscores/hyphens/spaces)
 * 5. Controlled aliases
 */
export function resolveOrganFromMesh(
  object: THREE.Object3D,
  mapping: Record<string, string[]>
): OrganId | null {
  const meshName = object.name?.trim() || '';
  const parentName = object.parent?.name?.trim() || '';

  // Collect ancestors (excluding Scene)
  const ancestorNames: string[] = [];
  let curr: THREE.Object3D | null = object.parent?.parent || null;
  while (curr && curr.type !== 'Scene') {
    if (curr.name && curr.name.trim().length > 0) {
      ancestorNames.push(curr.name.trim());
    }
    curr = curr.parent;
  }

  // Also extract material names if this is a mesh
  const matNames: string[] = [];
  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => {
        if (m.name) matNames.push(m.name.trim());
      });
    } else if (mesh.material?.name) {
      matNames.push(mesh.material.name.trim());
    }
  }

  // Tier 1: Exact mesh name match
  if (meshName.length > 0) {
    for (const [organKey, patterns] of Object.entries(mapping)) {
      for (const pattern of patterns) {
        if (meshName.toLowerCase() === pattern.toLowerCase()) {
          return organKey as OrganId;
        }
      }
    }
  }

  // Tier 2: Exact parent name match
  if (parentName.length > 0) {
    for (const [organKey, patterns] of Object.entries(mapping)) {
      for (const pattern of patterns) {
        if (parentName.toLowerCase() === pattern.toLowerCase()) {
          return organKey as OrganId;
        }
      }
    }
  }

  // Tier 3: Exact ancestor name match
  for (const anc of ancestorNames) {
    for (const [organKey, patterns] of Object.entries(mapping)) {
      for (const pattern of patterns) {
        if (anc.toLowerCase() === pattern.toLowerCase()) {
          return organKey as OrganId;
        }
      }
    }
  }

  // Tier 4: Normalized name match (removes _, -, spaces, case)
  const normMesh = normalizeIdentifier(meshName);
  const normParent = normalizeIdentifier(parentName);
  for (const [organKey, patterns] of Object.entries(mapping)) {
    for (const pattern of patterns) {
      const normPat = normalizeIdentifier(pattern);
      if (normPat.length >= 3) {
        if (normMesh === normPat || normParent === normPat) {
          return organKey as OrganId;
        }
      }
    }
  }

  // Tier 5: Controlled substring / alias search on mesh & material
  const searchCandidates = [meshName, parentName, ...ancestorNames, ...matNames];
  for (const candidate of searchCandidates) {
    const normCand = normalizeIdentifier(candidate);
    for (const [organKey, patterns] of Object.entries(mapping)) {
      for (const pattern of patterns) {
        const normPat = normalizeIdentifier(pattern);
        if (normPat.length >= 4 && normCand.includes(normPat)) {
          return organKey as OrganId;
        }
      }
    }
  }

  return null;
}

/**
 * Development Audit Reporter:
 * Logs formatted status of mapped organs in console.
 */
export function printOrganAuditReport(foundMap: Map<OrganId, string[]>): void {
  if (!import.meta.env.DEV) return;

  const requiredOrgans: OrganId[] = [
    'mouth',
    'esophagus',
    'stomach',
    'liver',
    'pancreas',
    'gallbladder',
    'smallIntestine',
    'largeIntestine',
    'rectum',
  ];

  console.group('📋 [GLB ORGAN AUDIT]');
  requiredOrgans.forEach((organ) => {
    const matches = foundMap.get(organ);
    if (matches && matches.length > 0) {
      console.log(`%c${organ}: FOUND`, 'color: #10b981; font-weight: bold;');
      matches.forEach((nodeName) => {
        console.log(`  - ${nodeName}`);
      });
    } else {
      console.log(`%c${organ}: MISSING (Using calibrated spatial bounds)`, 'color: #f59e0b;');
    }
  });
  console.groupEnd();
}

/**
 * Computes bounding box, target normalization scale, and center offset for an imported model.
 */
export function calculateModelNormalization(
  object: THREE.Object3D,
  targetHeight: number = 5.6
): {
  scale: number;
  centerOffset: THREE.Vector3;
  box: THREE.Box3;
  size: THREE.Vector3;
} {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const center = new THREE.Vector3();
  box.getCenter(center);

  // Normalization scale factor
  const currentHeight = size.y > 0.001 ? size.y : 1;
  const scale = targetHeight / currentHeight;

  // Offset to center model at origin (0, 0, 0)
  const centerOffset = new THREE.Vector3(-center.x, -center.y, -center.z);

  return { scale, centerOffset, box, size };
}

/**
 * Computes bounding boxes for each mapped organ in world/scene coordinates.
 */
export function computeOrganBoundingBoxes(
  meshOrganMap: Map<THREE.Mesh, OrganId>
): Map<OrganId, THREE.Box3> {
  const organBoxes = new Map<OrganId, THREE.Box3>();

  meshOrganMap.forEach((organId, mesh) => {
    mesh.updateWorldMatrix(true, false);
    const meshBox = new THREE.Box3().setFromObject(mesh);

    if (organBoxes.has(organId)) {
      organBoxes.get(organId)!.union(meshBox);
    } else {
      organBoxes.set(organId, meshBox.clone());
    }
  });

  return organBoxes;
}

/**
 * Calibrated anatomical spatial region bounding boxes.
 * Used when a model is provided as a unified mesh (such as the Sketchfab CC BY 4.0 model)
 * to ensure camera focus, raycast selection, and 3D labels work with millimeter precision.
 */
export function getAnatomicalSpatialBounds(): Map<OrganId, THREE.Box3> {
  const bounds = new Map<OrganId, THREE.Box3>();

  const regions: Record<OrganId, { center: [number, number, number]; size: [number, number, number] }> = {
    mouth: { center: [0.0, 2.33, 0.1], size: [0.4, 0.95, 0.65] },
    esophagus: { center: [-0.04, 1.36, -0.28], size: [0.35, 1.0, 0.35] },
    stomach: { center: [-0.35, 0.49, 0.14], size: [0.95, 0.7, 0.9] },
    liver: { center: [0.38, 0.28, 0.28], size: [0.65, 0.45, 0.55] },
    gallbladder: { center: [0.15, 0.25, 0.32], size: [0.35, 0.3, 0.45] },
    pancreas: { center: [-0.02, 0.45, -0.15], size: [0.45, 0.35, 0.35] },
    smallIntestine: { center: [0.0, -0.55, 0.12], size: [1.3, 1.2, 0.9] },
    largeIntestine: { center: [-0.05, -0.52, 0.14], size: [1.75, 1.35, 0.95] },
    rectum: { center: [0.0, -1.8, -0.08], size: [0.6, 1.1, 0.6] },
  };

  for (const [id, def] of Object.entries(regions)) {
    const halfX = def.size[0] / 2;
    const halfY = def.size[1] / 2;
    const halfZ = def.size[2] / 2;
    const min = new THREE.Vector3(def.center[0] - halfX, def.center[1] - halfY, def.center[2] - halfZ);
    const max = new THREE.Vector3(def.center[0] + halfX, def.center[1] + halfY, def.center[2] + halfZ);
    bounds.set(id as OrganId, new THREE.Box3(min, max));
  }

  return bounds;
}

/**
 * Resolves which organ an arbitrary 3D point corresponds to along the normalized anatomical tract.
 */
export function resolveOrganFromPoint(point: THREE.Vector3): OrganId {
  if (point.y > 1.85) return 'mouth';
  if (point.y > 0.85) return 'esophagus';
  if (point.y > 0.1) {
    if (point.x < -0.12) return 'stomach';
    if (point.x > 0.15) return 'liver';
    if (point.z < -0.05) return 'pancreas';
    if (point.z > 0.18) return 'gallbladder';
    return 'stomach';
  }
  if (point.y > -1.25) {
    if (Math.abs(point.x) > 0.62 || point.y > 0.0) return 'largeIntestine';
    return 'smallIntestine';
  }
  return 'rectum';
}

