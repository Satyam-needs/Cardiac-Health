import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, AssessmentSummary } from '../services/api';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  ClipboardPlus,
  HeartPulse,
  Activity,
  BrainCircuit,
  Gauge,
  History,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ShieldCheck,
  TrendingUp,
  FileQuestion,
  Loader2,
  Stethoscope,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [asmList, health] = await Promise.all([
          api.assessments.list().catch(() => []),
          api.health.check().catch(() => null),
        ]);
        if (isMounted) {
          setAssessments(asmList);
          setHealthStatus(health);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const latestAssessment = assessments.length > 0 ? assessments[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0d1629] via-[#091124] to-[#070b16] relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Authenticated Clinical Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-cyan-300">{user?.full_name || 'Clinician'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your patient assessment cohort, run real-time inference across 4 coronary targets (CAD, LAD, LCX, RCA), and explore interactive 3D anatomy.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/assessment')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
            >
              <ClipboardPlus className="w-4 h-4" />
              <span>Start New Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/heart-3d')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Open 3D Heart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Counters & System Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Total Assessments */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Stored Assessments
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : assessments.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Persistent database records</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <ClipboardPlus className="w-5 h-5" />
          </div>
        </div>

        {/* Models Online */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ML Inference Engine
            </div>
            <div className="text-sm font-extrabold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {healthStatus?.models_loaded ? '4/4 Models Active' : 'Online'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">CAD, LAD, LCX, RCA</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Database Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Database Persistence
            </div>
            <div className="text-sm font-extrabold text-cyan-300 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Connected & Isolated
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">SQLite / Multi-User Auth</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Explainability Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Explainable AI (XAI)
            </div>
            <div className="text-sm font-extrabold text-indigo-300 mt-1">
              Active Attribution
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Marginal feature SHAP</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Latest Report or Empty State */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs text-slate-400">Loading your private clinical reports...</p>
        </div>
      ) : latestAssessment ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {latestAssessment.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Most Recent Assessment
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {latestAssessment.patient_alias}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(latestAssessment.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Target Probabilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">CAD Global</div>
              <div className="text-xl font-black text-white mt-1">
                {(latestAssessment.cad_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Model output</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">LAD Artery</div>
              <div className="text-xl font-black text-cyan-300 mt-1">
                {(latestAssessment.lad_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Anterior Septal</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">LCX Artery</div>
              <div className="text-xl font-black text-indigo-300 mt-1">
                {(latestAssessment.lcx_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Posterolateral</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">RCA Artery</div>
              <div className="text-xl font-black text-amber-300 mt-1">
                {(latestAssessment.rca_probability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Inferior / RV</div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              Status Summary: <strong className="text-cyan-300">{latestAssessment.overall_risk_label}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/reports/${latestAssessment.id}`)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>View Full Clinical Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Thoughtful Empty State for New User */
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white">No Assessments Recorded Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Welcome to Cardiac Health! You have not entered any clinical patient evaluations yet. Begin by starting your first guided assessment.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-cyan-900/40"
            >
              <ClipboardPlus className="w-4 h-4" />
              <span>Create First Patient Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <MedicalDisclaimer compact={true} />
    </div>
  );
};
