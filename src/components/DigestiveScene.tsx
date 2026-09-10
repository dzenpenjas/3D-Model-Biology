import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  MouthOrgan,
  EsophagusOrgan,
  StomachOrgan,
  LiverOrgan,
  GallbladderOrgan,
  PancreasOrgan,
  SmallIntestineOrgan,
  LargeIntestineOrgan,
  RectumOrgan,
} from './DigestiveOrgan';
import { DigestiveGLBModel } from './DigestiveGLBModel';
import { AnatomyBodyOutline } from './AnatomyBodyOutline';
import { FoodParticle, FoodPathwayTrack } from './FoodParticle';
import {
  DIGESTIVE_STEPS,
  ACCESSORY_ORGANS,
} from '../data/digestiveSteps';
import { SHOW_BODY_OUTLINE } from '../data/digestiveModelConfig';
import { DigestiveStageId, OrganId, SimulationStatus } from '../types';

interface DigestiveSceneProps {
  activeStageId: DigestiveStageId;
  selectedOrganId: OrganId;
  hoveredOrgan: OrganId | null;
  onSelectOrgan: (id: OrganId) => void;
  setHoveredOrgan: (id: OrganId | null) => void;
  progress: number;
  status: SimulationStatus;
  cameraPreset: 'front' | 'side' | 'reset' | null;
  onPresetHandled: () => void;
}

/**
 * Camera Lerp Controller for smooth organ focus & framing.
 * Dynamically utilizes 3D organ bounding boxes when a GLB model is present,
 * with graceful fallback to predefined step coordinates.
 */
