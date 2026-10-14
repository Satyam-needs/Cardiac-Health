export type Sex = 'male' | 'female' | 'other';
export type ChestPainType = 'typical_angina' | 'atypical_angina' | 'non_anginal' | 'asymptomatic';
export type SmokingStatus = 'never' | 'former' | 'current';
export type RestingECG = 'normal' | 'st_t_wave_abnormality' | 'left_ventricular_hypertrophy';
export type STSlope = 'upsloping' | 'flat' | 'downsloping';

export interface AssessmentInput {
  // Metadata
  id: string;
  patientAlias: string;
  createdAt: string;
  isExamplePreset?: boolean;
  presetName?: string;

  // A. Demographics
  age: number; // 20 - 100
  sex: Sex;
  chestPainType: ChestPainType;

  // B. Physiological
  restingBP: number; // mmHg (e.g. 90 - 220)
  heartRate: number; // bpm (e.g. 45 - 200)
  bmi: number; // kg/m² (e.g. 15 - 50)
  oxygenSaturation: number; // % (e.g. 85 - 100)

  // C. Clinical History
  hypertension: boolean;
  diabetes: boolean;
  smokingStatus: SmokingStatus;
  familyHistoryCAD: boolean;
  previousCardiacEvent: boolean;

  // D. Laboratory Measurements
  fastingBloodSugar: number; // mg/dL (e.g. 65 - 350)
  totalCholesterol: number; // mg/dL (e.g. 110 - 450)
  hdlCholesterol: number; // mg/dL (e.g. 20 - 110)
  ldlCholesterol: number; // mg/dL (e.g. 40 - 300)
  serumTriglycerides: number; // mg/dL (e.g. 50 - 500)

  // E. Cardiac & ECG Findings
  restingECG: RestingECG;
  exerciseAngina: boolean;
  stDepression: number; // mm (e.g. 0.0 - 6.0)
  stSlope: STSlope;
}

export interface ValidationRule {
  min: number;
  max: number;
  unit: string;
  description: string;
  technicalNote: string;
}

export const FEATURE_CONSTRAINTS: Record<string, ValidationRule> = {
  age: { min: 18, max: 100, unit: 'years', description: 'Patient biological age', technicalNote: 'Technical range constraint for interface stability.' },
  restingBP: { min: 80, max: 240, unit: 'mmHg', description: 'Resting systolic blood pressure', technicalNote: 'Simulated boundary, does not replace clinical triage.' },
  heartRate: { min: 40, max: 210, unit: 'bpm', description: 'Resting pulse rate', technicalNote: 'Standard sensor measurement boundary.' },
  bmi: { min: 14, max: 60, unit: 'kg/m²', description: 'Body Mass Index', technicalNote: 'Calculated as weight(kg) / height(m)².' },
  oxygenSaturation: { min: 80, max: 100, unit: '%', description: 'Pulse oximetry SpO2', technicalNote: 'Capillary blood oxygen saturation level.' },
  fastingBloodSugar: { min: 60, max: 400, unit: 'mg/dL', description: 'Fasting serum glucose', technicalNote: 'Normal fasting range is typically 70-99 mg/dL.' },
  totalCholesterol: { min: 100, max: 500, unit: 'mg/dL', description: 'Total serum cholesterol', technicalNote: 'Standard laboratory panel metric.' },
  hdlCholesterol: { min: 15, max: 120, unit: 'mg/dL', description: 'High-density lipoprotein ("protective")', technicalNote: 'Higher levels typically associated with lower vascular risk.' },
  ldlCholesterol: { min: 30, max: 350, unit: 'mg/dL', description: 'Low-density lipoprotein ("atherogenic")', technicalNote: 'Primary atherogenic lipoprotein target.' },
  serumTriglycerides: { min: 40, max: 600, unit: 'mg/dL', description: 'Fasting serum triglycerides', technicalNote: 'Lipid fraction reflecting metabolic state.' },
  stDepression: { min: 0.0, max: 6.0, unit: 'mm', description: 'ECG ST segment depression (J-point)', technicalNote: 'Electrocardiographic ischemia indicator.' },
};
