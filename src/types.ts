export type DigestiveStageId =
  | 'mouth'
  | 'esophagus'
  | 'stomach'
  | 'smallIntestine'
  | 'largeIntestine'
  | 'rectum';

export type AccessoryOrganId = 'liver' | 'gallbladder' | 'pancreas';

export type OrganId = DigestiveStageId | AccessoryOrganId;

export type SimulationStatus = 'READY' | 'PLAYING' | 'PAUSED' | 'COMPLETED';

export type SpeedRate = 0.5 | 1 | 1.5 | 2;

export interface DigestiveStep {
  id: DigestiveStageId;
  index: number;
  name: string;
  latinName: string;
  description: string;
  function: string;
  foodState: string;
  durationNote: string;
  keyEnzymes: string[];
  processDetails: string[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  pathProgressRange: [number, number]; // [startProgress, endProgress] 0 to 1
  color: string;
  accentColor: string;
  organ3DPosition: [number, number, number];
}

export interface AccessoryOrganInfo {
  id: AccessoryOrganId;
  name: string;
  latinName: string;
  role: string;
  description: string;
  function: string;
  secretion: string;
  color: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  organ3DPosition: [number, number, number];
}
