import React, { useState } from 'react';
import { Header } from './components/Header';
import { DigestiveScene } from './components/DigestiveScene';
import { ProgressTimeline } from './components/ProgressTimeline';
import { LearningPanel } from './components/LearningPanel';
import { Controls } from './components/Controls';
import { CompletedModal } from './components/CompletedModal';
import { HelpModal } from './components/HelpModal';
import { useDigestiveAnimation } from './hooks/useDigestiveAnimation';
import { Box, BookOpen, ListOrdered } from 'lucide-react';

export default function App() {
  const {
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
  } = useDigestiveAnimation();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'scene' | 'timeline' | 'info'>('scene');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060b18] text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Bar */}
      <Header
        status={status}
        onReset={reset}
        onSetCameraPreset={(preset) => setCameraPreset(preset)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Mobile Tab Switcher (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-b border-slate-800 p-1.5 z-20 flex-shrink-0">
        <button
          onClick={() => setMobileTab('timeline')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'timeline'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          Tahapan
        </button>

        <button
          onClick={() => setMobileTab('scene')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'scene'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          Visual 3D
        </button>

        <button
          onClick={() => setMobileTab('info')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'info'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Materi
        </button>
      </div>

      {/* 2. Main 3-Column Desktop / Responsive Mobile Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Daftar Organ & Progress */}
        <div
          className={`w-full md:w-72 lg:w-80 h-full flex-shrink-0 z-10 transition-all ${
            mobileTab === 'timeline'
              ? 'block absolute inset-0 md:relative md:block'
              : 'hidden md:block'
          }`}
        >
          <ProgressTimeline
            activeStageId={activeStageId}
            selectedOrganId={selectedOrganId}
            progress={progress}
            onSelectOrgan={(id) => {
              selectOrgan(id);
              if (window.innerWidth < 768) {
                setMobileTab('scene');
              }
            }}
          />
        </div>

        {/* Center Column: 3D Canvas Scene & Bottom Controls */}
        <div
          className={`flex-1 h-full flex flex-col relative overflow-hidden ${
            mobileTab === 'scene'
              ? 'flex w-full'
              : 'hidden md:flex'
          }`}
        >
          {/* Canvas Container */}
          <div className="flex-1 relative w-full h-full">
            <DigestiveScene
              activeStageId={activeStageId}
              selectedOrganId={selectedOrganId}
              hoveredOrgan={hoveredOrgan}
              onSelectOrgan={selectOrgan}
              setHoveredOrgan={setHoveredOrgan}
              progress={progress}
              status={status}
              cameraPreset={cameraPreset}
              onPresetHandled={handlePresetHandled}
            />

            {/* Quick 3D Interaction Tip Overlay (Subtle) */}
            <div className="absolute top-3 left-3 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Rotasi: Drag mouse • Zoom: Scroll • Klik organ untuk fokus</span>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <Controls
            status={status}
            progress={progress}
            speed={speed}
            activeStageId={activeStageId}
            onPlayPause={togglePlayPause}
            onPrevious={previousStep}
            onNext={nextStep}
            onReset={reset}
            onSetSpeed={setSpeed}
            onScrub={scrubProgress}
          />
        </div>

        {/* Right Column: Learning Panel (Fungsi & Penjelasan Organ) */}
        <div
          className={`w-full md:w-80 lg:w-96 h-full flex-shrink-0 z-10 transition-all ${
            mobileTab === 'info'
              ? 'block absolute inset-0 md:relative md:block'
              : 'hidden md:block'
          }`}
        >
          <LearningPanel selectedOrganId={selectedOrganId} />
        </div>
      </main>

      {/* Completion Modal Prompt */}
      <CompletedModal
        isOpen={status === 'COMPLETED'}
        onRestart={reset}
        onClose={() => {}}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
