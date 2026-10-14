import json
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.database.models import User, Assessment
from backend.app.schemas.assessment import AssessmentCreate, AssessmentResponse, AssessmentSummary
from backend.app.api.dependencies.auth import get_current_user
from backend.ml.inference import predict_patient

router = APIRouter(prefix="/assessments", tags=["Assessments & Reports"])

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment_in: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Run genuine ML inference
    prediction_output = predict_patient(assessment_in.input_data)
    
    assessment_id = f"ASM-{uuid.uuid4().hex[:8].upper()}"
    patient_alias = assessment_in.patient_alias.strip() if assessment_in.patient_alias else "Anonymous Assessment"
    
    new_assessment = Assessment(
        id=assessment_id,
        user_id=current_user.id,
        patient_alias=patient_alias,
        input_data=json.dumps(assessment_in.input_data),
        prediction_result=json.dumps(prediction_output),
        model_version=prediction_output.get("modelVersion", "scikit-learn-1.9.1"),
    )
    
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    
    return {
        "id": new_assessment.id,
        "user_id": new_assessment.user_id,
        "patient_alias": new_assessment.patient_alias,
        "input_data": json.loads(new_assessment.input_data),
        "prediction_result": json.loads(new_assessment.prediction_result),
        "model_version": new_assessment.model_version,
        "created_at": new_assessment.created_at,
    }

@router.get("", response_model=List[AssessmentSummary])
def list_user_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # STRICT ACCESS CONTROL: Only retrieve assessments belonging to authenticated user
    records = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .all()
    )
    
    summaries = []
    for r in records:
        try:
            preds = json.loads(r.prediction_result)
            targets = preds.get("targets", {})
            summaries.append({
                "id": r.id,
                "patient_alias": r.patient_alias,
                "created_at": r.created_at,
                "overall_risk_category": preds.get("overallRiskCategory", "low"),
                "overall_risk_label": preds.get("overallRiskLabel", "Low Risk"),
                "cad_probability": targets.get("CAD", {}).get("probability", 0.0),
                "lad_probability": targets.get("LAD", {}).get("probability", 0.0),
                "lcx_probability": targets.get("LCX", {}).get("probability", 0.0),
                "rca_probability": targets.get("RCA", {}).get("probability", 0.0),
            })
        except Exception:
            continue
            
    return summaries

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment_report(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment report '{assessment_id}' was not found.",
        )
        
    # STRICT AUTHORIZATION: Reject cross-account access
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to view this clinical report.",
        )
        
    return {
        "id": assessment.id,
        "user_id": assessment.user_id,
        "patient_alias": assessment.patient_alias,
        "input_data": json.loads(assessment.input_data),
        "prediction_result": json.loads(assessment.prediction_result),
        "model_version": assessment.model_version,
        "created_at": assessment.created_at,
    }

@router.delete("/{assessment_id}", status_code=status.HTTP_200_OK)
def delete_assessment_report(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment report '{assessment_id}' was not found.",
        )
        
    # STRICT AUTHORIZATION: Reject cross-account deletion
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to delete this clinical report.",
        )
        
    db.delete(assessment)
    db.commit()
    return {"message": f"Assessment '{assessment_id}' was successfully deleted.", "id": assessment_id}
