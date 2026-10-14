import React from 'react';
import { ConfusionMatrixData } from '../../types/model';

interface ConfusionMatrixChartProps {
  data: ConfusionMatrixData;
  targetName: string;
}

export const ConfusionMatrixChart: React.FC<ConfusionMatrixChartProps> = ({ data, targetName }) => {
  const { truePositive, falsePositive, falseNegative, trueNegative, totalSamples } = data;

  const tpPct = ((truePositive / totalSamples) * 100).toFixed(1);
  const fpPct = ((falsePositive / totalSamples) * 100).toFixed(1);
  const fnPct = ((falseNegative / totalSamples) * 100).toFixed(1);
  const tnPct = ((trueNegative / totalSamples) * 100).toFixed(1);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-white">
            Confusion Matrix ({targetName})
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Illustrative 2x2 contingency classification breakdown (N = {totalSamples})
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Threshold τ = 0.50
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
        {/* True Positive */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-bold">
            <span>True Positive (TP)</span>
            <span className="font-mono text-emerald-400 font-bold">{tpPct}%</span>
          </div>
          <div className="text-2xl font-black text-white my-2">{truePositive}</div>
          <div className="text-[10px] text-slate-400">
            Correctly classified diseased cases
          </div>
        </div>

        {/* False Positive */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
            <span>False Positive (FP)</span>
            <span className="font-mono text-amber-400 font-bold">{fpPct}%</span>
          </div>
          <div className="text-2xl font-black text-white my-2">{falsePositive}</div>
          <div className="text-[10px] text-slate-400">
            Healthy flagged as diseased (False alarm)
          </div>
        </div>

        {/* False Negative */}
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between text-rose-300 text-xs font-bold">
            <span>False Negative (FN)</span>
            <span className="font-mono text-rose-400 font-bold">{fnPct}%</span>
          </div>
          <div className="text-2xl font-black text-white my-2">{falseNegative}</div>
          <div className="text-[10px] text-slate-400">
            Diseased missed as healthy (Clinical risk)
          </div>
        </div>

        {/* True Negative */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
            <span>True Negative (TN)</span>
            <span className="font-mono text-cyan-400 font-bold">{tnPct}%</span>
          </div>
          <div className="text-2xl font-black text-white my-2">{trueNegative}</div>
          <div className="text-[10px] text-slate-400">
            Correctly identified non-diseased
          </div>
        </div>
      </div>
    </div>
  );
};
