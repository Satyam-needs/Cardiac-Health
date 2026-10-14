import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { AssessmentProvider } from '../context/AssessmentContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OverviewPage } from '../pages/OverviewPage';
import { AssessmentPage } from '../pages/AssessmentPage';
import { PredictionDashboardPage } from '../pages/PredictionDashboardPage';
import { ExplainabilityPage } from '../pages/ExplainabilityPage';
import { ModelPerformancePage } from '../pages/ModelPerformancePage';
import { AssessmentHistoryPage } from '../pages/AssessmentHistoryPage';
import { AboutPage } from '../pages/AboutPage';

describe('Application Pages Rendering', () => {
  const renderWithRoute = (initialRoute: string) => {
    return render(
      <AuthProvider>
        <AssessmentProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="assessment" element={<AssessmentPage />} />
                <Route path="predictions" element={<PredictionDashboardPage />} />
                <Route path="explainability" element={<ExplainabilityPage />} />
                <Route path="model-performance" element={<ModelPerformancePage />} />
                <Route path="history" element={<AssessmentHistoryPage />} />
                <Route path="about" element={<AboutPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AssessmentProvider>
      </AuthProvider>
    );
  };

  it('renders Overview Page with hero headline', () => {
    renderWithRoute('/');
    expect(screen.getByText(/Understand cardiovascular risk/i)).toBeInTheDocument();
  });

  it('renders New Assessment Form', () => {
    renderWithRoute('/assessment');
    expect(screen.getByText(/New Patient Assessment/i)).toBeInTheDocument();
  });

  it('renders Prediction Dashboard', () => {
    renderWithRoute('/predictions');
    expect(screen.getByText(/Coronary Artery Disease Status/i)).toBeInTheDocument();
  });

  it('renders Explainability Page', () => {
    renderWithRoute('/explainability');
    expect(screen.getByText(/Explainable AI \(XAI\) Dashboard/i)).toBeInTheDocument();
  });

  it('renders Model Performance Page with honest status', () => {
    renderWithRoute('/model-performance');
    expect(screen.getByText(/Model Performance & Validation/i)).toBeInTheDocument();
  });

  it('renders Assessment History Page', () => {
    renderWithRoute('/history');
    expect(screen.getAllByText(/Assessment History & Case Logs/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders About & Documentation Page', () => {
    renderWithRoute('/about');
    expect(screen.getByText(/About CardioVision AI & Architecture Docs/i)).toBeInTheDocument();
  });
});
