import React from 'react';
import {
  RotateCcw,
  Compass,
  Layers,
  HelpCircle,
  Activity,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import { SimulationStatus } from '../types';

interface HeaderProps {
  status: SimulationStatus;
  onReset: () => void;
  onSetCameraPreset: (preset: 'front' | 'side' | 'reset') => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onReset,
  onSetCameraPreset,
  onOpenHelp,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'PLAYING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SIMULASI BERJALAN
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Pause className="w-3 h-3" />
            JEDA
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" />
            SELESAI
          </span>
        );
      case 'READY':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-300 border border-slate-600/40">
            <Activity className="w-3 h-3 text-cyan-400" />
            SIAP SIMULASI
          </span>
        );
    }
  };

  return (
    <header className="h-14 md:h-16 px-4 md:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20 flex-shrink-0">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-900/40">
          <Layers className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-100">
              ALCO Biology 3D
            </h1>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-700/40">
              Sistem Pencernaan
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Laboratorium Virtual Anatomi & Simulasi Perjalanan Makanan
          </p>
        </div>
      </div>

      {/* Center Status Badge */}
      <div className="flex items-center gap-2">
        {getStatusBadge()}
      </div>

      {/* Right Controls / Camera Presets */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Camera Views */}
        <div className="hidden lg:flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSetCameraPreset('front')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded transition-colors"
            title="Tampak Depan (Anterior)"
          >
            Depan
          </button>
          <button
            onClick={() => onSetCameraPreset('side')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded transition-colors"
            title="Tampak Samping (Lateral)"
          >
            Samping
          </button>
          <button
            onClick={() => onSetCameraPreset('reset')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded transition-colors flex items-center gap-1"
            title="Reset Posisi Kamera"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            Reset Kamera
          </button>
        </div>

        {/* Quick Reset */}
        <button
          onClick={onReset}
          className="p-2 md:px-3 md:py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center gap-1.5"
          title="Reset Makanan ke Mulut"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Reset</span>
        </button>

        {/* Help / Guide */}
        <button
          onClick={onOpenHelp}
          className="p-2 md:px-3 md:py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center gap-1.5"
          title="Panduan Penggunaan"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Panduan</span>
        </button>
      </div>
    </header>
  );
};
