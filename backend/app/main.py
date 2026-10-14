from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.database.session import init_db
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.predict import router as predict_router
from backend.app.api.routes.assessments import router as assessments_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CardioVision AI / Cardiac Health API: Track A Cardiovascular Risk Visualization & Multitarget ML Inference",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers (both root and /api/v1 for maximum client compatibility)
app.include_router(health_router, prefix="")
app.include_router(health_router, prefix=settings.API_V1_STR)

app.include_router(auth_router, prefix="")
app.include_router(auth_router, prefix=settings.API_V1_STR)

app.include_router(predict_router, prefix="")
app.include_router(predict_router, prefix=settings.API_V1_STR)

app.include_router(assessments_router, prefix="")
app.include_router(assessments_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "auth": f"{settings.API_V1_STR}/auth",
            "predict": f"{settings.API_V1_STR}/predict",
            "model_info": f"{settings.API_V1_STR}/model-info",
            "metrics": f"{settings.API_V1_STR}/metrics",
            "explain": f"{settings.API_V1_STR}/explain",
            "assessments": f"{settings.API_V1_STR}/assessments",
        }
    }
