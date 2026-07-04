import { useWizardProgress } from '../../hooks/useWizardProgress';
import { WIZARD_STEPS } from '../../types';

export default function WizardContainer({ children, onComplete }) {
  const { currentStep, completedSteps, progressPercent, currentStepMeta } = useWizardProgress();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStepMeta.label}
          </h1>
          <span className="text-sm text-gray-500">
            Étape {currentStep}/{WIZARD_STEPS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {WIZARD_STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                completedSteps.includes(s.step)
                  ? 'bg-indigo-600 text-white'
                  : s.step === currentStep
                  ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {completedSteps.includes(s.step) ? '✓' : s.step}
              </div>
              <span className="text-xs text-gray-400 mt-1 hidden md:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
