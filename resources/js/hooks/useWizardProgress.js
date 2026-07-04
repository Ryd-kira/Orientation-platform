import { useState, useCallback, useEffect } from 'react';
import { WIZARD_STEPS, WIZARD_STORAGE_KEY } from '../types';

export function useWizardProgress() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currentStep || 1;
      } catch { return 1; }
    }
    return 1;
  });

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.completedSteps || [];
      } catch { return []; }
    }
    return [];
  });

  const [stepData, setStepData] = useState(() => {
    const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.stepData || {};
      } catch { return {}; }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({
      currentStep,
      completedSteps,
      stepData,
    }));
  }, [currentStep, completedSteps, stepData]);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const completeStep = useCallback((step, data) => {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step]);
    setStepData(prev => ({ ...prev, [step]: data }));
    if (step < WIZARD_STEPS.length) {
      setCurrentStep(step + 1);
    }
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setStepData({});
    localStorage.removeItem(WIZARD_STORAGE_KEY);
  }, []);

  const totalSteps = WIZARD_STEPS.length;
  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100);
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    completedSteps,
    stepData,
    goToStep,
    completeStep,
    resetProgress,
    totalSteps,
    progressPercent,
    isLastStep,
    currentStepMeta: WIZARD_STEPS[currentStep - 1],
  };
}
