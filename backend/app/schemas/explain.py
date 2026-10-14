from typing import List, Dict, Any
from pydantic import BaseModel

class FeatureContribution(BaseModel):
    feature: str
    patientValue: str
    contribution: float
    direction: str
    clinicalDescription: str

class ExplainRequest(BaseModel):
    target: str = "CAD"
    patient_data: Dict[str, Any]

class ExplainResponse(BaseModel):
    target: str
    baseProbability: float
    patientProbability: float
    contributions: List[FeatureContribution]
    method: str
    caveat: str
