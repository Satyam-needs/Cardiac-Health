import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database.session import get_db
from backend.ml.inference import MODELS

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
        
    loaded_models = list(MODELS.keys())
    
    return {
        "status": "ok" if db_ok and len(loaded_models) == 4 else "degraded",
        "service": "Cardiac Health API",
        "database_connected": db_ok,
        "models_loaded": len(loaded_models) == 4,
        "active_models": loaded_models,
        "environment": "local_development",
        "version": "1.0.0"
    }
