/**
 * Central configuration for the 3D Digestive System GLB Model.
 * Handles unified model positioning, rotation, scale normalization,
 * and development debug visualizers.
 */

export const DIGESTIVE_MODEL_CONFIG = {
  // Primary unified digestive system model path
  path: '/models/digestive-system.glb',

  // Coordinate adjustments (X, Y, Z)
  position: [0, -0.1, 0] as [number, number, number],

  // Rotation adjustments in radians (X, Y, Z)
  rotation: [0, 0, 0] as [number, number, number],

  // Manual scale multiplier applied after automatic height normalization
  scale: 1.0,

  // Target bounding height in Three.js world units
  targetHeight: 5.6,
};

// Toggle to display the 3D food pathway track curve in the scene
export const SHOW_FOOD_PATH = false;

// Toggle to visualize organ bounding boxes for debugging camera focus and mapping
export const SHOW_ORGAN_BOUNDS = false;

// Toggle semi-transparent anatomical body silhouette
export const SHOW_BODY_OUTLINE = true;

// Development flag: logs node hierarchy of loaded GLB model
export const DEBUG_PRINT_GLB_HIERARCHY = process.env.NODE_ENV !== 'production';
