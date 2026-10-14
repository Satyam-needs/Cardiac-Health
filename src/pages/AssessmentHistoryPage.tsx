import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, AssessmentSummary } from '../services/api';
import { useAssessment } from '../context/AssessmentContext';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  History,
  Trash2,
  HeartPulse,
  Activity,
  Calendar,
  ClipboardPlus,
  ShieldCheck,
  FileQuestion,
  Loader2,
  ArrowRight,
  Database,
} from 'lucide-react';

export const AssessmentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history: localHistory, selectArtery } = useAssessment();

  const [backendAssessments, setBackendAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'backend' | 'local'>('backend');

  const fetchBackendAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.assessments.list();
      setBackendAssessments(data);
      if (data.length > 0) {
        setActiveTab('backend');
      } else if (localHistory.length > 0) {
        setActiveTab('local');
      }
    } catch {
      setActiveTab('local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendAssessments();
  }, []);

  const handleDeleteBackend = async (id: string) => {
    if (!window.confirm('Delete this assessment record?')) return;
    try {
      await api.assessments.delete(id);
      setBackendAssessments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleInspect3D = (target: string = 'LAD') => {
    selectArtery(target as any);
    navigate('/heart-3d');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
              Assessment Logs
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
              Isolated Per-User Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            <History className="w-7 h-7 text-cyan-400" />
            Assessment History & Case Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your private saved cardiovascular assessment records and machine-learning predictions.
          </p>
        </div>

        <button
          onClick={() => navigate('/assessment')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
        >
          <ClipboardPlus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Source Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'backend'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Authenticated Cloud DB ({backendAssessments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'local'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Browser Session ({localHistory.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Server-side ownership strictly enforced
        </span>
      </div>

      {/* Backend Assessment Records */}
      {activeTab === 'backend' && (
        <>
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
              <p className="text-xs text-slate-400">Loading your persistent records...</p>
            </div>
          ) : backendAssessments.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-4">
              <FileQuestion className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="font-extrabold text-base text-white">No Stored Assessments in Database</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit an assessment while signed in to save persistent clinical reports.
              </p>
              <button
                onClick={() => navigate('/assessment')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Create Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {backendAssessments.map((a) => (
                <div
                  key={a.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        {a.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                          a.overall_risk_category === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : a.overall_risk_category === 'moderate'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {a.overall_risk_label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(a.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">{a.patient_alias}</h3>

                    {/* Vessel Probabilities */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        CAD: <strong className="text-white">{(a.cad_probability * 100).toFixed(0)}%</strong>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        LAD: <strong className="text-cyan-300">{(a.lad_probability * 100).toFixed(0)}%</strong>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        LCX: <strong className="text-indigo-300">{(a.lcx_probability * 100).toFixed(0)}%</strong>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        RCA: <strong className="text-amber-300">{(a.rca_probability * 100).toFixed(0)}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <button
                      onClick={() => navigate(`/reports/${a.id}`)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleInspect3D('LAD')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                      <span>3D Heart</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBackend(a.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Local Session Records */}
      {activeTab === 'local' && (
        <div className="space-y-3">
          {localHistory.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
              No local browser assessments in memory.
            </div>
          ) : (
            localHistory.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{item.patientAlias}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ID: {item.id} • {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/predictions')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                >
                  Open in Dashboard
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Safety Notice */}
      <MedicalDisclaimer compact={true} />
    </div>
  );
};
