import React from 'react';
import { AlertTriangle, Sparkles, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950/40 border-b border-cyan-500/20 px-4 py-1.5 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            FASTAPI ML BACKEND ACTIVE
          </span>
          <span className="text-slate-300 text-xs hidden md:inline">
            Trained on Z-Alizadeh Sani Cohort (UCI #411) • 4-Target Coronary Risk Pipeline
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive 3D Heart & XAI
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-amber-300/80 font-medium">
            Research prototype; not a clinical diagnosis
          </span>
        </div>
      </div>
    </div>
  );
};
