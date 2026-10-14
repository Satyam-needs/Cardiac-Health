import uuid
from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.prediction import PredictionRequest, PredictionResponse, ModelInfoResponse
from backend.app.schemas.explain import ExplainRequest, ExplainResponse
from backend.ml.inference import predict_patient, explain_target_prediction, SCHEMA, METRICS

router = APIRouter(tags=["Predictions & Explainability"])

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    assessment_id = request.assessment_id or f"ASM-{uuid.uuid4().hex[:8].upper()}"
    results = predict_patient(request.patient_data)
    
    return {
        "assessment_id": assessment_id,
        "targets": results["targets"],
        "overallRiskCategory": results["overallRiskCategory"],
        "overallRiskLabel": results["overallRiskLabel"],
        "modelVersion": results["modelVersion"],
        "disclaimer": results["disclaimer"]
    }

@router.get("/model-info", response_model=ModelInfoResponse)
def get_model_info():
    return {
        "targets": ["CAD", "LAD", "LCX", "RCA"],
        "features_count": len(SCHEMA["all_features"]),
        "features_numeric": SCHEMA["numeric_features"],
        "features_categorical": SCHEMA["categorical_features"],
        "model_version": "scikit-learn-1.9.1 / Pipeline-v1.0",
        "dataset": "Z-Alizadeh Sani Extension Dataset (UCI ML Repository #411)",
        "evaluation_status": "5-Fold Stratified Cross-Validation + 20% Stratified Holdout Test",
        "limitations": [
            "Research and educational prototype only; not certified for autonomous clinical diagnostic decisions.",
            "Predictions are population risk estimates, not physical measurements of luminal stenosis percentage.",
            "Tabular clinical features do not provide millimeter spatial coordinates of plaque lesions.",
            "Trained on an Iranian clinical cardiac catheterization cohort (N=303); external demographic calibration required prior to generalized deployment."
        ]
    }

@router.get("/metrics")
def get_metrics():
    """Returns actual evaluated metrics from model training."""
    return METRICS

@router.post("/explain", response_model=ExplainResponse)
def explain(request: ExplainRequest):
    target = request.target.upper()
    if target not in ["CAD", "LAD", "LCX", "RCA"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Target '{request.target}' is not supported. Use CAD, LAD, LCX, or RCA."
        )
        
    explanation = explain_target_prediction(target, request.patient_data)
    return explanation
