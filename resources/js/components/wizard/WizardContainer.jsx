import { useWizardProgress } from '../../hooks/useWizardProgress';
import { WIZARD_STEPS } from '../../types';

export default function WizardContainer({ children, onComplete }) {
  const { currentStep, completedSteps, progressPercent, currentStepMeta } = useWizardProgress();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-950">{currentStepMeta.label}</h1>
          <span className="text-sm text-slate-500">Étape {currentStep}/{WIZARD_STEPS.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {WIZARD_STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                completedSteps.includes(s.step)
                  ? 'bg-cyan-600 text-white'
                  : s.step === currentStep
                  ? 'bg-cyan-100 text-cyan-600 border-2 border-cyan-600'
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {completedSteps.includes(s.step) ? '✓' : s.step}
              </div>
              <span className="text-xs text-slate-400 mt-1 hidden md:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
