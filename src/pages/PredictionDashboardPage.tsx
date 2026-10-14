import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { PredictionTargetCard } from '../components/cards/PredictionTargetCard';
import { TargetProbabilityBarChart } from '../components/charts/TargetProbabilityBarChart';
import { FeatureContributionChart } from '../components/charts/FeatureContributionChart';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  Activity,
  HeartPulse,
  BrainCircuit,
  ClipboardPlus,
  Sparkles,
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  FileQuestion,
  RotateCcw,
} from 'lucide-react';

export const PredictionDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAssessment, currentResult, currentExplanation, loadPreset } = useAssessment();

  // If no assessment exists (empty state)
  if (!currentAssessment || !currentResult) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-xl mx-auto my-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">No Active Assessment Found</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Please enter patient physiological variables in the assessment form or load an illustrative synthetic demo profile to explore the multi-target dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/assessment')}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30"
          >
            <ClipboardPlus className="w-4 h-4" />
            <span>Create New Assessment</span>
          </button>
          <button
            onClick={() => loadPreset(0)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Load Demo Case Alpha</span>
          </button>
        </div>
      </div>
    );
  }

  const { targets } = currentResult;

  return (
    <div className="space-y-8">
      {/* Top Banner / Assessment Metadata Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold tracking-wider">
              CASE: {currentAssessment.id}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold tracking-wider">
              FRONTEND DEMO
            </span>
            {currentAssessment.isExamplePreset && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Preset Profile
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{currentAssessment.patientAlias}</span>
            <span className="text-xs font-normal text-slate-400">
              ({currentAssessment.age} yrs, {currentAssessment.sex})
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(currentResult.generatedAt).toLocaleString()}
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Overall Status Demo: <strong className="text-cyan-300">{currentResult.overallDemonstrationLabel}</strong>
            </span>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/heart-3d')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span>Open in 3D Heart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate('/explainability')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>Explainable AI</span>
          </button>

          <button
            onClick={() => navigate('/assessment')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold"
          >
            New Form
          </button>
        </div>
      </div>

      {/* Medical Interpretation Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-0.5">
            Demonstration Interpretation Notice
          </div>
          These are simulated frontend demonstration outputs, not predictions from a trained model. They do not establish the presence, absence, severity, or location of coronary artery disease.
        </div>
      </div>

      {/* Target Cards Grid (CAD, LAD, LCX, RCA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Coronary Artery Disease & Vessel-Specific Targets
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic simulated outcomes for global CAD and individual epicardial arterial beds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PredictionTargetCard target={targets.CAD} />
          <PredictionTargetCard target={targets.LAD} />
          <PredictionTargetCard target={targets.LCX} />
          <PredictionTargetCard target={targets.RCA} />
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart */}
        <TargetProbabilityBarChart targets={targets} />

        {/* Local Feature Attribution Preview */}
        {currentExplanation && (
          <FeatureContributionChart
            contributions={currentExplanation.targetExplanations.CAD.localContributions.slice(0, 5)}
            targetName="CAD Global Model"
          />
        )}
      </div>

      {/* Mandatory Safety Disclaimer Banner */}
      <MedicalDisclaimer compact={false} />
    </div>
  );
};
