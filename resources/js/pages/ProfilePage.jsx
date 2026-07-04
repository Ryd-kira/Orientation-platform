import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../api/client';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => client.get('/me').then(r => r.data),
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then(r => r.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: user?.profile || {},
  });

  const updateMutation = useMutation({
    mutationFn: (data) => client.put('/profile', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mon profil</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations personnelles</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-500">Nom :</span> {user?.name}</p>
          <p><span className="text-gray-500">Email :</span> {user?.email}</p>
          <p><span className="text-gray-500">Compte :</span> {subscription?.is_premium ? 'Premium' : 'Gratuit'}</p>
          {subscription?.expires_at && (
            <p><span className="text-gray-500">Expire le :</span> {new Date(subscription.expires_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modifier mon profil</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Âge</label>
              <input type="number" {...register('age', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget (€)</label>
              <input type="number" {...register('budget', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Métier cible</label>
            <input type="text" {...register('target_job_title')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <button type="submit" disabled={isSubmitting || updateMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {updateMutation.isSuccess && (
            <p className="text-green-600 text-sm">Profil mis à jour.</p>
          )}
        </form>
      </div>
    </div>
  );
}
