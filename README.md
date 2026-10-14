# Cardiac Health — Full-Stack Cardiovascular Risk Visualization & Interactive 3D Heart Explorer

> **Tagline:** “Understand the Prediction. Explore the Heart.”  
> **Challenge:** Track A: Cardiovascular Risk Visualization & Prediction Challenge — IIT Mandi Multimodal AI Hackathon 2026.

---

## 1. Project Overview

**Cardiac Health** is a complete, production-grade full-stack clinical research prototype designed to bridge the gap between machine-learning cardiovascular risk prediction and clinical interpretability.

The platform combines:
1. **Public Landing Experience**: Overview, workflow, features, and educational disclosures.
2. **Authenticated Clinician Portal**: User registration, login, JWT session management, and server-side authorization.
3. **Machine Learning Inference Pipeline**: 4 independent binary classifiers (**CAD**, **LAD**, **LCX**, and **RCA**) trained on the official **Z-Alizadeh Sani Extension dataset (UCI Repository #411)** with strict leakage prevention.
4. **Interactive 3D Heart Explorer**: Real-time WebGL anatomical heart model with dynamic vessel highlights, view presets (Anterior, Posterior, Left Lateral, Right Lateral, Superior), user rotation/zoom, and physiological cardiac pulsation.
5. **Explainable AI (XAI)**: Local feature attribution waterfalls (SHAP marginal perturbation) and population feature rankings.
6. **Persistent Private Case Reports**: SQLite database storage isolating patient reports per clinician with ownership verification.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Refined clinical dark theme: deep slate `#070b14`, cyan/teal accents, coral heart indicators)
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Visualizations**: Recharts (Diverging Waterfall charts, Probability comparisons, ROC Curves, Confusion Matrices)
- **Icons**: Lucide React
- **Routing**: React Router v7 with protected routes (`ProtectedRoute`)
- **API Client**: Centralized, typed API client (`src/services/api.ts`)

