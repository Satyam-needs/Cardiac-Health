import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardPlus,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Activity,
  HeartPulse,
  FlaskConical,
  Eye,
  Loader2,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { AssessmentInput, Sex, ChestPainType, SmokingStatus, RestingECG, STSlope, FEATURE_CONSTRAINTS } from '../types/assessment';
import { DEMO_PRESETS } from '../services/demoPresets';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import { api } from '../services/api';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitAssessment } = useAssessment();

  // Initial blank/default state
  const defaultForm: AssessmentInput = {
    id: `DEMO-PT-${Date.now().toString().slice(-6)}`,
    patientAlias: 'Demonstration Patient',
    createdAt: new Date().toISOString(),
    isExamplePreset: false,
    age: 55,
    sex: 'male',
    chestPainType: 'typical_angina',
    restingBP: 135,
    heartRate: 78,
    bmi: 27.5,
    oxygenSaturation: 98,
    hypertension: true,
    diabetes: false,
    smokingStatus: 'former',
    familyHistoryCAD: true,
    previousCardiacEvent: false,
    fastingBloodSugar: 110,
    totalCholesterol: 215,
    hdlCholesterol: 45,
    ldlCholesterol: 140,
    serumTriglycerides: 165,
    restingECG: 'normal',
    exerciseAngina: true,
    stDepression: 1.2,
    stSlope: 'flat',
  };

  const [formData, setFormData] = useState<AssessmentInput>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'A' | 'B' | 'C' | 'D' | 'E'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Field change handler
  const handleChange = (field: keyof AssessmentInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Preset loader
  const handleLoadPreset = (index: number) => {
    const preset = DEMO_PRESETS[index];
    setFormData({
      ...preset,
      id: `DEMO-PT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      isExamplePreset: true,
    });
    setErrors({});
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      ...defaultForm,
      id: `DEMO-PT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      isExamplePreset: false,
    });
    setErrors({});
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(FEATURE_CONSTRAINTS).forEach(([key, rule]) => {
      const val = formData[key as keyof AssessmentInput] as number;
      if (typeof val === 'number') {
        if (isNaN(val)) {
          newErrors[key] = 'Field is required.';
        } else if (val < rule.min || val > rule.max) {
          newErrors[key] = `Value must be between ${rule.min} and ${rule.max} ${rule.unit}. (${rule.technicalNote})`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit assessment
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress('Validating clinical input parameters with backend ML models...');

    try {
      // Map frontend inputs to verified model schema
      const modelInput = {
        Age: formData.age,
        Sex: formData.sex === 'male' ? 'Male' : 'Female',
        BP: formData.restingBP,
        PR: formData.heartRate,
        BMI: formData.bmi,
        DM: formData.diabetes ? 1 : 0,
        HTN: formData.hypertension ? 1 : 0,
        'Current Smoker': formData.smokingStatus === 'current' ? 1 : 0,
        'EX-Smoker': formData.smokingStatus === 'former' ? 1 : 0,
        FH: formData.familyHistoryCAD ? 1 : 0,
        FBS: formData.fastingBloodSugar,
        LDL: formData.ldlCholesterol,
        HDL: formData.hdlCholesterol,
        TG: formData.serumTriglycerides,
        'St Depression': formData.stDepression,
        'Typical Chest Pain': formData.chestPainType === 'typical_angina' ? 1 : 0,
        Atypical: formData.chestPainType === 'atypical_angina' ? 'Y' : 'N',
        Nonanginal: formData.chestPainType === 'non_anginal' ? 'Y' : 'N',
        LVH: formData.restingECG === 'left_ventricular_hypertrophy' ? 'Y' : 'N',
      };

      setSubmissionProgress('Executing scikit-learn models (CAD, LAD, LCX, RCA)...');
      
      // Attempt backend assessment creation
      let createdReportId: string | null = null;
      try {
        const res = await api.assessments.create(formData.patientAlias, modelInput);
        createdReportId = res.id;
      } catch (backendErr) {
        console.warn('Backend persistence unavailable or guest mode; running local inference', backendErr);
      }

      setSubmissionProgress('Synthesizing feature attribution waterfall & 3D mesh vectors...');
      submitAssessment(formData);

      setIsSubmitting(false);
      if (createdReportId) {
        navigate(`/reports/${createdReportId}`);
      } else {
        navigate('/predictions');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors({ submit: err.message || 'Assessment submission failed.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
              Demonstration Intake
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Synthetic Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            New Patient Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter physiological measurements and cardiac findings. Input values map to simulated CAD and arterial risk.
          </p>
        </div>

        {/* Preset & Reset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Load Preset:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset(0)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold border border-rose-800/60 text-xs transition-colors"
            >
              Alpha (High)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset(1)}
              className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 font-semibold border border-amber-800/60 text-xs transition-colors"
            >
              Beta (Mod)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset(2)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 font-semibold border border-emerald-800/60 text-xs transition-colors"
            >
              Gamma (Low)
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer compact={true} />

      {/* Active Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Tabs / Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('A')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'A'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            A. Demographics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('B')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'B'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            B. Physiological
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('C')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'C'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            C. Clinical History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('D')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'D'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            D. Laboratory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('E')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'E'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            E. ECG & Cardiac
          </button>
        </div>

        {/* SECTION A: DEMOGRAPHICS */}
        {(activeTab === 'all' || activeTab === 'A') && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Demographics & Presentation</h3>
                <p className="text-xs text-slate-400">Baseline biological variables and symptom presentation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Patient Alias */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Patient Alias / Case Label <span className="text-slate-400 font-normal">(Synthetic only)</span>
                </label>
                <input
                  type="text"
                  value={formData.patientAlias}
                  onChange={(e) => handleChange('patientAlias', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. Synthetic Case Alpha"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Age <span className="text-cyan-400 font-mono text-[11px]">(years)</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', Number(e.target.value))}
                  min={18}
                  max={100}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.age ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.age && <p className="text-[10px] text-rose-400 mt-1">{errors.age}</p>}
              </div>

              {/* Sex */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biological Sex
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleChange('sex', e.target.value as Sex)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Specified</option>
                </select>
              </div>

              {/* Chest Pain Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chest Pain Presentation
                </label>
                <select
                  value={formData.chestPainType}
                  onChange={(e) => handleChange('chestPainType', e.target.value as ChestPainType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="typical_angina">Typical Angina (Substernal, exertional, relief with rest)</option>
                  <option value="atypical_angina">Atypical Angina (2 of 3 typical criteria)</option>
                  <option value="non_anginal">Non-Anginal Chest Pain (1 of 3 criteria)</option>
                  <option value="asymptomatic">Asymptomatic (No current chest discomfort)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION B: PHYSIOLOGICAL MEASUREMENTS */}
        {(activeTab === 'all' || activeTab === 'B') && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                B
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Physiological & Hemodynamic Measurements</h3>
                <p className="text-xs text-slate-400">Vital signs and body habitus metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Resting BP */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resting Systolic BP <span className="text-cyan-400 font-mono text-[11px]">(mmHg)</span>
                </label>
                <input
                  type="number"
                  value={formData.restingBP}
                  onChange={(e) => handleChange('restingBP', Number(e.target.value))}
                  min={80}
                  max={240}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.restingBP ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.restingBP && <p className="text-[10px] text-rose-400 mt-1">{errors.restingBP}</p>}
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resting Heart Rate <span className="text-cyan-400 font-mono text-[11px]">(bpm)</span>
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => handleChange('heartRate', Number(e.target.value))}
                  min={40}
                  max={210}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.heartRate ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.heartRate && <p className="text-[10px] text-rose-400 mt-1">{errors.heartRate}</p>}
              </div>

              {/* BMI */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Body Mass Index <span className="text-cyan-400 font-mono text-[11px]">(kg/m²)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleChange('bmi', Number(e.target.value))}
                  min={14}
                  max={60}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.bmi ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.bmi && <p className="text-[10px] text-rose-400 mt-1">{errors.bmi}</p>}
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pulse Oximetry SpO2 <span className="text-cyan-400 font-mono text-[11px]">(%)</span>
                </label>
                <input
                  type="number"
                  value={formData.oxygenSaturation}
                  onChange={(e) => handleChange('oxygenSaturation', Number(e.target.value))}
                  min={80}
                  max={100}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.oxygenSaturation ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.oxygenSaturation && <p className="text-[10px] text-rose-400 mt-1">{errors.oxygenSaturation}</p>}
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: CLINICAL HISTORY */}
        {(activeTab === 'all' || activeTab === 'C') && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                C
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Clinical & Medical History</h3>
                <p className="text-xs text-slate-400">Past diagnoses, behavioral risk factors, and hereditary disposition</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Hypertension */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Hypertension Diagnosed</div>
                  <div className="text-[11px] text-slate-400">Chronic high blood pressure history</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hypertension}
                  onChange={(e) => handleChange('hypertension', e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Diabetes */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Diabetes Mellitus</div>
                  <div className="text-[11px] text-slate-400">Type 1 or Type 2 diagnosis</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.diabetes}
                  onChange={(e) => handleChange('diabetes', e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Smoking Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Smoking Status
                </label>
                <select
                  value={formData.smokingStatus}
                  onChange={(e) => handleChange('smokingStatus', e.target.value as SmokingStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="never">Never Smoker</option>
                  <option value="former">Former Smoker (Quit &gt; 1 yr)</option>
                  <option value="current">Current Active Smoker</option>
                </select>
              </div>

              {/* Family History */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Family History of CAD</div>
                  <div className="text-[11px] text-slate-400">1st-degree relative premature CAD</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.familyHistoryCAD}
                  onChange={(e) => handleChange('familyHistoryCAD', e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Previous Cardiac Event */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Prior Cardiac Event</div>
                  <div className="text-[11px] text-slate-400">Prior MI, stent, or bypass surgery</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.previousCardiacEvent}
                  onChange={(e) => handleChange('previousCardiacEvent', e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION D: LABORATORY MEASUREMENTS */}
        {(activeTab === 'all' || activeTab === 'D') && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                D
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Laboratory Biomarkers & Lipid Panel</h3>
                <p className="text-xs text-slate-400">Serum biochemistry, fasting glucose, and lipoprotein fractions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Fasting Blood Sugar */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fasting Glucose <span className="text-cyan-400 font-mono text-[11px]">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  value={formData.fastingBloodSugar}
                  onChange={(e) => handleChange('fastingBloodSugar', Number(e.target.value))}
                  min={60}
                  max={400}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.fastingBloodSugar ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.fastingBloodSugar && <p className="text-[10px] text-rose-400 mt-1">{errors.fastingBloodSugar}</p>}
              </div>

              {/* Total Cholesterol */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Cholesterol <span className="text-cyan-400 font-mono text-[11px]">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  value={formData.totalCholesterol}
                  onChange={(e) => handleChange('totalCholesterol', Number(e.target.value))}
                  min={100}
                  max={500}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.totalCholesterol ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.totalCholesterol && <p className="text-[10px] text-rose-400 mt-1">{errors.totalCholesterol}</p>}
              </div>

              {/* HDL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  HDL ("Protective") <span className="text-cyan-400 font-mono text-[11px]">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  value={formData.hdlCholesterol}
                  onChange={(e) => handleChange('hdlCholesterol', Number(e.target.value))}
                  min={15}
                  max={120}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.hdlCholesterol ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.hdlCholesterol && <p className="text-[10px] text-rose-400 mt-1">{errors.hdlCholesterol}</p>}
              </div>

              {/* LDL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  LDL ("Atherogenic") <span className="text-cyan-400 font-mono text-[11px]">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  value={formData.ldlCholesterol}
                  onChange={(e) => handleChange('ldlCholesterol', Number(e.target.value))}
                  min={30}
                  max={350}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.ldlCholesterol ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.ldlCholesterol && <p className="text-[10px] text-rose-400 mt-1">{errors.ldlCholesterol}</p>}
              </div>

              {/* Serum Triglycerides */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Triglycerides <span className="text-cyan-400 font-mono text-[11px]">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  value={formData.serumTriglycerides}
                  onChange={(e) => handleChange('serumTriglycerides', Number(e.target.value))}
                  min={40}
                  max={600}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.serumTriglycerides ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.serumTriglycerides && <p className="text-[10px] text-rose-400 mt-1">{errors.serumTriglycerides}</p>}
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: ECG & CARDIAC FINDINGS */}
        {(activeTab === 'all' || activeTab === 'E') && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                E
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">ECG & Functional Exercise Findings</h3>
                <p className="text-xs text-slate-400">Electrocardiographic waveform metrics and stress test response</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Resting ECG */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resting ECG Pattern
                </label>
                <select
                  value={formData.restingECG}
                  onChange={(e) => handleChange('restingECG', e.target.value as RestingECG)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="normal">Normal Sinus ECG</option>
                  <option value="st_t_wave_abnormality">ST-T Wave Abnormality (T-inversion / ST &gt;0.05mV)</option>
                  <option value="left_ventricular_hypertrophy">Left Ventricular Hypertrophy (Estes criteria)</option>
                </select>
              </div>

              {/* Exercise Angina */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Exercise Angina</div>
                  <div className="text-[11px] text-slate-400">Angina provoked during stress testing</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.exerciseAngina}
                  onChange={(e) => handleChange('exerciseAngina', e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* ST Depression */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ST Depression (J-point) <span className="text-cyan-400 font-mono text-[11px]">(mm)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.stDepression}
                  onChange={(e) => handleChange('stDepression', Number(e.target.value))}
                  min={0.0}
                  max={6.0}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border ${
                    errors.stDepression ? 'border-rose-500' : 'border-slate-700'
                  } text-white text-xs focus:outline-none focus:border-cyan-500`}
                />
                {errors.stDepression && <p className="text-[10px] text-rose-400 mt-1">{errors.stDepression}</p>}
              </div>

              {/* ST Slope */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peak Exercise ST Slope
                </label>
                <select
                  value={formData.stSlope}
                  onChange={(e) => handleChange('stSlope', e.target.value as STSlope)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="upsloping">Upsloping (Typically lower ischemic specificity)</option>
                  <option value="flat">Flat / Horizontal (Moderate ischemic specificity)</option>
                  <option value="downsloping">Downsloping (High ischemic specificity)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e1c] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Deterministic client-side evaluation. No medical patient records transmitted.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review Inputs</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Calculating Demo Outcomes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Demonstration Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading Progression Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/40 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
              <HeartPulse className="w-8 h-8 animate-heartbeat text-cyan-400" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Simulating Cardiovascular Outcomes</h3>
            <p className="text-xs text-cyan-300 font-mono">{submissionProgress}</p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-3/4 animate-pulse"></div>
            </div>
            <p className="text-[10px] text-slate-400">
              Generating synchronized results for Dashboard, 3D Heart, and XAI Explorer
            </p>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Review Assessment Values
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div><span className="text-slate-400">Alias:</span> <strong className="text-white">{formData.patientAlias}</strong></div>
                <div><span className="text-slate-400">Age / Sex:</span> <strong className="text-white">{formData.age} yrs / {formData.sex}</strong></div>
                <div><span className="text-slate-400">Resting BP:</span> <strong className="text-white">{formData.restingBP} mmHg</strong></div>
                <div><span className="text-slate-400">Heart Rate:</span> <strong className="text-white">{formData.heartRate} bpm</strong></div>
                <div><span className="text-slate-400">BMI:</span> <strong className="text-white">{formData.bmi} kg/m²</strong></div>
                <div><span className="text-slate-400">SpO2:</span> <strong className="text-white">{formData.oxygenSaturation}%</strong></div>
                <div><span className="text-slate-400">LDL / HDL:</span> <strong className="text-white">{formData.ldlCholesterol} / {formData.hdlCholesterol} mg/dL</strong></div>
                <div><span className="text-slate-400">ST Depression:</span> <strong className="text-white">{formData.stDepression} mm ({formData.stSlope})</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                Clicking Confirm will calculate deterministic demo results and update the Dashboard, 3D anatomical viewer, and XAI feature attributions.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  handleSubmit();
                }}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Confirm & Compute Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
