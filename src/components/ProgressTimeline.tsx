import React from 'react';
import {
  DIGESTIVE_STEPS,
  ACCESSORY_ORGANS,
} from '../data/digestiveSteps';
import { DigestiveStageId, OrganId } from '../types';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  Droplet,
} from 'lucide-react';

interface ProgressTimelineProps {
  activeStageId: DigestiveStageId;
  selectedOrganId: OrganId;
  progress: number;
  onSelectOrgan: (id: OrganId) => void;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  activeStageId,
  selectedOrganId,
  progress,
  onSelectOrgan,
}) => {
  const activeStepIndex = DIGESTIVE_STEPS.findIndex((s) => s.id === activeStageId);
  const progressPercent = Math.round(progress * 100);

  return (
    <aside className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-r border-slate-800/80 overflow-y-auto custom-scrollbar p-3.5 md:p-4 text-slate-200">
      {/* Section 1: Progress Perjalanan Makanan */}
      <div className="mb-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/70 shadow-inner">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Perjalanan Makanan
          </span>
          <span className="text-cyan-400 font-mono font-bold text-sm">
            {progressPercent}%
          </span>
        </div>

        {/* Outer Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 rounded-full transition-all duration-200 ease-out shadow-sm shadow-cyan-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
          <span>Tahap {activeStepIndex + 1} dari {DIGESTIVE_STEPS.length}</span>
          <span className="text-cyan-300 font-medium">
            {DIGESTIVE_STEPS[activeStepIndex]?.name || 'Mulut'}
          </span>
        </div>
      </div>

      {/* Section 2: Daftar Organ Utama (Saluran Pencernaan) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Saluran Utama Pencernaan
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">6 Organ</span>
        </div>

        <div className="space-y-1.5">
          {DIGESTIVE_STEPS.map((step, idx) => {
            const isActive = step.id === activeStageId;
            const isSelected = step.id === selectedOrganId;
            const isPast = idx < activeStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => onSelectOrgan(step.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/90 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : isSelected
                    ? 'bg-slate-800/80 border-cyan-500/60 text-slate-100'
                    : 'bg-slate-950/40 hover:bg-slate-800/50 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Step Status Indicator Icon */}
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/50">
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                      </div>
                    ) : isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                    )}
                  </div>

                  {/* Organ Name & Latin Subtitle */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {idx + 1}.
                      </span>
                      <span
                        className={`text-xs md:text-sm font-semibold truncate ${
                          isActive
                            ? 'text-cyan-200 font-bold'
                            : isSelected
                            ? 'text-slate-100'
                            : 'text-slate-300'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {step.latinName}
                    </span>
                  </div>
                </div>

                {/* Right Badge / Arrow */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: step.color }}
                    title={`Warna anatomi: ${step.name}`}
                  />
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Aktif
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Organ Aksesori / Pendukung */}
      <div className="mt-auto pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-amber-400" />
            Organ Aksesori
          </h2>
          <span className="text-[10px] text-slate-500">Pendukung</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {ACCESSORY_ORGANS.map((organ) => {
            const isSelected = selectedOrganId === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => onSelectOrgan(organ.id)}
                className={`p-2 rounded-lg text-center border transition-all ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full mx-auto block mb-1"
                  style={{ backgroundColor: organ.color }}
                />
                <span className="text-[11px] font-semibold block leading-tight truncate">
                  {organ.name}
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  {organ.latinName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
