import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { dreamJobSchema } from '../../lib/validators';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';
import { useState } from 'react';

export default function DreamJobStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();
  const [result, setResult] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(dreamJobSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => client.post('/dream-job/analyze', data).then(r => r.data),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  const handleNext = () => {
    completeStep(4, result);
    navigate('/wizard/personnalite');
  };

  return (
    <WizardContainer>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Décris le métier de tes rêves. Notre IA l'analysera pour évaluer sa compatibilité avec ton profil.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Métier rêvé</label>
            <input type="text" {...register('job_title')} placeholder="Ex: Développeur Web"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            {errors.job_title && <p className="text-red-500 text-xs mt-1">{errors.job_title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (pourquoi ce métier ?)</label>
            <textarea {...register('job_description')} rows={4} placeholder="Explique ce qui t'attire dans ce métier..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <button type="submit" disabled={mutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
            {mutation.isPending ? 'Analyse...' : 'Analyser'}
          </button>
        </form>

        {mutation.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {mutation.error?.response?.data?.message || "Erreur d'analyse"}
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="font-medium text-green-800 dark:text-green-300">
              Score de compatibilité : {result.compatibility_score}%
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              {result.nlp_analysis?.summary || 'Analyse terminée.'}
            </p>
            <button onClick={handleNext}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Suivant →
            </button>
          </div>
        )}
      </div>
    </WizardContainer>
  );
}
