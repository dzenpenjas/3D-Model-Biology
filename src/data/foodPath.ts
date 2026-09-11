import * as THREE from 'three';
import { DigestiveStageId } from '../types';

/**
 * Anatomical 3D Food Pathway Segments.
 * Mapped to anatomical lumen coordinates compatible with standard torso proportions.
 */

// 1. Mouth (Cavum Oris) & Oral Pharynx
export const MOUTH_PATH_POINTS: [number, number, number][] = [
  [0.0, 2.45, 0.28],   // Front lips & incisors
  [0.0, 2.32, 0.15],   // Oral cavity center (above tongue)
  [0.0, 2.10, 0.02],   // Oropharynx
  [-0.02, 1.85, -0.15], // Epiglottis / Laryngopharynx junction
];

// 2. Esophagus (Esofagus)
export const ESOPHAGUS_PATH_POINTS: [number, number, number][] = [
  [-0.03, 1.62, -0.26], // Cervical esophagus
  [-0.04, 1.35, -0.28], // Mid thoracic esophagus
  [-0.08, 0.98, -0.18], // Lower thoracic esophagus (leaning slightly left)
  [-0.16, 0.68, 0.02],  // Lower esophageal sphincter / Cardia entrance
];

// 3. Stomach (Ventrikulus / J-Shape)
export const STOMACH_PATH_POINTS: [number, number, number][] = [
  [-0.32, 0.62, 0.12], // Cardia / Fundus dome
  [-0.50, 0.45, 0.18], // Greater curvature apex
  [-0.46, 0.26, 0.18], // Lower body
  [-0.28, 0.18, 0.14], // Pyloric antrum sweeping right
  [-0.10, 0.14, 0.08], // Pyloric sphincter
];

// 4. Duodenum (C-Loop surrounding Pancreas head)
export const DUODENUM_PATH_POINTS: [number, number, number][] = [
  [0.06, 0.10, 0.10],  // Superior duodenal flexure
  [0.18, -0.02, 0.14], // Descending duodenum
  [0.12, -0.18, 0.16], // Horizontal duodenal flexure
  [-0.02, -0.24, 0.18], // Duodenojejunal flexure
];

// 5. Small Intestine (Jejunum & Ileum Coils)
export const SMALL_INTESTINE_PATH_POINTS: [number, number, number][] = [
  [-0.20, -0.34, 0.20], // Jejunum upper left
  [-0.06, -0.46, 0.22], // Jejunum center
  [0.18, -0.42, 0.20],  // Jejunum right loop
  [0.22, -0.58, 0.18],  // Mid intestine
  [0.04, -0.68, 0.20],  // Ileum anterior coil
  [-0.18, -0.76, 0.18], // Ileum lower left coil
  [0.12, -0.84, 0.16],  // Lower midline loop
  [0.42, -0.90, 0.14],  // Terminal ileum approaching ileocecal valve
];

// 6. Large Intestine (Kolon framing periphery)
export const LARGE_INTESTINE_PATH_POINTS: [number, number, number][] = [
  [0.54, -0.92, 0.12],  // Cecum & appendix region (Right lower)
  [0.58, -0.64, 0.10],  // Ascending colon lower
  [0.56, -0.34, 0.08],  // Ascending colon upper
  [0.48, -0.12, 0.08],  // Hepatic flexure (Right colic flexure)
  [0.22, -0.10, 0.14],  // Transverse colon right
  [-0.04, -0.12, 0.16], // Transverse colon center
  [-0.30, -0.10, 0.14], // Transverse colon left
  [-0.50, -0.14, 0.08], // Splenic flexure (Left colic flexure)
  [-0.56, -0.42, 0.08], // Descending colon upper
  [-0.54, -0.72, 0.10], // Descending colon lower
  [-0.42, -0.98, 0.08], // Sigmoid colon loop
  [-0.18, -1.16, 0.02], // Sigmoid curve returning to midline
  [0.0, -1.32, -0.02],  // Rectosigmoid junction
];

// 7. Rectum & Anal Canal
export const RECTUM_PATH_POINTS: [number, number, number][] = [
  [0.0, -1.50, -0.04],  // Upper rectum
  [0.0, -1.72, -0.06],  // Rectal ampulla
  [0.0, -1.95, -0.08],  // Anal canal & external sphincter
];

// Complete combined points across the continuous lumen
export const ALL_DIGESTIVE_PATH_POINTS: [number, number, number][] = [
  ...MOUTH_PATH_POINTS,
  ...ESOPHAGUS_PATH_POINTS,
  ...STOMACH_PATH_POINTS,
  ...DUODENUM_PATH_POINTS,
  ...SMALL_INTESTINE_PATH_POINTS,
  ...LARGE_INTESTINE_PATH_POINTS,
  ...RECTUM_PATH_POINTS,
];

// CatmullRomCurve3 interpolation along full tract
export const digestiveFoodCurve = new THREE.CatmullRomCurve3(
  ALL_DIGESTIVE_PATH_POINTS.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
  false,
  'centripetal',
  0.5
);

/**
 * Returns stage ID for normalized 0..1 progress
 */
export function getStageFromProgress(progress: number): DigestiveStageId {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.12) return 'mouth';
  if (p < 0.28) return 'esophagus';
  if (p < 0.48) return 'stomach';
  if (p < 0.74) return 'smallIntestine';
  if (p < 0.92) return 'largeIntestine';
  return 'rectum';
}
