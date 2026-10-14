import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-slate-300 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                Mandatory Clinical & Safety Disclaimer
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30 font-medium">
                Non-Diagnostic Prototype
              </span>
            </div>
            <p className="text-xs text-rose-200/90 font-medium mt-1 leading-relaxed">
              CardioVision AI is a frontend research and educational prototype. The displayed prediction values and explanations are simulated examples, not outputs from a trained clinical model. They are not a diagnosis and must not be used to make medical decisions or replace professional assessment, diagnostic testing, or medical care.
            </p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-rose-300 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-rose-500/20 transition-colors shrink-0"
            aria-label="Toggle disclaimer details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-start gap-1.5">
            <span className="text-rose-400 font-bold">•</span>
            <span><strong>No Stenosis Measurement:</strong> Simulated output probabilities do NOT represent percentages of arterial blockage or luminal narrowing.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-rose-400 font-bold">•</span>
            <span><strong>No Lesion Localization:</strong> The interface does not localize specific physical plaque coordinates or quantify lesion length.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-rose-400 font-bold">•</span>
            <span><strong>Generic 3D Representation:</strong> The 3D heart model is an illustrative anatomical reference, NOT patient-specific imaging or CT reconstruction.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-rose-400 font-bold">•</span>
            <span><strong>Non-Threshold Colors:</strong> Highlight colors are UI presentation bins, NOT validated clinical intervention thresholds.</span>
          </div>
          <div className="md:col-span-2 mt-1 p-2 rounded bg-rose-900/40 border border-rose-500/30 text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
            <span>A low simulated value must never be used to reassure someone experiencing acute chest pain, shortness of breath, or cardiac symptoms. Seek emergency medical care immediately for real symptoms.</span>
          </div>
        </div>
      )}
    </div>
  );
};
