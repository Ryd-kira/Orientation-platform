import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

const suggestions = [
  'Intelligence artificielle',
  'Data science',
  'Design produit',
  'Gestion de projet',
  'UX / UI',
  'Business analytics',
];

export default function InterestsStep() {
  const navigate = useNavigate();
  const { completeStep, stepData } = useWizardProgress();
  const initialInterests = stepData[3]?.interests || [];
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState(initialInterests);

  const addInterest = () => {
    const value = interestInput.trim();
    if (!value || interests.includes(value)) {
      setInterestInput('');
      return;
    }
    setInterests((prev) => [...prev, value]);
    setInterestInput('');
  };

  const removeInterest = (value) => {
    setInterests((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    completeStep(3, { interests });
    navigate('/wizard/metier-reve');
  };

  return (
    <WizardContainer>
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-8">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Saisissez les domaines que vous souhaitez explorer. Ces centres d’intérêt aideront l’IA à vous proposer des métiers et des formations adaptés.</p>
          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Centres d’intérêt</p>
            <p className="mt-3 text-sm text-slate-700">Plus vos centres d’intérêt sont précis, plus les recommandations seront pertinentes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-medium text-slate-600">
              Ajouter un intérêt
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Ex: Intelligence artificielle"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <button
              type="button"
              onClick={addInterest}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500"
            >
              Ajouter
            </button>
          </div>

          {interests.length > 0 && (
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-900">Intérêts sélectionnés</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {interests.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => removeInterest(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    {item}
                    <span className="text-slate-400">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-950">Suggestions rapides</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setInterestInput(tag);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/wizard/scolaire')}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Précédent
            </button>
            <button
              type="submit"
              className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500"
            >
              Suivant →
            </button>
          </div>
        </form>
      </div>
    </WizardContainer>
  );
}
