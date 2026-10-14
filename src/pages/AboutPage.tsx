import React from 'react';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import {
  Info,
  Layers,
  Cpu,
  HeartPulse,
  BrainCircuit,
  ShieldAlert,
  Code,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'React 19 & TypeScript', desc: 'Type-safe component-driven UI architecture and local state management.' },
    { name: 'Vite 8', desc: 'Ultra-fast build tooling, HMR, and modern ES bundle optimization.' },
    { name: 'Tailwind CSS v4', desc: 'Modern utility-first styling with sleek clinical dark mode tokens.' },
    { name: 'Three.js & React Three Fiber', desc: 'Declarative WebGL 3D rendering pipeline for anatomical heart geometries.' },
    { name: '@react-three/drei', desc: 'Orbit controls, camera choreography, and 3D HTML annotation helpers.' },
    { name: 'Recharts', desc: 'Composable SVG chart library for probability comparisons and SHAP attributions.' },
    { name: 'Lucide React', desc: 'Comprehensive medical and system icon set.' },
    { name: 'React Router v7', desc: 'Client-side SPA route orchestrator with deep linkable views.' },
  ];

  const implementationStatus = [
    { module: 'Interactive 3D Heart Explorer', status: 'Implemented', detail: 'Three.js anatomical model with LAD, LCX, RCA interactive meshes & pulsation' },
    { module: 'Clinical Data Entry Form', status: 'Implemented', detail: 'Structured form with units, tooltips, validation bounds, and presets' },
    { module: 'Prediction Dashboard', status: 'Implemented', detail: 'Multi-target CAD, LAD, LCX, RCA cards, comparative charts & 3D links' },
    { module: 'Explainable AI Interface', status: 'Implemented', detail: 'Local waterfall attributions, global ranking, and educational guide' },
    { module: 'Model Performance Page', status: 'Implemented', detail: 'Honest system status banner, confusion matrix, and ROC-AUC curve layouts' },
    { module: 'Session Assessment History', status: 'Implemented', detail: 'In-browser local storage case management with view, delete, and clear' },
    { module: 'Trained Machine Learning Model', status: 'Simulated / Demo', detail: 'Frontend deterministic rules; no live clinical inference model or weights' },
    { module: 'Backend Web Server', status: 'Not Implemented', detail: 'Frontend-only single page application without FastAPI/Node backend' },
    { module: 'Clinical Diagnostic Validation', status: 'Not Established', detail: 'Educational prototype; not evaluated on external prospective clinical cohorts' },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
            Technical Specification
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
            IIT Mandi Hackathon 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
          <Info className="w-7 h-7 text-cyan-400" />
          About CardioVision AI & Architecture Docs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore the engineering architecture, scientific boundaries, and future integration guide.
        </p>
      </div>

      {/* Mandatory Safety Disclaimer */}
      <MedicalDisclaimer compact={false} />

      {/* Project Mission & Overview */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          Project Overview & Hackathon Challenge
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>CardioVision AI</strong> is designed for <em>Track A: Cardiovascular Risk Visualization & Prediction Challenge</em> at the IIT Mandi Multimodal AI Hackathon 2026.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Cardiovascular disease (CVD) remains the leading cause of mortality worldwide. While machine learning models trained on electronic health records (EHR) and electrocardiograms can compute statistical risk scores, clinicians and patients often struggle to visualize where that risk physically manifests in the coronary vascular tree. CardioVision AI addresses this gap by combining tabular clinical data intake, multi-target coronary artery disease prediction dashboards, explainable AI (XAI) feature attribution waterfalls, and an interactive 3D anatomical heart visualization.
        </p>
      </section>

      {/* Implementation Status Checklist */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Current Implementation Status (Honest Audit)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">System Subsystem</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Technical Specifics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {implementationStatus.map((row) => (
                <tr key={row.module} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-semibold text-white">{row.module}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        row.status === 'Implemented'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : row.status.includes('Simulated')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          Frontend Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {techStack.map((tech) => (
            <div key={tech.name} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-xs text-white">{tech.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tech.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Known Limitations */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Technical & Clinical Limitations
        </h2>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Simulated Predictions:</strong> In this frontend prototype, all predicted probabilities and feature weights are deterministic illustrative formulas, not clinical inference outputs.</span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>No Anatomical Plaque Localization:</strong> Tabular models predict vessel disease likelihood, but cannot locate the exact millimeter coordinate of a lesion without 3D intravascular ultrasound (IVUS) or CT angiography segmentation.</span>
          </li>
          <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Canonical 3D Topography:</strong> The 3D heart represents standard human cardiac morphology. It does not reflect anatomical variations such as left coronary dominance or collateral circulation.</span>
          </li>
        </ul>
      </section>

      {/* Future Work & Real Model Integration Guide */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Future Model & API Integration Architecture
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The code is architected to allow seamless transition from the demonstration function `runDemoPrediction()` to a live backend inference service (FastAPI / Triton / ONNX Runtime Web) without modifying any UI components or 3D meshes.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>src/services/livePrediction.ts (Future Service Drop-in)</span>
            <span className="text-cyan-400">TypeScript API Binding</span>
          </div>
          <pre className="p-3 rounded-lg bg-black/60 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`// Example future production integration snippet:
export async function runProductionPrediction(
  assessment: AssessmentInput
): Promise<DemoPredictionResult> {
  const response = await fetch('https://api.cardiovision.ai/v1/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment),
  });

  const apiResult = await response.json();
  
  // Return typed result adhering to DemoPredictionResult contract
  return {
    assessmentId: assessment.id,
    source: 'live_clinical_model', // Explicitly distinct from 'demo'
    demoMode: false,
    generatedAt: new Date().toISOString(),
    targets: apiResult.targets,
    overallDemonstrationLabel: apiResult.overallRiskBand,
    // ...
  };
}`}
          </pre>
        </div>
      </section>
    </div>
  );
};
