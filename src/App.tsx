import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AssessmentProvider } from './context/AssessmentContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { PredictionDashboardPage } from './pages/PredictionDashboardPage';
import { HeartExplorerPage } from './pages/HeartExplorerPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AssessmentHistoryPage } from './pages/AssessmentHistoryPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Layout Pages */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="overview" element={<Navigate to="/" replace />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="assessment"
                element={
                  <ProtectedRoute>
                    <AssessmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="history"
                element={
                  <ProtectedRoute>
                    <AssessmentHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports/:id"
                element={
                  <ProtectedRoute>
                    <ReportDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="predictions" element={<PredictionDashboardPage />} />
              <Route path="heart-3d" element={<HeartExplorerPage />} />
              <Route path="explainability" element={<ExplainabilityPage />} />
              <Route path="model-performance" element={<ModelPerformancePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AssessmentProvider>
    </AuthProvider>
  );
};

export default App;
