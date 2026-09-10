import React from 'react';
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
} from 'lucide-react';

interface LearningPanelProps {
  selectedOrganId: OrganId;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  selectedOrganId,
}) => {
  const mainStep = DIGESTIVE_STEPS.find((s) => s.id === selectedOrganId);
  const accessory = ACCESSORY_ORGANS.find((a) => a.id === selectedOrganId);

  // If Main Digestive Organ is selected
  if (mainStep) {
    return (
      <aside className="w-full h-full flex flex-col bg-slate-900/90 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-4 text-slate-200">
        {/* Header: Organ Title & Latin Name */}
        <div className="pb-3 mb-3.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Tahap {mainStep.index + 1} Saluran Utama
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-300">
                {mainStep.durationNote}
              </span>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {mainStep.name}
          </h2>
          <p className="text-xs text-cyan-400/90 font-medium italic">
            {mainStep.latinName}
          </p>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Card 1: Deskripsi & Fungsi Utama */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Fungsi & Peran Organ
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-2">
              {mainStep.description}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200">
              <strong className="text-cyan-300">Tugas Pokok: </strong>
              {mainStep.function}
            </div>
          </div>

          {/* Card 2: Kondisi & Transformasi Makanan */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950/80 border border-amber-500/30 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
              <Utensils className="w-4 h-4 text-amber-400" />
              Kondisi Fisik Makanan
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/25 text-xs md:text-sm text-amber-100 font-medium">
              {mainStep.foodState}
            </div>
          </div>

          {/* Card 3: Enzim & Zat Kimiawi */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              Enzim & Zat Kimiawi Terlibat
            </div>
            <div className="space-y-1.5">
              {mainStep.keyEnzymes.map((enzyme, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg text-xs font-medium bg-teal-950/50 text-teal-200 border border-teal-800/40 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-1.5" />
                  <span>{enzyme}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Penjelasan Detail Tahapan Proses */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Detail Mekanisme Biologis
            </div>
            <ul className="space-y-2.5">
              {mainStep.processDetails.map((detail, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    );
  }

  // If Accessory Organ is selected
  if (accessory) {
    return (
      <aside className="w-full h-full flex flex-col bg-slate-900/90 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-4 text-slate-200">
        <div className="pb-3 mb-3.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {accessory.role}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {accessory.name}
          </h2>
          <p className="text-xs text-amber-400/90 font-medium italic">
            {accessory.latinName}
          </p>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Role & Overview */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
              <HeartPulse className="w-4 h-4 text-amber-400" />
              Deskripsi & Posisi Anatomis
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {accessory.description}
            </p>
          </div>

          {/* Fungsi terhadap Pencernaan */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Fungsi dalam Pencernaan
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {accessory.function}
            </p>
          </div>

          {/* Sekresi Cairan */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-950/80 border border-emerald-500/30 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
              <Droplets className="w-4 h-4 text-emerald-400" />
              Getah / Sekresi yang Dihasilkan
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/25 text-xs md:text-sm text-emerald-100 font-medium">
              {accessory.secretion}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
