import { OrganId } from '../types';

/**
 * Organ mesh & node name matching configuration.
 * Maps organ identifiers to possible node, mesh, or material names inside the GLB model.
 * Easily editable as real GLB node hierarchies are inspected.
 */
export const GLB_ORGAN_MAPPING: Record<OrganId, string[]> = {
  mouth: [
    'mouth',
    'oral',
    'cavum_oris',
    'pharynx',
    'teeth',
    'tongue',
    'mandible',
    'skull_lower',
  ],

  esophagus: [
    'esophagus',
    'oesophagus',
    'gullet',
    'kerongkongan',
    'esophageal',
  ],

  stomach: [
    'stomach',
    'gaster',
    'ventriculus',
    'lambung',
    'gastric',
    'fundus',
    'pylorus',
  ],

  liver: [
    'liver',
    'hepar',
    'hati',
    'hepatic',
  ],

  gallbladder: [
    'gallbladder',
    'gall_bladder',
    'vesica_fellea',
    'vesica',
    'empedu',
    'bile',
  ],

  pancreas: [
    'pancreas',
    'pankreas',
    'pancreatic',
  ],

  smallIntestine: [
    'small_intestine',
    'smallintestine',
    'small_bowel',
    'duodenum',
    'jejunum',
    'ileum',
    'intestinum_tenue',
    'usus_halus',
  ],

  largeIntestine: [
    'large_intestine',
    'largeintestine',
    'large_bowel',
    'colon',
    'cecum',
    'caecum',
    'ascending_colon',
    'transverse_colon',
    'descending_colon',
    'sigmoid',
    'usus_besar',
  ],

  rectum: [
    'rectum',
    'rektum',
    'rectal',
    'anus',
    'anal',
    'sphincter',
  ],
};
