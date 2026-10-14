import { PredictionTargetId } from './prediction';

export interface EvaluationMetric {
  name: string;
  abbreviation: string;
  illustrativeValue: number;
  definition: string;
  clinicalSignificance: string;
  formula: string;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  totalSamples: number;
}

export interface TargetModelPerformance {
  targetId: PredictionTargetId;
  targetName: string;
  metrics: {
    accuracy: EvaluationMetric;
    precision: EvaluationMetric;
    recall: EvaluationMetric;
    specificity: EvaluationMetric;
    f1Score: EvaluationMetric;
    rocAuc: EvaluationMetric;
  };
  confusionMatrix: ConfusionMatrixData;
  rocCurveData: Array<{ falsePositiveRate: number; truePositiveRate: number; threshold: number }>;
  precisionRecallCurveData: Array<{ recall: number; precision: number; threshold: number }>;
}

export interface ModelSystemStatus {
  frontendMode: 'Interactive Prototype';
  trainedModelConnected: false;
  backendInferenceStatus: 'Offline / Client-Side Simulated';
  evaluationMetricsSource: 'Illustrative Layout Template';
  clinicalValidationStatus: 'Not Established';
  recommendedModelArchitecture: string;
  integrationReadiness: string;
}
