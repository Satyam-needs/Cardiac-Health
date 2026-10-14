import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AssessmentInput } from '../types/assessment';
import { DemoPredictionResult, PredictionTargetId } from '../types/prediction';
import { IllustrativeExplanationResult } from '../types/explanation';
import { runDemoPrediction, generateDemoExplanations } from '../services/demoPrediction';
import { DEMO_PRESETS } from '../services/demoPresets';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  patientAlias: string;
  isExamplePreset?: boolean;
  assessment: AssessmentInput;
  result: DemoPredictionResult;
}

interface AssessmentContextType {
  currentAssessment: AssessmentInput | null;
  currentResult: DemoPredictionResult | null;
  currentExplanation: IllustrativeExplanationResult | null;
  selectedArtery: PredictionTargetId | 'all';
  history: HistoryEntry[];
  isDemoMode: boolean;
  submitAssessment: (input: AssessmentInput) => DemoPredictionResult;
  loadPreset: (presetIndex: number) => void;
  selectArtery: (artery: PredictionTargetId | 'all') => void;
  reopenFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  resetCurrentAssessment: () => void;
}

const STORAGE_KEY = 'cardiac_health_demo_history_v1';

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the first synthetic demo profile so the app is immediately demonstrative on launch!
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentInput | null>(() => {
    return DEMO_PRESETS[0];
  });

  const [currentResult, setCurrentResult] = useState<DemoPredictionResult | null>(() => {
    return runDemoPrediction(DEMO_PRESETS[0]);
  });

  const [currentExplanation, setCurrentExplanation] = useState<IllustrativeExplanationResult | null>(() => {
    const res = runDemoPrediction(DEMO_PRESETS[0]);
    return generateDemoExplanations(DEMO_PRESETS[0], res);
  });

  const [selectedArtery, setSelectedArtery] = useState<PredictionTargetId | 'all'>('LAD');

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    // Seed initial demo presets into history
    return DEMO_PRESETS.map((preset) => {
      const res = runDemoPrediction(preset);
      return {
        id: preset.id,
        createdAt: preset.createdAt,
        patientAlias: preset.patientAlias,
        isExamplePreset: preset.isExamplePreset,
        assessment: preset,
        result: res,
      };
    });
  });

  // Persist history to localStorage with error safety
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Unable to persist demo history to localStorage', e);
    }
  }, [history]);

  const submitAssessment = (input: AssessmentInput): DemoPredictionResult => {
    const result = runDemoPrediction(input);
    const explanation = generateDemoExplanations(input, result);

    setCurrentAssessment(input);
    setCurrentResult(result);
    setCurrentExplanation(explanation);

    const newEntry: HistoryEntry = {
      id: input.id,
      createdAt: new Date().toISOString(),
      patientAlias: input.patientAlias || `Assessment #${input.id.slice(-6)}`,
      isExamplePreset: input.isExamplePreset,
      assessment: input,
      result,
    };

    setHistory((prev) => [newEntry, ...prev.filter((h) => h.id !== input.id)]);
    return result;
  };

  const loadPreset = (presetIndex: number) => {
    const preset = DEMO_PRESETS[presetIndex] || DEMO_PRESETS[0];
    const timestampedPreset: AssessmentInput = {
      ...preset,
      id: `DEMO-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    submitAssessment(timestampedPreset);
  };

  const selectArtery = (artery: PredictionTargetId | 'all') => {
    setSelectedArtery(artery);
  };

  const reopenFromHistory = (id: string) => {
    const entry = history.find((h) => h.id === id);
    if (entry) {
      setCurrentAssessment(entry.assessment);
      setCurrentResult(entry.result);
      setCurrentExplanation(generateDemoExplanations(entry.assessment, entry.result));
    }
  };

  const deleteFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const resetCurrentAssessment = () => {
    setCurrentAssessment(null);
    setCurrentResult(null);
    setCurrentExplanation(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentAssessment,
        currentResult,
        currentExplanation,
        selectedArtery,
        history,
        isDemoMode: true,
        submitAssessment,
        loadPreset,
        selectArtery,
        reopenFromHistory,
        deleteFromHistory,
        clearHistory,
        resetCurrentAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
