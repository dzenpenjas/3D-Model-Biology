import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DigestiveStageId,
  OrganId,
  SimulationStatus,
  SpeedRate,
} from '../types';
import {
  DIGESTIVE_STEPS,
  getStageFromProgress,
  getProgressFromStage,
} from '../data/digestiveSteps';

const BASE_DURATION_SECONDS = 28; // Standard full journey takes ~28 seconds at 1x speed

export function useDigestiveAnimation() {
  const [status, setStatus] = useState<SimulationStatus>('READY');
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<SpeedRate>(1);
  const [activeStageId, setActiveStageId] = useState<DigestiveStageId>('mouth');
  const [selectedOrganId, setSelectedOrganId] = useState<OrganId>('mouth');
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganId | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'side' | 'reset' | null>(null);

  const lastTimeRef = useRef<number | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // Update activeStage whenever progress changes
  useEffect(() => {
    const stage = getStageFromProgress(progress);
    setActiveStageId(stage);
  }, [progress]);

  // Main animation loop
  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = (time - lastTimeRef.current) / 1000;
        const progressIncrement =
          (deltaSeconds / BASE_DURATION_SECONDS) * speed;

        setProgress((prev) => {
          const next = prev + progressIncrement;
          if (next >= 1) {
            setStatus('COMPLETED');
            setSelectedOrganId('rectum');
            return 1;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      reqAnimRef.current = requestAnimationFrame(animate);
    },
    [speed]
  );

  useEffect(() => {
    if (status === 'PLAYING') {
      lastTimeRef.current = null;
      reqAnimRef.current = requestAnimationFrame(animate);
    } else {
      if (reqAnimRef.current !== null) {
        cancelAnimationFrame(reqAnimRef.current);
        reqAnimRef.current = null;
      }
      lastTimeRef.current = null;
    }

    return () => {
      if (reqAnimRef.current !== null) {
        cancelAnimationFrame(reqAnimRef.current);
      }
    };
  }, [status, animate]);

  // Play handler
  const play = useCallback(() => {
    if (progress >= 1 || status === 'COMPLETED') {
      setProgress(0);
      setSelectedOrganId('mouth');
    }
    setStatus('PLAYING');
  }, [progress, status]);

  // Pause handler
  const pause = useCallback(() => {
    setStatus('PAUSED');
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (status === 'PLAYING') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  // Reset handler: returns to mouth, stops animation, resets camera
  const reset = useCallback(() => {
    setStatus('READY');
    setProgress(0);
    setActiveStageId('mouth');
    setSelectedOrganId('mouth');
    setCameraPreset('reset');
  }, []);

  // Jump to specific step
  const jumpToStage = useCallback((stageId: DigestiveStageId) => {
    const newProgress = getProgressFromStage(stageId);
    setProgress(newProgress);
    setActiveStageId(stageId);
    setSelectedOrganId(stageId);
  }, []);

  // Next step handler
  const nextStep = useCallback(() => {
    const currentIdx = DIGESTIVE_STEPS.findIndex((s) => s.id === activeStageId);
    if (currentIdx < DIGESTIVE_STEPS.length - 1) {
      const nextStage = DIGESTIVE_STEPS[currentIdx + 1];
      jumpToStage(nextStage.id);
    }
  }, [activeStageId, jumpToStage]);

  // Previous step handler
  const previousStep = useCallback(() => {
    const currentIdx = DIGESTIVE_STEPS.findIndex((s) => s.id === activeStageId);
    const currentStep = DIGESTIVE_STEPS[currentIdx];

    // If progress is significantly into current step, reset to start of this step
    if (progress - currentStep.pathProgressRange[0] > 0.05) {
      jumpToStage(currentStep.id);
    } else if (currentIdx > 0) {
      const prevStage = DIGESTIVE_STEPS[currentIdx - 1];
      jumpToStage(prevStage.id);
    }
  }, [activeStageId, progress, jumpToStage]);

  // Select organ (by clicking 3D model or left list)
  const selectOrgan = useCallback(
    (id: OrganId) => {
      setSelectedOrganId(id);
      const mainStep = DIGESTIVE_STEPS.find((s) => s.id === id);
      if (mainStep) {
        jumpToStage(mainStep.id);
      }
    },
    [jumpToStage]
  );

  // Manual scrub handler
  const scrubProgress = useCallback((newProgress: number) => {
    const clamped = Math.max(0, Math.min(1, newProgress));
    setProgress(clamped);
    if (clamped >= 1) {
      setStatus('COMPLETED');
    }
  }, []);

  const handlePresetHandled = useCallback(() => {
    setCameraPreset(null);
  }, []);

  return {
    status,
    progress,
    speed,
    setSpeed,
    activeStageId,
    selectedOrganId,
    hoveredOrgan,
    setHoveredOrgan,
    cameraPreset,
    setCameraPreset,
    handlePresetHandled,
    play,
    pause,
    togglePlayPause,
    reset,
    nextStep,
    previousStep,
    jumpToStage,
    selectOrgan,
    scrubProgress,
  };
}
