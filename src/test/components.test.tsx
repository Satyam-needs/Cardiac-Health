import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoBanner } from '../components/layout/DemoBanner';
import { MedicalDisclaimer } from '../components/layout/MedicalDisclaimer';
import { ArteryLegend } from '../components/heart3d/ArteryLegend';

describe('Safety & Demo Indicator Components', () => {
  it('DemoBanner displays visible FASTAPI ML BACKEND ACTIVE label', () => {
    render(<DemoBanner />);
    expect(screen.getByText(/FASTAPI ML BACKEND ACTIVE/i)).toBeInTheDocument();
  });

  it('MedicalDisclaimer contains mandatory educational text', () => {
    render(<MedicalDisclaimer compact={false} />);
    expect(
      screen.getByText(/CardioVision AI is a frontend research and educational prototype/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The displayed prediction values and explanations are simulated examples/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not outputs from a trained clinical model/i)
    ).toBeInTheDocument();
  });

  it('ArteryLegend states that colors are UI display categories only', () => {
    render(<ArteryLegend />);
    expect(screen.getByText(/UI Categories Only/i)).toBeInTheDocument();
    expect(screen.getByText(/Colors are interface visualization bins for demonstration only/i)).toBeInTheDocument();
  });
});
