import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { profileSchema } from '../../lib/validators';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

export default function ProfileStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { completeStep, stepData } = useWizardProgress();

  const { data: existingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then(r => r.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: existingProfile || stepData[1] || {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (existingProfile?.id) {
        return client.put('/profile', data).then(r => r.data);
      }
      return client.post('/profile', data).then(r => r.data);
    },
    onSuccess: (data) => {
      completeStep(1, data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/wizard/scolaire');
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <WizardContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Âge</label>
            <input type="number" {...register('age', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
            <select {...register('gender')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
            <input type="text" {...register('city')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Région</label>
            <input type="text" {...register('region')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
            <input type="text" {...register('country')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget études (€)</label>
            <input type="number" {...register('budget', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Métier cible</label>
          <input type="text" {...register('target_job_title')} placeholder="Ex: Développeur Web"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description du métier visé</label>
          <textarea {...register('target_job_description')} rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Présentation</label>
          <textarea {...register('bio')} rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>

        {mutation.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {mutation.error?.response?.data?.message || "Erreur lors de l'enregistrement"}
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting || mutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
            {mutation.isPending ? 'Enregistrement...' : 'Suivant →'}
          </button>
        </div>
      </form>
    </WizardContainer>
  );
}
