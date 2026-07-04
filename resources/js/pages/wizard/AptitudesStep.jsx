import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

export default function AptitudesStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();

  const { data: latestTest, isLoading } = useQuery({
    queryKey: ['qi-test', 'latest'],
    queryFn: () => client.get('/qi-tests/latest').then(r => r.data),
    retry: false,
  });

  const startMutation = useMutation({
    mutationFn: () => client.post('/qi-tests/start').then(r => r.data),
    onSuccess: (data) => {
      completeStep(6, data);
      navigate('/wizard/marche');
    },
  });

  if (latestTest?.status === 'completed') {
    completeStep(6, latestTest);
    return (
      <WizardContainer>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-green-600 font-medium">Test de QI déjà complété. Score : {latestTest.iq_score}</p>
          <button onClick={() => navigate('/wizard/marche')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">
            Suivant →
          </button>
        </div>
      </WizardContainer>
    );
  }

  return (
    <WizardContainer>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Test d'aptitudes (QI) — 4 sous-sections : matrices logiques, séries numériques, analogies verbales, rotation spatiale.
        </p>
        <button onClick={() => startMutation.mutate()} disabled={startMutation.isPending}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
          {startMutation.isPending ? 'Démarrage...' : 'Démarrer le test'}
        </button>
        <button onClick={() => { completeStep(6, { skipped: true }); navigate('/wizard/marche'); }}
          className="text-sm text-gray-400 hover:text-gray-600">
          Passer cette étape
        </button>
      </div>
    </WizardContainer>
  );
}
