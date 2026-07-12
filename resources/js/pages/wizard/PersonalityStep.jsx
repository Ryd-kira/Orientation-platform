import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

const TRAITS = [
  'Ouverture', 'Conscienciosité', 'Extraversion', 'Agréabilité', 'Neurotisme',
  'Créativité', 'Rigueur', 'Sociabilité', 'Empathie', 'Adaptabilité',
];

export default function PersonalityStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();
  const [scores, setScores] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => client.post('/personality-tests/start').then(r =>
      client.post(`/personality-tests/${r.data.id}/answers`, { traits: data.traits }).then(r2 => r2.data)
    ),
    onSuccess: (data) => {
      completeStep(5, data);
      navigate('/wizard/aptitudes');
    },
  });

  const setTraitScore = (name, score) => {
    setScores(prev => ({ ...prev, [name]: score }));
  };

  const handleSubmit = () => {
    const traits = Object.entries(scores).map(([trait_name, score]) => ({
      trait_name, score: Number(score), details: {},
    }));
    mutation.mutate({ traits });
  };

  const allFilled = TRAITS.every(t => scores[t]);

  return (
    <WizardContainer>
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Évalue chaque trait sur une échelle de 0 à 100 pour affiner la compréhension de votre personnalité.
          </p>
          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Traits de personnalité</p>
            <p className="mt-2 text-sm text-slate-500">Plus vos réponses sont précises, plus le matching métier est pertinent.</p>
          </div>
        </div>

        <div className="space-y-4">
          {TRAITS.map((trait) => (
            <div key={trait} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-700">{trait}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{scores[trait] || 50}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores[trait] || 50}
                onChange={(e) => setTraitScore(trait, e.target.value)}
                className="mt-4 w-full accent-cyan-600"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!allFilled || mutation.isPending}
          className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-50">
          {mutation.isPending ? 'Envoi...' : 'Suivant →'}
        </button>

        {mutation.isError && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {mutation.error?.response?.data?.message || "Erreur d'enregistrement"}
          </div>
        )}
      </div>
    </WizardContainer>
  );
}
