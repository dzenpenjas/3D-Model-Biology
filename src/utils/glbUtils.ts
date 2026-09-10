import * as THREE from 'three';
import { OrganId } from '../types';

/**
 * Development helper: prints the complete GLTF node, mesh, and material hierarchy.
 * Helps developers inspect exact node names of imported GLB files.
 */
export function printGLBHierarchy(scene: THREE.Object3D): void {
  console.groupCollapsed('🔍 [GLB Hierarchy Inspector] Scanning scene tree...');

  let nodeCount = 0;
  let meshCount = 0;

  function traverseNode(node: THREE.Object3D, depth: number) {
    nodeCount++;
    const indent = '  '.repeat(depth);
    const isMesh = (node as THREE.Mesh).isMesh;

    if (isMesh) {
      meshCount++;
      const mesh = node as THREE.Mesh;
      const matNames = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.name || 'unnamed').join(', ')
        : mesh.material?.name || 'unnamed';

      const polyCount = mesh.geometry
        ? mesh.geometry.index
          ? mesh.geometry.index.count / 3
          : mesh.geometry.attributes.position?.count / 3 || 0
        : 0;

      console.log(
        `${indent}📦 [Mesh] "${mesh.name || 'unnamed'}" (type: ${node.type}) | Mat: "${matNames}" | Tris: ${Math.round(polyCount)}`
      );
    } else {
      console.log(`${indent}📁 [Node] "${node.name || 'unnamed'}" (type: ${node.type})`);
    }

    for (const child of node.children) {
      traverseNode(child, depth + 1);
    }
  }

  traverseNode(scene, 0);
  console.log(`Total nodes: ${nodeCount}, Meshes: ${meshCount}`);
  console.groupEnd();
}

/**
 * Resolves which OrganId an object belongs to by inspecting:
 * 1. mesh.name
 * 2. parent.name
 * 3. ancestor names up to the scene root
 */
export function resolveOrganFromMesh(
  object: THREE.Object3D,
  mapping: Record<string, string[]>
): OrganId | null {
  // Collect all relevant names from this node up to its ancestors
  const candidateNames: string[] = [];
  let curr: THREE.Object3D | null = object;

  while (curr && curr.type !== 'Scene') {
    if (curr.name && curr.name.trim().length > 0) {
      candidateNames.push(curr.name.toLowerCase());
    }
    curr = curr.parent;
  }

  // Also inspect material name if available on mesh
  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => {
        if (m.name) candidateNames.push(m.name.toLowerCase());
      });
    } else if (mesh.material?.name) {
      candidateNames.push(mesh.material.name.toLowerCase());
    }
  }

  // Match against mapping definitions
  for (const [organKey, patterns] of Object.entries(mapping)) {
    for (const pattern of patterns) {
      const lowerPattern = pattern.toLowerCase();
      for (const name of candidateNames) {
        if (name.includes(lowerPattern) || lowerPattern.includes(name)) {
          return organKey as OrganId;
        }
      }
    }
  }

  return null;
}

/**
 * Computes bounding box, target normalization scale, and center offset for an imported model.
 */
export function calculateModelNormalization(
  object: THREE.Object3D,
  targetHeight: number = 5.5
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
