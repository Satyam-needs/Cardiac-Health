import { AssessmentInput } from '../types/assessment';
import { DemoPredictionResult, PredictionTargetId, RiskLevel, TargetPredictionOutput, TARGET_METADATA } from '../types/prediction';
import { IllustrativeExplanationResult, LocalFeatureContribution, GlobalFeatureImportance, TargetExplanationData } from '../types/explanation';

export const DEMO_MODE = true;

export const DEMO_DISCLAIMER =
  'CardioVision AI is a frontend research and educational prototype. The displayed prediction values and explanations are simulated examples, not outputs from a trained clinical model. They are not a diagnosis and must not be used to make medical decisions or replace professional assessment, diagnostic testing, or medical care.';

export const DEMO_INTERPRETATION_NOTICE =
  'These are simulated frontend demonstration outputs, not predictions from a trained model. They do not establish the presence, absence, severity, or location of coronary artery disease.';

export const PROBABILITY_LABEL_NOTICE =
  'Simulated example probability — not a clinical prediction. Not percentage of stenosis or plaque.';

/**
 * Deterministic illustrative prediction function.
 * Explicitly designed for UI demonstration and client-side testing without a backend.
 */
export function runDemoPrediction(assessment: AssessmentInput): DemoPredictionResult {
  // Deterministic scoring components
  let baseScore = 0.15;

  // Age factor (linear scaled between 30 and 80)
  const ageFactor = Math.max(0, Math.min(1, (assessment.age - 30) / 50)) * 0.22;

  // Sex factor
  const sexFactor = assessment.sex === 'male' ? 0.08 : 0.04;

  // Physiological factors
  const bpFactor = Math.max(0, (assessment.restingBP - 120) / 80) * 0.16;
  const bmiFactor = Math.max(0, (assessment.bmi - 25) / 20) * 0.08;

  // Clinical history
  const historyScore =
    (assessment.hypertension ? 0.09 : 0) +
    (assessment.diabetes ? 0.12 : 0) +
    (assessment.smokingStatus === 'current' ? 0.15 : assessment.smokingStatus === 'former' ? 0.06 : 0) +
    (assessment.familyHistoryCAD ? 0.08 : 0) +
    (assessment.previousCardiacEvent ? 0.14 : 0);

  // Lipid factor: LDL and Total/HDL ratio
  const ldlFactor = Math.max(0, (assessment.ldlCholesterol - 100) / 150) * 0.12;
  const ratioFactor = Math.max(0, (assessment.totalCholesterol / Math.max(1, assessment.hdlCholesterol) - 3.5) / 4) * 0.1;

  // ECG factors
  const stFactor = Math.min(0.24, assessment.stDepression * 0.08);
  const anginaFactor = assessment.exerciseAngina ? 0.12 : 0;
  const chestPainFactor =
    assessment.chestPainType === 'typical_angina'
      ? 0.16
      : assessment.chestPainType === 'atypical_angina'
      ? 0.08
      : assessment.chestPainType === 'non_anginal'
      ? 0.03
      : 0;

  // Global CAD combined estimate
  const cadRaw = baseScore + ageFactor + sexFactor + bpFactor + bmiFactor + historyScore + ldlFactor + ratioFactor + stFactor + anginaFactor + chestPainFactor;
  const cadProb = Math.max(0.04, Math.min(0.96, Number(cadRaw.toFixed(3))));

  // Vessel-specific synthetic variance
  // LAD: highly correlated with anterior findings, ST changes, and LDL
  const ladRaw = cadProb * 0.92 + stFactor * 0.5 + ldlFactor * 0.4 - (assessment.hdlCholesterol > 55 ? 0.08 : 0);
  const ladProb = Math.max(0.05, Math.min(0.95, Number(ladRaw.toFixed(3))));

  // LCX: sensitive to hypertension, BMI, triglycerides
  const lcxRaw = cadProb * 0.78 + bpFactor * 0.4 + (assessment.serumTriglycerides > 180 ? 0.09 : 0) - (assessment.sex === 'female' ? 0.03 : 0);
  const lcxProb = Math.max(0.04, Math.min(0.92, Number(lcxRaw.toFixed(3))));

  // RCA: sensitive to smoking, diabetes, age
  const rcaRaw = cadProb * 0.82 + (assessment.diabetes ? 0.1 : 0) + (assessment.smokingStatus === 'current' ? 0.11 : 0) + ageFactor * 0.2;
  const rcaProb = Math.max(0.05, Math.min(0.94, Number(rcaRaw.toFixed(3))));

  function buildTargetOutput(targetId: PredictionTargetId, prob: number): TargetPredictionOutput {
    const meta = TARGET_METADATA[targetId];
    let riskLevel: RiskLevel = 'low';
    let simulatedClass = 'Low Probability Demo Category';
    let meshHighlightColor = '#10b981'; // Emerald

    if (prob >= 0.65) {
      riskLevel = 'high';
      simulatedClass = 'Elevated Risk Demo Category';
      meshHighlightColor = '#f43f5e'; // Rose / Red
    } else if (prob >= 0.40) {
      riskLevel = 'moderate';
      simulatedClass = 'Moderate Risk Demo Category';
      meshHighlightColor = '#f59e0b'; // Amber
    } else {
      riskLevel = 'low';
      simulatedClass = 'Lower Risk Demo Category';
      meshHighlightColor = '#10b981'; // Green
    }

    const confidenceScore = Number((0.82 + Math.abs(prob - 0.5) * 0.3).toFixed(2));

    return {
      targetId,
      name: meta.name,
      fullName: meta.fullName,
      simulatedProbability: prob,
      simulatedClass,
      riskLevel,
      confidenceScoreIllustrative: confidenceScore,
      plainLanguageSummary: `${meta.fullName}: Demonstrating ${riskLevel} illustrative probability (${(prob * 100).toFixed(1)}%).`,
      clinicalTerritory: meta.territorySupplied,
      meshHighlightColor,
    };
  }

  const targets: Record<PredictionTargetId, TargetPredictionOutput> = {
    CAD: buildTargetOutput('CAD', cadProb),
    LAD: buildTargetOutput('LAD', ladProb),
    LCX: buildTargetOutput('LCX', lcxProb),
    RCA: buildTargetOutput('RCA', rcaProb),
  };

  const highCount = Object.values(targets).filter((t) => t.riskLevel === 'high').length;
  const modCount = Object.values(targets).filter((t) => t.riskLevel === 'moderate').length;

  let overallCategory: RiskLevel = 'low';
  let overallLabel = 'Low Overall Demo Category';

  if (highCount >= 2 || targets.CAD.riskLevel === 'high') {
    overallCategory = 'high';
    overallLabel = 'Elevated Multi-Target Demo Category';
  } else if (highCount === 1 || modCount >= 2 || targets.CAD.riskLevel === 'moderate') {
    overallCategory = 'moderate';
    overallLabel = 'Moderate Multi-Target Demo Category';
  }

  return {
    assessmentId: assessment.id,
    source: 'demo',
    demoMode: true,
    generatedAt: new Date().toISOString(),
    disclaimer: DEMO_DISCLAIMER,
    overallDemonstrationLabel: overallLabel,
    overallDemonstrationCategory: overallCategory,
    targets,
    modelVersionNote: 'Demonstration rule-based engine v1.0.0 (Client-side mock; not a clinically trained model)',
  };
}

