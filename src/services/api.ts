/**
 * Centralized Typed API Client for Cardiac Health Full-Stack Platform
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TargetPrediction {
  targetId: string;
  probability: number;
  predictedClass: number;
  classLabel: string;
  riskLevel: 'high' | 'moderate' | 'low';
  confidence: number;
  color: string;
}

export interface PredictionResult {
  assessment_id: string;
  targets: Record<string, TargetPrediction>;
  overallRiskCategory: 'high' | 'moderate' | 'low';
  overallRiskLabel: string;
  modelVersion: string;
  disclaimer: string;
}

export interface FeatureContribution {
  feature: string;
  patientValue: string;
  contribution: number;
  direction: 'increases_risk' | 'decreases_risk';
  clinicalDescription: string;
}

export interface ExplainResponse {
  target: string;
  baseProbability: number;
  patientProbability: number;
  contributions: FeatureContribution[];
  method: string;
  caveat: string;
}

export interface AssessmentRecord {
  id: string;
  user_id: number;
  patient_alias: string;
  input_data: Record<string, any>;
  prediction_result: PredictionResult;
  model_version: string;
  created_at: string;
}

export interface AssessmentSummary {
  id: string;
  patient_alias: string;
  created_at: string;
  overall_risk_category: 'high' | 'moderate' | 'low';
  overall_risk_label: string;
  cad_probability: number;
  lad_probability: number;
  lcx_probability: number;
  rca_probability: number;
}

// Token storage helpers
const TOKEN_KEY = 'cardiac_health_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string, remember: boolean = true): void => {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // If unauthorized, clear invalid token
    removeStoredToken();
  }

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    register: (fullName: string, email: string, password: string): Promise<AuthResponse> =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ full_name: fullName, email, password }),
      }),
    login: (email: string, password: string): Promise<AuthResponse> =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: (): Promise<{ message: string }> =>
      request<{ message: string }>('/auth/logout', { method: 'POST' }),
    getMe: (): Promise<User> => request<User>('/auth/me'),
  },

  // Health
  health: {
    check: (): Promise<any> => request<any>('/health'),
  },

  // Model & Predictions
  predictions: {
    predict: (patientData: Record<string, any>, assessmentId?: string): Promise<PredictionResult> =>
      request<PredictionResult>('/predict', {
        method: 'POST',
        body: JSON.stringify({ patient_data: patientData, assessment_id: assessmentId }),
      }),
    getModelInfo: (): Promise<any> => request<any>('/model-info'),
    getMetrics: (): Promise<any> => request<any>('/metrics'),
    explain: (target: string, patientData: Record<string, any>): Promise<ExplainResponse> =>
      request<ExplainResponse>('/explain', {
        method: 'POST',
        body: JSON.stringify({ target, patient_data: patientData }),
      }),
  },

  // Assessments & Private Reports
  assessments: {
    create: (patientAlias: string, inputData: Record<string, any>): Promise<AssessmentRecord> =>
      request<AssessmentRecord>('/assessments', {
        method: 'POST',
        body: JSON.stringify({ patient_alias: patientAlias, input_data: inputData }),
      }),
    list: (): Promise<AssessmentSummary[]> => request<AssessmentSummary[]>('/assessments'),
    get: (id: string): Promise<AssessmentRecord> => request<AssessmentRecord>(`/assessments/${id}`),
    delete: (id: string): Promise<{ message: string }> =>
      request<{ message: string }>(`/assessments/${id}`, { method: 'DELETE' }),
  },
};
