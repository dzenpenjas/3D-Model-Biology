import React, { useState } from 'react';
import {
  DIGESTIVE_STEPS,
  ACCESSORY_ORGANS,
} from '../data/digestiveSteps';
import { OrganId } from '../types';
import {
  BookOpen,
  Utensils,
  Clock,
  Sparkles,
  Zap,
  FlaskConical,
  Droplets,
  Layers,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface LearningPanelProps {
  selectedOrganId: OrganId;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  selectedOrganId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainStep = DIGESTIVE_STEPS.find((s) => s.id === selectedOrganId);
  const accessory = ACCESSORY_ORGANS.find((a) => a.id === selectedOrganId);

  // If Main Digestive Organ is selected
  if (mainStep) {
    return (
      <aside className="w-full h-full flex flex-col bg-slate-900/95 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-3.5 md:p-4 text-slate-200">
        {/* Header: Organ Title & Latin Name */}
        <div className="pb-2.5 mb-2.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Tahap {mainStep.index + 1} Saluran Utama
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="font-semibold text-slate-300">
                {mainStep.durationNote}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {mainStep.name}
          </h2>
          <p className="text-[11px] text-cyan-400/80 font-medium italic">
            {mainStep.latinName}
          </p>
        </div>

        {/* Level 1 Learning Cards (Concise, High Priority) */}
        <div className="space-y-2.5 flex-1">
          {/* 1. Fungsi Utama (1 Kalimat Ringkas) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Fungsi Utama
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {mainStep.mainFunction}
            </p>
          </div>

          {/* 2. Apa yang Terjadi pada Makanan (1 Kalimat Ringkas) */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950/80 border border-amber-500/30 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Perubahan Makanan
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
              {mainStep.foodAction}
            </p>
          </div>

          {/* 3. Fakta Penting (1 Fakta Kunci) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Fakta Penting
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {mainStep.keyFact}
            </p>
          </div>

          {/* Expandable Level 2 Learning Section Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-between shadow-sm cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              {isExpanded ? 'Tutup Detail Materi' : 'Pelajari Lebih Lanjut'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Level 2 Deeper Exploration (Enzymes, Biological Mechanisms, Anatomy) */}
          {isExpanded && (
            <div className="space-y-2.5 pt-1 border-t border-slate-800/60 animate-in fade-in duration-200">
              {/* Enzim & Sekresi Kimiawi */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                  Enzim & Zat Kimiawi
                </div>
                <div className="space-y-1">
                  {mainStep.keyEnzymes.map((enzyme, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg text-[11px] font-medium bg-teal-950/50 text-teal-200 border border-teal-800/40 flex items-start gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-1" />
                      <span>{enzyme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Mekanisme Biologis */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Tahapan Mekanisme Biologis
                </div>
                <ul className="space-y-2">
                  {mainStep.processDetails.map((detail, idx) => (
                    <li
                      key={idx}
                      className="text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-4 h-4 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // If Accessory Organ is selected
  if (accessory) {
    return (
      <aside className="w-full h-full flex flex-col bg-slate-900/95 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-3.5 md:p-4 text-slate-200">
        <div className="pb-2.5 mb-2.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {accessory.role}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            {accessory.name}
          </h2>
          <p className="text-[11px] text-amber-400/80 font-medium italic">
            {accessory.latinName}
          </p>
        </div>

        <div className="space-y-2.5 flex-1">
          {/* Level 1: Fungsi Utama */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Fungsi Utama
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {accessory.mainFunction}
            </p>
          </div>

          {/* Level 1: Sekresi Getah */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-950/80 border border-emerald-500/30 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              Getah / Sekresi yang Dihasilkan
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              {accessory.secretion}
            </p>
          </div>

          {/* Level 1: Fakta Kunci */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Fakta Kunci
            </div>
            <p className="text-xs text-cyan-100/90 leading-relaxed">
              {accessory.keyFact}
            </p>
          </div>

          {/* Expandable Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all flex items-center justify-between shadow-sm cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              {isExpanded ? 'Tutup Detail Materi' : 'Pelajari Lebih Lanjut'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Level 2 Deeper Info */}
          {isExpanded && (
            <div className="space-y-2.5 pt-1 border-t border-slate-800/60 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                  <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
                  Posisi & Struktur Anatomis
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {accessory.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Mekanisme dalam Sistem Pencernaan
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {accessory.function}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  return null;
};
