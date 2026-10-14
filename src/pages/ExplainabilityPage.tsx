import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { PredictionTargetId, TARGET_METADATA } from '../types/prediction';
import { FeatureContributionChart } from '../components/charts/FeatureContributionChart';
import { GlobalImportanceChart } from '../components/charts/GlobalImportanceChart';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  BrainCircuit,
  Info,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  CheckCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ExplainabilityPage: React.FC = () => {
  const { currentAssessment, currentResult, currentExplanation } = useAssessment();
  const [selectedTarget, setSelectedTarget] = useState<PredictionTargetId>('CAD');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!currentAssessment || !currentResult || !currentExplanation) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-xl mx-auto my-12 space-y-4">
        <FileQuestion className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Assessment Data Loaded</h2>
        <p className="text-xs text-slate-400">
          Load or submit a patient assessment to visualize local and global feature attribution waterfalls.
        </p>
      </div>
    );
  }

  const targetExplanation = currentExplanation.targetExplanations[selectedTarget];
  const targetMeta = TARGET_METADATA[selectedTarget];
  const targetOutput = currentResult.targets[selectedTarget];

  const positiveFeatures = targetExplanation.localContributions.filter((c) => c.direction === 'increases_risk');
  const negativeFeatures = targetExplanation.localContributions.filter((c) => c.direction === 'decreases_risk');

  const faqs = [
    {
      q: 'What is SHAP (SHapley Additive exPlanations)?',
      a: 'SHAP is a game-theoretic framework that connects cooperative game theory with machine learning interpretability. It calculates the fair marginal contribution of each patient feature to the model’s prediction compared to an expected reference population baseline.',
    },
    {
      q: 'What is the difference between Local and Global explanations?',
      a: 'A local explanation explains why a model arrived at a specific risk value for this individual patient at this point in time. A global explanation aggregates attributions across thousands of patients to reveal which biomarkers the model relies on most overall.',
    },
    {
      q: 'Does feature importance prove clinical causation?',
      a: 'No. A high SHAP attribution value proves that a feature shifted the mathematical output of the model, not that it mechanically caused vascular atherosclerosis. For instance, age or medication flags may have high predictive value without directly causing vascular stenosis.',
    },
    {
      q: 'How does feature correlation (multicollinearity) affect explanations?',
      a: 'When biomarkers are strongly correlated (e.g. Total Cholesterol and LDL, or Age and Systolic BP), attribution algorithms can split the importance across both variables, which can make individual contributions appear artificially lower unless grouped.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
              Explainable AI (XAI)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Illustrative Attributions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-indigo-400" />
            Explainable AI (XAI) Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understand how patient-specific clinical measurements influence simulated prediction outcomes.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Case</div>
          <div className="font-mono text-cyan-300 font-bold">{currentAssessment.patientAlias}</div>
        </div>
      </div>

      {/* Mandatory Prominent Illustrative Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3 shadow-lg">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-0.5">
            ILLUSTRATIVE EXPLANATION — NOT GENERATED BY A TRAINED MODEL
          </div>
          The feature contribution weights and population rankings below are synthesized rule-based demonstrations. They show how clinical AI systems present SHAP values to clinicians, but are not calculated from an empirical trained machine learning model.
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Select Prediction Target for Local Feature Attribution:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['CAD', 'LAD', 'LCX', 'RCA'] as PredictionTargetId[]).map((tId) => {
            const isSelected = selectedTarget === tId;
            const meta = TARGET_METADATA[tId];
            const out = currentResult.targets[tId];
            return (
              <button
                key={tId}
                onClick={() => setSelectedTarget(tId)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-cyan-300">{tId}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {(out.simulatedProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1 truncate">{meta.fullName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Summary Stats Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold">Selected Target</div>
          <div className="text-base font-extrabold text-white mt-0.5">{targetMeta.fullName}</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold">Simulated Outcome</div>
          <div className="text-base font-black text-cyan-300 mt-0.5">
            {(targetOutput.simulatedProbability * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold">Baseline Prior</div>
          <div className="text-base font-bold text-slate-300 mt-0.5">
            {(targetExplanation.baseProbability * 100).toFixed(0)}% (Population mean)
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold">Net Feature Shift</div>
          <div
            className={`text-base font-black mt-0.5 ${
              targetOutput.simulatedProbability >= targetExplanation.baseProbability
                ? 'text-rose-400'
                : 'text-cyan-400'
            }`}
          >
            {targetOutput.simulatedProbability >= targetExplanation.baseProbability ? '+' : ''}
            {((targetOutput.simulatedProbability - targetExplanation.baseProbability) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Local Explanation Waterfall Chart */}
      <FeatureContributionChart
        contributions={targetExplanation.localContributions}
        targetName={targetMeta.fullName}
      />

      {/* Positive & Negative Drivers Breakout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk Elevating Factors */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Top Factors Increasing Simulated Risk</span>
          </div>
          <div className="space-y-2">
            {positiveFeatures.slice(0, 4).map((f) => (
              <div
                key={f.featureKey}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{f.featureName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Measured: <strong className="text-cyan-300">{f.patientValue}</strong> • {f.clinicalInterpretation}
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-rose-400 ml-2">
                  +{f.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Mitigating / Lowering Factors */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            <span>Top Factors Lowering Simulated Risk</span>
          </div>
          <div className="space-y-2">
            {negativeFeatures.slice(0, 4).map((f) => (
              <div
                key={f.featureKey}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{f.featureName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Measured: <strong className="text-cyan-300">{f.patientValue}</strong> • {f.clinicalInterpretation}
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-cyan-400 ml-2">
                  {f.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Feature Importance Chart */}
      <GlobalImportanceChart importance={currentExplanation.globalImportance} />

      {/* Educational Explainability Section */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Educational Guide to Explainable Medical AI</span>
        </div>
        <h3 className="text-xl font-black text-white">
          Why Explainability is Mission-Critical in Clinical Decision Support
        </h3>

        <div className="space-y-2.5 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Disclaimer */}
      <MedicalDisclaimer compact={true} />
    </div>
  );
};
