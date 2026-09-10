import React from 'react';
import { CheckCircle2, RotateCcw, Sparkles, Award } from 'lucide-react';
import { DIGESTIVE_STEPS } from '../data/digestiveSteps';

interface CompletedModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export const CompletedModal: React.FC<CompletedModalProps> = ({
  isOpen,
  onRestart,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/60 text-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow Header Background */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 mb-4 shadow-lg shadow-cyan-500/30">
          <Award className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/50 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Simulasi Selesai
        </span>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Perjalanan makanan selesai.
        </h3>

        <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
          Makanan telah berhasil melewati seluruh saluran pencernaan mulai dari mulut,
          esofagus, lambung, usus halus, usus besar, hingga dikeluarkan di rektum.
        </p>

        {/* Quick summary points */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6 text-left space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Rangkuman Perjalanan:
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
            {DIGESTIVE_STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span className="truncate">{idx + 1}. {s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Simulasi
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
