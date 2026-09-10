import * as THREE from 'three';
import { DigestiveStageId } from '../types';

/**
 * Anatomical 3D Food Pathway Segments.
 * Mapped to anatomical lumen coordinates compatible with standard torso proportions.
 */

// 1. Mouth (Cavum Oris) & Oral Pharynx
export const MOUTH_PATH_POINTS: [number, number, number][] = [
  [0.0, 3.42, 0.34],   // Front lips & incisors
  [0.0, 3.36, 0.18],   // Oral cavity center (above tongue)
  [0.0, 3.25, 0.04],   // Oropharynx
  [0.0, 2.98, -0.04],  // Epiglottis / Laryngopharynx junction
];

// 2. Esophagus (Esofagus)
export const ESOPHAGUS_PATH_POINTS: [number, number, number][] = [
  [0.0, 2.7, -0.05],   // Cervical esophagus
  [0.01, 2.2, -0.05],  // Upper thoracic esophagus
  [0.0, 1.7, -0.04],   // Mid thoracic esophagus
  [-0.04, 1.2, -0.02], // Lower thoracic esophagus (leaning slightly left)
  [-0.14, 0.72, 0.05], // Lower esophageal sphincter / Cardia entrance
];

// 3. Stomach (Ventrikulus / J-Shape)
export const STOMACH_PATH_POINTS: [number, number, number][] = [
  [-0.22, 0.65, 0.1],  // Cardia / Upper dome
  [-0.44, 0.42, 0.15], // Fundus to upper body
  [-0.56, 0.12, 0.18], // Greater curvature apex (left body)
  [-0.46, -0.16, 0.16],// Lower body / Angular incisure
  [-0.22, -0.28, 0.12],// Pyloric antrum sweeping right
  [-0.04, -0.32, 0.1], // Pyloric sphincter
];

// 4. Duodenum (C-Loop surrounding Pancreas head)
export const DUODENUM_PATH_POINTS: [number, number, number][] = [
  [0.15, -0.34, 0.12], // Superior duodenal flexure
  [0.32, -0.48, 0.14], // Descending duodenum (ampulla of Vater)
  [0.22, -0.66, 0.16], // Horizontal / inferior duodenal flexure
  [-0.06, -0.7, 0.18], // Ascending duodenum / Duodenojejunal flexure
];

// 5. Small Intestine (Jejunum & Ileum Coils)
export const SMALL_INTESTINE_PATH_POINTS: [number, number, number][] = [
  [-0.32, -0.84, 0.22], // Jejunum upper left
  [-0.12, -1.02, 0.25], // Jejunum center
  [0.22, -0.96, 0.25],  // Jejunum right loop
  [0.34, -1.18, 0.22],  // Mid intestine
  [0.06, -1.35, 0.24],  // Ileum anterior coil
  [-0.24, -1.45, 0.22], // Ileum lower left coil
  [0.1, -1.6, 0.2],     // Lower midline loop
  [0.52, -1.72, 0.16],  // Terminal ileum approaching ileocecal valve
];

// 6. Large Intestine (Kolon framing periphery)
export const LARGE_INTESTINE_PATH_POINTS: [number, number, number][] = [
  [0.7, -1.78, 0.14],   // Cecum & appendix region (Right lower quadrant)
  [0.75, -1.4, 0.11],   // Ascending colon lower
  [0.77, -0.95, 0.08],  // Ascending colon upper
  [0.72, -0.55, 0.08],  // Hepatic flexure (Right colic flexure)
  [0.36, -0.5, 0.12],   // Transverse colon right
  [0.0, -0.55, 0.14],   // Transverse colon center
  [-0.38, -0.5, 0.12],  // Transverse colon left
  [-0.72, -0.55, 0.08], // Splenic flexure (Left colic flexure)
  [-0.75, -0.95, 0.08], // Descending colon upper
  [-0.72, -1.4, 0.1],   // Descending colon lower
  [-0.62, -1.75, 0.11], // Iliac colon
  [-0.36, -1.96, 0.07], // Sigmoid colon loop
  [-0.12, -2.08, 0.04], // Sigmoid curve returning to midline
  [0.0, -2.25, 0.02],   // Rectosigmoid junction
];

// 7. Rectum & Anal Canal
export const RECTUM_PATH_POINTS: [number, number, number][] = [
  [0.0, -2.45, -0.01],  // Upper rectum
  [0.0, -2.72, -0.02],  // Rectal ampulla
  [0.0, -3.05, 0.0],    // Anal canal & external sphincter
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