const CameraController: React.FC<{
  selectedOrganId: OrganId;
  cameraPreset: 'front' | 'side' | 'reset' | null;
  onPresetHandled: () => void;
  organBounds: Map<OrganId, THREE.Box3>;
  fullModelBounds: THREE.Box3 | null;
}> = ({
  selectedOrganId,
  cameraPreset,
  onPresetHandled,
  organBounds,
  fullModelBounds,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetCamPos = useRef(new THREE.Vector3(0, -0.2, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, -0.2, 0));
  const isTransitioning = useRef(true);

  // Update camera target based on selected organ or preset
  useEffect(() => {
    isTransitioning.current = true;

    if (cameraPreset === 'front') {
      targetCamPos.current.set(0, -0.2, 5.0);
      targetLookAt.current.set(0, -0.2, 0);
      onPresetHandled();
      return;
    }
    if (cameraPreset === 'side') {
      targetCamPos.current.set(4.5, -0.2, 1.6);
      targetLookAt.current.set(0, -0.2, 0);
      onPresetHandled();
      return;
    }
    if (cameraPreset === 'reset') {
      if (fullModelBounds) {
        const center = new THREE.Vector3();
        fullModelBounds.getCenter(center);
        const size = new THREE.Vector3();
        fullModelBounds.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = Math.max(5.0, maxDim * 1.15);
        targetCamPos.current.set(center.x, center.y, center.z + distance);
        targetLookAt.current.set(center.x, center.y, center.z);
      } else {
        targetCamPos.current.set(0, -0.2, 5.2);
        targetLookAt.current.set(0, -0.2, 0);
      }
      onPresetHandled();
      return;
    }

    // Dynamic camera focus based on real model organ bounding box
    if (organBounds.has(selectedOrganId)) {
      const box = organBounds.get(selectedOrganId)!;
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = Math.max(1.8, Math.min(4.8, maxDim * 2.3));

      targetCamPos.current.set(center.x, center.y + 0.08, center.z + distance);
      targetLookAt.current.set(center.x, center.y, center.z);
      return;
    }

    // Predefined step coordinates fallback
    const step = DIGESTIVE_STEPS.find((s) => s.id === selectedOrganId);
    if (step) {
      targetCamPos.current.set(...step.cameraPosition);
      targetLookAt.current.set(...step.cameraTarget);
      return;
    }

    const accessory = ACCESSORY_ORGANS.find((a) => a.id === selectedOrganId);
    if (accessory) {
      targetCamPos.current.set(...accessory.cameraPosition);
      targetLookAt.current.set(...accessory.cameraTarget);
    }
  }, [
    selectedOrganId,
    cameraPreset,
    onPresetHandled,
    organBounds,
    fullModelBounds,
  ]);

  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      const lerpSpeed = Math.min(1, delta * 3.6);
      camera.position.lerp(targetCamPos.current, lerpSpeed);
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.04 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.04
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={1.3}
      maxDistance={8.0}
      maxPolarAngle={Math.PI * 0.88}
      minPolarAngle={Math.PI * 0.12}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};

/**
 * Encapsulated Procedural Anatomy Group.
 * Acts as the fallback when the unified GLB file is absent or fails to load.
 */
const ProceduralDigestiveOrgans: React.FC<{
  activeStageId: DigestiveStageId;
  selectedOrganId: OrganId;
  hoveredOrgan: OrganId | null;
  onSelectOrgan: (id: OrganId) => void;
  setHoveredOrgan: (id: OrganId | null) => void;
  progress: number;
}> = ({
  activeStageId,
  selectedOrganId,
  hoveredOrgan,
  onSelectOrgan,
  setHoveredOrgan,
  progress,
}) => {
  return (
    <group>
      {/* 1. Mouth & Pharynx */}
      <MouthOrgan
        id="mouth"
        name="Mulut"
        latinName="Cavum Oris & Faring"
        isActive={activeStageId === 'mouth'}
        isSelected={selectedOrganId === 'mouth'}
        baseColor="#f87171"
        accentColor="#fb7185"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />

      {/* 2. Esophagus */}
      <EsophagusOrgan
        id="esophagus"
        name="Kerongkongan"
        latinName="Esofagus"
        isActive={activeStageId === 'esophagus'}
        isSelected={selectedOrganId === 'esophagus'}
        baseColor="#fb923c"
        accentColor="#fdba74"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />

      {/* 3. Stomach */}
      <StomachOrgan
        id="stomach"
        name="Lambung"
        latinName="Ventrikulus"
        isActive={activeStageId === 'stomach'}
        isSelected={selectedOrganId === 'stomach'}
        baseColor="#e11d48"
        accentColor="#f43f5e"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />

      {/* Accessory: Liver */}
      <LiverOrgan
        id="liver"
        name="Hati"
        latinName="Hepar"
        isActive={selectedOrganId === 'liver'}
        isSelected={selectedOrganId === 'liver'}
        baseColor="#991b1b"
        accentColor="#ef4444"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
      />

      {/* Accessory: Gallbladder */}
      <GallbladderOrgan
        id="gallbladder"
        name="Kantong Empedu"
        latinName="Vesica Fellea"
        isActive={selectedOrganId === 'gallbladder'}
        isSelected={selectedOrganId === 'gallbladder'}
        baseColor="#059669"
        accentColor="#10b981"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
      />

      {/* Accessory: Pancreas */}
      <PancreasOrgan
        id="pancreas"
        name="Pankreas"
        latinName="Pancreas"
        isActive={selectedOrganId === 'pancreas'}
        isSelected={selectedOrganId === 'pancreas'}
        baseColor="#d97706"
        accentColor="#f59e0b"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
      />

      {/* 4. Small Intestine */}
      <SmallIntestineOrgan
        id="smallIntestine"
        name="Usus Halus"
        latinName="Intestinum Tenue"
        isActive={activeStageId === 'smallIntestine'}
        isSelected={selectedOrganId === 'smallIntestine'}
        baseColor="#f59e0b"
        accentColor="#fbbf24"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />

      {/* 5. Large Intestine */}
      <LargeIntestineOrgan
        id="largeIntestine"
        name="Usus Besar"
        latinName="Kolon"
        isActive={activeStageId === 'largeIntestine'}
        isSelected={selectedOrganId === 'largeIntestine'}
        baseColor="#65a30d"
        accentColor="#84cc16"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />

      {/* 6. Rectum & Anus */}
      <RectumOrgan
        id="rectum"
        name="Rektum & Anus"
        latinName="Rektum"
        isActive={activeStageId === 'rectum'}
        isSelected={selectedOrganId === 'rectum'}
        baseColor="#0891b2"
        accentColor="#06b6d4"
        onSelect={onSelectOrgan}
        hoveredOrgan={hoveredOrgan}
        setHoveredOrgan={setHoveredOrgan}
        progress={progress}
      />
    </group>
  );
};

export const DigestiveScene: React.FC<DigestiveSceneProps> = ({
  activeStageId,
  selectedOrganId,
  hoveredOrgan,
  onSelectOrgan,
  setHoveredOrgan,
  progress,
  status,
  cameraPreset,
  onPresetHandled,
}) => {
  // Stored organ bounding boxes computed by the GLB model
  const [organBounds, setOrganBounds] = useState<Map<OrganId, THREE.Box3>>(
    new Map()
  );
  const [fullModelBounds, setFullModelBounds] = useState<THREE.Box3 | null>(null);

  return (
    <div className="relative w-full h-full select-none bg-gradient-to-b from-[#060b18] via-[#091124] to-[#040814] overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, -0.2, 5.2], fov: 46 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Balanced Anatomical Laboratory Studio Lighting */}
        <ambientLight intensity={0.75} color="#cbd5e1" />
        <hemisphereLight args={['#f8fafc', '#1e293b', 0.6]} />
        <directionalLight position={[4, 7, 5]} intensity={1.3} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#38bdf8" />
        <pointLight position={[0, 2.5, 3]} intensity={0.45} color="#ffffff" />
        <pointLight position={[0, -2, 2.5]} intensity={0.35} color="#06b6d4" />

        {/* Camera and Smooth Interpolation Controls */}
        <CameraController
          selectedOrganId={selectedOrganId}
          cameraPreset={cameraPreset}
          onPresetHandled={onPresetHandled}
          organBounds={organBounds}
          fullModelBounds={fullModelBounds}
        />

        {/* Anatomical Model Scene Group */}
        <group position={[0, 0, 0]}>
          {/* Torso Guideline silhouette */}
          {SHOW_BODY_OUTLINE && <AnatomyBodyOutline />}

          {/* 3D Food Pathway Track */}
          <FoodPathwayTrack />

          {/* Primary Unified GLB Model with Safe Procedural Fallback */}
          <DigestiveGLBModel
            activeStageId={activeStageId}
            selectedOrganId={selectedOrganId}
            hoveredOrgan={hoveredOrgan}
            onSelectOrgan={onSelectOrgan}
            setHoveredOrgan={setHoveredOrgan}
            onOrganBoundsReady={(bounds, fullBounds) => {
              setOrganBounds(bounds);
              setFullModelBounds(fullBounds);
            }}
            fallback={
              <ProceduralDigestiveOrgans
                activeStageId={activeStageId}
                selectedOrganId={selectedOrganId}
                hoveredOrgan={hoveredOrgan}
                onSelectOrgan={onSelectOrgan}
                setHoveredOrgan={setHoveredOrgan}
                progress={progress}
              />
            }
          />

          {/* Animated Food Particle travelling along the digestive tract */}
          <FoodParticle
            progress={progress}
            activeStageId={activeStageId}
            isPlaying={status === 'PLAYING'}
          />
        </group>
      </Canvas>
    </div>
  );
};