/**
 * Generate illustrative local & global feature contributions for XAI exploration.
 */
export function generateDemoExplanations(
  assessment: AssessmentInput,
  result: DemoPredictionResult
): IllustrativeExplanationResult {
  const globalImportance: GlobalFeatureImportance[] = [
    {
      featureKey: 'stDepression',
      featureName: 'ECG ST Depression',
      meanAbsoluteImportance: 0.28,
      rank: 1,
      category: 'ecg',
      clinicalDescription: 'Key indicator of subendocardial ischemia during workload or rest.',
    },
    {
      featureKey: 'ldlCholesterol',
      featureName: 'Serum LDL Cholesterol',
      meanAbsoluteImportance: 0.23,
      rank: 2,
      category: 'laboratory',
      clinicalDescription: 'Atherogenic lipoprotein driving plaque formation in epicardial vessels.',
    },
    {
      featureKey: 'age',
      featureName: 'Patient Age',
      meanAbsoluteImportance: 0.21,
      rank: 3,
      category: 'demographic',
      clinicalDescription: 'Cumulative biological exposure to vascular remodeling and calcification.',
    },
    {
      featureKey: 'smokingStatus',
      featureName: 'Smoking History',
      meanAbsoluteImportance: 0.19,
      rank: 4,
      category: 'history',
      clinicalDescription: 'Endothelial dysfunction and accelerated prothrombotic state.',
    },
    {
      featureKey: 'restingBP',
      featureName: 'Systolic Blood Pressure',
      meanAbsoluteImportance: 0.17,
      rank: 5,
      category: 'physiological',
      clinicalDescription: 'Hemodynamic shear stress promoting vascular injury and arterial stiffness.',
    },
    {
      featureKey: 'chestPainType',
      featureName: 'Chest Pain Presentation',
      meanAbsoluteImportance: 0.16,
      rank: 6,
      category: 'demographic',
      clinicalDescription: 'Typicality of ischemic symptoms according to Diamond-Forrester criteria.',
    },
    {
      featureKey: 'exerciseAngina',
      featureName: 'Exercise-Induced Angina',
      meanAbsoluteImportance: 0.14,
      rank: 7,
      category: 'ecg',
      clinicalDescription: 'Demand-supply mismatch during elevated cardiac metabolic requirements.',
    },
    {
      featureKey: 'diabetes',
      featureName: 'Diabetes Mellitus Status',
      meanAbsoluteImportance: 0.13,
      rank: 8,
      category: 'history',
      clinicalDescription: 'Diffuse diabetic microvascular and macrovascular accelerated atherosclerosis.',
    },
  ];

  function buildTargetExplanation(targetId: PredictionTargetId): TargetExplanationData {
    const targetOutput = result.targets[targetId];
    const baseProb = 0.32;

    const contributions: LocalFeatureContribution[] = [
      {
        featureKey: 'age',
        featureName: 'Age',
        patientValue: `${assessment.age} yrs`,
        contribution: Number(((assessment.age - 50) * 0.004).toFixed(3)),
        direction: assessment.age >= 50 ? 'increases_risk' : 'decreases_risk',
        category: 'demographic',
        clinicalInterpretation: assessment.age >= 50 ? 'Age > 50 increases cumulative vascular risk in demo' : 'Age < 50 provides lower baseline exposure in demo',
      },
      {
        featureKey: 'restingBP',
        featureName: 'Resting Blood Pressure',
        patientValue: `${assessment.restingBP} mmHg`,
        contribution: Number(((assessment.restingBP - 125) * 0.003).toFixed(3)),
        direction: assessment.restingBP > 125 ? 'increases_risk' : 'decreases_risk',
        category: 'physiological',
        clinicalInterpretation: assessment.restingBP > 130 ? 'Elevated systolic pressure contributes positively to demo likelihood' : 'Normal blood pressure lowers simulated probability',
      },
      {
        featureKey: 'ldlCholesterol',
        featureName: 'LDL Cholesterol',
        patientValue: `${assessment.ldlCholesterol} mg/dL`,
        contribution: Number(((assessment.ldlCholesterol - 100) * 0.0035).toFixed(3)),
        direction: assessment.ldlCholesterol > 100 ? 'increases_risk' : 'decreases_risk',
        category: 'laboratory',
        clinicalInterpretation: assessment.ldlCholesterol > 130 ? 'Atherogenic LDL fraction increases target demo likelihood' : 'Optimal LDL values reduce demo target likelihood',
      },
      {
        featureKey: 'stDepression',
        featureName: 'ST Depression',
        patientValue: `${assessment.stDepression} mm`,
        contribution: Number((assessment.stDepression * 0.05).toFixed(3)),
        direction: assessment.stDepression > 0.5 ? 'increases_risk' : 'decreases_risk',
        category: 'ecg',
        clinicalInterpretation: assessment.stDepression > 0.5 ? 'ST depression indicates potential ischemic burden in demo model' : 'No significant ST deviation lowering demo target score',
      },
      {
        featureKey: 'smokingStatus',
        featureName: 'Smoking Status',
        patientValue: assessment.smokingStatus,
        contribution: assessment.smokingStatus === 'current' ? 0.08 : assessment.smokingStatus === 'former' ? 0.02 : -0.05,
        direction: assessment.smokingStatus !== 'never' ? 'increases_risk' : 'decreases_risk',
        category: 'history',
        clinicalInterpretation: assessment.smokingStatus === 'current' ? 'Active tobacco use creates significant simulated vascular burden' : 'Non-smoking baseline lowers simulated score',
      },
      {
        featureKey: 'hdlCholesterol',
        featureName: 'HDL ("Protective")',
        patientValue: `${assessment.hdlCholesterol} mg/dL`,
        contribution: Number(((50 - assessment.hdlCholesterol) * 0.0025).toFixed(3)),
        direction: assessment.hdlCholesterol < 50 ? 'increases_risk' : 'decreases_risk',
        category: 'laboratory',
        clinicalInterpretation: assessment.hdlCholesterol >= 50 ? 'High protective HDL reduces demo target likelihood' : 'Suboptimal protective HDL elevates demo target likelihood',
      },
      {
        featureKey: 'exerciseAngina',
        featureName: 'Exercise-Induced Angina',
        patientValue: assessment.exerciseAngina ? 'Yes' : 'No',
        contribution: assessment.exerciseAngina ? 0.06 : -0.04,
        direction: assessment.exerciseAngina ? 'increases_risk' : 'decreases_risk',
        category: 'ecg',
        clinicalInterpretation: assessment.exerciseAngina ? 'Presence of exertion-induced angina increases target probability' : 'Absence of exertional angina lowers demo prediction',
      },
    ];

    // Sort contributions descending by absolute value
    contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      targetId,
      targetName: targetOutput.name,
      baseProbability: baseProb,
      simulatedOutput: targetOutput.simulatedProbability,
      localContributions: contributions,
    };
  }

  return {
    assessmentId: assessment.id,
    source: 'illustrative_demo',
    generatedAt: new Date().toISOString(),
    globalImportance,
    targetExplanations: {
      CAD: buildTargetExplanation('CAD'),
      LAD: buildTargetExplanation('LAD'),
      LCX: buildTargetExplanation('LCX'),
      RCA: buildTargetExplanation('RCA'),
    },
    educationalDisclaimer:
      'ILLUSTRATIVE EXPLANATION — NOT GENERATED BY A TRAINED MODEL. These feature contributions are synthesized rule weights designed to demonstrate how local and global explainability charts operate in clinical AI interfaces.',
  };
}
