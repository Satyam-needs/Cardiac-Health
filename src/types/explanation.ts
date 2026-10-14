import { PredictionTargetId } from './prediction';

export interface LocalFeatureContribution {
  featureKey: string;
  featureName: string;
  patientValue: string | number;
  contribution: number; // Positive = pushes demo probability higher, Negative = lowers
  direction: 'increases_risk' | 'decreases_risk';
  category: 'demographic' | 'physiological' | 'history' | 'laboratory' | 'ecg';
  clinicalInterpretation: string;
}

export interface GlobalFeatureImportance {
  featureKey: string;
  featureName: string;
  meanAbsoluteImportance: number; // e.g. 0.0 to 1.0 illustrative mean |SHAP|
  rank: number;
  category: 'demographic' | 'physiological' | 'history' | 'laboratory' | 'ecg';
  clinicalDescription: string;
}

export interface TargetExplanationData {
  targetId: PredictionTargetId;
  targetName: string;
  baseProbability: number; // e.g. 0.35 baseline population prior
  simulatedOutput: number;
  localContributions: LocalFeatureContribution[];
}

export interface IllustrativeExplanationResult {
  assessmentId: string;
  source: 'illustrative_demo';
  generatedAt: string;
  globalImportance: GlobalFeatureImportance[];
  targetExplanations: Record<PredictionTargetId, TargetExplanationData>;
  educationalDisclaimer: string;
}
