import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

export const ArteryLegend: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl text-xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Visualization Color Legend & Semantics
        </h4>
        <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          UI Categories Only
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {/* High Category */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-rose-500/30">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50 shrink-0"></div>
          <div>
            <div className="font-bold text-rose-300">Elevated Demo (≥65%)</div>
            <div className="text-[10px] text-slate-400">Higher illustrative probability</div>
          </div>
        </div>

        {/* Moderate Category */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-amber-500/30">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50 shrink-0"></div>
          <div>
            <div className="font-bold text-amber-300">Moderate Demo (40-64%)</div>
            <div className="text-[10px] text-slate-400">Intermediate illustrative range</div>
          </div>
        </div>

        {/* Low Category */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 shrink-0"></div>
          <div>
            <div className="font-bold text-emerald-300">Lower Demo (&lt;40%)</div>
            <div className="text-[10px] text-slate-400">Lower illustrative range</div>
          </div>
        </div>

        {/* Neutral / Baseline */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 shrink-0"></div>
          <div>
            <div className="font-bold text-cyan-300">Selected / Neutral</div>
            <div className="text-[10px] text-slate-400">Active vessel highlight</div>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 space-y-1">
        <div className="flex items-start gap-1.5 text-slate-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Crucial Anatomical Disclaimer:</strong> Colors are interface visualization bins for demonstration only. They are NOT measured clinical stenosis percentages and do NOT identify physical plaque coordinates or geometry.
          </span>
        </div>
      </div>
    </div>
  );
};
