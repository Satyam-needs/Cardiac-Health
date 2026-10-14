import { describe, it, expect } from 'vitest';
import { runDemoPrediction, generateDemoExplanations } from '../services/demoPrediction';
import { DEMO_PRESETS } from '../services/demoPresets';

describe('Deterministic Demonstration Prediction Service', () => {
  it('should return strictly typed demo results with source="demo" and demoMode=true', () => {
    const result = runDemoPrediction(DEMO_PRESETS[0]);
    expect(result.source).toBe('demo');
    expect(result.demoMode).toBe(true);
    expect(result.disclaimer).toContain('CardioVision AI is a frontend research and educational prototype');
  });

  it('should include all 4 targets: CAD, LAD, LCX, and RCA', () => {
    const result = runDemoPrediction(DEMO_PRESETS[0]);
    expect(result.targets.CAD).toBeDefined();
    expect(result.targets.LAD).toBeDefined();
    expect(result.targets.LCX).toBeDefined();
    expect(result.targets.RCA).toBeDefined();
  });

  it('should return probabilities bounded between 0 and 1', () => {
    const result = runDemoPrediction(DEMO_PRESETS[0]);
    Object.values(result.targets).forEach((target) => {
      expect(target.simulatedProbability).toBeGreaterThanOrEqual(0);
      expect(target.simulatedProbability).toBeLessThanOrEqual(1);
    });
  });

  it('should be deterministic: same input generates identical output', () => {
    const run1 = runDemoPrediction(DEMO_PRESETS[0]);
    const run2 = runDemoPrediction(DEMO_PRESETS[0]);
    expect(run1.targets.CAD.simulatedProbability).toBe(run2.targets.CAD.simulatedProbability);
    expect(run1.targets.LAD.simulatedProbability).toBe(run2.targets.LAD.simulatedProbability);
  });

  it('Patient Alpha (High Risk profile) should have higher CAD risk than Patient Gamma (Low Risk)', () => {
    const alphaResult = runDemoPrediction(DEMO_PRESETS[0]);
    const gammaResult = runDemoPrediction(DEMO_PRESETS[2]);
    expect(alphaResult.targets.CAD.simulatedProbability).toBeGreaterThan(
      gammaResult.targets.CAD.simulatedProbability
    );
  });

  it('should generate illustrative explanations with strict demo source', () => {
    const result = runDemoPrediction(DEMO_PRESETS[0]);
    const xai = generateDemoExplanations(DEMO_PRESETS[0], result);
    expect(xai.source).toBe('illustrative_demo');
    expect(xai.globalImportance.length).toBeGreaterThan(0);
    expect(xai.targetExplanations.CAD.localContributions.length).toBeGreaterThan(0);
  });
});
