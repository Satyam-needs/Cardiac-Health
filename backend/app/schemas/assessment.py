from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class AssessmentCreate(BaseModel):
    patient_alias: Optional[str] = "Anonymous Assessment"
    input_data: Dict[str, Any]

class AssessmentResponse(BaseModel):
    id: str
    user_id: int
    patient_alias: str
    input_data: Dict[str, Any]
    prediction_result: Dict[str, Any]
    model_version: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AssessmentSummary(BaseModel):
    id: str
    patient_alias: str
    created_at: datetime
    overall_risk_category: str
    overall_risk_label: str
    cad_probability: float
    lad_probability: float
    lcx_probability: float
    rca_probability: float
