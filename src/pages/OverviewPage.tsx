import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  ClipboardPlus,
  Activity,
  BrainCircuit,
  Gauge,
  History,
  Info,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  UserPlus,
  Compass,
  FileText,
  Lock,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { HeartCanvas } from '../components/heart3d/HeartCanvas';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadPreset } = useAssessment();
  const [selectedHeroArtery, setSelectedHeroArtery] = useState<'CAD' | 'LAD' | 'LCX' | 'RCA' | 'all'>('LAD');

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Create an Account',
      desc: 'Register an account or sign in to establish a secure, isolated clinician session for private patient assessments.',
      icon: Lock,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      step: '02',
      title: 'Complete Assessment',
      desc: 'Enter verified clinical measurements including hemodynamics, lipid biomarkers, ECG patterns, and medical history.',
      icon: ClipboardPlus,
      color: 'from-cyan-600 to-teal-600',
    },
    {
      step: '03',
      title: 'Review Predictions',
      desc: 'Execute real-time machine-learning inference across 4 distinct coronary targets: CAD, LAD, LCX, and RCA.',
      icon: Activity,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      step: '04',
      title: 'Explore 3D Heart',
      desc: 'Inspect anatomical coronary artery structures dynamically highlighted according to model risk classifications.',
      icon: HeartPulse,
      color: 'from-rose-600 to-amber-600',
    },
    {
      step: '05',
      title: 'Inspect Explanations',
      desc: 'Review local feature-contribution attributions (SHAP) and population feature importance to understand model factors.',
      icon: BrainCircuit,
      color: 'from-indigo-600 to-violet-600',
    },
    {
      step: '06',
      title: 'Review Saved Reports',
      desc: 'Access persistent private assessment logs, re-examine anatomical mappings, and compare historical patient evaluations.',
      icon: History,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const featureCards = [
    {
      title: 'Guided Cardiovascular Assessment',
      desc: 'A structured multi-step intake flow with clinical units, physiological range validations, and terminology tooltips.',
      icon: ClipboardPlus,
      to: '/assessment',
      tag: 'Validated Input',
    },
    {
      title: 'Multi-Target Prediction Engine',
      desc: 'Binary classification pipelines for Coronary Artery Disease (CAD) and individual vessels (LAD, LCX, RCA) trained on UCI #411.',
      icon: Activity,
      to: '/predictions',
      tag: 'CAD • LAD • LCX • RCA',
    },
    {
      title: 'Interactive 3D Heart Explorer',
      desc: 'Real-time WebGL anatomical heart model with user-controlled rotation, zoom, vessel inspection, and physiological heartbeat pulse.',
      icon: HeartPulse,
      to: '/heart-3d',
      tag: 'Three.js / R3F',
    },
    {
      title: 'Explainable AI (XAI)',
      desc: 'Transparent model interpretability via local feature attribution waterfalls and global feature rankings.',
      icon: BrainCircuit,
      to: '/explainability',
      tag: 'SHAP Attribution',
    },
    {
      title: 'Transparent Model Performance',
      desc: 'Honest diagnostic evaluation metrics (ROC-AUC, Sensitivity, Specificity, Confusion Matrices) based on 5-fold cross-validation.',
      icon: Gauge,
      to: '/model-performance',
      tag: 'Empirical Metrics',
    },
    {
      title: 'Private Assessment History',
      desc: 'Server-side authenticated persistent storage with strict ownership access control and full report re-inspection.',
      icon: History,
      to: '/history',
      tag: 'Encrypted Database',
    },
  ];

  return (
    <div className="space-y-14">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0c1427] via-[#091020] to-[#060a14] p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>IIT Mandi Multimodal AI Hackathon 2026 • Track A</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Understand cardiovascular risk.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Explore the heart with greater clarity.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Cardiac Health bridges clinical physiological measurements with trained multi-target machine learning models, transparent feature explanations, and an interactive 3D coronary artery visualizer.
            </p>

            {/* Part 5 Functional Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-cyan-900/40 transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white font-bold text-sm border border-slate-700 hover:border-cyan-500/50 flex items-center gap-2.5 shadow-md transition-all"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Quick Presets for Instant Demo */}
            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Test Profile:</span>
              <button
                onClick={() => {
                  loadPreset(0);
                  navigate('/predictions');
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 font-medium transition-colors"
              >
                High Risk Case
              </button>
              <button
                onClick={() => {
                  loadPreset(1);
                  navigate('/predictions');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 font-medium transition-colors"
              >
                Moderate LAD Case
              </button>
              <button
                onClick={() => {
                  loadPreset(2);
                  navigate('/predictions');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 font-medium transition-colors"
              >
                Low Risk Baseline
              </button>
            </div>
          </div>

          {/* Right: Interactive 3D Heart Hero Visual */}
          <div className="lg:col-span-5 h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-800/80 bg-[#060a14]/60 relative shadow-inner">
            <HeartCanvas
              selectedArtery={selectedHeroArtery}
              onSelectArtery={(art) => setSelectedHeroArtery(art)}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1.5 font-medium text-cyan-300">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Interactive 3D Heart Explorer
              </span>
              <span className="text-slate-400">Drag to rotate • Scroll to zoom</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Safety Notice */}
      <MedicalDisclaimer compact={false} />

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Structured Clinical Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How Cardiac Health Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent 6-stage pipeline from authenticated data entry to multi-target inference and 3D visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.step}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      STEP {ws.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${ws.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              System Capabilities
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Core Platform Features
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Engineered to empower clinicians and researchers with authentic machine learning and anatomical mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.to}
                onClick={() => navigate(card.to)}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-cyan-500/50 flex items-center justify-center text-cyan-400 transition-colors">
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1.5">
                  <span>Open Feature</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dataset & Architecture Disclosure */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Research Foundation & Dataset Lineage</span>
        </div>
        <h3 className="text-xl font-black text-white">
          Z-Alizadeh Sani Cardiovascular Cohort (UCI Machine Learning Repository #411)
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Cardiac Health is trained on the empirically verified Z-Alizadeh Sani Extension dataset, containing 303 patient records across 59 multimodal features (demographic, symptoms, ECG findings, echocardiographic values, and biochemistry labs).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Leakage Prevention</div>
            <p className="text-slate-300 mt-1 text-[11px]">
              Direct angiographic outcome columns (Cath, target labels) are strictly excluded from predictor features.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Multi-Target Classification</div>
            <p className="text-slate-300 mt-1 text-[11px]">
              Independent Scikit-Learn pipelines evaluate risk across CAD, LAD, LCX, and RCA vessel territories.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Server-Side Authorization</div>
            <p className="text-slate-300 mt-1 text-[11px]">
              FastAPI + SQLite enforces persistent user authentication and private patient report isolation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
