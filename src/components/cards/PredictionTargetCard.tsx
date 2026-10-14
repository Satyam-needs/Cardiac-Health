import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TargetPredictionOutput, TARGET_METADATA } from '../../types/prediction';
import { useAssessment } from '../../context/AssessmentContext';
import {
  HeartPulse,
  ArrowRight,
  Info,
  Layers,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

interface PredictionTargetCardProps {
  target: TargetPredictionOutput;
}

export const PredictionTargetCard: React.FC<PredictionTargetCardProps> = ({ target }) => {
  const navigate = useNavigate();
  const { selectArtery } = useAssessment();
  const meta = TARGET_METADATA[target.targetId];

  const handleInspect3D = () => {
    selectArtery(target.targetId);
    navigate('/heart-3d');
  };

  const getBorderColor = () => {
    switch (target.riskLevel) {
      case 'high':
        return 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20';
      case 'moderate':
        return 'border-amber-500/40 hover:border-amber-500/70 shadow-amber-950/20';
      case 'low':
        return 'border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-950/20';
      default:
        return 'border-slate-800 hover:border-slate-700';
    }
  };

  const getBadgeStyle = () => {
    switch (target.riskLevel) {
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${getBorderColor()}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                {target.name}
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                DEMO
              </span>
            </div>
            <h3 className="font-bold text-base text-white mt-1.5 leading-snug">
              {meta.fullName}
            </h3>
          </div>

          <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 ${getBadgeStyle()}`}>
            {target.simulatedClass}
          </div>
        </div>

        {/* Plain language anatomical description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {meta.anatomicalDescription}
        </p>

        {/* Probability display */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400">
              Simulated Probability
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              {(target.simulatedProbability * 100).toFixed(1)}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${target.simulatedProbability * 100}%`,
                backgroundColor: target.meshHighlightColor,
              }}
            />
          </div>

          <div className="mt-2 text-[10px] text-slate-400 leading-tight italic flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Simulated example probability — not a clinical prediction or stenosis %.</span>
          </div>
        </div>

        {/* Perfusion territory summary */}
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 text-[11px] text-slate-400 mb-4 flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Territory:</strong> {target.clinicalTerritory}
          </span>
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={handleInspect3D}
          className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Inspect in 3D Heart</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
