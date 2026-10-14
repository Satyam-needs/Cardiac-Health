import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { HeartCanvas } from '../components/heart3d/HeartCanvas';
import { ArteryInspector } from '../components/heart3d/ArteryInspector';
import { ArteryLegend } from '../components/heart3d/ArteryLegend';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  HeartPulse,
  Compass,
  Layers,
  Info,
  ShieldAlert,
  Sparkles,
  MousePointer,
  RotateCw,
} from 'lucide-react';

export const HeartExplorerPage: React.FC = () => {
  const { currentAssessment, currentResult, selectedArtery, selectArtery } = useAssessment();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
              Three.js / WebGL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Demonstration Highlighting
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-rose-500 animate-heartbeat" />
            Interactive 3D Heart Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore coronary arterial anatomy (LAD, LCX, RCA) and examine how prediction categories map onto myocardial perfusion territories.
          </p>
        </div>

        {currentAssessment && (
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Synchronized Assessment</div>
            <div className="font-mono text-cyan-300 font-bold">{currentAssessment.patientAlias}</div>
          </div>
        )}
      </div>

      {/* Main 3D Viewport + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Canvas Viewport (8 Columns on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <HeartCanvas
            selectedArtery={selectedArtery}
            onSelectArtery={selectArtery}
            targets={currentResult?.targets}
          />

          {/* Color Legend */}
          <ArteryLegend />
        </div>

        {/* Selected Artery Inspector Panel (4 Columns on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <ArteryInspector
            selectedArtery={selectedArtery}
            onSelectArtery={selectArtery}
          />
        </div>
      </div>

      {/* Anatomical Limitations & Technical Notes */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Anatomical Modeling Specifications & Clinical Boundaries
        </h3>
        <p className="leading-relaxed text-slate-400">
          The 3D heart model is an illustrative anatomical representation incorporating left/right ventricles, atria, aortic arch, pulmonary trunk, and epicardial coronary artery pathways (LAD, LCX, RCA). In accordance with medical ethics and challenge constraints:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
          <li className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>No Artificial Blockage Geometry:</strong> We do not synthesize fake physical plaque lumps or lumen narrowing without patient CT angiographic voxel data.</span>
          </li>
          <li className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Non-Patient-Specific Geometry:</strong> The model depicts canonical anatomical topography. Coronary dominance and arborization vary between real patients.</span>
          </li>
          <li className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>State Synchronization:</strong> Submitting a new assessment in the form automatically recalculates vessel risk and updates arterial illumination colors here.</span>
          </li>
          <li className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Accessible Controls:</strong> Users on touch devices or without 3D mouse capabilities can freely select arteries via the tabbed buttons above.</span>
          </li>
        </ul>
      </div>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer compact={true} />
    </div>
  );
};