### Backend & Machine Learning
- **API Framework**: Python 3.11+ / FastAPI
- **Data Validation & Schemas**: Pydantic v2
- **Database & ORM**: SQLite (`cardiac_health.db`) with SQLAlchemy
- **Authentication**: JWT (`python-jose`) and bcrypt (`passlib`) password hashing
- **ML Frameworks**: Scikit-Learn 1.9+, Pandas, NumPy, Joblib
- **Training Dataset**: Official Z-Alizadeh Sani Extension Dataset (UCI #411, N=303, 59 clinical features)
- **Leakage Prevention**: Catheterization outcomes and target labels strictly excluded from feature matrix
- **Validation**: Stratified 5-Fold Cross-Validation + 20% Stratified Holdout Test Split

---

## 3. Architecture & Directory Structure

```text
cardiac_health/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application bootstrap & CORS setup
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py          # /auth/register, /auth/login, /auth/me, /auth/logout
│   │   │   │   ├── health.py        # /health endpoint (models, database status)
│   │   │   │   ├── predict.py       # /predict, /model-info, /metrics, /explain
│   │   │   │   └── assessments.py   # /assessments (CRUD with account ownership checks)
│   │   │   └── dependencies/
│   │   │       └── auth.py          # JWT authentication guard
│   │   ├── core/
│   │   │   ├── config.py            # Environment settings
│   │   │   └── security.py          # Password hashing (bcrypt) & JWT token creation
│   │   ├── database/
│   │   │   ├── models.py            # User and Assessment SQLAlchemy models
│   │   │   └── session.py           # SQLite engine & session maker
│   │   └── schemas/
│   │       ├── auth.py              # Pydantic auth schemas
│   │       ├── prediction.py        # ML request/response schemas
│   │       ├── explain.py           # XAI attribution schemas
│   │       └── assessment.py        # Database assessment schemas
│   ├── data/
│   │   └── z_alizadeh_sani_extension.csv  # Verified UCI #411 dataset
│   ├── ml/
│   │   ├── train_models.py          # 5-fold CV training pipeline for CAD, LAD, LCX, RCA
│   │   ├── inference.py             # Inference engine & marginal XAI perturbation
│   │   └── artifacts/
│   │       ├── model_CAD.joblib     # Fitted pipeline for CAD
│   │       ├── model_LAD.joblib     # Fitted pipeline for LAD
│   │       ├── model_LCX.joblib     # Fitted pipeline for LCX
│   │       ├── model_RCA.joblib     # Fitted pipeline for RCA
│   │       ├── feature_schema.json  # Feature definitions & data types
│   │       └── evaluation_metrics.json # Genuine cross-validation & test metrics
│   └── tests/
│       └── test_backend.py          # Pytest backend test suite (5/5 tests passing)
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx   # Frontend route guard ensuring authenticated access
│   │   ├── cards/
│   │   │   └── PredictionTargetCard.tsx # Target cards (CAD, LAD, LCX, RCA)
│   │   ├── charts/
│   │   │   ├── TargetProbabilityBarChart.tsx
│   │   │   ├── FeatureContributionChart.tsx # SHAP waterfall chart
│   │   │   ├── ConfusionMatrixChart.tsx
│   │   │   └── RocCurveChart.tsx
│   │   ├── heart3d/
│   │   │   ├── HeartCanvas.tsx      # R3F WebGL Canvas with WebGL detection & fallback
│   │   │   ├── HeartModel.tsx       # Anatomical heart & interactive coronary vessels
│   │   │   ├── ArteryInspector.tsx  # Vessel perfusion & risk territory details
│   │   │   └── HeartFallback2D.tsx  # Accessible 2D schematic diagram
│   │   └── layout/
│   │       ├── DashboardLayout.tsx  # Navigation shell with TopNav & Sidebar
│   │       ├── Sidebar.tsx          # Navigation items & active full-stack indicators
│   │       ├── TopNav.tsx           # User profile menu, presets, and sign-in actions
│   │       └── MedicalDisclaimer.tsx# Prominent educational safety disclaimers
│   ├── context/
│   │   ├── AuthContext.tsx          # User state, JWT storage, login/logout handlers
│   │   └── AssessmentContext.tsx    # Active assessment, results, and 3D vessel selection
│   ├── pages/
│   │   ├── OverviewPage.tsx         # Public landing page with hero, workflow & features
│   │   ├── LoginPage.tsx            # Clinician sign-in form
│   │   ├── RegisterPage.tsx         # Clinician registration with password strength
│   │   ├── DashboardPage.tsx        # Authenticated dashboard (reports, model status)
│   │   ├── AssessmentPage.tsx       # Multi-step clinical assessment intake form
│   │   ├── PredictionDashboardPage.tsx # Multi-target outcome visualization
│   │   ├── HeartExplorerPage.tsx    # 3D interactive heart explorer
│   │   ├── ExplainabilityPage.tsx   # Local & global XAI feature contributions
│   │   ├── ModelPerformancePage.tsx # Genuine evaluation benchmarks (UCI #411)
│   │   ├── AssessmentHistoryPage.tsx# Persistent report logs with deletion support
│   │   ├── ReportDetailPage.tsx     # Private persistent clinical report view
│   │   └── AboutPage.tsx            # Architecture & dataset lineage documentation
│   ├── services/
│   │   └── api.ts                   # Centralized typed API client
│   └── test/                        # Vitest test suite (16/16 tests passing)
│
├── package.json
├── vite.config.ts
├── requirements.txt
└── README.md
```

---

## 4. Quickstart Guide (Local Setup)

### Prerequisites
- **Python 3.11+** installed (accessible via `python` or `py`)
- **Node.js 18+** & **npm** installed

---

### Step 1: Backend Setup & Model Training

Open a terminal in the project root directory:

```bash
# 1. Install Python dependencies
pip install -r requirements.txt
# (On Windows if 'pip' is not in PATH, use: py -m pip install -r requirements.txt)

# 2. Train and generate machine-learning model artifacts (CAD, LAD, LCX, RCA)
py backend/ml/train_models.py
```

*Expected Output: Fits 4 Scikit-Learn classification pipelines on the Z-Alizadeh Sani cohort using 5-Fold Stratified Cross-Validation, evaluates holdout metrics, and writes artifacts to `backend/ml/artifacts/`.*

---

### Step 2: Start the FastAPI Backend Server

```bash
py -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **API Root**: `http://localhost:8000/`
- **Interactive OpenAPI Documentation**: `http://localhost:8000/docs`
- **System Health Status**: `http://localhost:8000/health`

---

### Step 3: Frontend Setup & Launch

Open a second terminal in the project root directory:

```bash
# 1. Install frontend dependencies
npm install

# 2. Start the Vite development server
npm run dev
# (On Windows PowerShell if scripts are restricted, use: cmd /c "npm run dev")
```

- **Frontend Application**: `http://localhost:5173/`

---

## 5. Running the Test Suites

### Backend Tests (Pytest)
```bash
py -m pytest backend/tests/test_backend.py -v
```
Verifies:
- `GET /health` service and model readiness
- `GET /model-info` and `GET /metrics` integrity
- `POST /predict` multi-target inference schema
- `POST /explain` marginal feature perturbation attribution
- `POST /auth/register` and `POST /auth/login` authentication
- Multi-user isolation: User A cannot read or delete User B's reports (403 Forbidden)

### Frontend Tests (Vitest)
```bash
npm test
# (On Windows: cmd /c "npm test")
```
Verifies:
- Prediction math and probability bounds
- Visual indicators, disclaimers, and legend categories
- Route rendering across all public and protected pages (16/16 passing)

### Production Build Verification
```bash
npm run build
# (On Windows: cmd /c "npm run build")
```
Verifies TypeScript compilation (`tsc -b`) and asset bundling.

---

## 6. API Reference Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Service and model availability status | No |
| `POST` | `/auth/register` | Register new clinician account | No |
| `POST` | `/auth/login` | Sign in and obtain JWT access token | No |
| `GET` | `/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/predict` | Run multi-target inference (CAD, LAD, LCX, RCA) | No |
| `GET` | `/model-info` | Feature schema, training timestamp, limitations | No |
| `GET` | `/metrics` | Genuine 5-fold CV & holdout test evaluation metrics | No |
| `POST` | `/explain` | Compute local feature contribution attributions | No |
| `POST` | `/assessments` | Submit patient data, run model, and save report | Yes |
| `GET` | `/assessments` | List private assessment history for current user | Yes |
| `GET` | `/assessments/{id}` | Retrieve private report details (owner-enforced) | Yes |
| `DELETE` | `/assessments/{id}` | Permanently delete private report | Yes |

*Note: All endpoints are also available under the `/api/v1/` prefix (e.g., `/api/v1/predict`).*

---

## 7. Medical Safety & Scientific Limitations

> **CRITICAL MEDICAL DISCLAIMER:**  
> Cardiac Health is a research prototype developed for educational and decision-support exploration for the IIT Mandi Multimodal AI Hackathon 2026. **Its predictions are not a medical diagnosis and must not replace assessment by a qualified healthcare professional.**

- **Not a Diagnostic Device**: Model probabilities reflect statistical patterns learned from the training cohort; they do not represent the physical percentage of arterial luminal stenosis.
- **Anatomical Mapping**: Highlighted 3D artery territories (LAD, LCX, RCA) represent approximate anatomical perfusion distributions; tabular clinical features do not provide millimeter spatial coordinates of plaque lesions.
- **Dataset Context**: Models are trained on the Iranian Z-Alizadeh Sani cardiac catheterization cohort (N=303). External validation and clinical calibration are required prior to any clinical deployment.

---

## 8. License & Acknowledgements

- **Challenge**: IIT Mandi Multimodal AI Hackathon 2026 (Track A: Cardiovascular Risk Visualization & Prediction)
- **Dataset**: Z-Alizadeh Sani Extension Dataset, UCI Machine Learning Repository (ID: 411)
- Built with React 19, TypeScript, Vite, Tailwind CSS v4, Three.js, React Three Fiber, FastAPI, and Scikit-Learn.
