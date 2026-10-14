import os
import json
import joblib
import pandas as pd
import numpy as np

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')

# Load feature schema
with open(os.path.join(ARTIFACTS_DIR, 'feature_schema.json'), 'r') as f:
    SCHEMA = json.load(f)

# Load evaluation metrics
with open(os.path.join(ARTIFACTS_DIR, 'evaluation_metrics.json'), 'r') as f:
    METRICS = json.load(f)

# Load models
MODELS = {}
for target in ['CAD', 'LAD', 'LCX', 'RCA']:
    model_path = os.path.join(ARTIFACTS_DIR, f'model_{target}.joblib')
    if os.path.exists(model_path):
        MODELS[target] = joblib.load(model_path)

def prepare_input_dataframe(patient_data: dict) -> pd.DataFrame:
    """Prepares a single-row DataFrame aligned with training feature columns."""
    row = {}
    
    # Fill numeric columns
    for col in SCHEMA['numeric_features']:
        val = patient_data.get(col)
        if val is None or val == '':
            # Use mean default from training schema
            val = SCHEMA['numeric_ranges'].get(col, {}).get('mean', 0.0)
        row[col] = float(val)
        
    # Fill categorical columns
    for col in SCHEMA['categorical_features']:
        val = patient_data.get(col)
        valid_cats = SCHEMA['categorical_categories'].get(col, [])
        if val is None or str(val).strip() == '':
            val = valid_cats[0] if valid_cats else 'N'
        # Normalize
        str_val = str(val).strip()
        if str_val.lower() == 'female':
            str_val = 'Female'
        elif str_val.lower() == 'male':
            str_val = 'Male'
        elif str_val.upper() in ['Y', 'YES', 'TRUE', '1']:
            str_val = 'Y'
        elif str_val.upper() in ['N', 'NO', 'FALSE', '0']:
            str_val = 'N'
        row[col] = str_val

    df = pd.DataFrame([row], columns=SCHEMA['all_features'])
    return df

def predict_patient(patient_data: dict) -> dict:
    """Runs all 4 models and returns structured predictions."""
    df_input = prepare_input_dataframe(patient_data)
    
    predictions = {}
    
    for target in ['CAD', 'LAD', 'LCX', 'RCA']:
        model = MODELS.get(target)
        if model is None:
            continue
            
        prob = float(model.predict_proba(df_input)[0, 1])
        pred_class = int(prob >= 0.5)
        
        # Risk classification
        if prob >= 0.65:
            risk_level = 'high'
            class_label = 'Elevated Risk / Stenosis Indicated'
            color = '#f43f5e'
        elif prob >= 0.40:
            risk_level = 'moderate'
            class_label = 'Moderate Risk / Borderline'
            color = '#f59e0b'
        else:
            risk_level = 'low'
            class_label = 'Lower Risk / Non-Stenotic'
            color = '#10b981'
            
        confidence = round(float(0.5 + abs(prob - 0.5)), 2)
        
        predictions[target] = {
            'targetId': target,
            'probability': round(prob, 4),
            'predictedClass': pred_class,
            'classLabel': class_label,
            'riskLevel': risk_level,
            'confidence': confidence,
            'color': color,
        }
        
    # Overall CAD category
    high_count = sum(1 for p in predictions.values() if p['riskLevel'] == 'high')
    mod_count = sum(1 for p in predictions.values() if p['riskLevel'] == 'moderate')
    
    if high_count >= 2 or predictions.get('CAD', {}).get('riskLevel') == 'high':
        overall_cat = 'high'
        overall_label = 'Elevated Multi-Vessel Cardiovascular Risk'
    elif high_count == 1 or mod_count >= 2 or predictions.get('CAD', {}).get('riskLevel') == 'moderate':
        overall_cat = 'moderate'
        overall_label = 'Moderate Cardiovascular Risk'
    else:
        overall_cat = 'low'
        overall_label = 'Lower Cardiovascular Risk'

    return {
        'targets': predictions,
        'overallRiskCategory': overall_cat,
        'overallRiskLabel': overall_label,
        'modelVersion': 'scikit-learn 1.9.1 / Z-Alizadeh Sani Pipeline v1.0',
        'disclaimer': 'Cardiac Health is a research prototype for educational and decision-support exploration. Its predictions are not a medical diagnosis and must not replace assessment by a qualified healthcare professional.'
    }

def explain_target_prediction(target: str, patient_data: dict, top_n: int = 8) -> dict:
    """Calculates local feature contributions by measuring marginal logit/probability shifts."""
    model = MODELS.get(target)
    if not model:
        return {'error': f'Model {target} not found'}
        
    df_patient = prepare_input_dataframe(patient_data)
    patient_prob = float(model.predict_proba(df_patient)[0, 1])
    
    # Baseline population average row from schema means and modes
    baseline_row = {}
    for col in SCHEMA['numeric_features']:
        baseline_row[col] = SCHEMA['numeric_ranges'][col]['mean']
    for col in SCHEMA['categorical_features']:
        baseline_row[col] = SCHEMA['categorical_categories'][col][0]
    df_baseline = pd.DataFrame([baseline_row], columns=SCHEMA['all_features'])
    base_prob = float(model.predict_proba(df_baseline)[0, 1])
    
    # Feature perturbation analysis (marginal attribution)
    contributions = []
    
    for col in SCHEMA['all_features']:
        val = df_patient[col].iloc[0]
        base_val = df_baseline[col].iloc[0]
        
        # If patient value is same as baseline, contribution is near zero
        if val == base_val:
            continue
            
        # Swap this single feature into baseline to measure individual effect
        perturbed = df_baseline.copy()
        perturbed[col] = val
        perturbed_prob = float(model.predict_proba(perturbed)[0, 1])
        shift = round(perturbed_prob - base_prob, 4)
        
        if abs(shift) > 0.001:
            contributions.append({
                'feature': col,
                'patientValue': str(val),
                'contribution': shift,
                'direction': 'increases_risk' if shift > 0 else 'decreases_risk',
                'clinicalDescription': get_clinical_description(col, val)
            })
            
    # Sort by absolute contribution
    contributions.sort(key=lambda x: abs(x['contribution']), reverse=True)
    
    return {
        'target': target,
        'baseProbability': round(base_prob, 4),
        'patientProbability': round(patient_prob, 4),
        'contributions': contributions[:top_n],
        'method': 'Marginal Empirical Perturbation (Local Attribution)',
        'caveat': 'Feature contributions describe model attribution relative to reference baseline and do not prove clinical etiology or physical causation.'
    }

def get_clinical_description(feature: str, value) -> str:
    desc_map = {
        'Age': f'Patient age of {value} years.',
        'BP': f'Resting systolic blood pressure of {value} mmHg.',
        'Typical Chest Pain': 'Typical exertional angina presentation.',
        'St Depression': f'ECG ST-segment depression of {value} mm.',
        'DM': 'Diagnosis of Diabetes Mellitus.',
        'HTN': 'Diagnosis of Chronic Hypertension.',
        'Current Smoker': 'Active tobacco smoking history.',
        'LDL': f'Serum LDL cholesterol of {value} mg/dL.',
        'HDL': f'Protective serum HDL cholesterol of {value} mg/dL.',
        'TG': f'Serum triglycerides of {value} mg/dL.',
        'EF-TTE': f'Left ventricular ejection fraction of {value}%.',
        'BMI': f'Body Mass Index of {value} kg/m².',
        'FBS': f'Fasting blood sugar of {value} mg/dL.',
    }
    return desc_map.get(feature, f'Value of {feature}: {value}')
