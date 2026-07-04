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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Évalue chacun de ces traits de personnalité sur une échelle de 0 à 100.
        </p>

        <div className="space-y-3">
          {TRAITS.map((trait) => (
            <div key={trait}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{trait}</label>
              <input type="range" min="0" max="100" value={scores[trait] || 50}
                onChange={(e) => setTraitScore(trait, e.target.value)}
                className="w-full" />
              <span className="text-xs text-gray-400">{scores[trait] || 50}/100</span>
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!allFilled || mutation.isPending}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
          {mutation.isPending ? 'Envoi...' : 'Suivant →'}
        </button>

        {mutation.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {mutation.error?.response?.data?.message || "Erreur d'enregistrement"}
          </div>
        )}
      </div>
    </WizardContainer>
  );
}
