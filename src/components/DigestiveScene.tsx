import React, { useRef, useEffect } from 'react';
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
import { GLBOrgan } from './GLBOrgan';
import { ORGAN_MODEL_CONFIGS } from '../data/organModelConfig';
import { AnatomyBodyOutline } from './AnatomyBodyOutline';
import { FoodParticle, FoodPathwayTrack } from './FoodParticle';
import {
  DIGESTIVE_STEPS,
  ACCESSORY_ORGANS,
} from '../data/digestiveSteps';
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

// Camera Lerp Controller for smooth organ focus & framing
const CameraController: React.FC<{
  selectedOrganId: OrganId;
  cameraPreset: 'front' | 'side' | 'reset' | null;
  onPresetHandled: () => void;
}> = ({ selectedOrganId, cameraPreset, onPresetHandled }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetCamPos = useRef(new THREE.Vector3(0, -0.2, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, -0.2, 0));
  const isTransitioning = useRef(true);

  // Update target based on selected organ or preset
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
      targetCamPos.current.set(0, -0.2, 5.2);
      targetLookAt.current.set(0, -0.2, 0);
      onPresetHandled();
      return;
    }

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
  }, [selectedOrganId, cameraPreset, onPresetHandled]);

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
      minDistance={1.4}
      maxDistance={7.5}
      maxPolarAngle={Math.PI * 0.88}
      minPolarAngle={Math.PI * 0.12}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
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
  return (
    <div className="relative w-full h-full select-none bg-gradient-to-b from-[#060b18] via-[#091124] to-[#040814] overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, -0.2, 5.2], fov: 46 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Balanced Anatomical Laboratory Lighting Setup */}
        <ambientLight intensity={0.9} color="#cbd5e1" />
        <directionalLight position={[5, 8, 6]} intensity={1.35} color="#ffffff" />
        <directionalLight position={[-5, -4, -3]} intensity={0.5} color="#38bdf8" />
        <directionalLight position={[0, -5, 4]} intensity={0.4} color="#06b6d4" />
        <pointLight position={[0, 2.5, 3]} intensity={0.6} color="#f8fafc" />
        <pointLight position={[0, -1.8, 2.8]} intensity={0.5} color="#38bdf8" />

        {/* Camera and Smooth Interpolation Controls */}
        <CameraController
          selectedOrganId={selectedOrganId}
          cameraPreset={cameraPreset}
          onPresetHandled={onPresetHandled}
        />

        {/* Anatomical Organ Model Group */}
        <group position={[0, 0, 0]}>
          {/* Torso Guideline */}
          <AnatomyBodyOutline />

          {/* Glowing Food Pathway Track */}
          <FoodPathwayTrack />

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

          {/* 3. Stomach (Priority 1 GLB with procedural fallback) */}
          <GLBOrgan
            id="stomach"
            name="Lambung"
            latinName="Ventrikulus"
            modelPath={ORGAN_MODEL_CONFIGS.stomach?.path || '/models/stomach.glb'}
            position={ORGAN_MODEL_CONFIGS.stomach?.position || [-0.3, 0.08, 0.12]}
            rotation={ORGAN_MODEL_CONFIGS.stomach?.rotation || [0, 0, 0]}
            scale={ORGAN_MODEL_CONFIGS.stomach?.scale || [1, 1, 1]}
            targetSize={ORGAN_MODEL_CONFIGS.stomach?.targetSize || 0.82}
            enableChurning={ORGAN_MODEL_CONFIGS.stomach?.enableChurning ?? true}
            isActive={activeStageId === 'stomach'}
            isSelected={selectedOrganId === 'stomach'}
            baseColor="#e11d48"
            accentColor="#f43f5e"
            onSelect={onSelectOrgan}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
            fallback={
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
            }
          />

          {/* Accessory: Liver (GLB with procedural fallback) */}
          <GLBOrgan
            id="liver"
            name="Hati"
            latinName="Hepar"
            modelPath={ORGAN_MODEL_CONFIGS.liver?.path || '/models/liver.glb'}
            position={ORGAN_MODEL_CONFIGS.liver?.position || [0.55, 0.42, 0.15]}
            rotation={ORGAN_MODEL_CONFIGS.liver?.rotation || [0, 0, 0]}
            scale={ORGAN_MODEL_CONFIGS.liver?.scale || [1, 1, 1]}
            targetSize={ORGAN_MODEL_CONFIGS.liver?.targetSize || 0.9}
            isActive={selectedOrganId === 'liver'}
            isSelected={selectedOrganId === 'liver'}
            baseColor="#991b1b"
            accentColor="#ef4444"
            onSelect={onSelectOrgan}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
            fallback={
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
            }
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

          {/* Accessory: Pancreas (GLB with procedural fallback) */}
          <GLBOrgan
            id="pancreas"
            name="Pankreas"
            latinName="Pancreas"
            modelPath={ORGAN_MODEL_CONFIGS.pancreas?.path || '/models/pancreas.glb'}
            position={ORGAN_MODEL_CONFIGS.pancreas?.position || [-0.05, -0.25, 0.02]}
            rotation={ORGAN_MODEL_CONFIGS.pancreas?.rotation || [0, 0, 0]}
            scale={ORGAN_MODEL_CONFIGS.pancreas?.scale || [1, 1, 1]}
            targetSize={ORGAN_MODEL_CONFIGS.pancreas?.targetSize || 0.58}
            isActive={selectedOrganId === 'pancreas'}
            isSelected={selectedOrganId === 'pancreas'}
            baseColor="#d97706"
            accentColor="#f59e0b"
            onSelect={onSelectOrgan}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
            fallback={
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
            }
          />

          {/* 4. Small Intestine (Duodenum + Jejunum & Ileum) */}
          <GLBOrgan
            id="smallIntestine"
            name="Usus Halus"
            latinName="Intestinum Tenue"
            modelPath={ORGAN_MODEL_CONFIGS.smallIntestine?.path || '/models/small-intestine.glb'}
            position={ORGAN_MODEL_CONFIGS.smallIntestine?.position || [0.02, -1.15, 0.18]}
            rotation={ORGAN_MODEL_CONFIGS.smallIntestine?.rotation || [0, 0, 0]}
            scale={ORGAN_MODEL_CONFIGS.smallIntestine?.scale || [1, 1, 1]}
            targetSize={ORGAN_MODEL_CONFIGS.smallIntestine?.targetSize || 1.05}
            isActive={activeStageId === 'smallIntestine'}
            isSelected={selectedOrganId === 'smallIntestine'}
            baseColor="#f59e0b"
            accentColor="#fbbf24"
            onSelect={onSelectOrgan}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
            fallback={
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
            }
          />

          {/* 5. Large Intestine (Kolon framing periphery) */}
          <GLBOrgan
            id="largeIntestine"
            name="Usus Besar"
            latinName="Kolon"
            modelPath={ORGAN_MODEL_CONFIGS.largeIntestine?.path || '/models/large-intestine.glb'}
            position={ORGAN_MODEL_CONFIGS.largeIntestine?.position || [0.0, -1.15, 0.1]}
            rotation={ORGAN_MODEL_CONFIGS.largeIntestine?.rotation || [0, 0, 0]}
            scale={ORGAN_MODEL_CONFIGS.largeIntestine?.scale || [1, 1, 1]}
            targetSize={ORGAN_MODEL_CONFIGS.largeIntestine?.targetSize || 1.5}
            isActive={activeStageId === 'largeIntestine'}
            isSelected={selectedOrganId === 'largeIntestine'}
            baseColor="#65a30d"
            accentColor="#84cc16"
            onSelect={onSelectOrgan}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
            fallback={
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
            }
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
