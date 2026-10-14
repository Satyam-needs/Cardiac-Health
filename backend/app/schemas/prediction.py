from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    patient_data: Dict[str, Any]
    assessment_id: Optional[str] = None

class TargetPredictionDetail(BaseModel):
    targetId: str
    probability: float
    predictedClass: int
    classLabel: str
    riskLevel: str
    confidence: float
    color: str

class PredictionResponse(BaseModel):
    assessment_id: str
    targets: Dict[str, TargetPredictionDetail]
    overallRiskCategory: str
    overallRiskLabel: str
    modelVersion: str
    disclaimer: str

class ModelInfoResponse(BaseModel):
    targets: list[str]
    features_count: int
    features_numeric: list[str]
    features_categorical: list[str]
    model_version: str
    dataset: str
    evaluation_status: str
    limitations: list[str]
