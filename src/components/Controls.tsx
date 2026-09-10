import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Sparkles,
} from 'lucide-react';
import {
  SimulationStatus,
  SpeedRate,
  DigestiveStageId,
} from '../types';
import { DIGESTIVE_STEPS } from '../data/digestiveSteps';

interface ControlsProps {
  status: SimulationStatus;
  progress: number;
  speed: SpeedRate;
  activeStageId: DigestiveStageId;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onSetSpeed: (speed: SpeedRate) => void;
  onScrub: (progress: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  progress,
  speed,
  activeStageId,
  onPlayPause,
  onPrevious,
  onNext,
  onReset,
  onSetSpeed,
  onScrub,
}) => {
  const isPlaying = status === 'PLAYING';
  const speeds: SpeedRate[] = [0.5, 1, 1.5, 2];
  const activeStep = DIGESTIVE_STEPS.find((s) => s.id === activeStageId);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2.5 md:py-3 z-20 flex flex-col gap-2 shadow-2xl">
      {/* Top row: Progress timeline scrubber with step markers */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-[11px] font-mono text-slate-400 w-9 text-right flex-shrink-0">
          {Math.round(progress * 100)}%
        </span>

        {/* Interactive scrubber */}
        <div className="relative flex-1 flex items-center group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            title="Tarik untuk memajukan / memundurkan perjalanan makanan"
          />

          {/* Organ checkpoints indicator ticks */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-between px-1">
            {DIGESTIVE_STEPS.map((step) => (
              <div
                key={step.id}
                className="w-1.5 h-1.5 rounded-full bg-slate-600/80"
                style={{
                  left: `${step.pathProgressRange[0] * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Active Stage Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{activeStep?.name || 'Mulut'}</span>
        </div>
      </div>

      {/* Bottom row: Playback Buttons & Speed Selector */}
      <div className="flex items-center justify-between">
        {/* Left: Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors shadow-sm"
          title="Reset Makanan ke Mulut"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xs:inline">Reset</span>
        </button>

        {/* Center: Previous, Play/Pause, Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Tahap Sebelumnya (Previous)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Play/Pause */}
          <button
            onClick={onPlayPause}
            className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30 hover:brightness-110'
                : 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-cyan-500/30 hover:brightness-110'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Mulai Simulasi</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Tahap Berikutnya (Next)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed Multiplier */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <Gauge className="w-3.5 h-3.5 text-slate-500 mx-1 hidden sm:block" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
