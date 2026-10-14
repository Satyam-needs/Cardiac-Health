import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Activity,
  Layers,
  MapPin,
  AlertCircle,
  BrainCircuit,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PredictionTargetId, TARGET_METADATA } from '../../types/prediction';
import { useAssessment } from '../../context/AssessmentContext';

interface ArteryInspectorProps {
  selectedArtery: PredictionTargetId | 'all';
  onSelectArtery: (artery: PredictionTargetId | 'all') => void;
}

export const ArteryInspector: React.FC<ArteryInspectorProps> = ({
  selectedArtery,
  onSelectArtery,
}) => {
  const navigate = useNavigate();
  const { currentResult } = useAssessment();

  const activeTargetId: PredictionTargetId =
    selectedArtery === 'all' ? 'CAD' : selectedArtery;

  const metadata = TARGET_METADATA[activeTargetId];
  const targetOutput = currentResult?.targets[activeTargetId];

  const arteries: Array<{ id: PredictionTargetId | 'all'; label: string; desc: string }> = [
    { id: 'LAD', label: 'LAD Artery', desc: 'Anterior Septal' },
    { id: 'LCX', label: 'LCX Artery', desc: 'Posterolateral' },
    { id: 'RCA', label: 'RCA Artery', desc: 'Inferior & RV' },
    { id: 'all', label: 'Whole Heart', desc: 'Global Circulation' },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 text-xs">
      {/* Keyboard-accessible Selector Pills */}
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Coronary Artery Focus</span>
          <span className="text-[10px] text-cyan-400 font-mono">Interactive / Accessible</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" role="tablist">
          {arteries.map((art) => {
            const isSelected = selectedArtery === art.id;
            return (
              <button
                key={art.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectArtery(art.id)}
                className={`px-3 py-2 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/40 border border-cyan-400/40'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <div className="font-semibold text-xs leading-none">{art.label}</div>
                <div className="text-[10px] opacity-80 mt-1 truncate">{art.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Details Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {metadata.name}
              </span>
              <h3 className="font-extrabold text-sm text-white">{metadata.fullName}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {metadata.anatomicalDescription}
            </p>
          </div>

          {targetOutput && (
            <div
              className={`shrink-0 px-2.5 py-1 rounded-lg text-right font-bold text-xs border ${
                targetOutput.riskLevel === 'high'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : targetOutput.riskLevel === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <div className="text-[9px] uppercase tracking-wide opacity-80">Demo Status</div>
              <div>{targetOutput.simulatedClass}</div>
            </div>
          )}
        </div>

        {/* Current Demo Metric Highlight */}
        {targetOutput ? (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Simulated Probability
              </div>
              <div className="text-xl font-black text-cyan-300 mt-0.5">
                {(targetOutput.simulatedProbability * 100).toFixed(1)}%
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5 italic">
                Illustrative model output
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Model Confidence (Simulated)
              </div>
              <div className="text-xl font-black text-slate-200 mt-0.5">
                {(targetOutput.confidenceScoreIllustrative * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Demonstration uncertainty
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 text-center text-xs">
            No active assessment loaded. Submit an assessment to see simulated predictions.
          </div>
        )}
      </div>

      {/* Anatomical Territory & Clinical Notes */}
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
            <MapPin className="w-3.5 h-3.5" />
            Anatomical Perfusion Territory
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {metadata.territorySupplied}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
            <Layers className="w-3.5 h-3.5" />
            Vascular Significance & Pathophysiology
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeTargetId === 'LAD' &&
              'Often termed the "widow-maker" artery; occlusion can cause extensive anterior wall infarction, cardiogenic shock, and bundle branch conduction blocks.'}
            {activeTargetId === 'LCX' &&
              'Occlusion impairs posterolateral LV wall motility and can lead to acute mitral valve regurgitation via papillary muscle ischemia.'}
            {activeTargetId === 'RCA' &&
              'Supplies the sinoatrial (SA) node in 60% and AV node in 90% of individuals; proximal RCA disease frequently triggers sinus bradycardia or complete heart block.'}
            {activeTargetId === 'CAD' &&
              'Systemic epicardial atherosclerotic involvement characterized by fibrofatty plaque buildup and vascular calcification across major arterial trunks.'}
          </p>
        </div>
      </div>

      {/* Navigation action to XAI */}
      <button
        onClick={() => navigate('/explainability')}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
      >
        <BrainCircuit className="w-4 h-4" />
        <span>Inspect Feature Contributions for {metadata.name} (XAI)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Safety Note */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Limitation:</strong> The 3D model presents generalized coronary anatomy. It cannot reflect anatomical variants (e.g. left dominance, ramus intermedius) or patient-specific CT angio reconstructions.
        </span>
      </div>
    </div>
  );
};
