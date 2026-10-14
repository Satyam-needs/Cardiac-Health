import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, AssessmentRecord, ExplainResponse } from '../services/api';
import { useAssessment } from '../context/AssessmentContext';
import { PredictionTargetCard } from '../components/cards/PredictionTargetCard';
import { TargetProbabilityBarChart } from '../components/charts/TargetProbabilityBarChart';
import { FeatureContributionChart } from '../components/charts/FeatureContributionChart';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  Calendar,
  HeartPulse,
  BrainCircuit,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Trash2,
  Share2,
} from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectArtery } = useAssessment();

  const [report, setReport] = useState<AssessmentRecord | null>(null);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchReport() {
      if (!id) return;
      try {
        const data = await api.assessments.get(id);
        if (isMounted) {
          setReport(data);
          // Fetch genuine explainability for CAD
          const expl = await api.predictions.explain('CAD', data.input_data).catch(() => null);
          if (isMounted) setExplanation(expl);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load report.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
        <h3 className="font-extrabold text-white text-base">Loading Secure Clinical Report</h3>
        <p className="text-xs text-slate-400">Verifying server-side authorization and loading ML outputs...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-white text-lg">Unable to Access Report</h3>
        <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { targets } = report.prediction_result;

  const handleOpen3D = () => {
    selectArtery('LAD');
    navigate('/heart-3d');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this clinical report? This action is permanent.')) {
      return;
    }
    try {
      await api.assessments.delete(report.id);
      navigate('/history');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Previous View</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              ID: {report.id}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              AUTHENTICATED REPORT
            </span>
            <span className="text-[10px] text-slate-400">
              Model: {report.model_version}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {report.patient_alias}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Recorded on {new Date(report.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpen3D}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Inspect in 3D Heart</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Delete this report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Result Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-white">
          Predicted Coronary Artery Outcomes (Multi-Target Pipeline)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(targets).map((t: any) => (
            <PredictionTargetCard
              key={t.targetId}
              target={{
                targetId: t.targetId,
                name: t.targetId,
                fullName: t.targetId === 'CAD' ? 'Coronary Artery Disease' : `${t.targetId} Coronary Artery`,
                simulatedProbability: t.probability,
                simulatedClass: t.classLabel,
                riskLevel: t.riskLevel,
                confidenceScoreIllustrative: t.confidence,
                plainLanguageSummary: `Trained model predicts ${t.riskLevel} likelihood (${(t.probability * 100).toFixed(1)}%).`,
                clinicalTerritory: t.targetId === 'LAD' ? 'Anterior LV Wall & Septum' : t.targetId === 'LCX' ? 'Posterolateral LV Wall' : t.targetId === 'RCA' ? 'Inferior LV & Right Ventricle' : 'Global Coronary Circulation',
                meshHighlightColor: t.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Target Probability Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TargetProbabilityBarChart
          targets={Object.fromEntries(
            Object.entries(targets).map(([k, v]: [string, any]) => [
              k,
              {
                targetId: v.targetId,
                name: v.targetId,
                fullName: v.targetId === 'CAD' ? 'Coronary Artery Disease' : `${v.targetId} Artery`,
                simulatedProbability: v.probability,
                simulatedClass: v.classLabel,
                riskLevel: v.riskLevel,
                confidenceScoreIllustrative: v.confidence,
                plainLanguageSummary: '',
                clinicalTerritory: '',
                meshHighlightColor: v.color,
              },
            ])
          ) as any}
        />

        {/* Genuine Feature Attribution Chart */}
        {explanation && explanation.contributions.length > 0 && (
          <FeatureContributionChart
            contributions={explanation.contributions.map((c) => ({
              featureKey: c.feature,
              featureName: c.feature,
              patientValue: c.patientValue,
              contribution: c.contribution,
              direction: c.direction,
              category: 'physiological',
              clinicalInterpretation: c.clinicalDescription,
            }))}
            targetName="CAD Global Model"
          />
        )}
      </div>

      {/* Clinical Input Summary Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <h4 className="font-extrabold text-sm text-white">Recorded Clinical Input Features</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {Object.entries(report.input_data).map(([key, val]) => (
            <div key={key} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase truncate">{key}</div>
              <div className="text-sm font-black text-cyan-300 mt-0.5">{String(val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer compact={false} />
    </div>
  );
};
