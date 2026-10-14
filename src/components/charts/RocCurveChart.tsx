import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface RocCurveChartProps {
  rocData: Array<{ falsePositiveRate: number; truePositiveRate: number; threshold: number }>;
  rocAuc: number;
  targetName: string;
}

export const RocCurveChart: React.FC<RocCurveChartProps> = ({ rocData, rocAuc, targetName }) => {
  const numericAuc = typeof rocAuc === 'number' ? rocAuc : (rocAuc as any)?.illustrativeValue ?? 0.85;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-sm text-white">
            ROC Discrimination Curve ({targetName})
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Sensitivity (TPR) vs 1 - Specificity (FPR) across decision thresholds
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
          AUC = {Number(numericAuc).toFixed(3)}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rocData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="falsePositiveRate"
              type="number"
              domain={[0, 1]}
              tickFormatter={(v) => v.toFixed(1)}
              stroke="#64748b"
              fontSize={11}
              label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis
              dataKey="truePositiveRate"
              type="number"
              domain={[0, 1]}
              tickFormatter={(v) => v.toFixed(1)}
              stroke="#64748b"
              fontSize={11}
              label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs">
                      <div className="text-cyan-400 font-bold">Cutoff Threshold: {item.threshold}</div>
                      <div className="text-slate-300 mt-0.5">Sensitivity (TPR): {(item.truePositiveRate * 100).toFixed(1)}%</div>
                      <div className="text-slate-400">FPR (1 - Spec): {(item.falsePositiveRate * 100).toFixed(1)}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Chance baseline line */}
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 1, y: 1 },
              ]}
              stroke="#475569"
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="truePositiveRate"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: '#06b6d4' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
