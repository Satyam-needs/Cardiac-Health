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
import { LocalFeatureContribution } from '../../types/explanation';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface FeatureContributionChartProps {
  contributions: LocalFeatureContribution[];
  targetName: string;
}

export const FeatureContributionChart: React.FC<FeatureContributionChartProps> = ({
  contributions,
  targetName,
}) => {
  const chartData = contributions.map((c) => ({
    name: c.featureName,
    value: c.contribution,
    patientValue: c.patientValue,
    category: c.category,
    direction: c.direction,
    interpretation: c.clinicalInterpretation,
    color: c.contribution >= 0 ? '#f43f5e' : '#06b6d4',
  }));

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">
              Local Feature Attribution Waterfall ({targetName})
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ILLUSTRATIVE SHAP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates how each patient physiological and laboratory factor shifts the simulated prediction
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Increases Demo Risk (+)
          </span>
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Lowers Demo Risk (-)
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              domain={[-0.15, 0.15]}
              tickFormatter={(v) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight="medium"
              tickLine={false}
              axisLine={false}
              width={130}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl text-xs backdrop-blur-md max-w-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="text-cyan-400 font-mono">{item.patientValue}</span>
                      </div>
                      <div
                        className={`font-black text-sm mt-1 ${
                          item.value >= 0 ? 'text-rose-400' : 'text-cyan-400'
                        }`}
                      >
                        Attribution: {item.value >= 0 ? `+${item.value}` : item.value}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {item.interpretation}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                        Illustrative attribution weight for UI testing
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="value" barSize={18} radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Methodology Note:</strong> In a production trained model, these attributions would be computed via SHAP (KernelSHAP or TreeSHAP) calculating Shapley values against an empirical baseline dataset. Here, values are illustrative deterministic attributions.
        </span>
      </div>
    </div>
  );
};
