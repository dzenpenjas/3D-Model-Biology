import * as THREE from 'three';
import { OrganId } from '../types';

export interface OrganModelTransform {
  id: OrganId;
  enabled: boolean;
  path: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  targetSize?: number; // Target maximum dimension for optional auto-normalization
  enableChurning?: boolean; // Subtle organ dynamic motion (e.g. stomach)
  customEmissiveIntensity?: number;
}

// Development debug mode: show bounding boxes and axes
export const SHOW_MODEL_BOUNDS = false;

// Centralized organ 3D model transforms and configurations
export const ORGAN_MODEL_CONFIGS: Partial<Record<OrganId, OrganModelTransform>> = {
  stomach: {
    id: 'stomach',
    enabled: true,
    path: '/models/stomach.glb',
    position: [-0.3, 0.08, 0.12],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    targetSize: 0.82,
    enableChurning: true,
    customEmissiveIntensity: 0.35,
  },
  liver: {
    id: 'liver',
    enabled: true,
    path: '/models/liver.glb',
    position: [0.55, 0.42, 0.15],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    targetSize: 0.9,
    customEmissiveIntensity: 0.35,
  },
  pancreas: {
    id: 'pancreas',
    enabled: true,
    path: '/models/pancreas.glb',
    position: [-0.05, -0.25, 0.02],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    targetSize: 0.58,
    customEmissiveIntensity: 0.35,
  },
  smallIntestine: {
    id: 'smallIntestine',
    enabled: true,
    path: '/models/small-intestine.glb',
    position: [0.02, -1.15, 0.18],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    targetSize: 1.05,
    customEmissiveIntensity: 0.35,
  },
  largeIntestine: {
    id: 'largeIntestine',
    enabled: true,
    path: '/models/large-intestine.glb',
    position: [0.0, -1.15, 0.1],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    targetSize: 1.5,
    customEmissiveIntensity: 0.35,
  },
};

/**
 * Calculates normalized scale factor for a 3D model so its largest dimension
 * matches the desired anatomical target size.
 */
export function calculateNormalizedScale(
  object: THREE.Object3D,
  targetSize: number
): number {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension <= 0.0001) return 1;

  return targetSize / maxDimension;
}
