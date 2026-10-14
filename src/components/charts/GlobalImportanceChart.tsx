import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { GlobalFeatureImportance } from '../../types/explanation';
import { BarChart3, Layers } from 'lucide-react';

interface GlobalImportanceChartProps {
  importance: GlobalFeatureImportance[];
}

export const GlobalImportanceChart: React.FC<GlobalImportanceChartProps> = ({ importance }) => {
  const chartData = importance.map((item) => ({
    ...item,
    importancePercent: Number((item.meanAbsoluteImportance * 100).toFixed(1)),
  }));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ecg':
        return '#06b6d4'; // Cyan
      case 'laboratory':
        return '#3b82f6'; // Blue
      case 'physiological':
        return '#8b5cf6'; // Violet
      case 'demographic':
        return '#14b8a6'; // Teal
      case 'history':
        return '#f59e0b'; // Amber
      default:
        return '#64748b';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">
              Global Feature Importance Ranking (Mean |SHAP|)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              POPULATION BENCHMARK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Illustrative average magnitude of feature influence across validation cohorts
          </p>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> ECG
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Lab
          </span>
          <span className="flex items-center gap-1 text-violet-400">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span> Physiological
          </span>
          <span className="flex items-center gap-1 text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span> Demographics
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> History
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 35]}
              tickFormatter={(v) => `${v}%`}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="featureName"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight="medium"
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl text-xs backdrop-blur-md max-w-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">Rank #{item.rank}: {item.featureName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-cyan-300 font-black text-sm">
                        Mean |SHAP|: {item.importancePercent}%
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {item.clinicalDescription}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="importancePercent" barSize={18} radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
