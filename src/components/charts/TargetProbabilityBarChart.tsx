import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TargetPredictionOutput, PredictionTargetId } from '../../types/prediction';

interface TargetProbabilityBarChartProps {
  targets: Record<PredictionTargetId, TargetPredictionOutput>;
}

export const TargetProbabilityBarChart: React.FC<TargetProbabilityBarChartProps> = ({ targets }) => {
  const data = Object.values(targets).map((t) => ({
    name: t.name,
    fullName: t.fullName,
    probability: Number((t.simulatedProbability * 100).toFixed(1)),
    color: t.meshHighlightColor,
    riskLevel: t.riskLevel,
    simulatedClass: t.simulatedClass,
  }));

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="font-extrabold text-base text-white">
            Simulated Target Probabilities Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Illustrative model likelihoods across CAD and specific coronary artery territories
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          FRONTEND DEMO
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl text-xs backdrop-blur-md">
                      <div className="font-bold text-white mb-0.5">{item.fullName}</div>
                      <div className="text-cyan-300 font-extrabold text-sm">
                        {item.probability}% Simulated Probability
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Category: <strong className="text-slate-200">{item.simulatedClass}</strong>
                      </div>
                      <div className="text-[9px] text-amber-400 mt-1 italic">
                        Simulated demonstration output — not clinical diagnosis
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Visual threshold guides */}
            <ReferenceLine x={40} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '40% Mod', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={65} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: '65% High', fill: '#f43f5e', fontSize: 10, position: 'top' }} />
            <Bar dataKey="probability" radius={[0, 8, 8, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>Reference thresholds (40%, 65%) are illustrative interface display bands.</span>
        <span className="font-medium text-slate-300">Deterministic calculation based on input risk factors</span>
      </div>
    </div>
  );
};
