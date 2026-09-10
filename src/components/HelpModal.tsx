import React from 'react';
import {
  HelpCircle,
  RotateCw,
  ZoomIn,
  MousePointerClick,
  Play,
  X,
  Sparkles,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Panduan Penggunaan</h3>
            <p className="text-xs text-slate-400">
              Cara berinteraksi dengan ALCO Biology 3D
            </p>
          </div>
        </div>

        <div className="space-y-3.5 mb-6 text-xs md:text-sm text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <RotateCw className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Rotasi 3D (Putar Model)</strong>
              Klik kiri & seret (drag) pada canvas 3D untuk melihat anatomi dari berbagai sudut pandang.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <ZoomIn className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Perbesar / Perkecil (Zoom)</strong>
              Gunakan scroll roda mouse atau pinch pada layar untuk memperbesar detail organ.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <MousePointerClick className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Klik Organ untuk Eksplorasi</strong>
              Klik langsung pada organ 3D atau daftar organ di panel kiri untuk memfokuskan kamera dan membaca materi lengkap di panel kanan.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <Play className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Simulasi Makanan & Pengaturan Kecepatan</strong>
              Tekan tombol Play untuk melihat partikel makanan bergerak. Atur kecepatan (0.5x - 2x) atau geser progress bar secara manual.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors"
        >
          Mengerti, Mulai Eksplorasi
        </button>
      </div>
    </div>
  );
};
