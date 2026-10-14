import React from 'react';
import { PredictionTargetId, TARGET_METADATA } from '../../types/prediction';
import { useAssessment } from '../../context/AssessmentContext';
import { Info, Layers } from 'lucide-react';

interface HeartFallback2DProps {
  selectedArtery: PredictionTargetId | 'all';
  onSelectArtery: (artery: PredictionTargetId | 'all') => void;
}

export const HeartFallback2D: React.FC<HeartFallback2DProps> = ({
  selectedArtery,
  onSelectArtery,
}) => {
  const { currentResult } = useAssessment();

  const ladOutput = currentResult?.targets.LAD;
  const lcxOutput = currentResult?.targets.LCX;
  const rcaOutput = currentResult?.targets.RCA;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0a0f1e] text-slate-200">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          2D Schematic Coronary Perfusion Map
        </div>

        <svg viewBox="0 0 400 400" className="w-full max-w-xs mx-auto drop-shadow-2xl">
          {/* Heart silhouette */}
          <path
            d="M200,340 C140,290 80,240 60,180 C40,120 70,70 120,70 C160,70 190,100 200,120 C210,100 240,70 280,70 C330,70 360,120 340,180 C320,240 260,290 200,340 Z"
            fill="#881337"
            stroke="#9f1239"
            strokeWidth="4"
          />

          {/* Aorta Arch */}
          <path
            d="M170,110 C160,50 210,30 240,40 C260,50 265,80 255,110"
            fill="none"
            stroke="#dc2626"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Pulmonary trunk */}
          <path
            d="M190,120 C180,80 150,75 130,85"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* LAD Path */}
          <path
            d="M195,125 Q180,200 205,320"
            fill="none"
            stroke={ladOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'LAD' ? 10 : 6}
            strokeLinecap="round"
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => onSelectArtery('LAD')}
          />
          {/* LAD Diagonal branch */}
          <path
            d="M188,180 Q150,220 140,260"
            fill="none"
            stroke={ladOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'LAD' ? 6 : 4}
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => onSelectArtery('LAD')}
          />

          {/* LCX Path */}
          <path
            d="M190,125 Q130,140 100,190"
            fill="none"
            stroke={lcxOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'LCX' ? 10 : 6}
            strokeLinecap="round"
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => onSelectArtery('LCX')}
          />
          {/* LCX Marginal branch */}
          <path
            d="M125,160 Q110,210 105,240"
            fill="none"
            stroke={lcxOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'LCX' ? 6 : 4}
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => onSelectArtery('LCX')}
          />

          {/* RCA Path */}
          <path
            d="M230,125 Q280,180 270,270"
            fill="none"
            stroke={rcaOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'RCA' ? 10 : 6}
            strokeLinecap="round"
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => onSelectArtery('RCA')}
          />
          {/* RCA Acute marginal branch */}
          <path
            d="M265,190 Q290,220 280,250"
            fill="none"
            stroke={rcaOutput?.meshHighlightColor || '#38bdf8'}
            strokeWidth={selectedArtery === 'RCA' ? 6 : 4}
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => onSelectArtery('RCA')}
          />

          {/* Target Labels */}
          <text
            x="195"
            y="235"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer font-mono"
            onClick={() => onSelectArtery('LAD')}
          >
            LAD
          </text>
          <text
            x="95"
            y="170"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer font-mono"
            onClick={() => onSelectArtery('LCX')}
          >
            LCX
          </text>
          <text
            x="275"
            y="190"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer font-mono"
            onClick={() => onSelectArtery('RCA')}
          >
            RCA
          </text>
        </svg>

        <p className="text-xs text-slate-400">
          Click any vessel to inspect target parameters and perfusion territory.
        </p>
      </div>
    </div>
  );
};
