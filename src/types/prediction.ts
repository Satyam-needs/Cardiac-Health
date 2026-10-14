export type PredictionTargetId = 'CAD' | 'LAD' | 'LCX' | 'RCA';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'neutral';

export interface TargetMetadata {
  id: PredictionTargetId;
  name: string;
  fullName: string;
  anatomicalDescription: string;
  territorySupplied: string;
  positiveClassLabel: string;
  negativeClassLabel: string;
  threeMeshId: string; // Identifier linking to 3D model node
}

export interface TargetPredictionOutput {
  targetId: PredictionTargetId;
  name: string;
  fullName: string;
  simulatedProbability: number; // 0.0 - 1.0 (labeled: Simulated example probability)
  simulatedClass: string; // e.g., "Elevated Risk Demo" vs "Standard Range Demo"
  riskLevel: RiskLevel;
  confidenceScoreIllustrative: number;
  plainLanguageSummary: string;
  clinicalTerritory: string;
  meshHighlightColor: string; // Hex color for 3D visualization
}

export interface DemoPredictionResult {
  assessmentId: string;
  source: 'demo'; // Strictly typed to prevent confusion with real model
  demoMode: true;
  generatedAt: string;
  disclaimer: string;
  overallDemonstrationLabel: string;
  overallDemonstrationCategory: RiskLevel;
  targets: Record<PredictionTargetId, TargetPredictionOutput>;
  modelVersionNote: string;
}

export const TARGET_METADATA: Record<PredictionTargetId, TargetMetadata> = {
  CAD: {
    id: 'CAD',
    name: 'CAD',
    fullName: 'Coronary Artery Disease Status',
    anatomicalDescription: 'Overall systemic assessment of coronary atherosclerotic vascular disease burden.',
    territorySupplied: 'Global coronary circulation across epicardial arterial beds.',
    positiveClassLabel: 'Significant CAD Likelihood',
    negativeClassLabel: 'No Substantial CAD Indication',
    threeMeshId: 'heart_whole_mesh',
  },
  LAD: {
    id: 'LAD',
    name: 'LAD',
    fullName: 'Left Anterior Descending Artery',
    anatomicalDescription: 'Branch of the left coronary artery traveling along the anterior interventricular sulcus toward the cardiac apex.',
    territorySupplied: 'Anterior wall of the left ventricle, cardiac apex, and anterior two-thirds of the interventricular septum.',
    positiveClassLabel: 'LAD Involvement Suspected',
    negativeClassLabel: 'LAD Standard Status',
    threeMeshId: 'artery_lad_mesh',
  },
  LCX: {
    id: 'LCX',
    name: 'LCX',
    fullName: 'Left Circumflex Artery',
    anatomicalDescription: 'Branch of the left main coronary artery coursing posteriorly in the coronary sulcus around the base of the left ventricle.',
    territorySupplied: 'Posterolateral and lateral walls of the left ventricle, and the left atrium.',
    positiveClassLabel: 'LCX Involvement Suspected',
    negativeClassLabel: 'LCX Standard Status',
    threeMeshId: 'artery_lcx_mesh',
  },
  RCA: {
    id: 'RCA',
    name: 'RCA',
    fullName: 'Right Coronary Artery',
    anatomicalDescription: 'Arising from the right aortic sinus, coursing down the right atrioventricular groove and usually giving rise to the posterior descending artery.',
    territorySupplied: 'Right atrium, right ventricle, inferior wall of the left ventricle, and sinoatrial/atrioventricular nodes.',
    positiveClassLabel: 'RCA Involvement Suspected',
    negativeClassLabel: 'RCA Standard Status',
    threeMeshId: 'artery_rca_mesh',
  },
};
