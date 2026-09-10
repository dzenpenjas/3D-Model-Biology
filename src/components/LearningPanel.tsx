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
  ShieldCheck,
  Check,
  Droplets,
  FlaskConical,
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
      <aside className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-4 text-slate-200">
        {/* Header: Organ Title & Latin Name */}
        <div className="pb-3 mb-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-950/70 text-cyan-300 border border-cyan-700/50">
              Tahap {mainStep.index + 1} Saluran Utama
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-slate-300">
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
          {/* Card 1: Fungsi Utama Organ */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Fungsi Organ
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {mainStep.function}
            </p>
          </div>

          {/* Card 2: Apa yang Sedang Terjadi pada Makanan? */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950/80 border border-amber-500/30 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
              <Utensils className="w-4 h-4 text-amber-400" />
              Kondisi Makanan
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/20 text-xs md:text-sm text-amber-100 font-medium">
              {mainStep.foodState}
            </div>
          </div>

          {/* Card 3: Enzim & Cairan Pencernaan Terlibat */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              Enzim & Zat Kimiawi Terlibat
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mainStep.keyEnzymes.map((enzyme, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-teal-950/60 text-teal-200 border border-teal-800/50"
                >
                  {enzyme}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Detail Proses & Tahapan Biologis */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Penjelasan Tahapan Proses
            </div>
            <ul className="space-y-2">
              {mainStep.processDetails.map((detail, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
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
      <aside className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-l border-slate-800/80 overflow-y-auto custom-scrollbar p-4 text-slate-200">
        <div className="pb-3 mb-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-950/70 text-amber-300 border border-amber-700/50">
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
              <Sparkles className="w-4 h-4 text-amber-400" />
              Peran Utama
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {accessory.description}
            </p>
          </div>

          {/* Fungsi terhadap Makanan */}
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
              Getah / Zat yang Dihasilkan
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20 text-xs md:text-sm text-emerald-100 font-medium">
              {accessory.secretion}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
